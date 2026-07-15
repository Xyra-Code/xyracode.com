# Handoff: Plantillas de página — xyracode.com (bloque 4A)

## Overview
Seis plantillas de UI/layout para nuevas rutas de xyracode.com, dirigidas por datos (App Router, Next 16). Este paquete es la **referencia visual** del punto 4A del plan (diseño de layout, no imágenes). Cada plantilla debe recrearse en el codebase real siguiendo sus patrones actuales (nav/footer existentes, tokens, `lib/content/`, renderer de bloques).

Rutas a implementar:
1. `app/servicios/[slug]/page.tsx` — **Página de servicio** (hero + beneficios + mini-caso + CTA)
2. `app/servicios/page.tsx` — **Hub de servicios** (intro + grid de 4 tarjetas + CTA)
3. `app/proyectos/page.tsx` — **Índice de proyectos** (destacado + grid que crece)
4. `app/proyectos/[slug]/page.tsx` — **Caso de estudio** (hero + cover + ficha lateral + cuerpo de bloques + galería + resultado)
5. `app/blog/page.tsx` — **Índice de blog** (destacado + lista)
6. `app/blog/[slug]/page.tsx` — **Artículo** (cabecera + portada + cuerpo de bloques + bio autor)

## About the Design File
`XyraCode Plantillas Web.dc.html` es un prototipo hecho en HTML: **referencia de layout, no código de producción**. Usa un runtime propio (`support.js`, `<x-dc>`, `<x-import>`, `<helmet>`) — ignorar ese scaffolding. Lo relevante es el markup interior con estilos inline y los tokens listados abajo. Cada plantilla vive en un `.tpl` con `data-screen-label`. Ábrelo en el navegador para ver las 6 lado a lado (modo canvas).

Los **recuadros con patrón diagonal punteado** son slots de assets raster (bloque 4B) — reemplazar por `next/image`. Las tarjetas con `opacity` reducida son estados "slot disponible" que ilustran cómo escala la grilla; no son contenido real.

## Fidelity
**High-fidelity de layout.** Estructura, jerarquía, espaciados, tipografía y tokens son finales. El copy es representativo (real donde se pudo: Vuelo Carmesí, "¿Cuánto cuesta una web en Colombia 2026?", autor Yeison) — el texto definitivo sale de `lib/content/`. Recrear con Tailwind mapeando los hex a los tokens existentes del sitio donde coincidan.

## Modelo de datos (tipado, en `lib/content/`)
Cuerpo largo (casos y artículos) = array de bloques con renderer único reutilizable. El prototipo muestra los 5 tipos:
```ts
type Block =
  | { kind: "h2"; text: string }
  | { kind: "p"; text: string }
  | { kind: "ul"; items: string[] }
  | { kind: "image"; src: string; alt: string; caption?: string }
  | { kind: "quote"; text: string };
```
Tipos nuevos: `ServicePage`, `CaseStudy`, `BlogPost` — cada uno con `slug`, `seo:{title,description}`, `lastModified`, y `body: Block[]`. Slugs de servicios: `desarrollo-web`, `apps-a-medida`, `ecommerce`, `desarrollo-web-villavicencio`.

## Design Tokens (marca XyraCode)
- Fondos: `#08110F` (canvas página), `#0B1F1C` (bloque destacado/alterno), doc/bg exterior `#0A1412`
- Acentos: `#5EEAD4` (teal bright, links + eyebrows + iconos), `#2DD4BF` (link hover), `#10B981` (CTA / números resultado), `#04211A` (texto sobre CTA), `#A7F3D0` (mono claro chips)
- Blobs decorativos: círculo `#0F766E`, `filter: blur(130px)`, opacity 0.25–0.4, en esquinas del hero
- Texto: blanco titulares; atenuado `rgba(226,247,242, 0.72 / 0.6 / 0.5 / 0.45)`
- Bordes: `rgba(94,234,212, 0.1–0.2)`; cards `rgba(94,234,212,0.15)` bg `rgba(255,255,255,0.03)`
- Tipografía: **Plus Jakarta Sans** (titulares 800, `letter-spacing:-0.03em`, line-height ~1.02; eyebrow 12px/800/`letter-spacing:0.22em`/uppercase/teal). **JetBrains Mono** 400–700 para breadcrumbs, metadatos, chips de stack, timestamps.
- Radios: pills 9999px, cards 16–20px, chips 8px; iconos en cuadro redondeado 14–16px
- Espaciado: hero 56–72px vertical, 56px lateral; gaps de grid 20–22px
- Iconos: **lucide** (outline). En servicios/hub: `gauge, pen-tool, code-2, globe, layout-dashboard, shopping-cart, map-pin`. Tamaño 26–28px, color teal.

