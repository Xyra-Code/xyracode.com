import { ProjectCarousel } from "@/components/sections/ProjectCarousel";
import { Button } from "@/components/ui/Button";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Reveal } from "@/components/ui/Reveal";
import { PROJECTS, UI } from "@/lib/content";

export function Portfolio() {
  return (
    <section
      id="portfolio"
      aria-labelledby="portfolio-title"
      className="bg-night px-5 py-22 text-white sm:px-10"
    >
      <div className="mx-auto max-w-300">
        <Reveal>
          <div className="mb-11">
            <Eyebrow as="p" className="mb-3.5 text-teal-300">
              {UI.portfolio.eyebrow}
            </Eyebrow>
            <h2
              id="portfolio-title"
              className="text-[32px] font-extrabold tracking-[-0.03em] md:text-[40px]"
            >
              {UI.portfolio.title}
            </h2>
          </div>
        </Reveal>

        <ul className="space-y-6">
          {PROJECTS.map((project, i) => (
            <li key={project.title}>
              <Reveal delay={i * 60}>
                <article className="overflow-hidden rounded-2xl border border-white/8 bg-white/3 transition-all duration-[220ms] ease-out hover:-translate-y-[3px] md:grid md:grid-cols-2">
                  {project.images?.length ? (
                    // El ratio en móvil replica el de las capturas (1898x865);
                    // en escritorio la foto llena toda la columna (ancho y
                    // alto) recortando el sobrante de los costados.
                    <ProjectCarousel
                      images={project.images}
                      className="aspect-1898/865 w-full md:order-2 md:aspect-auto md:h-full md:min-h-80"
                    />
                  ) : (
                    <div
                      className={`flex aspect-1898/865 items-center justify-center md:order-2 md:aspect-auto md:min-h-80 ${project.bg}`}
                    >
                      <project.icon
                        size={38}
                        className="text-white/90"
                        aria-hidden
                      />
                    </div>
                  )}

                  <div className="flex flex-col px-5 py-6 sm:px-7 md:order-1 md:px-9 md:py-8">
                    <div className="mb-2 flex items-start justify-between gap-3">
                      <h3 className="text-xl font-bold md:text-2xl">
                        {project.title}
                      </h3>
                      {project.status ? (
                        <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-teal-300/10 px-2.5 py-1 text-[10.5px] font-medium text-teal-300">
                          <span
                            className="size-1.5 rounded-full bg-teal-300"
                            aria-hidden
                          />
                          {project.status}
                        </span>
                      ) : null}
                    </div>

                    {project.description ? (
                      <p className="mb-2.5 text-sm leading-[1.55] text-white/65">
                        {project.description}
                      </p>
                    ) : null}

                    <p className="text-[13px] text-white/45">{project.type}</p>
                    {project.role ? (
                      <p className="mt-0.5 text-[13px] text-white/45">
                        {project.role}
                      </p>
                    ) : null}

                    <ul className="mt-3.5 flex flex-wrap gap-[7px]">
                      {project.tags.map((tag) => (
                        <li
                          key={tag}
                          className="rounded-md bg-teal-300/10 px-2.25 py-1 font-mono text-[10.5px] text-teal-300"
                        >
                          {tag}
                        </li>
                      ))}
                    </ul>

                    {project.features?.length ? (
                      <ul className="mt-4 space-y-1.5">
                        {project.features.map((feature) => (
                          <li
                            key={feature}
                            className="flex gap-2 text-[13px] leading-[1.5] text-white/60"
                          >
                            <span
                              className="mt-[7px] size-1 shrink-0 rounded-full bg-teal-300"
                              aria-hidden
                            />
                            {feature}
                          </li>
                        ))}
                      </ul>
                    ) : null}

                    {project.href || project.caseStudyHref ? (
                      <div className="mt-auto flex flex-wrap gap-2.5 pt-5">
                        {project.href ? (
                          <Button href={project.href} target="_blank" size="sm">
                            {UI.portfolio.liveSite}
                          </Button>
                        ) : null}
                        {project.caseStudyHref ? (
                          <Button
                            href={project.caseStudyHref}
                            variant="ghost"
                            size="sm"
                            className="border-white/20"
                          >
                            {UI.portfolio.caseStudy}
                          </Button>
                        ) : null}
                      </div>
                    ) : null}
                  </div>
                </article>
              </Reveal>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
