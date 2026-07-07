import Link from "next/link";
import type { ReactNode } from "react";

type ButtonProps = {
  href: string;
  /**
   * "primary": emerald sobre oscuro · "ghost": borde translúcido sobre
   * oscuro/teal · "light": blanco sobre teal (CTA). Handoff §4/§5.
   */
  variant?: "primary" | "ghost" | "light";
  /** "md" default · "sm" para el "Cotizar" de la navbar. */
  size?: "sm" | "md";
  className?: string;
  onClick?: () => void;
  /** "_blank" para enlaces externos (agrega rel de seguridad). */
  target?: "_blank";
  children: ReactNode;
};

const base =
  "inline-flex items-center gap-2 rounded-[10px] font-bold transition-all duration-200 ease-out focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-300";

const variants: Record<NonNullable<ButtonProps["variant"]>, string> = {
  primary:
    "bg-brand-secondary text-night hover:-translate-y-px hover:bg-emerald-600",
  // El color del borde ghost varía por contexto (hero white/22, CTA white/40):
  // lo pasa el caller vía className para evitar clases de borde en conflicto.
  ghost: "border text-white hover:bg-white/6",
  light: "bg-white text-brand-primary hover:-translate-y-px hover:bg-teal-100",
};

const sizes: Record<NonNullable<ButtonProps["size"]>, string> = {
  sm: "px-[18px] py-[9px] text-[13px]",
  md: "px-[22px] py-3 text-sm",
};

/**
 * Devuelve las clases de un botón/CTA para reutilizar el mismo estilo en
 * elementos que no son <Link> (p.ej. el <button> del popup de Cal.com).
 */
export function buttonClasses(
  variant: NonNullable<ButtonProps["variant"]> = "primary",
  size: NonNullable<ButtonProps["size"]> = "md",
  extra = "",
) {
  return `${base} ${variants[variant]} ${sizes[size]} ${extra}`;
}

/** CTA como enlace (todos los botones de la landing navegan a anclas/mailto). */
export function Button({
  href,
  variant = "primary",
  size = "md",
  className = "",
  onClick,
  target,
  children,
}: ButtonProps) {
  return (
    <Link
      href={href}
      onClick={onClick}
      target={target}
      rel={target === "_blank" ? "noopener noreferrer" : undefined}
      className={buttonClasses(variant, size, className)}
    >
      {children}
    </Link>
  );
}
