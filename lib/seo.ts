/**
 * Fuente única de metadata y datos estructurados del sitio.
 * Puede leer de content.ts (CONTACT/FOUNDER); content.ts nunca importa de aquí.
 */
import { CONTACT, FOUNDER } from "@/lib/content";

export const SEO = {
  siteName: "XyraCode",
  siteUrl: "https://xyracode.com",
  /**
   * Variantes de marca para el alternateName del JSON-LD. Google tokeniza
   * "XyraCode" (camelCase) como "xyra"+"code", y todos los handles sociales
   * usan la forma separada: sin estas variantes la búsqueda pegada no resuelve
   * al sitio. No quitar la forma en minúscula ni el dominio.
   */
  alternateNames: ["Xyra Code", "xyracode", "xyracode.com"],
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
    title: "Desarrollador web en Villavicencio, Colombia | XyraCode",
    description:
      "Agencia de desarrollo web en Villavicencio, Colombia. Más de 10 años entendiendo clientes antes de programar: trato directo y código propio.",
    ogDescription:
      "Agencia de desarrollo web en Villavicencio, Colombia. Más de 10 años entendiendo clientes antes de programar.",
  },

  contacto: {
    title: "Contacto | XyraCode",
    description:
      "Habla con XyraCode: WhatsApp, teléfono, correo o formulario. Agencia de desarrollo web en Villavicencio, Meta, con clientes en toda Colombia.",
  },

  /**
   * Título de `app/global-not-found.tsx`. Usa el guion largo y la marca separada
   * que pide el handoff, en vez del `| XyraCode` del resto del sitio: la página
   * es noindex, así que el título no compite por nada en la SERP.
   */
  notFound: {
    title: "Página no encontrada — Xyra Code",
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
    postalCode: "500001",
    /** Centro de Villavicencio; alimenta GeoCoordinates (SEO local). */
    geo: { lat: 4.142, lng: -73.626 },
  },

  /**
   * areaServed del JSON-LD, de lo específico a lo general. Google usa la
   * jerarquía City → State → Country para resolver relevancia local: declarar
   * solo el país es tan débil como no declarar nada. El departamento entra
   * aquí, como dato estructurado, y no como keyword en los titles.
   */
  areaServed: [
    { type: "City", name: "Villavicencio" },
    { type: "State", name: "Meta" },
    { type: "Country", name: "Colombia" },
  ],

  /**
   * Franjas de atención para openingHoursSpecification. Jornada partida, así
   * que van como dos entradas sobre los mismos días. Deben coincidir con el
   * horario del perfil de Google Business: un horario declarado aquí que no
   * case con el del perfil es peor señal que no declarar ninguno.
   */
  openingHours: [
    { opens: "08:00", closes: "12:00" },
    { opens: "14:00", closes: "18:00" },
  ],
  businessDays: [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
  ],

  org: {
    /**
     * Logo de la organización para el JSON-LD. Distinto de `image`: Google usa
     * `logo` en el panel de conocimiento y exige mínimo 112x112px. mark.png es
     * 600x355 — pasa de sobra y su relación de aspecto (1.7:1) sobrevive el
     * recorte mejor que logo-horizontal.png (3.8:1). Si se cambia el archivo,
     * verificar que el nuevo siga por encima del mínimo.
     */
    logo: "/assets/brand/mark.png",
    knowsAbout: [
      "Desarrollo web",
      "Desarrollo de aplicaciones móviles",
      "Diseño de software a medida",
    ],
  },

  person: {
    knowsAbout: [
      "Desarrollo full-stack",
      "React",
      "Next.js",
      "Node",
      "TypeScript",
      "PostgreSQL",
    ],
    henry: { name: "Henry", url: "https://www.soyhenry.com" },
    sena: { name: "SENA", url: "https://www.sena.edu.co" },
  },

  /** Textos planos de las imágenes Open Graph (los titulares con color viven en los .tsx). */
  ogImage: {
    footerRight: "xyracode.com",
    home: {
      alt: "XyraCode — Agencia de desarrollo web y apps a medida en Colombia",
      eyebrow: "Agencia de desarrollo web",
      footerLeft: "Sitios · Apps · Plataformas a medida",
    },
    nosotros: {
      alt: "Yeison Enciso — El desarrollador detrás de XyraCode",
      eyebrow: "Nosotros",
      footerLeft: `${FOUNDER.name} · ${CONTACT.location}`,
    },
    serviciosHub: {
      alt: "¿Web, tienda online o app a medida? Cómo elegir | XyraCode",
      eyebrow: "Servicios",
      title: "¿Web, tienda o app a medida?",
      footerLeft: "Compara los tres caminos",
    },
    proyectosHub: {
      alt: "Proyectos y casos de estudio | XyraCode",
      eyebrow: "Proyectos",
      title: "Trabajo real, en producción",
      footerLeft: "Casos de estudio",
    },
    blogHub: {
      alt: "Blog de desarrollo web y software | XyraCode",
      eyebrow: "Blog",
      title: "Guías para decidir mejor",
      footerLeft: "Desarrollo web · Apps · E-commerce",
    },
  },
} as const;
