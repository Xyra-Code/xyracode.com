import { formatCOP } from "./format";

/**
 * Línea de pedido ya resuelta. El carrito persiste solo slug, variante y
 * cantidad; el nombre y el precio se resuelven contra DEMOS antes de llegar acá,
 * así un localStorage viejo no puede mostrar un precio viejo.
 *
 * `precio` es `number` y no `number | null` a propósito: un producto sin precio
 * no entra al carrito — su tarjeta va directo al chat con
 * `buildProductInquiryHref`.
 */
export type OrderLine = {
  nombre: string;
  cantidad: number;
  precio: number;
  /** Etiqueta y valor ya compuestos, p. ej. "Talla 8". */
  variante?: string;
};

/**
 * Texto del pedido para WhatsApp.
 *
 * Función pura y sin dependencias del DOM ni del estado: es la pieza con más
 * chance de salir mal (encoding, saltos de línea, formato de precios) y la más
 * barata de cubrir con tests.
 */
export function buildOrderMessage(negocio: string, lineas: OrderLine[]): string {
  const saludo = `Hola ${negocio}, quiero pedir:`;
  if (lineas.length === 0) return saludo;

  const items = lineas.map((linea) => {
    const variante = linea.variante ? ` (${linea.variante})` : "";
    const total = formatCOP(linea.precio * linea.cantidad);
    return `• ${linea.cantidad} × ${linea.nombre}${variante} — ${total}`;
  });

  const total = lineas.reduce(
    (suma, linea) => suma + linea.precio * linea.cantidad,
    0,
  );

  return [saludo, ...items, `Total: ${formatCOP(total)}`].join("\n");
}

/** Enlace wa.me con el pedido escrito. */
export function buildOrderHref(whatsapp: string, mensaje: string): string {
  return `https://wa.me/${whatsapp}?text=${encodeURIComponent(mensaje)}`;
}

/**
 * Enlace para preguntar por un producto puntual. Es el respaldo en dos casos:
 * cuando el precio es `null` y cuando el navegador no ejecuta JavaScript, donde
 * el carrito no abre pero cada tarjeta conserva su enlace.
 */
export function buildProductInquiryHref(
  whatsapp: string,
  negocio: string,
  nombre: string,
): string {
  return buildOrderHref(whatsapp, `Hola ${negocio}, quiero preguntar por: ${nombre}`);
}
