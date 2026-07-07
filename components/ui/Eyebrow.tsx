import type { ElementType, ReactNode } from "react";

type EyebrowProps = {
  /** Elemento a renderizar (span por defecto; p.ej. "p" o "div"). */
  as?: ElementType;
  /** "md" 11px (default) · "sm" 10px (labels de stats/footer/strip). */
  size?: "sm" | "md";
  /** Color, márgenes y demás overrides. */
  className?: string;
  children: ReactNode;
};

/** Label de marca: UPPERCASE, weight 800, tracking 0.2em (handoff §6). */
export function Eyebrow({
  as: Tag = "span",
  size = "md",
  className = "",
  children,
}: EyebrowProps) {
  return (
    <Tag
      className={`${size === "sm" ? "text-[10px]" : "text-[11px]"} font-extrabold uppercase tracking-[0.2em] ${className}`}
    >
      {children}
    </Tag>
  );
}
