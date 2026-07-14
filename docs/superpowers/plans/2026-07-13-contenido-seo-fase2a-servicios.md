# Fase 2a — Servicios (páginas de contenido SEO) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Publicar 4 páginas de servicio indexables (`/servicios/desarrollo-web`, `/apps-a-medida`, `/ecommerce`, `/desarrollo-web-villavicencio`) más el hub `/servicios`, cada una con contenido largo, metadata propia, JSON-LD y entrada en el sitemap — creando la fundación compartida (cuerpo de bloques estilado, migas de pan, helper de breadcrumb) que reutilizarán las Fases 2b y 2c.

**Architecture:** Cada ruta es un Server Component estático dirigido por datos. Un nuevo tipo `ServicePage` (en `lib/content/service-pages.ts`) reúne, por servicio: metadata SEO, hero, grid "Qué incluye", **un cuerpo largo `body: Block[]`** (el "más texto" que Google indexa) y CTA. El cuerpo se pinta con el `BlockRenderer` de Fase 1 (sin estilos) envuelto en un nuevo `ArticleBody` que aplica la tipografía del handoff vía `.prose-xyra` en `globals.css`. La metadata sale de `generateMetadata`; las rutas dinámicas de `generateStaticParams` con `dynamicParams = false`; el sitemap deriva URLs y `lastModified` del array; el JSON-LD (`Service` + `BreadcrumbList` por página, `CollectionPage` en el hub) se cuelga del `@graph` existente por `@id`.

**Tech Stack:** Next.js 16.2.10 (App Router, `params` es `Promise`), React 19.2.4, TypeScript 5 (strict, alias `@/*` → `./*`), Tailwind CSS v4 (`@theme` tokens en `globals.css`), lucide-react (iconos), Vitest + @testing-library/react (tests de lógica pura y componentes).

## Global Constraints

- **PRERREQUISITO — Fase 1 Task 3.** Este plan consume tres entregables de la Fase 1 (`docs/superpowers/plans/2026-07-13-contenido-seo-fase1-fundaciones.md`): el barrel `@/lib/content` (✅ ya integrado), el tipo `Block` en `@/lib/content/blocks` y el componente `BlockRenderer` en `@/components/content/BlockRenderer`. A hoy, el barrel y el split de `lib/content/` ya están commiteados, pero **`blocks.ts` y `BlockRenderer` (Fase 1 Task 3) todavía NO existen** — no ejecutar 2a hasta que existan (verificar: `ls lib/content/blocks.ts components/content/BlockRenderer.tsx` y `npx tsc --noEmit` en verde).
- **JSON-LD ya provisto: usar `lib/jsonld.ts`.** Existe (del refactor JSON-LD en curso) `breadcrumbLd(pagePath, crumbs)` en `@/lib/jsonld` — añade "Inicio" automáticamente y ancla el `@id` desde `pagePath`. Las páginas de este plan lo importan; **no crear un helper de breadcrumb nuevo**. El nodo `Person` (E-E-A-T) vive inline en `app/nosotros/page.tsx` con `@id` `${siteUrl}/nosotros#person` (los servicios usan `provider: #organization`, no necesitan autor).
- **Next.js 16.2.10 / React 19.2.4** — no bajar versiones. `params` y `searchParams` son `Promise`: hay que `await`-earlos tanto en el componente de página (`async`) como en `generateMetadata`. AGENTS.md: leer `node_modules/next/dist/docs/` antes de tocar APIs de Next que no conozcas.
- **Alias de imports:** `@/*` resuelve a la raíz del repo (`tsconfig.json` `paths`).
- **`lib/content/*` NO importa de `lib/seo.ts`** (regla existente). `lib/seo.ts` SÍ puede leer de `lib/content`.
- **Reutilizar lo existente, no reinventar:** tokens de `globals.css` (`bg-night`, `bg-brand-ink`, `bg-brand-primary`, `bg-brand-secondary`, `text-night`, `text-teal-300`, `text-emerald-200`) y componentes (`Navbar`, `Footer`, `Button`, `Eyebrow`, `Reveal`). El color del borde `ghost` de `Button` lo pasa el caller vía `className` (p.ej. `border-white/22`).
- **Un solo `<h1>` por página.** El hub y cada servicio tienen exactamente un `<h1>`; el resto son `<h2>`/`<h3>`.
- **Sin `new Date()`** en `lib/content/*` ni en `sitemap.ts` (le diría a Google que todo el sitio cambió en cada build). Las fechas son literales ISO 8601 editados a mano.
- **Copy real desde borradores.** El texto definitivo se transcribe desde `contenido/borradores/servicio-*.md` y `contenido/borradores/hub-servicios.md` (los produce el track de contenido en paralelo). Donde un borrador tenga `[DATO REAL PENDIENTE: ...]`, conservar ese texto tal cual y listarlo en la verificación final — **nunca inventar** cifras, clientes ni resultados.
- **Verde tras cada tarea:** `npm test`, `npx tsc --noEmit`, `npm run lint`, `npm run build`.

