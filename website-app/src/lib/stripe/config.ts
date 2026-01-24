// Stripe Konfiguration und Preismodelle

export const SUBSCRIPTION_PLANS = {
  free: {
    id: 'free',
    name: 'Starter',
    description: 'Für den Einstieg',
    price: 0,
    priceId: null, // Kein Stripe Preis
    features: [
      'BEL-Positionssuche',
      'Bis zu 3 Rechnungen/Monat',
      'Grundlegende PDF-Erstellung',
      'E-Mail Support',
    ],
    limits: {
      invoicesPerMonth: 3,
      clients: 10,
      templates: 3,
      aiSuggestionsPerMonth: 0,
    },
  },
  professional: {
    id: 'professional',
    name: 'Pro',
    description: 'Für aktive Labore',
    price: 49,
    priceId: process.env.STRIPE_PRICE_PROFESSIONAL,
    popular: true,
    features: [
      'Alles aus Starter',
      'Unbegrenzte Rechnungen',
      'Unbegrenzte Kunden',
      'BEL + BEB (Eigenpositionen)',
      'Eigenes Logo auf Rechnung',
      '50 Vorlagen',
      'Prioritäts-Support',
    ],
    limits: {
      invoicesPerMonth: -1, // Unbegrenzt
      clients: -1,
      templates: 50,
      aiSuggestionsPerMonth: 50,
    },
  },
  expert: {
    id: 'expert',
    name: 'Expert',
    description: 'Für Profi-Labore',
    price: 89,
    priceId: process.env.STRIPE_PRICE_EXPERT,
    features: [
      'Alles aus Pro',
      'KI-Plausibilitäts-Check ("Umsatzretter")',
      'Unbegrenzte KI-Vorschläge',
      'XML-Export (sobald verfügbar)',
      'Multi-User (bis 5)',
      'Prio-Support',
    ],
    limits: {
      invoicesPerMonth: -1,
      clients: -1,
      templates: -1,
      aiSuggestionsPerMonth: -1,
    },
  },
} as const;

export type PlanId = keyof typeof SUBSCRIPTION_PLANS;
export type SubscriptionPlan = typeof SUBSCRIPTION_PLANS[PlanId];

// Stripe Konfiguration
export const STRIPE_CONFIG = {
  publishableKey: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
  webhookSecret: process.env.STRIPE_WEBHOOK_SECRET,
  portalReturnUrl: `${process.env.NEXT_PUBLIC_APP_URL}/app/settings`,
  successUrl: `${process.env.NEXT_PUBLIC_APP_URL}/app/settings?success=true`,
  cancelUrl: `${process.env.NEXT_PUBLIC_APP_URL}/app/settings?canceled=true`,
};

// Helper Funktionen
export function getPlanById(planId: string): SubscriptionPlan | undefined {
  return SUBSCRIPTION_PLANS[planId as PlanId];
}

export function getPlanByPriceId(priceId: string): SubscriptionPlan | undefined {
  return Object.values(SUBSCRIPTION_PLANS).find(plan => plan.priceId === priceId);
}

export function formatPrice(price: number): string {
  return new Intl.NumberFormat('de-DE', {
    style: 'currency',
    currency: 'EUR',
  }).format(price);
}

export function checkLimit(
  plan: SubscriptionPlan,
  limitKey: keyof SubscriptionPlan['limits'],
  currentValue: number
): { allowed: boolean; remaining: number } {
  const limit = plan.limits[limitKey];

  if (limit === -1) {
    return { allowed: true, remaining: Infinity };
  }

  return {
    allowed: currentValue < limit,
    remaining: Math.max(0, limit - currentValue),
  };
}
