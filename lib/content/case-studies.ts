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
  {
    slug: "vuelo-carmesi",
    seo: {
      title: "Caso de Estudio: Vuelo Carmesí | XyraCode",
      description:
        "[DATO REAL PENDIENTE: descripción de 150-160 caracteres con la palabra clave del caso y un resultado concreto verificable. Ej: reservas + tienda para finca de cacao.]",
    },
    lastModified: "2026-07-13",
    hero: {
      // Reutilizados de PROJECTS (públicos): tags/stack ya verificados.
      tags: ["Next.js 16", "NestJS", "PostgreSQL", "Prisma", "Cloudinary"],
      h1: "Vuelo Carmesí: plataforma de reservas y tienda para una finca de cacao agroecológico",
      intro:
        "Vuelo Carmesí es una finca de cacao agroecológico que necesitaba llevar su experiencia y sus productos a internet: recibir reservas de visitantes y vender su cacao en línea, todo desde una sola plataforma. XyraCode diseñó y construyó la solución full-stack, de punta a punta.",
    },
    cover: {
      src: "/assets/projects/vuelo-carmesi/1.png",
      alt: "[DATO REAL PENDIENTE: qué muestra la captura 1 (portada del caso)]",
    },
    meta: {
      cliente:
        '[DATO REAL PENDIENTE: nombre público del cliente/marca autorizado para publicarse, o "Vuelo Carmesí" si ese es el nombre comercial de cara al público.]',
      año: "2026 · En producción",
      stack: ["Next.js 16", "NestJS", "PostgreSQL", "Prisma", "Cloudinary"],
      siteHref: "https://vuelocarmesi.com",
    },
    body: [
      { kind: "h2", text: "El reto" },
      {
        kind: "quote",
        text: "[DATO REAL PENDIENTE: definir en 1-2 frases el reto central del proyecto en palabras del cliente o del negocio. Ej: qué hacían antes (¿reservas por WhatsApp?, ¿ventas presenciales?) y por qué necesitaban la plataforma.]",
      },
      {
        kind: "p",
        text: "[DATO REAL PENDIENTE: describir el problema real que tenía el cliente antes del proyecto. Sugerencias de qué confirmar: ¿Cómo gestionaban las reservas antes (manual, WhatsApp, agenda física)? ¿Cómo vendían el cacao (presencial, redes, terceros)? ¿Qué problema concreto los llevó a buscar una plataforma (fechas cruzadas, dependencia horaria, alcance limitado)? Redactar 1-2 párrafos una vez confirmado.]",
      },
      {
        kind: "p",
        text: "Un reto técnico concreto sí es verificable y público: la validación de reservas debía respetar correctamente la zona horaria de Bogotá para evitar fechas cruzadas o dobles reservas.",
      },
      { kind: "h2", text: "La solución" },
      {
        kind: "p",
        text: "Construimos una plataforma que unifica dos necesidades en un solo producto: un sistema de reservas y una tienda online, más un panel de administración para gestionarlo todo. Estas son las capacidades clave (ya públicas en el portafolio):",
      },
      {
        kind: "ul",
        items: [
          "Reservas con validación de fechas, respetando la zona horaria de Bogotá.",
          "Panel de administración + tienda online para gestionar reservas, productos y pedidos.",
          "Emails transaccionales y carga de imágenes en la nube (Cloudinary).",
        ],
      },
      { kind: "h2", text: "Cómo lo construimos (proceso)" },
      {
        kind: "p",
        text: "[DATO REAL PENDIENTE: describir el proceso real seguido en este proyecto (etapas, duración de cada fase, decisiones técnicas clave). Mantener la voz de marca: entregas semanales en URL real, comunicación directa. Confirmar: duración total del proyecto y de las fases; decisiones técnicas destacables más allá de la zona horaria; cualquier reto superado durante el desarrollo.]",
      },
      { kind: "h2", text: "Decisiones técnicas" },
      {
        kind: "ul",
        items: [
          "Frontend: Next.js 16.",
          "Backend: NestJS.",
          "Base de datos: PostgreSQL con Prisma.",
          "Medios e imágenes: Cloudinary.",
          "[DATO REAL PENDIENTE: pasarela de pagos usada, servicio de emails, hosting/infraestructura, si son públicos.]",
        ],
      },
      {
        kind: "p",
        text: "[DATO REAL PENDIENTE: párrafo de cierre que resuma el impacto real del proyecto para el cliente, una vez confirmadas las cifras. Sin exagerar ni inventar.]",
      },
      { kind: "h2", text: "Testimonio del cliente" },
      {
        kind: "quote",
        text: "[DATO REAL PENDIENTE: cita textual del cliente autorizada para publicarse, con nombre y rol de quien la dice. Si no hay testimonio autorizado, omitir por completo esta sección — NO redactar uno ficticio.]",
      },
    ],
    results: [
      {
        value: "[PENDIENTE]",
        label:
          "[DATO REAL PENDIENTE: métrica de resultado 1, ej. tiempo de carga / Core Web Vitals logrado]",
      },
      {
        value: "[PENDIENTE]",
        label:
          "[DATO REAL PENDIENTE: métrica de resultado 2, ej. reservas o ventas gestionadas desde el lanzamiento, si el cliente autoriza compartirlo]",
      },
      {
        value: "[PENDIENTE]",
        label:
          "[DATO REAL PENDIENTE: métrica de resultado 3, ej. reducción de tiempo de gestión manual, o cualquier KPI real acordado con el cliente]",
      },
    ],
    gallery: [
      {
        src: "/assets/projects/vuelo-carmesi/2.png",
        alt: "[DATO REAL PENDIENTE: qué muestra la captura 2]",
      },
      {
        src: "/assets/projects/vuelo-carmesi/3.png",
        alt: "[DATO REAL PENDIENTE: qué muestra la captura 3]",
      },
    ],
  },
];
