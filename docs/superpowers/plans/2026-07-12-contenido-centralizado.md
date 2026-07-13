# Contenido centralizado — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Centralizar todo el texto editable del sitio — SEO en `lib/seo.ts` nuevo, textos de UI y del formulario en `lib/content.ts` — sin cambiar nada de lo que se ve (salvo 3 redacciones y "Probá"→"Prueba" ya aprobadas).

**Architecture:** `lib/seo.ts` (nuevo) exporta un objeto `SEO` con la única copia de cada dato de metadata/estructurado; puede importar de `content.ts` pero no al revés (sin ciclos). `content.ts` gana `FOUNDER.github`, `FOUNDER.jobTitle` y dos bloques nuevos `UI` y `CONTACT_FORM`. Todos los consumidores (layout, manifest, OG images, /nosotros, componentes de sección, formulario y server action) pasan a leer de ahí. El JSON-LD deja de duplicar strings y se deriva de `SEO`/`FOUNDER`/`CREDENTIALS`.

**Tech Stack:** Next.js 16.2.10 (App Router), React 19, TypeScript 5, Tailwind 4, resend, lucide-react.

**Spec:** `docs/superpowers/specs/2026-07-12-contenido-centralizado-design.md`

## Global Constraints

- Español de Colombia con tuteo. Unificar el único desliz a voseo ("Probá de nuevo… escribinos") al tuteo del resto ("Prueba de nuevo… escríbenos").
- Cambio visual cero: mismos textos, markup y clases. Únicas diferencias aceptadas en el HTML servido: las 3 redacciones aprobadas (abajo) y que el `sameAs`/textos ya no se desincronicen.
- Se centraliza lo editable (texto visible, formulario/emails, SEO/JSON-LD). Se QUEDA en los componentes lo decorativo temático: prompts `$ …`, líneas de build (`TERMINAL_LINES`), nombres de archivo ficticios (`deploy.sh`, `whoami.txt`, `logout.log`, `sobre-mi.sh`), hashes del timeline, y los titulares OG con spans de color (`impulsan`, `detrás de XyraCode`).
- No hay framework de tests. Verificación por tarea: `npx tsc --noEmit` y `npm run lint` (hay 1 warning preexistente conocido en `app/opengraph-image.tsx` — no lo cuentes como nuevo). Verificación final: `npm run build` + comparar HTML servido antes/después.
- Sin ciclos de import: `seo.ts` → `content.ts` (una dirección). `content.ts` NO importa `seo.ts`.
- Commits en español, conventional commits.
- **Precondición cumplida:** las ediciones manuales de Yeison ya se commitearon (`30bf552`). El refactor va encima.

### Redacciones aprobadas (reemplazan el texto actual al moverlo)

1. whoami /nosotros, párrafo 1 (tras "Soy {name}."): "Antes de escribir código pasé más de 10 años del lado del cliente, vendiendo servicios de telecomunicaciones y viendo de primera mano lo que un negocio necesita para estar a la vanguardia."
2. `PERSONAL.paragraphs[1]`: "Desde aquí construimos lo que tu negocio necesita: mejorar tus ventas, ordenar tus procesos y, a un clic de distancia, reunirnos para plantear las mejores ideas."
3. `PERSONAL.paragraphs[2]`: "Trabajo con clientes de cualquier parte, pero siempre tendrás la atención directa de quien construye tu proyecto."

El punto 2 resuelve el placeholder de hobbies (elimina el texto "(hobbies pendientes de definir)").

---

## File Structure

- **Create** `lib/seo.ts` — objeto `SEO`, importa `CONTACT`/`FOUNDER` de content.
- **Modify** `lib/content.ts` — `FOUNDER.github`, `FOUNDER.jobTitle`, `UI`, `CONTACT_FORM`; aplicar redacciones 2 y 3 en `PERSONAL`.
- **Modify** consumidores: `app/layout.tsx`, `app/manifest.ts`, `app/opengraph-image.tsx`, `app/nosotros/opengraph-image.tsx`, `app/nosotros/page.tsx`, `app/actions/contact.ts`, `components/sections/{Navbar,Hero,Services,Process,Portfolio,Cta,Footer,TrustStrip,ScheduleButton,ContactForm}.tsx`.