---

### Task 1: `ArticleBody` — estilar el cuerpo de bloques

El `BlockRenderer` de Fase 1 emite HTML semántico **sin clases** a propósito ("la presentación se define en las plantillas"). Esta tarea crea la capa de presentación reutilizable para todos los cuerpos largos (servicios, casos, artículos).

**Files:**
- Create: `components/content/ArticleBody.tsx`
- Create: `components/content/ArticleBody.test.tsx`
- Modify: `app/globals.css`

**Interfaces:**
- Consumes: `Block` de `@/lib/content/blocks` y `BlockRenderer` de `@/components/content/BlockRenderer` (ambos de Fase 1).
- Produces: `ArticleBody({ blocks, className? }: { blocks: Block[]; className?: string }): JSX.Element` desde `@/components/content/ArticleBody` — envuelve el `BlockRenderer` en un `<div className="prose-xyra …">`. El ancho de lectura lo fija el caller (con `max-w-*`).

- [ ] **Step 1: Escribir el test que falla**

Create `components/content/ArticleBody.test.tsx`:
```tsx
import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import type { Block } from "@/lib/content/blocks";
import { ArticleBody } from "./ArticleBody";

// next/image necesita infra de Next; en jsdom lo sustituimos por un <img> simple.
vi.mock("next/image", () => ({
  default: (props: { src: string; alt: string }) => (
    // eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text
    <img src={props.src} alt={props.alt} />
  ),
}));

describe("ArticleBody", () => {
  it("envuelve el renderer en .prose-xyra y pinta HTML semántico", () => {
    const blocks: Block[] = [
      { kind: "h2", text: "Sección" },
      { kind: "p", text: "Un párrafo largo." },
    ];
    const { container } = render(<ArticleBody blocks={blocks} />);
    expect(container.querySelector(".prose-xyra")).not.toBeNull();
    expect(
      screen.getByRole("heading", { level: 2, name: "Sección" }),
    ).toBeInTheDocument();
    expect(screen.getByText("Un párrafo largo.")).toBeInTheDocument();
  });

  it("propaga className al contenedor", () => {
    const { container } = render(
      <ArticleBody blocks={[{ kind: "p", text: "x" }]} className="max-w-180" />,
    );
    const wrapper = container.querySelector(".prose-xyra");
    expect(wrapper).toHaveClass("max-w-180");
  });
});
```

- [ ] **Step 2: Ejecutar el test y verificar que falla**

Run: `npm test -- ArticleBody`
Expected: FAIL — no existe `./ArticleBody` (módulo no encontrado).

- [ ] **Step 3: Implementar el componente**

Create `components/content/ArticleBody.tsx`:
```tsx
import type { Block } from "@/lib/content/blocks";
import { BlockRenderer } from "./BlockRenderer";

/**
 * Cuerpo de lectura largo (servicios, casos, artículos). Envuelve el
 * BlockRenderer (semántico, sin estilos, de Fase 1) en un contenedor
 * `.prose-xyra` que aplica la tipografía del handoff (globals.css).
 * El ancho de lectura lo fija el caller con `max-w-*`.
 */
export function ArticleBody({
  blocks,
  className = "",
}: {
  blocks: Block[];
  className?: string;
}) {
  return (
    <div className={`prose-xyra ${className}`}>
      <BlockRenderer blocks={blocks} />
    </div>
  );
}
```

- [ ] **Step 4: Añadir la tipografía `.prose-xyra` a globals.css**

