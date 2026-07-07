# Handoff: XyraCode — Landing page + Sistema de marca (paquete único)

Este es el **paquete completo** para desarrollar la landing de XyraCode. Incluye TODO lo necesario: identidad de marca (logo, paleta, tipografía) **y** la especificación detallada de la landing page. Con este README + la carpeta `assets/` alcanza para arrancar el desarrollo sin material adicional.

---

## 1. Overview

**XyraCode** es una **agencia de desarrollo web** (Bogotá, Colombia; proyección a LATAM y otros países). Ofrece sitios web, web apps, apps móviles, diseño UI/UX, performance y mantenimiento. El objetivo de este handoff es construir su **landing page** de captación de clientes en un codebase real.

**Idioma del producto:** español. **Público:** empresas y emprendedores que necesitan producto digital a medida.

---

## 2. About the Design Files / Fidelity

Los archivos `.dc.html` de este bundle son **referencias de diseño en HTML** — prototipos que muestran el look & feel y comportamiento deseado, **no** código de producción para copiar tal cual (usan un runtime propio de prototipado que **no** debe portarse).

La tarea es **recrear estos diseños en el codebase destino** con sus librerías y patrones. Fidelidad **alta (hi-fi)**: colores, tipografía, espaciados, radios y estados están definitivos — recrear pixel-perfect.

**Stack recomendado** (si no hay proyecto aún):
- **Next.js (App Router) + React + TypeScript**
- **Tailwind CSS** — la paleta ya está en nombres de la escala Tailwind (ver §6), así que el mapeo es directo.
- **lucide-react** para todos los íconos (no dibujar SVGs a mano).
- Fuentes con `next/font` (Google Fonts): **Plus Jakarta Sans** + **JetBrains Mono**.

---

## 3. Estructura de la landing (orden de secciones)

Una sola página, secciones ancladas, navegación con scroll suave. Ancho máximo de contenido `1200px`, centrado, padding horizontal `40px` en desktop. Mobile-first: grids colapsan a 1 columna en < 768px.

1. **Navbar** (sticky, oscura)
2. **Hero** (fondo oscuro, con terminal + métricas)
3. **Trust strip** (stack tecnológico)
4. **Servicios** (6 tarjetas)
5. **Proceso** (4 pasos)
6. **Portfolio** (3 proyectos)
7. **CTA de contacto** (banda teal)
8. **Footer**

> La referencia visual maestra de esta estructura es **`XyraCode Landing.dc.html`** (línea oscura/teal).

---

## 4. Spec detallada por sección

### 4.1 Navbar (sticky)
- Contenedor: `position:sticky; top:0; z-index:50`, fondo `rgba(8,17,15,0.85)` + `backdrop-filter:blur(12px)`, borde inferior `1px rgba(255,255,255,0.06)`.
- Interior: `max-width:1200px`, padding `14px 40px`, flex `space-between`.
- **Izquierda:** logo `xc-teal-mark-bright.png`, alto ~32px.
- **Derecha:** links como **eyebrow labels** (uppercase, 11px, 800, tracking 0.2em) en `rgba(255,255,255,0.7)` — "Servicios", "Proceso", "Portfolio" — + botón "Cotizar".
- **Hover links:** color → `#5EEAD4` (Teal 300).
- **Botón "Cotizar":** fondo `#10B981`, texto `#08110F`, weight 700, 13px, padding `9px 18px`, radio 10px. Hover: fondo `#059669` + `translateY(-1px)`.

### 4.2 Hero (fondo oscuro)
- Fondo: `linear-gradient(155deg, #08110F 0%, #0d2b26 58%, #0F3D34 100%)`, color texto `#fff`, padding `80px 40px 96px`.
- Dos "blobs" difusos: `#10B981` opacity 0.20 blur 110px arriba-derecha; `#14B8A6` opacity 0.14 blur 120px abajo-izquierda.
- Layout: grid 2 col `1.08fr / 0.92fr`, gap `52px`, alineado al centro. Mobile: 1 columna.
- **Columna izquierda:**
  - Eyebrow "AGENCIA DE DESARROLLO WEB" color `#5EEAD4`.
  - H1: "Código que **impulsa** tu negocio" — weight 800, `font-size:58px`, `line-height:1.0`, `letter-spacing:-0.035em`; "impulsa" en `#5EEAD4`. (Escalar a ~34–38px en mobile.)
  - Párrafo: "Diseñamos y desarrollamos sitios, apps y plataformas a medida. Del prototipo a producción — rápido, escalable y sin fricción." — 17px, `line-height:1.6`, color `rgba(226,247,242,0.78)`, `max-width:460px`.
  - Botones: primario "Empezar proyecto" (fondo `#10B981`, texto `#08110F`, ícono lucide `arrow-right`) + "Ver portfolio" (ghost: borde `1px rgba(255,255,255,0.22)`, texto blanco). Radio 10px, padding `12px 22px`, gap 14px.
  - **Mini-stats** (fila, margin-top 44px, separadores verticales `1px rgba(255,255,255,0.12)`): **+40** Proyectos · **98%** Satisfacción · **6 años** Experiencia. Número weight 800 26px blanco; label eyebrow 10px `rgba(255,255,255,0.5)`.
