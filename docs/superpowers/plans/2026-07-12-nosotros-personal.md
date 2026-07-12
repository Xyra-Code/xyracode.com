# Nosotros: la persona detrás de XyraCode — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rediseñar `/nosotros` para que quien entre conozca a Yeison: historia como timeline "git log", credenciales verificables y bloque humano, manteniendo la identidad terminal existente.

**Architecture:** Todo el contenido nuevo vive como constantes tipadas en `lib/content.ts` (patrón existente `ABOUT_TERMINAL`/`MANIFESTO`). Las tres secciones nuevas se agregan inline en `app/nosotros/page.tsx` (mismo patrón de la página actual: secciones inline que consumen constantes). SEO se refuerza en el JSON-LD y metadata de la misma página.

**Tech Stack:** Next.js 16.2.10 (App Router), React 19, Tailwind CSS 4, TypeScript 5, lucide-react.

**Spec:** `docs/superpowers/specs/2026-07-12-nosotros-personal-design.md`

## Global Constraints

- Español de Colombia con tuteo (convención del repo, commit `74cfb66`).
- Mensajes de commit en español, formato conventional commits (`feat:`, `docs:`…), como el historial existente.
- Estética terminal existente: prompts `$ …` en mono `text-teal-300`, bordes `rgba(94,234,212,…)`, fondo `bg-night`, tarjetas `bg-white/3`.
- Placeholders pendientes de Yeison se marcan con comentario `// PLACEHOLDER:` (convención existente en `lib/content.ts`).
- No hay framework de tests en el repo. Verificación por tarea: `npx tsc --noEmit` y `npm run lint`; verificación final con `npm run build` y revisión visual en `npm run dev`.
- AGENTS.md: este Next.js puede diferir del conocido. Las tareas solo usan APIs ya presentes en la página (`Image`, `Metadata`, JSON-LD via `<script>`); si necesitas una API nueva, lee antes `node_modules/next/dist/docs/`.
- **Precondición:** el árbol de trabajo tiene cambios sin commitear de trabajo anterior (`app/layout.tsx`, `components/sections/*`, `lib/content.ts`, etc.). Antes de la Task 1, confirmar esos cambios aparte (p. ej. con `/commit-pr`) para que los commits de este plan queden limpios. Si no es posible, `git add` SOLO con rutas explícitas y revisar `git diff --staged` antes de cada commit.

---

### Task 1: Contenido — `CAREER_LOG`, `CREDENTIALS`, `PERSONAL` y línea `trayectoria`

**Files:**
- Modify: `lib/content.ts` (sección `// ---------- Nosotros ----------`, líneas ~163-202)

**Interfaces:**
- Consumes: tipos existentes en `lib/content.ts` (ninguno nuevo requerido).
- Produces: `export type CareerCommit`, `export const CAREER_LOG: CareerCommit[]`, `export type Credential`, `export const CREDENTIALS: Credential[]`, `export const PERSONAL` (objeto `as const` con `photo: string | null` y `paragraphs: readonly string[]`). Las tareas 2-4 los importan desde `@/lib/content`.

- [ ] **Step 1: Agregar la línea `trayectoria` a `ABOUT_TERMINAL`**

En `lib/content.ts`, dentro de `ABOUT_TERMINAL`, insertar después de la línea `{ key: "experiencia", value: FOUNDER.experience },`:

```ts
  {
    key: "trayectoria",
    value:
      "10+ años en ventas de telecomunicaciones antes del código — entiendo tu negocio, no solo tu web",
  },
```

- [ ] **Step 2: Agregar tipos y constantes nuevas**

En `lib/content.ts`, insertar después del cierre de `MANIFESTO` (línea `];` ~202) y antes de `// ---------- Redes ----------`:

```ts
// ---------- Historia (/nosotros) ----------

export type CareerCommit = {
  /** Hash decorativo estilo git, solo visual. */
  hash: string;
  /** Prefijo tipo conventional commit: init, feat, release. */
  tag: string;
  title: string;
  desc: string;
  /** Año o período; si se omite, no se muestra. */
  period?: string;
};

/** Timeline `$ git log --reverse mi-carrera` de /nosotros, en orden cronológico. */
export const CAREER_LOG: CareerCommit[] = [
  {
    hash: "a3f1c02",
    tag: "init",
    title: "Técnico en sistemas",
    desc: "Donde empezó la curiosidad por entender cómo funcionan las cosas por dentro.",
    // PLACEHOLDER: año del técnico en sistemas (agregar period: "20XX").
  },
  {
    hash: "b7d94e1",
    tag: "feat",
    title: "Más de 10 años vendiendo telecomunicaciones",
    desc: "Una década escuchando clientes, entendiendo mercados y aprendiendo qué hace que un negocio compre o no. Hoy es mi mayor ventaja: entiendo tu negocio antes de escribir la primera línea de código.",
    // PLACEHOLDER: período de la etapa en ventas (agregar period: "20XX–20XX").
  },
  {
    hash: "c2e58a9",
    tag: "feat",
    title: "Certificación full-stack en Henry",
    desc: "Formación intensiva en desarrollo web full-stack: JavaScript, React, Node y bases de datos, con proyectos reales en equipo.",
    // PLACEHOLDER: año de la certificación de Henry (agregar period: "20XX").
  },
  {
    hash: "d915f3c",
    tag: "feat",
    title: "Primeros proyectos freelance",
    desc: "Encargos reales para clientes reales. Descubrí que lo mío es construir productos de punta a punta.",
    // PLACEHOLDER: año de inicio del freelance (agregar period: "20XX").
  },
  {
    hash: "e4a07bd",
    tag: "release",
    title: "XyraCode v1.0",
    desc: "Lo formalicé: una agencia de una persona donde hablas siempre con quien construye tu producto.",
    // PLACEHOLDER: año de fundación de XyraCode (agregar period: "20XX").
  },
];

// ---------- Credenciales (/nosotros) ----------

export type Credential = {
  title: string;
  /** Entidad emisora; si se omite, no se muestra. */
  issuer?: string;
  desc: string;
  /** URL externa (verificación del certificado, perfil de GitHub…). */
  href?: string;
  /** Texto del enlace; requerido si hay href. */
  linkLabel?: string;
  /** Imagen del certificado en /public; si se omite, la tarjeta no muestra imagen. */
  image?: string;
  /** true = tarjeta protagonista (ancho completo en desktop). */
  featured?: boolean;
};

export const CREDENTIALS: Credential[] = [
  {
    title: "Desarrollador Full-Stack",
    issuer: "Henry",
    desc: "Bootcamp intensivo de desarrollo web: JavaScript, React, Node y bases de datos, con proyectos reales en equipo.",
    // PLACEHOLDER: URL de verificación del certificado de Henry (agregar href: "…").
    linkLabel: "Verificar certificado",
    // PLACEHOLDER: imagen del certificado en /public/assets (agregar image: "/assets/…").
    featured: true,
  },
  {
    title: "Técnico en Sistemas",
    // PLACEHOLDER: institución del técnico en sistemas (agregar issuer: "…").
    desc: "La base: hardware, redes y sistemas por dentro antes de escribir software.",
  },
  {
    title: "Código abierto",
    issuer: "GitHub",
    desc: "Mira cómo escribo código, no solo lo que digo de él.",
    href: "https://github.com/Xyra-Code",
    linkLabel: "Ver GitHub",
  },
];

// ---------- Lado humano (/nosotros) ----------

/** Bloque "Cuando cierro la laptop" de /nosotros. */
export const PERSONAL = {
  /** Foto natural en /public; si se pone en null, se muestra un marco placeholder. */
  photo: "/assets/foto-nosotros-natural-900.png" as string | null,
  paragraphs: [
    "Vivo y trabajo desde Villavicencio, la puerta del llano. Podría trabajar desde cualquier parte; me quedo porque desde aquí se construye igual de bien y se vive mejor.",
    // PLACEHOLDER: hobbies concretos de Yeison — reemplazar esta línea cuando los pase.
    "Cuando no estoy programando… (hobbies pendientes de definir).",
    "Trabajo con clientes de cualquier parte, pero respondo como vecino: directo y sin vueltas.",
  ],
} as const;
```

