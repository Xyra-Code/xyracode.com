# Arquitectura de contenido SEO — servicios, casos de estudio y blog

**Fecha:** 2026-07-13
**Estado:** Aprobado (arquitectura), pendiente de plan de implementación
**Rama:** Yeison_DEV

## Problema

Hoy solo `/` y `/nosotros` son indexables. Google no puede posicionar a XyraCode
para intenciones concretas ("desarrollo de apps a medida", "e-commerce Next.js",
"desarrollo web Villavicencio") porque no existe una URL dedicada por intención.

La infraestructura ya está bien montada para escalar:

- `lib/content.ts` centraliza el contenido (el tipo `Project` ya prevé `caseStudyHref`).
- `lib/seo.ts` es la fuente única de metadata.
- `app/layout.tsx` monta un JSON-LD `@graph` con `@id` enlazados
  (`#website`, `#organization`); `app/nosotros/page.tsx` ya añade
  `#person` (`{SITE_URL}/nosotros#person`) y un patrón de `BreadcrumbList`.
- `app/sitemap.ts` es manual a propósito (no usa `new Date()` para no mentirle a
  Google con `lastModified`).

El cuello de botella no es el código: es el contenido único por intención.

## Alcance

Tres tipos de contenido nuevos, cada uno con su propio ciclo spec → plan →
implementación:

1. **Páginas de servicio** — hub `/servicios` + 4 páginas por intención.
2. **Casos de estudio** — `/proyectos` + caso de Vuelo Carmesí.
3. **Blog** — índice `/blog` + 1 artículo piloto.

Fuera de alcance (por ahora): CMS externo, comentarios, categorías/tags del blog,
paginación, RSS. Se añaden solo cuando el volumen real lo pida (YAGNI).

## Decisiones aprobadas

- **Contenido tipado en TS** (no MDX, no CMS).
- **Cuerpo largo con modelo de bloques (A1)**: unión discriminada `Block[]` con un
  renderer único reutilizable. Union mínimo al inicio; se amplía cuando un
  contenido real lo pida.
- **Organización de archivos: split `lib/content/` + barrel (B1)**: un módulo por
  dominio, `index.ts` re-exporta todo para no romper imports existentes.

## Arquitectura

### Rutas (App Router, Next 16)

Colecciones dirigidas por datos → una ruta dinámica `[slug]` por colección
(DRY, consistente con el contenido centralizado).

```
app/
  servicios/
    page.tsx            → hub: intro + grid de las 4 páginas + CTA
    [slug]/page.tsx     → 4 páginas (generateStaticParams desde datos)
  proyectos/
    page.tsx            → índice de casos (crece con cada proyecto)
    [slug]/page.tsx     → caso de estudio (arranca con vuelo-carmesi)
  blog/
    page.tsx            → índice de artículos
    [slug]/page.tsx     → artículo (arranca con el piloto)
```

Slugs de servicios: `desarrollo-web`, `apps-a-medida`, `ecommerce`,
`desarrollo-web-villavicencio`.

> **Nota Next 16 (AGENTS.md):** verificar contra `node_modules/next/dist/docs/`
> las firmas de `params` y `generateMetadata` (probablemente `params` es una
> `Promise` que hay que `await`) y `generateStaticParams` antes de implementar.

### Modelo de datos

Split de `lib/content.ts` (≈500 líneas) en módulos por dominio:

```
lib/content/
  contact.ts   → CONTACT, CONTACT_FORM
  ui.ts        → UI
  team.ts      → FOUNDER, ABOUT_TERMINAL, MANIFESTO, CAREER_LOG,
                 CREDENTIALS, PERSONAL
  services.ts  → SERVICES (grid home) + SERVICE_PAGES (páginas nuevas)
  projects.ts  → PROJECTS/CASE_STUDIES, STATS, STACK, STEPS
  blog.ts      → BLOG_POSTS
  social.ts    → SOCIALS, FOOTER_COLUMNS
  blocks.ts    → tipo Block (compartido)
  index.ts     → export * de cada módulo (imports existentes intactos)
```

Regla de dependencias preservada: los módulos de contenido no importan de
`lib/seo.ts`; `lib/seo.ts` puede leer de `lib/content` (`CONTACT`, `FOUNDER`).

**Modelo de bloques** (`lib/content/blocks.ts`):

```ts
export type Block =
  | { kind: "h2"; text: string }
  | { kind: "p"; text: string }
  | { kind: "ul"; items: string[] }
  | { kind: "image"; src: string; alt: string; caption?: string }
  | { kind: "quote"; text: string };
```

Renderer único (p. ej. `components/content/BlockRenderer.tsx`) que mapea
`Block[]` → JSX. Reutilizado por casos de estudio y artículos.

**Tipos nuevos** (cada uno con `slug`, `seo: { title, description }`,
`lastModified: string` ISO, `body: Block[]`):

- `ServicePage` — `slug`, `title` (h1), `intent` (frase de intención), `seo`,
  `icon` (lucide), `body: Block[]`, `relatedCaseStudySlug?`, `lastModified`.
