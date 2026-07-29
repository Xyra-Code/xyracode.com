"use client";

import { ShoppingBag, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef } from "react";
import type { Demo } from "@/lib/content";
import { formatCOP } from "@/lib/demos/format";
import { buildOrderHref } from "@/lib/demos/order";
import { useCart } from "./CartProvider";
import { QuantityStepper } from "./QuantityStepper";
import { storeButtonClasses } from "./StoreButton";

/** Selector de lo enfocable dentro del panel, para atrapar el foco. */
const ENFOCABLE = 'a[href], button:not([disabled]), input, [tabindex]:not([tabindex="-1"])';

export function CartDrawer({ demo }: { demo: Demo }) {
  const { abierto, cerrar, lineas, total, unidades, setCantidad, remove } = useCart();
  const panel = useRef<HTMLDivElement>(null);

  /**
   * Cierre con Escape y foco atrapado dentro del panel mientras está abierto. Sin
   * esto, con el panel abierto el tabulador se va al contenido de atrás, que está
   * tapado por el overlay: quien navega con teclado queda enfocando cosas que no
   * ve.
   */
  useEffect(() => {
    if (!abierto) return;

    const alPresionar = (evento: KeyboardEvent) => {
      if (evento.key === "Escape") {
        cerrar();
        return;
      }
      if (evento.key !== "Tab" || !panel.current) return;

      const focos = panel.current.querySelectorAll<HTMLElement>(ENFOCABLE);
      if (focos.length === 0) return;
      const primero = focos[0];
      const ultimo = focos[focos.length - 1];

      if (evento.shiftKey && document.activeElement === primero) {
        evento.preventDefault();
        ultimo.focus();
      } else if (!evento.shiftKey && document.activeElement === ultimo) {
        evento.preventDefault();
        primero.focus();
      }
    };

    document.addEventListener("keydown", alPresionar);
    // Enfoca el panel al abrir, para que el primer Tab caiga adentro.
    panel.current?.focus();
    return () => document.removeEventListener("keydown", alPresionar);
  }, [abierto, cerrar]);

  if (!abierto) return null;

  const vacio = lineas.length === 0;
  const catalogo = `/demos/${demo.slug}/catalogo`;
  const checkout = `/demos/${demo.slug}/checkout`;
  // WhatsApp ya no recibe el pedido —de eso se encarga el checkout— pero sigue
  // siendo el canal para preguntar antes de pagar.
  const consulta = buildOrderHref(
    demo.negocio.whatsapp,
    `Hola ${demo.negocio.nombre}, tengo una duda antes de hacer mi pedido.`,
  );

  return (
    <div className="fixed inset-0 z-60">
      {/**
       * Overlay: cierra al hacer clic, pero va `aria-hidden` y sin rol. Es una
       * comodidad de puntero, no un control: exponerlo como botón dejaría dos
       * elementos con el mismo nombre accesible que el botón de cerrar. Para
       * teclado ya están Escape y el botón del encabezado.
       *
       * La elevación en este sistema es borde + overlay, nunca sombras difusas.
       */}
      <div
        data-testid="cart-overlay"
        aria-hidden="true"
        onClick={cerrar}
        className="absolute inset-0 bg-black/60 motion-safe:animate-[demoFade_140ms_ease-out]"
      />

      <div
        ref={panel}
        role="dialog"
        aria-modal="true"
        aria-label="Tu pedido"
        tabIndex={-1}
        // En móvil ocupa la pantalla completa bajo la franja; en desktop es un
        // panel lateral de 420px.
        className="absolute inset-x-0 top-8 bottom-0 flex flex-col border-l border-[var(--borde)] bg-[var(--fondo)] motion-safe:animate-[demoSubir_180ms_ease-out] md:inset-y-0 md:top-0 md:right-0 md:left-auto md:w-[420px] md:motion-safe:animate-[demoEntrar_180ms_ease-out]"
      >
        <header className="flex items-center justify-between gap-4 border-b border-[var(--borde)] px-4 py-4 md:px-6">
          <h2 className="flex items-baseline gap-2 font-(family-name:--font-archivo) text-[21px] font-bold tracking-[-0.03em] uppercase">
            Tu pedido
            {!vacio && (
              <span className="font-(family-name:--font-mono-demo) text-[12px] font-normal normal-case text-[var(--atenuado)]">
                {unidades} {unidades === 1 ? "ítem" : "ítems"}
              </span>
            )}
          </h2>
          <button
            type="button"
            onClick={cerrar}
            aria-label="Cerrar el pedido"
            className="flex size-11 shrink-0 items-center justify-center rounded-[4px] border border-[var(--borde)] text-[var(--texto)] transition-colors hover:bg-[var(--superficie)]"
          >
            <X size={18} strokeWidth={1.75} />
          </button>
        </header>

        {vacio ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-4 px-8 text-center">
            <ShoppingBag size={28} strokeWidth={1.6} className="text-[var(--atenuado-suave)]" />
            <p className="font-(family-name:--font-archivo) text-[19px] font-bold tracking-[-0.02em] uppercase">
              Todavía no has agregado nada
            </p>
            <p className="max-w-70 text-[15px] leading-[1.6] text-[var(--atenuado)]">
              Arma tu pedido desde el catálogo y págalo en línea, con envío a todo el país.
            </p>
            <Link href={catalogo} onClick={cerrar} className={storeButtonClasses("primario")}>
              Ver catálogo
            </Link>
          </div>
        ) : (
          <>
            <ul className="flex-1 overflow-y-auto">
              {lineas.map((linea) => (
                <li
                  key={`${linea.item.slug}-${linea.item.variante ?? "unica"}`}
                  className="flex gap-3 border-b border-[var(--borde)] px-4 py-4 md:px-6"
                >
                  <div className="size-16 shrink-0 overflow-hidden rounded-[4px] bg-[var(--superficie-foto)] md:size-18">
                    <Image
                      src={linea.producto.imagen.src}
                      alt={linea.producto.imagen.alt}
                      width={linea.producto.imagen.width}
                      height={linea.producto.imagen.height}
                      className="size-full object-contain"
                    />
                  </div>

                  <div className="flex min-w-0 flex-1 flex-col gap-1.5">
                    <div className="flex items-start justify-between gap-2">
                      <p className="text-[15px] leading-[1.35] font-medium text-[var(--texto)]">
                        {linea.producto.nombre}
                      </p>
                      <button
                        type="button"
                        onClick={() => remove(linea.item.slug, linea.item.variante)}
                        aria-label={`Quitar ${linea.producto.nombre}`}
                        className="shrink-0 p-1 text-[var(--atenuado-suave)] transition-colors hover:text-[var(--texto)]"
                      >
                        <X size={15} strokeWidth={1.75} />
                      </button>
                    </div>

                    {/* "Única" cuando el producto no tiene variantes: dejar el
                        hueco vacío haría ver la línea como incompleta. */}
                    <p className="font-(family-name:--font-mono-demo) text-[12px] text-[var(--atenuado-suave)]">
                      {linea.item.variante
                        ? `${linea.producto.variantes?.label ?? "Talla"} ${linea.item.variante}`
                        : "Única"}
                    </p>

                    <div className="mt-1 flex items-center justify-between gap-2">
                      <QuantityStepper
                        valor={linea.cantidad}
                        min={0}
                        onChange={(nuevo) =>
                          setCantidad(linea.item.slug, linea.item.variante, nuevo)
                        }
                        etiqueta={`Cantidad de ${linea.producto.nombre}`}
                      />
                      <p className="font-(family-name:--font-archivo) text-[16px] font-bold whitespace-nowrap">
                        {formatCOP(linea.precio * linea.cantidad)}
                      </p>
                    </div>
                  </div>
                </li>
              ))}
            </ul>

            <footer className="border-t border-[var(--borde)] px-4 py-5 md:px-6">
              <div className="flex items-baseline justify-between gap-4">
                <p className="font-(family-name:--font-mono-demo) text-[12px] tracking-[0.14em] text-[var(--atenuado)] uppercase">
                  Subtotal
                </p>
                <p className="font-(family-name:--font-archivo) text-[28px] font-bold tracking-[-0.03em]">
                  {formatCOP(total)}
                </p>
              </div>

              {/* Único relleno de acento del panel: es el clímax de la pantalla.
                  El proceso de compra va por el checkout, no por WhatsApp; el chat
                  queda para preguntar, no para pedir. */}
              <Link
                href={checkout}
                onClick={cerrar}
                className={storeButtonClasses("primario", true, "mt-4 min-h-13 text-[15px]")}
              >
                Ir a pagar
              </Link>

              <p className="mt-3 text-center text-[13px] leading-[1.5] text-[var(--atenuado-suave)]">
                Pago en línea y envío a todo el país.{" "}
                <a
                  href={consulta}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline decoration-[var(--borde-fuerte)] underline-offset-2 hover:decoration-[var(--acento)]"
                >
                  ¿Dudas? Escríbenos
                </a>
              </p>
            </footer>
          </>
        )}
      </div>
    </div>
  );
}