- [ ] **Step 3: Verificar tipos y lint**

Run: `npx tsc --noEmit`
Expected: sin errores.

Run: `npm run lint`
Expected: sin errores nuevos (los preexistentes en otros archivos no cuentan).

- [ ] **Step 4: Commit**

```bash
git add lib/content.ts
git diff --staged --stat   # confirmar que SOLO entra lib/content.ts
git commit -m "feat(nosotros): contenido de historia, credenciales y lado humano"
```

---

### Task 2: Sección "Mi historia" — timeline git log

**Files:**
- Modify: `app/nosotros/page.tsx` (insertar sección entre la terminal `sobre-mi.sh` que cierra en línea ~141 y el manifiesto que abre en ~143)

**Interfaces:**
- Consumes: `CAREER_LOG` de `@/lib/content` (Task 1); `Reveal` (`@/components/ui/Reveal`, props `delay`/`className`/`children`, renderiza un `<div>`).
- Produces: sección con `id="historia-title"` (solo consumo interno de la página).

- [ ] **Step 1: Importar `CAREER_LOG`**

En `app/nosotros/page.tsx`, actualizar el import de contenido:

```tsx
import {
  ABOUT_TERMINAL,
  CAREER_LOG,
  CONTACT,
  FOUNDER,
  MANIFESTO,
} from "@/lib/content";
```

- [ ] **Step 2: Insertar la sección timeline**

Después del cierre de la sección "Tarjeta terminal sobre-mi.sh" (`</section>` línea ~141) y antes del comentario `{/* Manifiesto "Cómo trabajo" */}`:

```tsx
        {/* Timeline "Mi historia" */}
        <section aria-labelledby="historia-title" className="px-6 pb-25 md:px-16">
          <div className="mx-auto flex max-w-205 flex-col gap-12">
            <Reveal>
              <p aria-hidden className="mb-3 font-mono text-[15px] text-teal-300">
                $ git log --reverse mi-carrera
              </p>
              <h2
                id="historia-title"
                className="text-[32px] leading-[1.05] font-extrabold tracking-[-0.03em] md:text-[40px]"
              >
                Mi historia
              </h2>
            </Reveal>
            <ol className="ml-1.5 flex flex-col gap-11 border-l border-[rgba(94,234,212,0.22)]">
              {CAREER_LOG.map((commit, i) => (
                <li key={commit.hash} className="relative pl-8 md:pl-12">
                  <span
                    aria-hidden
                    className="absolute top-1.5 -left-[7px] h-3.5 w-3.5 rounded-full border-2 border-teal-300 bg-night"
                  />
                  <Reveal delay={i * 90} className="flex flex-col gap-2.5">
                    <p className="font-mono text-[13px] text-[rgba(226,247,242,0.45)]">
                      <span aria-hidden className="text-teal-300">
                        {commit.hash}
                      </span>{" "}
                      <span className="text-emerald-200">{commit.tag}</span>
                      {commit.period && <span> · {commit.period}</span>}
                    </p>
                    <h3 className="text-[22px] font-extrabold tracking-[-0.02em] md:text-[26px]">
                      {commit.title}
                    </h3>
                    <p className="max-w-150 text-base leading-[1.7] text-[rgba(226,247,242,0.65)]">
                      {commit.desc}
                    </p>
                  </Reveal>
                </li>
              ))}
            </ol>
          </div>
        </section>
```

- [ ] **Step 3: Verificar**

Run: `npx tsc --noEmit` — Expected: sin errores.
Run: `npm run lint` — Expected: sin errores nuevos.

- [ ] **Step 4: Commit**

```bash
git add app/nosotros/page.tsx
git commit -m "feat(nosotros): timeline de historia estilo git log"
```

---

