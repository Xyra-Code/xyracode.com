# Design brief · Demo de tienda para prospectos

Sistema reusable + primera identidad. Destino: `Next.js 16 (App Router) + Tailwind v4 + TS`,
prerender estático, mobile-first, carrito en `localStorage`, iconos lucide outline.

Diseño: `Demo-Tienda-Palomita.dc.html` · Especificación completa: `README.md`

---

## 1. Qué se entrega

| # | Pantalla | Ruta | id en el diseño |
|---|---|---|---|
| — | Identidad (wordmark, paleta, tipografía, tokens) | — | `1a` |
| 1 | Home | `/demos/[cliente]` | `1b` |
| 2 | Catálogo | `/demos/[cliente]/catalogo` | `1c` |
| 3 | Detalle de producto | `/demos/[cliente]/p/[producto]` | `1d` |
| 4 | Carrito (panel lateral) | sobre cualquiera | `1e` |
| — | Prueba de reuso: catálogo con otra marca | — | `1f` |

Cada pantalla en **desktop (1240px de contenido)** y **móvil (390px)**. Sin 404 propia.
Sin galerías de producto (una sola imagen por producto). Sin checkout: cierra en WhatsApp.

## 2. Cliente 1 · Palomita

Tienda deportiva de **guantes de arquero** e indumentaria de portero, Villavicencio (Meta).
12 referencias · 3 categorías: Guantes (5) · Indumentaria (4) · Accesorios (3) · 4 destacados.
Wordmark tipográfico `PALO` (Archivo 700) + `MITA` (Archivo 500 en acento). No hay logo.

**Qué comunica:** espontáneo, moderno y de cancha. Verde ácido sobre negro cálido — el código
visual del arquero actual (guantes fluor, luz artificial, partido de noche), sin degradados,
sin glassmorphism y sin sombras. Lo más lejano posible de la paleta de XyraCode y de la
plantilla blanca-y-azul de e-commerce genérico.

## 3. Contrato de tokens — dos capas

**Identidad (4 variables, `tema` en los datos).** Es todo lo que cambia por cliente:

```
fondo #0E0E10 · texto #F2F2EF · acento #C6F24E · acentoTexto #0E0E10
```

**Sistema (derivado, igual para todos).** Reglas completas en `README.md`; resumen:
`superficie = mix(fondo, texto 6%)` · `superficieFoto 9%` · `borde 12%` · `bordeFuerte 30%` ·
`atenuado = mix(texto, fondo 58%)` · `acentoSuave = mix(acento, fondo 88%)` ·
`franja XyraCode = tema invertido` · `radio 4px` (chips y contador `999px`) · `sombra: ninguna`.

**No entra en las 4 variables** (decidir antes de codear): el corte del wordmark en dos pesos
(posible `negocio.wordmark: {parte1, parte2}`) y la tipografía, que es del sistema y no del
cliente (Archivo + Manrope + Space Mono para todas las demos).

Funciona con `fondo` oscuro y claro: `1b`–`1e` son oscuros, `1f` es claro, mismo layout.

## 4. Franja de XyraCode

Única presencia de la agencia. `fixed top:0`, alto 40 desktop / 32 móvil, mono 13/11px:
**"Demo · hecha por XyraCode"** + botón discreto "Quiero una así" a WhatsApp en pestaña nueva.
Deriva del tema por inversión (clara sobre tienda oscura, oscura sobre tienda clara).
El nav de la tienda es `sticky top:40/32` (alto 72/52): **112px fijos en desktop, 84px en
móvil** (21% de 390×844), `scroll-padding-top: 84px`. Nada más se fija.

## 5. Componentes compartidos

Franja XyraCode · nav de tienda · contador de carrito (pill, crece a lo ancho) · tarjeta de
producto (única para grid, destacados y relacionados) · chips de categoría (pill, scroll
horizontal en móvil) · selector de talla · selector de cantidad (48px) · botón primario
(relleno de acento, Archivo 700 en mayúsculas) · botón secundario (borde) · panel de carrito
(420px lateral / pantalla completa en móvil) · tira de confianza · footer del cliente.

Áreas táctiles mínimas 44px. Iconos lucide outline, trazo 1.6–1.75 a 18–20px.

## 6. Estados obligatorios

Carrito vacío · `precio: null` → "Consultar por WhatsApp" (intencional, con barra de acento) ·
producto sin variantes (desaparece Talla, no se descuadra) · categoría sin resultados ·
nombre largo a dos líneas sin romper el grid · contador en 0 / 1 / 2 dígitos ·
sin JavaScript (catálogo y precios legibles + enlace `wa.me` por producto).
Ubicación de cada uno: tabla en `README.md`.

## 7. Fotos del cliente

Las fotos salen de Instagram: fondos, luz y recortes distintos. El sistema lo absorbe:
proporción forzada 1:1, `object-fit: contain`, fondo `superficieFoto`, borde inferior 1px.
Nunca `cover`, nunca blanco puro. Dos productos en `1c` y `1f` simulan foto "fea".

**Slots:** producto 1:1 800×800 (sirve a grid, detalle y miniatura del carrito) ·
hero 16:9 1600×900 · logo opcional (si falta, wordmark).

## 8. Criterio de aceptación

1. La demo se lee como la tienda del cliente, no como una sección de xyracode.com.
2. Los precios y nombres se leen a 390px en un Android de gama media, al sol.
3. La siguiente demo se resuelve cambiando **solo** las 4 variables de identidad y los datos.
4. `1f` prueba el punto 3: mismo layout, otra marca, fondo del signo opuesto.