---

### Task 1: `content.ts` — `FOUNDER` ampliado + bloques `UI` y `CONTACT_FORM`

**Files:**
- Modify: `lib/content.ts`

**Interfaces:**
- Produces: `FOUNDER.github: string`, `FOUNDER.jobTitle: string`, `export const UI`, `export const CONTACT_FORM`. Consumidos por seo.ts (Task 2) y por todos los consumidores (Tasks 3-7).

- [ ] **Step 1: Ampliar `FOUNDER`**

En `lib/content.ts`, en el objeto `FOUNDER` (~165-171), agregar dos campos:

```ts
export const FOUNDER = {
  name: "Yeison Enciso",
  /** Ruta en /public de la foto; si se pone en null, se muestra un marco placeholder. */
  photo: "/assets/founder.png" as string | null,
  /** Título corto para JSON-LD (jobTitle). La versión larga vive en ABOUT_TERMINAL. */
  jobTitle: "Fundador & desarrollador full-stack",
  /** Perfil personal de GitHub (fuente única: credenciales + sameAs del JSON-LD). */
  github: "https://github.com/YEENDJ",
  role: "fundador & desarrollador full-stack",
  experience: "1 año construyendo productos web",
} as const;
```

- [ ] **Step 2: Aplicar redacciones 2 y 3 en `PERSONAL`**

Reemplazar los párrafos 2 y 3 (quitando el comentario PLACEHOLDER de hobbies):

```ts
/** Párrafos de la card "logout.log" del hero de /nosotros. */
export const PERSONAL = {
  paragraphs: [
    "Vivo y trabajo desde Villavicencio, la puerta del llano. Podría trabajar desde cualquier parte; me quedo porque desde aquí se construye igual de bien y se vive mejor.",
    "Desde aquí construimos lo que tu negocio necesita: mejorar tus ventas, ordenar tus procesos y, a un clic de distancia, reunirnos para plantear las mejores ideas.",
    "Trabajo con clientes de cualquier parte, pero siempre tendrás la atención directa de quien construye tu proyecto.",
  ],
} as const;
```

- [ ] **Step 3: Agregar bloque `UI` antes de `// ---------- Redes ----------`**

```ts
// ---------- Textos de UI ----------

/** Copys visibles de la landing y de /nosotros (lo temático/decorativo vive en los componentes). */
export const UI = {
  nav: {
    // Anclas con "/" inicial para que funcionen también desde /nosotros.
    links: [
      { label: "Servicios", href: "/#servicios" },
      { label: "Proceso", href: "/#proceso" },
      { label: "Proyectos", href: "/#portfolio" },
      { label: "Nosotros", href: "/nosotros" },
    ],
    cta: "Cotizar",
    homeAria: "XyraCode — inicio",
    navAria: "Principal",
    openMenu: "Abrir menú",
    closeMenu: "Cerrar menú",
  },
  hero: {
    eyebrow: "Agencia de desarrollo web",
    paragraph:
      "Diseñamos sitios, apps y plataformas. Del prototipo a producción — rápido, escalable y sin fricción.",
    ctaPrimary: "Empezar proyecto",
    ctaSecondary: "Ver proyectos",
  },
  trust: { label: "Stack", aria: "Stack tecnológico" },
  services: {
    eyebrow: "Qué hacemos",
    title: "Servicios a medida",
    subtitle: "Todo el ciclo de tu producto digital, con un solo equipo.",
  },
  process: { eyebrow: "Cómo trabajamos", title: "Proceso en 4 pasos" },
  portfolio: {
    eyebrow: "Proyecto destacado",
    title: "Nuestro trabajo",
    liveSite: "Ver sitio",
    caseStudy: "Caso de estudio",
  },
  cta: {
    eyebrow: "¿Tienes un proyecto?",
    title: "Construyamos algo que funcione",
    paragraph:
      "Cuéntanos tu idea y te enviamos una propuesta en 48 horas. Completa el formulario o, si prefieres, escríbenos directo.",
    whatsapp: "WhatsApp",
    emailPrefix: "O por correo a",
    schedule: "Agendar llamada",
  },
  footer: {
    tagline:
      "Agencia de desarrollo web. Diseño y código a medida para que tu negocio escale.",
    copyright: "© 2026 XyraCode. Todos los derechos reservados.",
    madeWith: "hecho con </> en Colombia",
  },
  nosotros: {
    headingPrefix: "El desarrollador detrás de",
    wordmarkAlt: "XyraCode",
    photoAlt: `Retrato de ${FOUNDER.name}, fundador de XyraCode`,
    photoPlaceholder: "[tu foto]",
    /** Párrafos de la card whoami.txt (tras "Soy {name}."). */
    whoami: [
      "Antes de escribir código pasé más de 10 años del lado del cliente, vendiendo servicios de telecomunicaciones y viendo de primera mano lo que un negocio necesita para estar a la vanguardia.",
      "XyraCode es una agencia que nace desde la necesidad de ayudar a los emprendedores a llevar sus ideas al mercado.",
    ],
    heroCtaPrimary: "Hablemos",
    heroCtaSecondary: "Ver proyectos",
    historyTitle: "Mi historia",
    credentialsTitle: "Credenciales verificables",
    manifestoTitle: "Cómo trabajo",
    finalCtaTitle: "¿Trabajamos juntos?",
    whatsappCta: "Escríbeme por WhatsApp",
    sobreMiAria: "Sobre mí",
  },
} as const;
```

