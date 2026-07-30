import type { Demo, DemoProduct } from "@/lib/content";
import { precioDeTarjeta, rangoDe } from "@/lib/demos/price";
import { ProductCard } from "./ProductCard";
import { QuickAddButton } from "./QuickAddButton";
import { StoreButton } from "./StoreButton";

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
      {productos.map((producto) => {
        const detalle = `/demos/${demo.slug}/p/${producto.slug}`;

        return (
          // `flex` en el ítem para que la tarjeta ocupe todo el alto de la fila:
          // de eso depende el `mt-auto` que ancla el precio.
          <li key={producto.slug} className="flex">
            {/*
              El CTA se inyecta acá y no dentro de ProductCard a propósito: así la
              tarjeta no depende del CartProvider y se puede testear suelta. Los
              tres usos de la grilla —destacados, catálogo y relacionados— reciben
              el botón sin repetir el cableado.

              Tres casos, en este orden:

              1. Sin precio → sin botón. La tarjeta pone "Ver producto" y la
                 consulta se hace en el detalle, no desde la grilla.
              2. Precio por talla → enlace al detalle. Desde la grilla no hay
                 dónde elegir talla, y con el precio dependiendo de ella un
                 "Agregar" metería al carrito una talla que nadie eligió a un
                 precio que la tarjeta nunca mostró. La tarjeta muestra el rango;
                 el precio se resuelve al elegir.
              3. Precio único → agregado directo, que es el camino más corto.
            */}
            <ProductCard
              producto={producto}
              demo={demo}
              cta={
                precioDeTarjeta(producto) === null ? undefined : rangoDe(producto) ? (
                  <StoreButton href={detalle} full>
                    Elegir talla
                  </StoreButton>
                ) : (
                  // El respaldo sin JavaScript es el detalle del producto: la
                  // única página que, sin carrito, sigue sirviendo para comprar.
                  <QuickAddButton producto={producto} fallbackHref={detalle} />
                )
              }
            />
          </li>
        );
      })}
    </ul>
  );
}
