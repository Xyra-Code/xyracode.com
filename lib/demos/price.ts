import type { DemoProduct } from "@/lib/content";

/**
 * Lectura del precio de un producto de demo.
 *
 * Hay dos formas de precio en el modelo —único en `producto.precio`, o uno por
 * talla en `producto.variantes.opciones[].precio`— y este módulo es el único
 * lugar que sabe cuál está en juego. Los componentes preguntan "¿cuánto vale
 * esta talla?" o "¿qué rango muestro?" y no se enteran de la forma del dato.
 *
 * Nada acá inventa un precio: si no hay número, devuelve `null` y el llamador
 * cae en el estado "Consultar por [logo]".
 */

/** Rango de precios de un producto cuyo precio depende de la talla. */
export type RangoPrecio = { min: number; max: number };

/**
 * Precio de una talla concreta, o el precio único si el producto no tiene
 * variantes. `null` = sin precio publicado.
 *
 * Una `variante` que no existe en el catálogo devuelve `null` **a propósito**: el
 * carrito persiste tallas en `localStorage`, sobrevive a los despliegues, y una
 * talla que el cliente dejó de vender no puede resolver a un precio. Es el mismo
 * caso que un producto borrado, y `resolveCart` lo descarta igual.
 */
export function precioDe(producto: DemoProduct, variante?: string): number | null {
  const opciones = producto.variantes?.opciones;
  if (!opciones) return producto.precio ?? null;

  // Con variantes la talla es obligatoria: sin ella no hay precio que mostrar,
  // y devolver el de la primera sería inventarle una elección al comprador.
  if (variante === undefined) return null;

  return opciones.find((opcion) => opcion.valor === variante)?.precio ?? null;
}

/**
 * Rango de precios para la tarjeta del catálogo, o `null` si no hay rango que
 * mostrar: producto de precio único, sin precio, o con todas las tallas al mismo
 * valor. Ese último caso importa — "$ 109.900 – $ 109.900" es ruido, y el
 * llamador debe caer en el precio simple.
 */
export function rangoDe(producto: DemoProduct): RangoPrecio | null {
  const opciones = producto.variantes?.opciones;
  if (!opciones || opciones.length === 0) return null;

  const precios = opciones.map((opcion) => opcion.precio);
  const min = Math.min(...precios);
  const max = Math.max(...precios);

  return min === max ? null : { min, max };
}

/**
 * Lo que muestra la tarjeta del catálogo: el rango si el precio depende de la
 * talla, el número si es único, `null` si no hay precio.
 *
 * Existe para que `ProductCard` no repita la cadena `rangoDe() ?? precioDe()` y,
 * sobre todo, para que el orden de esa cadena esté decidido en un solo lugar.
 */
export function precioDeTarjeta(
  producto: DemoProduct,
): number | RangoPrecio | null {
  return rangoDe(producto) ?? precioDe(producto, producto.variantes?.opciones[0]?.valor);
}
