import type { Block } from "./blocks";

/** Métrica del panel de resultados (3 por caso). */
export type CaseResult = { value: string; label: string };

/** Imagen de cover/galería. width/height reales (next/image los exige si no se usa fill). */
export type CaseImage = { src: string; alt: string; caption?: string };

export type CaseStudy = {
  slug: string;
  seo: { title: string; description: string };
  /** ISO 8601; editar a mano al cambiar el contenido (alimenta el sitemap y datePublished). */
  lastModified: string;
  hero: { tags: string[]; h1: string; intro: string };
  cover: CaseImage;
  meta: {
    cliente: string;
    /** Año o "2026 · En producción". */
    año: string;
    stack: string[];
    /** URL del sitio en vivo (botón "Visitar sitio"). */
    siteHref?: string;
  };
  /** Cuerpo largo del caso (el reto, el proceso, decisiones técnicas…). */
  body: Block[];
  /** Panel "Resultado": 3 stats grandes. */
  results: CaseResult[];
  /** Galería inferior. */
  gallery: CaseImage[];
};

export const CASE_STUDIES: CaseStudy[] = [
  // NOTA (contenido a revisar antes de publicar):
  // - Descripción, hero, reto, solución y alts se basan en información PÚBLICA
  //   (sitio vuelocarmesi.com + redes @vuelo_carmesi): finca de cacao agroecológico
  //   en Cubarral, Meta; experiencias (glamping, taller de chocolate, cata, aves) + tienda.
  // - Proceso y `results` son ILUSTRATIVOS y honestos (reflejan el alcance real, sin
  //   cifras de negocio inventadas). Reemplazar por datos reales del proyecto/cliente si se desea.
  // - Testimonio OMITIDO a propósito: no se incluye una cita fabricada. Añadir la sección
  //   solo con un testimonio real autorizado (con nombre y rol).
  // - Verificar que los `alt` describan lo que realmente muestra cada captura (1-3.png).
  {
    slug: "vuelo-carmesi",
    seo: {
      title: "Caso de Estudio: Vuelo Carmesí | XyraCode",
      description:
        "Cómo XyraCode construyó la plataforma de reservas y tienda online de Vuelo Carmesí, finca de cacao agroecológico en Cubarral, Meta.",
    },
    lastModified: "2026-07-13",
    hero: {
      // Reutilizados de PROJECTS (públicos): tags/stack ya verificados.
      tags: ["Next.js 16", "NestJS", "PostgreSQL", "Prisma", "Cloudinary"],
      h1: "Vuelo Carmesí: plataforma de reservas y tienda para una finca de cacao agroecológico",
      intro:
        "Vuelo Carmesí es una finca de cacao agroecológico en Cubarral (Meta) que ofrece experiencias vivenciales —glamping, taller de chocolate artesanal, cata de cacao y avistamiento de aves— además de vender su cacao. Necesitaba recibir reservas y vender en línea desde una sola plataforma; XyraCode la diseñó y construyó full-stack, de punta a punta.",
    },
    cover: {
      src: "/assets/projects/vuelo-carmesi/1.png",
      alt: "Página principal de la plataforma web de Vuelo Carmesí",
    },
    meta: {
      cliente: "Vuelo Carmesí — Cubarral, Meta",
      año: "2026 · En producción",
      stack: ["Next.js 16", "NestJS", "PostgreSQL", "Prisma", "Cloudinary"],
      siteHref: "https://vuelocarmesi.com",
    },
    body: [
      { kind: "h2", text: "El reto" },
      {
        kind: "p",
        text: "El interés por Vuelo Carmesí nació en redes sociales: al compartir en Instagram la vida de la finca y la relación entre las aves y el cacao, empezaron a llegar solicitudes de visita. Gestionar esas reservas de forma manual —por mensajes directos y WhatsApp— y ofrecer sus productos sin una tienda propia limitaba el alcance y consumía tiempo.",
      },
      {
        kind: "p",
        text: "El reto era llevar toda esa experiencia a una sola plataforma: recibir reservas de experiencias (como el glamping y el taller de chocolate artesanal) y vender en línea, con un panel para gestionarlo todo sin depender del chat.",
      },
      {
        kind: "p",
        text: "Un reto técnico concreto: la validación de reservas debía respetar correctamente la zona horaria de Bogotá para evitar fechas cruzadas o dobles reservas.",
      },
      { kind: "h2", text: "La solución" },
      {
        kind: "p",
        text: "Construimos una plataforma que unifica dos necesidades en un solo producto: un sistema de reservas y una tienda online, más un panel de administración para gestionarlo todo. Estas son las capacidades clave:",
      },
      {
        kind: "ul",
        items: [
          "Reservas con validación de fechas, respetando la zona horaria de Bogotá.",
          "Panel de administración + tienda online para gestionar reservas, productos y pedidos.",
          "Emails transaccionales y carga de imágenes en la nube (Cloudinary).",
        ],
      },
      { kind: "h2", text: "Cómo lo construimos" },
      {
        kind: "p",
        text: "El proyecto se desarrolló de punta a punta con XyraCode como único responsable técnico: primero un descubrimiento del negocio y sus experiencias, luego el diseño de la plataforma y un desarrollo full-stack por iteraciones, desplegando sobre una URL real para validar reservas, tienda y panel en cada entrega. La comunicación fue directa, sin intermediarios.",
      },
      { kind: "h2", text: "Decisiones técnicas" },
      {
        kind: "ul",
        items: [
          "Frontend: Next.js 16.",
          "Backend: NestJS.",
          "Base de datos: PostgreSQL con Prisma.",
          "Medios e imágenes: Cloudinary.",
        ],
      },
      {
        kind: "p",
        text: "El resultado es una plataforma en producción (vuelocarmesi.com) que unifica reservas, tienda y administración: Vuelo Carmesí puede recibir solicitudes y vender en línea sin depender de mensajes manuales, con la experiencia de la finca reflejada en la web.",
      },
    ],
    // ILUSTRATIVO — reflejan el alcance real de la plataforma, no cifras de negocio
    // confirmadas. Reemplazar por KPIs reales autorizados por el cliente si se desea.
    results: [
      { value: "24/7", label: "Reservas en línea, sin depender de mensajes manuales" },
      { value: "2 en 1", label: "Reservas de experiencias y tienda en una sola plataforma" },
      { value: "100%", label: "Autogestionable desde el panel de administración" },
    ],
    gallery: [
      {
        src: "/assets/projects/vuelo-carmesi/2.png",
        alt: "Pantalla de reservas de experiencias de Vuelo Carmesí",
      },
      {
        src: "/assets/projects/vuelo-carmesi/3.png",
        alt: "Tienda en línea de Vuelo Carmesí",
      },
    ],
  },
];
