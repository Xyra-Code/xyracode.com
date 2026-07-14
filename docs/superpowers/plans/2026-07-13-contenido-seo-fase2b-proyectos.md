# Fase 2b — Proyectos / Casos de estudio (contenido SEO) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Publicar el índice `/proyectos` y las páginas de caso de estudio `/proyectos/[slug]` (empezando por `vuelo-carmesi`), con cuerpo largo de bloques, ficha lateral, panel de resultados, galería, metadata propia, JSON-LD `CreativeWork` + `BreadcrumbList` y entradas en el sitemap — enlazando la home al caso vía `caseStudyHref`.

**Architecture:** Reutiliza la fundación de la Fase 2a (`ArticleBody` + `.prose-xyra`, componente `Breadcrumb`, helper `breadcrumbLd` de `@/lib/jsonld`). El índice `/proyectos` lee el array `PROJECTS` existente (portafolio) y muestra un destacado + grid + "slots disponibles" atenuados para ilustrar el crecimiento. El detalle `/proyectos/[slug]` lee un tipo nuevo y más rico, `CaseStudy` (`lib/content/case-studies.ts`), self-contained. Se añade un componente compartido `Chip` (tags/stack). El caso enlaza al `#person` de `/nosotros` como autor (E-E-A-T) y a `#organization` como publisher.

**Tech Stack:** Next.js 16.2.10 (App Router, `params` es `Promise`), React 19.2.4, TypeScript 5 strict, Tailwind CSS v4, lucide-react, `next/image` (con `fill` + contenedores con `aspect-*`), Vitest + @testing-library/react.

## Global Constraints

- **PRERREQUISITOS:**
  - **Fase 1 Task 3** integrada: `@/lib/content/blocks` (`Block`) y `@/components/content/BlockRenderer`.
  - **Fase 2a** integrada: `@/components/content/ArticleBody` + `.prose-xyra` en `globals.css`, y `@/components/ui/Breadcrumb`.
  - Verificar antes de empezar: `ls components/content/ArticleBody.tsx components/ui/Breadcrumb.tsx lib/content/blocks.ts` y `npx tsc --noEmit` en verde.
- **JSON-LD:** usar `breadcrumbLd(pagePath, crumbs)` de `@/lib/jsonld` ("Inicio" se añade solo). El autor del caso se referencia por `@id`: `{ "@id": "${SEO.siteUrl}/nosotros#person" }` (nodo definido en `/nosotros`); publisher `{ "@id": "${SEO.siteUrl}/#organization" }`.
- **Next.js 16.2.10 / React 19.2.4** — `params`/`searchParams` son `Promise` (await). Leer `node_modules/next/dist/docs/` antes de tocar APIs de Next que no conozcas.
- **`lib/content/*` NO importa de `lib/seo.ts` ni de `lib/jsonld.ts`.** Las páginas (en `app/`) sí importan de ambos.
- **Reutilizar tokens y componentes existentes** (`bg-night`, `bg-brand-ink`, `bg-brand-primary`, `text-teal-300`, `Navbar`, `Footer`, `Button`, `Eyebrow`, `Reveal`, `Breadcrumb`, `ArticleBody`).
- **Un solo `<h1>` por página.**
- **Sin `new Date()`** en `lib/content/*` ni `sitemap.ts`.
- **Contenido del caso desde el borrador** `contenido/borradores/caso-vuelo-carmesi-ESQUELETO.md`. Ese borrador tiene **8 `[DATO REAL PENDIENTE: ...]`** (seo_description, nombre publicable del cliente, el reto, proceso real, detalles técnicos públicos, 3 métricas de resultado, testimonio, qué muestra cada captura). **Transcribir esos marcadores literalmente y NO inventar** — la página puede construirse y buildear con los placeholders, pero **no se publica** hasta que el cliente los confirme (ver verificación final).
- **Verde tras cada tarea:** `npm test`, `npx tsc --noEmit`, `npm run lint`, `npm run build`.

---

### Task 1: Componente `Chip`

**Files:**
- Create: `components/ui/Chip.tsx`
- Create: `components/ui/Chip.test.tsx`

**Interfaces:**
- Produces: `Chip({ children, className? }: { children: ReactNode; className?: string })` desde `@/components/ui/Chip` — pill mono teal (radio 8px), para tags y chips de stack (handoff §Chip).