Modify `app/globals.css` — añadir al final (CSS plano; tokens del handoff §BlockRenderer):
```css
/* Cuerpo de lectura largo (servicios, casos, artículos). El BlockRenderer
   emite HTML semántico sin clases; esta capa le da la tipografía del handoff. */
.prose-xyra > * + * {
  margin-top: 1.4em;
}
.prose-xyra h2 {
  margin-top: 1.8em;
  font-size: 30px;
  font-weight: 800;
  line-height: 1.15;
  letter-spacing: -0.02em;
  color: #ffffff;
}
.prose-xyra p {
  font-size: 17.5px;
  line-height: 1.75;
  color: rgba(226, 247, 242, 0.78);
}
.prose-xyra ul {
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding-left: 1.4em;
  list-style: disc;
  font-size: 17.5px;
  line-height: 1.6;
  color: rgba(226, 247, 242, 0.78);
}
.prose-xyra figure {
  margin-top: 1.8em;
}
.prose-xyra figure img {
  width: 100%;
  height: auto;
  border-radius: 16px;
}
.prose-xyra figcaption {
  margin-top: 10px;
  font-size: 13px;
  text-align: center;
  color: rgba(226, 247, 242, 0.5);
}
.prose-xyra blockquote {
  padding-left: 20px;
  border-left: 3px solid #5eead4;
  font-size: 22px;
  font-weight: 600;
  color: #ffffff;
}
```

- [ ] **Step 5: Ejecutar el test y verificar que pasa**

Run: `npm test -- ArticleBody`
Expected: PASS — ambos tests.

- [ ] **Step 6: Typecheck y commit**

```bash
npx tsc --noEmit
git add components/content/ArticleBody.tsx components/content/ArticleBody.test.tsx app/globals.css
git commit -m "feat(content): ArticleBody + tipografia .prose-xyra para cuerpos largos"
```

---

### Task 2: Adoptar el helper `breadcrumbLd` (ya provisto)

El refactor de JSON-LD en curso ya creó `lib/jsonld.ts` con `breadcrumbLd(pagePath, crumbs)`, que hace justo lo que estas páginas necesitan: numera las migas desde 1, **añade "Inicio" automáticamente** y ancla el `@id` desde `pagePath`. No hay que crear ni testear nada nuevo — solo importarlo desde `@/lib/jsonld` en las Tasks 5 y 6.

**Files:** ninguno (verificación).

**Interfaces:**
- Consumes: nada.
- Produces (ya existe): `breadcrumbLd(pagePath: string, crumbs: { name: string; path: string }[]): object` desde `@/lib/jsonld`. `crumbs` **NO** incluye "Inicio" (se añade solo). Ej.: `breadcrumbLd("/servicios/desarrollo-web", [{ name: "Servicios", path: "/servicios" }, { name: "Desarrollo web a medida en Colombia", path: "/servicios/desarrollo-web" }])`.

- [ ] **Step 1: Confirmar que el helper existe**

Run:
```bash
cat lib/jsonld.ts
```
Expected: contiene `export function breadcrumbLd(pagePath, crumbs)`. Si NO existiera (porque el refactor JSON-LD no se integró en esta rama), créalo primero con este contenido:
```ts
/**
 * Helpers de datos estructurados (schema.org) reutilizables entre páginas.
 * Cada página arma su propio @graph e inserta estos nodos donde corresponda.
 */
import { SEO } from "@/lib/seo";

const SITE_URL = SEO.siteUrl;

type Crumb = { name: string; path: string };

/** Nodo BreadcrumbList. "Inicio" se añade solo; pasá solo los niveles siguientes. */
export function breadcrumbLd(pagePath: string, crumbs: Crumb[]) {
  const trail: Crumb[] = [{ name: "Inicio", path: "/" }, ...crumbs];
  return {
    "@type": "BreadcrumbList",
    "@id": `${SITE_URL}${pagePath}#breadcrumb`,
    itemListElement: trail.map((crumb, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: crumb.name,
      item: `${SITE_URL}${crumb.path}`,
    })),
  };
}
```

(Sin commit propio: el helper ya está versionado por el trabajo de JSON-LD.)

---

### Task 3: Tipo `ServicePage` + módulo de datos

**Files:**
- Create: `lib/content/service-pages.ts`
- Modify: `lib/content/index.ts` (barrel)

**Interfaces:**
- Consumes: `Block` de `./blocks`; `LucideIcon` + iconos de `lucide-react`.
- Produces (re-exportado por el barrel `@/lib/content`): tipos `ServiceFeature`, `ServicePage` y el array `SERVICE_PAGES: ServicePage[]` con 4 entradas cuyos `slug` son `desarrollo-web`, `apps-a-medida`, `ecommerce`, `desarrollo-web-villavicencio`.

> **Nota de nombres:** el módulo `lib/content/services.ts` de Fase 1 ya exporta `Service`/`SERVICES` (las tarjetas de la home). Este archivo nuevo, `service-pages.ts`, exporta `ServicePage`/`SERVICE_PAGES` (las páginas dedicadas). No hay colisión.

- [ ] **Step 1: Crear el tipo y una entrada completa de ejemplo**

Create `lib/content/service-pages.ts`:
```ts
import { Code2, Gauge, Globe, type LucideIcon } from "lucide-react";
import type { Block } from "./blocks";

