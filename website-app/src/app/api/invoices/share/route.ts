import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { createClient as createAdminClient } from '@supabase/supabase-js';

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

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
    const admin = supabaseUrl && serviceKey ? createAdminClient(supabaseUrl, serviceKey) : null;
    const linkClient = admin ?? (supabase as any);

    const { data, error } = await linkClient
      .from('shared_links')
      .insert({ invoice_id: invoiceId })
      .select('token')
      .single();

    if (error || !data?.token) {
      return NextResponse.json({ error: error?.message || 'Failed to create share link' }, { status: 500 });
    }

    const appUrl = (process.env.NEXT_PUBLIC_APP_URL || '').replace(/\/$/, '');
    const origin = req.headers.get('origin');
    const forwardedHost = req.headers.get('x-forwarded-host') || req.headers.get('host');
    const forwardedProto = req.headers.get('x-forwarded-proto') || 'https';
    const baseUrl = appUrl || origin || (forwardedHost ? `${forwardedProto}://${forwardedHost}` : '');
    if (!baseUrl) {
      return NextResponse.json({ error: 'Base URL not configured' }, { status: 500 });
    }

    const url = `${baseUrl}/share/${data.token}`;
    return NextResponse.json({ token: data.token, url });
  } catch (err) {
    return NextResponse.json({ error: err instanceof Error ? err.message : 'Unknown error' }, { status: 500 });
  }
}
