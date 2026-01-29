import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { createClient as createAdminClient } from '@supabase/supabase-js';
import { Resend } from 'resend';
import { render } from '@react-email/components';
import { InvoiceEmail } from '@/components/email/InvoiceEmail';

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

    // Hole Rechnungsinformationen
    const { data: invoice, error: invoiceError } = await (supabase as any)
      .from('invoices')
      .select('invoice_number, invoice_date, total, due_date, client_id, client_snapshot')
      .eq('id', invoiceId)
      .eq('user_id', user.id)
      .single();

    if (invoiceError || !invoice) {
      return NextResponse.json({ error: 'Invoice not found' }, { status: 404 });
    }

    // Hole Laborinformationen
    const { data: userSettings, error: settingsError } = await (supabase as any)
      .from('user_settings')
      .select('lab_name')
      .eq('user_id', user.id)
      .single();

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

    // Erstelle Share-Link
    const { data: link, error: linkError } = await linkClient
      .from('shared_links')
      .insert({ invoice_id: invoiceId })
      .select('token')
      .single();

    if (linkError || !link?.token) {
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
        labName: userSettings.lab_name || 'Ihr Labor',
        invoiceDate: invoice.invoice_date,
        total: invoice.total,
        shareUrl,
        dueDate: invoice.due_date || undefined,
      })
    );

    // Sende Email
    const { data: emailData, error: emailError } = await resend.emails.send({
      from: fromEmail,
      to: [to],
      subject: `Rechnung ${invoice.invoice_number} von ${userSettings.lab_name || 'Labrechner'}`,
      html: emailHtml,
    });

    if (emailError) {
      return NextResponse.json({ error: emailError.message || 'Email send failed' }, { status: 502 });
    }

    return NextResponse.json({ ok: true, shareUrl, emailId: emailData?.id });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
