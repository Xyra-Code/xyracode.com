import { notFound } from "next/navigation";
import { CartButton } from "@/components/demos/CartButton";
import { CartDrawer } from "@/components/demos/CartDrawer";
import { CartProvider } from "@/components/demos/CartProvider";
import { StoreFooter } from "@/components/demos/StoreFooter";
import { StoreNav } from "@/components/demos/StoreNav";
import { getDemo } from "@/lib/content/demos";

/**
 * Chrome de la **vitrina**: nav, carrito y footer del comercio.
 *
 * Vive en un route group `(tienda)` y no en el layout de `[cliente]` porque un
 * layout baja a toda su rama, y el panel de administración es una superficie
 * distinta: no lleva el nav de la tienda ni el carrito de un comprador. Es el
 * mismo problema que resolvió `SiteChrome` en la raíz del sitio —herencia
 * todo-o-nada hacia abajo— y acá se resuelve con la herramienta que Next ofrece
 * para eso: los paréntesis no aparecen en la URL, así que
 * `(tienda)/catalogo/page.tsx` sigue sirviendo `/demos/<cliente>/catalogo`.
 *
 * Lo que **no** está acá y sí en el layout de `[cliente]`: el tema del cliente,
 * las fuentes, la metadata y `generateStaticParams`. Todo eso lo comparten la
 * vitrina y el panel, y duplicarlo los dejaría desincronizarse.
 */
export default async function TiendaLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ cliente: string }>;
}) {
  const { cliente } = await params;
  const demo = getDemo(cliente);
  if (!demo) notFound();

  return (
    <>
      {/* El provider envuelve al nav, no solo al contenido: el CartButton vive
          dentro del nav y necesita leer el context. */}
      <CartProvider demo={demo}>
        <StoreNav demo={demo}>
          <CartButton />
        </StoreNav>
        <main className="flex-1">{children}</main>
        <CartDrawer demo={demo} />
      </CartProvider>
      <StoreFooter demo={demo} />
    </>
  );
}
