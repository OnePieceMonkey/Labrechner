import React from 'react';

export const AIDisclaimerContent = () => {
  return (
    <div className="prose prose-sm prose-slate dark:prose-invert max-w-none">
      <div className="bg-amber-50 dark:bg-amber-900/20 p-4 rounded-lg border border-amber-200 dark:border-amber-800 mb-6">
        <h4 className="text-amber-800 dark:text-amber-200 m-0 flex items-center gap-2">
          ⚠️ Wichtiger Hinweis
        </h4>
        <p className="text-amber-700 dark:text-amber-300 m-0 mt-1">
          Der KI-Assistent dient ausschließlich als Orientierungshilfe.
        </p>
      </div>

      <h4>Funktionsweise und Limitationen</h4>
      <p>
        Der in Labrechner integrierte KI-Assistent nutzt fortschrittliche Sprachmodelle (OpenAI), um Sie bei der Suche nach BEL-Positionen und der Erstellung von Abrechnungsvorschlägen zu unterstützen.
      </p>

      <h4>Bitte beachten Sie zwingend:</h4>
      <ol className="list-decimal pl-5 space-y-2">
        <li>
          <strong>Keine Rechtsverbindlichkeit:</strong> Die Antworten der KI stellen keine rechtsverbindliche Auskunft dar. Maßgeblich sind immer die offiziellen Preislisten und Bestimmungen Ihrer zuständigen KZV.
        </li>
        <li>
          <strong>Prüfungspflicht:</strong> Sie sind als verantwortlicher Zahntechniker verpflichtet, jeden Vorschlag der KI auf fachliche Richtigkeit und Plausibilität zu prüfen, bevor Sie diesen für Abrechnungen verwenden.
        </li>
        <li>
          <strong>Fehleranfälligkeit:</strong> Wie bei jeder KI-Technologie können "Halluzinationen" (falsche Fakten) auftreten. Verlassen Sie sich nicht blind auf die ausgegebenen Werte.
        </li>
      </ol>

      <h4>Datenverarbeitung</h4>
      <p>
        Bei Nutzung der KI-Funktionen werden Ihre Eingaben (Suchanfragen, Kontext) an OpenAI übermittelt, um die Antwort zu generieren. 
        <br />
        <strong>Es werden keine personenbezogenen Daten von Patienten an die KI übermittelt.</strong>
      </p>
    </div>
  );
};
