import type { DemoProduct } from "@/lib/content";
import type { OrderLine } from "./order";

/**
 * Lo único que se persiste del carrito. Nombre, foto y precio NO se guardan: se
 * resuelven contra el catálogo al renderizar, así un `localStorage` viejo no
 * puede mostrar un precio que ya cambió.
 */
export type CartItem = { slug: string; variante?: string; cantidad: number };

/** Línea de pedido más el producto y el ítem que la originaron. */
export type ResolvedLine = OrderLine & { item: CartItem; producto: DemoProduct };

/** Clave de `localStorage`, aislada por demo. */
export function cartStorageKey(demoSlug: string): string {
  return `carrito:${demoSlug}`;
}

/**
 * Cruza el carrito persistido con el catálogo actual.
 *
 * Guardar solo slug, variante y cantidad hace imposible mostrar un precio viejo,
 * pero obliga a filtrar dos casos que romperían el render:
 *
 * 1. Un producto que ya no está en el catálogo — el `localStorage` sobrevive a
 *    los despliegues, así que esto pasa de verdad.
 * 2. Un producto con `precio: null`, que nunca debería haber entrado al carrito
 *    (su tarjeta va directo a WhatsApp). Se filtra igual, como defensa: es lo que
 *    sostiene que `OrderLine.precio` sea `number` y no `number | null`.
 */
export function resolveCart(items: CartItem[], productos: DemoProduct[]): ResolvedLine[] {
  return items.flatMap((item) => {
    const producto = productos.find((candidato) => candidato.slug === item.slug);
    if (!producto || producto.precio === null) return [];

    return [
      {
        item,
        producto,
        nombre: producto.nombre,
        cantidad: item.cantidad,
        precio: producto.precio,
        variante: item.variante,
      },
    ];
  });
}

/** Total del carrito en COP. */
export function cartTotal(lineas: ResolvedLine[]): number {
  return lineas.reduce((suma, linea) => suma + linea.precio * linea.cantidad, 0);
}

/** Suma de unidades — es lo que muestra el globo del nav, no la cantidad de líneas. */
export function cartUnits(lineas: ResolvedLine[]): number {
  return lineas.reduce((suma, linea) => suma + linea.cantidad, 0);
}

/** Dos ítems son el mismo si coinciden producto y variante. */
export function sameCartItem(a: CartItem, slug: string, variante?: string): boolean {
  return a.slug === slug && a.variante === variante;
}
