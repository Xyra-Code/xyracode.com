import { ArrowRight } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { ArticleBody } from "@/components/content/ArticleBody";
import { Footer } from "@/components/sections/Footer";
import { Navbar } from "@/components/sections/Navbar";
import { Button } from "@/components/ui/Button";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Reveal } from "@/components/ui/Reveal";
import { SERVICE_HUB, SERVICE_PAGES } from "@/lib/content";
import { breadcrumbLd, itemListLd } from "@/lib/jsonld";
import { SEO } from "@/lib/seo";

export const metadata: Metadata = {
  title: { absolute: SERVICE_HUB.seo.title },
  description: SERVICE_HUB.seo.description,
  alternates: { canonical: "/servicios" },
  openGraph: {
    url: "/servicios",
    title: SERVICE_HUB.seo.title,
    description: SERVICE_HUB.seo.description,
  },
};

const SITE_URL = SEO.siteUrl;

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "CollectionPage",
      "@id": `${SITE_URL}/servicios#collection`,
      name: SERVICE_HUB.hero.h1,
      description: SERVICE_HUB.seo.description,
      url: `${SITE_URL}/servicios`,
      isPartOf: { "@id": `${SITE_URL}/#website` },
      about: { "@id": `${SITE_URL}/#organization` },
      mainEntity: itemListLd(
        SERVICE_PAGES.map((page) => ({
          name: page.card.title,
          path: `/servicios/${page.slug}`,
        })),
      ),
    },
    breadcrumbLd("/servicios", [{ name: "Servicios", path: "/servicios" }]),
  ],
};

export default function ServiciosHub() {
  return (
    <>
      <Navbar />
      <main className="bg-night text-white">
        <section
          aria-labelledby="servicios-title"
          className="relative overflow-hidden px-6 pt-[72px] pb-16 text-center md:px-16"
        >
          <div
            aria-hidden
            className="absolute -top-40 left-1/2 h-[560px] w-[560px] -translate-x-1/2 rounded-full bg-brand-primary opacity-30 blur-[140px]"
          />
          <Reveal className="relative mx-auto flex max-w-205 flex-col items-center gap-5">
            <Eyebrow as="p" className="text-teal-300">
              {SERVICE_HUB.hero.eyebrow}
            </Eyebrow>
            <h1
              id="servicios-title"
              className="text-[40px] leading-[1.05] font-extrabold tracking-[-0.03em] md:text-[52px]"
            >
              {SERVICE_HUB.hero.h1}
            </h1>
            <p className="max-w-150 text-[19px] leading-[1.6] text-[rgba(226,247,242,0.72)]">
              {SERVICE_HUB.hero.intro}
            </p>
          </Reveal>
        </section>

        <section aria-label="Lista de servicios" className="px-6 pb-24 md:px-16">
          <div className="mx-auto grid max-w-225 gap-6 md:grid-cols-2">
            {SERVICE_PAGES.map((page, i) => {
              const Icon = page.features[0]?.icon;
              return (
                <Reveal key={page.slug} delay={i * 90} className="h-full">
                  <Link
                    href={`/servicios/${page.slug}`}
                    className="group flex h-full flex-col gap-4 rounded-[20px] border border-[rgba(94,234,212,0.15)] bg-white/3 p-8 transition-colors hover:border-[rgba(94,234,212,0.4)]"
                  >
                    {Icon && (
                      <span className="flex h-14 w-14 items-center justify-center rounded-[16px] bg-[rgba(94,234,212,0.12)] text-teal-300">
                        <Icon size={30} aria-hidden />
                      </span>
                    )}
                    {/* El h2 es el anchor text del enlace: keyword limpia, no el h1 largo. */}
                    <h2 className="text-[24px] font-extrabold tracking-[-0.02em]">
                      {page.card.title}
                    </h2>
                    <p className="text-[16px] leading-[1.7] text-[rgba(226,247,242,0.65)]">
                      {page.card.summary}
                    </p>
                    <span className="mt-auto inline-flex items-center gap-1.5 pt-2 font-mono text-[13px] text-teal-300">
                      Ver servicio{" "}
                      <ArrowRight
                        size={16}
                        aria-hidden
                        className="transition-transform group-hover:translate-x-1"
                      />
                    </span>
                  </Link>
                </Reveal>
              );
            })}
          </div>
        </section>

        {/* Cuerpo comparativo: lo que convierte el hub en una página propia
            y no en un índice de enlaces que Google descarta por thin content. */}
        <section aria-label="Cómo elegir tu servicio" className="px-6 pb-22 md:px-16">
          <Reveal>
            <ArticleBody blocks={SERVICE_HUB.body} className="mx-auto max-w-180" />
          </Reveal>
        </section>

        <section
          aria-labelledby="servicios-cta-title"
          className="relative overflow-hidden bg-brand-ink px-6 py-24 text-center md:px-16"
        >
          <div
            aria-hidden
            className="absolute top-1/2 left-1/2 h-[560px] w-[560px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand-primary opacity-25 blur-[140px]"
          />
          <Reveal className="relative mx-auto flex max-w-160 flex-col items-center gap-5">
            <h2
              id="servicios-cta-title"
              className="text-[30px] font-extrabold tracking-[-0.03em] md:text-[38px]"
            >
              {SERVICE_HUB.cta.title}
            </h2>
            <p className="text-[17px] leading-[1.6] text-[rgba(226,247,242,0.7)]">
              {SERVICE_HUB.cta.subtitle}
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
    </>
  );
}
