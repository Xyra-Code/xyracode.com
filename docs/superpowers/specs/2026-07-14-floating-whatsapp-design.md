# Botón flotante de WhatsApp — Diseño

**Fecha:** 2026-07-14
**Estado:** Aprobado (pendiente revisión del spec)

## Objetivo

Añadir un botón flotante de WhatsApp, siempre visible durante el scroll y con
animación, para dar un canal de contacto inmediato en todas las páginas del
sitio. WhatsApp es el canal esperado para negocios en Colombia (sitio `es-CO`,
Villavicencio) y tiene menos fricción que agendar una llamada, que se mantiene
como CTA deliberado dentro de la sección de contacto.

## Decisiones tomadas

- **Acción:** solo WhatsApp (no Cal.com, no ambos). Sin JS de terceros nuevo.
- **Alcance:** todas las páginas → montado una vez en `app/layout.tsx`.
- **Ocultado:** se desvanece cuando `#contacto` (home) o `footer` (todas las
  páginas) entran al viewport, para no duplicar el WhatsApp que ya vive en la
  sección CTA ni tapar el footer.
- **Móvil:** botón circular solo con ícono; desde `sm`, pill con ícono + texto.

## Componente nuevo: `components/sections/FloatingWhatsApp.tsx`

Client component (`"use client"`), autocontenido. No recibe props.

### Enlace

- `href`: `https://wa.me/${CONTACT.whatsapp}?text=${encodeURIComponent(CONTACT.whatsappMessage)}`
- `target="_blank"`, `rel="noopener noreferrer"`.
- Reutiliza `CONTACT` (`lib/content`) y `WhatsAppIcon` (`components/ui/BrandIcons`).
- Es un `<a>` (navegación externa), no un `<button>`.

### Presentación

- Contenedor `fixed bottom-6 right-6 z-40`.
  - `z-40`: por debajo del navbar sticky (`z-50`) y de cualquier modal.
  - Respeta el notch en móvil con
    `style={{ bottom: "calc(1.5rem + env(safe-area-inset-bottom))" }}`.
- Color WhatsApp: fondo `#25D366`, ícono/texto blancos. Se define como clase
  utilitaria con color arbitrario de Tailwind (`bg-[#25D366]`), sin tocar el
  theme de marca. Hover: leve `-translate-y-px` + sombra, coherente con los
  botones `primary`/`light` existentes.
- Forma:
  - Base (móvil): círculo `h-14 w-14 rounded-full`, solo `<WhatsAppIcon />`.
  - `sm:` pill `rounded-full px-5 py-3.5` con ícono + texto "WhatsApp".
  - El texto se muestra con `hidden sm:inline`.
- Sombra flotante (`shadow-lg`) para separarlo del contenido.

### Animación

- **Entrada al montar:** fade + slide-up. Reutiliza el patrón `.reveal` /
  `.reveal.is-visible` ya existente en `globals.css` (mismo timing/easing que el
  resto del sitio), activándolo tras el primer paint.
- **Reposo (atención):** anillo/pulso sutil detrás del botón mediante un
  `<span aria-hidden>` con `animate-ping`-like suave (opacidad baja, ~2s,
  infinito). Keyframe propio en `globals.css` para controlar intensidad
  (más discreto que el `ping` por defecto).
- **Ocultado:** al ocultarse, transición de opacidad + `translateY`/`scale`
  hacia fuera; `pointer-events-none` mientras está oculto para no capturar
  clicks fantasma.
- **`prefers-reduced-motion`:** todas las animaciones (entrada, pulso,
  transición de ocultado) se desactivan bajo el bloque
  `@media (prefers-reduced-motion: reduce)` ya presente en `globals.css`.

### Lógica de ocultado

- `useEffect` monta un `IntersectionObserver` sobre los elementos que existan
  entre `#contacto` y `footer` (se consultan con `document.querySelector`).
- Estado `hidden` (boolean): `true` cuando **cualquiera** de los observados
  está intersectando el viewport; `false` en caso contrario.
- El observer se limpia en el cleanup del efecto.
- Si ninguno de los elementos existe en la página, el flotante queda siempre
  visible (comportamiento seguro por defecto).

### Accesibilidad

- `aria-label="Escríbenos por WhatsApp"` en el `<a>` (imprescindible porque en
  móvil solo se ve el ícono).
- El `<span>` del pulso lleva `aria-hidden`.
- Foco visible coherente con el resto (`focus-visible:outline`).

## Copys centralizados: `lib/content/ui.ts`

Añadir un bloque para no hardcodear texto (coherente con la centralización de
copy del proyecto):

```ts
floatingWhatsApp: {
  label: "WhatsApp",
  aria: "Escríbenos por WhatsApp",
}
```

`FloatingWhatsApp` consume `UI.floatingWhatsApp`.

## Montaje: `app/layout.tsx`

Renderizar `<FloatingWhatsApp />` dentro de `<body>`, después de `{children}`
(antes o después del `<script>` JSON-LD es indiferente).

## Estilos: `app/globals.css`

Añadir el keyframe del pulso de atención y su clase, con la desactivación
correspondiente dentro del bloque `prefers-reduced-motion` existente.

## Fuera de alcance (YAGNI)

- No se toca `ScheduleButton` ni la lógica de Cal.com.
- No se añade un segundo flotante (Agendar llamada).
- No se persiste estado de "cerrado por el usuario" (el botón no es descartable).

## Archivos afectados

- **Nuevo:** `components/sections/FloatingWhatsApp.tsx`
- **Modificar:** `app/layout.tsx` (montaje)
- **Modificar:** `lib/content/ui.ts` (copys)
- **Modificar:** `app/globals.css` (keyframe del pulso)
