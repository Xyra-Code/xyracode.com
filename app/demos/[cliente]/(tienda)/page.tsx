import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CategoryCard } from "@/components/demos/CategoryCard";
import { ProductGrid } from "@/components/demos/ProductGrid";
import { StoreFounder } from "@/components/demos/StoreFounder";
import { StoreHero } from "@/components/demos/StoreHero";
import { TrustStrip } from "@/components/demos/TrustStrip";
import { getDemo } from "@/lib/content/demos";

/**
 * Encabezado de sección: título en Archivo, enlace opcional a la derecha y una
 * regla debajo (handoff, captura `1b`). Vive acá y no en `components/demos/`
 * porque hasta ahora lo usa solo la home; si el detalle lo necesita para los
 * relacionados, ahí sí se saca a su propio archivo.
 */
function EncabezadoSeccion({
  titulo,
  enlace,
}: {
  titulo: string;
  enlace?: { href: string; label: string };
}) {
  return (
    <div className="flex items-baseline justify-between gap-4 border-b border-[var(--borde)] pb-3">
      {/*
        Caja normal en el JSX y `uppercase` por CSS: en mayúscula sostenida
        algunos lectores de pantalla deletrean letra por letra.

        `min-w-0` porque el enlace de al lado es `shrink-0`: sin él, un título
        largo en 320px empujaría la fila y desbordaría en lugar de partirse.
      */}
      <h2 className="font-(family-name:--font-archivo) min-w-0 text-[22px] leading-none font-bold tracking-[-0.02em] text-[var(--texto)] uppercase md:text-[26px]">
        {titulo}
      </h2>
      {enlace ? (
        /*
          `min-h-11` con `-my-3` que lo compensa: el enlace medía 87×17 y era el
          objetivo táctil más chico de la home, además de ser el único paso de los
          destacados al catálogo completo. El margen negativo devuelve al flujo los
          24px que agrega el alto mínimo, así que el área táctil llega a 44px sin
          separar el título de su regla ni romper la alineación por línea base.
        */
        <Link
          href={enlace.href}
          className="-my-3 flex min-h-11 shrink-0 items-center gap-1.5 font-(family-name:--font-mono-demo) text-[11px] text-[var(--acento)] underline-offset-4 hover:underline md:text-[12px]"
        >
          {enlace.label}
          <ArrowRight aria-hidden="true" size={14} strokeWidth={1.75} />
        </Link>
      ) : null}
    </div>
  );
}

/**
 * Home de la tienda. **No exporta `metadata` a propósito**: el título lo pone el
 * `generateMetadata` del layout con `title.absolute`, que es lo único que escapa
 * al `titleTemplate` de la raíz. Un `title` acá volvería a caer en esa plantilla
 * y la tienda del cliente saldría titulada "| XyraCode".
 */
export default async function DemoHome({
  params,
}: {
  params: Promise<{ cliente: string }>;
}) {
  const { cliente } = await params;
  const demo = getDemo(cliente);
  if (!demo) notFound();

  const catalogo = `/demos/${demo.slug}/catalogo`;
  // `slice(0, 4)` porque la sección es **una fila y nada más**: la grilla va a 4
  // columnas arriba de 768px, así que un quinto destacado abriría una segunda
  // fila con una tarjeta sola y tres huecos. El corte vive acá y no en el modelo
  // para que marcar un `destacado` de más no rompa la home (prototipo del
  // handoff, `Demo-Tienda-Palomita.dc.html`: `filter(p => p.dest).slice(0, 4)`).
  const destacados = demo.productos.filter((producto) => producto.destacado).slice(0, 4);

  return (
    <>
      <StoreHero demo={demo} />

      {/*
        `destacado` es opcional en el modelo: una demo nueva puede no marcar
        ninguno todavía, y una sección con la grilla vacía y su regla colgando se
        ve rota. Sin destacados, la home pasa del hero a las categorías.
      */}
      {destacados.length > 0 ? (
        <section className="mx-auto max-w-[1240px] px-4 pb-9 md:px-6 md:pb-14">
          <EncabezadoSeccion
            titulo="Los que más salen"
            enlace={{ href: catalogo, label: `Ver los ${demo.productos.length}` }}
          />
          <div className="mt-5 md:mt-6">
            <ProductGrid productos={destacados} demo={demo} />
          </div>
        </section>
      ) : null}

      {/*
        Entre los destacados y las categorías: el visitante llega buscando guantes,
        ve guantes, y recién ahí recibe la razón para comprarle a él. Antes de
        cualquier producto, la home se leería como una página institucional.
      */}
      <StoreFounder demo={demo} />

      <section className="mx-auto max-w-[1240px] px-4 py-9 md:px-6 md:py-14">
        <EncabezadoSeccion titulo="Categorías" />
        <ul className="mt-5 grid gap-3 md:mt-6 md:grid-cols-3 md:gap-4">
          {demo.categorias.map((categoria, indice) => (
            // `grid` en el ítem para que la tarjeta se estire a todo el ancho y
            // todo el alto de su celda: las tres deben medir lo mismo aunque una
            // tenga el nombre más largo.
            <li key={categoria.slug} className="grid">
              <CategoryCard demo={demo} categoria={categoria} indice={indice} />
            </li>
          ))}
        </ul>
      </section>

      <TrustStrip demo={demo} />
    </>
  );
}
