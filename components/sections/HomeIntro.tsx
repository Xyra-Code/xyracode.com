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
      <div className="mx-auto max-w-300 px-5 pt-22 pb-4 sm:px-10">
        <Reveal>
          <SectionHeading
            id="quienes-somos-title"
            title={HOME_INTRO.title}
            className="mb-8 lg:mb-10"
          />
        </Reveal>
        {/* En escritorio la prosa corre en dos columnas tipo periódico: con
            tres párrafos de largo distinto, una rejilla dejaría las columnas
            desparejas y columns-2 las equilibra solo. Un único Reveal para el
            bloque, porque un párrafo partido entre columnas no anima bien. */}
        <Reveal className="min-w-0 lg:columns-2 lg:gap-16">
          {HOME_INTRO.paragraphs.map((paragraph, i) => (
            <p
              key={i}
              className="mb-5 text-[16.5px] leading-[1.75] text-slate-600 last:mb-0 [&_a]:font-semibold [&_a]:text-brand-primary [&_a]:underline [&_a]:underline-offset-4 [&_a:hover]:text-teal-600"
            >
              {renderInline(paragraph)}
            </p>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
