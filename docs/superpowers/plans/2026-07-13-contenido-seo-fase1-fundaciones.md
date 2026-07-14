# Fase 1 — Fundaciones (Arquitectura de contenido SEO) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Preparar la base reutilizable para las páginas de contenido nuevas: un runner de tests, `lib/content/` modularizado y un modelo de bloques con renderer único — sin cambiar ninguna ruta visible.

**Architecture:** Se instala Vitest (híbrido: unit tests solo para lógica pura; el split se valida con typecheck + build). Se parte `lib/content.ts` (≈500 líneas) en módulos por dominio bajo `lib/content/` con un barrel `index.ts` que re-exporta todo, dejando intactos los 14 imports existentes de `@/lib/content`. Se añade `lib/content/blocks.ts` (unión discriminada `Block`) y `components/content/BlockRenderer.tsx` que la renderiza a HTML semántico.

**Tech Stack:** Next.js 16.2.10, React 19.2.4, TypeScript 5 (strict, `moduleResolution: bundler`, alias `@/*` → `./*`), Vitest + @testing-library/react + jsdom.

## Global Constraints

- **Next.js 16.2.10 / React 19.2.4** — no bajar versiones. AGENTS.md: leer `node_modules/next/dist/docs/` antes de tocar APIs de Next que no conozcas.
- **Alias de imports:** `@/*` resuelve a la raíz del repo (`tsconfig.json` `paths`).
- **`lib/content/*` no importa de `lib/seo.ts`** (regla de dependencias existente). `lib/seo.ts` sí puede leer de `lib/content`.
- **Preservar todos los exports nombrados** que hoy consume `@/lib/content` (14 archivos) — el barrel debe re-exportarlos sin renombrar.
- **Typecheck:** `npx tsc --noEmit` debe pasar en verde tras cada tarea.
- **Build:** `npm run build` debe completar (genera las páginas estáticas actuales).
- **Sin `new Date()`** en código de contenido/sitemap (principio existente).
- **Alcance recortado deliberadamente:** los helpers JSON-LD y el sitemap dirigido por datos que la spec listaba en Fase 1 se difieren a la fase de su primer consumidor (Fase 2+), porque dependen de tipos aún no definidos (`CaseStudy`, `BlogPost`, `ServicePage`). Construirlos aquí sería adivinar su forma (YAGNI).

---

### Task 1: Instalar y configurar Vitest (setup híbrido)

**Files:**
- Modify: `package.json` (deps + script `test`)
- Create: `vitest.config.ts`
- Create: `vitest.setup.ts`
- Create: `lib/__tests__/smoke.test.ts` (smoke test, se borra en Step 6)

**Interfaces:**
- Consumes: nada.
- Produces: comando `npm test` (Vitest en modo run), entorno `jsdom`, `@testing-library/jest-dom` matchers cargados, alias `@/` resuelto en tests. Las tareas siguientes escriben tests con `import { describe, it, expect } from "vitest"` y `render/screen` de `@testing-library/react`.

- [ ] **Step 1: Instalar dependencias de test**

Run:
```bash
npm install -D vitest @vitejs/plugin-react jsdom @testing-library/react @testing-library/jest-dom @testing-library/dom
```
Expected: se añaden a `devDependencies`; `npm install` termina sin errores.

- [ ] **Step 2: Crear la config de Vitest**

Create `vitest.config.ts`:
```ts
import { resolve } from "node:path";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vitest/config";

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./vitest.setup.ts"],
  },
  resolve: {
    alias: {
      "@": resolve(__dirname, "."),
    },
  },
});
```

- [ ] **Step 3: Crear el setup de Vitest**

Create `vitest.setup.ts`:
```ts
import "@testing-library/jest-dom/vitest";
```

- [ ] **Step 4: Añadir el script `test`**

Modify `package.json` scripts (dejar los existentes; añadir `test`):
```json
"scripts": {
  "dev": "next dev",
  "build": "next build",
  "start": "next start",
  "lint": "eslint",
  "test": "vitest run"
}
```

- [ ] **Step 5: Escribir un smoke test y verificar que el harness corre**

Create `lib/__tests__/smoke.test.ts`:
```ts
import { describe, expect, it } from "vitest";

describe("vitest harness", () => {
  it("runs", () => {
    expect(1 + 1).toBe(2);
  });
});
```

