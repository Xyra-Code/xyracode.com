import Link from "next/link";
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

        <ul className="grid gap-5 md:grid-cols-3">
          {PROJECTS.map((project, i) => {
            const card = (
              <article className="h-full overflow-hidden rounded-2xl border border-white/8 bg-white/3 transition-all duration-[220ms] ease-out hover:-translate-y-[3px]">
                <div
                  className={`flex h-[170px] items-center justify-center ${project.bg}`}
                >
                  <project.icon
                    size={38}
                    className="text-white/90"
                    aria-hidden
                  />
                </div>
                <div className="px-5 py-4.5">
                  <h3 className="mb-[5px] text-base font-bold">
                    {project.title}
                  </h3>
                  <p className="mb-3 text-[12.5px] text-white/50">
                    {project.type}
                  </p>
                  <ul className="flex flex-wrap gap-[7px]">
                    {project.tags.map((tag) => (
                      <li
                        key={tag}
                        className="rounded-md bg-teal-300/10 px-2.25 py-1 font-mono text-[10.5px] text-teal-300"
                      >
                        {tag}
                      </li>
                    ))}
                  </ul>
                </div>
              </article>
            );

            return (
              <li key={project.title}>
                <Reveal delay={i * 60} className="h-full">
                  {project.href ? (
                    <a
                      href={project.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`Ver proyecto: ${project.title}`}
                      className="block h-full rounded-2xl focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-teal-300"
                    >
                      {card}
                    </a>
                  ) : (
                    card
                  )}
                </Reveal>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