export type ServiceFeature = { icon: LucideIcon; title: string; desc: string };

export type ServicePage = {
  slug: string;
  seo: { title: string; description: string };
  /** ISO 8601; editar a mano al cambiar el contenido (alimenta el sitemap). */
  lastModified: string;
  hero: { eyebrow: string; h1: string; intro: string };
  /** Grid "Qué incluye" (3 tarjetas). */
  features: ServiceFeature[];
  /** Cuerpo largo para SEO: proceso, tecnologías, FAQ… El "más texto". */
  body: Block[];
  cta: { title: string; subtitle: string };
};

export const SERVICE_PAGES: ServicePage[] = [
  {
    slug: "desarrollo-web",
    seo: {
      title: "Desarrollo web a medida en Colombia | XyraCode",
      description:
        "Desarrollo web a medida en Colombia: sitios rápidos, medibles y sin plantillas, del prototipo a producción. Código propio y un solo responsable.",
    },
    lastModified: "2026-07-13",
    hero: {
      eyebrow: "Desarrollo web",
      h1: "Desarrollo web a medida en Colombia",
      intro:
        "Sitios corporativos y landings hechos a mano, pensados para cargar rápido, posicionar y convertir. Sin plantillas, sin ataduras: código propio que puedes escalar.",
    },
    features: [
      {
        icon: Globe,
        title: "Sitios a medida",
        desc: "Cada página se diseña y programa para tu negocio, no se rellena una plantilla genérica.",
      },
      {
        icon: Gauge,
        title: "Rendimiento y SEO técnico",
        desc: "Core Web Vitals, HTML semántico y metadata cuidada para que Google te encuentre.",
      },
      {
        icon: Code2,
        title: "Código propio",
        desc: "Te entregamos el código y la infraestructura: sin lock-in a un constructor cerrado.",
      },
    ],
    body: [
      { kind: "h2", text: "Qué resuelve un sitio web a medida" },
      {
        kind: "p",
        text: "TRANSCRIBIR desde contenido/borradores/servicio-desarrollo-web.md — párrafos, listas y FAQ como bloques h2/p/ul.",
      },
    ],
    cta: {
      title: "¿Listo para tu nuevo sitio?",
      subtitle:
        "Cuéntanos qué necesitas y te enviamos una primera propuesta en 48 horas.",
    },
  },
];
```

> El objeto `desarrollo-web` es la **forma de referencia** (completo y válido salvo el `body`, que es un marcador de transcripción). En el Step 2 se reemplaza su `body` por el contenido real y se añaden las otras 3 entradas con la misma forma.

- [ ] **Step 2: Transcribir el contenido real desde los borradores**

Para cada uno de los 4 servicios (`desarrollo-web`, `apps-a-medida`, `ecommerce`, `desarrollo-web-villavicencio`):
1. Abre el borrador correspondiente en `contenido/borradores/servicio-<slug>.md`.
2. Copia `seo_title` → `seo.title`, `seo_description` → `seo.description`, `h1` → `hero.h1`, el eyebrow/intro del hero → `hero.eyebrow`/`hero.intro`.
3. Convierte el cuerpo markdown a `body: Block[]`: cada `##` → `{ kind: "h2", text }`, cada párrafo → `{ kind: "p", text }`, cada lista → `{ kind: "ul", items: [...] }`, cada cita → `{ kind: "quote", text }`. (Servicios no lleva imágenes; si un borrador incluyera una, usar `{ kind: "image", src, alt, width, height, caption? }` con `width`/`height` reales — el `Block` de Fase 1 los exige.)
4. Elige 3 `features` con iconos lucide apropiados. Iconos disponibles del handoff: `Gauge`, `PenTool`, `Code2`, `Globe`, `LayoutDashboard`, `ShoppingCart`, `MapPin`. Añade al `import` de cabecera solo los que uses.
5. Deja `lastModified: "2026-07-13"`.
6. Si el borrador trae algún `[DATO REAL PENDIENTE: ...]`, cópialo literal en el bloque correspondiente y anótalo para la verificación final.

