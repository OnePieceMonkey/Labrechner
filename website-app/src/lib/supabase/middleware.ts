import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

// === RATE LIMITING ===
// Einfaches In-Memory Rate Limiting (für Vercel Edge Runtime kompatibel)
// Hinweis: Bei mehreren Edge-Instanzen ist ein externer Store (Redis/Upstash) empfohlen
const rateLimitMap = new Map<string, { count: number; lastReset: number }>();
const RATE_LIMIT_WINDOW_MS = 60_000; // 1 Minute
const MAX_REQUESTS_PER_WINDOW = 100; // Max 100 Requests pro Minute pro IP

function getClientIp(request: NextRequest): string {
  // Vercel/Cloudflare forwarded IP
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) {
    return forwarded.split(",")[0].trim();
  }
  // Fallback
  return request.headers.get("x-real-ip") ?? "unknown";
}

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const record = rateLimitMap.get(ip);

  if (!record || now - record.lastReset > RATE_LIMIT_WINDOW_MS) {
    // Neues Fenster starten
    rateLimitMap.set(ip, { count: 1, lastReset: now });
    return false;
  }

  record.count++;

  if (record.count > MAX_REQUESTS_PER_WINDOW) {
    return true;
  }

  return false;
}

// Cleanup alte Einträge (alle 5 Minuten)
setInterval(() => {
  const now = Date.now();
  for (const [ip, record] of rateLimitMap.entries()) {
    if (now - record.lastReset > RATE_LIMIT_WINDOW_MS * 5) {
      rateLimitMap.delete(ip);
    }
  }
}, 300_000);

export async function updateSession(request: NextRequest) {
  // Rate Limiting Check
  const clientIp = getClientIp(request);
  if (isRateLimited(clientIp)) {
    return new NextResponse(
      JSON.stringify({ error: "Zu viele Anfragen. Bitte warten Sie einen Moment." }),
      {
        status: 429,
        headers: {
          "Content-Type": "application/json",
          "Retry-After": "60",
        },
      }
    );
  }

  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          request.cookies.set({
            name,
            value,
            ...options,
          });
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          });
          response.cookies.set({
            name,
            value,
            ...options,
          });
        },
        remove(name: string, options: CookieOptions) {
          request.cookies.set({
            name,
            value: "",
            ...options,
          });
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          });
          response.cookies.set({
            name,
            value: "",
            ...options,
          });
        },
      },
    }
  );

  // Refresh session wenn abgelaufen
  const { data: { user } } = await supabase.auth.getUser();

  // Geschützte Routen
  const isProtectedRoute = request.nextUrl.pathname.startsWith("/dashboard") || request.nextUrl.pathname.startsWith("/app");
  const isAuthRoute = request.nextUrl.pathname.startsWith("/login");

  // Nicht eingeloggt + geschützte Route → Login
  if (isProtectedRoute && !user) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("next", request.nextUrl.pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Eingeloggt + Login-Seite → Dashboard
  if (isAuthRoute && user) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return response;
}
