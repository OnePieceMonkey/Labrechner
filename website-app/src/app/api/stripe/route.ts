import { NextResponse } from 'next/server';
import { createClient as createAdminClient } from '@supabase/supabase-js';
import { Resend } from 'resend';
import { render } from '@react-email/components';
import { SubscriptionRenewalEmail } from '@/components/email/SubscriptionRenewalEmail';

const REMINDER_DAYS = 30;

function getSupabaseAdmin() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceKey) {
    throw new Error('Supabase Admin not configured');
  }

  return createAdminClient(url, serviceKey);
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  if (url.searchParams.get('task') !== 'reminders') {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  const cronSecret = process.env.CRON_SECRET;
  if (cronSecret) {
    const auth = request.headers.get('authorization');
    if (auth !== `Bearer ${cronSecret}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
  }

  const resendKey = process.env.RESEND_API_KEY;
  const fromEmail = process.env.LABRECHNER_EMAIL_FROM;
  const appUrl = (process.env.NEXT_PUBLIC_APP_URL || '').replace(/\/$/, '');

  if (!resendKey || !fromEmail) {
    return NextResponse.json({ error: 'Email provider not configured' }, { status: 501 });
  }

  if (!appUrl) {
    return NextResponse.json({ error: 'App URL not configured' }, { status: 500 });
  }

  const supabase = getSupabaseAdmin();
  const now = new Date();
  const target = new Date(now.getTime() + REMINDER_DAYS * 24 * 60 * 60 * 1000);
  const nowIso = now.toISOString();
  const targetIso = target.toISOString();

  const { data: rows, error } = await supabase
    .from('user_settings')
    .select(
      'user_id, lab_name, contact_name, lab_email, subscription_period_end, subscription_interval, subscription_status, subscription_plan, subscription_renewal_reminded_for'
    )
    .eq('subscription_interval', 'year')
    .in('subscription_status', ['active', 'trialing'])
    .gt('subscription_period_end', nowIso)
    .lte('subscription_period_end', targetIso);

  if (error) {
    return NextResponse.json({ error: error.message || 'Query failed' }, { status: 500 });
  }

  if (!rows || rows.length === 0) {
    return NextResponse.json({ ok: true, sent: 0 });
  }

  const resend = new Resend(resendKey);
  let sent = 0;
  const failures: Array<{ user_id: string; error: string }> = [];

  for (const row of rows) {
    if (!row.subscription_period_end) continue;
    if (row.subscription_renewal_reminded_for === row.subscription_period_end) continue;

    let recipientEmail = row.lab_email || null;
    if (!recipientEmail) {
      const { data: userData, error: userError } = await supabase.auth.admin.getUserById(row.user_id);
      if (userError) {
        failures.push({ user_id: row.user_id, error: userError.message || 'Auth lookup failed' });
        continue;
      }
      recipientEmail = userData?.user?.email || null;
    }

    if (!recipientEmail) {
      failures.push({ user_id: row.user_id, error: 'No email found' });
      continue;
    }

    const recipientName = row.contact_name || row.lab_name || '';
    const periodEnd = new Date(row.subscription_period_end);
    const portalUrl = `${appUrl}/app/settings`;
    const planName = row.subscription_plan || 'Plan';

    try {
      const html = await render(
        SubscriptionRenewalEmail({
          recipientName,
          planName,
          periodEnd,
          portalUrl,
        })
      );

      const { error: sendError } = await resend.emails.send({
        from: fromEmail,
        to: [recipientEmail],
        subject: `Ihr Jahresabo verlaengert sich bald (${planName})`,
        html,
      });

      if (sendError) {
        failures.push({ user_id: row.user_id, error: sendError.message || 'Send failed' });
        continue;
      }

      const { error: updateError } = await supabase
        .from('user_settings')
        .update({ subscription_renewal_reminded_for: row.subscription_period_end })
        .eq('user_id', row.user_id);

      if (updateError) {
        failures.push({ user_id: row.user_id, error: updateError.message || 'Update failed' });
        continue;
      }

      sent += 1;
    } catch (err) {
      failures.push({ user_id: row.user_id, error: err instanceof Error ? err.message : 'Unknown error' });
    }
  }

  return NextResponse.json({ ok: true, sent, failures });
}
