import type { NextConfig } from "next";

const securityHeaders = [
  {
    // Fuerza HTTPS en el dominio y subdominios durante 2 años (apto para preload).
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
  {
    // Evita que el navegador adivine (sniff) el tipo de contenido.
    key: "X-Content-Type-Options",
    value: "nosniff",
  },
  {
    // Previene clickjacking impidiendo que el sitio se embeba en iframes ajenos.
    key: "X-Frame-Options",
    value: "SAMEORIGIN",
  },
  {
    // Limita la información de referer enviada a orígenes externos.
    key: "Referrer-Policy",
    value: "strict-origin-when-cross-origin",
  },
  {
    // Deshabilita APIs del navegador que el sitio no necesita.
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), browsing-topics=()",
  },
];

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        source: "/:path*",
        headers: securityHeaders,
      },
    ];
  },
};

export default nextConfig;
