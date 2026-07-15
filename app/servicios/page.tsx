import { ArrowRight } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { Footer } from "@/components/sections/Footer";
import { Navbar } from "@/components/sections/Navbar";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Reveal } from "@/components/ui/Reveal";
import { SERVICE_PAGES, SERVICE_PAGES_SEO } from "@/lib/content";
import { breadcrumbLd } from "@/lib/jsonld";
import { SEO } from "@/lib/seo";

export const metadata: Metadata = {
  title: { absolute: SERVICE_PAGES_SEO.title },
  description: SERVICE_PAGES_SEO.description,
  alternates: { canonical: "/servicios" },
  openGraph: {
    url: "/servicios",
    title: SERVICE_PAGES_SEO.title,
    description: SERVICE_PAGES_SEO.description,
  },
};

const SITE_URL = SEO.siteUrl;

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "CollectionPage",
      "@id": `${SITE_URL}/servicios#collection`,
      name: "Servicios",
      url: `${SITE_URL}/servicios`,
      isPartOf: { "@id": `${SITE_URL}/#website` },
      about: { "@id": `${SITE_URL}/#organization` },
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
              Servicios
            </Eyebrow>
            <h1
              id="servicios-title"
              className="text-[40px] leading-[1.05] font-extrabold tracking-[-0.03em] md:text-[52px]"
            >
              Servicios de desarrollo web y software a medida
            </h1>
            <p className="max-w-150 text-[19px] leading-[1.6] text-[rgba(226,247,242,0.72)]">
              Desarrollo web, apps a medida y e-commerce. Elige por dónde
              empezar; el resto lo resolvemos contigo.
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
                    <h2 className="text-[24px] font-extrabold tracking-[-0.02em]">
                      {page.hero.h1}
                    </h2>
                    <p className="text-[16px] leading-[1.7] text-[rgba(226,247,242,0.65)]">
                      {page.hero.intro}
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
      </main>
      <Footer />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </>
  );
}