### Task 3: Sección "Credenciales verificables"

**Files:**
- Modify: `app/nosotros/page.tsx` (insertar sección después de "Mi historia" de Task 2, antes del manifiesto)

**Interfaces:**
- Consumes: `CREDENTIALS` de `@/lib/content` (Task 1); `Button` (`@/components/ui/Button`, props `href`/`variant`/`target`/`className`); `Image` de `next/image`; `ArrowRight` de `lucide-react` (ya importados en la página).
- Produces: sección con `id="credenciales-title"`.

- [ ] **Step 1: Importar `CREDENTIALS`**

Agregar `CREDENTIALS` al import de `@/lib/content` (queda: `ABOUT_TERMINAL, CAREER_LOG, CONTACT, CREDENTIALS, FOUNDER, MANIFESTO`).

- [ ] **Step 2: Insertar la sección**

Después del cierre de la sección "Timeline Mi historia" y antes de `{/* Manifiesto "Cómo trabajo" */}`:

```tsx
        {/* Credenciales verificables */}
        <section
          aria-labelledby="credenciales-title"
          className="px-6 pb-25 md:px-16"
        >
          <div className="mx-auto flex max-w-225 flex-col gap-10">
            <Reveal>
              <p aria-hidden className="mb-3 font-mono text-[15px] text-teal-300">
                $ ls certificados/
              </p>
              <h2
                id="credenciales-title"
                className="text-[32px] leading-[1.05] font-extrabold tracking-[-0.03em] md:text-[40px]"
              >
                Credenciales verificables
              </h2>
            </Reveal>
            <div className="grid gap-6 md:grid-cols-2">
              {CREDENTIALS.map((cred, i) => (
                <Reveal
                  key={cred.title}
                  delay={i * 100}
                  className={`h-full ${cred.featured ? "md:col-span-2" : ""}`}
                >
                  <article className="flex h-full flex-col gap-4 rounded-[20px] border border-[rgba(94,234,212,0.2)] bg-white/3 p-7 md:p-9">
                    {cred.image && (
                      <div className="overflow-hidden rounded-xl border border-white/10">
                        <Image
                          src={cred.image}
                          alt={`Certificado: ${cred.title}${cred.issuer ? ` — ${cred.issuer}` : ""}`}
                          width={1200}
                          height={850}
                          className="h-auto w-full"
                        />
                      </div>
                    )}
                    <div className="flex flex-col gap-1.5">
                      <h3 className="text-[20px] font-extrabold tracking-[-0.02em]">
                        {cred.title}
                      </h3>
                      {cred.issuer && (
                        <p className="font-mono text-[13px] text-teal-300">
                          {cred.issuer}
                        </p>
                      )}
                    </div>
                    <p className="text-[15px] leading-[1.7] text-[rgba(226,247,242,0.65)]">
                      {cred.desc}
                    </p>
                    {cred.href && cred.linkLabel && (
                      <div className="mt-auto pt-2">
                        <Button
                          href={cred.href}
                          target="_blank"
                          variant="ghost"
                          className="border-white/22"
                        >
                          {cred.linkLabel} <ArrowRight size={18} aria-hidden />
                        </Button>
                      </div>
                    )}
                  </article>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
```

Nota: la tarjeta de Henry no muestra imagen ni botón todavía (href/image son PLACEHOLDER en `CREDENTIALS`); el render condicional los activa solos cuando Yeison pase los datos. `width={1200} height={850}` es la proporción esperada del certificado de Henry — ajustar a las dimensiones reales del archivo cuando exista.

- [ ] **Step 3: Verificar**

Run: `npx tsc --noEmit` — Expected: sin errores.
Run: `npm run lint` — Expected: sin errores nuevos.

- [ ] **Step 4: Commit**

```bash
git add app/nosotros/page.tsx
git commit -m "feat(nosotros): tarjetas de credenciales verificables"
```

---

### Task 4: Sección "Cuando cierro la laptop" (lado humano)

