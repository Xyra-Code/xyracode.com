import { ArrowRight } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArticleBody } from "@/components/content/ArticleBody";
import { Footer } from "@/components/sections/Footer";
import { Navbar } from "@/components/sections/Navbar";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { Button } from "@/components/ui/Button";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Reveal } from "@/components/ui/Reveal";
import { SiteChrome } from "@/components/sections/SiteChrome";
import { SERVICE_PAGES, type ServicePage } from "@/lib/content";
import { breadcrumbLd, faqLd } from "@/lib/jsonld";
import { SEO } from "@/lib/seo";

// Solo los slugs listados existen; cualquier otro devuelve 404.
export const dynamicParams = false;

export function generateStaticParams() {
  return SERVICE_PAGES.map((page) => ({ slug: page.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const page = SERVICE_PAGES.find((p) => p.slug === slug);
  if (!page) return {};
  const path = `/servicios/${page.slug}`;
  return {
    title: { absolute: page.seo.title },
    description: page.seo.description,
    alternates: { canonical: path },
    openGraph: {
      url: path,
      title: page.seo.title,
      description: page.seo.description,
    },
  };
}

const SITE_URL = SEO.siteUrl;

export default async function ServicioPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const page = SERVICE_PAGES.find((p) => p.slug === slug);
  if (!page) notFound();

  const path = `/servicios/${page.slug}`;
  const related = page.related
    .map((slug) => SERVICE_PAGES.find((p) => p.slug === slug))
    .filter((p): p is ServicePage => Boolean(p));

  // La FAQ se deriva del cuerpo; las páginas sin sección de preguntas
  // devuelven null y el @graph queda igual que antes.
  const faq = faqLd(path, page.body);

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Service",
        "@id": `${SITE_URL}${path}#service`,
        name: page.hero.h1,
        ...(page.serviceType ? { serviceType: page.serviceType } : {}),
        description: page.seo.description,
        url: `${SITE_URL}${path}`,
        provider: { "@id": `${SITE_URL}/#organization` },
        areaServed: SEO.areaServed.map((area) => ({
          "@type": area.type,
          name: area.name,
        })),
        // Sin `price`: no publicamos cifras, y un Offer con precio inventado
        // es peor que no declarar ninguno.
        hasOfferCatalog: {
          "@type": "OfferCatalog",
          name: page.card.title,
          itemListElement: page.features.map((feature) => ({
            "@type": "Offer",
            itemOffered: {
              "@type": "Service",
              name: feature.title,
              description: feature.desc,
            },
          })),
        },
      },
      // La última miga usa card.title, no el h1: el h1 lleva los modificadores
      // de búsqueda y como miga quedaría larguísimo.
      breadcrumbLd(path, [
        { name: "Servicios", path: "/servicios" },
        { name: page.card.title, path },
      ]),
      ...(faq ? [faq] : []),
    ],
  };

  return (
    <>
      <Navbar />
      <main className="bg-night text-white">
        {/* Hero */}
        <section
          aria-labelledby="servicio-title"
          className="relative overflow-hidden px-6 pt-[72px] pb-20 md:px-16"
        >
          <div
            aria-hidden
            className="absolute -top-40 right-[8%] h-[560px] w-[560px] rounded-full bg-brand-primary opacity-30 blur-[130px]"
          />
          <Reveal className="relative mx-auto flex max-w-225 flex-col gap-6">
            <Breadcrumb
              items={[
                { label: "Inicio", href: "/" },
                { label: "Servicios", href: "/servicios" },
                { label: page.card.title },
              ]}
            />
            <Eyebrow as="p" className="text-teal-300">
              {page.hero.eyebrow}
            </Eyebrow>
            <h1
              id="servicio-title"
              className="max-w-205 text-[40px] leading-[1.02] font-extrabold tracking-[-0.03em] md:text-[56px]"
            >
              {page.hero.h1}
            </h1>
            <p className="max-w-160 text-[19px] leading-[1.6] text-[rgba(226,247,242,0.72)]">
              {page.hero.intro}
            </p>
            <div className="mt-2 flex flex-wrap gap-4">
              <Button href="/#contacto">
                Empezar proyecto <ArrowRight size={20} aria-hidden />
              </Button>
              <Button href="/#portfolio" variant="ghost" className="border-white/22">
                Ver proyectos
              </Button>
            </div>
          </Reveal>
        </section>

        {/* Lo esencial */}
        <section aria-labelledby="esencial-title" className="px-6 pb-22 md:px-16">
          <div className="mx-auto flex max-w-225 flex-col gap-10">
            <Reveal>
              <h2
                id="esencial-title"
                className="text-[32px] font-extrabold tracking-[-0.03em] md:text-[40px]"
              >
                Lo esencial
              </h2>
            </Reveal>
            <div className="grid gap-6 md:grid-cols-3">
              {page.features.map((feature, i) => (
                <Reveal key={feature.title} delay={i * 90} className="h-full">
                  <article className="flex h-full flex-col gap-3.5 rounded-[16px] border border-[rgba(94,234,212,0.15)] bg-white/3 p-7">
                    <span className="flex h-12 w-12 items-center justify-center rounded-[14px] bg-[rgba(94,234,212,0.12)] text-teal-300">
                      <feature.icon size={26} aria-hidden />
                    </span>
                    <h3 className="text-[18px] font-extrabold tracking-[-0.02em]">
                      {feature.title}
                    </h3>
                    <p className="text-[15px] leading-[1.7] text-[rgba(226,247,242,0.65)]">
                      {feature.desc}
                    </p>
                  </article>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* Cuerpo largo (SEO) */}
        <section aria-label="Detalle del servicio" className="px-6 pb-22 md:px-16">
          <Reveal>
            <ArticleBody blocks={page.body} className="mx-auto max-w-180" />
          </Reveal>
        </section>

        {/* Otros servicios: cross-linking entre hermanas. Antes esta página
            solo enlazaba a la home, así que todo el link equity salía del
            cluster de servicios en vez de repartirse dentro. */}
        {related.length > 0 && (
          <section aria-labelledby="related-title" className="px-6 pb-22 md:px-16">
            <div className="mx-auto flex max-w-225 flex-col gap-8">
              <Reveal>
                <h2
                  id="related-title"
                  className="text-[26px] font-extrabold tracking-[-0.03em] md:text-[32px]"
                >
                  Otros servicios
                </h2>
              </Reveal>
              <div className="grid gap-5 md:grid-cols-3">
                {related.map((other, i) => (
                  <Reveal key={other.slug} delay={i * 90} className="h-full">
                    <Link
                      href={`/servicios/${other.slug}`}
                      className="group flex h-full flex-col gap-2.5 rounded-[16px] border border-[rgba(94,234,212,0.15)] bg-white/3 p-6 transition-colors hover:border-[rgba(94,234,212,0.4)]"
                    >
                      <h3 className="text-[18px] font-extrabold tracking-[-0.02em]">
                        {other.card.title}
                      </h3>
                      <p className="text-[15px] leading-[1.65] text-[rgba(226,247,242,0.65)]">
                        {other.card.summary}
                      </p>
                    </Link>
                  </Reveal>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* CTA */}
        <section
          aria-labelledby="servicio-cta-title"
          className="relative overflow-hidden bg-brand-ink px-6 py-24 text-center md:px-16"
        >
          <div
            aria-hidden
            className="absolute top-1/2 left-1/2 h-[560px] w-[560px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand-primary opacity-25 blur-[140px]"
          />
          <Reveal className="relative mx-auto flex max-w-160 flex-col items-center gap-5">
            <h2
              id="servicio-cta-title"
              className="text-[30px] font-extrabold tracking-[-0.03em] md:text-[38px]"
            >
              {page.cta.title}
            </h2>
            <p className="text-[17px] leading-[1.6] text-[rgba(226,247,242,0.7)]">
              {page.cta.subtitle}
            </p>
            <Button href="/#contacto" className="mt-2">
              Hablemos de tu proyecto <ArrowRight size={20} aria-hidden />
            </Button>
          </Reveal>
        </section>
      </main>
      <Footer />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <SiteChrome />
    </>
  );
}
