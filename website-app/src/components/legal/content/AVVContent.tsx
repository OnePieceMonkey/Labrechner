import React from 'react';

export const AVVContent = () => {
  return (
    <div className="prose prose-sm prose-slate dark:prose-invert max-w-none">
      <h3>Vertrag zur Auftragsverarbeitung (AVV)</h3>
      <p className="text-xs text-slate-500">gemäß Art. 28 DSGVO</p>

      <h4>1. Gegenstand und Dauer des Auftrags</h4>
      <p>
        Dieser Vertrag regelt die Rechte und Pflichten der Parteien im Rahmen der Verarbeitung personenbezogener Daten durch den Auftragnehmer (Labrechner) für den Auftraggeber (Nutzer/Labor) im Zusammenhang mit der Nutzung der Software "Labrechner".
      </p>

      <h4>2. Art und Zweck der Verarbeitung</h4>
      <p>
        Die Verarbeitung erfolgt zum Zweck der Bereitstellung einer Softwarelösung für die Kalkulation zahntechnischer Leistungen, die Erstellung von Kostenvoranschlägen und Rechnungen sowie die Verwaltung von Kundenstammdaten.
      </p>
      <p>
        <strong>Art der Daten:</strong>
        <ul className="list-disc pl-5">
          <li>Stammdaten (Namen, Adressen von Zahnärzten/Praxen)</li>
          <li>Abrechnungsdaten (Leistungsziffern, Preise)</li>
          <li>Ggf. Fallnummern oder Pseudonyme von Patienten (keine Klarnamen erforderlich)</li>
        </ul>
      </p>

      <h4>3. Pflichten des Auftragnehmers</h4>
      <p>
        Der Auftragnehmer verpflichtet sich, Daten nur auf dokumentierte Weisung des Auftraggebers zu verarbeiten. Er garantiert, dass sich die zur Verarbeitung der personenbezogenen Daten befugten Personen zur Vertraulichkeit verpflichtet haben.
      </p>

      <h4>4. Sicherheit der Verarbeitung (TOMs)</h4>
      <p>
        Der Auftragnehmer ergreift geeignete technische und organisatorische Maßnahmen gemäß Art. 32 DSGVO, um ein dem Risiko angemessenes Schutzniveau zu gewährleisten. Dazu gehören u.a. Verschlüsselung (TLS/SSL), Zugriffskontrollen und regelmäßige Backups. Hosting erfolgt auf Servern in der EU (oder in Ländern mit Angemessenheitsbeschluss).
      </p>

      <h4>5. Unterauftragnehmer</h4>
      <p>
        Der Auftraggeber stimmt der Beauftragung folgender Unterauftragnehmer zu:
        <ul className="list-disc pl-5">
          <li>Supabase Inc. (Datenbank/Hosting)</li>
          <li>Vercel Inc. (Hosting)</li>
          <li>Stripe Inc. (Zahlungsabwicklung)</li>
          <li>OpenAI (nur bei aktiver Nutzung der KI-Funktionen)</li>
        </ul>
      </p>

      <div className="bg-slate-100 dark:bg-slate-800 p-4 rounded-lg mt-4 border border-slate-200 dark:border-slate-700">
        <p className="font-semibold text-sm">Bestätigung</p>
        <p className="text-sm">
          Durch Klicken auf "AVV akzeptieren" schließen Sie diesen Vertrag elektronisch ab. Ein unterzeichnetes Exemplar können Sie jederzeit in Ihren Einstellungen herunterladen.
        </p>
      </div>
    </div>
  );
};
