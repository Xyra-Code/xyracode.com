/**
 * Fuente única de metadata y datos estructurados del sitio.
 * Puede leer de content.ts (CONTACT/FOUNDER); content.ts nunca importa de aquí.
 */
import { CONTACT, FOUNDER } from "@/lib/content";

export const SEO = {
  siteName: "XyraCode",
  siteUrl: "https://xyracode.com",
  /** Formato openGraph (es_CO) y BCP-47 (es-CO) según dónde se use. */
  locale: "es_CO",
  localeBcp47: "es-CO",
  googleVerification: "ITqkICxkV3qOBZsTgvQ59vLZFmcKKcMPCshPMO9vLlE",

  home: {
    title: "Desarrollo web y apps a medida en Colombia | XyraCode",
    titleTemplate: "%s | XyraCode",
    description:
      "Agencia en Colombia de desarrollo web y apps a medida. Diseñamos sitios, apps y plataformas del prototipo a producción: rápido, escalable y sin fricción.",
    /** Versión corta: openGraph, twitter y JSON-LD WebSite. */
    shortDescription:
      "Agencia en Colombia de desarrollo web y apps a medida. Del prototipo a producción: rápido, escalable y sin fricción.",
    /** JSON-LD de la organización. */
    orgDescription:
      "Agencia de desarrollo web y apps a medida. Sitios, apps y plataformas del prototipo a producción.",
  },

  nosotros: {
    title: "Nosotros — El desarrollador detrás de XyraCode",
    description:
      "XyraCode es una agencia unipersonal de desarrollo web en Villavicencio, Colombia. Más de 10 años entendiendo clientes antes de programar: trato directo, un solo responsable y código propio.",
    ogDescription:
      "Agencia de desarrollo web en Villavicencio, Colombia. Más de 10 años entendiendo clientes antes de programar.",
  },

  manifest: {
    name: "XyraCode — Desarrollo web y apps a medida",
    shortName: "XyraCode",
  },

  /** Dirección para PostalAddress (JSON-LD). */
  address: {
    locality: "Villavicencio",
    region: "Meta",
    countryCode: "CO",
    country: "Colombia",
  },

  org: {
    knowsAbout: [
      "Desarrollo web",
      "Desarrollo de aplicaciones móviles",
      "Diseño de software a medida",
    ],
  },

  person: {
    knowsAbout: ["React", "Next.js", "Node", "TypeScript", "PostgreSQL"],
    henry: { name: "Henry", url: "https://www.soyhenry.com" },
    sena: { name: "SENA", url: "https://www.sena.edu.co" },
  },

  /** Textos planos de las imágenes Open Graph (los titulares con color viven en los .tsx). */
  ogImage: {
    footerRight: "xyracode.com",
    home: {
      alt: "XyraCode — Agencia de desarrollo web y apps a medida en Latinoamérica",
      eyebrow: "Agencia de desarrollo web",
      footerLeft: "Sitios · Apps · Plataformas a medida",
    },
    nosotros: {
      alt: "Yeison Enciso — El desarrollador detrás de XyraCode",
      eyebrow: "Nosotros",
      footerLeft: `${FOUNDER.name} · ${CONTACT.location}`,
    },
  },
} as const;
