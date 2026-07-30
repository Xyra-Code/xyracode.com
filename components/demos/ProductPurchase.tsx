"use client";

import { useState } from "react";
import type { Demo, DemoProduct } from "@/lib/content";
import { buildProductInquiryHref } from "@/lib/demos/order";
import { precioDe, precioDeTarjeta, rangoDe } from "@/lib/demos/price";
import { useCart } from "./CartProvider";
import { PriceTag } from "./PriceTag";
import { ProductBenefits } from "./ProductBenefits";
import { QuantityStepper } from "./QuantityStepper";
import { SizePicker } from "./SizePicker";
import { StoreButton, storeButtonClasses } from "./StoreButton";
import { WhatsAppMark } from "./WhatsAppMark";

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
   * El precio de la pantalla, y el orden importa: **rango mientras no haya talla
   * elegida, cifra exacta en cuanto la hay**. Es la razón de ser del selector —
   * en los guantes el precio depende de la talla— y por eso el número aparece
   * recién al elegir, y no antes con una talla que nadie pidió.
   *
   * `precioDeTarjeta` cae solo al precio único cuando el producto no tiene
   * variantes: ahí no hay rango y esto es simplemente el precio.
   */
  const precioMostrado = talla ? precioDe(producto, talla) : precioDeTarjeta(producto);

  /** Sin precio publicado en ninguna talla: el producto no entra al carrito. */
  const sinPrecio = precioDeTarjeta(producto) === null;

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
    // La talla elegida tiene que resolver a un precio. Sin variantes esto es el
    // precio único del producto, así que cubre los dos casos con una condición.
    if (precioDe(producto, talla) === null) return;

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

      {/* PriceTag resuelve los tres casos: rango, cifra y `null` —barra de
          acento, etiqueta "Precio" y "Consultar por [logo]"—. */}
      {/* `lg` en el detalle: acá el precio es el segundo elemento más grande de
          la pantalla después del título, no un dato de tarjeta.

          `sinPrecio="whatsapp"` es de esta pantalla y solo de esta: el CTA de
          abajo es el chat, así que el logo anticipa a dónde lleva el botón. La
          tarjeta del catálogo usa el valor por defecto, sin logo, porque su CTA
          es este detalle. */}
      <PriceTag precio={precioMostrado} size="lg" sinPrecio="whatsapp" />

      {/*
        Explica el rango en vez de dejar que la persona descubra sola por qué hay
        dos cifras. Desaparece al elegir talla, que es cuando el rango se
        convierte en un precio. Solo aparece si de verdad hay rango: un producto
        de precio único no tiene nada que explicar.
      */}
      {!talla && rangoDe(producto) && (
        <p className="mt-2 text-[13px] text-[var(--atenuado)] md:text-[14px]">
          El precio depende de la talla. Elige la tuya y lo ves exacto.
        </p>
      )}

      <p className="mt-5 max-w-[52ch] text-[15px] leading-[1.65] text-[var(--cuerpo)] md:text-[17px]">
        {producto.descripcion}
      </p>

      {/* Los cuatro atributos que el cliente pone en todas sus piezas. Van acá,
          antes de elegir talla: son la razón para seguir, no un pie de página. */}
      <ProductBenefits demo={demo} />

      <div className="mt-7 flex flex-col gap-5">
        {producto.variantes && (
          <div>
            <SizePicker
              label={producto.variantes.label}
              // Solo los valores: el selector elige talla, no precio. Que el
              // precio dependa de ella es asunto del PriceTag de arriba, que se
              // actualiza al elegir.
              opciones={producto.variantes.opciones.map((opcion) => opcion.valor)}
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
        {sinPrecio ? (
          <StoreButton
            href={consultar}
            external
            full
            className="min-h-13 text-[15px]"
          >
            Consultar por{" "}
            <WhatsAppMark />
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
                className="inline-flex items-center gap-1.5 font-(family-name:--font-archivo) text-[14px] font-bold text-[var(--acento)] md:text-[15px]"
              >
                {/* El subrayado va en las palabras y no en el `<a>`: cruzando el
                    logo se leería como un tachado. */}
                <span className="underline underline-offset-4">Preguntar por</span>{" "}
                <WhatsAppMark size={16} />
              </a>
            </p>
          </>
        )}
      </div>
    </div>
  );
}
