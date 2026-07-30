"use client";

import { CreditCard } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import type { Demo } from "@/lib/content/demos";
// Del submódulo y no del barrel: este es un componente cliente, y el barrel
// arrastraría el contenido entero de la agencia (servicios, proyectos, blog) al
// chunk de la demo. Misma razón que el comentario en `lib/content/index.ts`.
import { CONTACT } from "@/lib/content/contact";
import { SEO } from "@/lib/seo";
import { formatCOP } from "@/lib/demos/format";
import { useCart } from "./CartProvider";
import { storeButtonClasses } from "./StoreButton";

/**
 * Pantalla de pago de la demo.
 *
 * NO hay formulario de tarjeta, y es una decisión: un formulario de pago que
 * parece real invita a que alguien escriba su tarjeta de verdad, y un pago
 * simulado que "funciona" tampoco explica nada. En vez de eso, esta pantalla
 * **cuenta** lo que pasaría en la tienda real y le ofrece al prospecto el paso
 * siguiente.
 *
 * Ojo con la audiencia, que acá es doble: el resumen del pedido le habla al
 * comprador, y el bloque de abajo le habla al dueño del negocio. Por eso ese
 * bloque usa la paleta invertida —los tokens `--franja-*`— y no la de la tienda:
 * así se lee como una nota de la agencia y no como parte de la interfaz del
 * comercio. Es el único consumidor que les queda desde que se quitó la barra de
 * demo que los estrenó, así que si este bloque se va, los tokens también.
 */
