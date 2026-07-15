# Fase 2c — Blog (contenido SEO long-tail) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Publicar el índice `/blog` y los artículos `/blog/[slug]` (empezando por `cuanto-cuesta-una-web-colombia-2026`), con cuerpo largo de bloques, cabecera con metadatos, bio de autor, metadata propia, JSON-LD `BlogPosting` (author `#person`) + `BreadcrumbList` y entradas en el sitemap — captación long-tail.

**Architecture:** Reutiliza la fundación de las Fases 2a/2b (`ArticleBody` + `.prose-xyra`, `Breadcrumb`, `Chip`, helper `breadcrumbLd` de `@/lib/jsonld`). Tipo nuevo `BlogPost` en `lib/content/blog.ts` (self-contained, con `body: Block[]`). El autor se enlaza al `#person` de `/nosotros` (E-E-A-T). La portada raster es un **slot opcional**: si no existe aún, se renderiza un fondo de marca (el artículo es publicable solo con texto). Ancho de lectura ~720px (handoff §6).

**Tech Stack:** Next.js 16.2.10 (App Router, `params` es `Promise`), React 19.2.4, TypeScript 5 strict, Tailwind CSS v4, `next/image`, Vitest + @testing-library/react.

## Global Constraints

- **PRERREQUISITOS:**
  - **Fase 1 Task 3:** `@/lib/content/blocks` (`Block`) y `@/components/content/BlockRenderer`.
  - **Fase 2a:** `@/components/content/ArticleBody` + `.prose-xyra`, `@/components/ui/Breadcrumb`, y `app/sitemap.ts` en su forma dirigida por datos.
  - **Fase 2b:** `@/components/ui/Chip`. (Si 2b no se integró, crear `Chip` con el código de su Task 1 antes de empezar.)
  - Verificar: `ls components/content/ArticleBody.tsx components/ui/Breadcrumb.tsx components/ui/Chip.tsx lib/content/blocks.ts` y `npx tsc --noEmit` en verde.
- **JSON-LD:** `breadcrumbLd(pagePath, crumbs)` de `@/lib/jsonld` ("Inicio" se añade solo). Autor: `{ "@id": "${SEO.siteUrl}/nosotros#person" }`; publisher: `{ "@id": "${SEO.siteUrl}/#organization" }`.
- **Next.js 16.2.10 / React 19.2.4** — `params` es `Promise` (await). Leer `node_modules/next/dist/docs/` antes de tocar APIs de Next que no conozcas.
- **`lib/content/*` NO importa de `lib/seo.ts` ni de `lib/jsonld.ts`.** Las páginas (en `app/`) sí.
- **Reutilizar tokens y componentes existentes** (`bg-night`, `bg-brand-ink`, `bg-brand-primary`, `text-teal-300`, `Navbar`, `Footer`, `Reveal`, `ArticleBody`, `Breadcrumb`, `Chip`) y `FOUNDER` (de `@/lib/content`) para la bio del autor.
- **Un solo `<h1>` por página.**
- **Sin `new Date()`** en `lib/content/*` ni `sitemap.ts`. Las fechas son literales: `publishedISO` (ISO 8601, para JSON-LD) y `publishedLabel` (texto visible, p.ej. "13 de julio de 2026").
- **Contenido desde el borrador** `contenido/borradores/blog-cuanto-cuesta-una-web-colombia-2026.md` — está **completo** (~1.527 palabras) y publicable. Los precios se transcriben como "rangos estimados/de referencia" (así están redactados); no convertirlos en cotizaciones cerradas.
- **Verde tras cada tarea:** `npm test`, `npx tsc --noEmit`, `npm run lint`, `npm run build`.

---

### Task 1: Tipo `BlogPost` + datos (artículo transcrito)

**Files:**
- Create: `lib/content/blog.ts`
- Modify: `lib/content/index.ts` (barrel)

**Interfaces:**
- Consumes: `Block` de `./blocks`.
- Produces (vía barrel `@/lib/content`): tipo `BlogPost` y array `BLOG_POSTS: BlogPost[]` con el primer artículo.