- [ ] **Step 4: Agregar bloque `CONTACT_FORM`**

```ts
// ---------- Formulario de contacto ----------

/** Copys del formulario, validaciones y plantilla de email (consumidos por
 *  ContactForm.tsx y app/actions/contact.ts). */
export const CONTACT_FORM = {
  aria: "Formulario de contacto",
  labels: { nombre: "Nombre", email: "Email", mensaje: "Mensaje" },
  placeholders: {
    nombre: "¿Cómo te llamas?",
    email: "nombre@empresa.com",
    mensaje: "Cuéntanos tu proyecto: qué necesitas, para cuándo…",
  },
  submit: "Enviar mensaje",
  submitting: "Enviando…",
  legal:
    "Al enviar aceptas el tratamiento de tus datos para responder tu solicitud (Ley 1581 de 2012, Colombia).",
  success: {
    title: "¡Mensaje enviado!",
    body: "Te responderemos en el menor tiempo posible.",
  },
  validation: {
    nombreRequired: "Cuéntanos tu nombre.",
    nombreMax: "Máximo 100 caracteres.",
    emailRequired: "Necesitamos tu email para responderte.",
    emailInvalid: "Ese email no parece válido.",
    mensajeRequired: "Cuéntanos brevemente tu proyecto.",
    mensajeMax: "Máximo 5000 caracteres.",
  },
  sendError:
    "No pudimos enviar tu mensaje. Prueba de nuevo en un momento o escríbenos por WhatsApp.",
  email: {
    fromFallback: "XyraCode Web <web@xyracode.com>",
    subject: (nombre: string) => `Nuevo contacto desde la web: ${nombre}`,
    body: (nombre: string, email: string, mensaje: string) =>
      `Nombre: ${nombre}\nEmail: ${email}\n\n${mensaje}`,
  },
} as const;
```

- [ ] **Step 5: Verificar y commit**

Run: `npx tsc --noEmit` → sin errores. `npm run lint` → sin errores nuevos.
```bash
git add lib/content.ts
git commit -m "feat(content): FOUNDER ampliado y bloques UI y CONTACT_FORM"
```

---

### Task 2: `lib/seo.ts` — objeto `SEO`

**Files:**
- Create: `lib/seo.ts`

**Interfaces:**
- Consumes: `CONTACT`, `FOUNDER` de `@/lib/content`.
- Produces: `export const SEO`. Consumido por Tasks 3, 4, 5.

- [ ] **Step 1: Crear `lib/seo.ts`**

