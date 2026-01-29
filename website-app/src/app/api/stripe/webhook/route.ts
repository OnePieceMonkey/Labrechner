import { NextRequest, NextResponse } from 'next/server';
import { constructWebhookEvent, getStripe } from '@/lib/stripe/server';
import { createClient as createAdminClient } from '@supabase/supabase-js';
import { getPlanByPriceId, normalizePlanId } from '@/lib/stripe/config';
import Stripe from 'stripe';

// Supabase Admin Client für Webhook (keine User-Authentifizierung)
function getSupabaseAdmin() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceKey) {
    throw new Error('Supabase Admin nicht konfiguriert');
  }

  return createAdminClient(url, serviceKey);
}

export async function POST(request: NextRequest) {
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!webhookSecret) {
    console.error('STRIPE_WEBHOOK_SECRET nicht konfiguriert');
    return NextResponse.json(
      { error: 'Webhook nicht konfiguriert' },
      { status: 500 }
    );
  }

  // Raw Body für Signaturprüfung
  const payload = await request.text();
  const signature = request.headers.get('stripe-signature');

  if (!signature) {
    return NextResponse.json(
      { error: 'Keine Signatur' },
      { status: 400 }
    );
  }

  let event: Stripe.Event;

  try {
    event = constructWebhookEvent(payload, signature, webhookSecret);
  } catch (err) {
    console.error('Webhook Signatur ungültig:', err);
    return NextResponse.json(
      { error: 'Ungültige Signatur' },
      { status: 400 }
    );
  }

  const supabase = getSupabaseAdmin();

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        await handleCheckoutComplete(supabase, session);
        break;
      }

      case 'customer.subscription.created':
      case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription;
        await handleSubscriptionUpdate(supabase, subscription);
        break;
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription;
        await handleSubscriptionDeleted(supabase, subscription);
        break;
      }

      case 'invoice.payment_succeeded': {
        const invoice = event.data.object as Stripe.Invoice;
        await handlePaymentSucceeded(supabase, invoice);
        break;
      }

      case 'invoice.payment_failed': {
        const invoice = event.data.object as Stripe.Invoice;
        await handlePaymentFailed(supabase, invoice);
        break;
      }

      default:
        console.log(`Unbehandelter Event-Typ: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Webhook Verarbeitungsfehler:', error);
    return NextResponse.json(
      { error: 'Webhook-Verarbeitung fehlgeschlagen' },
      { status: 500 }
    );
  }
}

// Handler Funktionen
async function handleCheckoutComplete(
  supabase: ReturnType<typeof getSupabaseAdmin>,
  session: Stripe.Checkout.Session
) {
  const userId = session.metadata?.userId
    || session.metadata?.user_id
    || session.client_reference_id;
  const customerId = session.customer as string;
  const subscriptionId = session.subscription as string;

  if (!userId) {
    console.error('Keine userId in Session Metadata');
    return;
  }

  // Subscription Details abrufen
  const stripe = getStripe();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const subscription = await stripe.subscriptions.retrieve(subscriptionId) as any;
  const priceId = subscription.items?.data?.[0]?.price?.id;
  const metaPlanId = subscription.metadata?.planId || subscription.metadata?.plan_id;
  const normalizedMetaPlanId = metaPlanId ? normalizePlanId(metaPlanId) : null;
  const plan = priceId ? getPlanByPriceId(priceId) : null;
  const resolvedPlanId = plan?.id || normalizedMetaPlanId || 'free';
  const interval = subscription.items?.data?.[0]?.price?.recurring?.interval;
  const normalizedInterval = interval === 'year' || interval === 'month' ? interval : null;

  // User Settings aktualisieren
  const periodEnd = subscription.current_period_end;
  const { error } = await supabase
    .from('user_settings')
    .upsert({
      user_id: userId,
      stripe_customer_id: customerId,
      stripe_subscription_id: subscriptionId,
      subscription_status: subscription.status,
      subscription_plan: resolvedPlanId,
      subscription_period_end: periodEnd
        ? new Date(periodEnd * 1000).toISOString()
        : null,
      subscription_interval: normalizedInterval,
    });

  if (error) {
    console.error('Fehler beim Aktualisieren der Settings:', error);
  }
}

async function handleSubscriptionUpdate(
  supabase: ReturnType<typeof getSupabaseAdmin>,
  subscription: Stripe.Subscription
) {
  const userId = subscription.metadata?.userId || subscription.metadata?.user_id;

  if (!userId) {
    // Versuche über customer zu finden
    const { data } = await supabase
      .from('user_settings')
      .select('user_id')
      .eq('stripe_subscription_id', subscription.id)
      .single();

    if (!data) {
      console.error('User für Subscription nicht gefunden:', subscription.id);
      return;
    }

    await updateUserSubscription(supabase, data.user_id, subscription);
  } else {
    await updateUserSubscription(supabase, userId, subscription);
  }
}

async function updateUserSubscription(
  supabase: ReturnType<typeof getSupabaseAdmin>,
  userId: string,
  subscription: Stripe.Subscription
) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const sub = subscription as any;
  const priceId = sub.items?.data?.[0]?.price?.id;
  const metaPlanId = sub.metadata?.planId || sub.metadata?.plan_id;
  const normalizedMetaPlanId = metaPlanId ? normalizePlanId(metaPlanId) : null;
  const plan = priceId ? getPlanByPriceId(priceId) : null;
  const resolvedPlanId = plan?.id || normalizedMetaPlanId || 'free';
  const periodEnd = sub.current_period_end;
  const interval = sub.items?.data?.[0]?.price?.recurring?.interval;
  const normalizedInterval = interval === 'year' || interval === 'month' ? interval : null;

  const { error } = await supabase
    .from('user_settings')
    .update({
      stripe_customer_id: sub.customer || null,
      stripe_subscription_id: sub.id,
      subscription_status: sub.status,
      subscription_plan: resolvedPlanId,
      subscription_period_end: periodEnd
        ? new Date(periodEnd * 1000).toISOString()
        : null,
      subscription_interval: normalizedInterval,
    })
    .eq('user_id', userId);

  if (error) {
    console.error('Fehler beim Aktualisieren der Subscription:', error);
  }
}

async function handleSubscriptionDeleted(
  supabase: ReturnType<typeof getSupabaseAdmin>,
  subscription: Stripe.Subscription
) {
  // Suche User über Subscription ID
  const { data } = await supabase
    .from('user_settings')
    .select('user_id')
    .eq('stripe_subscription_id', subscription.id)
    .single();

  if (!data) {
    console.error('User für gelöschte Subscription nicht gefunden');
    return;
  }

  // Zurück auf Free Plan setzen
  const { error } = await supabase
    .from('user_settings')
    .update({
      subscription_status: 'canceled',
      subscription_plan: 'free',
      subscription_period_end: null,
      subscription_interval: null,
      subscription_renewal_reminded_for: null,
    })
    .eq('user_id', data.user_id);

  if (error) {
    console.error('Fehler beim Zurücksetzen auf Free Plan:', error);
  }
}

async function handlePaymentSucceeded(
  supabase: ReturnType<typeof getSupabaseAdmin>,
  invoice: Stripe.Invoice
) {
  const customerId = invoice.customer as string;

  // User über Customer ID finden
  const { data } = await supabase
    .from('user_settings')
    .select('user_id')
    .eq('stripe_customer_id', customerId)
    .single();

  if (data) {
    console.log(`Zahlung erfolgreich für User ${data.user_id}: ${invoice.amount_paid / 100}€`);
  }
}

async function handlePaymentFailed(
  supabase: ReturnType<typeof getSupabaseAdmin>,
  invoice: Stripe.Invoice
) {
  const customerId = invoice.customer as string;

  // User über Customer ID finden
  const { data } = await supabase
    .from('user_settings')
    .select('user_id')
    .eq('stripe_customer_id', customerId)
    .single();

  if (data) {
    console.log(`Zahlung fehlgeschlagen für User ${data.user_id}`);
    // Hier könnte eine E-Mail-Benachrichtigung gesendet werden
  }
}
