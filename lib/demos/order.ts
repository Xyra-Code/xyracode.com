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

/**
 * Consulta general a la tienda, sin un producto en la mano. La usan el CTA
 * secundario del hero y el enlace del footer: son las dos puertas de "quiero
 * preguntar algo" que no salen de una tarjeta.
 *
 * El mensaje vive acá y no escrito en cada componente porque los dos tienen que
 * decir lo mismo — si uno cambia, el cliente recibe dos primeras frases
 * distintas según por dónde le escribieron.
 */
export function buildStoreInquiryHref(whatsapp: string, negocio: string): string {
  return buildOrderHref(
    whatsapp,
    `Hola ${negocio}, vi su tienda y quiero preguntar por sus productos.`,
  );
}

/**
 * Consulta por la segunda línea de negocio de la persona —hoy los
 * entrenamientos—. El mensaje va dirigido a ELLA por su nombre y no al negocio:
 * quien vende una sesión de entrenamiento es la persona, y el chat lo atiende
 * ella misma.
 *
 * Mismo motivo que arriba para vivir acá: lo arman la sección de la home y el
 * footer, y dos plantillas se desincronizan.
 */
export function buildServiceInquiryHref(
  whatsapp: string,
  persona: string,
  servicio: string,
): string {
  return buildOrderHref(
    whatsapp,
    `Hola ${persona}, quiero información sobre ${servicio.toLowerCase()}.`,
  );
}
