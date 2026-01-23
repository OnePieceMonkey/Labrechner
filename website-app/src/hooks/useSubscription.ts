'use client';

import { useState, useCallback } from 'react';
import { SUBSCRIPTION_PLANS, type PlanId, type SubscriptionPlan, checkLimit } from '@/lib/stripe/config';
import { useUser } from './useUser';

export interface SubscriptionState {
  plan: SubscriptionPlan;
  status: string | null;
  periodEnd: Date | null;
  customerId: string | null;
  subscriptionId: string | null;
}

export function useSubscription() {
  const { settings, isLoading: userLoading } = useUser();
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Aktueller Plan basierend auf User Settings
  const currentPlan = settings?.subscription_plan as PlanId || 'free';
  const plan = SUBSCRIPTION_PLANS[currentPlan] || SUBSCRIPTION_PLANS.free;

  const subscription: SubscriptionState = {
    plan,
    status: settings?.subscription_status || null,
    periodEnd: settings?.subscription_period_end
      ? new Date(settings.subscription_period_end)
      : null,
    customerId: settings?.stripe_customer_id || null,
    subscriptionId: settings?.stripe_subscription_id || null,
  };

  // Checkout starten
  const startCheckout = useCallback(async (planId: PlanId) => {
    if (planId === 'free') {
      setError('Kostenloser Plan benötigt kein Checkout');
      return;
    }

    setActionLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ planId }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Checkout fehlgeschlagen');
      }

      // Weiterleitung zu Stripe Checkout
      window.location.href = data.url;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Checkout fehlgeschlagen');
    } finally {
      setActionLoading(false);
    }
  }, []);

  // Kundenportal öffnen
  const openPortal = useCallback(async () => {
    if (!subscription.customerId) {
      setError('Kein aktives Abonnement');
      return;
    }

    setActionLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/stripe/portal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Portal konnte nicht geöffnet werden');
      }

      // Weiterleitung zum Stripe Kundenportal
      window.location.href = data.url;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Portal fehlgeschlagen');
    } finally {
      setActionLoading(false);
    }
  }, [subscription.customerId]);

  // Limit prüfen
  const canUseFeature = useCallback((
    limitKey: keyof SubscriptionPlan['limits'],
    currentValue: number
  ) => {
    return checkLimit(plan, limitKey, currentValue);
  }, [plan]);

  // Prüfen ob Upgrade nötig
  const needsUpgrade = useCallback((
    limitKey: keyof SubscriptionPlan['limits'],
    currentValue: number
  ) => {
    const result = checkLimit(plan, limitKey, currentValue);
    return !result.allowed;
  }, [plan]);

  // Ist Premium User?
  const isPremium = currentPlan !== 'free';

  // Ist Subscription aktiv?
  const isActive = ['active', 'trialing'].includes(subscription.status || '');

  // Subscription wird gekündigt?
  const isCanceling = subscription.status === 'active' && subscription.periodEnd && subscription.periodEnd > new Date();

  return {
    subscription,
    plan,
    isPremium,
    isActive,
    isCanceling,
    loading: userLoading || actionLoading,
    error,
    startCheckout,
    openPortal,
    canUseFeature,
    needsUpgrade,
    allPlans: SUBSCRIPTION_PLANS,
  };
}
