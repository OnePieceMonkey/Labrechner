import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { createClient as createAdminClient } from '@supabase/supabase-js';
import { Resend } from 'resend';
import { render } from '@react-email/components';
import { InvoiceEmail } from '@/components/email/InvoiceEmail';
import { generateDTVZXml } from '@/lib/xml/generateDTVZ';
import type { Invoice, InvoiceItem, UserSettings } from '@/types/database';
import { Buffer } from 'buffer';

export async function POST(req: Request) {
  try {
    const { invoiceId, to } = await req.json();
    if (!invoiceId || !to) {
      return NextResponse.json({ error: 'invoiceId or to missing' }, { status: 400 });
    }

    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    // Hole Rechnungsinformationen (erweitert fuer XML)
    const { data: invoice, error: invoiceError } = await (supabase as any)
      .from('invoices')
      .select('*')
      .eq('id', invoiceId)
      .eq('user_id', user.id)
      .single() as { data: Invoice | null; error: any };

    if (invoiceError || !invoice) {
      return NextResponse.json({ error: 'Invoice not found' }, { status: 404 });
    }

    // Hole Laborinformationen (erweitert fuer XML)
    const { data: userSettings, error: settingsError } = await (supabase as any)
      .from('user_settings')
      .select('*')
      .eq('user_id', user.id)
      .single() as { data: UserSettings | null; error: any };

    if (settingsError) {
      return NextResponse.json({ error: 'User settings not found' }, { status: 404 });
    }

    // Extrahiere Kundenname aus client_snapshot
    let recipientName = '';
    if (invoice.client_snapshot) {
      const snapshot = invoice.client_snapshot as any;
      if (snapshot.title && snapshot.last_name) {
        recipientName = `${snapshot.title} ${snapshot.last_name}`;
      } else if (snapshot.first_name && snapshot.last_name) {
        recipientName = `${snapshot.first_name} ${snapshot.last_name}`;
      } else if (snapshot.last_name) {
        recipientName = snapshot.last_name;
      }
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
    const admin = supabaseUrl && serviceKey ? createAdminClient(supabaseUrl, serviceKey) : null;
    const linkClient = admin ?? (supabase as any);

    // Erstelle Share-Link (mit Fallback falls link_type Spalte fehlt)
    let link: { token: string } | null = null;
    let linkError: any = null;

    // Versuche zuerst mit link_type
    const insertResult = await linkClient
      .from('shared_links')
      .insert({ invoice_id: invoiceId, link_type: 'pdf' })
      .select('token')
      .single();

    link = insertResult.data;
    linkError = insertResult.error;

    // Fallback: Falls link_type Spalte fehlt
    if (linkError && linkError.message?.toLowerCase().includes('link_type')) {
      console.warn('link_type column missing, retrying without it');
      const retryResult = await linkClient
        .from('shared_links')
        .insert({ invoice_id: invoiceId })
        .select('token')
        .single();
      link = retryResult.data;
      linkError = retryResult.error;
    }

    if (linkError || !link?.token) {
      console.error('Share link creation failed:', linkError);
      return NextResponse.json({ error: linkError?.message || 'Failed to create share link' }, { status: 500 });
    }

    const appUrl = (process.env.NEXT_PUBLIC_APP_URL || '').replace(/\/$/, '');
    const vercelUrl = process.env.VERCEL_URL;
    const vercelBase = vercelUrl ? `https://${vercelUrl}` : '';
    const origin = req.headers.get('origin');
    const forwardedHost = req.headers.get('x-forwarded-host') || req.headers.get('host');
    const forwardedProto = req.headers.get('x-forwarded-proto') || 'https';
    const baseUrl = origin
      || (forwardedHost ? `${forwardedProto}://${forwardedHost}` : '')
      || vercelBase
      || appUrl;
    if (!baseUrl) {
      return NextResponse.json({ error: 'Base URL not configured' }, { status: 500 });
    }

    const shareUrl = `${baseUrl}/share/${link.token}`;

    // XML-Generierung wenn aktiviert (fallback: user_settings.xml_export_default)
    let xmlShareUrl: string | undefined = undefined;
    const existingXmlUrl = (invoice as any).xml_url as string | null;
    const shouldGenerateXml = Boolean(
      (invoice as any).generate_xml ||
      (userSettings as any)?.xml_export_default ||
      existingXmlUrl
    );

    const buildXmlShareUrl = async (fallbackUrl: string) => {
      let xmlLink: { token: string } | null = null;
      const xmlInsertResult = await linkClient
        .from('shared_links')
        .insert({ invoice_id: invoiceId, link_type: 'xml' })
        .select('token')
        .single();

      xmlLink = xmlInsertResult.data;

      if (xmlInsertResult.error && xmlInsertResult.error.message?.toLowerCase().includes('link_type')) {
        return fallbackUrl;
      }

      if (xmlLink?.token) {
        return `${baseUrl}/share/${xmlLink.token}`;
      }

      return fallbackUrl;
    };

    if (shouldGenerateXml && existingXmlUrl) {
      xmlShareUrl = await buildXmlShareUrl(existingXmlUrl);
    } else if (shouldGenerateXml) {
      // Hole Rechnungspositionen fuer XML
      const { data: items } = await (supabase as any)
        .from('invoice_items')
        .select('*')
        .eq('invoice_id', invoiceId)
        .order('sort_order', { ascending: true }) as { data: InvoiceItem[] | null };

      if (items && userSettings) {
        try {
          // Generiere XML
          const { xml, filename } = generateDTVZXml({
            invoice,
            items,
            labSettings: userSettings,
          });

          // Upload nach Supabase Storage (Buffer fuer Node-Umgebung)
          const xmlBlob = Buffer.from(xml, 'utf-8');
          const storagePath = `invoices/${invoiceId}/${filename}`;

          const { error: uploadError } = await linkClient.storage
            .from('invoices')
            .upload(storagePath, xmlBlob, {
              contentType: 'application/xml',
              upsert: true,
            });

          if (!uploadError) {
            // Hole Public URL
            const { data: urlData } = linkClient.storage
              .from('invoices')
              .getPublicUrl(storagePath);

            // Update Invoice mit XML-URL (ignore if columns missing)
            try {
              await (supabase as any)
                .from('invoices')
                .update({
                  xml_url: urlData.publicUrl,
                  xml_generated_at: new Date().toISOString(),
                })
                .eq('id', invoiceId);
            } catch (updateErr) {
              console.warn('XML invoice update failed:', updateErr);
            }

            xmlShareUrl = await buildXmlShareUrl(urlData.publicUrl);
          }
        } catch (xmlError) {
          console.error('XML generation failed:', xmlError);
          // Fahre ohne XML fort
        }
      }
    }

    const resendKey = process.env.RESEND_API_KEY;
    const fromEmail = process.env.LABRECHNER_EMAIL_FROM;

    if (!resendKey || !fromEmail) {
      return NextResponse.json({ error: 'Email provider not configured' }, { status: 501 });
    }

    // Initialisiere Resend
    const resend = new Resend(resendKey);

    // Rendere Email-Template
    const emailHtml = await render(
      InvoiceEmail({
        invoiceNumber: invoice.invoice_number,
        recipientName,
        labName: userSettings?.lab_name || 'Ihr Labor',
        invoiceDate: invoice.invoice_date,
        total: invoice.total,
        shareUrl,
        dueDate: invoice.due_date || undefined,
        xmlShareUrl,
      })
    );

    // Sende Email
    const { data: emailData, error: emailError } = await resend.emails.send({
      from: fromEmail,
      to: [to],
      subject: `Rechnung ${invoice.invoice_number} von ${userSettings?.lab_name || 'Labrechner'}`,
      html: emailHtml,
    });

    if (emailError) {
      return NextResponse.json({ error: emailError.message || 'Email send failed' }, { status: 502 });
    }

    return NextResponse.json({ ok: true, shareUrl, xmlShareUrl, emailId: emailData?.id });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