- [ ] **Step 1: Escribir el test que falla**

Create `components/ui/Chip.test.tsx`:
```tsx
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Chip } from "./Chip";

describe("Chip", () => {
  it("renderiza el contenido y propaga className", () => {
    render(<Chip className="extra">Next.js</Chip>);
    const chip = screen.getByText("Next.js");
    expect(chip).toBeInTheDocument();
    expect(chip).toHaveClass("extra");
  });
});
```

- [ ] **Step 2: Ejecutar el test y verificar que falla**

Run: `npm test -- Chip`
Expected: FAIL — no existe `./Chip`.

- [ ] **Step 3: Implementar el componente**

Create `components/ui/Chip.tsx`:
```tsx
import type { ReactNode } from "react";

/** Pill mono/teal para tags y chips de stack (handoff §Chip, radio 8px). */
export function Chip({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <span
      className={`inline-flex items-center rounded-lg bg-[rgba(94,234,212,0.12)] px-2.5 py-1 font-mono text-[12px] text-teal-300 ${className}`}
    >
      {children}
    </span>
  );
}
```

- [ ] **Step 4: Ejecutar el test y verificar que pasa**

Run: `npm test -- Chip`
Expected: PASS.

- [ ] **Step 5: Typecheck y commit**

```bash
npx tsc --noEmit
git add components/ui/Chip.tsx components/ui/Chip.test.tsx
git commit -m "feat(ui): componente Chip (tags/stack) con test"
```

---

### Task 2: Tipo `CaseStudy` + datos + enlace desde la home

**Files:**
- Create: `lib/content/case-studies.ts`
- Modify: `lib/content/index.ts` (barrel)
- Modify: `lib/content/projects.ts` (añadir `caseStudyHref` a Vuelo Carmesí)

**Interfaces:**
- Consumes: `Block` de `./blocks`.
- Produces (vía barrel `@/lib/content`): tipos `CaseResult`, `CaseImage`, `CaseStudy` y el array `CASE_STUDIES: CaseStudy[]`. Además, el `Project` "Vuelo Carmesí" gana `caseStudyHref: "/proyectos/vuelo-carmesi"` (lo consume el `Portfolio` de la home, que ya renderiza ese botón).

- [ ] **Step 1: Crear el tipo y la entrada (transcrita del borrador)**

Create `lib/content/case-studies.ts`:
```ts
import type { Block } from "./blocks";

/** Métrica del panel de resultados (3 por caso). */
export type CaseResult = { value: string; label: string };

/** Imagen de cover/galería. width/height reales (next/image los exige si no se usa fill). */
export type CaseImage = { src: string; alt: string; caption?: string };

export type CaseStudy = {
  slug: string;
  seo: { title: string; description: string };
  /** ISO 8601; editar a mano al cambiar el contenido (alimenta el sitemap y datePublished). */
  lastModified: string;
  hero: { tags: string[]; h1: string; intro: string };
  cover: CaseImage;
  meta: {
    cliente: string;
    /** Año o "2026 · En producción". */
    año: string;
    stack: string[];
    /** URL del sitio en vivo (botón "Visitar sitio"). */
    siteHref?: string;
  };
  /** Cuerpo largo del caso (el reto, el proceso, decisiones técnicas…). */
  body: Block[];
  /** Panel "Resultado": 3 stats grandes. */
  results: CaseResult[];
  /** Galería inferior. */
  gallery: CaseImage[];
};

export const CASE_STUDIES: CaseStudy[] = [
  {
    slug: "vuelo-carmesi",
    seo: {
      // TRANSCRIBIR seo_description real desde el borrador (queda [DATO REAL PENDIENTE]).
      title: "Caso de estudio: Vuelo Carmesí | XyraCode",
      description:
        "[DATO REAL PENDIENTE: seo_description del caso, 150-160 car. con un resultado concreto]",
    },
    lastModified: "2026-07-13",
    hero: {
      // Reutilizados de PROJECTS (públicos): tags, título, propuesta de valor.
      tags: ["Next.js 16", "NestJS", "PostgreSQL", "Prisma", "Cloudinary"],
      h1: "Vuelo Carmesí — plataforma de reservas y tienda para una finca de cacao",
      intro:
        "Diseño y desarrollo full-stack de una plataforma de reservas y e-commerce para una finca de cacao agroecológico.",
    },
    cover: {
      src: "/assets/projects/vuelo-carmesi/1.png",
      alt: "[DATO REAL PENDIENTE: qué muestra la captura 1 (portada del caso)]",
    },
    meta: {
      cliente: "[DATO REAL PENDIENTE: nombre publicable del cliente]",
      año: "2026 · En producción",
      stack: ["Next.js 16", "NestJS", "PostgreSQL", "Prisma", "Cloudinary"],
      siteHref: "https://vuelocarmesi.com",
    },
    body: [
      // TRANSCRIBIR desde contenido/borradores/caso-vuelo-carmesi-ESQUELETO.md,
      // convirtiendo ## → h2, párrafos → p, listas → ul, citas → quote.
      // Conservar literalmente cualquier [DATO REAL PENDIENTE: ...].
      { kind: "h2", text: "El reto" },
      {
        kind: "p",
        text: "[DATO REAL PENDIENTE: cómo gestionaban reservas y ventas antes, y qué los llevó a la plataforma]",
      },
    ],
    results: [
      { value: "[PENDIENTE]", label: "[DATO REAL PENDIENTE: métrica de resultado 1]" },
      { value: "[PENDIENTE]", label: "[DATO REAL PENDIENTE: métrica de resultado 2]" },
      { value: "[PENDIENTE]", label: "[DATO REAL PENDIENTE: métrica de resultado 3]" },
    ],
    gallery: [
      {
        src: "/assets/projects/vuelo-carmesi/2.png",
        alt: "[DATO REAL PENDIENTE: qué muestra la captura 2]",
      },
      {
        src: "/assets/projects/vuelo-carmesi/3.png",
        alt: "[DATO REAL PENDIENTE: qué muestra la captura 3]",
      },
    ],
  },
];
```