Run: `npx tsc --noEmit`
Expected: sin errores (los 4 objetos cumplen el tipo `ServicePage`).

- [ ] **Step 3: Re-exportar desde el barrel**

Modify `lib/content/index.ts` — añadir junto a los demás `export *`:
```ts
export * from "./service-pages";
```
Run: `npx tsc --noEmit`
Expected: sin errores; `@/lib/content` ahora exporta `SERVICE_PAGES`, `ServicePage`, `ServiceFeature`.

- [ ] **Step 4: Commit**

```bash
git add lib/content/service-pages.ts lib/content/index.ts
git commit -m "feat(content): tipo ServicePage + datos de los 4 servicios"
```

---

### Task 4: Componente `Breadcrumb`

**Files:**
- Create: `components/ui/Breadcrumb.tsx`
- Create: `components/ui/Breadcrumb.test.tsx`

**Interfaces:**
- Consumes: `next/link`.
- Produces: `type Crumb = { label: string; href?: string }` y `Breadcrumb({ items }: { items: Crumb[] })` desde `@/components/ui/Breadcrumb` — `<nav>` mono con separadores `/`; los items con `href` son enlaces, el último (sin `href`) lleva `aria-current="page"` y color teal.

- [ ] **Step 1: Escribir el test que falla**

Create `components/ui/Breadcrumb.test.tsx`:
```tsx
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Breadcrumb } from "./Breadcrumb";

describe("Breadcrumb", () => {
  it("enlaza los items con href y marca el último como página actual", () => {
    render(
      <Breadcrumb
        items={[
          { label: "Inicio", href: "/" },
          { label: "Servicios", href: "/servicios" },
          { label: "Desarrollo web" },
        ]}
      />,
    );
    expect(screen.getByRole("link", { name: "Inicio" })).toHaveAttribute(
      "href",
      "/",
    );
    expect(screen.getByRole("link", { name: "Servicios" })).toHaveAttribute(
      "href",
      "/servicios",
    );
    const current = screen.getByText("Desarrollo web");
    expect(current).toHaveAttribute("aria-current", "page");
    expect(screen.queryByRole("link", { name: "Desarrollo web" })).toBeNull();
  });
});
```

- [ ] **Step 2: Ejecutar el test y verificar que falla**

Run: `npm test -- Breadcrumb`
Expected: FAIL — no existe `./Breadcrumb`.

- [ ] **Step 3: Implementar el componente**

Create `components/ui/Breadcrumb.tsx`:
```tsx
import Link from "next/link";

export type Crumb = { label: string; href?: string };

/** Migas de pan mono/teal. El último item (sin href) es la página actual. */
export function Breadcrumb({ items }: { items: Crumb[] }) {
  return (
    <nav
      aria-label="Migas de pan"
      className="font-mono text-[13px] text-[rgba(226,247,242,0.5)]"
    >
      <ol className="flex flex-wrap items-center gap-2">
        {items.map((item, i) => (
          <li key={item.label} className="flex items-center gap-2">
            {item.href ? (
              <Link
                href={item.href}
                className="transition-colors hover:text-teal-300 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-teal-300"
              >
                {item.label}
              </Link>
            ) : (
              <span aria-current="page" className="text-teal-300">
                {item.label}
              </span>
            )}
            {i < items.length - 1 && <span aria-hidden>/</span>}
          </li>
        ))}
      </ol>
    </nav>
  );
}
```

- [ ] **Step 4: Ejecutar el test y verificar que pasa**

Run: `npm test -- Breadcrumb`
Expected: PASS.

- [ ] **Step 5: Typecheck y commit**

```bash
npx tsc --noEmit
git add components/ui/Breadcrumb.tsx components/ui/Breadcrumb.test.tsx
git commit -m "feat(ui): componente Breadcrumb con test"
```

---

### Task 5: Ruta `/servicios/[slug]`

**Files:**
- Create: `app/servicios/[slug]/page.tsx`

**Interfaces:**
- Consumes: `SERVICE_PAGES` de `@/lib/content`; `SEO` de `@/lib/seo`, `breadcrumbLd` de `@/lib/jsonld`; `ArticleBody`, `Breadcrumb`, `Navbar`, `Footer`, `Button`, `Eyebrow`, `Reveal`.
- Produces: 4 páginas estáticas (una por slug) con `<h1>` único, `generateMetadata`, `generateStaticParams`, `dynamicParams = false`, y JSON-LD `Service` + `BreadcrumbList`.