- [ ] **Step 1: Crear el tipo y la entrada**

Create `lib/content/blog.ts`:
```ts
import type { Block } from "./blocks";

export type BlogPost = {
  slug: string;
  seo: { title: string; description: string };
  /** ISO 8601; alimenta sitemap y dateModified. */
  lastModified: string;
  /** Categoría (chip) — p.ej. "Guía". */
  category: string;
  /** Tiempo de lectura visible — p.ej. "~7 min". */
  readingTime: string;
  /** Fecha de publicación en ISO (JSON-LD datePublished). */
  publishedISO: string;
  /** Fecha de publicación visible — p.ej. "13 de julio de 2026". */
  publishedLabel: string;
  /** Título visible (H1), distinto del seo.title. */
  title: string;
  /** Bajada / resumen (1-2 frases). También usado como resumen en el índice. */
  excerpt: string;
  /** Portada raster (slot 4B). Opcional: si falta, se pinta un fondo de marca. */
  cover?: { src: string; alt: string };
  /** Cuerpo del artículo. */
  body: Block[];
};

export const BLOG_POSTS: BlogPost[] = [
  {
    slug: "cuanto-cuesta-una-web-colombia-2026",
    seo: {
      // TRANSCRIBIR seo_title/seo_description del bloque de metadatos del borrador.
      title: "¿Cuánto cuesta una página web en Colombia 2026? | XyraCode",
      description:
        "Precios de referencia para una página web en Colombia 2026: qué influye en el costo, rangos por tipo de proyecto y cómo elegir bien. Guía práctica.",
    },
    lastModified: "2026-07-13",
    category: "Guía",
    readingTime: "~7 min",
    publishedISO: "2026-07-13",
    publishedLabel: "13 de julio de 2026",
    title: "¿Cuánto cuesta una página web en Colombia en 2026?",
    excerpt:
      "Rangos de precios reales del mercado colombiano, qué factores mueven el costo y cómo evitar pagar de más (o de menos).",
    // cover: pendiente (slot raster 4B); dejar sin definir hasta tener la imagen.
    body: [
      // TRANSCRIBIR desde contenido/borradores/blog-cuanto-cuesta-una-web-colombia-2026.md
      // (## → h2, párrafos → p, listas → ul, citas → quote). El borrador está completo.
      { kind: "h2", text: "TRANSCRIBIR: primer encabezado del borrador" },
      { kind: "p", text: "TRANSCRIBIR: primer párrafo del borrador…" },
    ],
  },
];
```

- [ ] **Step 2: Transcribir el cuerpo real**

Convierte el markdown de `contenido/borradores/blog-cuanto-cuesta-una-web-colombia-2026.md` a `body: Block[]` (mismo mapeo que en 2a/2b) y copia `seo_title`/`seo_description`/`h1`/bajada del bloque de metadatos del borrador a los campos correspondientes. El artículo está completo: no debería quedar ningún marcador pendiente.

Run: `npx tsc --noEmit`
Expected: sin errores (cumple `BlogPost`).

- [ ] **Step 3: Re-exportar desde el barrel**

Modify `lib/content/index.ts` — añadir:
```ts
export * from "./blog";
```
Run: `npx tsc --noEmit`
Expected: sin errores; `@/lib/content` exporta `BLOG_POSTS`, `BlogPost`.

- [ ] **Step 4: Commit**

```bash
git add lib/content/blog.ts lib/content/index.ts
git commit -m "feat(content): tipo BlogPost + primer articulo (cuanto cuesta una web)"
```

---

### Task 2: Artículo `/blog/[slug]`

**Files:**
- Create: `app/blog/[slug]/page.tsx`

