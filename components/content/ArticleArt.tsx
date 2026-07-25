import { ReceiptText } from "lucide-react";
import type { ReactElement } from "react";

/**
 * Arte de portada de los artículos que aún no tienen fotografía.
 *
 * Cada artículo puede tener dos piezas, porque los dos huecos piden cosas
 * distintas: la card del índice (~300px) solo aguanta un símbolo, mientras que
 * el hero del artículo (900px) sí tiene aire para mostrar datos. Ambas usan el
 * fondo de marca `.xc-doc-cover` — los mismos glows que las imágenes Open
 * Graph (lib/og.tsx) — para que todo se lea como una misma familia.
 */

/* ----------------------------------------------------------------- costos -- */

/**
 * Las dos columnas replican la tesis del artículo (lib/content/blog.ts): el
 * costo no se parte por tipo de proyecto sino por frecuencia de pago. Son
 * etiquetas de concepto, nunca cifras: publicar rangos en la portada volvería
 * a anclar el precio, que es justo lo que el artículo dejó de hacer.
 */
const ONCE = ["Diseño", "Desarrollo", "Contenido", "Integraciones", "SEO técnico"];

const RECURRING = [
  { label: "Dominio", every: "/año" },
  { label: "Hosting", every: "/mes" },
  { label: "Correo", every: "/mes" },
  { label: "Licencias", every: "/año" },
  { label: "Mantenimiento", every: "/mes" },
];

/**
 * Hero del artículo de costos: la estructura de la respuesta antes de leer una
 * línea. Va `aria-hidden` a propósito — el cuerpo lista los mismos ítems en
 * texto, que es la versión que debe leer un lector de pantalla.
 */
export function CostSplitArt() {
  return (
    <div aria-hidden className="xc-doc-cover absolute inset-0 overflow-hidden">
      {/* Marco técnico de línea fina, como las cards Open Graph */}
      <div className="absolute inset-4 rounded-[12px] border border-[rgba(94,234,212,0.14)] md:inset-6" />
      <div className="absolute inset-0 flex flex-col justify-between p-7 md:p-12">
        <p className="font-mono text-[12px] tracking-wide text-teal-300 md:text-[13px]">
          {"// anatomía del costo"}
        </p>

        {/* En móvil las columnas se apilan; desde sm van lado a lado con el
            divisor vertical que separa único de recurrente. */}
        <div className="grid gap-5 py-4 sm:grid-cols-2 sm:gap-0">
          <div className="flex flex-col gap-2 sm:gap-3 sm:pr-6 md:pr-10">
            <p className="font-mono text-[11px] tracking-[0.14em] text-[rgba(226,247,242,0.45)] uppercase md:text-[12px]">
              Pago único
            </p>
            {ONCE.map((label) => (
              <div key={label} className="flex items-baseline justify-between gap-3">
                <span className="font-mono text-[12px] text-[rgba(226,247,242,0.85)] md:text-[15px]">
                  {label}
                </span>
                <span className="font-mono text-[11px] text-teal-300 md:text-[13px]">
                  ×1
                </span>
              </div>
            ))}
          </div>

          <div className="flex flex-col gap-2 border-[rgba(94,234,212,0.14)] sm:gap-3 sm:border-l sm:pl-6 md:pl-10">
            <p className="font-mono text-[11px] tracking-[0.14em] text-[rgba(226,247,242,0.45)] uppercase md:text-[12px]">
              Recurrente
            </p>
            {RECURRING.map((item) => (
              <div
                key={item.label}
                className="flex items-baseline justify-between gap-3"
              >
                <span className="font-mono text-[12px] text-[rgba(226,247,242,0.85)] md:text-[15px]">
                  {item.label}
                </span>
                <span className="font-mono text-[11px] text-teal-300 md:text-[13px]">
                  {item.every}
                </span>
              </div>
            ))}
          </div>
        </div>

        <p className="font-mono text-[11px] leading-[1.6] text-[rgba(226,247,242,0.4)] md:text-[12px]">
          se paga una vez · se paga mientras el sitio exista
        </p>
      </div>
    </div>
  );
}

/**
 * Card del índice para el mismo artículo: una cotización dentro de dos anillos
 * y un halo mint. Es la cotización y no una etiqueta de precio porque el
 * artículo no vende un precio, enseña a exigir un documento con alcance.
 */
export function QuoteIconArt() {
  return (
    <div aria-hidden className="xc-doc-cover absolute inset-0 overflow-hidden">
      <div className="xc-art-halo absolute inset-0" />
      <div className="absolute inset-4 rounded-[12px] border border-[rgba(94,234,212,0.14)] md:inset-6" />
      <div className="absolute inset-0 flex items-center justify-center">
        {/* Anillo exterior */}
        <div className="flex size-44 items-center justify-center rounded-full border border-[rgba(94,234,212,0.12)] md:size-56">
          {/* Anillo interior + ícono */}
          <div className="flex size-28 items-center justify-center rounded-full border border-[rgba(94,234,212,0.28)] bg-[rgba(94,234,212,0.06)] md:size-36">
            <ReceiptText
              strokeWidth={1.25}
              className="size-12 text-teal-300 md:size-16"
            />
          </div>
        </div>
      </div>
      <p className="absolute bottom-7 left-7 font-mono text-[12px] tracking-wide text-teal-300 md:bottom-9 md:left-9">
        {"// costos 2026"}
      </p>
    </div>
  );
}

/* ------------------------------------------------------------- selección -- */

/** Arte de la card del índice, por slug. */
export const CARD_ART: Record<string, () => ReactElement> = {
  "cuanto-cuesta-una-web-colombia-2026": QuoteIconArt,
};

/** Arte del hero del artículo, por slug. */
export const HERO_ART: Record<string, () => ReactElement> = {
  "cuanto-cuesta-una-web-colombia-2026": CostSplitArt,
};
