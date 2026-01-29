import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { generateDTVZXml } from '@/lib/xml/generateDTVZ';
import { Buffer } from 'buffer';

export async function GET(
  _req: NextRequest,
  context: { params: Promise<{ token: string }> }
) {
  const { token } = await context.params;
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const url = new URL(_req.url);
  const wantsJson = url.searchParams.get('format') === 'json'
    || _req.headers.get('accept')?.includes('application/json');
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceKey) {
    return NextResponse.json({ error: 'Service role key missing' }, { status: 500 });
  }

  const supabase = createClient(supabaseUrl, serviceKey);

  const { data: link, error: linkError } = await supabase
    .from('shared_links')
    .select('id, invoice_id, token, expires_at, access_count, max_access_count, link_type')
    .eq('token', token)
    .single();

  if (linkError || !link) {
    console.error('Share link lookup failed:', { token: token.slice(0, 10) + '...', error: linkError });
    return NextResponse.json({ error: 'Link not found' }, { status: 404 });
  }

  if (link.expires_at && new Date(link.expires_at) < new Date()) {
    return NextResponse.json({ error: 'Link expired' }, { status: 410 });
  }

  if (link.max_access_count !== null && link.access_count >= link.max_access_count) {
    return NextResponse.json({ error: 'Link expired' }, { status: 410 });
  }

  // Increment access count
  await supabase
    .from('shared_links')
    .update({ access_count: (link.access_count || 0) + 1 })
    .eq('id', link.id);

  const { data: invoice, error: invoiceError } = await supabase
    .from('invoices')
    .select('*')
    .eq('id', link.invoice_id)
    .single();

  if (invoiceError || !invoice) {
    return NextResponse.json({ error: 'Invoice not found' }, { status: 404 });
  }

  const ensureInvoicesBucket = async () => {
    try {
      const { error: bucketError } = await supabase.storage.getBucket('invoices');
      if (bucketError) {
        await supabase.storage.createBucket('invoices', { public: true });
      }
    } catch (bucketErr) {
      console.warn('Bucket check/create failed:', bucketErr);
    }
  };

  // Falls XML-Link, direkt zur XML-Datei weiterleiten
  const linkType = (link as any).link_type;
  if (linkType === 'xml') {
    const xmlUrl = (invoice as any).xml_url;
    if (xmlUrl) {
      if (wantsJson) {
        return NextResponse.json({ linkType: 'xml', xmlUrl });
      }
      // Redirect zur XML-Datei
      return NextResponse.redirect(xmlUrl);
    }

    const { data: items, error: itemsError } = await supabase
      .from('invoice_items')
      .select('*')
      .eq('invoice_id', link.invoice_id)
      .order('sort_order', { ascending: true });

    if (itemsError || !items) {
      return NextResponse.json({ error: 'Items not found' }, { status: 404 });
    }

    const { data: settings, error: settingsError } = await supabase
      .from('user_settings')
      .select('*')
      .eq('user_id', invoice.user_id)
      .single();

    if (settingsError || !settings) {
      return NextResponse.json({ error: 'User settings not found' }, { status: 404 });
    }

    try {
      const { xml, filename } = generateDTVZXml({
        invoice,
        items,
        labSettings: settings,
      });

      const storagePath = `invoices/${invoice.id}/${filename}`;
      const xmlBlob = Buffer.from(xml, 'utf-8');

      await ensureInvoicesBucket();
      let { error: uploadError } = await supabase.storage
        .from('invoices')
        .upload(storagePath, xmlBlob, {
          contentType: 'application/xml',
          upsert: true,
        });

      if (uploadError) {
        await ensureInvoicesBucket();
        const retry = await supabase.storage
          .from('invoices')
          .upload(storagePath, xmlBlob, {
            contentType: 'application/xml',
            upsert: true,
          });
        uploadError = retry.error;
      }

      if (uploadError) {
        console.error('XML upload failed (share):', uploadError);
        if (wantsJson) {
          return NextResponse.json({ error: 'XML upload failed', linkType: 'xml' }, { status: 500 });
        }
        return new NextResponse(xml, {
          headers: {
            'Content-Type': 'application/xml; charset=utf-8',
            'Content-Disposition': `attachment; filename="${filename}"`,
          },
        });
      }

      const { data: urlData } = supabase.storage
        .from('invoices')
        .getPublicUrl(storagePath);

      try {
        await supabase
          .from('invoices')
          .update({
            xml_url: urlData.publicUrl,
            xml_generated_at: new Date().toISOString(),
          })
          .eq('id', invoice.id);
      } catch (updateErr) {
        console.warn('XML invoice update failed (share):', updateErr);
      }

      if (wantsJson) {
        return NextResponse.json({ linkType: 'xml', xmlUrl: urlData.publicUrl });
      }

      return NextResponse.redirect(urlData.publicUrl);
    } catch (xmlError) {
      console.error('XML generation failed (share):', xmlError);
      return NextResponse.json({ error: 'XML generation failed' }, { status: 500 });
    }
  }

  const { data: items, error: itemsError } = await supabase
    .from('invoice_items')
    .select('*')
    .eq('invoice_id', link.invoice_id)
    .order('sort_order', { ascending: true });

  if (itemsError) {
    return NextResponse.json({ error: 'Items not found' }, { status: 404 });
  }

  return NextResponse.json({ linkType: linkType || 'pdf', invoice, items });
}
