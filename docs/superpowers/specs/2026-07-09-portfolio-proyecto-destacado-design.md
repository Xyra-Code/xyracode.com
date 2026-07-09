# Portfolio: proyecto destacado

**Fecha:** 2026-07-09
**Estado:** aprobado en conversación

## Problema

La sección Portfolio muestra una grilla de 3 tarjetas, pero solo "Vuelo Carmesí" es un proyecto real. "Pulse Analytics" y "Rumbo App" son placeholders sin descripción, capturas ni enlaces: evidencian un portafolio flaco y arriesgan credibilidad si un prospecto pregunta por ellos. Además, el link "Ver todos →" apunta a `#contacto`, prometiendo un listado que no existe.

## Decisión

Convertir la sección en un formato de **proyecto destacado**: una tarjeta a ancho completo por proyecto, en lugar de una grilla que evidencia vacíos.

## Cambios

### `lib/content.ts`

- Eliminar las entradas "Pulse Analytics" y "Rumbo App" de `PROJECTS`.
- Eliminar los imports de íconos que queden sin uso (`ChartColumn`, `Map`).

### `components/sections/Portfolio.tsx`

- Reemplazar la grilla `md:grid-cols-3` por tarjetas a ancho completo apiladas verticalmente.
- Layout interno de cada tarjeta en escritorio: dos columnas — carrusel de capturas a la izquierda (~55% del ancho, con mayor presencia que el `aspect-11/5` actual) y a la derecha título, pill de estado, descripción, tipo/rol, tags, features y botones ("Ver sitio" / "Caso de estudio").
- En móvil: se apila (capturas arriba, contenido abajo).
- Quitar el link "Ver todos →" del encabezado.
- Conservar: animaciones `Reveal`, estética actual (bordes `white/8`, fondo `bg-night`, acentos teal), componente `ProjectCarousel`, fallback de ícono+gradiente para proyectos sin imágenes.

## Escalabilidad futura

El componente sigue iterando sobre `PROJECTS`: al agregar un segundo o tercer proyecto, se apilan como tarjetas destacadas sin rediseño. Cuando haya 3+ proyectos reales se puede reevaluar volver a una grilla.

## Fuera de alcance

- No se crea página de caso de estudio ni listado "ver todos".
- No se tocan otras secciones de la landing.
