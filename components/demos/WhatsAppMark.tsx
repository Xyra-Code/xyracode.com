import { WhatsAppIcon } from "@/components/ui/BrandIcons";

/**
 * El logo de WhatsApp en lugar de la palabra, para las etiquetas de los CTA de
 * la tienda: "Escribir por [logo]", "Consultar por [logo]".
 *
 * El logo se reconoce antes de leerse y el botón queda más corto, que en móvil
 * es la diferencia entre una línea y dos.
 *
 * **La palabra sigue en el DOM** dentro de un `sr-only`, y no es opcional: el
 * `<svg>` de `BrandIcons` va `aria-hidden`, así que sin ella el nombre accesible
 * del control quedaría "Escribir por" — una frase cortada que no dice a dónde
 * lleva. Va antes del logo para que el nombre se lea en orden.
 *
 * El espacio entre la palabra anterior y el logo lo pone el `gap` del contenedor
 * (todos los sitios de uso son flex), pero cada llamada agrega igual un `{" "}`
 * literal: el `sr-only` está fuera de flujo, así que no aporta separación al
 * texto plano, y sin el espacio el nombre accesible sería "EscribirporWhatsApp".
 *
 * Sin `"use client"` y sin imports server-only: se usa desde el árbol servidor
 * (hero, footer) y desde dentro de componentes cliente (catálogo, detalle).
 */
export function WhatsAppMark({ size = 18 }: { size?: number }) {
  return (
    <>
      <span className="sr-only">WhatsApp</span>
      <WhatsAppIcon size={size} className="shrink-0" />
    </>
  );
}
