import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

const RESEND_API_URL = 'https://api.resend.com/emails';

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

    const { data: link, error: linkError } = await (supabase as any)
      .from('shared_links')
      .insert({ invoice_id: invoiceId })
      .select('token')
      .single();

    if (linkError || !link?.token) {
      return NextResponse.json({ error: linkError?.message || 'Failed to create share link' }, { status: 500 });
    }

    const origin = req.headers.get('origin') || '';
    const shareUrl = `${origin}/share/${link.token}`;

    const resendKey = process.env.RESEND_API_KEY;
    const fromEmail = process.env.LABRECHNER_EMAIL_FROM;

    if (!resendKey || !fromEmail) {
      return NextResponse.json({ error: 'Email provider not configured' }, { status: 501 });
    }

    const emailPayload = {
      from: fromEmail,
      to: [to],
      subject: `Rechnung ${invoiceId}`,
      html: `<p>Hier ist Ihre Rechnung:</p><p><a href="${shareUrl}">${shareUrl}</a></p>`,
    };

    const emailRes = await fetch(RESEND_API_URL, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${resendKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(emailPayload),
    });

    if (!emailRes.ok) {
      const errorText = await emailRes.text();
      return NextResponse.json({ error: errorText || 'Email send failed' }, { status: 502 });
    }

    return NextResponse.json({ ok: true, shareUrl });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
