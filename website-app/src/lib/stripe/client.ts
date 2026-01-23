'use client';

import { loadStripe, Stripe } from '@stripe/stripe-js';

// Stripe Client-seitig (Browser)
let stripePromise: Promise<Stripe | null> | null = null;

export function getStripeClient(): Promise<Stripe | null> {
  if (!stripePromise) {
    const publishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;

    if (!publishableKey) {
      console.error('NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY ist nicht konfiguriert');
      return Promise.resolve(null);
    }

    stripePromise = loadStripe(publishableKey, {
      locale: 'de',
    });
  }

  return stripePromise;
}