export function CheckoutFlow({ demo }: { demo: Demo }) {
  const { lineas, total, unidades } = useCart();

  const tienda = `/demos/${demo.slug}`;
  const catalogo = `${tienda}/catalogo`;

  /**
   * El mensaje identifica la demo. Con varias circulando, un "quiero una tienda"
   * no dice quién escribe; con el nombre del negocio, el lead llega identificado.
   */
  const quiero = `https://wa.me/${CONTACT.whatsapp}?text=${encodeURIComponent(
    `Hola XyraCode, vi la demo de ${demo.negocio.nombre} y quiero mi tienda funcionando.`,
  )}`;

  if (lineas.length === 0) {
    return (
      <div className="mx-auto max-w-[560px] px-4 py-14 text-center md:px-6">
        <h1 className="font-(family-name:--font-archivo) text-[26px] font-bold tracking-[-0.03em] uppercase md:text-[32px]">
          Tu carrito está vacío
        </h1>
        <p className="mt-3 text-[16px] text-[var(--atenuado)]">
          Agrega productos desde el catálogo para continuar.
        </p>
        <div className="mt-7">
          <Link href={catalogo} className={storeButtonClasses("primario")}>
            Ver catálogo
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-[720px] px-4 py-9 md:px-6 md:py-12">
      <h1 className="font-(family-name:--font-archivo) text-[28px] leading-[1] font-bold tracking-[-0.03em] uppercase md:text-[36px]">
        Resumen del pedido
      </h1>

      {/* ---------- Resumen: esto le habla al comprador ---------- */}
      <div className="mt-7 rounded-[4px] border border-[var(--borde)] bg-[var(--superficie)] p-5">
        <h2 className="font-(family-name:--font-mono-demo) text-[12px] tracking-[0.14em] text-[var(--atenuado)] uppercase">
          {unidades} {unidades === 1 ? "ítem" : "ítems"}
        </h2>

        <ul className="mt-4 flex flex-col gap-4">
          {lineas.map((linea) => (
            <li
              key={`${linea.item.slug}-${linea.item.variante ?? "unica"}`}
              className="flex gap-3"
            >
              <div className="size-14 shrink-0 overflow-hidden rounded-[4px] bg-[var(--superficie-foto)]">
                <Image
                  src={linea.producto.imagen.src}
                  alt={linea.producto.imagen.alt}
                  width={linea.producto.imagen.width}
                  height={linea.producto.imagen.height}
                  // El slot es `size-14` y no cambia en ningún ancho. Sin este
                  // `sizes` la miniatura se sirve al tamaño del asset —1080×1080—
                  // para pintar 56px.
                  sizes="56px"
                  className="size-full object-contain"
                />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-[15px] leading-[1.3] text-[var(--texto)]">
                  {linea.cantidad} × {linea.producto.nombre}
                </p>
                <p className="font-(family-name:--font-mono-demo) text-[11px] text-[var(--atenuado-suave)]">
                  {linea.item.variante
                    ? `${linea.producto.variantes?.label ?? "Talla"} ${linea.item.variante}`
                    : "Única"}
                </p>
              </div>
              <p className="font-(family-name:--font-archivo) text-[15px] font-bold whitespace-nowrap">
                {formatCOP(linea.precio * linea.cantidad)}
              </p>
            </li>
          ))}
        </ul>

        <dl className="mt-5 border-t border-[var(--borde)] pt-4 text-[14px]">
          <div className="flex justify-between text-[var(--atenuado)]">
            <dt>Subtotal</dt>
            <dd>{formatCOP(total)}</dd>
          </div>
          <div className="mt-1.5 flex justify-between text-[var(--atenuado)]">
            <dt>Envío</dt>
            {/* NO dice "incluido": en su Instagram el cliente anuncia "más
                envío", o sea que lo cobra aparte. La tira de confianza promete
                cobertura nacional, que es verdad; regalar el costo del envío
                sería inventarle una promesa que él no hace. */}
            <dd>Se calcula al confirmar</dd>
          </div>
          <div className="mt-4 flex items-baseline justify-between border-t border-[var(--borde)] pt-4">
            <dt className="font-(family-name:--font-mono-demo) text-[12px] tracking-[0.14em] uppercase">
              Total
            </dt>
            <dd className="font-(family-name:--font-archivo) text-[26px] font-bold tracking-[-0.03em] md:text-[30px]">
              {formatCOP(total)}
            </dd>
          </div>
        </dl>
      </div>

      {/* ---------- Nota de XyraCode: esto le habla al dueño del negocio ---------- */}
      <section
        aria-labelledby="nota-pasarela"
        className="mt-6 rounded-[4px] bg-[var(--franja-fondo)] p-6 md:p-8"
      >
        <p className="flex items-center gap-2 font-(family-name:--font-mono-demo) text-[11px] tracking-[0.18em] text-[var(--franja-texto)] uppercase md:text-[12px]">
          <CreditCard size={15} strokeWidth={2} />
          Nota de XyraCode
        </p>

        <h2
          id="nota-pasarela"
          className="mt-4 font-(family-name:--font-archivo) text-[24px] leading-[1.05] font-bold tracking-[-0.03em] text-[var(--fondo)] uppercase md:text-[30px]"
        >
          Aquí tu comprador pagaría
        </h2>

        <div className="mt-4 flex flex-col gap-3.5 text-[15px] leading-[1.6] text-[color-mix(in_srgb,var(--fondo)_78%,var(--franja-fondo))] md:text-[16px]">
          <p>
            En tu tienda real, este botón lleva al comprador a la{" "}
            <strong className="font-semibold text-[var(--fondo)]">
              pasarela de pagos que tú elijas
            </strong>{" "}
            — tarjeta, PSE, Nequi, Bancolombia o contra entrega. El comprador paga ahí, y a ti
            te llega el pedido con los datos de envío listos para despachar.
          </p>
          <p>
            En esta demo no está conectada, y por una sola razón:{" "}
            <strong className="font-semibold text-[var(--fondo)]">
              la pasarela se activa con la cuenta de comercio de tu negocio
            </strong>
            . Es un trámite que hacemos juntos cuando decidas, y es lo único que separa esta
            tienda de estar vendiendo.
          </p>
        </div>

        {/*
          Los botones usan la paleta invertida —oscuros sobre la nota clara— y no
          el verde de la tienda: pertenecen a XyraCode, no al comercio. Eso los
          separa visualmente de todo lo que el comprador puede tocar.

          El padding arranca en `px-4` y sube a `px-6` desde 640px: apilados y a
          ancho completo, a 320/360px los 48px de `px-6` dejaban al CTA principal
          sin sitio y "QUIERO MI TIENDA FUNCIONANDO" se partía en dos renglones
          (medido: 132px de texto en dos líneas a 320 y 360, una sola a 390).
        */}
        <div className="mt-7 flex flex-col gap-3 sm:flex-row">
          <a
            href={quiero}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-12 items-center justify-center rounded-[4px] bg-[var(--fondo)] px-4 py-2.5 text-center font-(family-name:--font-archivo) text-[13px] leading-tight font-bold sm:text-[14px] tracking-[0.02em] text-[var(--texto)] uppercase transition-opacity hover:opacity-85 sm:px-6"
          >
            Quiero mi tienda funcionando
          </a>
          <Link
            href={tienda}
            className="inline-flex min-h-12 items-center justify-center rounded-[4px] border border-[color-mix(in_srgb,var(--fondo)_30%,var(--franja-fondo))] px-4 py-2.5 text-center font-(family-name:--font-archivo) text-[13px] leading-tight font-bold sm:text-[14px] tracking-[0.02em] text-[var(--fondo)] uppercase transition-colors hover:bg-[color-mix(in_srgb,var(--fondo)_8%,var(--franja-fondo))] sm:px-6"
          >
            Volver a la tienda
          </Link>
        </div>

        <p className="mt-5 text-[13px] text-[var(--franja-texto)]">
          ¿Prefieres mirar primero?{" "}
          <a
            href={SEO.siteUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="underline underline-offset-2"
          >
            xyracode.com
          </a>
        </p>
      </section>
    </div>
  );
}
