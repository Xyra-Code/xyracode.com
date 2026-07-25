import { ArrowRight } from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { CARD_ART } from "@/components/content/ArticleArt";
import { renderInline } from "@/components/content/InlineText";
import { Footer } from "@/components/sections/Footer";
import { Navbar } from "@/components/sections/Navbar";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Reveal } from "@/components/ui/Reveal";
import { BLOG_INTRO, BLOG_POSTS, BLOG_SEO } from "@/lib/content";
import { breadcrumbLd } from "@/lib/jsonld";
import { SEO } from "@/lib/seo";

export const metadata: Metadata = {
  title: { absolute: BLOG_SEO.title },
  description: BLOG_SEO.description,
  alternates: { canonical: "/blog" },
  openGraph: {
    url: "/blog",
    title: BLOG_SEO.title,
    description: BLOG_SEO.description,
  },
};

const SITE_URL = SEO.siteUrl;

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "CollectionPage",
      "@id": `${SITE_URL}/blog#collection`,
      name: "Blog",
      url: `${SITE_URL}/blog`,
      isPartOf: { "@id": `${SITE_URL}/#website` },
      about: { "@id": `${SITE_URL}/#organization` },
    },
    breadcrumbLd("/blog", [{ name: "Blog", path: "/blog" }]),
  ],
};

// "Slots disponibles" con barra de progreso, igual que en /proyectos:
// ilustran que la grilla crece. Voz de la agencia (aria-hidden).
const GROWTH_SLOTS = [
  {
    label: "Próximo artículo",
    caption: "Ya lo estamos escribiendo; queda poco para publicarlo.",
  },
  {
    label: "En borrador",
    caption: "Guardamos este lugar para la siguiente guía.",
  },
  {
    label: "Tu duda acá",
    caption: "Escríbenos qué quieres entender y lo convertimos en artículo.",
  },
];

/**
 * Portada del artículo. Si el post aún no tiene imagen, se pinta una card de
 * marca en vez de un degradado vacío: mismo lenguaje que las imágenes Open
 * Graph (tinta + glows, marco de línea fina, marca XC al sangre) y, como
 * contenido, la identidad del propio artículo — su archivo y su fecha.
 */
function Cover({
  post,
  featured = false,
}: {
  post: (typeof BLOG_POSTS)[number];
  featured?: boolean;
}) {
  if (post.cover) {
    return (
      <Image
        src={post.cover.src}
        alt={post.cover.alt}
        fill
        sizes={
          featured
            ? "(min-width: 768px) 50vw, 100vw"
            : "(min-width: 768px) 33vw, 100vw"
        }
        className="object-cover"
      />
    );
  }
  const Art = CARD_ART[post.slug];
  if (Art && featured) {
    return <Art />;
  }
  return (
    <div aria-hidden className="xc-doc-cover absolute inset-0 overflow-hidden">
      {/* Marca de agua XC sangrando por la esquina inferior derecha */}
      <Image
        src="/assets/brand/variants/xc-teal-mark-white.png"
        alt=""
        width={560}
        height={560}
        className={`pointer-events-none absolute select-none opacity-[0.07] ${
          featured ? "-right-16 -bottom-20 w-72" : "-right-10 -bottom-12 w-44"
        }`}
      />
      {/* Marco técnico de línea fina */}
      <div
        className={`absolute rounded-[12px] border border-[rgba(94,234,212,0.14)] ${
          featured ? "inset-6" : "inset-4"
        }`}
      />
      <div
        className={`absolute inset-0 flex flex-col justify-between ${
          featured ? "p-10" : "p-6"
        }`}
      >
        {/* Barra de acento + nombre del archivo del artículo */}
        <div className="flex items-stretch gap-3">
          <span
            className={`shrink-0 rounded-full bg-teal-300 ${
              featured ? "w-1.5" : "w-1"
            }`}
          />
          <p
            className={`min-w-0 font-mono leading-[1.5] text-[rgba(226,247,242,0.9)] ${
              featured ? "text-[16px]" : "text-[12px]"
            }`}
          >
            {post.slug}.md
          </p>
        </div>
        <p
          className={`font-mono text-[rgba(226,247,242,0.45)] ${
            featured ? "text-[13px]" : "text-[11px]"
          }`}
        >
          {post.publishedLabel}
        </p>
      </div>
    </div>
  );
}

