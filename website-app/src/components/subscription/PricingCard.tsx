'use client';

import { type SubscriptionPlan, formatPrice } from '@/lib/stripe/config';

interface PricingCardProps {
  plan: SubscriptionPlan;
  isCurrentPlan: boolean;
  onSelect: () => void;
  loading?: boolean;
  disabled?: boolean;
}

export function PricingCard({
  plan,
  isCurrentPlan,
  onSelect,
  loading = false,
  disabled = false,
}: PricingCardProps) {
  const isPopular = 'popular' in plan && plan.popular;

  return (
    <div
      className={`
        relative rounded-2xl border p-6 flex flex-col
        ${isPopular ? 'border-purple-500 shadow-lg shadow-purple-500/20' : 'border-gray-200 dark:border-gray-700'}
        ${isCurrentPlan ? 'ring-2 ring-purple-500' : ''}
      `}
    >
      {/* Popular Badge */}
      {isPopular && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2">
          <span className="bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs font-semibold px-3 py-1 rounded-full">
            Beliebt
          </span>
        </div>
      )}

      {/* Current Plan Badge */}
      {isCurrentPlan && (
        <div className="absolute -top-3 right-4">
          <span className="bg-green-500 text-white text-xs font-semibold px-3 py-1 rounded-full">
            Aktuell
          </span>
        </div>
      )}

      {/* Header */}
      <div className="mb-6">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white">
          {plan.name}
        </h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          {plan.description}
        </p>
      </div>

      {/* Price */}
      <div className="mb-6">
        <div className="flex items-baseline">
          <span className="text-4xl font-bold text-gray-900 dark:text-white">
            {plan.price === 0 ? 'Kostenlos' : formatPrice(plan.price)}
          </span>
          {plan.price > 0 && (
            <span className="text-gray-500 dark:text-gray-400 ml-2">/Monat</span>
          )}
        </div>
        {plan.price > 0 && (
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            zzgl. MwSt.
          </p>
        )}
      </div>

      {/* Features */}
      <ul className="space-y-3 mb-8 flex-grow">
        {plan.features.map((feature, index) => (
          <li key={index} className="flex items-start gap-3">
            <svg
              className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
            <span className="text-sm text-gray-600 dark:text-gray-300">
              {feature}
            </span>
          </li>
        ))}
      </ul>

      {/* CTA Button */}
      <button
        onClick={onSelect}
        disabled={disabled || loading || isCurrentPlan}
        className={`
          w-full py-3 px-4 rounded-lg font-semibold text-sm transition-all
          ${isPopular
            ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600'
            : isCurrentPlan
              ? 'bg-gray-100 dark:bg-gray-800 text-gray-400 cursor-default'
              : 'bg-gray-900 dark:bg-white text-white dark:text-gray-900 hover:bg-gray-800 dark:hover:bg-gray-100'
          }
          disabled:opacity-50 disabled:cursor-not-allowed
        `}
      >
        {loading ? (
          <span className="flex items-center justify-center gap-2">
            <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
                fill="none"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            Wird geladen...
          </span>
        ) : isCurrentPlan ? (
          'Aktueller Plan'
        ) : plan.price === 0 ? (
          'Kostenlos nutzen'
        ) : (
          'Jetzt upgraden'
        )}
      </button>
    </div>
  );
}
