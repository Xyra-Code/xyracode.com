import Image from "next/image";
import Link from "next/link";
import type { Demo, DemoProduct } from "@/lib/content";
import { buildProductInquiryHref } from "@/lib/demos/order";
import { PriceTag } from "./PriceTag";
import { StoreButton } from "./StoreButton";

type Props = {
  producto: DemoProduct;
  demo: Demo;
  /**
   * Slot del CTA para el caso con precio. La Tarea 8 mete acá el
   * `<QuickAddButton />`, que es cliente, sin que esta tarjeta tenga que serlo.
   *
   * Si el botón que ocupe el slot no es un enlace, tiene que conservar el
   * `href` de `wa.me` como respaldo (renderizar el `<a>` y recién cambiarlo a
   * `<button>` después de montar): sin eso la tarjeta pierde su única salida en
   * un navegador sin JavaScript.
   */
  cta?: React.ReactNode;
};

/**
 * Tarjeta de producto. **Una sola** para los tres usos: grilla del catálogo,
 * destacados de la home y relacionados del detalle (handoff, "Componentes
 * compartidos").
 *
 * Sin `"use client"` y sin imports server-only, para que el catálogo la pueda
 * renderizar desde dentro de `FilterableCatalog`, que sí es cliente. `next/image`
 * y `next/link` funcionan en los dos árboles.
 */
export function ProductCard({ producto, demo, cta }: Props) {
  // El texto va en caja normal y StoreButton lo pasa a mayúsculas por CSS: en
  // mayúscula sostenida algunos lectores de pantalla deletrean palabra por letra.
  const href = `/demos/${demo.slug}/p/${producto.slug}`;

  // El kicker muestra el NOMBRE de la categoría, no su slug. Si el slug no
  // resuelve —dato mal cargado— cae al slug en vez de renderizar vacío: la
  // tarjeta se ve rota y el error se nota, en lugar de desaparecer.
  const categoria =
    demo.categorias.find((c) => c.slug === producto.categoria)?.nombre ??
    producto.categoria;

  /**
   * Enlace de respaldo, siempre presente en la tarjeta: es el CTA cuando el
   * precio es `null` (no hay nada que agregar al carrito) y también cuando el
   * navegador no ejecuta JavaScript, donde el carrito no abre pero el catálogo
   * sigue siendo HTML legible con un WhatsApp por producto.
   */
  const consultar = buildProductInquiryHref(
    demo.negocio.whatsapp,
    demo.negocio.nombre,
    producto.nombre,
  );

  return (
    <article className="flex h-full flex-col overflow-hidden rounded-[4px] border border-[var(--borde)] bg-[var(--superficie)]">
      {/*
        Foto 1:1 forzada con `object-contain` sobre `--superficie-foto`: con
        `cover` el guante quedaría recortado, y con blanco puro se delatarían los
        recortes del material del cliente (handoff, "Slots de assets").

        El enlace de la foto va fuera del árbol de accesibilidad y fuera del
        tabulador: apunta al mismo destino que el del nombre, así que duplicarlo
        solo agregaría una parada de teclado y un anuncio repetido.
      */}
      <Link
        href={href}
        aria-hidden="true"
        tabIndex={-1}
        className="block aspect-square border-b border-[var(--borde)] bg-[var(--superficie-foto)]"
      >
        <Image
          src={producto.imagen.src}
          alt={producto.imagen.alt}
          width={producto.imagen.width}
          height={producto.imagen.height}
          // 2 columnas en móvil, 4 arriba de 768px: la foto nunca se pide más
          // grande que la mitad o el cuarto del viewport.
          sizes="(max-width: 767px) 50vw, 25vw"
          className="h-full w-full object-contain"
        />
      </Link>

      <div className="flex flex-1 flex-col p-4">
        <p className="font-(family-name:--font-mono-demo) text-[10px] tracking-[0.12em] text-[var(--atenuado-suave)] uppercase md:text-[11px]">
          {categoria}
        </p>

        {/*
          `min-h` de dos líneas expresado en `em`: acompaña el cambio de tamaño
          de fuente en el quiebre sin repetir el valor. Un nombre de tres líneas
          sí estira la tarjeta —y está bien: en la grilla la fila entera crece y
          el precio queda anclado abajo con `mt-auto`, así que las tarjetas no se
          descuadran entre sí.
        */}
        <h3 className="mt-2 min-h-[2.7em] text-[14px] leading-[1.35] font-medium text-[var(--texto)] md:text-[15px]">
          <Link href={href} className="transition-colors hover:text-[var(--acento)]">
            {producto.nombre}
          </Link>
        </h3>

        <PriceTag precio={producto.precio} />

        <div className="mt-3">
          {producto.precio === null ? (
            <StoreButton href={consultar} external full>
              Consultar
            </StoreButton>
          ) : (
            (cta ?? (
              <StoreButton href={consultar} external full>
                Agregar
              </StoreButton>
            ))
          )}
        </div>
      </div>
    </article>
  );
}
