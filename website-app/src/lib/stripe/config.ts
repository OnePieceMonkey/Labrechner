// Stripe configuration and pricing models

const pickPriceId = (...values: Array<string | undefined | null>) =>
  values.find((value) => value && value.length > 0) || null;

export type BillingInterval = 'month' | 'year';

const PRO_MONTHLY = pickPriceId(
  process.env.STRIPE_PRICE_PRO_MONTHLY,
  process.env.NEXT_PUBLIC_STRIPE_PRICE_PRO_MONTHLY,
  process.env.STRIPE_PRICE_PROFESSIONAL
);
const PRO_YEARLY = pickPriceId(
  process.env.STRIPE_PRICE_PRO_YEARLY,
  process.env.NEXT_PUBLIC_STRIPE_PRICE_PRO_YEARLY
);
const EXPERT_MONTHLY = pickPriceId(
  process.env.STRIPE_PRICE_EXPERT_MONTHLY,
  process.env.NEXT_PUBLIC_STRIPE_PRICE_EXPERT_MONTHLY,
  process.env.STRIPE_PRICE_EXPERT
);
const EXPERT_YEARLY = pickPriceId(
  process.env.STRIPE_PRICE_EXPERT_YEARLY,
  process.env.NEXT_PUBLIC_STRIPE_PRICE_EXPERT_YEARLY
);

export const SUBSCRIPTION_PLANS = {
  free: {
    id: 'free',
    name: 'Starter',
    description: 'Fuer den Einstieg',
    price: 0,
    priceId: null, // no Stripe price
    priceIds: { month: null, year: null },
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
    description: 'Fuer aktive Labore',
    price: 49,
    priceId: PRO_MONTHLY,
    priceIds: { month: PRO_MONTHLY, year: PRO_YEARLY },
    popular: true,
    features: [
      'Alles aus Starter',
      'Unbegrenzte Rechnungen',
      'Unbegrenzte Kunden',
      'BEL + BEB (Eigenpositionen)',
      'Eigenes Logo auf Rechnung',
      '50 Vorlagen',
      'Prioritaets-Support',
    ],
    limits: {
      invoicesPerMonth: -1,
      clients: -1,
      templates: 50,
      aiSuggestionsPerMonth: 50,
    },
  },
  expert: {
    id: 'expert',
    name: 'Expert',
    description: 'Fuer Profi-Labore',
    price: 89,
    priceId: EXPERT_MONTHLY,
    priceIds: { month: EXPERT_MONTHLY, year: EXPERT_YEARLY },
    features: [
      'Alles aus Pro',
      'KI-Plausibilitaets-Check ("Umsatzretter")',
      'Unbegrenzte KI-Vorschlaege',
      'XML-Export (sobald verfuegbar)',
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

// Stripe base config
export const STRIPE_CONFIG = {
  publishableKey: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
  webhookSecret: process.env.STRIPE_WEBHOOK_SECRET,
  portalReturnUrl: `${process.env.NEXT_PUBLIC_APP_URL}/app/settings`,
  successUrl: `${process.env.NEXT_PUBLIC_APP_URL}/app/settings?success=true`,
  cancelUrl: `${process.env.NEXT_PUBLIC_APP_URL}/app/settings?canceled=true`,
};

// Helpers
export function normalizePlanId(planId: string): PlanId | null {
  if (!planId) return null;
  if (planId === 'pro') return 'professional';
  return (planId in SUBSCRIPTION_PLANS ? planId : null) as PlanId | null;
}

export function getPlanById(planId: string): SubscriptionPlan | undefined {
  const normalized = normalizePlanId(planId);
  return normalized ? SUBSCRIPTION_PLANS[normalized] : undefined;
}

export function getPlanByPriceId(priceId: string): SubscriptionPlan | undefined {
  return Object.values(SUBSCRIPTION_PLANS).find((plan) => {
    if (plan.priceId === priceId) return true;
    if (plan.priceIds?.month === priceId) return true;
    if (plan.priceIds?.year === priceId) return true;
    return false;
  });
}

export function getPriceIdForPlan(planId: string, interval: BillingInterval): string | null {
  const normalized = normalizePlanId(planId);
  if (!normalized) return null;
  const plan = SUBSCRIPTION_PLANS[normalized];
  return plan.priceIds?.[interval] || plan.priceId || null;
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
