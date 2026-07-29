import type { Metadata } from "next";
import { Archivo, Manrope, Space_Mono } from "next/font/google";
import { notFound } from "next/navigation";
import { CartButton } from "@/components/demos/CartButton";
import { CartDrawer } from "@/components/demos/CartDrawer";
import { CartProvider } from "@/components/demos/CartProvider";
import { DemoBar } from "@/components/demos/DemoBar";
import { StoreFooter } from "@/components/demos/StoreFooter";
import { StoreNav } from "@/components/demos/StoreNav";
import { DEMOS, getDemo } from "@/lib/content";
import "./demo.css";

/**
 * Tipografía del SISTEMA, no del cliente: las tres son iguales en todas las
 * demos (handoff §"Tokens · dos capas"). Se cargan acá y no en el layout raíz,
 * así el sitio de XyraCode no descarga ni un byte de estas familias.
 */
const archivo = Archivo({
  variable: "--font-archivo",
  subsets: ["latin"],
  weight: ["500", "700"],
});
const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});
const spaceMono = Space_Mono({
  variable: "--font-mono-demo",
  subsets: ["latin"],
  weight: ["400", "700"],
});

/**
 * NO alcanza con declarar `robots`.
 *
 * Next fusiona la metadata **superficialmente** de la raíz hacia abajo, así que
 * toda clave que no se redefina acá se hereda de `app/layout.tsx`: el título con
 * "| XyraCode", el `canonical` a "/", la description de la agencia y
 * `og:site_name` = XyraCode. Eso convierte la tienda del cliente en una página
 * de la agencia — justo lo que el spec §2 pide evitar — y deja un canonical a la
 * home desde una página noindex, que es una señal contradictoria.
 *
 * `title` lleva **`absolute` y `template` juntos**, y hacen falta los dos —
 * verificado contra el HTML construido, no deducido:
 *
 * - `default` NO sirve acá: sigue pasando por el `template` de la raíz, así que
 *   el título salía "Guantes NR1 — El inoxidable | XyraCode". Solo `absolute`
 *   escapa la plantilla del padre.
 * - `absolute` a secas tampoco alcanza: arregla solo esta ruta, y las páginas
 *   hijas (catálogo, detalle) con un title de tipo string volverían a caer en el
 *   titleTemplate de la raíz.
 *
 * Con las dos, esta ruta queda limpia y cualquier hija hereda el template de la
 * tienda sin que nadie tenga que acordarse.
 */
export async function generateMetadata({
  params,
}: {
  params: Promise<{ cliente: string }>;
}): Promise<Metadata> {
  const { cliente } = await params;
  const demo = getDemo(cliente);

  // Sin demo la ruta no existe y el layout llama a notFound(). Igual se declara
  // robots, para que ni ese caso herede la identidad de la agencia.
  if (!demo) return { robots: { index: false, follow: false } };

  const titulo = `${demo.negocio.nombre} — ${demo.negocio.tagline}`;
  const url = `/demos/${demo.slug}`;

  return {
    /**
     * Toda la rama fuera del índice. NO agregar `Disallow: /demos` en
     * `app/robots.ts`: impediría que Google **lea** esta etiqueta y la URL
     * quedaría indexable por enlaces externos. Rastreo permitido + noindex es la
     * combinación correcta.
     */
    robots: { index: false, follow: false },
    title: { absolute: titulo, template: `%s · ${demo.negocio.nombre}` },
    description: demo.hero.subtitulo,
    // Autorreferencial: heredar el "/" de la raíz apuntaría a la home de la
    // agencia desde la tienda de un cliente.
    alternates: { canonical: url },
    openGraph: {
      type: "website",
      url,
      siteName: demo.negocio.nombre,
      title: titulo,
      description: demo.hero.subtitulo,
    },
    twitter: {
      card: "summary_large_image",
      title: titulo,
      description: demo.hero.subtitulo,
    },
  };
}

/**
 * Un slug desconocido se corta a nivel de routing y lo atiende
 * `app/global-not-found.tsx`, igual que en `blog/[slug]` y `proyectos/[slug]`.
 * Por eso la demo no lleva `not-found.tsx` propia: sería código muerto.
 */
export const dynamicParams = false;

export function generateStaticParams() {
  return DEMOS.map((demo) => ({ cliente: demo.slug }));
}

export default async function DemoLayout({
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
    <div
      // `pt-8 md:pt-10` reserva el alto de la franja, que es `fixed` y por lo
      // tanto está fuera del flujo. Con eso el nav —que es `sticky top-8`—
      // arranca justo debajo de ella y se pega ahí al hacer scroll. Son los
      // únicos dos elementos fijos: 84px en móvil, 112px en desktop.
      className={`demo-root ${archivo.variable} ${manrope.variable} ${spaceMono.variable} flex min-h-screen flex-col pt-8 font-(family-name:--font-manrope) md:pt-10`}
      style={
        {
          "--fondo": demo.tema.fondo,
          "--texto": demo.tema.texto,
          "--acento": demo.tema.acento,
          "--acento-texto": demo.tema.acentoTexto,
        } as React.CSSProperties
      }
    >
      <DemoBar />
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
    </div>
  );
}
