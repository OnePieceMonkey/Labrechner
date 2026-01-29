"use client";

import { useState } from "react";
import { Check, Loader2 } from "lucide-react";
import { PRICING_PLANS } from "./constants";
import { useUser } from "@/hooks/useUser";

export function Pricing() {
  const [interval, setInterval] = useState<"monthly" | "yearly">("monthly");
  const [loadingPlanId, setLoadingPlanId] = useState<string | null>(null);
  const { user } = useUser();

  const handlePlanClick = async (
    planId: string,
    priceId: string | null,
    intervalValue: "monthly" | "yearly"
  ) => {
    // Free plan: redirect to signup
    if (planId === "free") {
      window.location.href = "/login";
      return;
    }

    // Paid plans: require login
    if (!user) {
      window.location.href = "/login";
      return;
    }

    // Create checkout session
    setLoadingPlanId(planId);
    try {
      const response = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          priceId,
          planId,
          interval: intervalValue === "yearly" ? "year" : "month",
        }),
      });

      const data = await response.json();

      if (data.url) {
        window.location.href = data.url;
      } else {
        console.error("No checkout URL returned");
        window.location.href = "/app/settings";
      }
    } catch (error) {
      console.error("Checkout error:", error);
      window.location.href = "/app/settings";
    } finally {
      setLoadingPlanId(null);
    }
  };

  return (
    <section
      id="pricing"
      className="py-24 bg-white dark:bg-slate-950 border-t border-gray-100 dark:border-slate-900 transition-colors"
    >
      <div className="container mx-auto px-6 max-w-7xl">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold text-slate-900 dark:text-white mb-6 tracking-tight">
            Transparente Preise. <br />
            <span className="text-brand-600 dark:text-brand-400">
              Keine versteckten Kosten.
            </span>
          </h2>
          <p className="text-lg text-slate-600 dark:text-slate-400 mb-8">
            Wählen Sie das Paket, das zu Ihrem Labor passt.
          </p>

          {/* Toggle */}
          <div className="flex items-center justify-center gap-4">
            <div className="bg-slate-100 dark:bg-slate-900 p-1.5 rounded-2xl inline-flex items-center border border-slate-200 dark:border-slate-800">
              <button
                onClick={() => setInterval("monthly")}
                className={`px-6 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  interval === "monthly"
                    ? "bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm"
                    : "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-300"
                }`}
              >
                Monatlich
              </button>
              <button
                onClick={() => setInterval("yearly")}
                className={`px-6 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  interval === "yearly"
                    ? "bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm"
                    : "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-300"
                }`}
              >
                Jährlich
              </button>
            </div>
            {interval === "yearly" && (
              <span className="animate-fade-in inline-flex items-center px-2.5 py-1 rounded-full bg-green-100 dark:bg-green-500/20 text-xs font-bold text-green-700 dark:text-green-400">
                -20% Rabatt
              </span>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {PRICING_PLANS.map((plan) => (
            <div
              key={plan.id}
              className={`relative rounded-[2rem] p-8 flex flex-col transition-all duration-300 ${
                plan.highlight
                  ? "bg-slate-900 dark:bg-slate-800 text-white shadow-xl shadow-slate-900/10 dark:shadow-black/40 ring-1 ring-slate-900 dark:ring-slate-700 scale-105 md:-translate-y-4 z-10"
                  : "bg-white dark:bg-slate-950 border border-gray-200 dark:border-slate-800 text-slate-900 dark:text-white hover:border-brand-200 dark:hover:border-slate-700"
              }`}
            >
              {plan.highlight && (
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-gradient-to-r from-brand-500 to-indigo-500 text-white text-xs font-bold px-4 py-1.5 rounded-full shadow-lg">
                  Beliebt
                </div>
              )}

              <div className="mb-8">
                <h3
                  className={`text-xl font-bold mb-2 ${
                    plan.highlight ? "text-white" : "text-slate-900 dark:text-white"
                  }`}
                >
                  {plan.name}
                </h3>
                <p
                  className={`text-sm ${
                    plan.highlight
                      ? "text-slate-300"
                      : "text-slate-500 dark:text-slate-400"
                  }`}
                >
                  {plan.description}
                </p>
              </div>

              <div className="mb-8">
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-bold">
                    {interval === "monthly" ? plan.priceMonthly : plan.priceYearly}€
                  </span>
                  <span
                    className={`text-sm ${
                      plan.highlight ? "text-slate-400" : "text-slate-500"
                    }`}
                  >
                    / Monat
                  </span>
                </div>
                {interval === "yearly" && plan.priceMonthly > 0 && (
                  <div
                    className={`text-xs mt-1 ${
                      plan.highlight ? "text-green-400" : "text-green-600"
                    }`}
                  >
                    {(plan.priceMonthly * 12 - plan.priceYearly * 12).toFixed(0)}€
                    Ersparnis im Jahr
                  </div>
                )}
              </div>

              <ul className="space-y-4 mb-10 flex-1">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm">
                    <div
                      className={`mt-0.5 p-0.5 rounded-full ${
                        plan.highlight
                          ? "bg-indigo-500/20 text-indigo-300"
                          : "bg-brand-50 dark:bg-brand-900/20 text-brand-600 dark:text-brand-400"
                      }`}
                    >
                      <Check className="w-3 h-3" />
                    </div>
                    <span
                      className={
                        plan.highlight
                          ? "text-slate-200"
                          : "text-slate-600 dark:text-slate-300"
                      }
                    >
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>

              <button
                onClick={() =>
                  handlePlanClick(
                    plan.id,
                    interval === "monthly"
                      ? plan.stripePriceIdMonthly || null
                      : plan.stripePriceIdYearly || null,
                    interval
                  )
                }
                disabled={loadingPlanId === plan.id}
                className={`w-full justify-center inline-flex items-center rounded-2xl font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-slate-900 active:scale-95 px-6 py-3 text-base disabled:opacity-50 disabled:cursor-not-allowed ${
                  plan.highlight
                    ? "bg-white text-slate-900 hover:bg-slate-100 border-none"
                    : "bg-white dark:bg-slate-800 hover:bg-gray-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-gray-200 dark:border-slate-700 shadow-sm"
                }`}
              >
                {loadingPlanId === plan.id ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Wird geladen...
                  </>
                ) : (
                  plan.cta
                )}
              </button>

              {plan.id !== "free" && (
                <p
                  className={`text-[10px] text-center mt-3 ${
                    plan.highlight ? "text-slate-400" : "text-slate-400"
                  }`}
                >
                  Zzgl. MwSt. • Monatlich kündbar
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