> Los valores marcados `[DATO REAL PENDIENTE: ...]` se transcriben literalmente del borrador; NO inventar. Los campos públicos (stack, año/estado, `siteHref`, tags) se reutilizan de `PROJECTS` (`lib/content/projects.ts`), que ya los tiene verificados.

- [ ] **Step 2: Completar el `body` desde el borrador**

Abre `contenido/borradores/caso-vuelo-carmesi-ESQUELETO.md` y transcribe su cuerpo a `body: Block[]` (`##` → `{ kind: "h2" }`, párrafos → `{ kind: "p" }`, listas → `{ kind: "ul", items }`, citas → `{ kind: "quote" }`). Si insertas imágenes inline, usa `{ kind: "image", src, alt, width, height, caption? }` con `width`/`height` reales (`Block` de Fase 1 los exige). Conserva todos los `[DATO REAL PENDIENTE: ...]`.

Run: `npx tsc --noEmit`
Expected: sin errores (la entrada cumple `CaseStudy`).

- [ ] **Step 3: Re-exportar desde el barrel**

Modify `lib/content/index.ts` — añadir:
```ts
export * from "./case-studies";
```

- [ ] **Step 4: Enlazar la home al caso**

Modify `lib/content/projects.ts` — en el objeto de `PROJECTS` cuyo `title` es `"Vuelo Carmesí"`, añadir el campo `caseStudyHref` (el tipo `Project` ya lo declara opcional):
```ts
    caseStudyHref: "/proyectos/vuelo-carmesi",
```
(El componente `Portfolio` de la home ya renderiza el botón "Caso de estudio" cuando `caseStudyHref` existe — esto activa el enlace interno home → caso sin tocar el componente.)

Run: `npx tsc --noEmit`
Expected: sin errores.

- [ ] **Step 5: Commit**

```bash
git add lib/content/case-studies.ts lib/content/index.ts lib/content/projects.ts
git commit -m "feat(content): tipo CaseStudy + caso vuelo-carmesi + enlace desde home"
```

---

### Task 3: Índice `/proyectos`

**Files:**
- Create: `app/proyectos/page.tsx`

**Interfaces:**
- Consumes: `PROJECTS` de `@/lib/content`; `SEO` de `@/lib/seo`; `breadcrumbLd` de `@/lib/jsonld`; `Navbar`, `Footer`, `Eyebrow`, `Reveal`, `Chip`, `next/image`, `next/link`.
- Produces: la ruta estática `/proyectos` con `<h1>` propio, un proyecto destacado + grid + "slots disponibles" atenuados, `metadata` estático y JSON-LD `CollectionPage` + `BreadcrumbList`.

