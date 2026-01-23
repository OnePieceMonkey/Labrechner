'use client';

import { useSubscription } from '@/hooks/useSubscription';
import { PricingCard } from './PricingCard';
import { SUBSCRIPTION_PLANS, type PlanId } from '@/lib/stripe/config';

export function PricingSection() {
  const { subscription, loading, error, startCheckout } = useSubscription();

  const plans = Object.values(SUBSCRIPTION_PLANS);

  const handleSelectPlan = (planId: PlanId) => {
    if (planId === 'free') return;
    startCheckout(planId);
  };

  return (
    <div className="py-12">
      {/* Header */}
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
          Wählen Sie Ihren Plan
        </h2>
        <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
          Starten Sie kostenlos und upgraden Sie, wenn Ihr Labor wächst.
          Alle Pläne können jederzeit gekündigt werden.
        </p>
      </div>

      {/* Error */}
      {error && (
        <div className="mb-8 max-w-md mx-auto">
          <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-4 rounded-lg text-sm">
            {error}
          </div>
        </div>
      )}

      {/* Pricing Cards */}
      <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto px-4">
        {plans.map((plan) => (
          <PricingCard
            key={plan.id}
            plan={plan}
            isCurrentPlan={subscription.plan.id === plan.id}
            onSelect={() => handleSelectPlan(plan.id as PlanId)}
            loading={loading}
            disabled={loading}
          />
        ))}
      </div>

      {/* FAQ / Info */}
      <div className="mt-16 text-center">
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Alle Preise verstehen sich zzgl. 19% MwSt. | Jederzeit kündbar |{' '}
          <a href="/agb" className="text-purple-500 hover:underline">
            AGB
          </a>
        </p>
      </div>
    </div>
  );
}
