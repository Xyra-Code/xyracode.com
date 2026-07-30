import type { Demo, DemoProduct } from "@/lib/content/demos";
import { ProductGrid } from "./ProductGrid";

/**
 * "También de esta categoría": hasta 4 productos de la misma categoría,
 * excluyendo el que se está viendo.
 *
 * Recibe la demo y el producto actual —y no una lista ya filtrada— porque el
 * criterio "misma categoría, sin el actual" es de esta sección y no de la página:
 * así el detalle no repite la regla y cambiarla es tocar un solo archivo. La demo
 * ya trae `productos`, así que no se pierde ningún dato en el camino.
 *
 * Sin `"use client"`: la renderiza el Server Component del detalle. `ProductGrid`
 * ya trae cableado el botón de agregar, que sí es cliente y lee el CartProvider
 * del layout.
 *
 * El corte en 4 es por la grilla: 4 columnas arriba de 768px y 2 debajo, así que
 * son una fila en desktop y dos en móvil. Con menos de 4 relacionados las
 * columnas no se estiran, porque son fracciones fijas y no `auto-fit`.
 */
export function RelatedProducts({
  demo,
  producto,
}: {
  demo: Demo;
  producto: DemoProduct;
}) {
  const relacionados = demo.productos
    .filter((otro) => otro.categoria === producto.categoria && otro.slug !== producto.slug)
    .slice(0, 4);

  // Una categoría de un solo producto no deja relacionados: mejor no mostrar la
  // sección que mostrar un título con la grilla vacía.
  if (relacionados.length === 0) return null;

  return (
    <section className="mt-14 md:mt-18">
      <h2 className="border-b border-[var(--borde)] pb-4 font-(family-name:--font-archivo) text-[21px] font-bold tracking-[-0.03em] uppercase md:text-[26px]">
        También de esta categoría
      </h2>

      <div className="mt-6">
        <ProductGrid productos={relacionados} demo={demo} />
      </div>
    </section>
  );
}
