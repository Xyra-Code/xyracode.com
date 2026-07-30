import { Search } from "lucide-react";
import type { Demo, DemoCategory } from "@/lib/content/demos";
import { buildProductInquiryHref } from "@/lib/demos/order";
import { StoreButton } from "./StoreButton";
import { WhatsAppMark } from "./WhatsAppMark";

/**
 * Estado "categoría sin resultados" del catálogo
 * (handoff, "Estados (§8)": `1c`, tercer marco).
 *
 * Copy literal del spec §5.7. En caja normal, con las mayúsculas puestas por
 * CSS: en mayúscula sostenida algunos lectores de pantalla deletrean letra por
 * letra.
 *
 * Sin `"use client"` a propósito. No necesita ser cliente —no tiene estado ni
 * escucha eventos del navegador— y al importarlo desde `FilterableCatalog`
 * igual entra al bundle del cliente: la directiva marca el borde del árbol, no
 * cada archivo de adentro. Dejarlo sin marcar deja abierta la puerta a que el
 * detalle o la home lo reusen desde el servidor.
 *
 * El fondo va con borde **punteado**: es la señal de que el hueco es un vacío y
 * no una tarjeta que no cargó. Este sistema no tiene sombras, así que la
 * distinción tiene que salir del borde.
 */
export function CategoryEmpty({
  demo,
  categoria,
  onVerTodos,
}: {
  demo: Demo;
  categoria: DemoCategory;
  /** Reinicia el filtro a "Todos". El estado vive en FilterableCatalog. */
  onVerTodos: () => void;
}) {
  /**
   * Reusa el enlace de consulta por producto pasándole el nombre de la
   * categoría: el mensaje queda "quiero preguntar por: Accesorios", que es
   * exactamente lo que quiere decir quien llegó a una categoría vacía. No hace
   * falta una segunda función para armar el mismo `wa.me`.
   */
  const preguntar = buildProductInquiryHref(
    demo.negocio.whatsapp,
    demo.negocio.nombre,
    categoria.nombre,
  );

  return (
    <div className="flex flex-col items-center gap-4 rounded-[4px] border border-dashed border-[var(--borde-fuerte)] px-6 py-14 text-center md:py-20">
      <Search size={26} strokeWidth={1.6} className="text-[var(--atenuado-suave)]" />

      <h2 className="font-(family-name:--font-archivo) text-[21px] font-bold tracking-[-0.03em] uppercase md:text-[26px]">
        No hay nada en {categoria.nombre}
      </h2>

      <p className="max-w-100 text-[15px] leading-[1.6] text-[var(--atenuado)] md:text-[16px]">
        Se nos agotó por ahora. Escríbenos y te avisamos cuando vuelva a entrar.
      </p>

      {/*
        Botón secundario con el contorno en `--acento` (capturas/1c, tercer
        marco): es el único CTA de una pantalla vacía, así que necesita presencia,
        pero no se rellena de acento porque no es el clímax de una compra —el
        relleno queda reservado a "AGREGAR" y a "PEDIR POR WHATSAPP".

        El `!` hace falta porque estas dos utilidades chocan con las del propio
        `StoreButton` (`--borde-fuerte` y `--texto`), y entre clases del mismo
        peso el orden de la hoja de estilos decide, no el orden del string.
      */}
      <StoreButton
        href={preguntar}
        variant="secundario"
        external
        className="mt-2 border-[var(--acento)]! text-[var(--acento)]!"
      >
        Preguntar por{" "}
        <WhatsAppMark size={17} />
      </StoreButton>

      {/*
        Es un `<button>` y no un enlace porque no cambia de página: reinicia el
        filtro en el navegador. Va subrayado igual, que es la forma que tiene el
        diseño, pero un lector de pantalla lo anuncia como control y no promete
        una navegación que no va a pasar.
      */}
      <button
        type="button"
        onClick={onVerTodos}
        className="font-(family-name:--font-mono-demo) text-[12px] text-[var(--atenuado)] underline underline-offset-4 transition-colors hover:text-[var(--texto)]"
      >
        Ver todos los productos
      </button>
    </div>
  );
}