```ts
/**
 * Fuente única de metadata y datos estructurados del sitio.
 * Puede leer de content.ts (CONTACT/FOUNDER); content.ts nunca importa de aquí.
 */
import { CONTACT, FOUNDER } from "@/lib/content";

export const SEO = {
  siteName: "XyraCode",
  siteUrl: "https://xyracode.com",
  /** Formato openGraph (es_CO) y BCP-47 (es-CO) según dónde se use. */
  locale: "es_CO",
  localeBcp47: "es-CO",
  googleVerification: "ITqkICxkV3qOBZsTgvQ59vLZFmcKKcMPCshPMO9vLlE",

  home: {
    title: "Desarrollo web y apps a medida en Colombia | XyraCode",
    titleTemplate: "%s | XyraCode",
    description:
      "Agencia en Colombia de desarrollo web y apps a medida. Diseñamos sitios, apps y plataformas del prototipo a producción: rápido, escalable y sin fricción.",
    /** Versión corta: openGraph, twitter y JSON-LD WebSite. */
    shortDescription:
      "Agencia en Colombia de desarrollo web y apps a medida. Del prototipo a producción: rápido, escalable y sin fricción.",
    /** JSON-LD de la organización. */
    orgDescription:
      "Agencia de desarrollo web y apps a medida. Sitios, apps y plataformas del prototipo a producción.",
  },

  nosotros: {
    title: "Nosotros — El desarrollador detrás de XyraCode",
    description:
      "XyraCode es una agencia unipersonal de desarrollo web en Villavicencio, Colombia. Más de 10 años entendiendo clientes antes de programar: trato directo, un solo responsable y código propio.",
    ogDescription:
      "Agencia de desarrollo web en Villavicencio, Colombia. Más de 10 años entendiendo clientes antes de programar.",
  },

  manifest: {
    name: "XyraCode — Desarrollo web y apps a medida",
    shortName: "XyraCode",
  },

  /** Dirección para PostalAddress (JSON-LD). */
  address: {
    locality: "Villavicencio",
    region: "Meta",
    countryCode: "CO",
    country: "Colombia",
  },

  org: {
    knowsAbout: [
      "Desarrollo web",
      "Desarrollo de aplicaciones móviles",
      "Diseño de software a medida",
    ],
  },

  person: {
    knowsAbout: ["React", "Next.js", "Node", "TypeScript", "PostgreSQL"],
    henry: { name: "Henry", url: "https://www.soyhenry.com" },
    sena: { name: "SENA", url: "https://www.sena.edu.co" },
  },

  /** Textos planos de las imágenes Open Graph (los titulares con color viven en los .tsx). */
  ogImage: {
    footerRight: "xyracode.com",
    home: {
      alt: "XyraCode — Agencia de desarrollo web y apps a medida en Latinoamérica",
      eyebrow: "Agencia de desarrollo web",
      footerLeft: "Sitios · Apps · Plataformas a medida",
    },
    nosotros: {
      alt: "Yeison Enciso — El desarrollador detrás de XyraCode",
      eyebrow: "Nosotros",
      footerLeft: `${FOUNDER.name} · ${CONTACT.location}`,
    },
  },
} as const;
```

- [ ] **Step 2: Verificar y commit**

Run: `npx tsc --noEmit` → sin errores. `npm run lint` → sin errores nuevos.
```bash
git add lib/seo.ts
git commit -m "feat(seo): fuente unica de metadata en lib/seo.ts"
```

---

### Task 3: Wire `layout.tsx` + `manifest.ts` a `SEO`

**Files:**
- Modify: `app/layout.tsx`, `app/manifest.ts`

**Interfaces:**
- Consumes: `SEO` (Task 2), `CONTACT`/`SOCIALS` (ya importados en layout).

- [ ] **Step 1: `app/layout.tsx` — import y metadata**

Agregar `import { SEO } from "@/lib/seo";`. Reemplazar el objeto `metadata` para leer de `SEO.home`/`SEO.siteName`/`SEO.googleVerification`/`SEO.locale`, y `metadataBase: new URL(SEO.siteUrl)`. Reemplazar `const SITE_URL = "https://xyracode.com";` por `const SITE_URL = SEO.siteUrl;`. Valores exactos (no cambian el output):

