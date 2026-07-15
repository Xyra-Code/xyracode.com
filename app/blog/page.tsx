import { ArrowRight } from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Footer } from "@/components/sections/Footer";
import { Navbar } from "@/components/sections/Navbar";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Reveal } from "@/components/ui/Reveal";
import { BLOG_POSTS, BLOG_SEO } from "@/lib/content";
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

const GROWTH_SLOTS = 2;

function Cover({
  post,
}: {
  post: (typeof BLOG_POSTS)[number];
}) {
  if (post.cover) {
    return (
      <Image
        src={post.cover.src}
        alt={post.cover.alt}
        fill
        sizes="(min-width: 768px) 50vw, 100vw"
        className="object-cover"
      />
    );
  }
  return (
    <div
      aria-hidden
      className="h-full w-full bg-[linear-gradient(150deg,#0F766E,#0B1F1C)]"
    />
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
                  <Cover post={featured} />
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
                  className="flex h-full flex-col overflow-hidden rounded-[16px] border border-[rgba(94,234,212,0.15)] bg-white/3"
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
                  </div>
                </Link>
              </Reveal>
            ))}

            {Array.from({ length: GROWTH_SLOTS }).map((_, i) => (
              <Reveal
                key={`slot-${i}`}
                delay={(rest.length + i) * 80}
                className="h-full"
              >
                <div
                  aria-hidden
                  className="flex h-full min-h-56 items-center justify-center rounded-[16px] border border-dashed border-[rgba(94,234,212,0.2)] bg-white/2 font-mono text-[13px] text-[rgba(226,247,242,0.4)]"
                >
                  Próximo artículo
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
