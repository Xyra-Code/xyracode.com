/**
 * Helpers de datos estructurados (schema.org) reutilizables entre páginas.
 * Cada página arma su propio @graph e inserta estos nodos donde corresponda.
 */
import type { Block, Inline } from "@/lib/content/blocks";
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