## Componentes compartidos (reutilizar los del sitio o crear una vez)
- **Nav**: logo horizontal izq + links (Servicios/Proyectos/Blog/Nosotros/Contacto); ítem activo en `#5EEAD4`. Borde inferior `rgba(94,234,212,0.1)`.
- **Footer**: borde superior, mono 13px, "© 2026 Xyra Code · Villavicencio, Colombia" ↔ "contacto@xyracode.com".
- **Botones**: primario pill `#10B981`/texto `#04211A`/800; ghost pill borde teal/texto teal.
- **Eyebrow**: kicker uppercase teal.
- **Chip**: pill `rgba(94,234,212,0.12)`/texto teal (tags), o mono para stack.
- **BlockRenderer**: pinta `body: Block[]` → h2 (30px/800), p (17.5px/1.75, `rgba(226,247,242,0.78)`), ul (disc, gap 10px), image (radius 16px + caption), quote (`border-left:3px #5EEAD4`, 22px/600). Ancho de lectura ~720px centrado en artículos.

## Por plantilla — estructura

### 1. Página de servicio (`/servicios/[slug]`)
Nav → hero (breadcrumb mono + eyebrow + h1 56px + intro 19px + botones primario/ghost, blob esquina) → **Qué incluye**: grid 3 col de feature cards (icono en cuadro tinte + título 18px + desc) → **Prueba/mini-caso** sobre `#0B1F1C`: grid 2 col (screenshot 16:10 izq + nombre/cita/2 stats + link "Ver caso completo") → **CTA** centrado (h2 38px + subcopy + botón, blob central) → footer.

### 2. Hub de servicios (`/servicios`)
Nav → hero centrado (eyebrow + h1 52px + intro, blob superior) → grid **2×2** de tarjetas grandes (icono 56px + título 24px + desc + "Ver servicio →"), una por servicio → footer.

### 3. Índice de proyectos (`/proyectos`)
Nav → encabezado (eyebrow + h1 52px + intro) → **destacado**: card horizontal 2 col (cover 16:10 + tags/título 30px/desc/link) → **grid 3 col** de cards (cover 16:10 + título + resumen); incluir estados "slot disponible" atenuados para mostrar el crecimiento → footer.

### 4. Caso de estudio (`/proyectos/[slug]`)
Nav → hero (breadcrumb + tags + h1 58px + intro) → **cover grande** 16:8 full-width → layout **2 col**: ficha lateral sticky (Cliente / Año / Stack chips mono / botón "Visitar sitio") + cuerpo de bloques (h2, p, ul, image inline, quote) → **Resultado**: panel `#0B1F1C` con 3 stats grandes teal → **Galería**: grid 3 col 4:3 → footer.

### 5. Índice de blog (`/blog`)
Nav → encabezado (eyebrow + h1 52px + intro) → **destacado**: card horizontal 2 col (portada 16:10 + categoría·tiempo mono + título 28px + resumen + "Leer artículo →") → **grid 3 col** (portada 16:9 + categoría + título), con slots atenuados → footer.

### 6. Artículo (`/blog/[slug]`)
Nav → cabecera centrada (categoría·tiempo·fecha mono + h1 52px + bajada 19px, blob) → **portada** 16:8 centrada max 900px → **cuerpo de bloques** centrado max 720px (h2/p/ul/image/quote) → **bio de autor**: panel `#0B1F1C` (avatar circular 72px + "Escrito por" eyebrow + nombre + una línea) → footer.

## SEO / datos estructurados (del plan, para no perder contexto)
- `generateMetadata` deriva de `seo.title/description` del objeto de datos; `generateStaticParams` desde los arrays.
- `sitemap.ts` deriva URLs y `lastModified` de los arrays (sin `new Date()`).
- JSON-LD colgado del `@graph` con `@id` existente: añadir `#person` (Yeison); Servicio→`Service` (+`BreadcrumbList`); Caso→`CreativeWork/SoftwareApplication` (author `#person`, publisher `#organization`); Artículo→`BlogPosting` (author `#person`); hub/índices→`CollectionPage`+`BreadcrumbList`.
- Enlazado interno: nav/footer → `/servicios` y `/blog`; home → caso de estudio (`caseStudyHref`).

## Assets raster (bloque 4B — los aporta el cliente)
Cada recuadro punteado del prototipo es un slot: cover de caso (1600×800), screenshots de galería (3–5, 4:3/16:10), cover de proyecto en índice (1200×750), portada de artículo (1200×630), imágenes inline (1200×675), foto del autor (circular). OG por ruta se generan por código (`opengraph-image.tsx`), no requieren asset manual.

## Files
- `XyraCode Plantillas Web.dc.html` — las 6 plantillas (referencia visual)
- `support.js`, `image-slot.js`, `_ds/` — runtime del prototipo, solo para abrirlo; **no portar**
- `assets/xc-teal-horizontal-trans.png` — logo horizontal (el sitio ya lo tiene)
