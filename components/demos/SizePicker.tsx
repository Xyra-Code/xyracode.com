"use client";

/**
 * Selector de talla del detalle de producto. Botones de 48px; el elegido lleva
 * borde de 2px en `--acento` y fondo `--acento-suave` (handoff, "Componentes
 * compartidos").
 *
 * El alto y el ancho mínimo son fijos (`h-12 min-w-12`) y el modelo de caja de
 * Tailwind es `border-box`, así que pasar de 1px a 2px de borde **no mueve nada**:
 * el botón mide 48px elegido y sin elegir, y la fila no salta al tocar una talla.
 *
 * Semántica: grupo de botones con `aria-pressed`, no un `radiogroup`. Un
 * radiogroup obliga a implementar la navegación con flechas y a manejar el foco a
 * mano —el patrón ARIA lo exige, y si no se hace queda peor que sin rol—; con
 * botones normales cada talla es una parada de tabulador y se activa con Espacio
 * o Enter sin una línea de JavaScript de teclado. `aria-pressed` comunica cuál
 * está elegida.
 *
 * `valor` opcional y sin valor por defecto: cuando el producto tiene variantes la
 * talla es **obligatoria**, así que el estado inicial tiene que ser "ninguna
 * elegida" y no "la primera". Preseleccionar haría que alguien pida una talla que
 * no eligió.
 */

/** Etiqueta del bloque, en mono. Igual que la de Cantidad en ProductPurchase. */
const ETIQUETA =
  "font-(family-name:--font-mono-demo) text-[10px] tracking-[0.14em] text-[var(--atenuado)] uppercase md:text-[11px]";

export function SizePicker({
  label,
  opciones,
  valor,
  onChange,
}: {
  /** "Talla" en los guantes y la indumentaria. Sale de `producto.variantes`. */
  label: string;
  opciones: string[];
  valor?: string;
  onChange: (opcion: string) => void;
}) {
  return (
    <div>
      <p className={ETIQUETA}>{label}</p>

      <div role="group" aria-label={label} className="mt-2 flex flex-wrap gap-2">
        {opciones.map((opcion) => {
          const elegida = opcion === valor;

          return (
            <button
              key={opcion}
              type="button"
              aria-pressed={elegida}
              onClick={() => onChange(opcion)}
              className={`flex h-12 min-w-12 items-center justify-center rounded-[4px] px-3 font-(family-name:--font-archivo) text-[15px] font-bold text-[var(--texto)] transition-colors duration-150 ${
                elegida
                  ? "border-2 border-[var(--acento)] bg-[var(--acento-suave)]"
                  : "border border-[var(--borde-fuerte)] hover:bg-[var(--superficie)]"
              }`}
            >
              {/*
                El número o la talla van tal cual vienen del dato: "8", "XL". La
                caja la decide el dato, no un `uppercase` de CSS, porque acá no
                hay copy que traducir.
              */}
              {opcion}
            </button>
          );
        })}
      </div>
    </div>
  );
}
