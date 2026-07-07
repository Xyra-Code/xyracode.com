import { Card } from "@/components/ui/Card";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { STEPS } from "@/lib/content";

export function Process() {
  return (
    <section id="proceso" aria-labelledby="proceso-title">
      <div className="mx-auto max-w-300 px-5 py-16 sm:px-10">
        <Reveal>
          <SectionHeading
            id="proceso-title"
            eyebrow="Cómo trabajamos"
            title="Proceso en 4 pasos"
            className="mb-13"
          />
        </Reveal>
        <ol className="grid gap-4.5 md:grid-cols-4">
          {STEPS.map((step, i) => (
            <li key={step.title}>
              <Reveal delay={i * 60} className="h-full">
                <Card className="h-full p-6">
                  <div className="mb-3.5 font-mono text-[13px] font-semibold text-brand-secondary">
                    0{i + 1}
                  </div>
                  <h3 className="mb-[7px] text-base font-bold">{step.title}</h3>
                  <p className="text-[13px] leading-normal text-slate-500">
                    {step.desc}
                  </p>
                </Card>
              </Reveal>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
