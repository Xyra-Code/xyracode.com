"use client";

import { Minus, Plus } from "lucide-react";

/**
 * Selector de cantidad. Se reusa en el detalle de producto y en cada línea del
 * panel del carrito, así que no asume dónde vive.
 *
 * `min` existe porque los dos usos difieren: en el detalle el mínimo es 1 (no
 * tiene sentido "agregar cero"), y en el panel es 0, donde bajar hasta el fondo
 * quita el ítem.
 */
export function QuantityStepper({
  valor,
  onChange,
  min = 1,
  etiqueta = "Cantidad",
}: {
  valor: number;
  onChange: (nuevo: number) => void;
  min?: number;
  etiqueta?: string;
}) {
  const boton =
    "flex size-11 items-center justify-center text-[var(--texto)] transition-colors hover:bg-[var(--superficie)] disabled:text-[var(--atenuado-suave)] disabled:hover:bg-transparent";

  return (
    <div
      className="inline-flex items-center rounded-[4px] border border-[var(--borde)]"
      role="group"
      aria-label={etiqueta}
    >
      <button
        type="button"
        onClick={() => onChange(valor - 1)}
        disabled={valor <= min}
        aria-label="Quitar uno"
        className={boton}
      >
        <Minus size={16} strokeWidth={1.75} />
      </button>
      <span
        aria-live="polite"
        className="min-w-9 border-x border-[var(--borde)] px-1 text-center font-(family-name:--font-archivo) text-[15px] font-bold text-[var(--texto)]"
      >
        {valor}
      </span>
      <button
        type="button"
        onClick={() => onChange(valor + 1)}
        aria-label="Agregar uno"
        className={boton}
      >
        <Plus size={16} strokeWidth={1.75} />
      </button>
    </div>
  );
}