- `CaseStudy` — extiende/complementa `Project` con `slug`, `body: Block[]`,
  `seo`, `lastModified`. Se decide en el plan si se extiende `Project` o se crea
  un tipo aparte que lo referencie. `caseStudyHref` de la home apunta a
  `/proyectos/{slug}`.
- `BlogPost` — `slug`, `title` (h1), `excerpt`, `cover: { src, alt }`,
  `publishedAt`, `lastModified`, `seo`, `body: Block[]`.

### SEO y datos estructurados

- **Metadata**: las páginas dinámicas derivan `generateMetadata` del propio objeto
  de datos (`seo.title` / `seo.description`). `lib/seo.ts` guarda solo los shells
  estáticos (hub `/servicios`, índices `/proyectos` y `/blog`).
- **sitemap.ts**: pasa a derivar las URLs de los arrays de contenido, tomando
  `lastModified` de cada item. Mantiene el principio de no usar `new Date()`.
  Añade: `/servicios`, las 4 `/servicios/{slug}`, `/proyectos`,
  `/proyectos/{slug}`, `/blog`, `/blog/{slug}`.
- **JSON-LD** (colgado del `@graph` con `@id` existente; `#person` ya existe en
  `/nosotros#person`):
  - Servicio → `Service` con `provider → #organization` + `BreadcrumbList`.
  - Caso de estudio → `CreativeWork` (o `SoftwareApplication` según encaje) con
    `author → /nosotros#person`, `publisher → #organization`, `BreadcrumbList`.
  - Artículo → `BlogPosting` con `author → /nosotros#person`, `datePublished`,
    `BreadcrumbList`.
  - Hub e índices → `CollectionPage` + `BreadcrumbList`.
  - Reutilizar el patrón de `BreadcrumbList` ya presente en `nosotros/page.tsx`.
- **Enlazado interno**: nav y footer enlazan a `/servicios` y `/blog`; la home
  enlaza al caso de estudio vía `caseStudyHref` (ya previsto en el tipo).

### Unidades y límites

- `lib/content/*` — datos puros por dominio; sin lógica de presentación.
- `BlockRenderer` — única responsabilidad: `Block[]` → JSX. Testeable en aislamiento.
- Helpers de JSON-LD por tipo (p. ej. `lib/seo` o `lib/jsonld`) — construyen los
  objetos schema.org a partir de los datos; sin JSX.
- Cada `page.tsx` — compone datos + renderer + metadata; sin contener contenido.

## Handoff visual

Dos entregables distintos:

**A) Diseño de UI/layout** (skill `frontend-design`, plantillas — no imágenes):

1. Página de servicio — hero con intención + beneficios + prueba (mini-caso) + CTA.
2. Hub `/servicios` — grid de las 4 tarjetas.
3. Índice de proyectos + plantilla de caso de estudio (hero, galería, bloques,
   stack, resultado).
4. Índice de blog + plantilla de artículo (portada, cuerpo de bloques, autor).

**B) Assets raster** (los provee el usuario):

| Asset | Para | Formato |
|---|---|---|
| 3–5 capturas más de Vuelo Carmesí (desktop + móvil, detalles) | Caso de estudio | PNG (ya hay 3 en `/assets/projects/vuelo-carmesi/`) |
| Portada del caso (cover) | Caso + OG | ~1200×630 |
| Portada del artículo piloto + 1–2 imágenes inline | Blog | cover 1200×630 |
| Íconos/ilustración por servicio | Páginas de servicio | Reutilizar lucide o SVG |

Las imágenes OG por ruta se generan por código (patrón de
`app/opengraph-image.tsx`) → sin asset manual.

## Orden de construcción (specs encadenadas)

1. **Fase 1 — Fundaciones** *(este primer plan)*: split `lib/content/` + barrel,
   `lib/content/blocks.ts` + `BlockRenderer`, helpers/entidades JSON-LD nuevas,
   sitemap dirigido por datos. Habilita todo lo demás sin cambiar rutas visibles.
2. **Fase 2 — Casos de estudio**: `/proyectos` + `/proyectos/[slug]` + Vuelo
   Carmesí. Contenido real, máximo retorno.
3. **Fase 3 — Servicios**: `/servicios` + `/servicios/[slug]` (4 páginas).
4. **Fase 4 — Blog**: `/blog` + `/blog/[slug]` + artículo piloto.

Cada fase: `generateMetadata` propio, un solo `<h1>`, enlace interno desde
home/nav, y entrada en `sitemap.ts`.

## Criterios de éxito

- Cada ruta nueva responde 200, tiene título/descripción únicos y un solo `<h1>`.
- El JSON-LD valida (Rich Results Test) y los `@id` resuelven entre entidades.
- `sitemap.xml` lista todas las rutas nuevas con `lastModified` real por item.
- Imports existentes siguen funcionando tras el split (build verde, sin cambios
  en los componentes actuales).
- Sin contenido "clon": cada página de servicio y artículo tiene texto propio.
