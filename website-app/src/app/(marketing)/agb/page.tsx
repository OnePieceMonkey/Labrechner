import { Metadata } from "next";

export const metadata: Metadata = {
  title: "AGB | Labrechner",
  description: "Allgemeine Geschäftsbedingungen für die Nutzung von Labrechner",
};

export default function AGBPage() {
  return (
    <div className="container mx-auto max-w-4xl px-4 py-12">
      <h1 className="mb-8 text-3xl font-bold">Allgemeine Geschäftsbedingungen (AGB)</h1>

      <div className="prose prose-gray max-w-none dark:prose-invert">
        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4">1. Geltungsbereich</h2>
          <p className="mb-4 text-gray-700">
            Diese Allgemeinen Geschäftsbedingungen gelten für die Nutzung der Webanwendung
            "Labrechner", bereitgestellt von Patrick Werle.
          </p>
          <p className="mb-4 text-gray-700">
            Der Dienst richtet sich ausschließlich an Unternehmer im Sinne des § 14 BGB (B2B),
            insbesondere Zahntechniklabore, Dentallabore und Zahnarztpraxen mit Praxislabor.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4">2. Leistungsbeschreibung</h2>
          <p className="mb-4 text-gray-700">Labrechner bietet folgende Funktionen:</p>
          <ul className="list-disc list-inside space-y-2 text-gray-700 mb-4">
            <li><strong>BEL-Suche:</strong> Durchsuchen der BEL-II-Positionen nach Positionsnummer oder Bezeichnung</li>
            <li><strong>Preisanzeige:</strong> Anzeige der aktuellen Höchstpreise für alle 17 KZV-Regionen</li>
            <li><strong>Filter:</strong> Filterung nach KZV-Region und Labor-Typ (Praxislabor/Gewerbelabor)</li>
            <li><strong>KI-Assistent:</strong> Beantwortung allgemeiner Fragen zur BEL-Abrechnung (Orientierungshilfe)</li>
          </ul>
          <p className="text-gray-700">
            Der Anbieter bemüht sich, die BEL-Preisdaten aktuell zu halten. Die Daten stammen aus
            den öffentlich verfügbaren Preislisten der Kassenzahnärztlichen Vereinigungen (KZVen).
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4">3. Keine Rechts- oder Abrechnungsberatung</h2>
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
            <p className="text-amber-900 font-medium mb-2">Wichtiger Hinweis:</p>
            <p className="text-amber-800 mb-4">
              Die über Labrechner bereitgestellten Informationen und KI-Antworten stellen
              <strong> keine verbindliche Auskunft</strong> dar.
            </p>
            <p className="text-amber-800 mb-2">Die Nutzung von Labrechner ersetzt nicht:</p>
            <ul className="list-disc list-inside text-amber-700 space-y-1">
              <li>Die Prüfung der offiziellen BEL-Unterlagen</li>
              <li>Die Rücksprache mit der zuständigen KZV</li>
              <li>Eine professionelle Abrechnungsberatung</li>
            </ul>
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4">4. Registrierung und Nutzerkonto</h2>
          <p className="mb-4 text-gray-700">
            Für die Nutzung bestimmter Funktionen ist eine Registrierung erforderlich.
            Die Registrierung erfolgt über einen Magic-Link per E-Mail.
          </p>
          <p className="text-gray-700">
            Der Nutzer gewährleistet, dass die bei der Registrierung angegebenen Daten
            korrekt und vollständig sind.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4">5. Nutzungsrechte</h2>
          <p className="mb-4 text-gray-700">
            Der Anbieter räumt dem Nutzer ein nicht-ausschließliches, nicht übertragbares
            Recht zur Nutzung des Dienstes ein.
          </p>
          <p className="mb-2 text-gray-700">Der Nutzer ist nicht berechtigt:</p>
          <ul className="list-disc list-inside space-y-1 text-gray-700">
            <li>Den Dienst für rechtswidrige Zwecke zu nutzen</li>
            <li>Automatisierte Abfragen durchzuführen (Scraping)</li>
            <li>Den Dienst Dritten entgeltlich zugänglich zu machen</li>
            <li>Die Sicherheitsmaßnahmen des Dienstes zu umgehen</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4">6. Preise und Zahlung</h2>
          <div className="bg-violet-50 border border-violet-200 rounded-lg p-4">
            <p className="text-violet-900 font-medium mb-2">Beta-Phase</p>
            <p className="text-violet-800">
              Während der Beta-Phase ist die Nutzung von Labrechner <strong>kostenlos</strong>.
            </p>
          </div>
          <p className="mt-4 text-gray-600 text-sm">
            Über zukünftige Preismodelle werden registrierte Nutzer rechtzeitig informiert.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4">7. Verfügbarkeit und Support</h2>
          <p className="mb-4 text-gray-700">
            Der Anbieter bemüht sich um eine hohe Verfügbarkeit des Dienstes.
            Eine garantierte Verfügbarkeit wird nicht zugesichert.
          </p>
          <p className="text-gray-700">
            Support erfolgt per E-Mail an{" "}
            <a href="mailto:support@labrechner.de" className="text-violet-600 hover:underline">
              support@labrechner.de
            </a>.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4">8. Haftungsbeschränkung</h2>
          <p className="mb-4 text-gray-700">
            Der Anbieter haftet unbeschränkt für Schäden aus der Verletzung des Lebens,
            des Körpers oder der Gesundheit sowie für vorsätzlich oder grob fahrlässig
            verursachte Schäden.
          </p>
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mt-4">
            <p className="text-red-900 font-medium mb-2">Haftungsausschlüsse:</p>
            <ul className="list-disc list-inside text-red-800 space-y-1 text-sm">
              <li>
                <strong>Datenrichtigkeit:</strong> Der Anbieter haftet nicht für Schäden aus
                der Unrichtigkeit der angezeigten BEL-Preise. Die maßgeblichen Preise sind
                den offiziellen Veröffentlichungen der jeweiligen KZV zu entnehmen.
              </li>
              <li>
                <strong>KI-Antworten:</strong> Der Anbieter haftet nicht für Schäden aus der
                Nutzung von Antworten des KI-Assistenten.
              </li>
            </ul>
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4">9. Datenschutz</h2>
          <p className="text-gray-700">
            Die Verarbeitung personenbezogener Daten erfolgt gemäß unserer{" "}
            <a href="/datenschutz" className="text-violet-600 hover:underline">
              Datenschutzerklärung
            </a>.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4">10. Vertragslaufzeit und Kündigung</h2>
          <ul className="list-disc list-inside space-y-2 text-gray-700">
            <li>Der Vertrag wird auf unbestimmte Zeit geschlossen.</li>
            <li>Beide Parteien können den Vertrag jederzeit mit einer Frist von 14 Tagen kündigen.</li>
            <li>Der Nutzer kann sein Konto jederzeit in den Einstellungen löschen.</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4">11. Änderungen der AGB</h2>
          <p className="text-gray-700">
            Der Anbieter behält sich vor, diese AGB mit Wirkung für die Zukunft zu ändern.
            Änderungen werden dem Nutzer per E-Mail mitgeteilt. Widerspricht der Nutzer nicht
            innerhalb von 30 Tagen, gelten die Änderungen als akzeptiert.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4">12. Schlussbestimmungen</h2>
          <ul className="list-disc list-inside space-y-2 text-gray-700">
            <li>Es gilt das Recht der Bundesrepublik Deutschland unter Ausschluss des UN-Kaufrechts.</li>
            <li>Sollten einzelne Bestimmungen dieser AGB unwirksam sein, bleibt die Wirksamkeit der übrigen Bestimmungen unberührt.</li>
          </ul>
        </section>

        <p className="text-sm text-gray-500 mt-8">
          Stand: Januar 2026
        </p>
      </div>
    </div>
  );
}