- `title.default` = `SEO.home.title`, `title.template` = `SEO.home.titleTemplate`
- `description` = `SEO.home.description`
- `verification.google` = `SEO.googleVerification`
- `openGraph`: `locale: SEO.locale`, `siteName: SEO.siteName`, `title: SEO.home.title`, `description: SEO.home.shortDescription`
- `twitter`: `title: SEO.home.title`, `description: SEO.home.shortDescription`

- [ ] **Step 2: `app/layout.tsx` — JSON-LD**

En el `jsonLd`:
- WebSite: `name: SEO.siteName`, `description: SEO.home.shortDescription`, `inLanguage: SEO.localeBcp47`
- Org: `name: SEO.siteName`, `description: SEO.home.orgDescription`, `address` desde `SEO.address` (`addressLocality: SEO.address.locality`, `addressRegion: SEO.address.region`, `addressCountry: SEO.address.countryCode`), `areaServed.name: SEO.address.country`, `knowsAbout: [...SEO.org.knowsAbout]`, `sameAs: SOCIALS.map(...)` (sin cambio)
- `html lang` puede quedar en "es-CO" literal o `SEO.localeBcp47` (opcional; no obligatorio).

- [ ] **Step 3: `app/manifest.ts`**

Agregar `import { SEO } from "@/lib/seo";`. Reemplazar strings: `name: SEO.manifest.name`, `short_name: SEO.manifest.shortName`, `description: SEO.home.shortDescription`, `lang: SEO.localeBcp47`. Íconos y colores sin cambio.

- [ ] **Step 4: Verificar y commit**

Run: `npx tsc --noEmit`; `npm run lint`. 
```bash
git add app/layout.tsx app/manifest.ts
git commit -m "refactor(seo): layout y manifest leen de SEO"
```

---

### Task 4: Wire imágenes Open Graph a `SEO`

**Files:**
- Modify: `app/opengraph-image.tsx`, `app/nosotros/opengraph-image.tsx`

**Interfaces:**
- Consumes: `SEO.ogImage` (Task 2).

- [ ] **Step 1: `app/opengraph-image.tsx`**

Agregar `import { SEO } from "@/lib/seo";`. Reemplazar:
- `export const alt = SEO.ogImage.home.alt;`
- eyebrow "Agencia de desarrollo web" → `{SEO.ogImage.home.eyebrow}`
- pie izquierdo "Sitios · Apps · Plataformas a medida" → `{SEO.ogImage.home.footerLeft}`
- pie derecho "xyracode.com" → `{SEO.ogImage.footerRight}`
- El titular con spans (`Desarrollo web y apps a medida` / `que impulsan tu negocio`) NO se toca (decorativo con color).

- [ ] **Step 2: `app/nosotros/opengraph-image.tsx`**

Agregar `import { SEO } from "@/lib/seo";`. Reemplazar:
- `export const alt = SEO.ogImage.nosotros.alt;`
- eyebrow "Nosotros" → `{SEO.ogImage.nosotros.eyebrow}`
- pie izquierdo "Yeison Enciso · Villavicencio, Colombia" → `{SEO.ogImage.nosotros.footerLeft}`
- pie derecho "xyracode.com" → `{SEO.ogImage.footerRight}`
- El titular `El desarrollador` / `detrás de XyraCode` NO se toca (decorativo con color).

- [ ] **Step 3: Verificar y commit**

Run: `npx tsc --noEmit`; `npm run lint` (nota: opengraph-image.tsx ya tenía 1 warning preexistente).
```bash
git add app/opengraph-image.tsx app/nosotros/opengraph-image.tsx
git commit -m "refactor(seo): imagenes open graph leen textos de SEO"
```

---

### Task 5: Wire `app/nosotros/page.tsx` — metadata, JSON-LD derivado y textos UI

**Files:**
- Modify: `app/nosotros/page.tsx`

**Interfaces:**
- Consumes: `SEO` (Task 2); `UI`, `FOUNDER`, `CREDENTIALS` (Task 1 / existentes).

- [ ] **Step 1: Imports y metadata**

