"use client";

import type { DemoProduct } from "@/lib/content";
import { useCart } from "./CartProvider";
import { storeButtonClasses } from "./StoreButton";

/**
 * CTA "Agregar" de la tarjeta de producto.
 *
 * Se renderiza como **`<a>` al detalle del producto**, no como `<button>`, y eso
 * es deliberado: la tarjeta tiene que conservar una salida para el caso sin
 * JavaScript, donde el carrito no abre pero el catálogo sigue siendo HTML
 * legible. Con JS el `onClick` intercepta el clic, lo cancela y agrega al
 * carrito; sin JS el navegador sigue el `href` y el comprador llega al detalle,
 * que es una página de servidor con la ficha completa.
 *
 * La alternativa —renderizar un `<button>` y cambiarlo después de montar— exigía
 * un `useState` + `useEffect` que la regla `react-hooks/set-state-in-effect`
 * rechaza, y dejaba un salto visual. Un solo elemento que funciona de las dos
 * formas es más simple y más robusto.
 *
 * Agrega 1 unidad con la **primera** variante y abre el panel: desde la grilla no
 * hay dónde elegir talla, y abrir el panel deja ver de inmediato qué se agregó y
 * permite corregir la cantidad ahí mismo.
 */
export function QuickAddButton({
  producto,
  fallbackHref,
}: {
  producto: DemoProduct;
  /** Enlace al detalle de este producto. Es el respaldo sin JavaScript. */
  fallbackHref: string;
}) {
  const { add, abrir } = useCart();

  return (
    <a
      href={fallbackHref}
      onClick={(evento) => {
        evento.preventDefault();
        add(producto.slug, producto.variantes?.opciones[0]?.valor, 1);
        abrir();
      }}
      className={storeButtonClasses("primario", true)}
    >
      Agregar
    </a>
  );
}
