# Handoff: Página "Nosotros" — xyracode.com

## Overview
Nueva vista `/nosotros` para xyracode.com. Presenta al fundador (agencia unipersonal) convirtiendo el "soy uno solo" en ventaja de venta: trato directo, un solo responsable, código propio. Incluye CTA a WhatsApp/contacto. Objetivo secundario: SEO/E-E-A-T (autoría real con nombre y foto).

## About the Design Files
Los archivos HTML de este paquete son **referencias de diseño** (prototipos hechos en HTML), NO código de producción para copiar tal cual. La tarea es **recrear estos diseños en el codebase existente de xyracode.com** (Next.js App Router + Tailwind + TypeScript), siguiendo sus patrones actuales: misma nav, mismo footer, mismos componentes de botón/section que ya usa la home. Crear la ruta `app/nosotros/page.tsx`.

Hay **dos propuestas**; el cliente decidirá cuál implementar (o pedirá una mezcla):
- `XyraCode Nosotros.dc.html` — **v1**: hero en grid 2 columnas (texto + foto rectangular), tarjetas de stats "0 / 1 / 100%", sección historia + lista numerada, CTA.
- `XyraCode Nosotros v2.dc.html` — **v2 (preferida, la última vista)**: hero centrado con foto circular y `$ whoami`, tarjeta terminal `sobre-mi.sh` con datos, manifiesto numerado grande, CTA con comando.

Nota técnica: los prototipos usan un runtime propio (`support.js`, tags `<x-dc>`, `<x-import>`, `<helmet>`). Ignorar ese scaffolding; lo relevante es el markup interior con estilos inline. El `<x-import ... image-slot>` = placeholder de imagen → en producción es un `next/image` con la foto real del fundador.

## Fidelity
**High-fidelity.** Colores, tipografía, espaciados y copy son finales (salvo los textos entre corchetes `[Tu nombre]`, `[X] años`, `[historia]` que el cliente debe completar). Recrear pixel-perfect con Tailwind, mapeando los hex a los tokens ya existentes del sitio donde coincidan.

## Screens / Views (v2 — preferida)

### 1. Nav
La nav existente del sitio, con "Nosotros" como ítem activo (color `#5EEAD4`).

### 2. Hero "whoami"
- Fondo `#08110F` con blob difuso: círculo 700px `#0F766E` opacity 0.3, `blur(150px)`, arriba-centro.
- Contenido centrado, max-width 900px, padding 90px 64px 100px, gap 40px.
- Foto circular 180×180, `border: 2px solid rgba(94,234,212,0.4)`, sombra `0 30px 70px -30px rgba(16,185,129,0.5)`. (next/image, object-cover)
- Línea mono: `$ whoami` — JetBrains Mono 15px `#5EEAD4`.
- H1: "El dev detrás de XyraCode" — Plus Jakarta Sans 62px / weight 800 / letter-spacing -0.03em / line-height 1.02 / blanco.
- Párrafo 19px / line-height 1.65 / `rgba(226,247,242,0.72)` / max-width 600px. Copy: "Soy **[Tu nombre]**. XyraCode es una agencia de una persona: yo diseño, yo programo, yo respondo. Vos hablás siempre con quien construye tu producto."
- Botones (mismos del sitio): primario pill `#10B981` texto `#04211A` 15px/800, padding 15px 32px → "Hablemos →" (ancla a contacto). Secundario pill borde `rgba(94,234,212,0.35)` texto `#5EEAD4` → "Ver portfolio".

### 3. Tarjeta terminal `sobre-mi.sh`
- Contenedor max-width 820px centrado.
- Card: bg `rgba(255,255,255,0.03)`, borde `1px solid rgba(94,234,212,0.2)`, radius 20px.
- Barra superior: 3 dots (`#D9734E`, `#F29C50`, `#10B981`, 12px), título mono 13px `rgba(226,247,242,0.5)` "sobre-mi.sh", borde inferior `rgba(94,234,212,0.12)`.
- Cuerpo: JetBrains Mono 15px, line-height 2.2, valor `#A7F3D0`, clave `#5EEAD4`:
  - `rol:` fundador & desarrollador full-stack
  - `base:` Villavicencio, Colombia 🇨🇴
  - `stack:` React · Next.js · Node · TypeScript · PostgreSQL
  - `experiencia:` [X] años construyendo productos web
  - `proyectos_activos:` máximo 3 a la vez
  - `respuesta:` primera propuesta en 48h ✓