Agregar `import { SEO } from "@/lib/seo";` y `UI` al import de `@/lib/content`. Reemplazar `metadata`:
- `title: { absolute: SEO.nosotros.title }`
- `description: SEO.nosotros.description`
- `alternates.canonical: "/nosotros"` (sin cambio)
- `openGraph.title: SEO.nosotros.title`, `openGraph.description: SEO.nosotros.ogDescription`, `openGraph.url: "/nosotros"`

Reemplazar `const SITE_URL = "https://xyracode.com";` por `const SITE_URL = SEO.siteUrl;`.

- [ ] **Step 2: JSON-LD derivado (fin de duplicación)**

Antes del objeto `jsonLd`, calcular las URLs de credenciales desde `CREDENTIALS` (fuente única):

```ts
const henryCred = CREDENTIALS.find((c) => c.issuer === "Henry");
const senaCred = CREDENTIALS.find((c) => c.issuer === "SENA");
```

En el nodo `Person` del `jsonLd`:
- `jobTitle: FOUNDER.jobTitle`
- `address`: `addressLocality: SEO.address.locality`, `addressRegion: SEO.address.region`, `addressCountry: SEO.address.countryCode`
- `knowsAbout: [...SEO.person.knowsAbout]`
- `sameAs: [FOUNDER.github, "https://github.com/Xyra-Code"]` (personal desde FOUNDER; org queda como literal — es el GitHub de la organización, distinto del personal)
- `alumniOf`: los dos `EducationalOrganization` desde `SEO.person.henry` y `SEO.person.sena` (name + url)
- `hasCredential`: dos `EducationalOccupationalCredential`:
  - Henry: `name: "Desarrollador Full-Stack"`, `recognizedBy.name: SEO.person.henry.name`, `url: henryCred?.links?.[0]?.href`
  - SENA: `name: "Técnico en Sistemas"`, `recognizedBy.name: SEO.person.sena.name`, `url: senaCred?.links?.[0]?.href ? \`${SITE_URL}${senaCred.links[0].href}\` : undefined` (el href del SENA es una ruta relativa `/assets/...`; el JSON-LD la absolutiza como hoy). Usar spread condicional `...(url && { url })` para no emitir `url: undefined`.

El `name`, `credentialCategory: "certificate"`, `@type` y estructura se mantienen. Verificar que el JSON serializado no cambie salvo que ahora las URLs vienen de CREDENTIALS (deben coincidir byte a byte con las actuales).

- [ ] **Step 3: Textos visibles → `UI.nosotros`**

Reemplazar en el JSX:
- alt del retrato → `UI.nosotros.photoAlt`; placeholder "[tu foto]" → `UI.nosotros.photoPlaceholder`
- H1 "El desarrollador detrás de" → `{UI.nosotros.headingPrefix}` (mantener el `<Image>` wordmark); `alt="XyraCode"` del wordmark → `UI.nosotros.wordmarkAlt`
- Card whoami.txt: preservar el DOM exacto (un solo `<p>` con `<br/><br/>`). Mantener "Soy {FOUNDER.name}." en JSX (nombre en `<strong>`), y renderizar los párrafos de `UI.nosotros.whoami` unidos con `<br/><br/>`:

```tsx
<p className="px-6 py-6 text-[17px] leading-[1.75] text-[rgba(226,247,242,0.7)] md:px-8 md:py-7">
  Soy{" "}
  <strong className="font-bold text-white">{FOUNDER.name}</strong>.{" "}
  {UI.nosotros.whoami.map((para, i) => (
    <Fragment key={para}>
      {i > 0 && (
        <>
          <br />
          <br />
        </>
      )}
      {para}
    </Fragment>
  ))}
</p>
```

Agregar `Fragment` al import de `react` (junto a `type ReactNode`).
- Botones hero: "Hablemos" → `UI.nosotros.heroCtaPrimary`; "Ver proyectos" → `UI.nosotros.heroCtaSecondary`
- `aria-label="Sobre mí"` → `UI.nosotros.sobreMiAria`
- Headings: "Mi historia" → `UI.nosotros.historyTitle`; "Credenciales verificables" → `UI.nosotros.credentialsTitle`; "Cómo trabajo" → `UI.nosotros.manifestoTitle`; "¿Trabajamos juntos?" → `UI.nosotros.finalCtaTitle`
- "Escríbeme por WhatsApp" → `UI.nosotros.whatsappCta`
- El párrafo del SENA con link inline (`certificados.sena.edu.co`) NO se toca (excepción ya documentada en el archivo). Prompts `$ …` y labels de terminal NO se tocan.

