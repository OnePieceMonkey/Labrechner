import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { getStripe } from '@/lib/stripe/server';
import { STRIPE_CONFIG, getPriceIdForPlan, normalizePlanId } from '@/lib/stripe/config';

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { priceId, planId, interval } = await request.json();
    const normalizedPlanId = normalizePlanId(planId || '') || null;
    const normalizedInterval = interval === 'year' ? 'year' : 'month';
    const resolvedPriceId = getPriceIdForPlan(normalizedPlanId || '', normalizedInterval) || priceId;

    if (!resolvedPriceId) {
      return NextResponse.json(
        { error: 'Price ID is required' },
        { status: 400 }
      );
    }

    // Erstelle Stripe Checkout Session
    const stripe = getStripe();
    const session = await stripe.checkout.sessions.create({
      customer_email: user.email,
      client_reference_id: user.id,
      line_items: [
        {
          price: resolvedPriceId,
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: STRIPE_CONFIG.successUrl || `${process.env.NEXT_PUBLIC_APP_URL}/app/settings?success=true`,
      cancel_url: STRIPE_CONFIG.cancelUrl || `${process.env.NEXT_PUBLIC_APP_URL}/pricing?canceled=true`,
      metadata: {
        userId: user.id,
        user_id: user.id,
        planId: normalizedPlanId || planId,
        plan_id: normalizedPlanId || planId,
        interval: normalizedInterval,
      },
      subscription_data: {
        metadata: {
          userId: user.id,
          user_id: user.id,
          planId: normalizedPlanId || planId,
          plan_id: normalizedPlanId || planId,
          interval: normalizedInterval,
        },
      },
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error('Stripe checkout error:', error);
    return NextResponse.json(
      { error: 'Failed to create checkout session' },
      { status: 500 }
    );
  }
}
