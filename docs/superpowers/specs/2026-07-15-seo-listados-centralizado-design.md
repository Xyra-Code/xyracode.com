# Consolidar el SEO de las páginas de listado en los archivos de contenido

**Fecha:** 2026-07-15
**Estado:** Aprobado, pendiente de plan de implementación

## Problema

El SEO del sitio vive hoy en tres capas:

1. **Global + páginas fijas** (home, nosotros) → `lib/seo.ts` + `app/layout.tsx`.
2. **Páginas de detalle** (`[slug]` de servicios/proyectos/blog) → campo `seo: { title, description }` dentro de cada ítem en `lib/content/service-pages.ts`, `case-studies.ts`, `blog.ts`.
3. **Páginas de listado** (`/servicios`, `/proyectos`, `/blog`) → constantes locales hardcodeadas al inicio de cada `page.tsx`.

La consecuencia práctica: el SEO de **una misma sección** está partido en dos sitios. Para auditar o ajustar "todo el SEO de servicios" hay que abrir `app/servicios/page.tsx` (listado) **y** `lib/content/service-pages.ts` (detalles).

No se busca unificar las tres capas en una sola: el SEO de detalle es *por registro* (escala con los datos) y el de listado es *configuración de una página única*. Son cosas distintas y separarlas es correcto. El objetivo es solo eliminar la partición **dentro de una misma sección**.

## Objetivo

Que el contenido y el SEO de cada sección vivan en un solo archivo. Regla mental resultante:

> Contenido y SEO de una sección → su archivo en `lib/content/`.
> `seo.ts` guarda solo lo global (home, nosotros, org/person, direcciones, OG).

## Diseño

Se mueve el SEO de cada listado al archivo de contenido **del que la propia página de listado ya lee sus datos**. Esto lo mantiene co-localizado y sin ambigüedad:

| Archivo de contenido | Export nuevo | Página que lo consume |
|---|---|---|
| `lib/content/service-pages.ts` | `SERVICE_PAGES_SEO` | `app/servicios/page.tsx` |
| `lib/content/case-studies.ts` | `PROJECTS_SEO` | `app/proyectos/page.tsx` |
| `lib/content/blog.ts` | `BLOG_SEO` | `app/blog/page.tsx` |

Criterio: el SEO del listado va en el archivo donde ya vive **el SEO de esa sección**, para que todo el SEO de la sección quede en un solo archivo.

Nota sobre proyectos: el contenido de proyectos está repartido en dos archivos desde antes — `projects.ts` (datos de las tarjetas del listado, sin `seo`) y `case-studies.ts` (contenido y `seo` de cada detalle). Como **todo el SEO de proyectos ya vive en `case-studies.ts`**, `PROJECTS_SEO` va ahí (no en `projects.ts`), cumpliendo la meta de "todo el SEO de la sección en un archivo". Esto no tiene costo para la página consumidora: `app/proyectos/page.tsx` importa vía el barrel `@/lib/content`, así que la línea de import es idéntica sin importar el archivo físico. El nombre `PROJECTS_SEO` se mantiene por coherencia con la ruta `/proyectos` y con las convenciones de identificadores en inglés del repo.

### Forma del export

Const plano con sufijo `_SEO`, mismo shape que el `seo` de los detalles:

```ts
export const SERVICE_PAGES_SEO = {
  title: "Servicios de desarrollo web y software a medida | XyraCode",
  description:
    "Desarrollo web, apps a medida y e-commerce en Colombia. Elige el servicio que necesitas: del prototipo a producción, con un solo responsable.",
} as const;
```

### Textos a trasladar (sin reescribir copy)

- `SERVICE_PAGES_SEO`
  - title: `"Servicios de desarrollo web y software a medida | XyraCode"`
  - description: `"Desarrollo web, apps a medida y e-commerce en Colombia. Elige el servicio que necesitas: del prototipo a producción, con un solo responsable."`
- `PROJECTS_SEO`
  - title: `"Proyectos y casos de estudio | XyraCode"`
  - description: `"Proyectos reales de desarrollo web y software a medida: plataformas, tiendas y web apps que llevamos del prototipo a producción."`
- `BLOG_SEO`
  - title: `"Blog de desarrollo web y software | XyraCode"`
  - description: `"Guías y comparativas sobre desarrollo web, apps y e-commerce en Colombia: precios, tecnologías y decisiones que importan para tu proyecto."`

### Cambios en cada `page.tsx`

1. Eliminar las constantes locales (`HUB_TITLE`/`HUB_DESCRIPTION` en servicios; `TITLE`/`DESCRIPTION` en proyectos y blog).
2. Importar el nuevo export desde `@/lib/content` (barrel `index.ts` con `export *` ya lo re-exporta; no hay que tocar `index.ts`).
3. Reemplazar las referencias en `export const metadata` — `title.absolute`, `description` y el bloque `openGraph` (`title`, `description`).

El `title` de metadata usa `{ absolute: ... }` en las tres páginas, por lo que la referencia pasa a ser `X_SEO.title` y `X_SEO.description`.

## Fuera de alcance (YAGNI)

- No se toca el patrón de las páginas de detalle `[slug]`.
- No se mueve nada de `seo.ts`.
- No se unifican las tres capas en una sola.
- No se reescribe ningún copy: los textos se mueven verbatim.

## Verificación

- `tsc` / build de Next sin errores (imports resueltos, tipos correctos).
- `/servicios`, `/proyectos` y `/blog` conservan **exactamente** el mismo `<title>` y meta description que antes del cambio (comparación byte a byte del copy).
- El JSON-LD `CollectionPage` de cada listado no se altera.
