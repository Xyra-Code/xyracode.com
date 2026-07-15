import { ArrowUpRight } from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { ArticleBody } from "@/components/content/ArticleBody";
import { Footer } from "@/components/sections/Footer";
import { Navbar } from "@/components/sections/Navbar";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { Chip } from "@/components/ui/Chip";
import { Reveal } from "@/components/ui/Reveal";
import { CASE_STUDIES } from "@/lib/content";
import { breadcrumbLd } from "@/lib/jsonld";
import { SEO } from "@/lib/seo";

export const dynamicParams = false;

export function generateStaticParams() {
  return CASE_STUDIES.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const study = CASE_STUDIES.find((c) => c.slug === slug);
  if (!study) return {};
  const path = `/proyectos/${study.slug}`;
  return {
    title: { absolute: study.seo.title },
    description: study.seo.description,
    alternates: { canonical: path },
    openGraph: {
      url: path,
      title: study.seo.title,
      description: study.seo.description,
    },
  };
}

const SITE_URL = SEO.siteUrl;

export default async function CasoPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const study = CASE_STUDIES.find((c) => c.slug === slug);
  if (!study) notFound();

  // La portada ya no se muestra como banner; se incorpora al inicio de la
  // galería para que todas las capturas del proyecto se vean en un solo lugar.
  const galleryImages = [study.cover, ...study.gallery];

  const path = `/proyectos/${study.slug}`;
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "CreativeWork",
        "@id": `${SITE_URL}${path}#project`,
        name: study.hero.h1,
        description: study.seo.description,
        url: `${SITE_URL}${path}`,
        image: `${SITE_URL}${study.cover.src}`,
        datePublished: study.publishedISO,
        dateModified: study.lastModified,
        author: { "@id": `${SITE_URL}/nosotros#person` },
        publisher: { "@id": `${SITE_URL}/#organization` },
      },
      breadcrumbLd(path, [
        { name: "Proyectos", path: "/proyectos" },
        { name: study.hero.h1, path },
      ]),
    ],
  };

  return (
    <>
      <Navbar />
      <main className="bg-night text-white">
        {/* Hero */}
        <section
          aria-labelledby="caso-title"
          className="relative overflow-hidden px-6 pt-18 pb-12 md:px-16"
        >
          <div
            aria-hidden
            className="absolute -top-40 right-[8%] h-130 w-130 rounded-full bg-brand-primary opacity-25 blur-[130px]"
          />
          <Reveal className="relative mx-auto flex max-w-265 flex-col gap-6">
            <Breadcrumb
              items={[
                { label: "Inicio", href: "/" },
                { label: "Proyectos", href: "/proyectos" },
                { label: study.hero.h1 },
              ]}
            />
            <ul className="flex flex-wrap gap-2">
              {study.hero.tags.map((tag) => (
                <li key={tag}>
                  <Chip>{tag}</Chip>
                </li>
              ))}
            </ul>
            <h1
              id="caso-title"
              className="max-w-265 text-[36px] leading-[1.04] font-extrabold tracking-[-0.03em] md:text-[58px]"
            >
              {study.hero.h1}
            </h1>
            <p className="max-w-265 text-[19px] leading-[1.6] text-[rgba(226,247,242,0.72)]">
              {study.hero.intro}
            </p>
          </Reveal>
        </section>

        {/* Ficha lateral sticky + cuerpo */}
        <section aria-label="Detalle del caso" className="px-6 pb-20 md:px-16">
          <div className="mx-auto grid max-w-265 gap-10 md:grid-cols-[260px_1fr]">
            <aside className="md:sticky md:top-24 md:self-start">
              <dl className="flex flex-col gap-5 rounded-2xl border border-[rgba(94,234,212,0.15)] bg-white/3 p-6 font-mono text-[13px]">
                <div>
                  <dt className="text-[rgba(226,247,242,0.45)]">Cliente</dt>
                  <dd className="mt-1 text-white">{study.meta.cliente}</dd>
                </div>
                <div>
                  <dt className="text-[rgba(226,247,242,0.45)]">Año</dt>
                  <dd className="mt-1 text-white">{study.meta.año}</dd>
                </div>
                <div>
                  <dt className="text-[rgba(226,247,242,0.45)]">Stack</dt>
                  <dd className="mt-2 flex flex-wrap gap-2">
                    {study.meta.stack.map((tech) => (
                      <Chip key={tech}>{tech}</Chip>
                    ))}
                  </dd>
                </div>
                {study.meta.siteHref && (
                  <div>
                    <a
                      href={study.meta.siteHref}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-teal-300 hover:text-teal-200"
                    >
                      Visitar sitio <ArrowUpRight size={16} aria-hidden />
                    </a>
                  </div>
                )}
              </dl>
            </aside>
            <Reveal>
              <ArticleBody blocks={study.body} className="max-w-none" />
            </Reveal>
          </div>
        </section>

        {/* Resultado: 3 stats */}
        {study.results.length > 0 && (
          <section
            aria-labelledby="caso-resultado-title"
            className="bg-brand-ink px-6 py-20 md:px-16"
          >
            <div className="mx-auto max-w-265">
              <h2
                id="caso-resultado-title"
                className="mb-10 text-[28px] font-extrabold tracking-[-0.03em] md:text-[36px]"
              >
                Resultado
              </h2>
              <dl className="grid gap-8 sm:grid-cols-3">
                {study.results.map((result) => (
                  <div key={result.label} className="flex flex-col gap-2">
                    <dt className="order-2 text-[15px] leading-normal text-[rgba(226,247,242,0.6)]">
                      {result.label}
                    </dt>
                    <dd className="order-1 text-[44px] font-extrabold tracking-[-0.03em] text-teal-300 md:text-[52px]">
                      {result.value}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
          </section>
        )}

        {/* Galería */}
        {galleryImages.length > 0 && (
          <section aria-label="Galería del proyecto" className="px-6 py-20 md:px-16">
            <div className="mx-auto grid max-w-300 gap-6 md:grid-cols-2">
              {galleryImages.map((img, i) => {
                // Si la galería tiene un número impar de fotos, la última queda sola
                // en su fila: la centramos con el mismo ancho que las demás.
                const isLoneLast =
                  galleryImages.length % 2 === 1 &&
                  i === galleryImages.length - 1;
                return (
                <figure
                  key={img.src}
                  className={`flex flex-col gap-2${
                    isLoneLast ? " md:col-span-2 md:mx-auto md:w-[calc(50%-0.75rem)]" : ""
                  }`}
                >
                  <Image
                    src={img.src}
                    alt={img.alt}
                    width={img.width ?? 1600}
                    height={img.height ?? 1200}
                    sizes="(min-width: 768px) 50vw, 100vw"
                    className="h-auto w-full rounded-2xl border border-[rgba(94,234,212,0.15)]"
                  />
                  {img.caption && (
                    <figcaption className="text-center font-mono text-[12px] text-[rgba(226,247,242,0.5)]">
                      {img.caption}
                    </figcaption>
                  )}
                </figure>
                );
              })}
            </div>
          </section>
        )}
      </main>
      <Footer />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </>
  );
}
