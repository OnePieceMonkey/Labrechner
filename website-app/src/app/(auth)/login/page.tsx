"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Mail, Loader2, CheckCircle } from "lucide-react";
import Link from "next/link";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const supabase = createClient();
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (error) throw error;

      setIsSuccess(true);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Ein Fehler ist aufgetreten. Bitte versuchen Sie es erneut."
      );
    } finally {
      setIsLoading(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-brand-50 via-white to-white px-4 py-12">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -top-32 left-1/2 h-80 w-80 -translate-x-1/2 rounded-full bg-brand-200/60 blur-3xl" />
          <div className="absolute -bottom-20 right-[-6rem] h-72 w-72 rounded-full bg-brand-100/80 blur-3xl" />
        </div>
        <div className="relative flex min-h-screen items-center justify-center">
          <div className="w-full max-w-md">
            <div className="mb-8 text-center">
              <Link href="/" className="inline-flex items-center gap-2">
                <span className="text-2xl font-semibold text-brand-600">
                  Labrechner
                </span>
                <span className="text-sm font-medium text-brand-300">
                  | App
                </span>
              </Link>
              <p className="mt-2 text-sm text-gray-600">
                Sicherer Login ohne Passwort.
              </p>
            </div>

            <div className="overflow-hidden rounded-2xl border border-brand-100 bg-white/90 shadow-lg backdrop-blur">
              <div className="h-1 bg-gradient-to-r from-brand-500 via-brand-400 to-brand-500" />
              <div className="p-8 text-center">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-brand-50 text-brand-600 ring-1 ring-brand-100">
                  <CheckCircle className="h-7 w-7" />
                </div>
                <h2 className="mt-5 text-2xl font-semibold text-gray-900">
                  Link ist unterwegs
                </h2>
                <p className="mt-2 text-sm text-gray-600">
                  Wir haben den Magic Link an diese Adresse gesendet:
                </p>
                <div className="mt-3 inline-flex items-center rounded-full bg-brand-50 px-3 py-1 text-xs font-medium text-brand-700 ring-1 ring-brand-100">
                  {email}
                </div>
                <p className="mt-6 text-xs text-gray-500">
                  Keine E-Mail erhalten? Pruefen Sie Ihren Spam-Ordner oder{" "}
                  <button
                    onClick={() => setIsSuccess(false)}
                    className="font-medium text-brand-600 hover:text-brand-700 hover:underline"
                  >
                    senden Sie den Link erneut
                  </button>
                  .
                </p>
              </div>
            </div>

            <div className="mt-6 text-center text-xs text-gray-500">
              <Link href="/" className="hover:text-gray-700">
                Zurueck zur Startseite
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-brand-50 via-white to-white px-4 py-12">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-32 left-1/2 h-80 w-80 -translate-x-1/2 rounded-full bg-brand-200/60 blur-3xl" />
        <div className="absolute -bottom-20 right-[-6rem] h-72 w-72 rounded-full bg-brand-100/80 blur-3xl" />
      </div>
      <div className="relative flex min-h-screen items-center justify-center">
        <div className="w-full max-w-md">
          <div className="mb-8 text-center">
            <Link href="/" className="inline-flex items-center gap-2">
              <span className="text-2xl font-semibold text-brand-600">
                Labrechner
              </span>
              <span className="text-sm font-medium text-brand-300">| App</span>
            </Link>
            <p className="mt-2 text-sm text-gray-600">
              Melden Sie sich an, um fortzufahren.
            </p>
          </div>

          <div className="overflow-hidden rounded-2xl border border-brand-100 bg-white/90 shadow-lg backdrop-blur">
            <div className="h-1 bg-gradient-to-r from-brand-500 via-brand-400 to-brand-500" />
            <div className="p-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-700"
                  >
                    E-Mail-Adresse
                  </label>
                  <div className="relative mt-2">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                      <Mail className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="ihre@email.de"
                      required
                      className="block w-full rounded-xl border border-gray-300 bg-white py-3 pl-10 pr-4 text-slate-900 placeholder-gray-400 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                    />
                  </div>
                </div>

                {error && (
                  <div className="rounded-xl border border-red-100 bg-red-50 p-3 text-sm text-red-700">
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isLoading || !email}
                  className="btn-primary w-full py-3 text-base disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Sende Magic Link...
                    </>
                  ) : (
                    "Mit Magic Link anmelden"
                  )}
                </button>
              </form>

              <div className="mt-6 text-center text-sm text-gray-500">
                <p>
                  Wir senden Ihnen einen sicheren Link per E-Mail. Kein Passwort
                  erforderlich.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-6 text-center text-xs text-gray-500">
            <Link href="/" className="hover:text-gray-700">
              Zurueck zur Startseite
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
