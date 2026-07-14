import type { Metadata, Viewport } from "next";
import { JetBrains_Mono, Plus_Jakarta_Sans } from "next/font/google";
import { CONTACT, SOCIALS } from "@/lib/content";
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

// @graph con @id enlazados: el WebSite declara a la empresa como su publisher,
// para que Google entienda "sitio" y "organización" como entidades relacionadas.
const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      "@id": `${SITE_URL}/#website`,
      url: SITE_URL,
      name: SEO.siteName,
      description: SEO.home.shortDescription,
      publisher: { "@id": `${SITE_URL}/#organization` },
      inLanguage: SEO.localeBcp47,
    },
    {
      "@type": "ProfessionalService",
      "@id": `${SITE_URL}/#organization`,
      name: SEO.siteName,
      url: SITE_URL,
      description: SEO.home.orgDescription,
      image: `${SITE_URL}/opengraph-image`,
      // Derivados de CONTACT (lib/content.ts) para que el NAP nunca se desincronice.
      telephone: `+${CONTACT.whatsapp}`,
      email: CONTACT.email,
      priceRange: "$$",
      address: {
        "@type": "PostalAddress",
        addressLocality: SEO.address.locality,
        addressRegion: SEO.address.region,
        addressCountry: SEO.address.countryCode,
      },
      geo: {
        "@type": "GeoCoordinates",
        latitude: SEO.address.geo.lat,
        longitude: SEO.address.geo.lng,
      },
      areaServed: {
        "@type": "Country",
        name: SEO.address.country,
      },
      knowsAbout: [...SEO.org.knowsAbout],
      sameAs: SOCIALS.map((social) => social.href),
    },
  ],
};

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
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </body>
    </html>
  );
}
