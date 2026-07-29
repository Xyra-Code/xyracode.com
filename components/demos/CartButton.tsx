"use client";

import { ShoppingBag } from "lucide-react";
import { useCart } from "./CartProvider";

/**
 * Contador del carrito en el nav.
 *
 * En 0 **no hay globo** y el ícono baja a `--atenuado-suave`: un globo con un
 * cero es ruido y sugiere que algo falta. El globo es una pill de 18px con
 * `min-w`, así crece a lo ancho con dos dígitos en vez de deformarse.
 */
export function CartButton() {
  const { unidades, abrir } = useCart();
  const vacio = unidades === 0;

  return (
    <button
      type="button"
      onClick={abrir}
      aria-label={vacio ? "Carrito vacío" : `Carrito: ${unidades} ítems`}
      className={`relative flex size-11 items-center justify-center transition-colors ${
        vacio
          ? "text-[var(--atenuado-suave)] hover:text-[var(--atenuado)]"
          : "text-[var(--texto)]"
      }`}
    >
      <ShoppingBag size={20} strokeWidth={1.75} />
      {!vacio && (
        <span
          // aria-hidden: la cuenta ya va en el aria-label del botón, y leerla dos
          // veces es peor que no leerla.
          aria-hidden
          className="absolute top-1.5 right-1 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-[var(--acento)] px-1 font-(family-name:--font-archivo) text-[11px] font-bold text-[var(--acento-texto)]"
        >
          {unidades}
        </span>
      )}
    </button>
  );
}