Run: `npm test`
Expected: PASS — 1 test passed. Confirma que Vitest, jsdom y el alias funcionan.

- [ ] **Step 6: Borrar el smoke test y confirmar typecheck**

Run:
```bash
rm lib/__tests__/smoke.test.ts
npx tsc --noEmit
```
Expected: `tsc` sin errores.

- [ ] **Step 7: Commit**

```bash
git add package.json package-lock.json vitest.config.ts vitest.setup.ts
git commit -m "test: configurar Vitest (jsdom + testing-library) para logica pura"
```

---

### Task 2: Partir `lib/content.ts` en `lib/content/` + barrel

**Files:**
- Create: `lib/content/contact.ts`, `lib/content/ui.ts`, `lib/content/team.ts`, `lib/content/home.ts`, `lib/content/services.ts`, `lib/content/projects.ts`, `lib/content/social.ts`, `lib/content/index.ts`
- Delete: `lib/content.ts`
- Modify: ninguno de los 14 consumidores (siguen importando de `@/lib/content`).

**Interfaces:**
- Consumes: nada de tareas previas.
- Produces: `@/lib/content` re-exporta exactamente los mismos símbolos que hoy: `CONTACT`, `CONTACT_FORM`, `UI`, `FOUNDER`, `ABOUT_TERMINAL`, `MANIFESTO`, `CAREER_LOG`, `CREDENTIALS`, `PERSONAL`, `STATS`, `STACK`, `STEPS`, `SERVICES`, `PROJECTS`, `SOCIALS`, `FOOTER_COLUMNS` y los tipos `Stat`, `Step`, `Service`, `Project`, `CareerCommit`, `Credential`, `CredentialLink`, `Social`, `FooterLink`, `FooterColumn`. Además expone submódulos importables (`@/lib/content/blocks`, etc.).

> **Mapa de módulos y sus imports internos** (mover el código *verbatim* desde `lib/content.ts`; solo cambian los `import` de cabecera de cada archivo):
>
> | Módulo | Exports que se mueven ahí | Imports que necesita en cabecera |
> |---|---|---|
> | `contact.ts` | `CONTACT`, `CONTACT_FORM` | — |
> | `home.ts` | `Stat`+`STATS`, `STACK`, `Step`+`STEPS` | — |
> | `services.ts` | `Service`+`SERVICES` | `import { Globe, LayoutDashboard, Palette, ShoppingBag, Smartphone, Wrench, Zap, type LucideIcon } from "lucide-react";` (dejar solo los usados por `SERVICES`) |
> | `projects.ts` | `Project`+`PROJECTS` | `import { ShoppingBag, type LucideIcon } from "lucide-react";` |
> | `team.ts` | `FOUNDER`, `ABOUT_TERMINAL`, `MANIFESTO`, `CareerCommit`+`CAREER_LOG`, `CredentialLink`+`Credential`+`CREDENTIALS`, `PERSONAL` | `import { CONTACT } from "./contact";` y `import type { Step } from "./home";` |
> | `ui.ts` | `UI` | `import { CONTACT } from "./contact";` y `import { FOUNDER } from "./team";` |
> | `social.ts` | `Social`+`SOCIALS`, `FooterLink`+`FooterColumn`+`FOOTER_COLUMNS` | `import { GitHubIcon, InstagramIcon, LinkedInIcon, type BrandIcon } from "@/components/ui/BrandIcons";` y `import { CONTACT } from "./contact";` |
>
> Notas de dependencias (verificadas contra el `content.ts` actual): `ABOUT_TERMINAL` usa `CONTACT.location` y `FOUNDER.role`; `UI.nosotros.photoAlt` usa `FOUNDER.name`; `FOOTER_COLUMNS` usa `CONTACT.email/whatsapp/whatsappMessage/location`; `MANIFESTO` es de tipo `Step[]`. No hay ciclos (`ui→team→home`, `team→contact`, `social→contact`).

- [ ] **Step 1: Crear los módulos de dominio**

Para cada archivo de la tabla: crear el archivo, copiar *verbatim* el bloque correspondiente desde `lib/content.ts` (incluidos los comentarios de esa sección) y poner en la cabecera solo los imports indicados en la columna derecha. No renombrar ningún símbolo. Mantener los `export`/`export type` tal cual.

