import { notFound } from "next/navigation";
import { getDemo } from "@/lib/content";

/**
 * Stub temporal: la home real de la tienda (hero, destacados, categorías, tira
 * de confianza) es la Tarea 9 del plan. Esto existe para que la ruta compile y
 * se pueda verificar el tema y el aislamiento de metadata.
 */
export default async function DemoHome({
  params,
}: {
  params: Promise<{ cliente: string }>;
}) {
  const { cliente } = await params;
  const demo = getDemo(cliente);
  if (!demo) notFound();

  return (
    <div className="p-10">
      <h1 className="font-(family-name:--font-archivo) text-4xl font-bold uppercase">
        {demo.negocio.nombre}
      </h1>
      <p className="mt-2 text-[var(--atenuado)]">{demo.negocio.tagline}</p>
      <p className="mt-6 max-w-prose text-[var(--cuerpo)]">{demo.hero.subtitulo}</p>
      <p className="mt-6 font-(family-name:--font-mono-demo) text-[13px] text-[var(--atenuado-suave)]">
        {demo.productos.length} productos · {demo.categorias.length} categorías
      </p>
    </div>
  );
}
