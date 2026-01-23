import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

// Whitelist erlaubter Redirect-Pfade (verhindert Open Redirect Attacks)
const ALLOWED_REDIRECT_PATHS = ["/app", "/app/settings", "/app/favoriten"];

function isValidRedirectPath(path: string): boolean {
  // Muss mit / beginnen (relativer Pfad)
  if (!path.startsWith("/")) return false;
  // Darf kein Protocol enthalten (verhindert //evil.com)
  if (path.startsWith("//")) return false;
  // Darf keine URL-Encoded Zeichen enthalten die zu externen URLs führen könnten
  if (path.includes("%2f") || path.includes("%2F")) return false;
  // Muss in der Whitelist sein ODER mit einem erlaubten Pfad beginnen
  return ALLOWED_REDIRECT_PATHS.some(
    (allowed) => path === allowed || path.startsWith(allowed + "/")
  );
}

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const rawNext = searchParams.get("next") ?? "/app";

  // Sanitize: Nur erlaubte interne Pfade zulassen
  const next = isValidRedirectPath(rawNext) ? rawNext : "/app";

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  // Auth-Fehler: Zurück zur Login-Seite
  return NextResponse.redirect(`${origin}/login?error=auth_callback_error`);
}