**Interfaces:**
- Consumes: `BLOG_POSTS`, `FOUNDER` de `@/lib/content`; `SEO` de `@/lib/seo`; `breadcrumbLd` de `@/lib/jsonld`; `ArticleBody`, `Breadcrumb`, `Chip`, `Navbar`, `Footer`, `Reveal`, `next/image`.
- Produces: una página estática por `slug` con `<h1>` único, cabecera + portada (o fondo de marca) + cuerpo ~720px + bio de autor, `generateMetadata`, `generateStaticParams`, `dynamicParams = false`, y JSON-LD `BlogPosting` (author `#person`, publisher `#organization`) + `BreadcrumbList`.

- [ ] **Step 1: Crear la página**

Create `app/blog/[slug]/page.tsx`:
```tsx
import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { ArticleBody } from "@/components/content/ArticleBody";
import { Footer } from "@/components/sections/Footer";
import { Navbar } from "@/components/sections/Navbar";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { Chip } from "@/components/ui/Chip";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Reveal } from "@/components/ui/Reveal";
import { BLOG_POSTS, FOUNDER } from "@/lib/content";
import { breadcrumbLd } from "@/lib/jsonld";
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
    },
  };
}

const SITE_URL = SEO.siteUrl;

export default async function ArticuloPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = BLOG_POSTS.find((p) => p.slug === slug);
  if (!post) notFound();

  const path = `/blog/${post.slug}`;
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
        ...(post.cover && { image: `${SITE_URL}${post.cover.src}` }),
      },
      breadcrumbLd(path, [
        { name: "Blog", path: "/blog" },
        { name: post.title, path },
      ]),
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

        {/* Portada 16:8 (o fondo de marca si el slot aún no tiene imagen) */}
        <section aria-label="Portada del artículo" className="px-6 pb-14 md:px-16">
          <Reveal className="mx-auto max-w-[900px]">
            <div className="relative aspect-16/8 overflow-hidden rounded-[20px] border border-[rgba(94,234,212,0.15)]">
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
                <div
                  aria-hidden
                  className="h-full w-full bg-[linear-gradient(150deg,#0F766E,#0B1F1C)]"
                />
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
                  className="h-18 w-18 shrink-0 rounded-full border-2 border-[rgba(94,234,212,0.4)] object-cover"
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
    </>
  );
}
```

> **Nota:** el `h-18 w-18` (72px) asume la escala por defecto de Tailwind (`4.5rem`). Si el proyecto no la tiene, usar `h-[72px] w-[72px]`. Verificar en el build/lint.

- [ ] **Step 2: Typecheck, lint y build; revisión**

Run:
```bash
npx tsc --noEmit
npm run lint
npm run build
```
Expected: verde; `/blog/cuanto-cuesta-una-web-colombia-2026` prerenderizada. `npm run dev` → revisar: un solo `<h1>`, cabecera con categoría·tiempo·fecha, portada (fondo de marca si no hay imagen), cuerpo `.prose-xyra` ~720px, bio de autor. Validar JSON-LD `BlogPosting` + `BreadcrumbList`.

- [ ] **Step 3: Commit**

```bash
git add app/blog/[slug]/page.tsx
git commit -m "feat(blog): pagina de articulo /blog/[slug] con JSON-LD BlogPosting"
```

---

### Task 3: Índice `/blog`

**Files:**
- Create: `app/blog/page.tsx`

**Interfaces:**
- Consumes: `BLOG_POSTS` de `@/lib/content`; `SEO` de `@/lib/seo`; `breadcrumbLd` de `@/lib/jsonld`; `Navbar`, `Footer`, `Eyebrow`, `Reveal`, `Chip`, `next/image`, `next/link`.
- Produces: la ruta estática `/blog` con `<h1>` propio, destacado + grid (con slots atenuados), `metadata` estático y JSON-LD `CollectionPage` + `BreadcrumbList`.

- [ ] **Step 1: Crear el índice**