**Files:**
- Modify: `app/nosotros/page.tsx` (insertar sección después del manifiesto, antes del CTA final `{/* CTA final */}` línea ~182)

**Interfaces:**
- Consumes: `PERSONAL` y `FOUNDER` de `@/lib/content` (Task 1); `Reveal`; `Image`. La foto `/assets/foto-nosotros-natural-900.png` existe en el repo y mide **900x900**.
- Produces: sección con `id="humano-title"`.

- [ ] **Step 1: Importar `PERSONAL`**

Agregar `PERSONAL` al import de `@/lib/content` (queda: `ABOUT_TERMINAL, CAREER_LOG, CONTACT, CREDENTIALS, FOUNDER, MANIFESTO, PERSONAL`).

- [ ] **Step 2: Insertar la sección**

Después del cierre de la sección del manifiesto (`</section>` línea ~180 original) y antes de `{/* CTA final */}`:

```tsx
        {/* Lado humano "Cuando cierro la laptop" */}
        <section aria-labelledby="humano-title" className="px-6 py-25 md:px-16">
          <div className="mx-auto grid max-w-225 items-center gap-12 md:grid-cols-[minmax(0,5fr)_minmax(0,6fr)] md:gap-16">
            <Reveal className="overflow-hidden rounded-[24px] border border-white/10 shadow-[0_30px_70px_-30px_rgba(16,185,129,0.35)]">
              {PERSONAL.photo ? (
                <Image
                  src={PERSONAL.photo}
                  alt={`${FOUNDER.name} en Villavicencio, fuera del trabajo`}
                  width={900}
                  height={900}
                  className="h-auto w-full object-cover"
                />
              ) : (
                <div className="flex aspect-square w-full items-center justify-center bg-white/4 font-mono text-[13px] text-white/40">
                  [foto natural]
                </div>
              )}
            </Reveal>
            <Reveal delay={120} className="flex flex-col gap-5">
              <p aria-hidden className="font-mono text-[15px] text-teal-300">
                $ logout
              </p>
              <h2
                id="humano-title"
                className="text-[32px] leading-[1.05] font-extrabold tracking-[-0.03em] md:text-[40px]"
              >
                Cuando cierro la laptop
              </h2>
              {PERSONAL.paragraphs.map((p) => (
                <p
                  key={p}
                  className="text-[17px] leading-[1.75] text-[rgba(226,247,242,0.7)]"
                >
                  {p}
                </p>
              ))}
            </Reveal>
          </div>
        </section>
```

- [ ] **Step 3: Verificar**

Run: `npx tsc --noEmit` — Expected: sin errores.
Run: `npm run lint` — Expected: sin errores nuevos.

- [ ] **Step 4: Commit**

```bash
git add app/nosotros/page.tsx
git commit -m "feat(nosotros): bloque humano con foto natural y vida en Villavicencio"
```

---

### Task 5: Gancho del hero, metadata y JSON-LD (E-E-A-T)

**Files:**
- Modify: `app/nosotros/page.tsx` (párrafo del hero ~líneas 102-106, `metadata` líneas 11-24, `jsonLd` líneas 30-55)

**Interfaces:**
- Consumes: nada nuevo.
- Produces: nada consumido por otras tareas.

- [ ] **Step 1: Reemplazar el párrafo intro del hero**

Reemplazar el `<p>` del hero (el que dice "Soy … XyraCode es una agencia de una persona…") por:

```tsx
              <p className="max-w-150 text-[19px] leading-[1.65] text-[rgba(226,247,242,0.72)]">
                Soy <strong className="font-bold text-white">{FOUNDER.name}</strong>.
                Antes de escribir código pasé más de 10 años del lado del
                cliente, vendiendo servicios de telecomunicaciones. XyraCode es
                una agencia de una persona: yo diseño, yo programo, yo
                respondo. Hablas siempre con quien construye tu producto.
              </p>
```

- [ ] **Step 2: Actualizar `metadata`**

Reemplazar el objeto `metadata` completo por:

