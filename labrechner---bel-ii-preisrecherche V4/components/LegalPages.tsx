import React from 'react';
import { ArrowLeft } from 'lucide-react';

interface LegalPageProps {
    onBack: () => void;
}

const Layout: React.FC<LegalPageProps & { title: string; children: React.ReactNode }> = ({ onBack, title, children }) => (
    <div className="min-h-screen bg-white dark:bg-slate-950 pt-32 pb-20 px-6">
        <div className="max-w-3xl mx-auto">
            <button onClick={onBack} className="flex items-center gap-2 text-slate-500 hover:text-brand-600 transition-colors mb-8">
                <ArrowLeft className="w-4 h-4" /> Zurück zur Startseite
            </button>
            <h1 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-10">{title}</h1>
            <div className="prose prose-slate dark:prose-invert max-w-none">
                {children}
            </div>
        </div>
    </div>
);

export const Impressum: React.FC<LegalPageProps> = (props) => (
    <Layout {...props} title="Impressum">
        <p>Angaben gemäß § 5 TMG</p>
        <p>
            <strong>Labrechner GmbH (Musterfirma)</strong><br />
            Musterstraße 123<br />
            12345 Musterstadt<br />
            Deutschland
        </p>
        <p>
            <strong>Vertreten durch:</strong><br />
            Max Mustermann
        </p>
        <p>
            <strong>Kontakt:</strong><br />
            Telefon: +49 (0) 123 456789<br />
            E-Mail: info@labrechner.de
        </p>
        <p>
            <strong>Registereintrag:</strong><br />
            Eintragung im Handelsregister.<br />
            Registergericht: Amtsgericht Musterstadt<br />
            Registernummer: HRB 12345
        </p>
        <p>
            <strong>Umsatzsteuer-ID:</strong><br />
            Umsatzsteuer-Identifikationsnummer gemäß §27 a Umsatzsteuergesetz:<br />
            DE 123 456 789
        </p>
    </Layout>
);

export const Datenschutz: React.FC<LegalPageProps> = (props) => (
    <Layout {...props} title="Datenschutzerklärung">
        <h3>1. Datenschutz auf einen Blick</h3>
        <p>
            <strong>Allgemeine Hinweise</strong><br />
            Die folgenden Hinweise geben einen einfachen Überblick darüber, was mit Ihren personenbezogenen Daten passiert, wenn Sie diese Website besuchen.
        </p>
        <h3>2. Hosting</h3>
        <p>
            Wir hosten die Inhalte unserer Website bei folgendem Anbieter:<br />
            Vercel Inc., 340 S Lemon Ave #4133 Walnut, CA 91789, USA.
        </p>
        <h3>3. Allgemeine Hinweise und Pflichtinformationen</h3>
        <p>
            <strong>Datenschutz</strong><br />
            Die Betreiber dieser Seiten nehmen den Schutz Ihrer persönlichen Daten sehr ernst. Wir behandeln Ihre personenbezogenen Daten vertraulich und entsprechend der gesetzlichen Datenschutzvorschriften sowie dieser Datenschutzerklärung.
        </p>
        <p>
            <strong>Hinweis zur verantwortlichen Stelle</strong><br />
            Die verantwortliche Stelle für die Datenverarbeitung auf dieser Website ist:<br />
            Labrechner GmbH<br />
            Musterstraße 123<br />
            12345 Musterstadt
        </p>
    </Layout>
);

export const AGB: React.FC<LegalPageProps> = (props) => (
    <Layout {...props} title="Allgemeine Geschäftsbedingungen (AGB)">
        <h3>§ 1 Geltungsbereich</h3>
        <p>
            Für die Geschäftsbeziehung zwischen der Labrechner GmbH (nachfolgend „Anbieter“) und dem Kunden (nachfolgend „Kunde“) gelten ausschließlich die nachfolgenden Allgemeinen Geschäftsbedingungen in ihrer zum Zeitpunkt der Bestellung gültigen Fassung.
        </p>
        <h3>§ 2 Vertragsschluss</h3>
        <p>
            Der Kunde kann aus dem Sortiment des Anbieters Produkte (Software-Abonnements) auswählen und diese über den Button „kostenpflichtig bestellen“ in einem sogenannten Warenkorb sammeln. Über den Button „kostenpflichtig bestellen“ gibt er einen verbindlichen Antrag zum Kauf der im Warenkorb befindlichen Waren ab.
        </p>
        <h3>§ 3 Preise und Versandkosten</h3>
        <p>
            Alle Preise, die auf der Website des Anbieters angegeben sind, verstehen sich zuzüglich der jeweils gültigen gesetzlichen Umsatzsteuer, sofern es sich um B2B-Geschäfte handelt.
        </p>
        <h3>§ 4 Laufzeit und Kündigung</h3>
        <p>
            Abonnements werden auf unbestimmte Zeit geschlossen. Die Kündigungsfrist beträgt 30 Tage zum Monatsende bzw. zum Ende des Abrechnungszeitraums.
        </p>
    </Layout>
);