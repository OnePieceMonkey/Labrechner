import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { createClient as createAdminClient } from '@supabase/supabase-js';
import { generateDTVZXml } from '@/lib/xml/generateDTVZ';
import { Buffer } from 'buffer';
import type { Invoice, InvoiceItem, UserSettings } from '@/types/database';

export async function POST(req: Request) {
  try {
    const { invoiceId } = await req.json();
    if (!invoiceId) {
      return NextResponse.json({ error: 'invoiceId missing' }, { status: 400 });
    }

    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    // Hole Rechnungsinformationen
    const { data: invoice, error: invoiceError } = await (supabase as any)
      .from('invoices')
      .select('*')
      .eq('id', invoiceId)
      .eq('user_id', user.id)
      .single() as { data: Invoice | null; error: any };

    if (invoiceError || !invoice) {
      return NextResponse.json({ error: 'Invoice not found' }, { status: 404 });
    }

    // Hole Rechnungspositionen
    const { data: items, error: itemsError } = await (supabase as any)
      .from('invoice_items')
      .select('*')
      .eq('invoice_id', invoiceId)
      .order('sort_order', { ascending: true }) as { data: InvoiceItem[] | null; error: any };

    if (itemsError) {
      return NextResponse.json({ error: 'Invoice items not found' }, { status: 404 });
    }

    // Hole Labor-Einstellungen
    const { data: settings, error: settingsError } = await (supabase as any)
      .from('user_settings')
      .select('*')
      .eq('user_id', user.id)
      .single() as { data: UserSettings | null; error: any };

    if (settingsError || !settings) {
      return NextResponse.json({ error: 'User settings not found' }, { status: 404 });
    }

    // Pruefe ob IK-Nummer vorhanden (empfohlen fuer valide XML)
    if (!settings.ik_nummer) {
      console.warn('IK-Nummer fehlt - XML wird mit leerer Labornummer generiert');
    }

    // Generiere XML
    const { xml, auftragsnummer, filename } = generateDTVZXml({
      invoice,
      items: items || [],
      labSettings: settings,
    });

    // Upload nach Supabase Storage
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
    const admin = supabaseUrl && serviceKey ? createAdminClient(supabaseUrl, serviceKey) : null;
    const storageClient = admin ?? supabase;

    const xmlBlob = Buffer.from(xml, 'utf-8');
    const storagePath = `invoices/${invoiceId}/${filename}`;

    const ensureInvoicesBucket = async () => {
      try {
        const { error: bucketError } = await storageClient.storage.getBucket('invoices');
        if (bucketError) {
          await storageClient.storage.createBucket('invoices', { public: true });
        }
      } catch (bucketErr) {
        console.warn('Bucket check/create failed:', bucketErr);
      }
    };

    await ensureInvoicesBucket();
    let { error: uploadError } = await storageClient.storage
      .from('invoices')
      .upload(storagePath, xmlBlob, {
        contentType: 'application/xml',
        upsert: true,
      });

    if (uploadError) {
      await ensureInvoicesBucket();
      const retry = await storageClient.storage
        .from('invoices')
        .upload(storagePath, xmlBlob, {
          contentType: 'application/xml',
          upsert: true,
        });
      uploadError = retry.error;
    }

    if (uploadError) {
      console.error('XML Upload Error:', uploadError);
      return NextResponse.json({ error: 'Failed to upload XML' }, { status: 500 });
    }

    // Hole Public URL
    const { data: urlData } = storageClient.storage
      .from('invoices')
      .getPublicUrl(storagePath);

    // Update Invoice mit XML-URL
    const { error: updateError } = await (supabase as any)
      .from('invoices')
      .update({
        xml_url: urlData.publicUrl,
        xml_generated_at: new Date().toISOString(),
      })
      .eq('id', invoiceId);

    if (updateError) {
      console.error('Invoice Update Error:', updateError);
    }

    // Erstelle Share-Link fuer XML
    const linkClient = admin ?? (supabase as any);
    const { data: link, error: linkError } = await linkClient
      .from('shared_links')
      .insert({
        invoice_id: invoiceId,
        link_type: 'xml',
      })
      .select('token')
      .single();

    if (linkError) {
      console.error('Share Link Error:', linkError);
    }

    // Baue Share-URL
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

    let shareUrl = link?.token ? `${baseUrl}/share/${link.token}` : null;
    if (!shareUrl && linkError && linkError.message?.toLowerCase().includes('link_type')) {
      shareUrl = urlData.publicUrl;
    }

    return NextResponse.json({
      ok: true,
      xml,
      auftragsnummer,
      filename,
      storagePath,
      xmlUrl: urlData.publicUrl,
      shareUrl,
      shareToken: link?.token,
    });
  } catch (err) {
    console.error('XML Generation Error:', err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

// GET: Hole XML fuer eine Rechnung (wenn bereits generiert)
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const invoiceId = searchParams.get('invoiceId');

    if (!invoiceId) {
      return NextResponse.json({ error: 'invoiceId missing' }, { status: 400 });
    }

    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const { data: invoice, error } = await (supabase as any)
      .from('invoices')
      .select('xml_url, xml_generated_at')
      .eq('id', invoiceId)
      .eq('user_id', user.id)
      .single();

    if (error || !invoice) {
      return NextResponse.json({ error: 'Invoice not found' }, { status: 404 });
    }

    return NextResponse.json({
      xmlUrl: invoice.xml_url,
      xmlGeneratedAt: invoice.xml_generated_at,
    });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
