import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Impressum | Labrechner",
  description: "Impressum und rechtliche Angaben für Labrechner",
};

export default function ImpressumPage() {
  return (
    <div className="container mx-auto max-w-4xl px-4 py-12">
      <h1 className="mb-8 text-3xl font-bold">Impressum</h1>

      <div className="prose prose-gray max-w-none dark:prose-invert">
        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Angaben gemäß § 5 TMG</h2>
          <p className="mb-4">
            <strong>Patrick Werle</strong><br />
            [Adresse auf Anfrage]<br />
            Deutschland
          </p>
          <p className="mb-4">
            <strong>Kontakt:</strong><br />
            E-Mail: kontakt@labrechner.de
          </p>
          <p className="mb-4">
            <strong>Umsatzsteuer:</strong><br />
            Kleinunternehmer gemäß § 19 UStG<br />
            <span className="text-sm text-gray-600">(Keine Umsatzsteuer wird ausgewiesen)</span>
          </p>
          <p>
            <strong>Verantwortlich für den Inhalt nach § 55 Abs. 2 RStV:</strong><br />
            Patrick Werle
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Haftungsausschluss</h2>

          <h3 className="text-lg font-medium mb-2">Haftung für Inhalte</h3>
          <p className="mb-4 text-gray-700">
            Die Inhalte unserer Seiten wurden mit größter Sorgfalt erstellt. Für die Richtigkeit,
            Vollständigkeit und Aktualität der Inhalte können wir jedoch keine Gewähr übernehmen.
            Als Diensteanbieter sind wir gemäß § 7 Abs.1 TMG für eigene Inhalte auf diesen Seiten
            nach den allgemeinen Gesetzen verantwortlich. Nach §§ 8 bis 10 TMG sind wir als
            Diensteanbieter jedoch nicht verpflichtet, übermittelte oder gespeicherte fremde
            Informationen zu überwachen oder nach Umständen zu forschen, die auf eine rechtswidrige
            Tätigkeit hinweisen.
          </p>

          <h3 className="text-lg font-medium mb-2">Haftung für Links</h3>
          <p className="mb-4 text-gray-700">
            Unser Angebot enthält Links zu externen Websites Dritter, auf deren Inhalte wir keinen
            Einfluss haben. Deshalb können wir für diese fremden Inhalte auch keine Gewähr übernehmen.
            Für die Inhalte der verlinkten Seiten ist stets der jeweilige Anbieter oder Betreiber
            der Seiten verantwortlich.
          </p>

          <h3 className="text-lg font-medium mb-2">Urheberrecht</h3>
          <p className="mb-4 text-gray-700">
            Die durch die Seitenbetreiber erstellten Inhalte und Werke auf diesen Seiten unterliegen
            dem deutschen Urheberrecht. Die Vervielfältigung, Bearbeitung, Verbreitung und jede Art
            der Verwertung außerhalb der Grenzen des Urheberrechtes bedürfen der schriftlichen
            Zustimmung des jeweiligen Autors bzw. Erstellers.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Hinweis zum KI-Assistenten</h2>
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
            <p className="text-amber-900 mb-2">
              Der integrierte KI-Assistent dient ausschließlich als Orientierungshilfe für allgemeine
              Fragen zur BEL-Abrechnung.
            </p>
            <ul className="list-disc list-inside text-amber-800 text-sm space-y-1">
              <li>Die Antworten ersetzen keine professionelle Abrechnungsberatung</li>
              <li>Für verbindliche Auskünfte wenden Sie sich an Ihre zuständige KZV</li>
              <li>Wir übernehmen keine Haftung für die Richtigkeit der KI-Antworten</li>
              <li>Im Zweifelsfall prüfen Sie die offiziellen BEL-Unterlagen</li>
            </ul>
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Streitschlichtung</h2>
          <p className="mb-4 text-gray-700">
            Die Europäische Kommission stellt eine Plattform zur Online-Streitbeilegung (OS) bereit:{" "}
            <a
              href="https://ec.europa.eu/consumers/odr/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-violet-600 hover:underline"
            >
              https://ec.europa.eu/consumers/odr/
            </a>
          </p>
          <p className="text-gray-700">
            Wir sind nicht bereit oder verpflichtet, an Streitbeilegungsverfahren vor einer
            Verbraucherschlichtungsstelle teilzunehmen.
          </p>
        </section>

        <p className="text-sm text-gray-500 mt-8">
          Stand: Januar 2026
        </p>
      </div>
    </div>
  );
}
