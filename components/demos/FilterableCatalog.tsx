"use client";

import { useSyncExternalStore } from "react";
import type { Demo, DemoCategory } from "@/lib/content";
import { CategoryEmpty } from "./CategoryEmpty";
import { ProductGrid } from "./ProductGrid";

/**
 * El filtro del catálogo vive en el **hash de la URL**, no en `useState`.
 *
 * Tres razones, en orden de peso:
 *
 * 1. `searchParams` está prohibido en esta rama: leerlo saca la página del
 *    prerender estático, que es un requisito duro de la demo. Un hash, en
 *    cambio, el servidor nunca lo ve, así que el HTML se sigue generando una
 *    sola vez.
 * 2. El nav ya enlaza a `/catalogo#<slug>` (ver StoreNav), así que el hash es
 *    una entrada que hay que leer de todas formas. Con `useState` habría dos
 *    fuentes de verdad —el estado y el hash— y el segundo clic en un enlace del
 *    nav, ya estando en el catálogo, no haría nada.
 * 3. `useSyncExternalStore` con `getServerSnapshot` es la forma que React expone
 *    para leer algo del navegador sin romper la hidratación y sin llamar a
 *    `setState` dentro de un efecto, que es lo que prohíbe
 *    `react-hooks/set-state-in-effect`. Es el mismo patrón que usa el carrito
 *    (lib/demos/cart-store.ts) para `localStorage`.
 *
 * El snapshot es un **string primitivo**, así que se compara por valor y no hace
 * falta cachear una referencia como sí hace el store del carrito con su array.
 */

const escuchas = new Set<() => void>();

function suscribirHash(escucha: () => void) {
  escuchas.add(escucha);
  // `hashchange` cubre los enlaces del nav y el botón de atrás del navegador...
  window.addEventListener("hashchange", escucha);
  return () => {
    escuchas.delete(escucha);
    window.removeEventListener("hashchange", escucha);
  };
}

/**
 * ...pero `replaceState` NO dispara `hashchange`, así que los clics en los chips
 * se avisan a mano. Igual que el `set` del store del carrito: escribir y
 * notificar.
 */
function escribirHash(slug: string) {
  // Sin slug se borra el hash en vez de dejar un "#" colgando en la barra.
  const url = slug ? `#${slug}` : window.location.pathname + window.location.search;
  /**
   * `replaceState` y no `pushState`: el filtro no es un destino. Con `pushState`
   * probar cuatro chips dejaría cuatro entradas en el historial y "atrás" no
   * volvería a la página anterior sino al chip anterior.
   *
   * Tampoco cambia el scroll: `replaceState` no salta al ancla, y de todos modos
   * ningún elemento de la página tiene estos ids.
   */
  window.history.replaceState(null, "", url);
  for (const escucha of escuchas) escucha();
}

/** Los slugs son kebab-case ASCII, así que el hash no necesita decodificarse. */
function leerHash() {
  return window.location.hash.slice(1);
}

/**
 * El servidor no tiene `location`. Devolver "" hace que el HTML prerenderizado
 * salga con el catálogo completo —que es lo correcto sin JavaScript— y React
 * repinta con la categoría del hash recién después de hidratar, sin desajuste.
 */
function hashDelServidor() {
  return "";
}

const CHIP_BASE =
  "h-10 shrink-0 rounded-full border px-4 font-medium text-[14px] transition-colors md:text-[15px]";

export function FilterableCatalog({ demo }: { demo: Demo }) {
  const hash = useSyncExternalStore(suscribirHash, leerHash, hashDelServidor);

  // Un hash que no es ninguna categoría —un ancla vieja, un link mal copiado—
  // cae en "Todos" en vez de dejar el catálogo en blanco.
  const activa: DemoCategory | undefined = demo.categorias.find((c) => c.slug === hash);

  const visibles = activa
    ? demo.productos.filter((producto) => producto.categoria === activa.slug)
    : demo.productos;

  const total = demo.productos.length;

  return (
    <section className="mx-auto max-w-[1240px] px-4 py-9 md:px-6 md:py-14">
      <header className="flex flex-wrap items-end justify-between gap-x-6 gap-y-2">
        <div>
          <h1 className="font-(family-name:--font-archivo) text-[44px] leading-[0.95] font-bold tracking-[-0.04em] uppercase md:text-[60px]">
            Catálogo
          </h1>
          <p className="mt-2 text-[15px] text-[var(--atenuado)] md:text-[16px]">
            {total} referencias · precios en pesos
          </p>
        </div>

        {/*
          `aria-live` porque el filtro no navega: sin esto, quien usa lector de
          pantalla pulsa un chip y no recibe ninguna señal de que la grilla
          cambió. El conteo es justamente el resumen que necesita oír.
        */}
        <p
          aria-live="polite"
          className="font-(family-name:--font-mono-demo) text-[11px] tracking-[0.1em] text-[var(--atenuado-suave)] md:text-[12px]"
        >
          Mostrando {visibles.length} de {total}
        </p>
      </header>

      {/*
        Chips pill. En móvil la fila se desborda con scroll horizontal —los
        márgenes negativos la dejan sangrar hasta el borde de la pantalla, así se
        ve que hay más a la derecha— y en desktop envuelve.

        `group` con `aria-label` para que se anuncien como un conjunto de
        filtros y no como cuatro botones sueltos; `aria-pressed` para que se
        anuncie cuál está aplicado, que es información que hoy solo da el color.
      */}
      <div
        role="group"
        aria-label="Filtrar por categoría"
        className="-mx-4 mt-6 flex gap-2 overflow-x-auto px-4 md:mx-0 md:flex-wrap md:px-0"
      >
        {[{ slug: "", nombre: "Todos" }, ...demo.categorias].map((categoria) => {
          const seleccionado = categoria.slug === (activa?.slug ?? "");
          return (
            <button
              key={categoria.slug || "todos"}
              type="button"
              aria-pressed={seleccionado}
              onClick={() => escribirHash(categoria.slug)}
              className={`${CHIP_BASE} ${
                seleccionado
                  ? "border-[var(--acento)] bg-[var(--acento)] text-[var(--acento-texto)]"
                  : "border-[var(--borde-fuerte)] text-[var(--texto)] hover:bg-[var(--superficie)]"
              }`}
            >
              {categoria.nombre}
            </button>
          );
        })}
      </div>

      <div className="mt-6 md:mt-8">
        {activa && visibles.length === 0 ? (
          <CategoryEmpty
            demo={demo}
            categoria={activa}
            onVerTodos={() => escribirHash("")}
          />
        ) : (
          // Con "Todos" y cero productos no se muestra el estado vacío: una demo
          // sin catálogo es un dato mal cargado, no una pantalla que valga la
          // pena diseñar.
          <ProductGrid productos={visibles} demo={demo} />
        )}
      </div>
    </section>
  );
}
