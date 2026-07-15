# Handoff: Botón flotante de WhatsApp — xyracode.com

## Overview
Botón flotante (FAB) de WhatsApp, fijo abajo a la derecha en todas las páginas de xyracode.com. En reposo muestra solo el glifo de WhatsApp (sin círculo) con animaciones para atraer la atención; en hover revela una etiqueta "Hablemos de tu proyecto" y abre un chat de WhatsApp con mensaje pre-cargado. Alineado a la marca XyraCode (teal sobre fondo ink).

## About the Design File
`XyraCode Boton WhatsApp.dc.html` es un prototipo hecho en HTML (runtime propio: `support.js`, `<x-dc>`, `<helmet>`) — **referencia visual, no código de producción**. Ignorar ese scaffolding; portar solo el componente FAB (el `<a class="wa-fab">` fijo) más sus keyframes. El archivo también muestra dos estados de referencia (Reposo / Hover) en la parte superior — son solo ilustrativos, NO forman parte del componente a implementar.

Implementar como componente cliente reutilizable montado una vez en el layout raíz: `components/WhatsAppFab.tsx` (Next.js, `"use client"`), incluido en `app/layout.tsx`.

## Fidelity
**High-fidelity.** Colores, tamaños, animaciones y timings son finales. Recrear con Tailwind + un bloque de `@keyframes` en `globals.css` (Tailwind no expresa estos keyframes custom inline).

## Estructura del componente
`<a>` fijo (`position:fixed; right:28px; bottom:28px; z-index:9999`), `display:flex; align-items:center`, sin subrayado. Entrada con `xcFadeUp 0.5s ease-out both`.
- **Etiqueta (`.wa-label`)**: a la izquierda del ícono, colapsada por defecto (`max-width:0; opacity:0; overflow:hidden`), transición `max-width .35s, opacity .25s, margin .35s`. En hover del `<a>` se expande a `max-width:280px; opacity:1; margin-right:14px`. Contenido: panel `rgba(11,31,28,0.85)`, borde `1px rgba(94,234,212,0.28)`, `border-radius:16px`, `padding:10px 18px`, `backdrop-filter:blur(14px)`, sombra `0 18px 40px -22px rgba(0,0,0,0.8)`. Dentro: eyebrow "WHATSAPP" (10px/800/`letter-spacing:0.16em`/uppercase/`#5EEAD4`) + "Hablemos de tu proyecto" (14px/700/`#fff`).
- **Ícono (`.wa-core`)**: glifo SVG de WhatsApp **sin círculo detrás**, `fill:#5EEAD4`, 56px, `filter:drop-shadow(0 8px 22px rgba(16,185,129,0.5))`. Contenedor `position:relative`, animación de flotación. Un `<span class="wa-halo">` absoluto detrás (56px, `border-radius:9999px`, `background:radial-gradient(circle,#10B981 0%,rgba(16,185,129,0) 70%)`) hace el pulso.

## Animaciones (keyframes → globals.css)
```css
@keyframes xcFadeUp { from { opacity:0; transform:translateY(12px);} to { opacity:1; transform:translateY(0);} }
@keyframes xcFloat  { 0%,100% { transform:translateY(0);} 50% { transform:translateY(-6px);} }
@keyframes xcHalo   { 0% { transform:scale(0.7); opacity:0.55;} 70%,100% { transform:scale(1.9); opacity:0;} }
@keyframes xcWiggle { 0%,88%,100% { transform:rotate(0);} 91% { transform:rotate(-11deg);} 94% { transform:rotate(9deg);} 97% { transform:rotate(-5deg);} }
```
Aplicación:
- `.wa-core` → `animation: xcFloat 3.4s ease-in-out infinite` (flotación vertical).
- `.wa-halo` → `animation: xcHalo 2.8s ease-out infinite` (pulso hacia afuera).
- svg del glifo → `animation: xcWiggle 5s ease-in-out infinite; transform-origin:center` (saludo cada ~5s).
- hover del `<a>`: `.wa-core { transform:translateY(-2px) scale(1.05); animation-play-state:paused; }` y `.wa-label` se expande (ver arriba).
- **Accesibilidad**: envolver todas las animaciones infinitas en `@media (prefers-reduced-motion: no-preference)`; con reduced-motion, ícono estático (mantener solo el hover).

## SVG del glifo
Usar el path oficial de WhatsApp (viewBox `0 0 32 32`, un solo `<path>`, `fill` heredado del color). Está en el prototipo — copiarlo textual. `aria-hidden` en el svg; el `<a>` lleva `aria-label="Escríbenos por WhatsApp"`.

## Comportamiento / enlace
`href="https://wa.me/57XXXXXXXXXX?text=Hola%20Xyra%20Code%2C%20quiero%20cotizar%20un%20proyecto"`, `target="_blank"`, `rel="noopener"`. **Reemplazar el número** por el de WhatsApp Business real (formato internacional, sin `+` ni espacios). Mensaje pre-cargado configurable vía prop `message`.

## Tokens de marca
- Ícono/eyebrow teal: `#5EEAD4`; halo/sombra verde: `#10B981` / `rgba(16,185,129,…)`.
- Panel etiqueta: `rgba(11,31,28,0.85)` + borde `rgba(94,234,212,0.28)`; texto blanco `#fff`.
- Tipografía: Plus Jakarta Sans (ya cargada en el sitio).
- Radios: panel 16px; halo full-round. Offset FAB: 28px/28px (en mobile bajar a 20px/20px).

## Files
- `XyraCode Boton WhatsApp.dc.html` — prototipo de referencia (contiene el SVG y todos los valores)
- `support.js`, `_ds/` — runtime del prototipo; **no portar**
