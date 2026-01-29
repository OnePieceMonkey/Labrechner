import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";
import { createClient as createAdminClient } from "@supabase/supabase-js";

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
        // Beta-Allowlist: Rolle setzen falls E-Mail erlaubt (Service-Role)
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
        const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
        if (supabaseUrl && serviceKey && user.email) {
          const admin = createAdminClient(supabaseUrl, serviceKey);
          try {
            const email = user.email.toLowerCase();
            const { data: allow } = await admin
              .from('beta_allowlist')
              .select('id, status, role')
              .eq('email', email)
              .maybeSingle();

            if (allow && allow.status !== 'revoked') {
              const desiredRole = allow.role || 'beta_tester';
              const { data: existingSettings } = await admin
                .from('user_settings')
                .select('user_id, role')
                .eq('user_id', user.id)
                .maybeSingle();

              if (!existingSettings) {
                await admin
                  .from('user_settings')
                  .insert({ user_id: user.id, role: desiredRole });
              } else if (existingSettings.role !== 'admin' && existingSettings.role !== desiredRole) {
                await admin
                  .from('user_settings')
                  .update({ role: desiredRole })
                  .eq('user_id', user.id);
              }

              if (allow.status === 'invited') {
                await admin
                  .from('beta_allowlist')
                  .update({ status: 'active', accepted_at: new Date().toISOString() })
                  .eq('id', allow.id);
              }
            }
          } catch (err) {
            console.warn('Beta allowlist check failed:', err);
          }
        }
        // Prüfe user_settings für Admin-Rolle
        const { data: settings } = await supabase
          .from('user_settings')
          .select('role')
          .eq('user_id', user.id)
          .single();

        // Admin → /dashboard, sonst → /app
        // Wir casten hier explizit auf any oder ein Interface, um den TS-Fehler "type never" zu umgehen, 
        // der auftritt wenn die Supabase-Typen noch nicht synchron sind.
        // Fix Build Trigger v2
        const userSettings = settings as any;
        const isAdmin = userSettings?.role === 'admin';
        const defaultPath = '/dashboard';

        // User-gewünschter Pfad oder Default basierend auf Rolle
        const next = rawNext && isValidRedirectPath(rawNext) ? rawNext : defaultPath;

        return NextResponse.redirect(`${origin}${next}`);
      }

      // Fallback wenn kein User (sollte nicht passieren)
      return NextResponse.redirect(`${origin}/dashboard`);
    }
  }

  // Auth-Fehler: Zurück zur Login-Seite
  return NextResponse.redirect(`${origin}/login?error=auth_callback_error`);
}