- [ ] **Step 1: Crear el índice**

Create `app/proyectos/page.tsx`:
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
```

- [ ] **Step 2: Typecheck, lint y build; revisión**

Run:
```bash
npx tsc --noEmit
npm run lint
npm run build
```
Expected: verde; `/proyectos` prerenderizada. `npm run dev` → `http://localhost:3000/proyectos`: un solo `<h1>`, destacado con cover + tags (`Chip`) + "Ver caso completo", grid con slots atenuados, JSON-LD `CollectionPage`.

- [ ] **Step 3: Commit**

```bash
git add app/proyectos/page.tsx
git commit -m "feat(proyectos): indice /proyectos con destacado, grid y slots"
```

---

### Task 4: Detalle `/proyectos/[slug]` (caso de estudio)

**Files:**
- Create: `app/proyectos/[slug]/page.tsx`

**Interfaces:**
- Consumes: `CASE_STUDIES` de `@/lib/content`; `SEO` de `@/lib/seo`; `breadcrumbLd` de `@/lib/jsonld`; `ArticleBody`, `Breadcrumb`, `Chip`, `Navbar`, `Footer`, `Button`, `Reveal`, `next/image`.
- Produces: una página estática por `slug` con `<h1>` único, hero + cover + ficha lateral sticky + cuerpo de bloques + panel de resultados + galería, `generateMetadata`, `generateStaticParams`, `dynamicParams = false`, y JSON-LD `CreativeWork` (author `#person`, publisher `#organization`) + `BreadcrumbList`.

- [ ] **Step 1: Crear la página**

