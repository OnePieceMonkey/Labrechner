import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.4";

type FeedbackRow = {
  id: string;
  user_id: string | null;
  email: string | null;
  rating: number | null;
  feedback_type: string | null;
  message: string;
  answers: unknown | null;
  context: unknown | null;
  source: string | null;
  page_url: string | null;
  status: string | null;
  tags: string[] | null;
  created_at: string;
  lab_name: string | null;
  contact_name: string | null;
};

const SUPABASE_URL = Deno.env.get("SUPABASE_URL") ?? "";
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";
const TELEGRAM_BOT_TOKEN = Deno.env.get("TELEGRAM_BOT_TOKEN") ?? "";
const TELEGRAM_CHAT_ID = Deno.env.get("TELEGRAM_CHAT_ID") ?? "";
const TELEGRAM_MAX_ITEMS = Number(Deno.env.get("TELEGRAM_MAX_ITEMS") ?? "20");

function escapeMarkdownV2(text: string): string {
  return text.replace(/([\\_*[\]()~`>#+\-=|{}.!])/g, "\\$1");
}

function truncate(text: string, max: number): string {
  if (text.length <= max) return text;
  return text.slice(0, Math.max(0, max - 3)) + "\\.\\.\\."
}

function safe(value: unknown, fallback = "n/a"): string {
  if (value === null || value === undefined || value === "") {
    return escapeMarkdownV2(fallback);
  }
  return escapeMarkdownV2(String(value));
}

function stringifyCompact(value: unknown): string {
  if (!value) return "";
  try {
    return JSON.stringify(value);
  } catch {
    return "";
  }
}

function formatFeedback(row: FeedbackRow): string {
  const whoParts = [
    row.contact_name ?? "",
    row.lab_name ?? "",
    row.email ?? "",
  ].filter(Boolean);
  const who = whoParts.length > 0 ? whoParts.join(" | ") : "n/a";

  const contextSnippet = stringifyCompact(row.context);
  const answersSnippet = stringifyCompact(row.answers);
  const extra = [contextSnippet, answersSnippet].filter(Boolean).join(" | ");

  const lines = [
    "*NEUER BUG \\(Beta\\-Feedback\\)*",
    `*ID:* ${safe(row.id)}`,
    `*Zeit:* ${safe(row.created_at)}`,
    `*Typ:* ${safe(row.feedback_type)}`,
    `*Bewertung:* ${safe(row.rating ?? "n/a")}`,
    `*Von:* ${safe(who)}`,
    `*Seite:* ${safe(row.page_url ?? "n/a")}`,
    `*Nachricht:* ${safe(row.message)}`,
    `*Tags:* ${safe(row.tags?.join(", ") ?? "n/a")}`,
  ];

  if (extra) {
    lines.push(`*Kontext:* ${safe(truncate(extra, 400))}`);
  }

  return truncate(lines.join("\n"), 3800);
}

serve(async (req) => {
  // CORS headers für manuelle Tests
  const headers = {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
  };

  if (req.method === "OPTIONS") {
    return new Response(null, { headers });
  }

  // Debug: Welche Env-Vars sind gesetzt?
  const envCheck = {
    SUPABASE_URL: !!SUPABASE_URL,
    SUPABASE_SERVICE_ROLE_KEY: !!SUPABASE_SERVICE_ROLE_KEY,
    TELEGRAM_BOT_TOKEN: !!TELEGRAM_BOT_TOKEN,
    TELEGRAM_CHAT_ID: !!TELEGRAM_CHAT_ID,
  };

  if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY || !TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) {
    return new Response(
      JSON.stringify({ error: "Missing required environment variables.", envCheck }),
      { status: 500, headers },
    );
  }

  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
    auth: { persistSession: false },
  });

  const { data, error } = await supabase
    .from("beta_feedback_with_lab")
    .select(
      "id,user_id,email,rating,feedback_type,message,answers,context,source,page_url,status,tags,created_at,lab_name,contact_name,telegram_notified_at",
    )
    .eq("feedback_type", "bug")
    .is("telegram_notified_at", null)
    .order("created_at", { ascending: true })
    .limit(TELEGRAM_MAX_ITEMS);

  if (error) {
    console.error("Supabase query error:", error);
    return new Response(
      JSON.stringify({ error: error.message, hint: error.hint, details: error.details }),
      { status: 500, headers },
    );
  }

  const rows = (data ?? []) as FeedbackRow[];
  console.log(`Found ${rows.length} unnotified bugs`);

  if (rows.length === 0) {
    return new Response(JSON.stringify({ ok: true, sent: 0, message: "No new bugs to notify" }), { status: 200, headers });
  }

  const sentIds: string[] = [];
  const sendErrors: Array<{ id: string; error: string }> = [];

  for (const row of rows) {
    const text = formatFeedback(row);
    const resp = await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: TELEGRAM_CHAT_ID,
        text,
        parse_mode: "MarkdownV2",
        disable_web_page_preview: true,
      }),
    });

    if (resp.ok) {
      sentIds.push(row.id);
      console.log(`Sent notification for bug ${row.id}`);
    } else {
      const body = await resp.text();
      console.error(`Telegram API error for ${row.id}:`, body);
      sendErrors.push({ id: row.id, error: body });
    }
  }

  if (sentIds.length > 0) {
    await supabase
      .from("beta_feedback")
      .update({ telegram_notified_at: new Date().toISOString() })
      .in("id", sentIds);
  }

  return new Response(
    JSON.stringify({
      ok: sendErrors.length === 0,
      sent: sentIds.length,
      errors: sendErrors,
    }),
    { status: sendErrors.length ? 207 : 200, headers },
  );
});
