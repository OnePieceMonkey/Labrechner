import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

// OpenAI Client wird lazy initialisiert (nicht bei Build-Zeit)
let openaiClient: OpenAI | null = null;

function getOpenAIClient(): OpenAI {
  if (!openaiClient) {
    openaiClient = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
  }
  return openaiClient;
}

// Rate Limiting (einfache In-Memory Lösung)
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT = 10; // Anfragen pro Minute
const RATE_WINDOW = 60000; // 1 Minute in ms

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const record = rateLimitMap.get(ip);

  if (!record || now > record.resetTime) {
    rateLimitMap.set(ip, { count: 1, resetTime: now + RATE_WINDOW });
    return true;
  }

  if (record.count >= RATE_LIMIT) {
    return false;
  }

  record.count++;
  return true;
}

// Typen
interface SuggestionRequest {
  context: string; // z.B. "Vollkrone Metall" oder "Brücke 3-gliedrig"
  region?: string; // KZV Region
  existingPositions?: string[]; // Bereits ausgewählte Positionen
  mode: 'positions' | 'template' | 'optimize';
}

interface BELSuggestion {
  positionCode: string;
  name: string;
  reason: string;
  confidence: number; // 0-1
}

interface SuggestionResponse {
  suggestions: BELSuggestion[];
  explanation: string;
}

// System Prompt für BEL-Expertise
const SYSTEM_PROMPT = `Du bist ein Experte für BEL II (Bundeseinheitliches Leistungsverzeichnis) für Zahntechniker in Deutschland.

Deine Aufgabe ist es, basierend auf dem Kontext passende BEL-Positionen vorzuschlagen.

Wichtige Regeln:
1. Schlage nur existierende BEL II Positionen vor (4-stellige Codes)
2. Berücksichtige die logische Reihenfolge der Arbeitsschritte
3. Denke an oft vergessene Nebenpositionen (Modelle, Hilfsmittel)
4. Bei Implantaten: Suffix 8 beachten
5. Bei UKPS (Unterkiefer-Prothesen-Schiene): Suffix 5 beachten

BEL-Gruppen zur Orientierung:
- 0: Modelle & Hilfsmittel (001-032)
- 1: Kronen & Brücken (101-145)
- 2: Verblendungen (201-220)
- 3: Prothetik (301-380)
- 4: Kombinationsarbeiten (401-441)
- 5: Kieferorthopädie (501-570)
- 7: Reparaturen (701-750)
- 8: Sonstiges (801-850)

Antworte IMMER im folgenden JSON-Format:
{
  "suggestions": [
    {
      "positionCode": "1021",
      "name": "Vollgusskrone",
      "reason": "Basis für metallische Kronen",
      "confidence": 0.95
    }
  ],
  "explanation": "Kurze Erklärung der Vorschläge"
}`;

export async function POST(request: NextRequest) {
  try {
    // Rate Limiting
    const ip = request.headers.get('x-forwarded-for') || 'unknown';
    if (!checkRateLimit(ip)) {
      return NextResponse.json(
        { error: 'Zu viele Anfragen. Bitte warten Sie eine Minute.' },
        { status: 429 }
      );
    }

    // API Key prüfen
    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: 'OpenAI API nicht konfiguriert' },
        { status: 500 }
      );
    }

    // Request Body parsen
    const body: SuggestionRequest = await request.json();

    if (!body.context || typeof body.context !== 'string') {
      return NextResponse.json(
        { error: 'Kontext ist erforderlich' },
        { status: 400 }
      );
    }

    // Sanitize Input
    const sanitizedContext = body.context.slice(0, 500).trim();
    const existingPositions = (body.existingPositions || [])
      .slice(0, 20)
      .map((p) => String(p).slice(0, 10));

    // User Prompt erstellen
    let userPrompt = `Kontext: "${sanitizedContext}"\n`;

    if (body.region) {
      userPrompt += `Region: ${body.region}\n`;
    }

    if (existingPositions.length > 0) {
      userPrompt += `Bereits ausgewählt: ${existingPositions.join(', ')}\n`;
    }

    switch (body.mode) {
      case 'positions':
        userPrompt += '\nSchlage passende BEL-Positionen vor (max 5).';
        break;
      case 'template':
        userPrompt += '\nErstelle eine vollständige Vorlage mit allen nötigen Positionen.';
        break;
      case 'optimize':
        userPrompt += '\nPrüfe die bestehenden Positionen und schlage Ergänzungen oder Optimierungen vor.';
        break;
      default:
        userPrompt += '\nSchlage passende BEL-Positionen vor (max 5).';
    }

    // OpenAI Client holen (lazy initialization)
    const openai = getOpenAIClient();

    // OpenAI API aufrufen
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: userPrompt },
      ],
      temperature: 0.3, // Niedrig für konsistente Ergebnisse
      max_tokens: 1000,
      response_format: { type: 'json_object' },
    });

    const content = completion.choices[0]?.message?.content;

    if (!content) {
      return NextResponse.json(
        { error: 'Keine Antwort von der KI erhalten' },
        { status: 500 }
      );
    }

    // JSON parsen
    let response: SuggestionResponse;
    try {
      response = JSON.parse(content);
    } catch {
      return NextResponse.json(
        { error: 'Ungültiges Antwortformat' },
        { status: 500 }
      );
    }

    // Validieren und bereinigen
    if (!response.suggestions || !Array.isArray(response.suggestions)) {
      response.suggestions = [];
    }

    response.suggestions = response.suggestions
      .filter((s) => s.positionCode && s.name)
      .slice(0, 10)
      .map((s) => ({
        positionCode: String(s.positionCode).slice(0, 10),
        name: String(s.name).slice(0, 200),
        reason: String(s.reason || '').slice(0, 300),
        confidence: Math.min(1, Math.max(0, Number(s.confidence) || 0.5)),
      }));

    response.explanation = String(response.explanation || '').slice(0, 500);

    return NextResponse.json(response);
  } catch (error) {
    console.error('AI Suggestion Error:', error);

    // Spezifische OpenAI Fehler behandeln
    if (error instanceof OpenAI.APIError) {
      if (error.status === 429) {
        return NextResponse.json(
          { error: 'OpenAI Rate Limit erreicht. Bitte später erneut versuchen.' },
          { status: 429 }
        );
      }
      if (error.status === 401) {
        return NextResponse.json(
          { error: 'OpenAI API-Schlüssel ungültig' },
          { status: 500 }
        );
      }
    }

    return NextResponse.json(
      { error: 'Fehler bei der KI-Verarbeitung' },
      { status: 500 }
    );
  }
}

// OPTIONS für CORS
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}
