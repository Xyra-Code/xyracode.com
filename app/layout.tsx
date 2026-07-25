import type { Metadata, Viewport } from "next";
import { JetBrains_Mono, Plus_Jakarta_Sans } from "next/font/google";
import { FloatingWhatsApp } from "@/components/sections/FloatingWhatsApp";
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
      alternateName: [...SEO.alternateNames],
      description: SEO.home.shortDescription,
      publisher: { "@id": `${SITE_URL}/#organization` },
      inLanguage: SEO.localeBcp47,
    },
    {
      "@type": "ProfessionalService",
      "@id": `${SITE_URL}/#organization`,
      name: SEO.siteName,
      alternateName: [...SEO.alternateNames],
      url: SITE_URL,
      description: SEO.home.orgDescription,
      image: `${SITE_URL}/opengraph-image`,
      // Derivados de CONTACT (lib/content.ts) para que el NAP nunca se desincronice.
      telephone: CONTACT.phone,
      email: CONTACT.email,
      priceRange: "$$",
      address: {
        "@type": "PostalAddress",
        addressLocality: SEO.address.locality,
        addressRegion: SEO.address.region,
        postalCode: SEO.address.postalCode,
        addressCountry: SEO.address.countryCode,
      },
      geo: {
        "@type": "GeoCoordinates",
        latitude: SEO.address.geo.lat,
        longitude: SEO.address.geo.lng,
      },
      areaServed: SEO.areaServed.map((area) => ({
        "@type": area.type,
        name: area.name,
      })),
      openingHoursSpecification: SEO.openingHours.map((franja) => ({
        "@type": "OpeningHoursSpecification",
        dayOfWeek: [...SEO.businessDays],
        opens: franja.opens,
        closes: franja.closes,
      })),
      knowsAbout: [...SEO.org.knowsAbout],
      // Cierra el cluster: la empresa declara qué servicios ofrece y en qué
      // URL vive cada uno, así el hub y sus hijas se leen como una unidad.
      hasOfferCatalog: {
        "@type": "OfferCatalog",
        name: "Servicios de XyraCode",
        url: `${SITE_URL}/servicios`,
        itemListElement: SERVICE_PAGES.map((page) => ({
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            "@id": `${SITE_URL}/servicios/${page.slug}#service`,
            name: page.card.title,
            url: `${SITE_URL}/servicios/${page.slug}`,
          },
        })),
      },
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
        <FloatingWhatsApp />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </body>
    </html>
  );
}
