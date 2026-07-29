import type { Demo, DemoProduct } from "@/lib/content";
import { ProductCard } from "./ProductCard";

/**
 * Grilla de tarjetas de producto.
 *
 * Columnas en **fracciones fijas** (2 en móvil, 4 arriba de 768px) y no
 * `auto-fit`: con cuatro productos —los destacados de la home, los relacionados
 * del detalle o una categoría corta— `auto-fit` con un `minmax` chico deja una
 * fila de tarjetas estiradas o encogidas según cuántas haya, y la foto 1:1
 * arrastraría el alto de toda la fila. Con fracciones fijas una tarjeta mide lo
 * mismo en las tres pantallas (handoff, "Estructura por pantalla" §2).
 *
 * Es una lista de verdad para que un lector de pantalla anuncie cuántos
 * productos hay antes de recorrerlos. Sin `"use client"`: la home y los
 * relacionados la renderizan en el servidor, y el catálogo desde el árbol
 * cliente.
 */
export function ProductGrid({
  productos,
  demo,
}: {
  productos: DemoProduct[];
  demo: Demo;
}) {
  return (
    <ul className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
      {productos.map((producto) => (
        // `flex` en el ítem para que la tarjeta ocupe todo el alto de la fila:
        // de eso depende el `mt-auto` que ancla el precio.
        <li key={producto.slug} className="flex">
          <ProductCard producto={producto} demo={demo} />
        </li>
      ))}
    </ul>
  );
}
