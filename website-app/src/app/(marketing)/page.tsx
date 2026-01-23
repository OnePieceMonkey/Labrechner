import Link from "next/link";
import { Search, Zap, MapPin, MessageSquare, ArrowRight } from "lucide-react";
import { WaitlistForm } from "@/components/layout/WaitlistForm";

export default function LandingPage() {
  return (
    <>
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-primary-50 to-white py-20 lg:py-32">
        <div className="container-wide">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl lg:text-6xl">
              BEL-Preise in{" "}
              <span className="text-primary">Sekunden</span> finden
            </h1>
            <p className="mt-6 text-lg leading-8 text-gray-600 sm:text-xl">
              Aktuelle BEL-II-Höchstpreise für alle 17 KZV-Regionen. Immer
              aktuell, immer korrekt – für Dentallabore, die Zeit sparen wollen.
            </p>
            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link
                href="/app"
                className="btn-primary px-8 py-3 text-lg shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30"
              >
                Jetzt kostenlos testen
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
              <a
                href="#features"
                className="btn-ghost px-8 py-3 text-lg text-gray-600"
              >
                Mehr erfahren
              </a>
            </div>
          </div>
        </div>

        {/* Decorative gradient */}
        <div className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80">
          <div
            className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-primary to-primary-light opacity-20 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"
            style={{
              clipPath:
                "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
            }}
          />
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 lg:py-28">
        <div className="container-wide">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Alles, was Ihr Labor braucht
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              Schnell, zuverlässig und immer auf dem neuesten Stand.
            </p>
          </div>

          <div className="mx-auto mt-16 grid max-w-5xl grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {/* Feature 1 */}
            <div className="card text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-lg bg-primary-100">
                <Search className="h-6 w-6 text-primary" />
              </div>
              <h3 className="mt-4 text-lg font-semibold text-gray-900">
                Schnelle Suche
              </h3>
              <p className="mt-2 text-sm text-gray-600">
                Finden Sie jede BEL-Position in Sekunden – nach Nummer oder
                Bezeichnung.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="card text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-lg bg-primary-100">
                <MapPin className="h-6 w-6 text-primary" />
              </div>
              <h3 className="mt-4 text-lg font-semibold text-gray-900">
                17 KZV-Regionen
              </h3>
              <p className="mt-2 text-sm text-gray-600">
                Alle regionalen Höchstpreise auf einen Blick – von Bayern bis
                Schleswig-Holstein.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="card text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-lg bg-primary-100">
                <Zap className="h-6 w-6 text-primary" />
              </div>
              <h3 className="mt-4 text-lg font-semibold text-gray-900">
                Immer aktuell
              </h3>
              <p className="mt-2 text-sm text-gray-600">
                BEL-II-Preise ab 01.01.2026 bereits integriert. Automatische
                Updates.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="card text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-lg bg-primary-100">
                <MessageSquare className="h-6 w-6 text-primary" />
              </div>
              <h3 className="mt-4 text-lg font-semibold text-gray-900">
                KI-Assistent
              </h3>
              <p className="mt-2 text-sm text-gray-600">
                Fragen zur Abrechnung? Unser KI-Chat hilft bei
                Positionsauswahl und Tipps.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA / Waitlist Section */}
      <section className="bg-gray-50 py-20 lg:py-28">
        <div className="container-wide">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Bereit, Zeit zu sparen?
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              Tragen Sie sich in unsere Warteliste ein und erhalten Sie als
              Erster Zugang zur Beta-Version.
            </p>

            <div className="mt-8">
              <WaitlistForm />
            </div>

            <p className="mt-4 text-sm text-gray-500">
              Kostenlos für Beta-Tester. Keine Kreditkarte erforderlich.
            </p>
          </div>
        </div>
      </section>

      {/* Trust Section */}
      <section className="py-16">
        <div className="container-wide">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-sm font-medium uppercase tracking-wider text-gray-500">
              Entwickelt für deutsche Dentallabore
            </p>
            <div className="mt-6 flex flex-wrap items-center justify-center gap-8 text-gray-400">
              <span className="text-lg font-semibold">BEL II 2026</span>
              <span className="hidden sm:inline">•</span>
              <span className="text-lg font-semibold">DSGVO-konform</span>
              <span className="hidden sm:inline">•</span>
              <span className="text-lg font-semibold">Made in Germany</span>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
