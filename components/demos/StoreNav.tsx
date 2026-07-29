import Image from "next/image";
import Link from "next/link";
import type { Demo } from "@/lib/content";
import { MobileMenu, type NavLink } from "./MobileMenu";

/**
 * Nav de la tienda del cliente. `sticky` justo debajo de la franja de XyraCode:
 * 32 + 52 = 84px fijos en móvil, 40 + 72 = 112px en desktop. Nada más se fija.
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
    <header className="sticky top-8 z-40 border-b border-[var(--borde)] bg-[var(--fondo)] md:top-10">
      <div className="relative mx-auto flex h-13 max-w-[1240px] items-center justify-between gap-4 px-4 md:h-18 md:px-6">
        <Link href={base} className="flex shrink-0 items-center" aria-label={demo.negocio.nombre}>
          <Image
            src={demo.negocio.logoMarca.src}
            alt={demo.negocio.logoMarca.alt}
            width={demo.negocio.logoMarca.width}
            height={demo.negocio.logoMarca.height}
            priority
            className="h-8 w-auto md:h-10"
          />
        </Link>

        <nav aria-label="Categorías" className="hidden items-center gap-7 md:flex">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-[15px] text-[var(--atenuado)] transition-colors hover:text-[var(--texto)]"
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