- [ ] **Step 1: Crear la página**

Create `app/servicios/[slug]/page.tsx`:
```tsx
import { ArrowRight } from "lucide-react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArticleBody } from "@/components/content/ArticleBody";
import { Footer } from "@/components/sections/Footer";
import { Navbar } from "@/components/sections/Navbar";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { Button } from "@/components/ui/Button";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Reveal } from "@/components/ui/Reveal";
import { SERVICE_PAGES } from "@/lib/content";
import { breadcrumbLd } from "@/lib/jsonld";
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
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Service",
        "@id": `${SITE_URL}${path}#service`,
        name: page.hero.h1,
        description: page.seo.description,
        url: `${SITE_URL}${path}`,
        provider: { "@id": `${SITE_URL}/#organization` },
        areaServed: { "@type": "Country", name: SEO.address.country },
      },
      breadcrumbLd(path, [
        { name: "Servicios", path: "/servicios" },
        { name: page.hero.h1, path },
      ]),
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
                { label: page.hero.h1 },
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

        {/* Qué incluye */}
        <section aria-labelledby="incluye-title" className="px-6 pb-22 md:px-16">
          <div className="mx-auto flex max-w-225 flex-col gap-10">
            <Reveal>
              <h2
                id="incluye-title"
                className="text-[32px] font-extrabold tracking-[-0.03em] md:text-[40px]"
              >
                Qué incluye
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
    </>
  );
}
```

- [ ] **Step 2: Typecheck, lint y build**

Run:
```bash
npx tsc --noEmit
npm run lint
npm run build
```
Expected: verde. En la salida de `build` deben aparecer prerenderizadas las 4 rutas `/servicios/desarrollo-web`, `/servicios/apps-a-medida`, `/servicios/ecommerce`, `/servicios/desarrollo-web-villavicencio`.

- [ ] **Step 3: Verificar en el navegador**

Run: `npm run dev` y abre `http://localhost:3000/servicios/desarrollo-web`.
Expected: hero con breadcrumb + un solo `<h1>`, grid "Qué incluye" con 3 tarjetas, cuerpo largo estilado (`.prose-xyra`), CTA. Ver el fuente (Ctrl+U) y confirmar el `<script type="application/ld+json">` con `Service` + `BreadcrumbList`. Detén el server al terminar.

- [ ] **Step 4: Commit**

```bash
git add app/servicios/[slug]/page.tsx
git commit -m "feat(servicios): pagina dinamica /servicios/[slug] con JSON-LD"
```

---

### Task 6: Hub `/servicios`

**Files:**
- Create: `app/servicios/page.tsx`

**Interfaces:**
- Consumes: `SERVICE_PAGES` de `@/lib/content`; `SEO` de `@/lib/seo`, `breadcrumbLd` de `@/lib/jsonld`; `Navbar`, `Footer`, `Eyebrow`, `Reveal`, `next/link`.
- Produces: la ruta estática `/servicios` con `<h1>` propio, grid 2×2 enlazando a cada slug, `metadata` estático y JSON-LD `CollectionPage` + `BreadcrumbList`.

- [ ] **Step 1: Crear el hub**

Create `app/servicios/page.tsx`:
```tsx
import { ArrowRight } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { Footer } from "@/components/sections/Footer";
import { Navbar } from "@/components/sections/Navbar";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Reveal } from "@/components/ui/Reveal";
import { SERVICE_PAGES } from "@/lib/content";
import { breadcrumbLd } from "@/lib/jsonld";
import { SEO } from "@/lib/seo";

const HUB_TITLE = "Servicios de desarrollo web y software a medida | XyraCode";
const HUB_DESCRIPTION =
  "Desarrollo web, apps a medida y e-commerce en Colombia. Elige el servicio que necesitas: del prototipo a producción, con un solo responsable.";

export const metadata: Metadata = {
  title: { absolute: HUB_TITLE },
  description: HUB_DESCRIPTION,
  alternates: { canonical: "/servicios" },
  openGraph: {
    url: "/servicios",
    title: HUB_TITLE,
    description: HUB_DESCRIPTION,
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
              Lo que construimos para ti
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
```

- [ ] **Step 2: Typecheck, lint y build**

Run:
```bash
npx tsc --noEmit
npm run lint
npm run build
```
Expected: verde; `/servicios` prerenderizada. Abre `http://localhost:3000/servicios` (`npm run dev`) y confirma un solo `<h1>`, la grid 2×2 con 4 tarjetas enlazando a cada slug, y el JSON-LD `CollectionPage`.

