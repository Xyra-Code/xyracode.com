import Link from "next/link";
import type { Demo, DemoCategory } from "@/lib/content/demos";

type Props = {
  demo: Demo;
  categoria: DemoCategory;
  /** Posición en `demo.categorias`. Da el numeral y decide cuál va en acento. */
  indice: number;
};

/**
 * Tarjeta de categoría de la home. En desktop es un bloque con el numeral
 * arriba y el nombre grande abajo; en móvil colapsa a una fila con el nombre a
 * la izquierda y el conteo a la derecha (handoff, captura `1b`).
 *
 * **La primera va rellena de `acento`** y las demás en `superficie`: lo pide el
 * handoff y no es decoración, es la jerarquía del negocio —la categoría que más
 * vende arranca el recorrido— sin necesidad de un campo `destacada` en los datos.
 */
export function CategoryCard({ demo, categoria, indice }: Props) {
  const destacada = indice === 0;

  // El conteo se calcula acá y no se recibe por prop: es el único dato derivado
  // de la tarjeta y pasarlo desde la página solo abriría la puerta a que
  // quedaran desfasados.
  const cantidad = demo.productos.filter((p) => p.categoria === categoria.slug).length;

  /**
   * El hash, no un `?cat=`: el filtro del catálogo corre en el navegador porque
   * leer `searchParams` sacaría la página del prerender estático, y un hash sí
   * sobrevive al prerender — `FilterableCatalog` lo lee al montar.
   */
  const href = `/demos/${demo.slug}/catalogo#${categoria.slug}`;

  return (
    <Link
      href={href}
      className={`flex items-center gap-4 rounded-[4px] border p-4 transition-colors md:min-h-[172px] md:flex-col md:items-stretch md:p-5 ${
        destacada
          ? "border-[var(--acento)] bg-[var(--acento)] hover:bg-[color-mix(in_srgb,var(--acento)_88%,var(--texto))]"
          : "border-[var(--borde)] bg-[var(--superficie)] hover:bg-[var(--superficie-foto)]"
      }`}
    >
      {/*
        Numeral decorativo: ordena la lista a la vista y se oculta en móvil, donde
        la tarjeta es una fila y no hay dónde ponerlo. Fuera del árbol de
        accesibilidad — "cero uno" antes de cada categoría es ruido al escucharlo.
      */}
      <span
        aria-hidden="true"
        className={`hidden font-(family-name:--font-mono-demo) text-[11px] tracking-[0.12em] md:block ${
          destacada ? "text-[var(--acento-profundo)]" : "text-[var(--atenuado-suave)]"
        }`}
      >
        {String(indice + 1).padStart(2, "0")}
      </span>

      {/* Fila en móvil (nombre / conteo), bloque apilado y pegado abajo en desktop. */}
      <span className="flex flex-1 items-center justify-between gap-4 md:mt-auto md:block">
        <span
          className={`block font-(family-name:--font-archivo) text-[17px] leading-none font-bold tracking-[-0.02em] uppercase md:text-[26px] ${
            destacada ? "text-[var(--acento-texto)]" : "text-[var(--texto)]"
          }`}
        >
          {categoria.nombre}
        </span>
        <span
          className={`block shrink-0 font-(family-name:--font-mono-demo) text-[11px] md:mt-3 md:font-(family-name:--font-manrope) md:text-[14px] ${
            destacada ? "text-[var(--acento-profundo)]" : "text-[var(--atenuado)]"
          }`}
        >
          {cantidad} referencias
        </span>
      </span>
    </Link>
  );
}
