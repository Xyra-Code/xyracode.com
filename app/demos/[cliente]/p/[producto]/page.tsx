import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ProductPurchase } from "@/components/demos/ProductPurchase";
import { RelatedProducts } from "@/components/demos/RelatedProducts";
import { DEMOS, getDemo, getDemoProduct } from "@/lib/content";

type Params = { cliente: string; producto: string };

/**
 * Un par cliente/producto que no exista se corta a nivel de routing y lo atiende
 * `app/global-not-found.tsx`, igual que en el layout de la demo. Por eso esta rama
 * no lleva `not-found.tsx` propia: sería código muerto.
 */
export const dynamicParams = false;

/**
 * Las 12 rutas de una vez, "de abajo hacia arriba": esta página está por debajo de
 * los dos segmentos dinámicos, así que puede generar `cliente` y `producto`
 * juntos. El catálogo de cada demo es la fuente, así que agregar un producto a
 * `DEMOS` publica su página sin tocar nada acá.
 */
export function generateStaticParams() {
  return DEMOS.flatMap((demo) =>
    demo.productos.map((producto) => ({
      cliente: demo.slug,
      producto: producto.slug,
    })),
  );
}

/**
 * `title` es un **string simple**, no `title.absolute`: así lo toma el `template`
 * del layout de la demo (`%s · Guantes NR1`) y el título sale
 * "Guante corte negativo látex 4 mm · Guantes NR1". Con `absolute` se saltearía
 * ese template, y con un string pero sin template propio en el layout de la tienda
 * caería en el de la raíz, que dice "| XyraCode".
 *
 * El `canonical` se declara **autorreferencial**. Sin esto se hereda el del layout
 * y las 12 páginas de producto dirían todas que su versión canónica es la home de
 * la demo. En una rama `noindex` es inocuo, pero es el tipo de señal contradictoria
 * que la revisión SEO del 2026-07-29 marcó como P0: declarar una cosa y hacer otra.
 *
 * `robots: noindex` y `og:site_name` sí los aporta el layout, y está bien.
 */
export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { cliente, producto: slugProducto } = await params;
  const demo = getDemo(cliente);
  const producto = demo ? getDemoProduct(demo, slugProducto) : undefined;

  // Con `dynamicParams = false` este caso no se sirve nunca; devolver la metadata
  // del layout tal cual es más honesto que inventar un título de error.
  if (!producto) return {};

  return {
    title: producto.nombre,
    description: producto.descripcion,
    alternates: { canonical: `/demos/${cliente}/p/${slugProducto}` },
  };
}

/** Migas, en mono como el resto de los metadatos de la tienda. */
const MIGA = "font-(family-name:--font-mono-demo) text-[11px] md:text-[12px]";

export default async function DemoProductoPage({ params }: { params: Promise<Params> }) {
  const { cliente, producto: slugProducto } = await params;
  const demo = getDemo(cliente);
  const producto = demo && getDemoProduct(demo, slugProducto);
  if (!demo || !producto) notFound();

  const categoria =
    demo.categorias.find((c) => c.slug === producto.categoria)?.nombre ?? producto.categoria;

  return (
    <div className="mx-auto max-w-[1240px] px-4 pb-14 md:px-6 md:pb-18">
      <nav aria-label="Migas de pan" className="py-4 md:py-5">
        <ol className="flex items-center gap-2 text-[var(--atenuado-suave)]">
          <li className={MIGA}>
            <Link href={`/demos/${demo.slug}`} className="hover:text-[var(--texto)]">
              Inicio
            </Link>
          </li>
          <li aria-hidden="true" className={MIGA}>
            /
          </li>
          <li className={MIGA}>
            <Link href={`/demos/${demo.slug}/catalogo`} className="hover:text-[var(--texto)]">
              Catálogo
            </Link>
          </li>
          <li aria-hidden="true" className={MIGA}>
            /
          </li>
          {/*
            La categoría es texto y no enlace a propósito: el filtro del catálogo
            es estado de cliente, y un enlace con `?cat=` obligaría a leer
            `searchParams`, que está prohibido en esta rama porque rompe el
            prerender estático.
          */}
          <li className={MIGA}>{categoria}</li>
          <li aria-hidden="true" className={MIGA}>
            /
          </li>
          {/*
            Último nivel: `aria-current="page"` y recortado con puntos suspensivos.
            Un nombre de producto de 60 caracteres partiría las migas en tres
            líneas a 390px.
          */}
          <li aria-current="page" className={`${MIGA} min-w-0 truncate text-[var(--atenuado)]`}>
            {producto.nombre}
          </li>
        </ol>
      </nav>

      <div className="grid gap-7 md:grid-cols-2 md:items-start md:gap-12">
        {/*
          Foto 1:1 grande, `object-contain` sobre `--superficie-foto`: nunca
          `cover`, que recortaría el guante, y nunca blanco puro, que delataría los
          recortes del material del cliente (handoff, "Slots de assets").

          `priority` porque es el elemento más grande sobre el pliegue: es el LCP de
          esta pantalla.
        */}
        <div className="aspect-square overflow-hidden rounded-[4px] border border-[var(--borde)] bg-[var(--superficie-foto)]">
          <Image
            src={producto.imagen.src}
            alt={producto.imagen.alt}
            width={producto.imagen.width}
            height={producto.imagen.height}
            priority
            // Una columna en móvil, media arriba de 768px, y tope en la mitad del
            // contenido de 1240px.
            sizes="(max-width: 767px) 100vw, (max-width: 1240px) 50vw, 596px"
            className="h-full w-full object-contain"
          />
        </div>

        <ProductPurchase producto={producto} demo={demo} />
      </div>

      <RelatedProducts demo={demo} producto={producto} />
    </div>
  );
}
