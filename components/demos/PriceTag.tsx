import { formatCOP } from "@/lib/demos/format";
import { WhatsAppMark } from "./WhatsAppMark";

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
/**
 * `size` es un prop explícito y no un `className`: las clases de tamaño internas
 * y las que viniesen de afuera tienen el mismo peso, así que cuál gana lo decide
 * el orden de la hoja generada y no el del atributo. Un `className` haría que el
 * tamaño funcione o no según cómo Tailwind ordenó ese build.
 *
 * `md` es la tarjeta de la grilla; `lg` es el detalle, donde el precio es el
 * segundo elemento más grande de la pantalla después del título.
 */
const TAMANOS = {
  md: "text-[18px] md:text-[21px]",
  lg: "text-[28px] md:text-[36px]",
} as const;

export function PriceTag({
  precio,
  size = "md",
}: {
  precio: number | null;
  size?: keyof typeof TAMANOS;
}) {
  if (precio === null) {
    return (
      // Barra de acento a la izquierda en vez de un recuadro: marca el bloque sin
      // competir con el CTA, que es el único relleno de acento de la tarjeta.
      <div className="mt-auto border-l-2 border-[var(--acento)] pt-4 pl-2.5">
        <p className="font-(family-name:--font-mono-demo) text-[10px] tracking-[0.12em] text-[var(--atenuado)] uppercase md:text-[11px]">
          Precio
        </p>
        {/* `flex` y no un `<p>` de texto corrido: el logo alineado a la línea
            base quedaría bajo, y así el `gap` sustituye al espacio de la palabra
            que reemplaza. */}
        <p className="flex items-center gap-1.5 font-(family-name:--font-archivo) text-[15px] font-bold text-[var(--acento)] md:text-[16px]">
          Consultar por{" "}
          <WhatsAppMark size={16} />
        </p>
      </div>
    );
  }

  return (
    <p
      className={`mt-auto pt-4 font-(family-name:--font-archivo) font-bold tracking-[-0.02em] text-[var(--texto)] ${TAMANOS[size]}`}
    >
      {formatCOP(precio)}
    </p>
  );
}
