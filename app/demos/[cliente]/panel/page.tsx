import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PanelDemo } from "@/components/demos/PanelDemo";
import { getDemo } from "@/lib/content/demos";

/**
 * `title` es un **string simple**: así lo toma el `template` del layout de la demo
 * y sale "Panel · Guantes NR1". Con `absolute` se saltearía ese template, y con un
 * string pero sin template propio en el layout caería en el de la raíz, que dice
 * "| XyraCode".
 *
 * El `canonical` va autorreferencial, como el resto de la rama: heredarlo del
 * layout haría que esta página declarara la home de la tienda como su versión
 * canónica.
 */
export async function generateMetadata({
  params,
}: {
  params: Promise<{ cliente: string }>;
}): Promise<Metadata> {
  const { cliente } = await params;
  return {
    title: "Panel",
    alternates: { canonical: `/demos/${cliente}/panel` },
  };
}

/**
 * Vive **fuera** del route group `(tienda)`, así que no hereda el nav, el carrito
 * ni el footer del comercio: es la superficie de administración, no la vitrina. Sí
 * hereda el tema y las fuentes, que están en el layout de `[cliente]`.
 *
 * No lleva `generateStaticParams` ni `dynamicParams`: el layout de `[cliente]` ya
 * genera el param del segmento y eso cubre a las páginas hijas.
 */
export default async function DemoPanel({
  params,
}: {
  params: Promise<{ cliente: string }>;
}) {
  const { cliente } = await params;
  const demo = getDemo(cliente);
  if (!demo) notFound();

  return <PanelDemo demo={demo} />;
}
