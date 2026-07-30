"use client";

import { ArrowLeft, CalendarDays, Package, ShoppingBag } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import type { Demo } from "@/lib/content/demos";
import { agendaDemo, pedidosDemo } from "@/lib/demos/panel";
import { PanelAgenda } from "./PanelAgenda";
import { PanelPedidos } from "./PanelPedidos";
import { PanelProductos } from "./PanelProductos";

/**
 * Panel de administración de la tienda.
 *
 * **Por qué existe en la demo.** La objeción número uno de cualquier vendedor
 * ante una web no es el precio: es "no tengo tiempo de manejar eso". Un pedido
 * entrando con talla, ciudad y total —y una agenda con los cupos de cada grupo—
 * la responde en diez segundos mejor que cualquier párrafo.
 *
 * Vive fuera del route group `(tienda)`, así que no hereda el nav ni el carrito
 * del comercio: es otra superficie, y mezclarlas confundiría a quien la ve. Sí
 * comparte el tema y las fuentes, que están en el layout de `[cliente]`.
 *
 * Las pestañas son botones con `aria-pressed` y no `role="tab"`: un tablist
 * verdadero obliga a navegación con flechas y manejo de foco propio, y prometer
 * ese contrato sin implementarlo deja a un lector de pantalla peor que sin rol.
 */

const VISTAS = [
  { id: "pedidos", etiqueta: "Pedidos", icon: ShoppingBag },
  { id: "agenda", etiqueta: "Agenda", icon: CalendarDays },
  { id: "productos", etiqueta: "Productos", icon: Package },
] as const;

type Vista = (typeof VISTAS)[number]["id"];

export function PanelDemo({ demo }: { demo: Demo }) {
  const pedidos = pedidosDemo(demo);
  const agenda = agendaDemo(demo);
  // Sin servicio de entrenamiento no hay agenda que mostrar, así que la pestaña
  // tampoco: una vista vacía se lee como algo roto.
  const vistas = VISTAS.filter((v) => v.id !== "agenda" || agenda.length > 0);

  const [vista, setVista] = useState<Vista>("pedidos");

  return (
    <div className="mx-auto w-full max-w-[1240px] px-4 pb-14 md:px-6">
      {/* ---------- Encabezado ---------- */}
      <header className="flex flex-col gap-4 py-6 md:flex-row md:items-center md:justify-between md:py-8">
        <div className="flex min-w-0 items-center gap-3">
          <Image
            src={demo.negocio.logoMarca.src}
            alt=""
            width={demo.negocio.logoMarca.width}
            height={demo.negocio.logoMarca.height}
            sizes="40px"
            className="h-8 w-auto shrink-0 md:h-10"
          />
          <div className="min-w-0">
            <p className="font-(family-name:--font-mono-demo) text-[11px] tracking-[0.14em] text-[var(--acento)] uppercase">
              Panel
            </p>
            <h1 className="truncate font-(family-name:--font-archivo) text-[22px] leading-[1.1] font-bold tracking-[-0.03em] uppercase md:text-[30px]">
              {demo.negocio.nombre}
            </h1>
          </div>
        </div>

        <Link
          href={`/demos/${demo.slug}`}
          className="inline-flex min-h-11 shrink-0 items-center gap-2 self-start rounded-[4px] border border-[var(--borde-fuerte)] px-4 font-(family-name:--font-archivo) text-[13px] font-bold tracking-[0.02em] text-[var(--texto)] uppercase transition-colors hover:bg-[var(--superficie)] md:self-auto"
        >
          <ArrowLeft aria-hidden="true" size={15} strokeWidth={2} />
          Ver la tienda
        </Link>
      </header>

      {/* ---------- Pestañas ----------
          Fila con scroll horizontal propio: con cuatro pestañas y un texto más
          largo, a 320px no caben, y el body nunca debe scrollear en horizontal. */}
      <div className="-mx-4 overflow-x-auto border-y border-[var(--borde)] px-4 md:mx-0 md:px-0">
        <div className="flex min-w-max gap-1">
          {vistas.map(({ id, etiqueta, icon: Icono }) => {
            const activa = vista === id;
            return (
              <button
                key={id}
                type="button"
                onClick={() => setVista(id)}
                aria-pressed={activa}
                className={`inline-flex min-h-12 items-center gap-2 border-b-2 px-3 font-(family-name:--font-archivo) text-[13px] font-bold tracking-[0.02em] whitespace-nowrap uppercase transition-colors md:px-4 md:text-[14px] ${
                  activa
                    ? "border-[var(--acento)] text-[var(--texto)]"
                    : "border-transparent text-[var(--atenuado)] hover:text-[var(--texto)]"
                }`}
              >
                <Icono aria-hidden="true" size={16} strokeWidth={1.75} />
                {etiqueta}
              </button>
            );
          })}
        </div>
      </div>

      {/* ---------- Nota de XyraCode ----------
          Va ARRIBA del contenido y no al pie: advierte que los pedidos y las
          sesiones son de muestra, y eso hay que leerlo antes de mirarlos, no
          después de haberlos tomado por reales.

          Misma paleta invertida que la nota del checkout: este bloque le habla al
          dueño del negocio, no a un comprador, y el color lo separa de la interfaz
          del panel. */}
      <section className="mt-6 rounded-[4px] bg-[var(--franja-fondo)] p-5 md:mt-8 md:p-6">
        <p className="font-(family-name:--font-mono-demo) text-[11px] tracking-[0.18em] text-[var(--franja-texto)] uppercase">
          Nota de XyraCode
        </p>
        <p className="mt-3 text-[15px] leading-[1.6] text-[color-mix(in_srgb,var(--fondo)_78%,var(--franja-fondo))] md:text-[16px]">
          Los pedidos y las sesiones de esta pantalla son de muestra, para que veas la forma que
          tiene. En tu panel real entran solos cuando alguien compra o reserva, y desde acá
          publicas productos sin escribir una línea de código.
        </p>
      </section>

      {/* ---------- Contenido ---------- */}
      <div className="mt-7 md:mt-9">
        {vista === "pedidos" && <PanelPedidos pedidos={pedidos} />}
        {vista === "agenda" && <PanelAgenda sesiones={agenda} />}
        {vista === "productos" && <PanelProductos demo={demo} />}
      </div>
    </div>
  );
}
