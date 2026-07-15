/**
 * Helpers de datos estructurados (schema.org) reutilizables entre páginas.
 * Cada página arma su propio @graph e inserta estos nodos donde corresponda.
 */
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
