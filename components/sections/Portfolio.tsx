import Link from "next/link";
import { ProjectCarousel } from "@/components/sections/ProjectCarousel";
import { Button } from "@/components/ui/Button";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Reveal } from "@/components/ui/Reveal";
import { PROJECTS } from "@/lib/content";

export function Portfolio() {
  return (
    <section
      id="portfolio"
      aria-labelledby="portfolio-title"
      className="bg-night px-5 py-22 text-white sm:px-10"
    >
      <div className="mx-auto max-w-300">
        <Reveal>
          <div className="mb-11 flex flex-wrap items-end justify-between gap-4">
            <div>
              <Eyebrow as="p" className="mb-3.5 text-teal-300">
                Trabajos recientes
              </Eyebrow>
              <h2
                id="portfolio-title"
                className="text-[32px] font-extrabold tracking-[-0.03em] md:text-[40px]"
              >
                Portfolio
              </h2>
            </div>
            <Link
              href="#contacto"
              className="text-[11px] font-extrabold uppercase tracking-[0.2em] text-white/60 transition-colors duration-200 hover:text-teal-300 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-teal-300"
            >
              Ver todos →
            </Link>
          </div>
        </Reveal>

        <ul className="grid gap-5 md:grid-cols-3 md:items-start">
          {PROJECTS.map((project, i) => (
            <li key={project.title}>
              <Reveal delay={i * 60} className="h-full">
                <article className="flex h-full flex-col overflow-hidden rounded-2xl border border-white/8 bg-white/3 transition-all duration-[220ms] ease-out hover:-translate-y-[3px]">
                  {project.images?.length ? (
                    <ProjectCarousel
                      images={project.images}
                      className="aspect-11/5"
                    />
                  ) : (
                    <div
                      className={`flex aspect-11/5 items-center justify-center ${project.bg}`}
                    >
                      <project.icon
                        size={38}
                        className="text-white/90"
                        aria-hidden
                      />
                    </div>
                  )}

                  <div className="flex flex-1 flex-col px-5 py-5">
                    <div className="mb-1.5 flex items-start justify-between gap-3">
                      <h3 className="text-base font-bold">{project.title}</h3>
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
                      <p className="mb-2.5 text-[13px] leading-[1.5] text-white/65">
                        {project.description}
                      </p>
                    ) : null}

                    <p className="text-[12px] text-white/45">{project.type}</p>
                    {project.role ? (
                      <p className="mt-0.5 text-[12px] text-white/45">
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
                            className="flex gap-2 text-[12px] leading-[1.45] text-white/60"
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
                            Ver sitio
                          </Button>
                        ) : null}
                        {project.caseStudyHref ? (
                          <Button
                            href={project.caseStudyHref}
                            variant="ghost"
                            size="sm"
                            className="border-white/20"
                          >
                            Caso de estudio
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
