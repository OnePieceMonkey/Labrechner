/** @type {import('next').NextConfig} */
const nextConfig = {
  // Vercel Edge Network optimiert für Deutschland
  experimental: {
    // Aktiviere Server Actions
  },
  images: {
    // Externe Bilder erlauben falls nötig
    remotePatterns: [],
  },
  async redirects() {
    return [
      {
        source: "/:path*",
        has: [
          {
            type: "host",
            value: "www.labrechner.de",
          },
        ],
        destination: "https://labrechner.de/:path*",
        permanent: true,
      },
    ];
  },
  // Security Headers
  async headers() {
    return [
      {
        // Alle Routen
        source: "/:path*",
        headers: [
          {
            key: "X-DNS-Prefetch-Control",
            value: "on",
          },
          {
            // Verhindert Clickjacking
            key: "X-Frame-Options",
            value: "DENY",
          },
          {
            // Verhindert MIME-Type Sniffing
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            // XSS Protection (für ältere Browser)
            key: "X-XSS-Protection",
            value: "1; mode=block",
          },
          {
            // Referrer Policy - sendet nur Origin, keine volle URL
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          {
            // Permissions Policy - deaktiviert nicht benötigte Browser Features
            key: "Permissions-Policy",
            value:
              "camera=(), microphone=(self), geolocation=(), interest-cohort=()",
          },
          {
            // HSTS - erzwingt HTTPS (1 Jahr)
            key: "Strict-Transport-Security",
            value: "max-age=31536000; includeSubDomains",
          },
          {
            // Content Security Policy
            key: "Content-Security-Policy",
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-inline' 'unsafe-eval'", // Next.js benötigt unsafe-eval in dev
              "style-src 'self' 'unsafe-inline'", // Tailwind benötigt unsafe-inline
              "img-src 'self' data: https: blob:",
              "font-src 'self' data:",
              "frame-src 'self' blob:",
              "connect-src 'self' https://*.supabase.co wss://*.supabase.co",
              "frame-ancestors 'none'",
              "base-uri 'self'",
              "form-action 'self'",
            ].join("; "),
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
