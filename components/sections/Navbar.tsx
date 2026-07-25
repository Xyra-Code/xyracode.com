"use client";

import { Menu, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { UI } from "@/lib/content";

const linkBase =
  "text-[11px] font-extrabold uppercase tracking-[0.2em] transition-colors duration-200 hover:text-teal-300 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-teal-300";

export function Navbar() {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const pathname = usePathname();

  const linkClass = (href: string) =>
    `${linkBase} ${pathname === href ? "text-teal-300" : "text-white/70"}`;

  return (
    <header className="sticky top-0 z-50 border-b border-white/6 bg-[rgba(8,17,15,0.85)] backdrop-blur-md">
      <nav
        aria-label={UI.nav.navAria}
        className="mx-auto flex max-w-300 items-center justify-between px-5 py-3.5 sm:px-10"
      >
        <Link href="/" aria-label={UI.nav.homeAria} className="flex items-center">
          {/* El fuente pesaba 158 KB a 1959px de ancho para renderizarse a 56px
              de alto; ahora mide 460px (2x del render real) y se sirve en ~8 KB.
              `preload={false}` y sin `loading="eager"`: el único preload de
              imagen de la home debe ser el del hero, que es el que marca el
              LCP. Verificado que `loading="eager"` fuerza el preload igual
              aunque `preload` sea false, así que se deja el lazy por defecto:
              al estar en viewport el navegador lo pide en el primer layout. */}
          <Image
            src="/assets/brand/logo-nav.png"
            alt=""
            width={460}
            height={116}
            preload={false}
            className="h-14 w-auto"
          />
        </Link>

        {/* Desktop */}
        <div className="hidden items-center gap-7.5 md:flex">
          {UI.nav.links.map((link) => (
            <Link key={link.href} href={link.href} className={linkClass(link.href)}>
              {link.label}
            </Link>
          ))}
          <Button href="/#contacto" size="sm">
            {UI.nav.cta}
          </Button>
        </div>

        {/* Mobile */}
        <button
          type="button"
          className="text-white md:hidden"
          aria-expanded={mobileNavOpen}
          aria-controls="mobile-nav"
          aria-label={mobileNavOpen ? UI.nav.closeMenu : UI.nav.openMenu}
          onClick={() => setMobileNavOpen((open) => !open)}
        >
          {mobileNavOpen ? <X aria-hidden /> : <Menu aria-hidden />}
        </button>
      </nav>

      {mobileNavOpen && (
        <div
          id="mobile-nav"
          className="flex flex-col gap-5 border-t border-white/6 px-5 pt-4 pb-6 md:hidden"
        >
          {UI.nav.links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={linkClass(link.href)}
              onClick={() => setMobileNavOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          <Button
            href="/#contacto"
            size="sm"
            className="self-start"
            onClick={() => setMobileNavOpen(false)}
          >
            {UI.nav.cta}
          </Button>
        </div>
      )}
    </header>
  );
}
