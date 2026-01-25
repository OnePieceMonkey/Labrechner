import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

// Whitelist erlaubter Redirect-Pfade (verhindert Open Redirect Attacks)
const ALLOWED_REDIRECT_PATHS = ["/app", "/app/settings", "/app/favoriten", "/dashboard"];

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
  const rawNext = searchParams.get("next");

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      // RBAC: Admin-Check für Redirect
      const { data: { user } } = await supabase.auth.getUser();

      if (user) {
        // Prüfe user_settings für Admin-Rolle
        const { data: settings } = await supabase
          .from('user_settings')
          .select('role')
          .eq('user_id', user.id)
          .single();

        // Admin → /dashboard, sonst → /app
        // Wir casten hier explizit auf any oder ein Interface, um den TS-Fehler "type never" zu umgehen, 
        // der auftritt wenn die Supabase-Typen noch nicht synchron sind.
        const userSettings = settings as any;
        const isAdmin = userSettings?.role === 'admin';
        const defaultPath = isAdmin ? '/dashboard' : '/app';

        // User-gewünschter Pfad oder Default basierend auf Rolle
        const next = rawNext && isValidRedirectPath(rawNext) ? rawNext : defaultPath;

        return NextResponse.redirect(`${origin}${next}`);
      }

      // Fallback wenn kein User (sollte nicht passieren)
      return NextResponse.redirect(`${origin}/app`);
    }
  }

  // Auth-Fehler: Zurück zur Login-Seite
  return NextResponse.redirect(`${origin}/login?error=auth_callback_error`);
}
