import type { EstadoPedido, PedidoDemo } from "@/lib/demos/panel";
import { formatCOP } from "@/lib/demos/format";

/**
 * Los pedidos que entrarían por la tienda.
 *
 * **Tarjetas, no una tabla.** Una tabla de seis columnas a 320px obliga a scroll
 * horizontal o a esconder columnas, y este panel se abre desde el celular justo
 * el día que hay que despachar. Cada pedido es una tarjeta que apila en móvil y
 * se reparte en dos columnas en escritorio.
 */

const ESTADOS: Record<EstadoPedido, { texto: string; clases: string }> = {
  // El único con relleno de acento es "nuevo": es el que exige una acción.
  nuevo: {
    texto: "Nuevo",
    clases: "bg-[var(--acento)] text-[var(--acento-texto)]",
  },
  preparando: {
    texto: "Preparando",
    clases: "border border-[var(--borde-fuerte)] text-[var(--texto)]",
  },
  despachado: {
    texto: "Despachado",
    clases: "border border-[var(--borde)] text-[var(--atenuado)]",
  },
};

export function PanelPedidos({ pedidos }: { pedidos: PedidoDemo[] }) {
  const nuevos = pedidos.filter((pedido) => pedido.estado === "nuevo").length;

  return (
    <section aria-labelledby="panel-pedidos">
      <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
        <h2
          id="panel-pedidos"
          className="font-(family-name:--font-archivo) text-[20px] font-bold tracking-[-0.02em] uppercase md:text-[24px]"
        >
          Pedidos
        </h2>
        {nuevos > 0 && (
          <p className="font-(family-name:--font-mono-demo) text-[12px] text-[var(--acento)]">
            {nuevos} sin preparar
          </p>
        )}
      </div>

      <ul className="mt-5 grid gap-3 lg:grid-cols-2 lg:gap-4">
        {pedidos.map((pedido) => {
          const estado = ESTADOS[pedido.estado];
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
                  className={`shrink-0 rounded-[4px] px-2 py-1 font-(family-name:--font-archivo) text-[10px] font-bold tracking-[0.08em] uppercase ${estado.clases}`}
                >
                  {estado.texto}
                </span>
              </div>

              <ul className="mt-3 flex flex-col gap-1.5 border-t border-[var(--borde)] pt-3">
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
                <span className="font-(family-name:--font-archivo) text-[18px] font-bold tracking-[-0.02em] md:text-[20px]">
                  {formatCOP(pedido.total)}
                </span>
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
