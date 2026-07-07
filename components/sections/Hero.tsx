import { ArrowRight } from "lucide-react";
import { Fragment } from "react";
import { Button } from "@/components/ui/Button";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Reveal } from "@/components/ui/Reveal";
import { STATS } from "@/lib/content";

const TERMINAL_LINES = [
  { text: "$ xyra build --prod", className: "text-teal-300" },
  { text: "→ compilando módulos…", className: "text-white/50" },
  { text: "→ optimizando assets…", className: "text-white/50" },
  { text: "✓ build listo en 8.2s", className: "text-emerald-400" },
  { text: "✓ deploy → producción", className: "text-emerald-400" },
] as const;

export function Hero() {
  return (
    <section
      aria-labelledby="hero-title"
      className="relative overflow-hidden bg-[linear-gradient(155deg,#08110F_0%,#0d2b26_58%,#0F3D34_100%)] px-5 pt-20 pb-24 text-white sm:px-10"
    >
      {/* Blobs difusos de fondo */}
      <div
        aria-hidden
        className="absolute -top-30 -right-15 h-105 w-105 rounded-full bg-emerald-500 opacity-20 blur-[110px]"
      />
      <div
        aria-hidden
        className="absolute -bottom-40 -left-25 h-105 w-105 rounded-full bg-teal-500 opacity-[0.14] blur-[120px]"
      />

      <div className="relative mx-auto grid max-w-300 items-center gap-13 md:grid-cols-[1.08fr_0.92fr]">
        <Reveal>
          <Eyebrow as="p" className="mb-5 text-teal-300">
            Agencia de desarrollo web
          </Eyebrow>
          <h1
            id="hero-title"
            className="mb-5.5 text-[38px] leading-none font-extrabold tracking-[-0.035em] md:text-[58px]"
          >
            Código que <span className="text-teal-300">impulsa</span>
            <br />
            tu negocio
          </h1>
          <p className="mb-8 max-w-115 text-[17px] leading-[1.6] text-[rgba(226,247,242,0.78)]">
            Diseñamos y desarrollamos sitios, apps y plataformas a medida. Del
            prototipo a producción — rápido, escalable y sin fricción.
          </p>
          <div className="flex flex-wrap gap-3.5">
            <Button href="#contacto">
              Empezar proyecto <ArrowRight size={20} aria-hidden />
            </Button>
            <Button href="#portfolio" variant="ghost" className="border-white/22">
              Ver portfolio
            </Button>
          </div>

          <div className="mt-11 flex gap-7">
            {STATS.map((stat, i) => (
              <Fragment key={stat.label}>
                {i > 0 && <div aria-hidden className="w-px bg-white/12" />}
                <div>
                  <div className="text-[26px] font-extrabold text-white">
                    {stat.value}
                  </div>
                  <Eyebrow as="div" size="sm" className="mt-0.5 text-white/50">
                    {stat.label}
                  </Eyebrow>
                </div>
              </Fragment>
            ))}
          </div>
        </Reveal>

        {/* Tarjeta terminal */}
        <Reveal delay={120}>
          <div
            aria-hidden
            className="overflow-hidden rounded-2xl border border-[rgba(94,234,212,0.22)] bg-white/4 shadow-[0_30px_60px_-30px_rgba(0,0,0,0.6)] backdrop-blur-[10px]"
          >
            <div className="flex items-center gap-[7px] border-b border-white/8 px-4 py-3">
              <span className="h-[11px] w-[11px] rounded-full bg-[#ff5f57]" />
              <span className="h-[11px] w-[11px] rounded-full bg-[#febc2e]" />
              <span className="h-[11px] w-[11px] rounded-full bg-[#28c840]" />
              <span className="ml-2 font-mono text-[11.5px] text-white/40">
                deploy.sh
              </span>
            </div>
            <div className="p-5.5 font-mono text-[13px] leading-loose">
              {TERMINAL_LINES.map((line) => (
                <div key={line.text} className={line.className}>
                  {line.text}
                </div>
              ))}
              <div className="text-teal-300">
                → https://tuapp.com{" "}
                <span className="text-white/35">live ●</span>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