### 4. Manifiesto "Cómo trabajo"
- Fondo `#0B1F1C`, padding 100px 64px, max-width 900px.
- Eyebrow: 12px / 800 / letter-spacing 0.22em / uppercase / `#5EEAD4` → "CÓMO TRABAJO".
- 3 filas (gap 56px): número gigante 80px/800 `rgba(94,234,212,0.25)` + título 26px/800 + texto 16px/1.7 `rgba(226,247,242,0.65)` max-width 560px:
  1. **Sin teléfono roto** — "No hay gerente de cuenta que traduzca mal lo que pediste. Me contás tu idea y la misma persona la convierte en código."
  2. **Pocos proyectos, bien hechos** — "Tomo máximo 3 proyectos en paralelo. El tuyo avanza todas las semanas, con entregas funcionando cada sprint."
  3. **Aliados cuando el proyecto lo pide** — "Para ilustración, contenido o proyectos grandes sumo colaboradores de confianza. El punto de contacto siempre soy yo."

### 5. CTA final
- Fondo `#08110F` + blob central `#0F766E` opacity 0.25 blur 150px. Centrado, padding 100px 64px.
- Mono 15px `#5EEAD4`: `$ xyra start --tu-proyecto`
- H2 44px/800/-0.03em: "¿Trabajamos juntos?"
- Botón primario: "Escribime por WhatsApp →" → link wa.me existente del sitio.
- Línea mono 13px `rgba(226,247,242,0.45)`: "contacto@xyracode.com · Villavicencio, Colombia"

### v1 (alternativa) — resumen
Mismo lenguaje visual. Hero grid `minmax(0,1.2fr) minmax(0,0.8fr)` gap 64px: izquierda eyebrow "NOSOTROS · BUENO, YO" + H1 58px "Una agencia de una persona. Y eso es una ventaja." + párrafo + botones; derecha foto rectangular radius 24px alto 460px con caption mono. Luego grid de 3 stat-cards (0 Intermediarios / 1 Responsable de todo / 100% Código propio; bg `rgba(255,255,255,0.03)`, borde `rgba(94,234,212,0.15)`, radius 16px, padding 32px). Luego sección `#0B1F1C` en 2 columnas: historia (H2 36px "De freelance a agencia, sin perder lo bueno de ser freelance" + párrafo placeholder + stack mono) y lista numerada 01-04 con divisores `rgba(94,234,212,0.12)`. Ver el archivo para los detalles exactos.

## Interactions & Behavior
- Botones y links: mismos hovers del sitio (lift/brightness ~200-300ms). Links `#5EEAD4` → hover `#2DD4BF`.
- Anclas: "Hablemos" y CTA → sección/página de contacto; "Ver portfolio" → `/#portfolio`.
- Responsive: bajo ~1000px, grids colapsan a 1 columna (usar `minmax(0,…)` / `min-w-0` para que las columnas puedan encoger); H1 baja a ~40-44px; padding lateral 24px. Foto circular v2 se mantiene 180px.
- Sin animaciones nuevas obligatorias; opcional fade-in/slide-up de entrada como ya usa la home.

## State Management
Página estática, sin estado. Solo metadata de Next.js:
- `title: "Nosotros — El dev detrás de XyraCode | XyraCode"`
- `description`: sobre el fundador, agencia unipersonal de desarrollo web en Villavicencio, Colombia.
- Agregar schema.org `Person` + `Organization` (founder) via JSON-LD para SEO/E-E-A-T.

## Design Tokens
- Fondos: `#08110F` (ink), `#0B1F1C` (sección alterna)
- Acentos: `#5EEAD4` (teal bright), `#2DD4BF`, `#10B981` (CTA), `#04211A` (texto sobre CTA), `#0F766E` (blobs), `#A7F3D0` (mono claro)
- Texto atenuado: `rgba(226,247,242,0.72 / 0.65 / 0.5 / 0.45)`
- Bordes: `rgba(94,234,212,0.12–0.4)`
- Dots terminal: `#D9734E`, `#F29C50`, `#10B981`
- Tipos: Plus Jakarta Sans (headings 800, tracking -0.03em; eyebrows 12px 800 tracking 0.22em uppercase), JetBrains Mono 400/600
- Radios: pills 9999px, cards 16-24px, terminal 20px
- Espaciado: secciones 90-100px vertical, 64px lateral; gaps 24/40/56/64px

## Assets
- `assets/xc-teal-horizontal-trans.png` — logo horizontal (el sitio ya lo tiene en `/assets`).
- Foto del fundador: **la aporta el cliente** (los prototipos usan un placeholder drag-and-drop).

## Files
- `XyraCode Nosotros v2.dc.html` — propuesta v2 (preferida)
- `XyraCode Nosotros.dc.html` — propuesta v1
- `support.js` + `_ds/` + `image-slot.js` — runtime del prototipo, solo para abrir los HTML en el navegador; no portar.