Create `app/proyectos/[slug]/page.tsx`:
```tsx
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
        dateModified: study.lastModified,
        author: { "@id": `${SITE_URL}/nosotros#person` },
        publisher: { "@id": `${SITE_URL}/#organization` },
        keywords: study.hero.tags.join(", "),
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
          className="relative overflow-hidden px-6 pt-[72px] pb-12 md:px-16"
        >
          <div
            aria-hidden
            className="absolute -top-40 right-[8%] h-[520px] w-[520px] rounded-full bg-brand-primary opacity-25 blur-[130px]"
          />
          <Reveal className="relative mx-auto flex max-w-225 flex-col gap-6">
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
              className="max-w-225 text-[36px] leading-[1.04] font-extrabold tracking-[-0.03em] md:text-[58px]"
            >
              {study.hero.h1}
            </h1>
            <p className="max-w-160 text-[19px] leading-[1.6] text-[rgba(226,247,242,0.72)]">
              {study.hero.intro}
            </p>
          </Reveal>
        </section>

        {/* Cover 16:8 full-width */}
        <section aria-label="Portada del proyecto" className="px-6 pb-16 md:px-16">
          <Reveal className="mx-auto max-w-300">
            <div className="relative aspect-16/8 overflow-hidden rounded-[20px] border border-[rgba(94,234,212,0.15)]">
              <Image
                src={study.cover.src}
                alt={study.cover.alt}
                fill
                sizes="(min-width: 1536px) 1400px, 100vw"
                className="object-cover"
                priority
              />
            </div>
          </Reveal>
        </section>

        {/* Ficha lateral sticky + cuerpo */}
        <section aria-label="Detalle del caso" className="px-6 pb-20 md:px-16">
          <div className="mx-auto grid max-w-225 gap-10 md:grid-cols-[260px_1fr]">
            <aside className="md:sticky md:top-24 md:self-start">
              <dl className="flex flex-col gap-5 rounded-[16px] border border-[rgba(94,234,212,0.15)] bg-white/3 p-6 font-mono text-[13px]">
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
                  <a
                    href={study.meta.siteHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-teal-300 hover:text-teal-200"
                  >
                    Visitar sitio <ArrowUpRight size={16} aria-hidden />
                  </a>
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
            <div className="mx-auto max-w-225">
              <h2
                id="caso-resultado-title"
                className="mb-10 text-[28px] font-extrabold tracking-[-0.03em] md:text-[36px]"
              >
                Resultado
              </h2>
              <dl className="grid gap-8 sm:grid-cols-3">
                {study.results.map((result) => (
                  <div key={result.label} className="flex flex-col gap-2">
                    <dt className="order-2 text-[15px] leading-[1.5] text-[rgba(226,247,242,0.6)]">
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
        {study.gallery.length > 0 && (
          <section aria-label="Galería del proyecto" className="px-6 py-20 md:px-16">
            <div className="mx-auto grid max-w-300 gap-6 md:grid-cols-3">
              {study.gallery.map((img) => (
                <figure key={img.src} className="flex flex-col gap-2">
                  <div className="relative aspect-4/3 overflow-hidden rounded-[16px] border border-[rgba(94,234,212,0.15)]">
                    <Image
                      src={img.src}
                      alt={img.alt}
                      fill
                      sizes="(min-width: 768px) 33vw, 100vw"
                      className="object-cover"
                    />
                  </div>
                  {img.caption && (
                    <figcaption className="text-center font-mono text-[12px] text-[rgba(226,247,242,0.5)]">
                      {img.caption}
                    </figcaption>
                  )}
                </figure>
              ))}
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
```

- [ ] **Step 2: Typecheck, lint y build; revisión**

Run:
```bash
npx tsc --noEmit
npm run lint
npm run build
```
Expected: verde; `/proyectos/vuelo-carmesi` prerenderizada. `npm run dev` → revisar: un solo `<h1>`, cover, ficha lateral sticky con chips de stack, cuerpo `.prose-xyra`, panel Resultado (3 stats), galería. Validar el JSON-LD `CreativeWork` + `BreadcrumbList` en https://validator.schema.org/.

- [ ] **Step 3: Commit**

```bash
git add app/proyectos/[slug]/page.tsx
git commit -m "feat(proyectos): pagina de caso de estudio /proyectos/[slug] con JSON-LD"
```

---

### Task 5: Open Graph por caso

**Files:**
- Create: `app/proyectos/[slug]/opengraph-image.tsx`

**Interfaces:**
- Consumes: `CASE_STUDIES` de `@/lib/content`; el logo `public/assets/brand/logo-horizontal.png`.
- Produces: una imagen OG 1200×630 por caso, con el `hero.h1`.

- [ ] **Step 1: Crear la OG dinámica**

Create `app/proyectos/[slug]/opengraph-image.tsx` (misma técnica que `app/servicios/[slug]/opengraph-image.tsx` de Fase 2a):
```tsx
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { CASE_STUDIES } from "@/lib/content";
import { SEO } from "@/lib/seo";

export const alt = "Caso de estudio de XyraCode";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export function generateStaticParams() {
  return CASE_STUDIES.map((c) => ({ slug: c.slug }));
}

export default async function Image({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const study = CASE_STUDIES.find((c) => c.slug === slug);
  const logo = await readFile(
    join(process.cwd(), "public/assets/brand/logo-horizontal.png"),
    "base64",
  );
  const logoSrc = `data:image/png;base64,${logo}`;
  const title = study?.hero.h1 ?? "Caso de estudio";

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
            Caso de estudio
          </div>
          <div
            style={{
              display: "flex",
              fontSize: 56,
              fontWeight: 800,
              lineHeight: 1.06,
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
            Desarrollo web y software a medida
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
git add app/proyectos/[slug]/opengraph-image.tsx
git commit -m "feat(proyectos): Open Graph por caso de estudio"
```

---

### Task 6: Sitemap + enlazado interno (nav)

**Files:**
- Modify: `app/sitemap.ts`
- Modify: `lib/content/ui.ts` (link "Proyectos" del nav)

**Interfaces:**
- Consumes: `CASE_STUDIES` de `@/lib/content` (en `sitemap.ts`).
- Produces: `/proyectos` y cada `/proyectos/[slug]` en el sitemap; el link "Proyectos" del nav apunta a `/proyectos`.

> **Nota:** este plan asume que la Fase 2a ya reescribió `app/sitemap.ts` a la forma dirigida por datos (con `SERVICE_PAGES`). Los pasos siguientes AÑADEN proyectos a ese archivo. Si 2a aún no se integró, adaptar al `sitemap.ts` vigente conservando la regla "sin `new Date()`".

- [ ] **Step 1: Añadir proyectos al sitemap**

Modify `app/sitemap.ts`:
1. Añadir el import: `import { CASE_STUDIES, SERVICE_PAGES } from "@/lib/content";` (fusionar con el import existente de `SERVICE_PAGES`).
2. Añadir a `LAST_MODIFIED` la clave `proyectosHub: "2026-07-13"`.
3. Antes del `return`, construir las rutas de caso:
```ts
  const caseStudies: MetadataRoute.Sitemap = CASE_STUDIES.map((c) => ({
    url: `${BASE}/proyectos/${c.slug}`,
    lastModified: c.lastModified,
    changeFrequency: "monthly",
    priority: 0.8,
  }));
```
4. Incluir en el array devuelto, tras las rutas de servicio:
```ts
    {
      url: `${BASE}/proyectos`,
      lastModified: LAST_MODIFIED.proyectosHub,
      changeFrequency: "monthly",
      priority: 0.9,
    },
    ...caseStudies,
```

- [ ] **Step 2: Navbar → /proyectos**

Modify `lib/content/ui.ts` — en `UI.nav.links`, cambiar la entrada de Proyectos:
```ts
// Antes:
{ label: "Proyectos", href: "/#portfolio" },
// Después:
{ label: "Proyectos", href: "/proyectos" },
```

- [ ] **Step 3: Typecheck, lint, build; revisión**

Run:
```bash
npx tsc --noEmit
npm run lint
npm run build
```
Expected: verde. `sitemap.xml` incluye `/proyectos` y `/proyectos/vuelo-carmesi`; el nav "Proyectos" navega a `/proyectos`.

- [ ] **Step 4: Commit**

```bash
git add app/sitemap.ts lib/content/ui.ts
git commit -m "feat(seo): sitemap + nav para /proyectos"
```

---

## Verificación final de la fase

- [ ] `npm test` → verde (Chip + los previos).
- [ ] `npx tsc --noEmit`, `npm run lint`, `npm run build` → verde; se prerenderizan `/proyectos`, `/proyectos/vuelo-carmesi` y su `opengraph-image`.
- [ ] Revisión manual (`npm run dev`): un solo `<h1>` por página; el destacado del índice enlaza al caso; el caso muestra cover, ficha sticky, cuerpo estilado, resultados y galería; JSON-LD `CreativeWork`/`CollectionPage`/`BreadcrumbList` válidos.
- [ ] Home: el botón "Caso de estudio" del proyecto Vuelo Carmesí (Portfolio) navega a `/proyectos/vuelo-carmesi`.
- [ ] `sitemap.xml` incluye las rutas nuevas; nav enlaza a `/proyectos`.
- [ ] **BLOQUEANTE DE PUBLICACIÓN — datos reales del caso.** Listar los `[DATO REAL PENDIENTE: ...]` que sigan en `CASE_STUDIES` (los 8 del borrador: seo_description, cliente, el reto, proceso, detalles técnicos, 3 métricas, testimonio, alts/captions de galería). La página puede quedar integrada, pero **no se enlaza públicamente ni se marca `lastModified` como definitivo hasta que el cliente confirme esos datos.** Si al momento de ejecutar aún no están, considerar `export const dynamicParams = false` (ya puesto) + mantener `/proyectos/vuelo-carmesi` fuera del destacado hasta completarlo.

## Notas de auto-revisión (cobertura vs handoff)

- **Índice `/proyectos` (handoff §3):** destacado + grid + slots atenuados → Task 3. ✅
- **Caso `/proyectos/[slug]` (handoff §4):** hero+tags, cover 16:8, ficha lateral sticky (Cliente/Año/Stack/Visitar), cuerpo de bloques, Resultado (3 stats), Galería 4:3 → Task 4. ✅
- **Modelo `CaseStudy` en `lib/content/`** → Task 2. ✅
- **`caseStudyHref` (enlace home → caso, handoff §enlazado interno)** → Task 2 Step 4. ✅
- **JSON-LD `CreativeWork` (author `#person`, publisher `#organization`) + `BreadcrumbList` + `CollectionPage`** → Tasks 3, 4 con `breadcrumbLd`. ✅
- **OG por ruta** → Task 5. ✅
- **`Chip` compartido** → Task 1 (lo reutiliza la Fase 2c para categorías de blog). ✅
- **Diferido:** `SoftwareApplication` como tipo alterno del caso (se usa `CreativeWork`, más genérico y suficiente); imágenes inline en el cuerpo (el `Block` image ya lo soporta si un caso lo necesita).
```