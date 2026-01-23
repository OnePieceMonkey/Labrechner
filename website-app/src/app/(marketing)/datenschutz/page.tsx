import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Datenschutzerklärung | Labrechner",
  description: "Datenschutzerklärung für die Nutzung von Labrechner",
};

export default function DatenschutzPage() {
  return (
    <div className="container mx-auto max-w-4xl px-4 py-12">
      <h1 className="mb-8 text-3xl font-bold">Datenschutzerklärung</h1>

      <div className="prose prose-gray max-w-none dark:prose-invert">
        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4">1. Verantwortlicher</h2>
          <p className="mb-4 text-gray-700">
            Verantwortlicher im Sinne der Datenschutz-Grundverordnung (DSGVO):
          </p>
          <p className="mb-4">
            <strong>Patrick Werle</strong><br />
            E-Mail: datenschutz@labrechner.de
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4">2. Übersicht der Datenverarbeitung</h2>

          <h3 className="text-lg font-medium mb-2">Arten der verarbeiteten Daten</h3>
          <ul className="list-disc list-inside mb-4 text-gray-700">
            <li>Bestandsdaten (z.B. Namen, E-Mail-Adressen)</li>
            <li>Nutzungsdaten (z.B. besuchte Seiten, Zugriffszeit)</li>
            <li>Meta-/Kommunikationsdaten (z.B. Geräte-Informationen, IP-Adressen)</li>
          </ul>

          <h3 className="text-lg font-medium mb-2">Kategorien betroffener Personen</h3>
          <ul className="list-disc list-inside mb-4 text-gray-700">
            <li>Nutzer der Webanwendung (Zahntechniker, Laborinhaber, Abrechnungsmitarbeiter)</li>
            <li>Interessenten (Wartelisten-Anmeldungen)</li>
          </ul>

          <h3 className="text-lg font-medium mb-2">Zwecke der Verarbeitung</h3>
          <ul className="list-disc list-inside text-gray-700">
            <li>Bereitstellung der Webanwendung und ihrer Funktionen</li>
            <li>Beantwortung von Kontaktanfragen</li>
            <li>Sicherheitsmaßnahmen</li>
            <li>Reichweitenmessung (anonymisiert)</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4">3. Rechtsgrundlagen</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full border border-gray-200 rounded-lg">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2 text-left text-sm font-medium">Rechtsgrundlage</th>
                  <th className="px-4 py-2 text-left text-sm font-medium">Anwendung</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                <tr>
                  <td className="px-4 py-2 text-sm">Art. 6 Abs. 1 lit. a DSGVO</td>
                  <td className="px-4 py-2 text-sm text-gray-600">Einwilligung (z.B. Wartelisten-Anmeldung)</td>
                </tr>
                <tr>
                  <td className="px-4 py-2 text-sm">Art. 6 Abs. 1 lit. b DSGVO</td>
                  <td className="px-4 py-2 text-sm text-gray-600">Vertragserfüllung (z.B. Nutzung der App)</td>
                </tr>
                <tr>
                  <td className="px-4 py-2 text-sm">Art. 6 Abs. 1 lit. f DSGVO</td>
                  <td className="px-4 py-2 text-sm text-gray-600">Berechtigte Interessen (z.B. Sicherheit)</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4">4. Welche Daten wir erheben</h2>

          <h3 className="text-lg font-medium mb-2">4.1 Bei der Nutzung der Website</h3>
          <p className="mb-4 text-gray-700">
            Bei jedem Zugriff werden automatisch folgende Daten erhoben: IP-Adresse (anonymisiert),
            Datum und Uhrzeit, Browsertyp, Betriebssystem, Referrer-URL. Diese Daten werden
            nach 30 Tagen automatisch gelöscht.
          </p>

          <h3 className="text-lg font-medium mb-2">4.2 Bei der Registrierung</h3>
          <ul className="list-disc list-inside mb-4 text-gray-700">
            <li>E-Mail-Adresse (für Magic-Link-Login)</li>
            <li>Benutzereinstellungen (gewählte KZV-Region, Labor-Typ)</li>
          </ul>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-4">
            <h4 className="font-medium text-blue-900 mb-2">Hinweis zu BEL-Daten</h4>
            <p className="text-blue-800 text-sm">
              Die in Labrechner angezeigten BEL-Preise sind öffentlich verfügbare Informationen
              der Kassenzahnärztlichen Vereinigungen. Es handelt sich nicht um personenbezogene
              Daten oder Gesundheitsdaten im Sinne der DSGVO.
            </p>
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4">5. Auftragsverarbeiter</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full border border-gray-200 rounded-lg">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2 text-left text-sm font-medium">Anbieter</th>
                  <th className="px-4 py-2 text-left text-sm font-medium">Zweck</th>
                  <th className="px-4 py-2 text-left text-sm font-medium">Standort</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                <tr>
                  <td className="px-4 py-2 text-sm font-medium">Supabase Inc.</td>
                  <td className="px-4 py-2 text-sm text-gray-600">Datenbank, Authentifizierung</td>
                  <td className="px-4 py-2 text-sm text-gray-600">EU (Frankfurt)</td>
                </tr>
                <tr>
                  <td className="px-4 py-2 text-sm font-medium">Vercel Inc.</td>
                  <td className="px-4 py-2 text-sm text-gray-600">Hosting, CDN</td>
                  <td className="px-4 py-2 text-sm text-gray-600">EU</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="text-sm text-gray-600 mt-2">
            Mit allen Auftragsverarbeitern haben wir Verträge gemäß Art. 28 DSGVO abgeschlossen.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4">6. Speicherdauer</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full border border-gray-200 rounded-lg">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2 text-left text-sm font-medium">Datenart</th>
                  <th className="px-4 py-2 text-left text-sm font-medium">Speicherdauer</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                <tr>
                  <td className="px-4 py-2 text-sm">Account-Daten</td>
                  <td className="px-4 py-2 text-sm text-gray-600">Bis zur Löschung des Accounts</td>
                </tr>
                <tr>
                  <td className="px-4 py-2 text-sm">Wartelisten-Daten</td>
                  <td className="px-4 py-2 text-sm text-gray-600">Bis zum Widerspruch oder 2 Jahre</td>
                </tr>
                <tr>
                  <td className="px-4 py-2 text-sm">Technische Logs</td>
                  <td className="px-4 py-2 text-sm text-gray-600">30 Tage</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4">7. Ihre Rechte</h2>
          <p className="mb-4 text-gray-700">Sie haben folgende Rechte bezüglich Ihrer personenbezogenen Daten:</p>
          <ul className="list-disc list-inside space-y-2 text-gray-700">
            <li><strong>Auskunftsrecht</strong> (Art. 15 DSGVO) - Auskunft über Ihre verarbeiteten Daten</li>
            <li><strong>Berichtigung</strong> (Art. 16 DSGVO) - Berichtigung unrichtiger Daten</li>
            <li><strong>Löschung</strong> (Art. 17 DSGVO) - Löschung Ihrer Daten</li>
            <li><strong>Einschränkung</strong> (Art. 18 DSGVO) - Einschränkung der Verarbeitung</li>
            <li><strong>Datenübertragbarkeit</strong> (Art. 20 DSGVO) - Daten in maschinenlesbarem Format</li>
            <li><strong>Widerspruch</strong> (Art. 21 DSGVO) - Widerspruch gegen die Verarbeitung</li>
          </ul>
          <p className="mt-4 text-gray-700">
            <strong>Kontakt für Anfragen:</strong>{" "}
            <a href="mailto:datenschutz@labrechner.de" className="text-violet-600 hover:underline">
              datenschutz@labrechner.de
            </a>
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4">8. Cookies</h2>
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <p className="text-green-900 mb-2">
              <strong>Labrechner verwendet keine Marketing- oder Tracking-Cookies.</strong>
            </p>
            <p className="text-green-800 text-sm">
              Es werden ausschließlich technisch notwendige Cookies für die Authentifizierung
              (Session-Cookie) verwendet. Da wir keine Tracking-Cookies verwenden, ist kein
              Cookie-Consent-Banner erforderlich.
            </p>
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4">9. Sicherheit</h2>
          <ul className="list-disc list-inside space-y-2 text-gray-700">
            <li><strong>Verschlüsselung:</strong> Alle Datenübertragungen erfolgen über TLS/HTTPS</li>
            <li><strong>Passwortlos:</strong> Wir speichern keine Passwörter (Magic-Link-Authentifizierung)</li>
            <li><strong>EU-Hosting:</strong> Alle Daten werden auf Servern in der EU gespeichert</li>
            <li><strong>Zugriffskontrolle:</strong> Strenge Zugriffsrechte auf Datenbanken</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4">10. Beschwerderecht</h2>
          <p className="text-gray-700">
            Sie haben das Recht, sich bei einer Datenschutz-Aufsichtsbehörde zu beschweren.
          </p>
        </section>

        <p className="text-sm text-gray-500 mt-8">
          Stand: Januar 2026
        </p>
      </div>
    </div>
  );
}