- **Columna derecha — tarjeta "terminal":**
  - `background:rgba(255,255,255,0.04)`, borde `1px rgba(94,234,212,0.22)`, radio 16px, `backdrop-filter:blur(10px)`, sombra `0 30px 60px -30px rgba(0,0,0,0.6)`.
  - Barra superior: 3 dots (rojo/amarillo/verde) + `deploy.sh` en JetBrains Mono 11.5px `rgba(255,255,255,0.4)`, borde inferior `1px rgba(255,255,255,0.08)`.
  - Cuerpo (JetBrains Mono 13px, `line-height:2`, padding 22px):
    - `$ xyra build --prod` → `#5EEAD4`
    - `→ compilando módulos…` → `rgba(255,255,255,0.5)`
    - `→ optimizando assets…` → `rgba(255,255,255,0.5)`
    - `✓ build listo en 8.2s` → `#34D399`
    - `✓ deploy → producción` → `#34D399`
    - `→ https://tuapp.com  live ●` → `#5EEAD4` (con "live ●" en `rgba(255,255,255,0.35)`)

### 4.3 Trust strip (stack)
- Fondo `#08110F`, padding `22px 40px`, borde superior `1px rgba(255,255,255,0.05)`.
- Fila centrada, gap 40px, wrap. Eyebrow "STACK" en `rgba(255,255,255,0.35)` 10px + nombres weight 700 15px `rgba(255,255,255,0.55)`: **React · Next.js · Node · TypeScript · Tailwind · PostgreSQL**.

### 4.4 Servicios (`#servicios`)
- Contenedor claro (fondo global `#F6FBFA`), `max-width:1200px`, padding `88px 40px 40px`.
- **Encabezado centrado:** eyebrow "QUÉ HACEMOS" (`#0F766E`), H2 "Servicios a medida" (weight 800, 40px, `-0.03em`), subtítulo "Todo el ciclo de tu producto digital, con un solo equipo." (16px, `#64748B`).
- **Grid 3 columnas**, gap 22px. Tarjeta: `background:#fff`, borde `1px rgba(15,23,42,0.06)`, radio 16px, padding 26px. Hover: `translateY(-3px)` + sombra `0 22px 44px -26px rgba(11,31,28,0.38)`.
  - Ícono tile 48×48, radio 13px, fondo `#ECFDF5`, ícono lucide `#0F766E` 22px.
  - Título weight 700 17px; descripción 13.5px `#64748B`.
- **Contenido (6):**
  1. `globe` — **Sitios web** — "Landing, corporativos y e-commerce rápidos, medibles y a medida."
  2. `layout-dashboard` — **Web apps** — "Plataformas y dashboards con foco en producto, datos y escala."
  3. `smartphone` — **Apps móviles** — "Apps iOS/Android con una base de código, listas para crecer."
  4. `palette` — **Diseño UI/UX** — "Interfaces claras y accesibles, del wireframe al sistema de diseño."
  5. `zap` — **Performance** — "Optimización de velocidad, SEO técnico y Core Web Vitals."
  6. `wrench` — **Mantenimiento** — "Soporte continuo, mejoras y monitoreo para que nada se caiga."

### 4.5 Proceso (`#proceso`)
- `max-width:1200px`, padding `64px 40px`. Encabezado centrado: eyebrow "CÓMO TRABAJAMOS" (`#0F766E`), H2 "Proceso en 4 pasos".
- Grid 4 columnas, gap 18px. Tarjeta: `background:#fff`, borde `1px rgba(15,23,42,0.06)`, radio 16px, padding 24px.
  - Número mono `0N` en `#10B981` 13px weight 600; título weight 700 16px; desc 13px `#64748B`.
- **Pasos:** 01 **Descubrimiento** "Entendemos tu negocio, objetivos y usuarios." · 02 **Diseño** "Prototipamos la solución y validamos contigo." · 03 **Desarrollo** "Construimos con código limpio y entregas por sprint." · 04 **Lanzamiento** "Deploy, medición y soporte post-launch."

