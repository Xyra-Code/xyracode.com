import { formatCOP } from "@/lib/demos/format";
import type { RangoPrecio } from "@/lib/demos/price";
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
  sinPrecio = "texto",
}: {
  /**
   * Un número, un rango, o `null` si no hay precio publicado.
   *
   * El rango es el caso de la tarjeta del catálogo cuando el precio depende de la
   * talla: ahí no hay una cifra que sea LA del producto, y mostrar la más baja a
   * secas sería prometer un precio que en la talla 10 no existe.
   */
  precio: number | RangoPrecio | null;
  size?: keyof typeof TAMANOS;
  /**
   * Qué ofrece el estado sin precio.
   *
   * `"texto"` —el de la tarjeta— dice "Consultar" y nada más: el CTA de al lado
   * lleva al detalle, y prometer el chat desde la grilla mandaría a la persona
   * fuera del sitio antes de haber visto el producto.
   *
   * `"whatsapp"` es el detalle, donde el CTA de abajo **sí** es el chat: ahí el
   * logo anticipa a dónde va el botón, en lugar de contradecirlo.
   */
  sinPrecio?: "texto" | "whatsapp";
}) {
  if (precio !== null && typeof precio !== "number") {
    return (
      <p
        className={`mt-auto pt-4 font-(family-name:--font-archivo) font-bold tracking-[-0.02em] text-[var(--texto)] ${TAMANOS[size]}`}
      >
        {/*
          El rango puede envolver a dos líneas en una tarjeta angosta —a 320px lo
          hace siempre— y hay dos cosas que no debe partir.

          Cada cifra va en su `whitespace-nowrap`, para que nunca se corte un precio
          por la mitad. Y el separador es " — ": espacio normal ANTES del guion
          y espacio duro DESPUÉS. Así la única oportunidad de corte queda delante
          del guion, y el segundo renglón empieza en "— $ 159.900". Antes, con
          espacios normales a los dos lados, el corte caía después y dejaba
          "$ 129.900 —" colgando al final de la primera línea, que se lee como un
          precio incompleto.

          El espacio duro va en el texto y no como clase porque tiene que estar
          entre los dos spans: envolver el guion junto a la cifra dejaría a
          `formatCOP(max)` sin ser el contenido completo de su elemento, y las
          pruebas de precio consultan justamente por esa cifra sola.
        */}
        <span className="whitespace-nowrap">{formatCOP(precio.min)}</span>
        {" — "}
        <span className="whitespace-nowrap">{formatCOP(precio.max)}</span>
      </p>
    );
  }

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
          {sinPrecio === "whatsapp" ? (
            <>
              Consultar por <WhatsAppMark size={16} />
            </>
          ) : (
            "Consultar"
          )}
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