- [ ] **Step 3: Commit**

```bash
git add app/servicios/page.tsx
git commit -m "feat(servicios): hub /servicios con grid y JSON-LD CollectionPage"
```

---

### Task 7: Open Graph por servicio

**Files:**
- Create: `app/servicios/[slug]/opengraph-image.tsx`

**Interfaces:**
- Consumes: `SERVICE_PAGES` de `@/lib/content`; el logo en `public/assets/brand/logo-horizontal.png` (ya usado por `app/nosotros/opengraph-image.tsx`).
- Produces: una imagen OG 1200×630 por slug, con el `hero.h1` y `hero.eyebrow` del servicio.

- [ ] **Step 1: Crear la imagen OG dinámica**

Create `app/servicios/[slug]/opengraph-image.tsx` (misma técnica que `app/nosotros/opengraph-image.tsx`, sin foto):
```tsx
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { SERVICE_PAGES } from "@/lib/content";
import { SEO } from "@/lib/seo";

export const alt = "Servicio de desarrollo de XyraCode";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export function generateStaticParams() {
  return SERVICE_PAGES.map((page) => ({ slug: page.slug }));
}

export default async function Image({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const page = SERVICE_PAGES.find((p) => p.slug === slug);
  const logo = await readFile(
    join(process.cwd(), "public/assets/brand/logo-horizontal.png"),
    "base64",
  );
  const logoSrc = `data:image/png;base64,${logo}`;
  const eyebrow = page?.hero.eyebrow ?? "Servicios";
  const title = page?.hero.h1 ?? "Servicios";

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
            {eyebrow}
          </div>
          <div
            style={{
              display: "flex",
              fontSize: 60,
              fontWeight: 800,
              lineHeight: 1.06,
              letterSpacing: -2,
              maxWidth: 900,
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

- [ ] **Step 2: Build y verificación**

Run: `npm run build`
Expected: verde; el build genera `opengraph-image` para cada slug. Opcional: `npm run dev` y abrir `http://localhost:3000/servicios/desarrollo-web/opengraph-image` para ver el PNG.

- [ ] **Step 3: Commit**

```bash
git add app/servicios/[slug]/opengraph-image.tsx
git commit -m "feat(servicios): Open Graph por servicio (titulo + eyebrow)"
```

---

### Task 8: Sitemap + enlazado interno (nav y footer)

**Files:**
- Modify: `app/sitemap.ts`
- Modify: `lib/content/ui.ts` (nav links — ubicación tras Fase 1)
- Modify: `lib/content/social.ts` (columna "Servicios" del footer — ubicación tras Fase 1)

**Interfaces:**
- Consumes: `SERVICE_PAGES` de `@/lib/content` (en `sitemap.ts`).
- Produces: `/servicios` y las 4 rutas de servicio en el sitemap; el enlace "Servicios" de la navbar apunta a `/servicios`; la columna "Servicios" del footer enlaza a las páginas reales.

- [ ] **Step 1: Sitemap dirigido por datos**

Reemplazar el contenido de `app/sitemap.ts` por:
```ts
import type { MetadataRoute } from "next";
import { SERVICE_PAGES } from "@/lib/content";

// Fecha real del último cambio de contenido de cada ruta fija (ISO 8601).
// Actualizar a mano — NO usar new Date() (le diría a Google que todo el
// sitio cambió en cada build). Las rutas de servicio derivan su fecha del
// campo lastModified de cada ServicePage.
const LAST_MODIFIED = {
  home: "2026-07-13",
  serviciosHub: "2026-07-13",
  nosotros: "2026-07-13",
} as const;

const BASE = "https://xyracode.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const servicePages: MetadataRoute.Sitemap = SERVICE_PAGES.map((page) => ({
    url: `${BASE}/servicios/${page.slug}`,
    lastModified: page.lastModified,
    changeFrequency: "monthly",
    priority: 0.8,
  }));

  return [
    {
      url: BASE,
      lastModified: LAST_MODIFIED.home,
      changeFrequency: "monthly",
      priority: 1,
    },
    {
      url: `${BASE}/servicios`,
      lastModified: LAST_MODIFIED.serviciosHub,
      changeFrequency: "monthly",
      priority: 0.9,
    },
    ...servicePages,
    {
      url: `${BASE}/nosotros`,
      lastModified: LAST_MODIFIED.nosotros,
      changeFrequency: "monthly",
      priority: 0.7,
    },
  ];
}
```