```tsx
export const metadata: Metadata = {
  title: "Nosotros — El desarrollador detrás de XyraCode",
  description:
    "XyraCode es una agencia unipersonal de desarrollo web en Villavicencio, Colombia. Más de 10 años entendiendo clientes antes de programar: trato directo, un solo responsable y código propio.",
  alternates: {
    canonical: "/nosotros",
  },
  openGraph: {
    url: "/nosotros",
    title: "Nosotros — El desarrollador detrás de XyraCode",
    description:
      "Agencia unipersonal de desarrollo web en Villavicencio, Colombia. Más de 10 años entendiendo clientes antes de programar.",
  },
};
```

- [ ] **Step 3: Ampliar el `Person` del JSON-LD**

En el objeto `jsonLd`, dentro del nodo `"@type": "Person"`, agregar después de `knowsAbout: […]`:

```ts
      sameAs: ["https://github.com/Xyra-Code"],
      alumniOf: {
        "@type": "EducationalOrganization",
        name: "Henry",
        url: "https://www.soyhenry.com",
      },
      hasCredential: [
        {
          "@type": "EducationalOccupationalCredential",
          name: "Desarrollador Full-Stack",
          credentialCategory: "certificate",
          recognizedBy: { "@type": "EducationalOrganization", name: "Henry" },
        },
        {
          "@type": "EducationalOccupationalCredential",
          name: "Técnico en Sistemas",
          credentialCategory: "certificate",
        },
      ],
```

- [ ] **Step 4: Verificar**

Run: `npx tsc --noEmit` — Expected: sin errores.
Run: `npm run lint` — Expected: sin errores nuevos.

- [ ] **Step 5: Commit**

```bash
git add app/nosotros/page.tsx
git commit -m "feat(nosotros): gancho de trayectoria en hero, metadata y JSON-LD con credenciales"
```

---

### Task 6: Verificación final end-to-end

**Files:**
- Ninguno (solo verificación).

- [ ] **Step 1: Build de producción**

Run: `npm run build`
Expected: build exitoso, `/nosotros` aparece como ruta estática (○) sin warnings de la página.

- [ ] **Step 2: Revisión visual**

Run: `npm run dev` (background) y abrir `http://localhost:3000/nosotros`.

Checklist visual:
- Hero: párrafo con el gancho de "10 años del lado del cliente".
- Terminal `sobre-mi.sh` muestra la línea `trayectoria:`.
- Timeline "Mi historia": 5 commits en orden (técnico → ventas → Henry → freelance → XyraCode), línea vertical y puntos alineados en móvil (375px) y desktop (1280px).
- Credenciales: Henry a ancho completo (sin imagen ni botón aún — correcto, son placeholders), Técnico y GitHub en dos columnas; el botón "Ver GitHub" abre github.com/Xyra-Code en pestaña nueva.
- Bloque humano: foto natural 900x900 a la izquierda, texto a la derecha en desktop; apilado en móvil.
- CTA final intacto.

- [ ] **Step 3: Validar JSON-LD**

En el navegador, ver el código fuente de `/nosotros`, copiar el bloque `application/ld+json` y validar su estructura (por ejemplo en https://validator.schema.org): `Person` con `alumniOf`, `hasCredential` (2) y `sameAs`.

- [ ] **Step 4: Corregir cualquier desajuste visual encontrado y commitear**

```bash
git add app/nosotros/page.tsx lib/content.ts
git commit -m "fix(nosotros): ajustes visuales de la revisión final"
```

(Solo si hubo ajustes.)

---

## Pendientes de Yeison (post-plan, no bloquean)

Al recibirlos, se rellenan los `// PLACEHOLDER:` de `lib/content.ts` (Task 1) sin tocar componentes:

1. Años del timeline (`period` de cada commit de `CAREER_LOG`).
2. URL de verificación + imagen del certificado de Henry (`href`/`image` en `CREDENTIALS[0]`).
3. Institución del técnico en sistemas (`issuer` en `CREDENTIALS[1]`).
4. Hobbies (segundo párrafo de `PERSONAL.paragraphs`).
