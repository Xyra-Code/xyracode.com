import Link from "next/link";
import { Navbar } from "@/components/sections/Navbar";
import { UI } from "@/lib/content";

/**
 * Pantalla de error 404 (handoff design_handoff_404). Vive en un componente
 * propio porque la usan los dos caminos que Next distingue: `app/not-found.tsx`
 * para las llamadas a `notFound()` dentro de un segmento y
 * `app/global-not-found.tsx` para las URLs que no matchean ninguna ruta. Que la
 * pantalla sea una sola es lo que garantiza que los dos se vean igual.
 *
 * Los dos CTA usan clases propias en vez del <Button> compartido: el handoff los
 * pide en pill (radio 9999px, 17/34 de padding, 16px) y el botón del sistema es
 * rounded-[10px] más chico, así que sobrescribirlo dependería del orden en que
 * Tailwind emite utilidades del mismo grupo.
 */
export function NotFoundScreen() {
  return (
    <>
      <Navbar />
      <main className="relative flex flex-1 flex-col overflow-hidden bg-[radial-gradient(1200px_800px_at_50%_0%,#0d2b26_0%,#08110f_62%)] text-white">
        {/* Blobs decorativos: teal arriba-izquierda, emerald abajo-derecha. */}
        <div aria-hidden className="pointer-events-none absolute inset-0">
          <div className="absolute -top-40 -left-30 h-130 w-130 rounded-full bg-brand-primary opacity-35 blur-[150px]" />
          <div className="absolute -right-25 -bottom-55 h-140 w-140 rounded-full bg-brand-secondary opacity-14 blur-[150px]" />
        </div>

        <div className="relative flex flex-1 flex-col items-center justify-center gap-9 px-6 pt-10 pb-20 text-center md:px-14">
          <div
            role="img"
            aria-label={UI.notFound.codeAria}
            className="xc-404-code flex cursor-default items-center gap-3.5 text-[110px] leading-[0.9] font-extrabold tracking-[-0.05em] text-teal-300 select-none md:gap-6 md:text-[210px]"
          >
            <span>4</span>
            <span className="xc-404-ufo inline-block text-[90px] md:text-[170px]">
              🛸
            </span>
            <span>4</span>
          </div>

          <h1 className="xc-404-fade-1 text-[30px] leading-[1.05] font-extrabold tracking-[-0.03em] md:text-[44px]">
            {UI.notFound.title}
          </h1>

          <p className="xc-404-fade-2 max-w-135 text-[17px] leading-[1.65] text-[rgba(226,247,242,0.7)] md:text-[19px]">
            {UI.notFound.paragraph}
          </p>

          <div className="xc-404-fade-3 flex w-full flex-col gap-4 sm:w-auto sm:flex-row">
            <Link
              href="/"
              className="inline-flex items-center justify-center gap-2.5 rounded-full bg-brand-secondary px-[34px] py-[17px] text-[16px] font-extrabold text-[#04211a] shadow-[0_16px_38px_-16px_rgba(16,185,129,0.6)] transition-[transform,box-shadow] duration-250 ease-out hover:-translate-y-0.5 hover:shadow-[0_22px_46px_-18px_rgba(16,185,129,0.8)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-300"
            >
              {UI.notFound.ctaPrimary}
            </Link>
            <Link
              href="/contacto"
              className="inline-flex items-center justify-center gap-2.5 rounded-full border border-[rgba(94,234,212,0.35)] px-[34px] py-[17px] text-[16px] font-bold text-teal-300 transition-colors duration-250 ease-out hover:bg-[rgba(94,234,212,0.08)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-300"
            >
              {UI.notFound.ctaSecondary}
            </Link>
          </div>
        </div>
      </main>
    </>
  );
}
