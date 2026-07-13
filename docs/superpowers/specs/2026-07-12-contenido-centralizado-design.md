# Contenido centralizado: SEO en `lib/seo.ts`, textos de UI en `lib/content.ts`

**Fecha:** 2026-07-12
**Estado:** aprobado en conversación

## Problema

Parte del texto del sitio vive en `lib/content.ts` (el archivo que se promete como "contenido editable en un solo lugar") y parte está hardcodeada en páginas y componentes. Consecuencias reales detectadas:

- Los title/description SEO se repiten casi idénticos en `app/layout.tsx` (metadata, OG, Twitter, JSON-LD), `app/manifest.ts` y las imágenes OG.
- El JSON-LD de `/nosotros` duplica datos que ya existen en `content.ts` y ya se desincronizó: `sameAs` apunta a `github.com/Xyra-Code` mientras `CREDENTIALS` ya dice `github.com/YEENDJ`.
- Encabezados de sección, botones, navbar, footer, formulario de contacto (labels, placeholders, estados, legal) y mensajes de validación/email están dispersos en 10+ archivos.
- Inconsistencia de trato en `app/actions/contact.ts`: "Prueba de nuevo" (tuteo) y "Probá de nuevo" (voseo) en el mismo archivo.

## Alcance acordado

- **Se centraliza**: todo lo editable — textos visibles, formulario/emails, SEO/metadata/JSON-LD.
- **Se queda en componentes**: lo decorativo temático (prompts `$ whoami`, `$ xyra build --prod`, nombres de archivo ficticios `deploy.sh`/`whoami.txt`/`sobre-mi.sh`/`logout.log`, hashes del timeline, líneas de build). Son diseño, no contenido editorial.
- **Estructura**: SEO en un archivo nuevo `lib/seo.ts`; todo lo demás se suma a `lib/content.ts` (decisión del usuario: "SEO en un archivo y lo demás en otro").

## Diseño

### `lib/seo.ts` (nuevo)

Exporta un objeto `SEO` con la única copia de cada dato:

- **Identidad**: `siteName` ("XyraCode"), `siteUrl` ("https://xyracode.com" — reemplaza los `SITE_URL` duplicados de layout y /nosotros), `tagline`.
- **Home**: `home.title`, `home.description` (consumidos por metadata, openGraph, twitter y JSON-LD de `layout.tsx`).
- **Nosotros**: `nosotros.title`, `nosotros.description`, `nosotros.ogDescription`.
- **Imágenes OG**: alt y líneas visibles de `app/opengraph-image.tsx` y `app/nosotros/opengraph-image.tsx`.
- **Manifest**: `manifest.name`, `manifest.shortName`.
- **Datos estructurados**: `address` (locality "Villavicencio", region "Meta", countryCode "CO", country "Colombia"), `knowsAbout` de la organización, datos de Henry (`name`, `url` de soyhenry.com).

Consumidores: `app/layout.tsx`, `app/manifest.ts`, `app/opengraph-image.tsx`, `app/nosotros/opengraph-image.tsx`, `app/nosotros/page.tsx`.

`lib/seo.ts` puede importar de `lib/content.ts` (p. ej. `CONTACT`, `FOUNDER`) pero no al revés, para evitar ciclos.

### Derivaciones JSON-LD (fin de la duplicación)

El JSON-LD de `/nosotros` deja de tener strings propios:

- `jobTitle` ← `FOUNDER.role` (o un campo corto nuevo si el role largo no aplica; decidir en el plan).
- `hasCredential` ← se mapea desde `CREDENTIALS` (title, y `url` cuando exista `href`).
- `alumniOf` ← `SEO.henry`.
- `address` ← `SEO.address`.
- `sameAs` ← `FOUNDER.github` (campo nuevo, ver abajo).
- `knowsAbout` del Person ← constante compartida (hoy lista suelta "React, Next.js, Node, TypeScript, PostgreSQL" que coincide con `STACK` menos Tailwind; decidir en el plan si se deriva de `STACK` o queda como lista propia en `seo.ts`).

### `content.ts`: campo `FOUNDER.github` + bloques `UI` y `CONTACT_FORM`

- **`FOUNDER.github` = "https://github.com/YEENDJ"** — referenciado por `CREDENTIALS[2].href` y por el `sameAs` del JSON-LD. Una sola fuente.
- **`UI`**: textos por sección —
  - `nav`: links del navbar (labels; hoy `NAV_LINKS` vive en `Navbar.tsx`), botón "Cotizar", aria-labels ("XyraCode — inicio", "Principal", "Abrir/Cerrar menú").
  - `hero`: eyebrow, heading, párrafo, botones ("Empezar proyecto", "Ver proyectos").
  - `trust`: label "Stack" y aria-label.
  - `services`, `process`, `portfolio`, `cta`: eyebrow/heading/subtítulo/botones de cada sección.
  - `footer`: párrafo descriptivo, línea de copyright, "hecho con </> en Colombia".
  - `nosotros`: headings ("Mi historia", "Credenciales verificables", "Cómo trabajo", "¿Trabajamos juntos?"), botones ("Hablemos", "Ver proyectos", "Escríbeme por WhatsApp"), alt del retrato, y los párrafos narrativos del hero (whoami.txt) — con las redacciones aprobadas (ver abajo).
- **`CONTACT_FORM`**: labels, placeholders, estados ("¡Mensaje enviado!", "Enviando…", "Enviar mensaje"), aviso legal (Ley 1581), mensajes de validación (zod), errores de envío (unificados al tuteo: "Prueba de nuevo") y plantilla del email (remitente fallback, asunto, cuerpo) que consume `app/actions/contact.ts`.

### Redacciones aprobadas (reemplazan las ediciones manuales del working tree)

1. Hero /nosotros (whoami.txt): "…pasé más de 10 años del lado del cliente, vendiendo servicios de telecomunicaciones y viendo de primera mano lo que un negocio necesita para estar a la vanguardia." (+ el párrafo existente "XyraCode es una agencia que nace desde la necesidad de ayudar a los emprendedores a llevar sus ideas al mercado.")
2. `PERSONAL.paragraphs[1]`: "Desde aquí construimos lo que tu negocio necesita: mejorar tus ventas, ordenar tus procesos y, a un clic de distancia, reunirnos para plantear las mejores ideas."
3. `PERSONAL.paragraphs[2]`: "Trabajo con clientes de cualquier parte, pero siempre tendrás la atención directa de quien construye tu proyecto." (solo tilde)

Con el punto 2 queda resuelto el placeholder de hobbies que el review final marcó como bloqueante de deploy.

### Precondición git

Las ediciones manuales de Yeison en el working tree (`app/nosotros/page.tsx`, `lib/content.ts`) se commitean primero tal cual (autoría suya); el refactor va en commits aparte encima.

## Sin cambio visual

Este refactor no cambia nada de lo que se ve: mismos textos (salvo las 3 redacciones aprobadas y el "Probá"→"Prueba"), mismo markup, mismas clases. Verificación: build + comparar el HTML servido antes/después (los diffs esperados son solo las 3 redacciones y el sameAs corregido).

## Fuera de alcance

- No se tocan los decorativos temáticos.
- No se cambia estructura de componentes ni estilos.
- No se traduce ni internacionaliza nada (i18n queda fuera).
- `PR_DESCRIPTION.md` / `PR-DESCRIPTION.md` sin trackear no se tocan.