Create `app/blog/page.tsx`:
```tsx
import { ArrowRight } from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Footer } from "@/components/sections/Footer";
import { Navbar } from "@/components/sections/Navbar";
import { Chip } from "@/components/ui/Chip";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Reveal } from "@/components/ui/Reveal";
import { BLOG_POSTS } from "@/lib/content";
import { breadcrumbLd } from "@/lib/jsonld";
import { SEO } from "@/lib/seo";

const TITLE = "Blog de desarrollo web y software | XyraCode";
const DESCRIPTION =
  "Guías y comparativas sobre desarrollo web, apps y e-commerce en Colombia: precios, tecnologías y decisiones que importan para tu proyecto.";

export const metadata: Metadata = {
  title: { absolute: TITLE },
  description: DESCRIPTION,
  alternates: { canonical: "/blog" },
  openGraph: { url: "/blog", title: TITLE, description: DESCRIPTION },
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
              {DESCRIPTION}
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
```

- [ ] **Step 2: Typecheck, lint y build; revisión**

Run:
```bash
npx tsc --noEmit
npm run lint
npm run build
```
Expected: verde; `/blog` prerenderizada. `npm run dev` → un solo `<h1>`, destacado enlazando al artículo, grid con slots atenuados, JSON-LD `CollectionPage`.

- [ ] **Step 3: Commit**

```bash
git add app/blog/page.tsx
git commit -m "feat(blog): indice /blog con destacado, grid y slots"
```

---

### Task 4: Open Graph por artículo

**Files:**
- Create: `app/blog/[slug]/opengraph-image.tsx`

**Interfaces:**
- Consumes: `BLOG_POSTS` de `@/lib/content`; el logo `public/assets/brand/logo-horizontal.png`.
- Produces: una imagen OG 1200×630 por artículo, con el título y la categoría·tiempo.

- [ ] **Step 1: Crear la OG dinámica**

Create `app/blog/[slug]/opengraph-image.tsx` (misma técnica que en 2a/2b):
```tsx
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { BLOG_POSTS } from "@/lib/content";
import { SEO } from "@/lib/seo";

export const alt = "Artículo del blog de XyraCode";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export function generateStaticParams() {
  return BLOG_POSTS.map((p) => ({ slug: p.slug }));
}

export default async function Image({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = BLOG_POSTS.find((p) => p.slug === slug);
  const logo = await readFile(
    join(process.cwd(), "public/assets/brand/logo-horizontal.png"),
    "base64",
  );
  const logoSrc = `data:image/png;base64,${logo}`;
  const title = post?.title ?? "Blog";
  const meta = post ? `${post.category} · ${post.readingTime}` : "Blog";

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "72px 80px",
          color: "#ffffff",
          backgroundColor: "#08110F",
          backgroundImage:
            "linear-gradient(155deg, #08110F 0%, #0d2b26 58%, #0F3D34 100%)",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: -140,
            right: -120,
            width: 460,
            height: 460,
            borderRadius: 460,
            background: "#10b981",
            opacity: 0.22,
            filter: "blur(120px)",
          }}
        />
        <img src={logoSrc} height={64} alt="" />
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              fontSize: 20,
              letterSpacing: 6,
              textTransform: "uppercase",
              color: "#5eead4",
              marginBottom: 22,
            }}
          >
            {meta}
          </div>
          <div
            style={{
              display: "flex",
              fontSize: 54,
              fontWeight: 800,
              lineHeight: 1.08,
              letterSpacing: -2,
              maxWidth: 940,
            }}
          >
            {title}
          </div>
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            fontSize: 26,
          }}
        >
          <span style={{ color: "rgba(226,247,242,0.72)" }}>
            Blog · XyraCode
          </span>
          <span style={{ color: "#5eead4", fontWeight: 700 }}>
            {SEO.ogImage.footerRight}
          </span>
        </div>
      </div>
    ),
    { ...size },
  );
}
```

- [ ] **Step 2: Build y commit**

```bash
npm run build
git add app/blog/[slug]/opengraph-image.tsx
git commit -m "feat(blog): Open Graph por articulo"
```

---

### Task 5: Sitemap + enlazado interno (nav)

**Files:**
- Modify: `app/sitemap.ts`
- Modify: `lib/content/ui.ts` (añadir link "Blog" al nav)

