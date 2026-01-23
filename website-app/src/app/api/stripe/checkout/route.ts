import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { createCheckoutSession } from '@/lib/stripe/server';
import { SUBSCRIPTION_PLANS, STRIPE_CONFIG } from '@/lib/stripe/config';

export async function POST(request: NextRequest) {
  try {
    // User authentifizieren
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Nicht angemeldet' },
        { status: 401 }
      );
    }

    // Request Body parsen
    const { planId } = await request.json();

    if (!planId || !['professional', 'enterprise'].includes(planId)) {
      return NextResponse.json(
        { error: 'Ungültiger Plan' },
        { status: 400 }
      );
    }

    const plan = SUBSCRIPTION_PLANS[planId as keyof typeof SUBSCRIPTION_PLANS];

    if (!plan.priceId) {
      return NextResponse.json(
        { error: 'Stripe Preis nicht konfiguriert' },
        { status: 500 }
      );
    }

    // Checkout Session erstellen
    const checkoutUrl = await createCheckoutSession({
      userId: user.id,
      email: user.email || '',
      priceId: plan.priceId,
      successUrl: STRIPE_CONFIG.successUrl || `${request.nextUrl.origin}/app/settings?success=true`,
      cancelUrl: STRIPE_CONFIG.cancelUrl || `${request.nextUrl.origin}/app/settings?canceled=true`,
    });

    return NextResponse.json({ url: checkoutUrl });
  } catch (error) {
    console.error('Checkout Error:', error);
    return NextResponse.json(
      { error: 'Checkout konnte nicht gestartet werden' },
      { status: 500 }
    );
  }
}