- [ ] **Step 2: Navbar → /servicios**

En `lib/content/ui.ts`, dentro de `UI.nav.links`, cambiar la entrada de Servicios de la ancla a la página:
```ts
// Antes:
{ label: "Servicios", href: "/#servicios" },
// Después:
{ label: "Servicios", href: "/servicios" },
```
(Dejar el resto de links igual. El `usePathname` de `Navbar` marcará "Servicios" como activo en `/servicios`.)

- [ ] **Step 3: Footer → páginas de servicio**

En `lib/content/social.ts`, dentro de `FOOTER_COLUMNS`, reemplazar los items de la columna "Servicios" (que hoy apuntan a `#servicios`) por enlaces a las páginas reales:
```ts
items: [
  { label: "Desarrollo web", href: "/servicios/desarrollo-web" },
  { label: "Apps a medida", href: "/servicios/apps-a-medida" },
  { label: "E-commerce", href: "/servicios/ecommerce" },
  { label: "Ver todos los servicios", href: "/servicios" },
],
```
(Mantener el `title` de la columna. Estos son enlaces internos: NO llevan `external: true`.)

- [ ] **Step 4: Typecheck, lint y build**

Run:
```bash
npx tsc --noEmit
npm run lint
npm run build
```
Expected: verde. Abre `http://localhost:3000/sitemap.xml` (`npm run dev`) y confirma que aparecen `/servicios` y las 4 rutas de servicio con sus fechas. Comprueba que el link "Servicios" de la navbar navega a `/servicios` y que el footer enlaza a las páginas.

- [ ] **Step 5: Commit**

```bash
git add app/sitemap.ts lib/content/ui.ts lib/content/social.ts
git commit -m "feat(seo): sitemap dirigido por datos + enlazado interno a /servicios"
```

---

## Verificación final de la fase

- [ ] `npm test` → todos los tests en verde (ArticleBody, breadcrumbNode, Breadcrumb + los de Fase 1).
- [ ] `npx tsc --noEmit` → sin errores.
- [ ] `npm run lint` → sin errores.
- [ ] `npm run build` → build completa; se prerenderizan `/servicios`, `/servicios/desarrollo-web`, `/servicios/apps-a-medida`, `/servicios/ecommerce`, `/servicios/desarrollo-web-villavicencio` y sus `opengraph-image`.
- [ ] `npm run dev` + revisión manual: cada página tiene **un solo `<h1>`**, cuerpo largo estilado, y JSON-LD válido (pegar el bloque en https://validator.schema.org/ para `Service`/`CollectionPage`/`BreadcrumbList`).
- [ ] `sitemap.xml` incluye las 5 rutas nuevas; navbar y footer enlazan a `/servicios`.
- [ ] **Placeholders de contenido:** listar cualquier `[DATO REAL PENDIENTE: ...]` que haya quedado transcrito desde los borradores, para que el cliente los confirme antes de publicar.

## Notas de auto-revisión (cobertura vs handoff)

- **Hub `/servicios` (handoff §2)** → Task 6. ✅
- **Página de servicio `/servicios/[slug]` (handoff §1)** → Task 5. Se añade además el cuerpo largo `body: Block[]` que el handoff no maqueta pero que ambos informes SEO exigen (el "más texto"). ✅
- **Modelo de datos tipado (`ServicePage`) en `lib/content/`** → Task 3. ✅
- **BlockRenderer estilado / ancho de lectura** → Task 1 (`ArticleBody` + `.prose-xyra`). ✅
- **`generateMetadata` / `generateStaticParams` / sitemap dirigido por datos / JSON-LD por `@id`** → Tasks 5, 6, 8 (reutilizando `breadcrumbLd` de `@/lib/jsonld`, ver Task 2). ✅
- **OG por ruta (`opengraph-image.tsx`)** → Task 7. ✅
- **Enlazado interno (nav/footer → /servicios)** → Task 8. ✅
- **Diferido a fases siguientes (fuera de alcance de 2a):**
  - `caseStudyHref` / mini-caso dentro del servicio → depende de que existan las páginas de caso (Fase 2b).
  - Nodo `#person` como autor reutilizable → se extrae en Fase 2c (blog), donde el autor importa; los servicios usan `provider: #organization`.
  - Componente `Chip` de tags → Fase 2b (proyectos).
```