export default function BlogIndex() {
  const [featured, ...rest] = BLOG_POSTS;

  return (
    <>
      <Navbar />
      <main className="bg-night text-white">
        <section
          aria-labelledby="blog-title"
          className="px-6 pt-[72px] pb-14 md:px-16"
        >
          <Reveal className="mx-auto flex max-w-300 flex-col gap-4">
            <Eyebrow as="p" className="text-teal-300">
              Blog
            </Eyebrow>
            <h1
              id="blog-title"
              className="text-[40px] leading-[1.05] font-extrabold tracking-[-0.03em] md:text-[52px]"
            >
              Guías para decidir mejor
            </h1>
            <p className="max-w-160 text-[19px] leading-[1.6] text-[rgba(226,247,242,0.72)]">
              {BLOG_SEO.description}
            </p>
            <div className="mt-2 flex max-w-160 flex-col gap-4">
              {BLOG_INTRO.paragraphs.map((paragraph, i) => (
                <p
                  key={i}
                  className="text-[16px] leading-[1.7] text-[rgba(226,247,242,0.6)] [&_a]:text-teal-300 [&_a]:underline [&_a]:underline-offset-4 [&_a:hover]:text-teal-200"
                >
                  {renderInline(paragraph)}
                </p>
              ))}
            </div>
          </Reveal>
        </section>

        {/* Destacado */}
        {featured && (
          <section aria-label="Artículo destacado" className="px-6 pb-14 md:px-16">
            <Reveal className="mx-auto max-w-300">
              <Link
                href={`/blog/${featured.slug}`}
                className="group grid overflow-hidden rounded-[20px] border border-[rgba(94,234,212,0.15)] bg-white/3 transition-colors hover:border-[rgba(94,234,212,0.4)] md:grid-cols-2"
              >
                <div className="relative aspect-16/10 md:order-2 md:h-full">
                  <Cover post={featured} featured />
                </div>
                <div className="flex flex-col gap-3 p-8 md:order-1 md:p-10">
                  <p className="font-mono text-[13px] text-teal-300">
                    {featured.category} · {featured.readingTime}
                  </p>
                  <h2 className="text-[28px] font-extrabold tracking-[-0.02em]">
                    {featured.title}
                  </h2>
                  <p className="text-[16px] leading-[1.7] text-[rgba(226,247,242,0.65)]">
                    {featured.excerpt}
                  </p>
                  <span className="mt-auto inline-flex items-center gap-1.5 pt-2 font-mono text-[13px] text-teal-300">
                    Leer artículo{" "}
                    <ArrowRight
                      size={16}
                      aria-hidden
                      className="transition-transform group-hover:translate-x-1"
                    />
                  </span>
                </div>
              </Link>
            </Reveal>
          </section>
        )}

        {/* Grid + slots */}
        <section aria-label="Más artículos" className="px-6 pb-24 md:px-16">
          <div className="mx-auto grid max-w-300 gap-6 md:grid-cols-3">
            {rest.map((post, i) => (
              <Reveal key={post.slug} delay={i * 80} className="h-full">
                <Link
                  href={`/blog/${post.slug}`}
                  className="group flex h-full flex-col overflow-hidden rounded-[16px] border border-[rgba(94,234,212,0.15)] bg-white/3 transition-colors hover:border-[rgba(94,234,212,0.4)]"
                >
                  <div className="relative aspect-16/9">
                    <Cover post={post} />
                  </div>
                  <div className="flex flex-1 flex-col gap-2 p-6">
                    <p className="font-mono text-[12px] text-teal-300">
                      {post.category}
                    </p>
                    <h2 className="text-[18px] font-extrabold tracking-[-0.02em]">
                      {post.title}
                    </h2>
                    {/* Pie: tiempo de lectura a la izquierda, entrada al artículo a la derecha */}
                    <div className="mt-auto flex items-center justify-between gap-3 pt-4">
                      <span className="font-mono text-[12px] text-[rgba(226,247,242,0.45)]">
                        {post.readingTime}
                      </span>
                      <span className="inline-flex items-center gap-1.5 font-mono text-[12px] text-teal-300">
                        Leer
                        <span className="inline-flex size-7 items-center justify-center rounded-full border border-[rgba(94,234,212,0.3)] transition duration-300 ease-out group-hover:border-teal-300 group-hover:bg-teal-300/12">
                          <ArrowRight
                            size={14}
                            aria-hidden
                            className="transition-transform duration-300 ease-out group-hover:translate-x-0.5"
                          />
                        </span>
                      </span>
                    </div>
                  </div>
                </Link>
              </Reveal>
            ))}

            {/* Slots atenuados: comunican que el blog crece (no son contenido real). */}
            {GROWTH_SLOTS.map((slot, i) => (
              <Reveal
                key={`slot-${i}`}
                delay={(rest.length + i) * 80}
                className="h-full"
              >
                <div
                  aria-hidden
                  className="group relative flex h-full min-h-64 flex-col justify-end overflow-hidden rounded-[16px] border border-dashed border-[rgba(94,234,212,0.22)] bg-white/2 p-6 transition duration-300 ease-out hover:-translate-y-1 hover:border-[rgba(94,234,212,0.5)] hover:bg-white/4"
                >
                  {/* Etiqueta de estado arriba */}
                  <span className="mb-auto font-mono text-[12px] tracking-wide text-teal-300">
                    {"// en camino"}
                  </span>
                  {/* Título + copy */}
                  <h2 className="mb-2 text-[19px] font-extrabold tracking-[-0.02em]">
                    {slot.label}
                  </h2>
                  <p className="mb-4 text-[13px] leading-[1.6] text-[rgba(226,247,242,0.5)]">
                    {slot.caption}
                  </p>
                  {/* Barra "cargando" indeterminada */}
                  <div className="xc-prog-track">
                    <div
                      className="xc-prog-fill"
                      style={{ animationDelay: `${i * -0.55}s` }}
                    />
                  </div>
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
