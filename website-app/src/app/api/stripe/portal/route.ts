import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { createPortalSession } from '@/lib/stripe/server';
import { STRIPE_CONFIG } from '@/lib/stripe/config';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type SupabaseAny = any;

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

    // User Settings laden um Stripe Customer ID zu bekommen
    const { data: settings, error: settingsError } = await (supabase as SupabaseAny)
      .from('user_settings')
      .select('stripe_customer_id')
      .eq('user_id', user.id)
      .single();

    if (settingsError || !settings?.stripe_customer_id) {
      return NextResponse.json(
        { error: 'Kein aktives Abonnement gefunden' },
        { status: 400 }
      );
    }

    // Portal Session erstellen
    const portalUrl = await createPortalSession({
      customerId: settings.stripe_customer_id,
      returnUrl: STRIPE_CONFIG.portalReturnUrl || `${request.nextUrl.origin}/app/settings`,
    });

    return NextResponse.json({ url: portalUrl });
  } catch (error) {
    console.error('Portal Error:', error);
    return NextResponse.json(
      { error: 'Kundenportal konnte nicht geöffnet werden' },
      { status: 500 }
    );
  }
}
