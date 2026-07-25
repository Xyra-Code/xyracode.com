import { renderInline } from "@/components/content/InlineText";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { HOME_INTRO } from "@/lib/content";

/**
 * Bloque de contexto de la home: explica qué es XyraCode en prosa y reparte
 * los enlaces contextuales hacia las páginas de servicio, la página local,
 * proyectos y nosotros. Es el lugar donde esos enlaces pesan más, porque salen
 * de la URL con más autoridad del dominio.
 */
export function HomeIntro() {
  return (
    <section id="quienes-somos" aria-labelledby="quienes-somos-title">
      <div className="mx-auto max-w-190 px-5 pt-22 pb-4 sm:px-10">
        <Reveal>
          <SectionHeading
            id="quienes-somos-title"
            eyebrow={HOME_INTRO.eyebrow}
            title={HOME_INTRO.title}
            align="left"
            className="mb-8"
          />
        </Reveal>
        <div className="flex flex-col gap-5">
          {HOME_INTRO.paragraphs.map((paragraph, i) => (
            <Reveal key={i} delay={i * 60}>
              <p className="text-[16.5px] leading-[1.75] text-slate-600 [&_a]:font-semibold [&_a]:text-brand-primary [&_a]:underline [&_a]:underline-offset-4 [&_a:hover]:text-teal-600">
                {renderInline(paragraph)}
              </p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