- [ ] **Step 4: Verificar y commit**

Run: `npx tsc --noEmit`; `npm run lint`.
```bash
git add app/nosotros/page.tsx
git commit -m "refactor(nosotros): metadata, JSON-LD derivado y textos desde SEO y UI"
```

---

### Task 6: Wire componentes de sección a `UI`

**Files:**
- Modify: `components/sections/{Navbar,Hero,Services,Process,Portfolio,Cta,Footer,TrustStrip,ScheduleButton}.tsx`

**Interfaces:**
- Consumes: `UI` de `@/lib/content`.

- [ ] **Step 1: Navbar.tsx**

Importar `UI`. Reemplazar `NAV_LINKS` local por `UI.nav.links`. Botón "Cotizar" (x2) → `UI.nav.cta`. aria-labels: "XyraCode — inicio" → `UI.nav.homeAria`; "Principal" → `UI.nav.navAria`; `mobileNavOpen ? "Cerrar menú" : "Abrir menú"` → `mobileNavOpen ? UI.nav.closeMenu : UI.nav.openMenu`.

- [ ] **Step 2: Hero.tsx**

Importar `UI`. eyebrow "Agencia de desarrollo web" → `UI.hero.eyebrow`; párrafo → `UI.hero.paragraph`; botones "Empezar proyecto"/"Ver proyectos" → `UI.hero.ctaPrimary`/`UI.hero.ctaSecondary`. `TERMINAL_LINES`, `deploy.sh`, `tuapp.com` y el H1 con spans NO se tocan (decorativo).

- [ ] **Step 3: Services.tsx / Process.tsx**

Importar `UI`. Services: `eyebrow`/`title`/`subtitle` del `SectionHeading` → `UI.services.*`. Process: `eyebrow`/`title` → `UI.process.*`.

- [ ] **Step 4: Portfolio.tsx**

Importar `UI`. eyebrow "Proyecto destacado" → `UI.portfolio.eyebrow`; "Nuestro trabajo" → `UI.portfolio.title`; botones "Ver sitio"/"Caso de estudio" → `UI.portfolio.liveSite`/`UI.portfolio.caseStudy`.

- [ ] **Step 5: Cta.tsx / ScheduleButton.tsx**

Cta: importar `UI`. eyebrow/title/paragraph → `UI.cta.*`; "WhatsApp" → `UI.cta.whatsapp`; "O por correo a" → `UI.cta.emailPrefix`. ScheduleButton: importar `UI`; ambos "Agendar llamada" → `UI.cta.schedule` (el `?subject=Agendar%20llamada` del mailto NO se toca — es un parámetro, no texto visible).

- [ ] **Step 6: Footer.tsx / TrustStrip.tsx**

Footer: importar `UI`. tagline → `UI.footer.tagline`; copyright → `UI.footer.copyright`; "hecho con </> en Colombia" → `UI.footer.madeWith`. TrustStrip: importar `UI`; aria-label "Stack tecnológico" → `UI.trust.aria`; "Stack" → `UI.trust.label`.

- [ ] **Step 7: Verificar y commit**

Run: `npx tsc --noEmit`; `npm run lint`.
```bash
git add components/sections
git commit -m "refactor(ui): componentes de seccion leen textos de UI"
```

---

### Task 7: Wire `ContactForm.tsx` + `contact.ts` a `CONTACT_FORM`

**Files:**
- Modify: `components/sections/ContactForm.tsx`, `app/actions/contact.ts`

**Interfaces:**
- Consumes: `CONTACT_FORM` de `@/lib/content` (Task 1).

- [ ] **Step 1: `ContactForm.tsx`**