- [ ] **Step 2: Crear el barrel `lib/content/index.ts`**

Create `lib/content/index.ts`:
```ts
/**
 * Contenido editable de la landing, modularizado por dominio.
 * Barrel: re-exporta todo para que `@/lib/content` siga funcionando igual.
 * Para editar textos/datos, ve al módulo del dominio correspondiente.
 */
export * from "./contact";
export * from "./home";
export * from "./services";
export * from "./projects";
export * from "./team";
export * from "./ui";
export * from "./social";
```

- [ ] **Step 3: Borrar el archivo monolítico**

Run: `rm lib/content.ts`
(Importante: no pueden coexistir `lib/content.ts` y `lib/content/index.ts` — la resolución de `@/lib/content` sería ambigua.)

- [ ] **Step 4: Verificar typecheck (detecta cualquier import roto o símbolo perdido)**

Run: `npx tsc --noEmit`
Expected: sin errores. Si `tsc` reporta un símbolo faltante, es que un export no se movió o el barrel no lo re-exporta — corregir antes de seguir.

- [ ] **Step 5: Verificar lint y build**

Run:
```bash
npm run lint
npm run build
```
Expected: lint sin errores; build completa y genera las rutas actuales (`/`, `/nosotros`) sin warnings nuevos.

- [ ] **Step 6: Commit**

```bash
git add lib/content lib/content.ts
git commit -m "refactor(content): partir lib/content en modulos por dominio + barrel"
```

---

### Task 3: Modelo de bloques `Block` + `BlockRenderer`

**Files:**
- Create: `lib/content/blocks.ts`
- Create: `components/content/BlockRenderer.tsx`
- Test: `components/content/BlockRenderer.test.tsx`

**Interfaces:**
- Consumes: `@/lib/content` (barrel de Task 2) — no directamente, pero `blocks.ts` vive en esa carpeta.
- Produces:
  - `Block` (unión discriminada) exportado desde `@/lib/content/blocks`:
    ```ts
    export type Block =
      | { kind: "h2"; text: string }
      | { kind: "p"; text: string }
      | { kind: "ul"; items: string[] }
      | { kind: "image"; src: string; alt: string; width: number; height: number; caption?: string }
      | { kind: "quote"; text: string };
    ```
  - `BlockRenderer({ blocks }: { blocks: Block[] }): JSX.Element` desde `@/components/content/BlockRenderer` — mapea cada bloque a HTML semántico (`<h2>`, `<p>`, `<ul><li>`, `<figure><Image/><figcaption>`, `<blockquote>`). Sin clases de estilo (las añade la fase de diseño).

> Nota: el bloque `image` incluye `width`/`height` porque `next/image` los exige (no es adivinar, es requisito del componente elegido, usado ya en `Portfolio`/`nosotros`).

- [ ] **Step 1: Crear el tipo `Block`**

Create `lib/content/blocks.ts`:
```ts
/**
 * Modelo de bloques para cuerpos largos (casos de estudio y artículos de blog).
 * Unión discriminada mínima; ampliar `kind` solo cuando un contenido real lo pida.
 */
export type Block =
  | { kind: "h2"; text: string }
  | { kind: "p"; text: string }
  | { kind: "ul"; items: string[] }
  | { kind: "image"; src: string; alt: string; width: number; height: number; caption?: string }
  | { kind: "quote"; text: string };
```

- [ ] **Step 2: Re-exportar `blocks` desde el barrel**

Modify `lib/content/index.ts` — añadir al final:
```ts
export * from "./blocks";
```
Run: `npx tsc --noEmit`
Expected: sin errores.

- [ ] **Step 3: Escribir el test que falla**

