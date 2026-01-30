import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.4";

type FeedbackRow = {
  id: string;
  feedback_type: string | null;
  message: string;
  email: string | null;
  lab_name: string | null;
  contact_name: string | null;
  created_at: string;
};

const SUPABASE_URL = Deno.env.get("SUPABASE_URL") ?? "";
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";
const TELEGRAM_BOT_TOKEN = Deno.env.get("TELEGRAM_BOT_TOKEN") ?? "";
const TELEGRAM_CHAT_ID = Deno.env.get("TELEGRAM_CHAT_ID") ?? "";

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

function formatCounts(counts: Record<string, number>): string {
  const entries = Object.entries(counts);
  if (entries.length === 0) return "n\\/a";
  return entries
    .sort((a, b) => b[1] - a[1])
    .map(([k, v]) => `${escapeMarkdownV2(k)}:${v}`)
    .join("\\, ");
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

  console.log("Weekly summary starting, env check:", envCheck);

  if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY || !TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) {
    return new Response(
      JSON.stringify({ error: "Missing required environment variables.", envCheck }),
      { status: 500, headers },
    );
  }

  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
    auth: { persistSession: false },
  });

  const { data: lastRun } = await supabase
    .from("beta_feedback_summary_runs")
    .select("covered_to")
    .order("covered_to", { ascending: false })
    .limit(1)
    .maybeSingle();

  const coveredFrom = lastRun?.covered_to ??
    new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
  const coveredTo = new Date().toISOString();

  const { data, error } = await supabase
    .from("beta_feedback_with_lab")
    .select("id,feedback_type,message,email,lab_name,contact_name,created_at")
    .gte("created_at", coveredFrom)
    .lte("created_at", coveredTo)
    .neq("feedback_type", "bug")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Supabase query error:", error);
    return new Response(
      JSON.stringify({ error: error.message, hint: error.hint, details: error.details }),
      { status: 500, headers },
    );
  }

  const rows = (data ?? []) as FeedbackRow[];
  console.log(`Found ${rows.length} feedback entries for period ${coveredFrom} to ${coveredTo}`);
  const counts: Record<string, number> = {};
  for (const row of rows) {
    const key = row.feedback_type ?? "other";
    counts[key] = (counts[key] ?? 0) + 1;
  }

  const lines = [
    "*WOECHENTLICHE FEEDBACK\\-ZUSAMMENFASSUNG*",
    `*Zeitraum:* ${safe(coveredFrom)} bis ${safe(coveredTo)}`,
    `*Anzahl:* ${safe(rows.length)}`,
    `*Typen:* ${safe(formatCounts(counts))}`,
  ];

  if (rows.length > 0) {
    lines.push("*Highlights:*");
    const highlights = rows.slice(0, 5);
    for (const row of highlights) {
      const whoParts = [
        row.contact_name ?? "",
        row.lab_name ?? "",
        row.email ?? "",
      ].filter(Boolean);
      const who = whoParts.length > 0 ? whoParts.join(" \\| ") : "n\\/a";
      const msg = truncate(row.message, 140);
      lines.push(`\\- ${safe(msg)} \\| ${safe(who)} \\| ${safe(row.feedback_type ?? "other")}`);
    }
  } else {
    lines.push("*Highlights:* n\\/a");
  }

  const text = truncate(lines.join("\n"), 3800);
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

  if (!resp.ok) {
    const body = await resp.text();
    console.error("Telegram API error:", body);
    return new Response(JSON.stringify({ error: body }), { status: 500, headers });
  }

  console.log("Telegram message sent successfully");

  await supabase.from("beta_feedback_summary_runs").insert({
    covered_from: coveredFrom,
    covered_to: coveredTo,
    feedback_count: rows.length,
  });

  return new Response(
    JSON.stringify({ ok: true, count: rows.length, period: { from: coveredFrom, to: coveredTo } }),
    { status: 200, headers },
  );
});