**Interfaces:**
- Consumes: `BLOG_POSTS` de `@/lib/content` (en `sitemap.ts`).
- Produces: `/blog` y cada `/blog/[slug]` en el sitemap; nuevo link "Blog" en el nav → `/blog`.

- [ ] **Step 1: Añadir blog al sitemap**

Modify `app/sitemap.ts`:
1. Fusionar el import: `import { BLOG_POSTS, CASE_STUDIES, SERVICE_PAGES } from "@/lib/content";`.
2. Añadir a `LAST_MODIFIED` la clave `blogHub: "2026-07-13"`.
3. Antes del `return`:
```ts
  const blogPosts: MetadataRoute.Sitemap = BLOG_POSTS.map((p) => ({
    url: `${BASE}/blog/${p.slug}`,
    lastModified: p.lastModified,
    changeFrequency: "monthly",
    priority: 0.7,
  }));
```
4. En el array devuelto (tras proyectos):
```ts
    {
      url: `${BASE}/blog`,
      lastModified: LAST_MODIFIED.blogHub,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    ...blogPosts,
```

- [ ] **Step 2: Navbar → añadir Blog**

Modify `lib/content/ui.ts` — en `UI.nav.links`, añadir la entrada "Blog" (tras "Proyectos"):
```ts
{ label: "Blog", href: "/blog" },
```

- [ ] **Step 3: Typecheck, lint, build; revisión**

Run:
```bash
npx tsc --noEmit
npm run lint
npm run build
```
Expected: verde. `sitemap.xml` incluye `/blog` y `/blog/cuanto-cuesta-una-web-colombia-2026`; el nav muestra "Blog" y navega a `/blog`.

- [ ] **Step 4: Commit**

```bash
git add app/sitemap.ts lib/content/ui.ts
git commit -m "feat(seo): sitemap + nav para /blog"
```

---

## Verificación final de la fase

- [ ] `npm test`, `npx tsc --noEmit`, `npm run lint`, `npm run build` → verde; se prerenderizan `/blog`, `/blog/cuanto-cuesta-una-web-colombia-2026` y su `opengraph-image`.
- [ ] Revisión manual (`npm run dev`): un solo `<h1>` por página; el destacado del índice enlaza al artículo; el artículo muestra cabecera con metadatos, portada (o fondo de marca), cuerpo ~720px y bio de autor; JSON-LD `BlogPosting`/`CollectionPage`/`BreadcrumbList` válidos (validator.schema.org).
- [ ] `sitemap.xml` incluye las rutas nuevas; nav enlaza a `/blog`.
- [ ] **Pendiente no bloqueante:** la portada raster del artículo (1200×630, slot 4B) — mientras no exista, se muestra el fondo de marca. Añadir `cover` al `BlogPost` cuando el cliente aporte la imagen.

## Notas de auto-revisión (cobertura vs handoff)

- **Índice `/blog` (handoff §5):** destacado (portada + categoría·tiempo + título + resumen + "Leer artículo →") + grid + slots atenuados → Task 3. ✅
- **Artículo `/blog/[slug]` (handoff §6):** cabecera centrada (categoría·tiempo·fecha + h1 + bajada), portada 16:8 max 900px, cuerpo de bloques max 720px, bio de autor (avatar + "Escrito por" + nombre + línea) → Task 2. ✅
- **Modelo `BlogPost` en `lib/content/`** → Task 1. ✅
- **JSON-LD `BlogPosting` (author `#person`, publisher `#organization`) + `BreadcrumbList` + `CollectionPage`** → Tasks 2, 3 con `breadcrumbLd`. ✅
- **OG por ruta** → Task 4. ✅
- **Portada raster opcional con fallback de marca** → Tasks 2, 3 (publicable sin la imagen). ✅
- **Diferido:** paginación del índice (innecesaria con pocos artículos; añadir cuando el volumen lo pida); campo de bio de autor dedicado (por ahora se usa `FOUNDER.jobTitle`).
```