### 4.6 Portfolio (`#portfolio`)
- Fondo oscuro `#08110F`, color `#fff`, padding `88px 40px`.
- Encabezado en fila `space-between`: eyebrow "TRABAJOS RECIENTES" (`#5EEAD4`) + H2 "Portfolio"; a la derecha "Ver todos →" (eyebrow `rgba(255,255,255,0.6)`).
- Grid 3 columnas, gap 20px. Tarjeta: radio 16px, borde `1px rgba(255,255,255,0.08)`, fondo `rgba(255,255,255,0.03)`. Hover `translateY(-3px)`.
  - Cabecera visual 170px con degradado + ícono lucide 38px `rgba(255,255,255,0.9)`.
  - Cuerpo (padding 18–20px): título 700 16px; tipo 12.5px `rgba(255,255,255,0.5)`; tags mono 10.5px `#5EEAD4` sobre `rgba(94,234,212,0.1)`, padding `4px 9px`, radio 6px.
- **Proyectos (ejemplo — reemplazar con reales):**
  1. **Nova Store** — E-commerce — icon `shopping-bag` — bg `linear-gradient(150deg,#0F766E,#134E48)` — tags Next.js, Stripe.
  2. **Pulse Analytics** — Web app · Dashboard — icon `bar-chart-3` — bg `linear-gradient(150deg,#10B981,#059669)` — tags React, Node.
  3. **Rumbo App** — App móvil — icon `map` — bg `linear-gradient(150deg,#14B8A6,#0d5f56)` — tags React Native.

### 4.7 CTA de contacto (`#contacto`)
- Fondo `linear-gradient(150deg,#0F766E 0%,#0d5f56 100%)`, color `#fff`, padding `88px 40px`, blob `#34D399` opacity 0.25 blur 100px.
- Centrado, `max-width:760px`: eyebrow "¿TENÉS UN PROYECTO?" (`#CCFBF1`), H2 "Construyamos algo que funcione" (weight 800, 46px), párrafo "Contanos tu idea y te enviamos una propuesta en 48 horas." (17px `rgba(236,253,245,0.85)`).
- Botones: "Agendar llamada" (fondo `#fff`, texto `#0F766E`, ícono `calendar`) + "hola@xyracode.dev" (ghost, borde `rgba(255,255,255,0.4)`).

### 4.8 Footer
- Fondo `#050c0a`, texto `rgba(255,255,255,0.6)`, padding `52px 40px 34px`.
- Fila superior `space-between` (borde inferior `1px rgba(255,255,255,0.08)`):
  - Marca: logo `xc-teal-mark-bright.png` 30px + tagline "Agencia de desarrollo web. Diseño y código a medida para que tu negocio escale." (13px).
  - 3 columnas de links (eyebrow 10px `rgba(255,255,255,0.4)` + items 13px): **Servicios** (Sitios web / Apps a medida / Mantenimiento) · **Empresa** (Nosotros / Portfolio / Contacto) · **Contacto** (hola@xyracode.dev / Bogotá, Colombia).
- Fila inferior (12px `rgba(255,255,255,0.4)`): "© 2026 XyraCode. Todos los derechos reservados." + mono "hecho con </> en Colombia".

---

## 5. Interactions & Behavior
- **Nav links** → scroll suave a secciones ancladas (`#servicios`, `#proceso`, `#portfolio`, `#contacto`).
- **Hover botones:** oscurecer un paso (Emerald 500→600 `#059669`; Teal 700→800) + `translateY(-1px)`, transición `200ms ease`.
- **Hover tarjetas** (servicio/proyecto): `translateY(-3px)` + sombra suave, transición `220ms`.
- **Motion de entrada:** fade-in + slide-up (translateY 20px→0, ~0.5–0.6s ease-out) al entrar en viewport.
- **Responsive:** grids de 2/3/4 columnas → 1 columna en < 768px; H1 hero baja a ~34px; navbar → menú hamburguesa (`mobileNavOpen`).

## 5b. State Management
Landing mayormente estática. Estado mínimo: `mobileNavOpen` (menú mobile). Si se agrega formulario de contacto: estado del form + validación (nombre/email/mensaje requeridos, email válido) + estados idle/loading/success/error.

---

## 6. Design Tokens

### Colores — nombres reales (escala Tailwind CSS)
**Primario · Teal**
- `#CCFBF1` Teal 100 · `#5EEAD4` Teal 300 · `#14B8A6` Teal 500 · **`#0F766E` Teal 700 = primario de marca** · `#134E48` Teal 900

