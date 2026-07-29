import Link from "next/link";
import type { ReactNode } from "react";

type Variante = "primario" | "secundario";

type Props = {
  variant?: Variante;
  /** Ancho completo: el CTA de la tarjeta y el del panel del carrito. */
  full?: boolean;
  className?: string;
  children: ReactNode;
};

/**
 * Botón de la tienda, sobre los tokens del tema del cliente.
 *
 * Deliberadamente NO reusa `components/ui/Button`: ese está acoplado a la marca
 * de XyraCode en las tres variantes (`bg-brand-secondary`, `text-night`,
 * `outline-teal-300`, `hover:bg-teal-100`) y además solo renderiza `<Link>`.
 *
 * Sin `"use client"` y sin imports server-only: se usa igual desde el árbol
 * servidor y desde dentro de componentes cliente.
 */
const BASE =
  "inline-flex items-center justify-center gap-2 rounded-[4px] px-5 font-(family-name:--font-archivo) text-[13px] font-bold tracking-[0.02em] uppercase transition-colors duration-150 min-h-11";

const VARIANTES: Record<Variante, string> = {
  primario:
    "bg-[var(--acento)] text-[var(--acento-texto)] hover:bg-[color-mix(in_srgb,var(--acento)_88%,var(--texto))]",
  secundario:
    "border border-[var(--borde-fuerte)] text-[var(--texto)] hover:bg-[var(--superficie)]",
};

export function storeButtonClasses(
  variant: Variante = "primario",
  full = false,
  extra = "",
) {
  return `${BASE} ${VARIANTES[variant]} ${full ? "w-full" : ""} ${extra}`.trim();
}

/** Versión enlace. Para el `<button>` real usar `storeButtonClasses()`. */
export function StoreButton({
  href,
  variant = "primario",
  full = false,
  className = "",
  external = false,
  children,
}: Props & { href: string; external?: boolean }) {
  const classes = storeButtonClasses(variant, full, className);

  if (external) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={classes}>
        {children}
      </a>
    );
  }

  return (
    <Link href={href} className={classes}>
      {children}
    </Link>
  );
}
