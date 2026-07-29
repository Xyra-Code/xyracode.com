import { formatCOP } from "@/lib/demos/format";

/**
 * Precio de un producto, o el estado "sin precio publicado".
 *
 * El precio va en `--texto` y grande, nunca en `--acento`: es la decisión de
 * compra, y el acento está reservado a CTA, chip activo y contador (handoff,
 * "Paleta · justificación"). La excepción es justamente el caso `null`, donde no
 * hay cifra que leer y el acento sirve para señalar que hay que preguntar.
 *
 * `mt-auto` vive acá y no en un envoltorio de la tarjeta: en la grilla las
 * tarjetas de una fila miden lo mismo, así que anclar el precio abajo deja
 * precios y CTA alineados aunque un nombre ocupe tres líneas. En un contenedor
 * que no sea flex, `margin-top: auto` computa a 0, así que no estorba cuando el
 * detalle reusa el componente.
 *
 * Sin `"use client"`: lo usan el catálogo (árbol cliente) y el detalle (servidor).
 */
export function PriceTag({ precio }: { precio: number | null }) {
  if (precio === null) {
    return (
      // Barra de acento a la izquierda en vez de un recuadro: marca el bloque sin
      // competir con el CTA, que es el único relleno de acento de la tarjeta.
      <div className="mt-auto border-l-2 border-[var(--acento)] pt-4 pl-2.5">
        <p className="font-(family-name:--font-mono-demo) text-[10px] tracking-[0.12em] text-[var(--atenuado)] uppercase md:text-[11px]">
          Precio
        </p>
        <p className="font-(family-name:--font-archivo) text-[15px] font-bold text-[var(--acento)] md:text-[16px]">
          Consultar por WhatsApp
        </p>
      </div>
    );
  }

  return (
    <p className="mt-auto pt-4 font-(family-name:--font-archivo) text-[18px] font-bold tracking-[-0.02em] text-[var(--texto)] md:text-[21px]">
      {formatCOP(precio)}
    </p>
  );
}
