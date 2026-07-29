"use client";

import { useState } from "react";
import type { Demo, DemoProduct } from "@/lib/content";
import { buildProductInquiryHref } from "@/lib/demos/order";
import { useCart } from "./CartProvider";
import { PriceTag } from "./PriceTag";
import { QuantityStepper } from "./QuantityStepper";
import { SizePicker } from "./SizePicker";
import { StoreButton, storeButtonClasses } from "./StoreButton";

/** Etiqueta de bloque, en mono. La misma que usa SizePicker para "Talla". */
const ETIQUETA =
  "font-(family-name:--font-mono-demo) text-[10px] tracking-[0.14em] text-[var(--atenuado)] uppercase md:text-[11px]";

/**
 * Columna de compra del detalle: kicker, título, precio, descripción, talla,
 * cantidad, CTA y el enlace secundario a WhatsApp.
 *
 * Es cliente porque acá vive el único estado real de la pantalla —talla elegida y
 * cantidad— y porque el CTA escribe en el carrito.
 *
 * Talla y Cantidad son **hermanos de un mismo `flex flex-col gap-5`**: cuando el
 * producto no tiene variantes, el bloque Talla simplemente no se renderiza y
 * Cantidad ocupa su lugar con el mismo `gap`, sin un hueco ni un salto de
 * espaciado (`capturas/1d-detalle.png`, tercer marco). Reservar el alto de Talla,
 * o meterla en una grilla de dos filas, dejaría el aire de un bloque vacío.
 */
export function ProductPurchase({
  producto,
  demo,
}: {
  producto: DemoProduct;
  demo: Demo;
}) {
  const { add, abrir } = useCart();

  /**
   * Sin talla por defecto: con `variantes` la talla es **obligatoria**. Arrancar
   * en `opciones[0]` haría que alguien pida una talla que nunca eligió, y en
   * guantes de arquero eso es una devolución.
   *
   * (La tarjeta del catálogo sí usa la primera variante, pero ahí es explícito:
   * es un "agregar rápido" sin dónde elegir, y el panel del carrito muestra
   * enseguida qué talla quedó.)
   */
  const [talla, setTalla] = useState<string | undefined>(undefined);
  const [cantidad, setCantidad] = useState(1);
  const [faltaTalla, setFaltaTalla] = useState(false);

  // El kicker muestra el NOMBRE de la categoría, no su slug; si el slug no
  // resuelve cae al slug, así el dato mal cargado se ve en vez de desaparecer.
  const categoria =
    demo.categorias.find((c) => c.slug === producto.categoria)?.nombre ?? producto.categoria;

  /**
   * Enlace a WhatsApp con lo que la persona ya eligió. Es el CTA cuando el precio
   * es `null` —ese producto no entra al carrito— y el enlace secundario cuando sí
   * hay precio.
   *
   * `buildProductInquiryHref` recibe solo un nombre, así que la talla y la
   * cantidad se componen dentro de ese texto. Se agregan **solo si aportan algo**:
   * con la talla sin elegir y cantidad 1, el mensaje queda idéntico al de la
   * tarjeta del catálogo.
   */
  const detalle = [
    talla ? `${producto.variantes?.label ?? "Talla"} ${talla}` : null,
    cantidad > 1 ? `× ${cantidad}` : null,
  ].filter(Boolean);
  const consultar = buildProductInquiryHref(
    demo.negocio.whatsapp,
    demo.negocio.nombre,
    detalle.length > 0 ? `${producto.nombre} (${detalle.join(", ")})` : producto.nombre,
  );

  function agregar() {
    if (producto.variantes && !talla) {
      // No agrega y explica por qué. Deshabilitar el botón de entrada sería peor:
      // no diría qué falta, y en móvil el bloque de talla puede quedar fuera de
      // pantalla al momento de tocar el CTA.
      setFaltaTalla(true);
      return;
    }
    if (producto.precio === null) return;

    add(producto.slug, talla, cantidad);
    abrir();
  }

  return (
    <div className="flex flex-col">
      <p className="font-(family-name:--font-mono-demo) text-[10px] tracking-[0.14em] text-[var(--acento)] uppercase md:text-[11px]">
        {categoria}
      </p>

      <h1 className="mt-3 font-(family-name:--font-archivo) text-[30px] leading-[1.05] font-bold tracking-[-0.03em] uppercase md:text-[44px]">
        {producto.nombre}
      </h1>

      {/* PriceTag resuelve también el caso `null`: barra de acento, etiqueta
          "Precio" y "Consultar por WhatsApp" en vez de una cifra. */}
      {/* `lg` en el detalle: acá el precio es el segundo elemento más grande de
          la pantalla después del título, no un dato de tarjeta. */}
      <PriceTag precio={producto.precio} size="lg" />

      <p className="mt-5 max-w-[52ch] text-[15px] leading-[1.65] text-[var(--cuerpo)] md:text-[17px]">
        {producto.descripcion}
      </p>

      <div className="mt-7 flex flex-col gap-5">
        {producto.variantes && (
          <div>
            <SizePicker
              label={producto.variantes.label}
              opciones={producto.variantes.opciones}
              valor={talla}
              onChange={(opcion) => {
                setTalla(opcion);
                setFaltaTalla(false);
              }}
            />
            {faltaTalla && (
              // `role="alert"` para que el lector de pantalla lo anuncie sin que
              // el foco se mueva del CTA.
              <p role="alert" className="mt-2 text-[13px] text-[var(--acento)]">
                Elige una talla para agregar al carrito.
              </p>
            )}
          </div>
        )}

        <div>
          <p className={ETIQUETA}>Cantidad</p>
          <div className="mt-2">
            {/* Mínimo 1: acá se agrega al carrito, no se edita una línea, así que
                bajar a cero no significa nada. En el panel el mínimo es 0. */}
            <QuantityStepper valor={cantidad} min={1} onChange={setCantidad} />
          </div>
        </div>
      </div>

      <div className="mt-7">
        {producto.precio === null ? (
          <StoreButton
            href={consultar}
            external
            full
            className="min-h-13 text-[15px]"
          >
            Consultar por WhatsApp
          </StoreButton>
        ) : (
          <>
            {/*
              `<button>` de verdad, no un `<a>` a WhatsApp interceptado como en la
              tarjeta del catálogo: acá el clic depende de la talla y la cantidad
              elegidas, que un enlace estático no puede conocer. La salida sin
              JavaScript de esta pantalla es el enlace secundario de abajo, que es
              un `<a href>` real.

              El texto va en caja normal y StoreButton lo pasa a mayúsculas por
              CSS: en mayúscula sostenida algunos lectores de pantalla deletrean
              palabra por letra.
            */}
            <button
              type="button"
              onClick={agregar}
              className={storeButtonClasses("primario", true, "min-h-13 text-[15px]")}
            >
              Agregar al carrito
            </button>

            <p className="mt-4 text-center">
              <a
                href={consultar}
                target="_blank"
                rel="noopener noreferrer"
                className="font-(family-name:--font-archivo) text-[14px] font-bold text-[var(--acento)] underline underline-offset-4 md:text-[15px]"
              >
                Preguntar por WhatsApp
              </a>
            </p>
          </>
        )}
      </div>
    </div>
  );
}
