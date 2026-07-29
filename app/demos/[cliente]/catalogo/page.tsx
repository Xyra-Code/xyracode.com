import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { FilterableCatalog } from "@/components/demos/FilterableCatalog";
import { getDemo } from "@/lib/content";

/**
 * `title` es un **string simple**, no un `absolute`, y eso importa: el layout de
 * la demo declara `template: "%s · <negocio>"`, así que este string sale como
 * "Catálogo · Guantes NR1". Con `absolute` se saltearía ese template, y un string
 * sin template propio en el layout caería en el de la raíz y titularía la tienda
 * del cliente como "Catálogo | XyraCode".
 *
 * El `canonical` se declara **autorreferencial**. Sin esto se hereda el del layout
 * y esta página diría que su versión canónica es la home de la demo, que es otra
 * URL con otro contenido. En una rama `noindex` es inocuo, pero es exactamente el
 * tipo de señal contradictoria que la revisión SEO del 2026-07-29 marcó como P0:
 * declarar una cosa y hacer otra.
 *
 * `robots`, `description` y `openGraph` sí se heredan del layout, y está bien.
 */
export async function generateMetadata({
  params,
}: {
  params: Promise<{ cliente: string }>;
}): Promise<Metadata> {
  const { cliente } = await params;
  return {
    title: "Catálogo",
    alternates: { canonical: `/demos/${cliente}/catalogo` },
  };
}

/**
 * No lleva `generateStaticParams` ni `dynamicParams`: el layout de `[cliente]` ya
 * genera el único param del segmento y declara `dynamicParams = false`, y los
 * params generados arriba cubren a las páginas hijas. Repetirlo acá sería una
 * segunda lista que se puede desincronizar.
 */
export default async function DemoCatalogo({
  params,
}: {
  params: Promise<{ cliente: string }>;
}) {
  const { cliente } = await params;
  const demo = getDemo(cliente);
  if (!demo) notFound();

  // Toda la interactividad —el filtro— es del cliente. Esta página solo resuelve
  // la demo y le pasa los datos, así que se prerenderiza completa.
  return <FilterableCatalog demo={demo} />;
}
