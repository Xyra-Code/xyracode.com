import type { Metadata, Viewport } from "next";
import { JetBrains_Mono, Plus_Jakarta_Sans } from "next/font/google";
import { CONTACT, SERVICE_PAGES, SOCIALS } from "@/lib/content";
import { SEO } from "@/lib/seo";
import "./globals.css";

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
});

const jetbrains = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(SEO.siteUrl),
  title: {
    default: SEO.home.title,
    template: SEO.home.titleTemplate,
  },
  description: SEO.home.description,
  alternates: {
    // Emite `https://xyracode.com` sin barra final, mientras la URL efectiva
    // tras la redirección sí la lleva. Verificado: pasar la URL absoluta con
    // barra no cambia nada, Next 16 normaliza la raíz igual. Igualarlas exigiría
    // `trailingSlash: true` en todo el sitio, y Google trata ambas formas de la
    // raíz como la misma URL: no vale el cambio.
    canonical: "/",
  },
  verification: {
    google: SEO.googleVerification,
  },
  openGraph: {
    type: "website",
    locale: SEO.locale,
    url: "/",
    siteName: SEO.siteName,
    title: SEO.home.title,
    description: SEO.home.shortDescription,
  },
  twitter: {
    card: "summary_large_image",
    title: SEO.home.title,
    description: SEO.home.shortDescription,
  },
};

// El chrome del navegador (barra de direcciones en móvil) coincide con el
// navbar oscuro que queda arriba del viewport (globals.css: night #08110f).
export const viewport: Viewport = {
  themeColor: "#08110f",
  colorScheme: "light",
};

const SITE_URL = SEO.siteUrl;


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es-CO"
      data-scroll-behavior="smooth"
      className={`${jakarta.variable} ${jetbrains.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">
        {/* Sin JS no corre el IntersectionObserver: mostrar todo el contenido */}
        <noscript>
          <style>{`.reveal { opacity: 1; transform: none; }`}</style>
        </noscript>
        {children}
      </body>
    </html>
  );
}
