"use client";

import { useState } from "react";
import { ArrowRight, Check, Loader2 } from "lucide-react";

export function WaitlistForm() {
  const [email, setEmail] = useState("");
  const [laborName, setLaborName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    // TODO: Integration mit Supabase waitlist Tabelle
    // Für jetzt: Simulierter Erfolg
    await new Promise((resolve) => setTimeout(resolve, 1000));

    setIsLoading(false);
    setIsSuccess(true);
    setEmail("");
    setLaborName("");
  };

  if (isSuccess) {
    return (
      <div className="mx-auto max-w-md rounded-lg border border-success/20 bg-success/5 p-6 text-center">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-success/10">
          <Check className="h-6 w-6 text-success" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900">
          Sie sind auf der Liste!
        </h3>
        <p className="mt-2 text-sm text-gray-600">
          Wir melden uns, sobald Labrechner für Sie verfügbar ist.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="mx-auto max-w-md space-y-4">
      <div>
        <input
          type="email"
          required
          placeholder="Ihre E-Mail-Adresse"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="input w-full"
          disabled={isLoading}
        />
      </div>
      <div>
        <input
          type="text"
          placeholder="Laborname (optional)"
          value={laborName}
          onChange={(e) => setLaborName(e.target.value)}
          className="input w-full"
          disabled={isLoading}
        />
      </div>
      {error && <p className="text-sm text-error">{error}</p>}
      <button
        type="submit"
        disabled={isLoading}
        className="btn-primary w-full py-3 text-base disabled:opacity-50"
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            Wird eingetragen...
          </>
        ) : (
          <>
            Auf die Warteliste
            <ArrowRight className="ml-2 h-5 w-5" />
          </>
        )}
      </button>
      <p className="text-center text-xs text-gray-500">
        Mit der Eintragung akzeptieren Sie unsere{" "}
        <a href="/datenschutz" className="underline hover:text-gray-700">
          Datenschutzerklärung
        </a>
        .
      </p>
    </form>
  );
}
