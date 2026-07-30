/**
 * Helpers de datos estructurados (schema.org) reutilizables entre páginas.
 * Cada página arma su propio @graph e inserta estos nodos donde corresponda.
 */
import type { Block, Inline } from "@/lib/content/blocks";
import { CONTACT, SERVICE_PAGES, SOCIALS } from "@/lib/content";
import { SEO } from "@/lib/seo";

const SITE_URL = SEO.siteUrl;

type Crumb = { name: string; path: string };

/**
 * Nodo BreadcrumbList para el @graph de una página.
 *
 * - `pagePath` ancla el @id (ej. "/nosotros" → `.../nosotros#breadcrumb`).
 * - "Inicio" (nivel 1) se añade automáticamente; pasá solo los niveles siguientes.
 * - `path` de cada miga es relativo al sitio; se le antepone SITE_URL.
 *
 * @example
 * // Nivel 2 (página simple)
 * breadcrumbLd("/nosotros", [{ name: "Nosotros", path: "/nosotros" }])
 *
 * @example
 * // Nivel 3 (detalle dentro de una sección)
 * breadcrumbLd("/servicios/apps-a-medida", [
 *   { name: "Servicios", path: "/servicios" },
 *   { name: "Apps a medida", path: "/servicios/apps-a-medida" },
 * ])
 */
type ListItem = { name: string; path: string };

/**
 * Nodo ItemList para páginas de listado (hubs). Va dentro del `mainEntity`
 * del CollectionPage: sin esto el CollectionPage declara que colecciona algo
 * pero no qué, y Google trata las hijas como URLs sueltas en vez de como un
 * cluster con su hub. El orden del array es el orden que se le declara.
 *
 * @example
 * mainEntity: itemListLd(SERVICE_PAGES.map((p) => ({
 *   name: p.card.title,
 *   path: `/servicios/${p.slug}`,
 * })))
 */
export function itemListLd(items: ListItem[]) {
  return {
    "@type": "ItemList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      url: `${SITE_URL}${item.path}`,
    })),
  };
}

/** Aplana un párrafo a texto plano; de los enlaces inline conserva su texto. */
function plainText(text: string | Inline[]) {
  if (typeof text === "string") return text;
  return text.map((part) => (typeof part === "string" ? part : part.text)).join("");
}

/**
 * Nodo FAQPage derivado del cuerpo: toma los pares h3 + p que siguen al h2
 * "Preguntas frecuentes" y se detiene en el siguiente h2. Se DERIVA en vez de
 * escribirse aparte para que la respuesta marcada y la visible no puedan
 * desincronizarse: marcar algo que el usuario no ve es spam estructurado.
 *
 * Ojo con las expectativas: desde 2023 Google reserva el rich result de FAQ a
 * sitios de gobierno y salud, así que esto NO pinta acordeones en la SERP.
 * Sirve para que buscadores y respuestas generativas extraigan el par
 * pregunta/respuesta limpio. Devuelve null si la página no tiene FAQ.
 */
export function faqLd(pagePath: string, blocks: Block[]) {
  const start = blocks.findIndex(
    (block) => block.kind === "h2" && /preguntas frecuentes/i.test(block.text),
  );
  if (start === -1) return null;

  const entries: { question: string; answer: string }[] = [];
  for (let i = start + 1; i < blocks.length; i++) {
    const block = blocks[i];
    if (block.kind === "h2") break;
    if (block.kind !== "h3") continue;
    const next = blocks[i + 1];
    if (next?.kind === "p") {
      entries.push({ question: block.text, answer: plainText(next.text) });
    }
  }
  if (entries.length === 0) return null;

  return {
    "@type": "FAQPage",
    "@id": `${SITE_URL}${pagePath}#faq`,
    mainEntity: entries.map((entry) => ({
      "@type": "Question",
      name: entry.question,
      acceptedAnswer: { "@type": "Answer", text: entry.answer },
    })),
  };
}

export function breadcrumbLd(pagePath: string, crumbs: Crumb[]) {
  const trail: Crumb[] = [{ name: "Inicio", path: "/" }, ...crumbs];
  return {
    "@type": "BreadcrumbList",
    "@id": `${SITE_URL}${pagePath}#breadcrumb`,
    itemListElement: trail.map((crumb, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: crumb.name,
      item: `${SITE_URL}${crumb.path}`,
    })),
  };
}

/**
 * El @graph del sitio: WebSite + ProfessionalService, con los @id enlazados para
 * que Google entienda "sitio" y "organización" como entidades relacionadas.
 *
 * Vivía inline en `app/layout.tsx`, donde bajaba a TODA página — incluidas las
 * demos de clientes en /demos/*, que no pueden declarar que pertenecen a
 * xyracode.com. Lo monta `components/sections/SiteChrome.tsx`, y este archivo es
 * su lugar natural: su encabezado ya declara ser el hogar de los nodos reusables.
 */
// @graph con @id enlazados: el WebSite declara a la empresa como su publisher,
// para que Google entienda "sitio" y "organización" como entidades relacionadas.
export const SITE_GRAPH = {
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
      // `image` (el OG, 1200x630) y `logo` cumplen funciones distintas: Google
      // toma `logo` para el panel de conocimiento. Ver SEO.org.logo por el
      // requisito de tamaño mínimo.
      logo: `${SITE_URL}${SEO.org.logo}`,
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
      // Cierra el triángulo empresa → fundador → autor de los artículos: los
      // posts ya firman con este mismo @id, así que declararlo acá consolida
      // una sola entidad Person en todo el sitio (señal E-E-A-T). Es una
      // referencia a propósito: el nodo completo vive en /nosotros, que es su
      // página canónica, y no se duplica en cada página del sitio.
      founder: { "@id": `${SITE_URL}/nosotros#person` },
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
