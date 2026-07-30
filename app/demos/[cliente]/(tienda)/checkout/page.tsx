import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CheckoutFlow } from "@/components/demos/CheckoutFlow";
import { getDemo } from "@/lib/content/demos";

/**
 * `title` es un **string simple**: así lo toma el `template` del layout de la
 * demo (`%s · Guantes NR1`). Con `absolute` se saltearía ese template, y con un
 * string pero sin template propio en el layout caería en el de la raíz, que dice
 * "| XyraCode".
 *
 * El `canonical` va autorreferencial, como en el catálogo y el detalle: heredarlo
 * del layout haría que esta página declarara la home de la demo como su versión
 * canónica.
 */
export async function generateMetadata({
  params,
}: {
  params: Promise<{ cliente: string }>;
}): Promise<Metadata> {
  const { cliente } = await params;
  return {
    title: "Pagar",
    alternates: { canonical: `/demos/${cliente}/checkout` },
  };
}

/**
 * No lleva `generateStaticParams` ni `dynamicParams`: el layout de `[cliente]` ya
 * genera el param del segmento y declara `dynamicParams = false`, y eso cubre a
 * las páginas hijas.
 */
export default async function DemoCheckout({
  params,
}: {
  params: Promise<{ cliente: string }>;
}) {
  const { cliente } = await params;
  const demo = getDemo(cliente);
  if (!demo) notFound();

  // El carrito vive en el navegador, así que esta página se prerenderiza completa
  // y el flujo entero corre en el cliente.
  return <CheckoutFlow demo={demo} />;
}
