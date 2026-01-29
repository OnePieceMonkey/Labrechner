'use client';

import { useSubscription } from '@/hooks/useSubscription';
import { formatPrice } from '@/lib/stripe/config';

export function SubscriptionStatus() {
  const {
    subscription,
    plan,
    isPremium,
    isActive,
    isCanceling,
    loading,
    openPortal,
  } = useSubscription();

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('de-DE', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  const isAnnual = subscription.interval === 'year';
  const now = new Date();
  const showAnnualReminder = Boolean(
    isAnnual
      && isActive
      && !isCanceling
      && subscription.periodEnd
      && subscription.periodEnd > now
      && (subscription.periodEnd.getTime() - now.getTime()) <= 30 * 24 * 60 * 60 * 1000
  );

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        Ihr Abonnement
      </h3>

      {/* Plan Info */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xl font-bold text-gray-900 dark:text-white">
              {plan.name}
            </span>
            {isPremium && isActive && (
              <span className="bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-xs font-semibold px-2 py-0.5 rounded-full">
                Aktiv
              </span>
            )}
            {isCanceling && (
              <span className="bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400 text-xs font-semibold px-2 py-0.5 rounded-full">
                Wird gekündigt
              </span>
            )}
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {plan.price === 0 ? 'Kostenlos' : `${formatPrice(plan.price)}/Monat`}
          </p>
        </div>

        {isPremium && (
          <button
            onClick={openPortal}
            disabled={loading}
            className="text-sm text-purple-600 dark:text-purple-400 hover:underline disabled:opacity-50"
          >
            Verwalten
          </button>
        )}
      </div>

      {/* Period Info */}
      {subscription.periodEnd && isActive && (
        <div className="text-sm text-gray-600 dark:text-gray-300 mb-4">
          {isCanceling ? (
            <p>
              Ihr Abonnement endet am{' '}
              <span className="font-semibold">{formatDate(subscription.periodEnd)}</span>
            </p>
          ) : (
            <p>
              Nächste Abrechnung am{' '}
              <span className="font-semibold">{formatDate(subscription.periodEnd)}</span>
            </p>
          )}
        </div>
      )}

      {showAnnualReminder && subscription.periodEnd && (
        <div className="mb-4 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-700">
          Ihr Jahresabo verlaengert sich am{' '}
          <span className="font-semibold">{formatDate(subscription.periodEnd)}</span>.
          Wenn Sie kuendigen moechten, koennen Sie das im Kundenportal tun.
        </div>
      )}

      {/* Limits */}
      <div className="border-t border-gray-200 dark:border-gray-700 pt-4 mt-4">
        <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
          Ihre Limits
        </h4>
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div>
            <span className="text-gray-500 dark:text-gray-400">Rechnungen/Monat:</span>
            <span className="ml-2 font-medium text-gray-900 dark:text-white">
              {plan.limits.invoicesPerMonth === -1 ? 'Unbegrenzt' : plan.limits.invoicesPerMonth}
            </span>
          </div>
          <div>
            <span className="text-gray-500 dark:text-gray-400">Kunden:</span>
            <span className="ml-2 font-medium text-gray-900 dark:text-white">
              {plan.limits.clients === -1 ? 'Unbegrenzt' : plan.limits.clients}
            </span>
          </div>
          <div>
            <span className="text-gray-500 dark:text-gray-400">Vorlagen:</span>
            <span className="ml-2 font-medium text-gray-900 dark:text-white">
              {plan.limits.templates === -1 ? 'Unbegrenzt' : plan.limits.templates}
            </span>
          </div>
          <div>
            <span className="text-gray-500 dark:text-gray-400">KI-Vorschläge:</span>
            <span className="ml-2 font-medium text-gray-900 dark:text-white">
              {plan.limits.aiSuggestionsPerMonth === -1 ? 'Unbegrenzt' : `${plan.limits.aiSuggestionsPerMonth}/Monat`}
            </span>
          </div>
        </div>
      </div>

      {/* Upgrade CTA */}
      {!isPremium && (
        <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
          <a
            href="/app/settings#pricing"
            className="block w-full text-center bg-gradient-to-r from-purple-500 to-pink-500 text-white py-2 px-4 rounded-lg font-semibold text-sm hover:from-purple-600 hover:to-pink-600 transition-all"
          >
            Jetzt upgraden
          </a>
        </div>
      )}
    </div>
  );
}
