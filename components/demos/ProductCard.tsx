import Image from "next/image";
import Link from "next/link";
import type { Demo, DemoProduct } from "@/lib/content/demos";
import { precioDeTarjeta } from "@/lib/demos/price";
import { PriceTag } from "./PriceTag";
import { StoreButton } from "./StoreButton";

type Props = {
  producto: DemoProduct;
  demo: Demo;
  /**
   * Slot del CTA para el caso con precio. La grilla mete acá el
   * `<QuickAddButton />`, que es cliente, sin que esta tarjeta tenga que serlo.
   *
   * Si el botón que ocupe el slot no es un enlace, tiene que conservar como
   * `href` de respaldo el detalle del producto (renderizar el `<a>` y recién
   * interceptar el clic con JavaScript): sin eso la tarjeta pierde su única
   * salida en un navegador sin JS.
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
        className="relative block aspect-square border-b border-[var(--borde)] bg-[var(--superficie-foto)]"
      >
        {/*
          Insignia del cliente, p. ej. "Edición Pro". Va sobre la foto porque así la
          usa él en sus piezas, y en `acento` porque es lo único de la tarjeta que
          debe leerse antes que el precio.

          `aria-hidden` lo hereda del enlace que la contiene, así que el dato no se
          pierde para un lector de pantalla: viaja en el `alt` de la imagen y, sobre
          todo, en el detalle. Repetirlo acá agregaría ruido a cada tarjeta.
        */}
        {producto.insignia && (
          <span className="absolute top-2.5 left-2.5 z-10 rounded-[4px] bg-[var(--acento)] px-2 py-1 font-(family-name:--font-archivo) text-[10px] font-bold tracking-[0.08em] text-[var(--acento-texto)] uppercase">
            {producto.insignia}
          </span>
        )}
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
          {/* `block py-1` para llegar a 44px de alto de área táctil: el nombre en
              dos líneas medía 38px, y es el enlace principal de la tarjeta —el de
              la foto va con `tabIndex={-1}` y `aria-hidden`. El padding no separa
              nada porque el `min-h` del h3 ya reserva las dos líneas. */}
          <Link
            href={href}
            className="block py-1 transition-colors hover:text-[var(--acento)]"
          >
            {producto.nombre}
          </Link>
        </h3>

        {/* Rango cuando el precio depende de la talla, cifra cuando es único. La
            talla —y con ella el precio real— se elige en el detalle. */}
        <PriceTag precio={precioDeTarjeta(producto)} />

        {/*
          Los dos caminos de la tarjeta terminan en el detalle, nunca en el chat:
          desde la grilla no hay talla elegida ni pregunta concreta que mandar, y
          un `wa.me` acá saca a la persona del sitio antes de que haya visto el
          producto. Quien quiera preguntar tiene el chat en el detalle, en el hero
          y en el pie.

          Sin precio publicado no hay nada que agregar, así que el CTA es el
          detalle a secas. Con precio, el respaldo es el mismo enlace: es lo que
          se ve cuando la grilla usa esta tarjeta sin inyectarle CTA y cuando el
          navegador no ejecuta JavaScript.
        */}
        <div className="mt-3">
          {cta && precioDeTarjeta(producto) !== null ? (
            cta
          ) : (
            <StoreButton href={href} full>
              Ver producto
            </StoreButton>
          )}
        </div>
      </div>
    </article>
  );
}
