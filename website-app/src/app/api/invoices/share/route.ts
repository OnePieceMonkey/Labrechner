import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

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

    const { data, error } = await (supabase as any)
      .from('shared_links')
      .insert({ invoice_id: invoiceId })
      .select('token')
      .single();

    if (error || !data?.token) {
      return NextResponse.json({ error: error?.message || 'Failed to create share link' }, { status: 500 });
    }

    const origin = req.headers.get('origin') || '';
    const url = `${origin}/share/${data.token}`;
    return NextResponse.json({ token: data.token, url });
  } catch (err) {
    return NextResponse.json({ error: err instanceof Error ? err.message : 'Unknown error' }, { status: 500 });
  }
}
