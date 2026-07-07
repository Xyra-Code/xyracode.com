import { Eyebrow } from "./Eyebrow";

type SectionHeadingProps = {
  /** id del H2, para `aria-labelledby` en la sección. */
  id: string;
  eyebrow: string;
  title: string;
  subtitle?: string;
  align?: "center" | "left";
  /** "light": eyebrow teal-700 sobre claro · "dark": teal-300 sobre oscuro. */
  tone?: "light" | "dark";
  className?: string;
};

/** Encabezado de sección: eyebrow + H2 (800, 40px, -0.03em) + subtítulo. */
export function SectionHeading({
  id,
  eyebrow,
  title,
  subtitle,
  align = "center",
  tone = "light",
  className = "",
}: SectionHeadingProps) {
  return (
    <div className={`${align === "center" ? "text-center" : ""} ${className}`}>
      <Eyebrow
        as="p"
        className={`mb-3.5 ${tone === "dark" ? "text-teal-300" : "text-brand-primary"}`}
      >
        {eyebrow}
      </Eyebrow>
      <h2
        id={id}
        className="text-[32px] font-extrabold tracking-[-0.03em] md:text-[40px]"
      >
        {title}
      </h2>
      {subtitle && (
        <p
          className={`mt-3 text-base leading-[1.55] text-slate-500 ${
            align === "center" ? "mx-auto max-w-[520px]" : "max-w-[520px]"
          }`}
        >
          {subtitle}
        </p>
      )}
    </div>
  );
}
