import { ArrowRight } from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Footer } from "@/components/sections/Footer";
import { Navbar } from "@/components/sections/Navbar";
import { Chip } from "@/components/ui/Chip";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Reveal } from "@/components/ui/Reveal";
import { PROJECTS } from "@/lib/content";
import { breadcrumbLd } from "@/lib/jsonld";
import { SEO } from "@/lib/seo";

const TITLE = "Proyectos y casos de estudio | XyraCode";
const DESCRIPTION =
  "Proyectos reales de desarrollo web y software a medida: plataformas, tiendas y web apps que llevamos del prototipo a producción.";

export const metadata: Metadata = {
  title: { absolute: TITLE },
  description: DESCRIPTION,
  alternates: { canonical: "/proyectos" },
  openGraph: { url: "/proyectos", title: TITLE, description: DESCRIPTION },
};

const SITE_URL = SEO.siteUrl;

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "CollectionPage",
      "@id": `${SITE_URL}/proyectos#collection`,
      name: "Proyectos",
      url: `${SITE_URL}/proyectos`,
      isPartOf: { "@id": `${SITE_URL}/#website` },
      about: { "@id": `${SITE_URL}/#organization` },
    },
    breadcrumbLd("/proyectos", [{ name: "Proyectos", path: "/proyectos" }]),
  ],
};

// Nº de "slots disponibles" atenuados para ilustrar que la grilla crece.
const GROWTH_SLOTS = 2;

export default function ProyectosIndex() {
  const [featured, ...rest] = PROJECTS;
  const featuredHref = featured?.caseStudyHref ?? featured?.href;

  return (
    <>
      <Navbar />
      <main className="bg-night text-white">
        <section
          aria-labelledby="proyectos-title"
          className="px-6 pt-[72px] pb-14 md:px-16"
        >
          <Reveal className="mx-auto flex max-w-300 flex-col gap-4">
            <Eyebrow as="p" className="text-teal-300">
              Proyectos
            </Eyebrow>
            <h1
              id="proyectos-title"
              className="text-[40px] leading-[1.05] font-extrabold tracking-[-0.03em] md:text-[52px]"
            >
              Trabajo real, en producción
            </h1>
            <p className="max-w-160 text-[19px] leading-[1.6] text-[rgba(226,247,242,0.72)]">
              {DESCRIPTION}
            </p>
          </Reveal>
        </section>

        {/* Destacado */}
        {featured && (
          <section aria-label="Proyecto destacado" className="px-6 pb-14 md:px-16">
            <Reveal className="mx-auto max-w-300">
              <article className="overflow-hidden rounded-[20px] border border-[rgba(94,234,212,0.15)] bg-white/3 md:grid md:grid-cols-2">
                <div className="relative aspect-16/10 md:order-2 md:h-full">
                  {featured.images?.[0] && (
                    <Image
                      src={featured.images[0]}
                      alt={`${featured.title} — ${featured.description ?? featured.type}`}
                      fill
                      sizes="(min-width: 768px) 50vw, 100vw"
                      className="object-cover"
                    />
                  )}
                </div>
                <div className="flex flex-col gap-4 p-8 md:order-1 md:p-10">
                  <ul className="flex flex-wrap gap-2">
                    {featured.tags.map((tag) => (
                      <li key={tag}>
                        <Chip>{tag}</Chip>
                      </li>
                    ))}
                  </ul>
                  <h2 className="text-[30px] font-extrabold tracking-[-0.02em]">
                    {featured.title}
                  </h2>
                  <p className="text-[16px] leading-[1.7] text-[rgba(226,247,242,0.65)]">
                    {featured.description ?? featured.type}
                  </p>
                  {featuredHref && (
                    <Link
                      href={featuredHref}
                      className="mt-auto inline-flex items-center gap-1.5 pt-2 font-mono text-[13px] text-teal-300 hover:text-teal-200"
                    >
                      {featured.caseStudyHref ? "Ver caso completo" : "Ver sitio"}{" "}
                      <ArrowRight size={16} aria-hidden />
                    </Link>
                  )}
                </div>
              </article>
            </Reveal>
          </section>
        )}

        {/* Grid + slots de crecimiento */}
        <section aria-label="Más proyectos" className="px-6 pb-24 md:px-16">
          <div className="mx-auto grid max-w-300 gap-6 md:grid-cols-3">
            {rest.map((project, i) => {
              const href = project.caseStudyHref ?? project.href;
              const card = (
                <article className="flex h-full flex-col gap-3.5 overflow-hidden rounded-[16px] border border-[rgba(94,234,212,0.15)] bg-white/3">
                  <div className="relative aspect-16/10">
                    {project.images?.[0] && (
                      <Image
                        src={project.images[0]}
                        alt={`${project.title} — ${project.description ?? project.type}`}
                        fill
                        sizes="(min-width: 768px) 33vw, 100vw"
                        className="object-cover"
                      />
                    )}
                  </div>
                  <div className="flex flex-1 flex-col gap-2 p-6">
                    <h2 className="text-[18px] font-extrabold tracking-[-0.02em]">
                      {project.title}
                    </h2>
                    <p className="text-[14px] leading-[1.6] text-[rgba(226,247,242,0.6)]">
                      {project.description ?? project.type}
                    </p>
                  </div>
                </article>
              );
              return (
                <Reveal key={project.title} delay={i * 80} className="h-full">
                  {href ? (
                    <Link href={href} className="block h-full">
                      {card}
                    </Link>
                  ) : (
                    card
                  )}
                </Reveal>
              );
            })}

            {/* Slots atenuados: comunican que el portafolio crece (no son contenido real). */}
            {Array.from({ length: GROWTH_SLOTS }).map((_, i) => (
              <Reveal key={`slot-${i}`} delay={(rest.length + i) * 80} className="h-full">
                <div
                  aria-hidden
                  className="flex h-full min-h-64 items-center justify-center rounded-[16px] border border-dashed border-[rgba(94,234,212,0.2)] bg-white/2 font-mono text-[13px] text-[rgba(226,247,242,0.4)]"
                >
                  Próximo proyecto
                </div>
              </Reveal>
            ))}
          </div>
        </section>
      </main>
      <Footer />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </>
  );
}
