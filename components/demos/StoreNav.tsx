import Image from "next/image";
import Link from "next/link";
import type { Demo } from "@/lib/content/demos";
import { MobileMenu, type NavLink } from "./MobileMenu";

/**
 * Nav de la tienda del cliente. `sticky top-0` y el único elemento pegajoso de la
 * tienda: 52px en móvil, 72px en desktop. Ese alto es el que compensa el
 * `scroll-padding-top` de `demo.css` al navegar por anclas — si cambia el `h-13`
 * de abajo, hay que cambiarlo allá también.
 *
 * El logo va a **40px de alto**, no a los 24px que asumía el handoff: la marca de
 * NR1 tiene alas y letras solapadas, mucho más densa que un wordmark
 * tipográfico, y a 24px es ilegible (spec §5.9).
 *
 * `children` es el slot del carrito: la Tarea 6 mete `<CartButton />` ahí sin
 * tocar este archivo.
 */
export function StoreNav({ demo, children }: { demo: Demo; children?: React.ReactNode }) {
  const base = `/demos/${demo.slug}`;

  /**
   * Las categorías apuntan al catálogo con un hash. El filtro corre en el
   * navegador (leer `searchParams` sacaría la página del prerender estático), y
   * un hash sí sobrevive al prerender: `FilterableCatalog` lo lee al montar.
   */
  const links: NavLink[] = [
    { href: `${base}/catalogo`, label: "Catálogo" },
    ...demo.categorias.map((categoria) => ({
      href: `${base}/catalogo#${categoria.slug}`,
      label: categoria.nombre,
    })),
  ];

  return (
    <header className="sticky top-0 z-40 border-b border-[var(--borde)] bg-[var(--fondo)]">
      <div className="relative mx-auto flex h-13 max-w-[1240px] items-center justify-between gap-4 px-4 md:h-18 md:px-6">
        {/*
          `min-h-11` en el enlace, no en la imagen: el logo mide 32px de alto en
          móvil (`h-8`) y el área táctil quedaba en 45×32, por debajo del mínimo de
          44. El alto extra no mueve nada porque el nav ya es de 52px y el enlace
          está centrado.
        */}
        <Link
          href={base}
          className="flex min-h-11 shrink-0 items-center"
          aria-label={demo.negocio.nombre}
        >
          <Image
            src={demo.negocio.logoMarca.src}
            alt={demo.negocio.logoMarca.alt}
            width={demo.negocio.logoMarca.width}
            height={demo.negocio.logoMarca.height}
            priority
            // El slot es de alto fijo (32px móvil / 40px desktop) y el asset mide
            // 852px de ancho. Sin `sizes`, Next lo sirve entero para pintar 57px.
            sizes="57px"
            className="h-8 w-auto md:h-10"
          />
        </Link>

        {/*
          `min-h-11` también acá: este nav aparece desde 768px, y 768px es un iPad
          en vertical — o sea táctil. Sin el alto mínimo los enlaces medían 23px.
          No cambia la barra, que ya es de 72px en ese quiebre.
        */}
        <nav aria-label="Categorías" className="hidden items-center gap-7 md:flex">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="inline-flex min-h-11 items-center text-[15px] text-[var(--atenuado)] transition-colors hover:text-[var(--texto)]"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex shrink-0 items-center gap-1">
          {children}
          <MobileMenu links={links} />
        </div>
      </div>
    </header>
  );
}
