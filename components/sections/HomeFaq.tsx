import { renderInline } from "@/components/content/InlineText";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { HOME_FAQ } from "@/lib/content";

/**
 * FAQ de la home. Las preguntas son las que llegan de verdad por WhatsApp y
 * las respuestas se contestan aquí, no solo enlazan: una FAQ que remite a otra
 * página para todo no responde la intención de quien llegó buscando.
 */
export function HomeFaq() {
  return (
    <section id="preguntas" aria-labelledby="preguntas-title">
      <div className="mx-auto max-w-300 px-5 pt-20 pb-6 sm:px-10">
        <Reveal>
          <SectionHeading
            id="preguntas-title"
            title={HOME_FAQ.title}
            className="mb-8 lg:mb-10"
          />
        </Reveal>
        {/* Dos columnas tipo periódico en escritorio: con cinco preguntas de
            largo distinto, columns-2 equilibra la altura y break-inside-avoid
            impide que una respuesta quede partida entre columnas. */}
        <dl className="min-w-0 lg:columns-2 lg:gap-16">
          {HOME_FAQ.items.map((item, i) => (
            <Reveal
              key={item.q}
              delay={i * 50}
              className="mb-7 break-inside-avoid"
            >
              <dt className="mb-2 text-[17px] font-bold text-slate-900">
                {item.q}
              </dt>
              <dd className="text-[16px] leading-[1.7] text-slate-600 [&_a]:font-semibold [&_a]:text-brand-primary [&_a]:underline [&_a]:underline-offset-4 [&_a:hover]:text-teal-600">
                {renderInline(item.a)}
              </dd>
            </Reveal>
          ))}
        </dl>
      </div>
    </section>
  );
}
