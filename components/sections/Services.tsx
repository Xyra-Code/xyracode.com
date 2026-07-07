import { Card } from "@/components/ui/Card";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { SERVICES } from "@/lib/content";

export function Services() {
  return (
    <section id="servicios" aria-labelledby="servicios-title">
      <div className="mx-auto max-w-300 px-5 pt-22 pb-10 sm:px-10">
        <Reveal>
          <SectionHeading
            id="servicios-title"
            eyebrow="Qué hacemos"
            title="Servicios a medida"
            subtitle="Todo el ciclo de tu producto digital, con un solo equipo."
            className="mb-13"
          />
        </Reveal>
        <ul className="grid gap-5.5 md:grid-cols-3">
          {SERVICES.map((service, i) => (
            <li key={service.title}>
              <Reveal delay={i * 60} className="h-full">
                <Card hoverLift className="h-full p-6.5">
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-[13px] bg-emerald-50">
                    <service.icon
                      size={22}
                      className="text-brand-primary"
                      aria-hidden
                    />
                  </div>
                  <h3 className="mb-[7px] text-[17px] font-bold">
                    {service.title}
                  </h3>
                  <p className="text-[13.5px] leading-[1.55] text-slate-500">
                    {service.desc}
                  </p>
                </Card>
              </Reveal>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
