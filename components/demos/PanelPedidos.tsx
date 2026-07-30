"use client";

import { useState } from "react";
import { formatCOP } from "@/lib/demos/format";
import type { EstadoPedido, PedidoDemo } from "@/lib/demos/panel";

/**
 * Los pedidos que entrarían por la tienda, con el cambio de estado funcionando.
 *
 * **Tarjetas, no una tabla.** Una tabla de seis columnas a 320px obliga a scroll
 * horizontal o a esconder columnas, y este panel se abre desde el celular justo el
 * día que hay que despachar.
 *
 * **El estado se cambia de verdad**, en `useState`. Botones que no hacen nada
 * dejan al prospecto probando si la demo está rota; que el estado cambie y el
 * contador de "sin preparar" baje es la mitad de lo que esta pantalla vende. No
 * persiste entre recargas, y para una demo eso alcanza.
 *
 * Sobre los estados: "despachado" y "enviado" son el mismo momento para un negocio
 * que entrega a una transportadora, así que van unidos en **Despachado**. En su
 * lugar entra **Entregado**, que sí es un estado distinto y es el que cierra el
 * pedido.
 */

/** Flujo lineal más una salida. El orden del array es el orden del avance. */
const FLUJO: EstadoPedido[] = ["nuevo", "confirmado", "despachado", "entregado"];

const ESTADOS: Record<EstadoPedido, { texto: string; insignia: string }> = {
  // El único con relleno de acento es "nuevo": es el que exige una acción.
  nuevo: { texto: "Nuevo", insignia: "bg-[var(--acento)] text-[var(--acento-texto)]" },
  confirmado: {
    texto: "Confirmado",
    insignia: "border border-[var(--borde-fuerte)] text-[var(--texto)]",
  },
  despachado: {
    texto: "Despachado",
    insignia: "border border-[var(--borde-fuerte)] text-[var(--texto)]",
  },
  entregado: {
    texto: "Entregado",
    insignia: "border border-[var(--borde)] text-[var(--atenuado)]",
  },
  cancelado: {
    texto: "Cancelado",
    insignia: "border border-[var(--borde)] text-[var(--atenuado-suave)] line-through",
  },
};

