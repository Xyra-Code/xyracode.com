import type { Metadata, Viewport } from "next";
import { JetBrains_Mono, Plus_Jakarta_Sans } from "next/font/google";
import { CONTACT, SOCIALS } from "@/lib/content";
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
  metadataBase: new URL("https://xyracode.com"),
  title: {
    default: "Desarrollo web y apps a medida en Colombia | XyraCode",
    template: "%s | XyraCode",
  },
  description:
    "Agencia en Colombia de desarrollo web y apps a medida. Diseñamos sitios, apps y plataformas del prototipo a producción: rápido, escalable y sin fricción.",
  alternates: {
    canonical: "/",
  },
  verification: {
    google: "ITqkICxkV3qOBZsTgvQ59vLZFmcKKcMPCshPMO9vLlE",
  },
  openGraph: {
    type: "website",
    locale: "es_CO",
    url: "/",
    siteName: "XyraCode",
    title: "Desarrollo web y apps a medida en Colombia | XyraCode",
    description:
      "Agencia en Colombia de desarrollo web y apps a medida. Del prototipo a producción: rápido, escalable y sin fricción.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Desarrollo web y apps a medida en Colombia | XyraCode",
    description:
      "Agencia en Colombia de desarrollo web y apps a medida. Del prototipo a producción: rápido, escalable y sin fricción.",
  },
};

// El chrome del navegador (barra de direcciones en móvil) coincide con el
// navbar oscuro que queda arriba del viewport (globals.css: night #08110f).
export const viewport: Viewport = {
  themeColor: "#08110f",
  colorScheme: "light",
};

const SITE_URL = "https://xyracode.com";

// @graph con @id enlazados: el WebSite declara a la empresa como su publisher,
// para que Google entienda "sitio" y "organización" como entidades relacionadas.
const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      "@id": `${SITE_URL}/#website`,
      url: SITE_URL,
      name: "XyraCode",
      description:
        "Agencia en Colombia de desarrollo web y apps a medida. Del prototipo a producción: rápido, escalable y sin fricción.",
      publisher: { "@id": `${SITE_URL}/#organization` },
      inLanguage: "es-CO",
    },
    {
      "@type": "ProfessionalService",
      "@id": `${SITE_URL}/#organization`,
      name: "XyraCode",
      url: SITE_URL,
      description:
        "Agencia de desarrollo web y apps a medida. Sitios, apps y plataformas del prototipo a producción.",
      image: `${SITE_URL}/opengraph-image`,
      // Derivados de CONTACT (lib/content.ts) para que el NAP nunca se desincronice.
      telephone: `+${CONTACT.whatsapp}`,
      email: CONTACT.email,
      priceRange: "$$",
      address: {
        "@type": "PostalAddress",
        addressLocality: "Villavicencio",
        addressRegion: "Meta",
        addressCountry: "CO",
      },
      areaServed: {
        "@type": "Country",
        name: "Colombia",
      },
      knowsAbout: [
        "Desarrollo web",
        "Desarrollo de aplicaciones móviles",
        "Diseño de software a medida",
      ],
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