Importar `CONTACT_FORM`. Reemplazar:
- success: "¡Mensaje enviado!" → `CONTACT_FORM.success.title`; "Te responderemos…" → `CONTACT_FORM.success.body`
- `aria-label="Formulario de contacto"` → `CONTACT_FORM.aria`
- labels "Nombre"/"Email"/"Mensaje" → `CONTACT_FORM.labels.*`
- placeholders → `CONTACT_FORM.placeholders.*`
- botón `pending ? "Enviando…" : "Enviar mensaje"` → `pending ? CONTACT_FORM.submitting : CONTACT_FORM.submit`
- legal → `CONTACT_FORM.legal`

- [ ] **Step 2: `app/actions/contact.ts`**

Importar `CONTACT_FORM`. Reemplazar:
- validaciones → `CONTACT_FORM.validation.*` (nombreRequired, nombreMax, emailRequired, emailInvalid, mensajeRequired, mensajeMax)
- `from` fallback → `process.env.CONTACT_FROM ?? CONTACT_FORM.email.fromFallback`
- `subject` → `CONTACT_FORM.email.subject(nombre)`
- `text` → `CONTACT_FORM.email.body(nombre, email, mensaje)`
- **ambos** mensajes de error de envío (el del `if (error)` y el del `catch`) → `CONTACT_FORM.sendError` (esto unifica el voseo "Probá/escribinos" al tuteo).

- [ ] **Step 3: Verificar y commit**

Run: `npx tsc --noEmit`; `npm run lint`.
```bash
git add components/sections/ContactForm.tsx app/actions/contact.ts
git commit -m "refactor(form): formulario y server action leen de CONTACT_FORM"
```

---

### Task 8: Verificación final end-to-end

**Files:** Ninguno (verificación).

- [ ] **Step 1: Build**

Run: `npm run build` → exitoso; `/` y `/nosotros` como rutas estáticas, sin warnings de página.

- [ ] **Step 2: HTML servido antes/después**

El sitio corre en :3000. Con `curl -s` traer `/` y `/nosotros` y comprobar que el texto visible es idéntico al de antes salvo: (a) los 3 párrafos aprobados en /nosotros, (b) que no aparezca "(hobbies pendientes de definir)". Comprobar presencia de: navbar (Servicios/Proceso/Proyectos/Nosotros/Cotizar), hero eyebrow/paragraph, Services/Process/Portfolio/Cta headings, footer tagline/copyright.

- [ ] **Step 3: JSON-LD válido y sin desync**

Extraer los dos bloques `application/ld+json` (home y /nosotros), parsear con `node -e`, y comprobar:
- home: WebSite.name="XyraCode", Org con address.addressLocality="Villavicencio", knowsAbout (3), sameAs = las URLs de SOCIALS.
- /nosotros: Person con jobTitle="Fundador & desarrollador full-stack", sameAs incluye `https://github.com/YEENDJ`, alumniOf (Henry+SENA), hasCredential (2) con las URLs de Henry (certs.soyhenry.com) y SENA (xyracode.com/assets/...). Confirmar que el JSON es equivalente al de antes del refactor (mismas URLs).

- [ ] **Step 4: grep de residuos**

Buscar que no queden strings movidos hardcodeados en los consumidores (p. ej. `grep -rn "Servicios a medida\|Construyamos algo\|Probá de nuevo\|Enviar mensaje" app components` no debe encontrar literales fuera de content.ts). Si algo quedó, corregir y commitear.

- [ ] **Step 5: Commit (si hubo ajustes)**
```bash
git add -A
git commit -m "fix(content): ajustes de la verificacion final"
```

---

## Self-review (cobertura de la spec)

- SEO en archivo aparte → Task 2. UI + formulario en content.ts → Tasks 1, 6, 7. ✓
- JSON-LD derivado, fin del sameAs desincronizado → Task 5 (nosotros) + Task 3 (layout usa SOCIALS). ✓
- "Probá"→"Prueba" → Task 7 Step 2. ✓
- 3 redacciones aprobadas → Task 1 (PERSONAL) + Task 5 (whoami). ✓
- Decorativo intacto (prompts, TERMINAL_LINES, titulares OG con color) → constraints + notas por tarea. ✓
- Sin ciclos de import → seo→content unidireccional (Task 2). ✓
- FOUNDER.jobTitle corto + FOUNDER.role largo coexisten → Task 1 Step 1. ✓
