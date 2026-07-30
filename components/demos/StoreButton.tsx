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
/**
 * `text-center` importa solo cuando la etiqueta envuelve, y por eso está.
 * `justify-center` centra el trozo de texto como bloque, pero las líneas de
 * adentro se alinean con `text-align`, que por defecto es al inicio: a 320px la
 * tarjeta mide 138px y "ELEGIR TALLA" no entra en una línea ni sin padding, así
 * que salían dos renglones pegados a la izquierda dentro de un botón centrado.
 * Con esto las dos líneas quedan centradas y el envolver se lee como decisión.
 */
const BASE =
  "inline-flex items-center justify-center gap-2 rounded-[4px] text-center font-(family-name:--font-archivo) text-[13px] leading-tight font-bold tracking-[0.02em] uppercase transition-colors duration-150 min-h-11";

/**
 * El padding horizontal depende de `full`, y no es un detalle estético.
 *
 * Con `w-full` el ancho ya lo pone el contenedor y el padding no centra nada: solo
 * le quita sitio al texto. En la tarjeta de producto eso rompía — a 320px la
 * tarjeta mide 138px, el botón 104, y los 40px de `px-5` dejaban 64 para un
 * "ELEGIR TALLA" que necesita 86: salía partido en dos renglones dentro de un
 * botón de 44px de alto. Medido en Chrome a 320 y 360; a 390 entraba justo.
 *
 * `px-3` deja 80px de texto a 320 y 100 a 360, así que el CTA vuelve a una línea
 * en los teléfonos angostos —iPhone SE/mini y Android de 360dp— sin cambiar nada
 * del botón suelto, que sigue en `px-5` porque ahí el padding SÍ define el ancho.
 */

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
  return `${BASE} ${VARIANTES[variant]} ${full ? "w-full px-3" : "px-5"} ${extra}`.trim();
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
