# Imagen Open Graph específica de /nosotros

**Fecha:** 2026-07-12
**Estado:** aprobado por Yeison (composición foto + titular)

## Problema

`/nosotros` hereda la imagen OG genérica de la raíz (`app/opengraph-image.tsx`). Al compartir el enlace en WhatsApp/redes se ve la tarjeta corporativa, sin la persona que es justamente el foco de la página.

## Solución

Nuevo archivo `app/nosotros/opengraph-image.tsx` con la convención de metadata de Next (`ImageResponse` de `next/og`, misma API que la imagen raíz). Por vivir en el segmento `app/nosotros/`, Next lo inyecta como `og:image` solo para esa ruta, pisando la genérica. No se toca `page.tsx` ni `lib/content.ts`.

## Composición (1200×630)

Mismo lenguaje visual que la OG raíz para coherencia de marca:

- **Fondo:** gradiente verde oscuro `#08110F → #0d2b26 → #0F3D34` (155deg) con blob de acento `#10b981` difuminado arriba a la derecha.
- **Arriba izquierda:** logo horizontal transparente (`xc-teal-horizontal-trans.png`), altura 64.
- **Columna izquierda:**
  - Kicker `NOSOTROS` en teal `#5eead4`, uppercase, letterspacing amplio.
  - Titular "El desarrollador **detrás de XyraCode**" (~68px, extrabold, tracking negativo, acento teal en la segunda línea).
- **Derecha:** foto del fundador (`founder.png`, 900×900) en círculo ~330px, `objectFit: cover`, anillo teal sutil.
- **Pie:** izquierda "Yeison Enciso · Villavicencio, Colombia"; derecha "xyracode.com" en teal bold.
- **`alt` exportado:** "Yeison Enciso — El desarrollador detrás de XyraCode".

## Detalles técnicos

- Foto y logo embebidos como base64 vía `readFile(join(process.cwd(), "public/assets/…"))`, patrón idéntico al de la raíz (Satori no resuelve URLs relativas en build).
- Círculo con `borderRadius` + `objectFit: "cover"` (soportado por Satori).
- Exports: `alt`, `size = { width: 1200, height: 630 }`, `contentType = "image/png"`.

## Verificación

1. `npm run dev` → el HTML de `/nosotros` emite `<meta property="og:image">` apuntando a `/nosotros/opengraph-image`.
2. Abrir `/nosotros/opengraph-image` y ver el PNG renderizado con foto + titular.
3. La home sigue usando la OG genérica de la raíz.