export function PanelPedidos({ pedidos }: { pedidos: PedidoDemo[] }) {
  /** Solo los estados cambiados; lo que no está acá conserva el del pedido. */
  const [cambios, setCambios] = useState<Record<string, EstadoPedido>>({});
  const estadoDe = (pedido: PedidoDemo) => cambios[pedido.numero] ?? pedido.estado;

  const sinPreparar = pedidos.filter((pedido) => estadoDe(pedido) === "nuevo").length;

  return (
    <section aria-labelledby="panel-pedidos">
      <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
        <h2
          id="panel-pedidos"
          className="font-(family-name:--font-archivo) text-[20px] font-bold tracking-[-0.02em] uppercase md:text-[24px]"
        >
          Pedidos
        </h2>
        {/* `aria-live`: el contador baja al confirmar un pedido y sin esto quien
            usa lector de pantalla no recibe ninguna señal del cambio. */}
        <p
          aria-live="polite"
          className="font-(family-name:--font-mono-demo) text-[12px] text-[var(--acento)]"
        >
          {sinPreparar > 0 ? `${sinPreparar} sin preparar` : "Todo al día"}
        </p>
      </div>

      <ul className="mt-5 grid gap-3 lg:grid-cols-2 lg:gap-4">
        {pedidos.map((pedido) => {
          const estado = estadoDe(pedido);
          const cancelado = estado === "cancelado";

          return (
            <li
              key={pedido.numero}
              className="rounded-[4px] border border-[var(--borde)] bg-[var(--superficie)] p-4"
            >
              {/* `min-w-0` en la columna de texto: sin él, un nombre largo se
                  niega a encogerse y empuja la insignia fuera de la tarjeta. */}
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="truncate text-[15px] font-semibold text-[var(--texto)]">
                    {pedido.comprador}
                  </p>
                  <p className="mt-0.5 truncate font-(family-name:--font-mono-demo) text-[11px] text-[var(--atenuado-suave)]">
                    {pedido.numero} · {pedido.ciudad} · {pedido.dia}
                  </p>
                </div>
                <span
                  className={`shrink-0 rounded-[4px] px-2 py-1 font-(family-name:--font-archivo) text-[10px] font-bold tracking-[0.08em] uppercase ${ESTADOS[estado].insignia}`}
                >
                  {ESTADOS[estado].texto}
                </span>
              </div>

              <ul
                className={`mt-3 flex flex-col gap-1.5 border-t border-[var(--borde)] pt-3 ${
                  cancelado ? "opacity-50" : ""
                }`}
              >
                {pedido.lineas.map((linea) => (
                  <li
                    key={`${pedido.numero}-${linea.nombre}-${linea.talla ?? "u"}`}
                    className="flex items-baseline justify-between gap-3 text-[13px]"
                  >
                    <span className="min-w-0 text-[var(--cuerpo)]">
                      <span className="font-(family-name:--font-archivo) font-bold">
                        {linea.cantidad}×
                      </span>{" "}
                      {linea.nombre}
                      {linea.talla && (
                        <span className="text-[var(--atenuado-suave)]">
                          {" "}
                          · Talla {linea.talla}
                        </span>
                      )}
                    </span>
                    <span className="shrink-0 whitespace-nowrap text-[var(--atenuado)]">
                      {formatCOP(linea.precio * linea.cantidad)}
                    </span>
                  </li>
                ))}
              </ul>

              <div className="mt-3 flex items-baseline justify-between gap-3 border-t border-[var(--borde)] pt-3">
                <span className="font-(family-name:--font-mono-demo) text-[11px] tracking-[0.14em] text-[var(--atenuado)] uppercase">
                  Total
                </span>
                <span
                  className={`font-(family-name:--font-archivo) text-[18px] font-bold tracking-[-0.02em] md:text-[20px] ${
                    cancelado ? "text-[var(--atenuado-suave)] line-through" : ""
                  }`}
                >
                  {formatCOP(pedido.total)}
                </span>
              </div>

              {/* ---------- Cambiar el estado ----------
                  `flex-wrap` y no scroll horizontal: son cinco botones y a 320px no
                  caben en una línea, pero envolver deja los cinco visibles de una,
                  que es lo que se quiere de un control de estado. */}
              <div className="mt-3 border-t border-[var(--borde)] pt-3">
                <p
                  id={`estado-${pedido.numero}`}
                  className="font-(family-name:--font-mono-demo) text-[10px] tracking-[0.14em] text-[var(--atenuado-suave)] uppercase"
                >
                  Cambiar estado
                </p>
                <div
                  role="group"
                  aria-labelledby={`estado-${pedido.numero}`}
                  className="mt-2 flex flex-wrap gap-1.5"
                >
                  {[...FLUJO, "cancelado" as EstadoPedido].map((posible) => {
                    const activo = posible === estado;
                    const esCancelar = posible === "cancelado";
                    return (
                      <button
                        key={posible}
                        type="button"
                        aria-pressed={activo}
                        onClick={() =>
                          setCambios((previos) => ({ ...previos, [pedido.numero]: posible }))
                        }
                        className={`min-h-11 rounded-[4px] border px-2.5 font-(family-name:--font-archivo) text-[11px] font-bold tracking-[0.04em] uppercase transition-colors ${
                          activo
                            ? "border-[var(--acento)] bg-[var(--acento-suave)] text-[var(--texto)]"
                            : esCancelar
                              ? "border-[var(--borde)] text-[var(--atenuado-suave)] hover:text-[var(--texto)]"
                              : "border-[var(--borde)] text-[var(--atenuado)] hover:border-[var(--borde-fuerte)] hover:text-[var(--texto)]"
                        }`}
                      >
                        {ESTADOS[posible].texto}
                      </button>
                    );
                  })}
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