**Secundario · Emerald**
- `#D1FAE5` Emerald 100 · `#34D399` Emerald 400 · **`#10B981` Emerald 500 = secundario** · `#059669` Emerald 600 · `#065F46` Emerald 800 · `#ECFDF5` Emerald 50 (fondos de ícono/chips)

**Neutros · Ink & Slate**
- `#0B1F1C` Ink (texto fuerte / fondos oscuros) · `#1E293B` Slate 800 · `#64748B` Slate 500 (texto secundario) · `#CBD5E1` Slate 300 · `#E9EEF2` Slate 100 · `#F6FBFA` Off-white (fondo claro)

**Acento**
- `#F59E0B` Amber 500 · `#84CC16` Lime 500

**Semánticos**
- Éxito `#10B981` · Alerta `#F59E0B` · Error `#EF4444` · Info `#14B8A6`

**Fondos oscuros (hero/portfolio/nav):** base `#08110F`, degradados a `#0d2b26` / `#0F3D34`; footer `#050c0a`.

### Sugerencia `tailwind.config`
Mapear directo (los nombres coinciden con Tailwind). Alias de marca: `brand.primary = teal-700 (#0F766E)`, `brand.secondary = emerald-500 (#10B981)`, `brand.ink = #0B1F1C`, `brand.cream = #F6FBFA`.

### Tipografía
- **Principal:** Plus Jakarta Sans (300/400/500/700/800).
- **Mono:** JetBrains Mono (400/600) — solo código/terminal/números de paso/tags.
- **H1 display:** weight 800, `letter-spacing:-0.035em`, `line-height:~1.0`.
- **H2:** weight 800, 40–46px, `-0.03em`.
- **Cuerpo:** 15–17px, `line-height:1.6`, weight 400/500, color `#64748B` (sobre claro) / `rgba(226,247,242,0.78)` (sobre oscuro).
- **Eyebrow label (firma de marca):** UPPERCASE, 10–12px, weight 800, `letter-spacing:0.2em`. Para kickers, labels de nav y metadatos.

### Espaciado / forma
- Grid base 8px. Padding de secciones `64–88px` vertical, `40px` horizontal. Padding tarjetas 20–26px.
- Radios: botones 10px, tarjetas 16px, tiles de ícono 12–13px, chips/tags 6px, terminal 16px.
- Sombras difusas y frías (nunca negro duro): `0 22px 44px -26px rgba(11,31,28,0.38)`, botones con sombra en su propio tono.

---

## 7. Assets (carpeta `assets/`)
Derivados del logo original del cliente, recoloreados a la marca (Teal Esmeralda):
- `xc-teal-light.png` — logo completo (isotipo + wordmark), para **fondo claro**.
- `xc-teal-dark.png` — logo completo, teal brillante, para **fondo oscuro**.
- `xc-teal-trans.png` — logo completo, **fondo transparente**.
- `xc-teal-mark.png` — **isotipo solo**, transparente, color.
- `xc-teal-mark-bright.png` — isotipo solo, teal brillante, transparente (navbar/hero/footer sobre oscuro).
- `xc-teal-mark-white.png` — isotipo solo, blanco, transparente (favicon / app icon sobre teal).
- `xyracode-logo-original.png` — logo original del cliente (referencia de forma).

**Favicon / app icon:** isotipo blanco (`xc-teal-mark-white.png`) centrado sobre tile `#0F766E`, `border-radius` ~22%.
**Íconos UI:** lucide-react (glyphs indicados en §4).

---

## 8. Files de referencia en este bundle
- **`XyraCode Landing.dc.html`** — 🎯 **referencia maestra de la landing a desarrollar** (línea oscura/teal, spec §3–§4).
- `XyraCode Marca.dc.html` — manual de marca (logo claro/oscuro, isotipo, paleta extendida, tipografía).
- `assets/` — logos y marca en todas las versiones.

---

## 9. Arranque sugerido (para Claude Code)
1. Setup Next.js + Tailwind. Mapear la paleta (§6) a `tailwind.config` con los alias de marca.
2. Cargar Plus Jakarta Sans + JetBrains Mono con `next/font`.
3. Extraer primitivos reutilizables: `<Eyebrow>`, `<Button variant="primary|ghost|light">`, `<SectionHeading>`, `<Card>`.
4. Construir en orden: Navbar → Hero → Trust strip → Servicios → Proceso → Portfolio → CTA → Footer (spec §4).
5. Reemplazar los proyectos de portfolio y las métricas de ejemplo por datos reales antes de publicar.
6. Añadir formulario de contacto real en `#contacto` (o integración de agenda) cuando esté definido.
