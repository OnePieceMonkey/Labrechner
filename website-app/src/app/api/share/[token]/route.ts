import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function GET(
  _req: NextRequest,
  context: { params: Promise<{ token: string }> }
) {
  const { token } = await context.params;
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceKey) {
    return NextResponse.json({ error: 'Service role key missing' }, { status: 500 });
  }

  const supabase = createClient(supabaseUrl, serviceKey);

  const { data: link, error: linkError } = await supabase
    .from('shared_links')
    .select('id, invoice_id, token, expires_at, access_count, max_access_count')
    .eq('token', token)
    .single();

  if (linkError || !link) {
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

  const { data: items, error: itemsError } = await supabase
    .from('invoice_items')
    .select('*')
    .eq('invoice_id', link.invoice_id)
    .order('sort_order', { ascending: true });

  if (itemsError) {
    return NextResponse.json({ error: 'Items not found' }, { status: 404 });
  }

  return NextResponse.json({ invoice, items });
}
