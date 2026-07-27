# Handoff: Página 404 (not-found) — xyracode.com

## Overview
Página de error 404 para xyracode.com. Amigable para público no técnico: un "404" gigante con un OVNI flotante en el medio (el enlace se perdió en el espacio), titular tranquilizador, y dos salidas claras — volver al inicio o escribirnos. Marca XyraCode (teal sobre fondo ink), con animaciones suaves de entrada y flotación.

Ruta a implementar: `app/not-found.tsx` (Next.js App Router — se dispara automáticamente en rutas inexistentes y en llamadas a `notFound()`).

## About the Design File
`XyraCode 404.dc.html` es un prototipo hecho en HTML: **referencia visual, no código de producción**. Usa un runtime propio (`support.js`, `<x-dc>`, `<helmet>`) — ignorar ese scaffolding; portar solo el contenido del `<div>` raíz y los keyframes. Recrear con Tailwind + `@keyframes` en `globals.css`, reutilizando el nav y los componentes de botón que ya existen en el sitio.

## Fidelity
**High-fidelity.** Colores, tamaños, copy y timings son finales.

## Estructura

### Contenedor raíz
`min-height:100vh`, `display:flex; flex-direction:column`, `position:relative; overflow:hidden`, texto blanco.
Fondo: `radial-gradient(1200px 800px at 50% 0%, #0d2b26 0%, #08110F 62%)`.
Dos blobs decorativos absolutos (`pointer-events:none`), `border-radius:9999px`, `filter:blur(150px)`:
- arriba-izquierda: `top:-160px; left:-120px; 520×520; background:#0F766E; opacity:0.35`
- abajo-derecha: `bottom:-220px; right:-100px; 560×560; background:#10B981; opacity:0.14`

### Nav
El nav existente del sitio (logo horizontal izq + links). En el prototipo es una versión simplificada con `padding:26px 56px`, links 14px/600 en `rgba(226,247,242,0.6)`. **Usar el componente real del sitio**, sin ítem activo.

### Bloque central
`flex:1`, centrado vertical y horizontal, `text-align:center`, `padding:40px 56px 80px`, `gap:36px`.

1. **"4 🛸 4"** — fila flex, `gap:24px`, `font-size:210px`, `font-weight:800`, `letter-spacing:-0.05em`, `line-height:0.9`, color `#5EEAD4`, `user-select:none`, `cursor:default`.
   El emoji 🛸 va en su propio `<span>` a `font-size:170px`, `display:inline-block`.
   Animaciones: el contenedor lleva `xcFloat404 6s ease-in-out infinite, xcGlow 4s ease-in-out infinite`; el OVNI lleva `xcSpin 8s ease-in-out infinite`. En hover del contenedor: `animation: xcFloat404 0.4s ease-in-out` (un rebote rápido — detalle lúdico).
2. **`<h1>`** — "Uy… esta página no existe" · 44px/800, `letter-spacing:-0.03em`, `line-height:1.05`, `xcFadeUp 0.6s ease-out both`.
3. **Párrafo** — "Puede que el enlace esté mal escrito o que la página se haya movido. No te preocupes, no hiciste nada mal — volvamos a un lugar seguro." · 19px, `rgba(226,247,242,0.7)`, `line-height:1.65`, `max-width:540px`, `xcFadeUp 0.7s`.
4. **Botones** — fila flex `gap:16px`, `xcFadeUp 0.8s`:
   - Primario → `/`: "← Volver al inicio". Pill `#10B981`, texto `#04211A`, 16px/800, `padding:17px 34px`, sombra `0 16px 38px -16px rgba(16,185,129,0.6)`. Hover: `translateY(-2px)` + sombra `0 22px 46px -18px rgba(16,185,129,0.8)`.
   - Ghost → `/contacto`: "Escribinos". Borde `1px rgba(94,234,212,0.35)`, texto `#5EEAD4`, 16px/700, mismo padding y radio. Hover: `background:rgba(94,234,212,0.08)`.
   Usar `next/link` en ambos.

## Animaciones (keyframes → globals.css)
```css
@keyframes xcFloat404 { 0%,100% { transform:translateY(0) rotate(-1deg);} 50% { transform:translateY(-14px) rotate(1deg);} }
@keyframes xcGlow     { 0%,100% { text-shadow:0 0 40px rgba(16,185,129,0.35);} 50% { text-shadow:0 0 70px rgba(16,185,129,0.6);} }
@keyframes xcSpin     { 0%,100% { transform:translateY(0) rotate(-8deg);} 50% { transform:translateY(-20px) rotate(8deg);} }
@keyframes xcFadeUp   { from { opacity:0; transform:translateY(16px);} to { opacity:1; transform:translateY(0);} }
```
**Accesibilidad:** envolver las animaciones infinitas (`xcFloat404`, `xcGlow`, `xcSpin`) en `@media (prefers-reduced-motion: no-preference)`; con reduced-motion, todo estático (los `xcFadeUp` pueden quedar o quitarse, son de entrada única).

## Tokens de marca
- Fondos: `#08110F` (base), `#0d2b26` (centro del gradiente)
- Acentos: `#5EEAD4` (404 + ghost), `#10B981` (CTA + glow), `#04211A` (texto sobre CTA), `#0F766E` (blob)
- Texto atenuado: `rgba(226,247,242, 0.7 / 0.6)`
- Tipografía: Plus Jakarta Sans (ya cargada en el sitio)
- Radios: pills 9999px

## Responsive
Bajo ~768px: el "404" baja a ~110px y el OVNI a ~90px (`gap:14px`); h1 a ~30px; párrafo 17px; padding lateral 24px; los botones pasan a columna (`flex-direction:column; width:100%`) con ancho completo.

## Metadata / comportamiento
- `export const metadata = { title: "Página no encontrada — Xyra Code", robots: { index: false, follow: true } }` (no indexar el 404).
- Next devuelve status 404 automáticamente desde `app/not-found.tsx`.
- Verificar que `/contacto` exista; si el contacto es una sección de la home, apuntar a `/#contacto`.

## Files
- `XyraCode 404.dc.html` — prototipo de referencia (contiene todos los valores)
- `support.js` — runtime del prototipo; **no portar**
- `assets/xc-teal-horizontal-trans.png` — logo horizontal (el sitio ya lo tiene)
