import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { HERO_ART } from "@/components/content/ArticleArt";
import { ArticleBody } from "@/components/content/ArticleBody";
import { Footer } from "@/components/sections/Footer";
import { Navbar } from "@/components/sections/Navbar";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Reveal } from "@/components/ui/Reveal";
import { SiteChrome } from "@/components/sections/SiteChrome";
import { BLOG_POSTS, FOUNDER } from "@/lib/content";
import { breadcrumbLd, faqLd } from "@/lib/jsonld";
import { SEO } from "@/lib/seo";

export const dynamicParams = false;

export function generateStaticParams() {
  return BLOG_POSTS.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = BLOG_POSTS.find((p) => p.slug === slug);
  if (!post) return {};
  const path = `/blog/${post.slug}`;
  return {
    title: { absolute: post.seo.title },
    description: post.seo.description,
    alternates: { canonical: path },
    openGraph: {
      type: "article",
      url: path,
      title: post.seo.title,
      description: post.seo.description,
      publishedTime: post.publishedISO,
      modifiedTime: post.lastModified,
      authors: [`${SITE_URL}/nosotros`],
    },
  };
}

const SITE_URL = SEO.siteUrl;

/** Arte de portada del artículo; fondo de marca si aún no tiene uno propio. */
function HeroArt({ post }: { post: (typeof BLOG_POSTS)[number] }) {
  const Art = HERO_ART[post.slug];
  if (Art) return <Art />;
  return (
    <div
      aria-hidden
      className="xc-doc-cover absolute inset-0 overflow-hidden"
    />
  );
}

export default async function ArticuloPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = BLOG_POSTS.find((p) => p.slug === slug);
  if (!post) notFound();

  const path = `/blog/${post.slug}`;

  // La FAQ se deriva del cuerpo; los artículos sin sección de preguntas
  // devuelven null y el @graph queda igual que antes.
  const faq = faqLd(path, post.body);

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BlogPosting",
        "@id": `${SITE_URL}${path}#article`,
        headline: post.title,
        description: post.seo.description,
        url: `${SITE_URL}${path}`,
        mainEntityOfPage: `${SITE_URL}${path}`,
        datePublished: post.publishedISO,
        dateModified: post.lastModified,
        inLanguage: SEO.localeBcp47,
        author: { "@id": `${SITE_URL}/nosotros#person` },
        publisher: { "@id": `${SITE_URL}/#organization` },
        // `image` es campo recomendado para el resultado enriquecido de
        // artículo. Si el post aún no tiene portada propia, cae en la imagen
        // Open Graph que esta misma ruta ya genera (1200x630, siempre 200).
        image: post.cover
          ? `${SITE_URL}${post.cover.src}`
          : `${SITE_URL}${path}/opengraph-image`,
      },
      // El `author` de arriba referencia un @id que vive en /nosotros. Sin este
      // nodo, la referencia quedaba colgando dentro del documento y Google
      // tenía que resolverla contra otra página. La autoría es señal E-E-A-T.
      {
        "@type": "Person",
        "@id": `${SITE_URL}/nosotros#person`,
        name: FOUNDER.name,
        url: `${SITE_URL}/nosotros`,
      },
      breadcrumbLd(path, [
        { name: "Blog", path: "/blog" },
        { name: post.title, path },
      ]),
      ...(faq ? [faq] : []),
    ],
  };

  return (
    <>
      <Navbar />
      <main className="bg-night text-white">
        {/* Cabecera */}
        <section
          aria-labelledby="articulo-title"
          className="relative overflow-hidden px-6 pt-[72px] pb-10 md:px-16"
        >
          <div
            aria-hidden
            className="absolute -top-40 left-1/2 h-[520px] w-[520px] -translate-x-1/2 rounded-full bg-brand-primary opacity-25 blur-[140px]"
          />
          <Reveal className="relative mx-auto flex max-w-[760px] flex-col items-center gap-5 text-center">
            <Breadcrumb
              items={[
                { label: "Inicio", href: "/" },
                { label: "Blog", href: "/blog" },
                { label: post.title },
              ]}
            />
            <p className="font-mono text-[13px] text-[rgba(226,247,242,0.5)]">
              {post.category} · {post.readingTime} · {post.publishedLabel}
            </p>
            <h1
              id="articulo-title"
              className="text-[34px] leading-[1.08] font-extrabold tracking-[-0.03em] md:text-[52px]"
            >
              {post.title}
            </h1>
            <p className="text-[19px] leading-[1.6] text-[rgba(226,247,242,0.72)]">
              {post.excerpt}
            </p>
          </Reveal>
        </section>

        {/* Portada: foto si la hay; si no, el arte del artículo (ArticleArt).
            En móvil el 16:8 deja el arte sin aire, por eso sube a 4:3. */}
        <section aria-label="Portada del artículo" className="px-6 pb-14 md:px-16">
          <Reveal className="mx-auto max-w-[900px]">
            <div className="relative aspect-4/3 overflow-hidden rounded-[20px] border border-[rgba(94,234,212,0.15)] sm:aspect-16/8">
              {post.cover ? (
                <Image
                  src={post.cover.src}
                  alt={post.cover.alt}
                  fill
                  sizes="(min-width: 900px) 900px, 100vw"
                  className="object-cover"
                  priority
                />
              ) : (
                <HeroArt post={post} />
              )}
            </div>
          </Reveal>
        </section>

        {/* Cuerpo ~720px */}
        <section aria-label="Contenido del artículo" className="px-6 pb-16 md:px-16">
          <Reveal>
            <ArticleBody blocks={post.body} className="mx-auto max-w-[720px]" />
          </Reveal>
        </section>

        {/* Bio de autor */}
        <section aria-label="Sobre el autor" className="px-6 pb-24 md:px-16">
          <div className="mx-auto max-w-[720px]">
            <div className="flex items-center gap-5 rounded-[20px] border border-[rgba(94,234,212,0.15)] bg-brand-ink p-7">
              {FOUNDER.photo && (
                <Image
                  src={FOUNDER.photo}
                  alt={FOUNDER.name}
                  width={72}
                  height={72}
                  className="h-[72px] w-[72px] shrink-0 rounded-full border-2 border-[rgba(94,234,212,0.4)] object-cover"
                />
              )}
              <div className="flex flex-col gap-1">
                <Eyebrow as="p" className="text-teal-300">
                  Escrito por
                </Eyebrow>
                <p className="text-[18px] font-extrabold tracking-[-0.02em]">
                  {FOUNDER.name}
                </p>
                <p className="text-[14px] leading-[1.6] text-[rgba(226,247,242,0.6)]">
                  {FOUNDER.jobTitle}
                </p>
              </div>
            </div>
          </div>
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