Create `components/content/BlockRenderer.test.tsx`:
```tsx
import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import type { Block } from "@/lib/content/blocks";
import { BlockRenderer } from "./BlockRenderer";

// next/image necesita infra de Next; en jsdom lo sustituimos por un <img> simple.
vi.mock("next/image", () => ({
  default: (props: { src: string; alt: string }) => (
    // eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text
    <img src={props.src} alt={props.alt} />
  ),
}));

describe("BlockRenderer", () => {
  it("renderiza cada tipo de bloque con su etiqueta semántica", () => {
    const blocks: Block[] = [
      { kind: "h2", text: "Título" },
      { kind: "p", text: "Un párrafo." },
      { kind: "ul", items: ["uno", "dos"] },
      {
        kind: "image",
        src: "/x.png",
        alt: "captura",
        width: 1200,
        height: 800,
        caption: "pie",
      },
      { kind: "quote", text: "una cita" },
    ];

    const { container } = render(<BlockRenderer blocks={blocks} />);

    expect(
      screen.getByRole("heading", { level: 2, name: "Título" }),
    ).toBeInTheDocument();
    expect(screen.getByText("Un párrafo.")).toBeInTheDocument();
    expect(screen.getAllByRole("listitem")).toHaveLength(2);
    expect(screen.getByRole("img", { name: "captura" })).toBeInTheDocument();
    expect(screen.getByText("pie").tagName).toBe("FIGCAPTION");
    expect(container.querySelector("blockquote")).toHaveTextContent("una cita");
  });

  it("omite el figcaption cuando no hay caption", () => {
    const blocks: Block[] = [
      { kind: "image", src: "/y.png", alt: "sin pie", width: 100, height: 100 },
    ];
    const { container } = render(<BlockRenderer blocks={blocks} />);
    expect(container.querySelector("figcaption")).toBeNull();
  });
});
```

- [ ] **Step 4: Ejecutar el test y verificar que falla**

Run: `npm test -- BlockRenderer`
Expected: FAIL — no existe `./BlockRenderer` (módulo no encontrado).

- [ ] **Step 5: Implementar el renderer mínimo**

Create `components/content/BlockRenderer.tsx`:
```tsx
import Image from "next/image";
import type { Block } from "@/lib/content/blocks";

/**
 * Renderiza un cuerpo de bloques a HTML semántico. Sin clases de estilo:
 * la presentación se define en las plantillas de cada tipo de contenido.
 */
export function BlockRenderer({ blocks }: { blocks: Block[] }) {
  return (
    <>
      {blocks.map((block, i) => {
        switch (block.kind) {
          case "h2":
            return <h2 key={i}>{block.text}</h2>;
          case "p":
            return <p key={i}>{block.text}</p>;
          case "ul":
            return (
              <ul key={i}>
                {block.items.map((item, j) => (
                  <li key={j}>{item}</li>
                ))}
              </ul>
            );
          case "image":
            return (
              <figure key={i}>
                <Image
                  src={block.src}
                  alt={block.alt}
                  width={block.width}
                  height={block.height}
                />
                {block.caption ? <figcaption>{block.caption}</figcaption> : null}
              </figure>
            );
          case "quote":
            return <blockquote key={i}>{block.text}</blockquote>;
        }
      })}
    </>
  );
}
```

- [ ] **Step 6: Ejecutar el test y verificar que pasa**

Run: `npm test -- BlockRenderer`
Expected: PASS — ambos tests.

- [ ] **Step 7: Typecheck, lint y build**

Run:
```bash
npx tsc --noEmit
npm run lint
npm run build
```
Expected: todo en verde.

- [ ] **Step 8: Commit**

```bash
git add lib/content/blocks.ts lib/content/index.ts components/content/BlockRenderer.tsx components/content/BlockRenderer.test.tsx
git commit -m "feat(content): modelo de bloques Block + BlockRenderer con tests"
```

---

## Verificación final de la fase

- [ ] `npm test` → todos los tests en verde.
- [ ] `npx tsc --noEmit` → sin errores.
- [ ] `npm run lint` → sin errores.
- [ ] `npm run build` → build completa; `/` y `/nosotros` se generan igual que antes (sin cambios visibles).
- [ ] `git log --oneline -3` → tres commits (test, refactor, feat).

## Notas de auto-revisión (spec coverage)

- **Split `lib/content/` + barrel** → Task 2. ✅
- **`blocks.ts` + renderer único** → Task 3. ✅
- **Runner de tests (decisión híbrida del usuario)** → Task 1 + tests en Task 3. ✅
- **Helpers JSON-LD / sitemap dirigido por datos** → diferidos a Fase 2+ (documentado en Global Constraints, con justificación YAGNI). No son huecos del plan: se implementan con su primer consumidor.
