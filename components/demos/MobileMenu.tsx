"use client";

import { Menu, X } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export type NavLink = { href: string; label: string };

/**
 * Despliegue del nav en móvil. Es lo único del nav que necesita estado, así que
 * `StoreNav` puede quedarse como Server Component y solo este trozo va al
 * navegador.
 */
export function MobileMenu({ links }: { links: NavLink[] }) {
  const [abierto, setAbierto] = useState(false);

  return (
    <div className="md:hidden">
      <button
        type="button"
        onClick={() => setAbierto((v) => !v)}
        aria-expanded={abierto}
        aria-label={abierto ? "Cerrar menú" : "Abrir menú"}
        className="flex size-11 items-center justify-center text-[var(--texto)]"
      >
        {abierto ? <X size={20} strokeWidth={1.75} /> : <Menu size={20} strokeWidth={1.75} />}
      </button>

      {abierto && (
        // Cuelga del nav (que es sticky) y cubre el ancho completo.
        <nav
          aria-label="Menú de la tienda"
          className="absolute inset-x-0 top-full flex flex-col border-b border-[var(--borde)] bg-[var(--superficie)]"
        >
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setAbierto(false)}
              className="flex min-h-12 items-center border-t border-[var(--borde)] px-4 text-[15px] text-[var(--texto)]"
            >
              {link.label}
            </Link>
          ))}
        </nav>
      )}
    </div>
  );
}
