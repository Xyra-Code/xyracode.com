# Demos de tienda para prospectos — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Publicar `/demos/guantes-nr1` — una tienda navegable con catálogo, carrito y pedido a WhatsApp — sobre un sistema reusable donde la demo siguiente son 4 hex y un objeto más en un array.

**Architecture:** Rama nueva bajo `app/demos/[cliente]/`, prerenderizada estática, dirigida por datos desde `lib/content/demos.ts`. El tema del cliente entra como 4 custom properties CSS y los 9 tokens de sistema se derivan con `color-mix()`. El carrito es un context cliente persistido en `localStorage`; el pedido se arma con una función pura y se abre en `wa.me`. Al final, un refactor aparte (`SiteChrome`) baja el JSON-LD y el FAB de XyraCode del root layout a las 9 páginas del sitio, para que la demo no los herede.

**Tech Stack:** Next.js 16 (App Router) · React 19 · TypeScript · Tailwind CSS v4 · lucide-react · vitest + @testing-library/react · `next/font/google` (Archivo, Manrope, Space Mono)

## Global Constraints

- **Spec:** `docs/superpowers/specs/2026-07-29-demos-prospectos-design.md`. Ante conflicto, el spec manda sobre este plan.
- **Referencia visual:** `handoff/demos/design_handoff_demos_tienda-nr1/README.md` + `capturas/1a`–`1f`. **Los valores exactos de espaciado, tamaño tipográfico y token salen de ahí; este plan no los duplica** para que no puedan desincronizarse. `support.js` no se porta al repo.
- **Idioma del copy:** español colombiano. Sin voseo. Los textos definitivos están en el spec §5.7 — no improvisar.
- **Todo prerenderizado estático.** Prohibido `searchParams`, `cookies()`, `headers()` y `fetch` dinámico en la rama de demos.
- **`export const dynamicParams = false`** en `app/demos/[cliente]/layout.tsx` y en `app/demos/[cliente]/p/[producto]/page.tsx`. No hay `not-found.tsx` de tienda.
- **Aislamiento de metadata (no solo `robots`).** El layout de la demo usa `generateMetadata` y
  declara `robots`, `title` (con `template` propio), `description`, `alternates.canonical`
  autorreferencial, `openGraph` y `twitter`. Next fusiona la metadata **superficialmente** de la
  raíz hacia abajo, así que cualquier clave que no se redefina se hereda de `app/layout.tsx` y la
  demo sale titulada `| XyraCode` con `canonical` a la home de la agencia. **No** tocar
  `app/robots.ts`.
- **Las páginas hijas de la demo llevan `title` como string simple**, para que use el `template`
  del layout de la demo. Un `title.absolute` en una hija se saltea ese template; un `title` en
  una hija sin template propio en el layout caería en el de la raíz.
- **No reusar `components/ui/`** en la demo: está acoplado a la marca de XyraCode.
- **Un solo quiebre responsive: 768px** — el `md:` de Tailwind.
- **Tests colocados** junto al archivo que prueban (`Foo.tsx` + `Foo.test.tsx`), como `components/ui/Breadcrumb.test.tsx`.
- **`formatCOP` emite `$` + U+00A0 + dígitos.** En los tests escribir `"$ 149.900"`. Un espacio normal falla.
- Comandos: `npm test` · `npm run build` · `npm run lint`.
- Commits: `feat(demos):` / `test(demos):` / `refactor(sitio):`. Sujeto en minúscula, sin acentos, como el historial del repo.

---

## Precondición — el working tree tiene trabajo de otra persona

`git status` tiene **cuatro cambios distintos** sin commitear, y dos archivos mezclan piezas de dos de ellos:

| Cambio | Archivos |
|---|---|
| 404 / global-not-found | `app/not-found.tsx`, `app/global-not-found.tsx`, `components/sections/NotFoundScreen.tsx`, `next.config.ts`, `lib/seo.ts` (`SEO.notFound`) |
| `org.logo` en el JSON-LD | `lib/seo.ts` (`SEO.org.logo`), `app/layout.tsx` |
| `founder` consolidado | `app/layout.tsx`, `app/nosotros/page.tsx` |
| Fechas ISO con offset | `lib/content/blog.ts`, `lib/content/case-studies.ts` |

**Consecuencia para este plan:** las Tareas 1–12 (la demo) **no tocan ningún archivo sucio** — `lib/content/index.ts`, `app/sitemap.ts` y `app/globals.css` están limpios. Se puede empezar ya.

La **Tarea 13 (`SiteChrome`) reescribe `app/layout.tsx`**, que sí está sucio. **No ejecutar la Tarea 13 hasta que el working tree esté limpio.** Separar esos cuatro cambios necesita staging por hunks; es trabajo del autor, no de este plan. Usar la skill `commit-pr` del proyecto.

Esto invierte el orden del spec §7, que ponía `SiteChrome` primero. El spec dice que las fases son independientes y que el orden era solo para que la demo naciera limpia en local; la única consecuencia de invertirlo es que durante el desarrollo la demo muestra el FAB de XyraCode. Se va al ejecutar la Tarea 13.

---

## Estructura de archivos

```
lib/content/demos.ts              tipos Demo/DemoProduct/DemoCategory + DEMOS[]   (T1)
lib/content/index.ts              + export * from "./demos"                        (T1)
lib/demos/format.ts               formatCOP()                                      (T1)
lib/demos/order.ts                buildOrderMessage() + buildOrderHref()           (T2)
lib/demos/cart.ts                 tipos del carrito + resolveCart()                (T6)

app/demos/[cliente]/
  demo.css                        4 vars de identidad + 9 derivadas por color-mix   (T3)
  layout.tsx                      tema, fuentes, noindex, dynamicParams, chrome     (T3,T4,T7)
  page.tsx                        home                                              (T9)
  catalogo/page.tsx               catálogo                                          (T10)
  p/[producto]/page.tsx           detalle                                           (T11)

components/demos/
  DemoBar.tsx                     franja de crédito de XyraCode                     (T4)
  StoreNav.tsx  MobileMenu.tsx    nav del cliente                                   (T4)
  StoreFooter.tsx                 footer del cliente                                (T4)
  StoreButton.tsx                 botón primario/secundario                         (T4)
  PriceTag.tsx                    precio, o el estado "consultar"                   (T5)
  ProductCard.tsx                 tarjeta única (grid, destacados, relacionados)    (T5)
  ProductGrid.tsx                 grilla servidor, sin filtro                       (T5)
  CartProvider.tsx                context + localStorage                            (T6)
  CartButton.tsx                  contador del nav                                  (T6)
  CartDrawer.tsx                  panel lateral                                     (T7)
  QuickAddButton.tsx              "AGREGAR" de la tarjeta                           (T8)
  StoreHero.tsx CategoryCard.tsx TrustStrip.tsx                                     (T9)
  FilterableCatalog.tsx CategoryEmpty.tsx                                           (T10)
  SizePicker.tsx QuantityStepper.tsx ProductPurchase.tsx RelatedProducts.tsx        (T11)

public/demos/guantes-nr1/         logo.png y logo-mark.png ya commiteados; fotos    (T12)
components/sections/SiteChrome.tsx + SiteChrome.test.tsx                            (T13)
lib/jsonld.ts                     + SITE_GRAPH                                      (T13)
```

---

## Task 1: Modelo de datos y formato de moneda

**Files:**
- Create: `lib/content/demos.ts`, `lib/demos/format.ts`, `lib/demos/format.test.ts`
- Modify: `lib/content/index.ts`

**Interfaces:**
- Consumes: nada.
- Produces: `DemoImage`, `DemoCategory`, `DemoProduct`, `Demo`, `DEMOS: Demo[]`, `getDemo(slug: string): Demo | undefined`, `formatCOP(cop: number): string`.

- [ ] **Step 1: Escribir el test de formatCOP**

`lib/demos/format.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import { formatCOP } from "./format";

describe("formatCOP", () => {
  it("formatea miles con punto y espacio duro", () => {
    // Intl es-CO emite U+00A0 entre el signo y el numero, no un espacio normal.
    expect(formatCOP(149900)).toBe("$ 149.900");
  });

  it("formatea millones", () => {
    expect(formatCOP(1250000)).toBe("$ 1.250.000");
  });

  it("no muestra decimales", () => {
    expect(formatCOP(28000)).toBe("$ 28.000");
  });

  it("formatea el cero", () => {
    expect(formatCOP(0)).toBe("$ 0");
  });
});
```

- [ ] **Step 2: Correr el test y verificar que falla**

Run: `npx vitest run lib/demos/format.test.ts`
Expected: FAIL — no existe `./format`.

- [ ] **Step 3: Implementar formatCOP**

`lib/demos/format.ts`:

```ts
/**
 * Precio en pesos colombianos. Sin decimales: en COP no se usan, y un
 * ",00" en cada precio de catalogo es ruido.
 *
 * Ojo al testear: Intl es-CO separa el signo del numero con U+00A0
 * (espacio duro), no con un espacio normal.
 */
const COP = new Intl.NumberFormat("es-CO", {
  style: "currency",
  currency: "COP",
  maximumFractionDigits: 0,
});

export function formatCOP(cop: number): string {
  return COP.format(cop);
}
```

- [ ] **Step 4: Correr el test y verificar que pasa**

Run: `npx vitest run lib/demos/format.test.ts`
Expected: PASS (4 tests).

- [ ] **Step 5: Crear el modelo de datos**

`lib/content/demos.ts`. Los 12 productos, sus nombres y sus precios salen de
`handoff/demos/design_handoff_demos_tienda-nr1/capturas/1c-catalogo.png` (son representativos,
ver Tarea 12). Categorías: `guantes` (5), `indumentaria` (4), `accesorios` (3).

```ts
/**
 * Demos de tienda para prospectos. Cada entrada de DEMOS es una tienda
 * completa en /demos/<slug>. Toda la rama va noindex y fuera del sitemap,
 * por eso el tipo no lleva `seo` ni `lastModified` como CaseStudy o BlogPost.
 */

export type DemoImage = { src: string; alt: string; width: number; height: number };

export type DemoCategory = { slug: string; nombre: string };

export type DemoProduct = {
  slug: string;
  nombre: string;
  /**
   * COP entero. `null` cuando el material del cliente no muestra el precio:
   * la tarjeta pasa a "Consultar por WhatsApp" y el producto NO entra al
   * carrito. Nunca inventar un numero: el prospecto lee esto como propuesta.
   */
  precio: number | null;
  /** Referencia a DemoCategory.slug. */
  categoria: string;
  imagen: DemoImage;
  descripcion: string;
  /** Ausente = sin variantes; el carrito lo muestra como "Unica". */
  variantes?: { label: string; opciones: string[] };
  destacado?: boolean;
};

export type Demo = {
  /** Segmento de URL: /demos/<slug>. */
  slug: string;
  negocio: {
    nombre: string;
    tagline: string;
    /** Solo digitos con indicativo, formato wa.me. Es el del CLIENTE. */
    whatsapp: string;
    ciudad: string;
    /** Lockup completo (marca + tagline). Footer. */
    logo: DemoImage;
    /** Variante reducida, solo la marca. Nav. */
    logoMarca: DemoImage;
  };
  /** La capa de identidad: exactamente 4 variables. Ver demo.css. */
  tema: { fondo: string; texto: string; acento: string; acentoTexto: string };
  hero: { titulo: string; subtitulo: string; imagen: DemoImage };
  categorias: DemoCategory[];
  productos: DemoProduct[];
  /** Tira de confianza: 3 entradas. La primera deriva de negocio.ciudad. */
  confianza: string[];
};

export const DEMOS: Demo[] = [
  {
    slug: "guantes-nr1",
    negocio: {
      nombre: "Guantes NR1",
      tagline: "El inoxidable",
      whatsapp: "573044962704",
      ciudad: "Villavicencio",
      logo: {
        src: "/demos/guantes-nr1/logo.png",
        alt: "Guantes NR1 — El inoxidable",
        width: 852,
        height: 728,
      },
      logoMarca: {
        src: "/demos/guantes-nr1/logo-mark.png",
        alt: "Guantes NR1",
        width: 852,
        height: 604,
      },
    },
    tema: {
      fondo: "#0E0E10",
      texto: "#F2F2EF",
      acento: "#C6F24E",
      acentoTexto: "#0E0E10",
    },
    hero: {
      titulo: "Guantes de arquero que aguantan la temporada",
      subtitulo:
        "Corte negativo, roll finger e híbridos. Indumentaria de portero y accesorios, con envío en Villavicencio.",
      imagen: {
        src: "/demos/guantes-nr1/hero.webp",
        alt: "Arquero atajando un balón con guantes NR1",
        width: 1600,
        height: 900,
      },
    },
    categorias: [
      { slug: "guantes", nombre: "Guantes" },
      { slug: "indumentaria", nombre: "Indumentaria" },
      { slug: "accesorios", nombre: "Accesorios" },
    ],
    productos: [
      // Los 12 de la tabla de abajo. Datos representativos del handoff hasta
      // que llegue el material real del cliente (ver Tarea 12).
    ],
    confianza: [
      "Envío en Villavicencio",
      "Pago contra entrega",
      "Atención por WhatsApp",
    ],
  },
];

/** Resuelve una demo por su slug de URL. */
export function getDemo(slug: string): Demo | undefined {
  return DEMOS.find((demo) => demo.slug === slug);
}
```

- [ ] **Step 6: Cargar los 12 productos**

De `capturas/1c-catalogo.png`. `slug` en kebab-case a partir del nombre. `imagen.src` es
`/demos/guantes-nr1/<slug>.webp`, 800×800. Variantes: guantes `Talla` 6–11 · indumentaria
`Talla` S/M/L/XL · accesorios sin variantes.

| # | Nombre | Precio | Categoría | Variantes | Dest. |
|---|---|---|---|---|---|
| 1 | Guante corte negativo látex 4 mm | 149900 | guantes | Talla 6–11 | ✓ |
| 2 | Guante corte plano para entrenamiento diario | 89900 | guantes | Talla 6–11 | |
| 3 | Guante híbrido roll finger con dedo espina para partido de competencia | 189000 | guantes | Talla 6–11 | ✓ |
| 4 | Guante infantil talla 5 con velcro ancho | 64900 | guantes | — | |
| 5 | Guante de portero para cancha de arena | 74000 | guantes | Talla 6–11 | |
| 6 | Buzo de arquero manga larga con coderas | 119000 | indumentaria | Talla S–XL | ✓ |
| 7 | Pantaloneta acolchada de arquero | 79900 | indumentaria | Talla S–XL | |
| 8 | Medias de compresión hasta la rodilla | 34900 | indumentaria | Talla S–XL | |
| 9 | Rodilleras con refuerzo lateral | 72000 | indumentaria | Talla S–XL | |
| 10 | Bolso portaguantes con malla de secado | **null** | accesorios | — | |
| 11 | Espuma limpiadora para látex 250 ml | 28000 | accesorios | — | ✓ |
| 12 | Vendaje elástico para dedos · 2 rollos | 18500 | accesorios | — | |

El #4 no lleva variantes a propósito: la talla ya está en el nombre, y sirve como caso de
prueba del estado "producto sin variantes". El #10 con `precio: null` es el caso "Consultar
por WhatsApp". Descripción corta de una o dos frases por producto.

- [ ] **Step 7: Generar los placeholders de imagen**

Las fotos reales las aporta el cliente (Tarea 12), pero **sin archivos las tareas 5 a 11 no se
pueden ver ni revisar**. Generar con Pillow, que ya está disponible: 12 cuadrados de 800×800 y
un hero de 1600×900, en el `--superficie-foto` de NR1 (`#202124`), con el nombre del producto
centrado en gris claro. Guardar en `public/demos/guantes-nr1/<slug>.webp` y `hero.webp`.

Así el layout es revisable desde la primera tarea, y reemplazar por las fotos de Nelson es
sobrescribir archivos sin tocar código.

- [ ] **Step 8: Exportar desde el barrel**

En `lib/content/index.ts`, agregar al final de la lista de exports:

```ts
export * from "./demos";
```

- [ ] **Step 9: Verificar tipos y tests**

Run: `npx tsc --noEmit && npm test`
Expected: sin errores de tipo; los tests existentes siguen pasando.

- [ ] **Step 10: Commit**

```bash
git add lib/content/demos.ts lib/content/index.ts lib/demos/format.ts lib/demos/format.test.ts public/demos
git commit -m "feat(demos): modelo de datos, catalogo de nr1 y formato de pesos"
```

---

## Task 2: Armado del pedido a WhatsApp

**Files:**
- Create: `lib/demos/order.ts`, `lib/demos/order.test.ts`

**Interfaces:**
- Consumes: `formatCOP` (T1), tipos de `lib/content/demos.ts` (T1).
- Produces:
  ```ts
  type OrderLine = { nombre: string; cantidad: number; precio: number; variante?: string };
  buildOrderMessage(negocio: string, lineas: OrderLine[]): string
  buildOrderHref(whatsapp: string, mensaje: string): string
  buildProductInquiryHref(whatsapp: string, negocio: string, nombre: string): string
  ```

**Invariante:** un producto con `precio: null` **nunca** llega acá — no entra al carrito (su
tarjeta va directo a WhatsApp con `buildProductInquiryHref`). Por eso `OrderLine.precio` es
`number` y no `number | null`.

- [ ] **Step 1: Escribir los tests**

`lib/demos/order.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import { buildOrderHref, buildOrderMessage, buildProductInquiryHref } from "./order";

const NBSP = " ";

describe("buildOrderMessage", () => {
  it("arma un pedido de un item con variante", () => {
    const msg = buildOrderMessage("Guantes NR1", [
      { nombre: "Guante corte negativo látex 4 mm", cantidad: 1, precio: 149900, variante: "Talla 8" },
    ]);
    expect(msg).toBe(
      "Hola Guantes NR1, quiero pedir:\n" +
        `• 1 × Guante corte negativo látex 4 mm (Talla 8) — $${NBSP}149.900\n` +
        `Total: $${NBSP}149.900`,
    );
  });

  it("multiplica el precio de linea por la cantidad", () => {
    const msg = buildOrderMessage("Guantes NR1", [
      { nombre: "Espuma limpiadora para látex 250 ml", cantidad: 2, precio: 28000 },
    ]);
    expect(msg).toContain(`• 2 × Espuma limpiadora para látex 250 ml — $${NBSP}56.000`);
    expect(msg).toContain(`Total: $${NBSP}56.000`);
  });

  it("omite el parentesis cuando el item no tiene variante", () => {
    const msg = buildOrderMessage("Guantes NR1", [
      { nombre: "Vendaje elástico para dedos", cantidad: 1, precio: 18500 },
    ]);
    expect(msg).toContain("• 1 × Vendaje elástico para dedos — ");
    expect(msg).not.toContain("(");
  });

  it("suma varios items y usa un salto de linea por item", () => {
    const msg = buildOrderMessage("Guantes NR1", [
      { nombre: "Guante corte negativo látex 4 mm", cantidad: 2, precio: 149900, variante: "Talla 8" },
      { nombre: "Buzo de arquero manga larga con coderas", cantidad: 1, precio: 119000, variante: "Talla M" },
    ]);
    expect(msg.split("\n")).toHaveLength(4); // saludo + 2 items + total
    expect(msg).toContain(`Total: $${NBSP}418.800`);
  });

  it("devuelve solo el saludo cuando no hay items", () => {
    expect(buildOrderMessage("Guantes NR1", [])).toBe("Hola Guantes NR1, quiero pedir:");
  });
});

describe("buildOrderHref", () => {
  it("apunta a wa.me con el mensaje percent-encoded", () => {
    const href = buildOrderHref("573044962704", "Hola\nchau");
    expect(href).toBe("https://wa.me/573044962704?text=Hola%0Achau");
  });
});

describe("buildProductInquiryHref", () => {
  it("pregunta por un producto puntual", () => {
    const href = buildProductInquiryHref("573044962704", "Guantes NR1", "Bolso portaguantes");
    expect(href).toBe(
      "https://wa.me/573044962704?text=" +
        encodeURIComponent("Hola Guantes NR1, quiero preguntar por: Bolso portaguantes"),
    );
  });
});
```

- [ ] **Step 2: Correr los tests y verificar que fallan**

Run: `npx vitest run lib/demos/order.test.ts`
Expected: FAIL — no existe `./order`.

- [ ] **Step 3: Implementar order.ts**

```ts
import { formatCOP } from "./format";

/**
 * Linea de pedido ya resuelta: el carrito guarda solo slug/variante/cantidad,
 * y el nombre y el precio se resuelven contra DEMOS antes de llegar aca.
 * `precio` es number y no number|null a proposito: un producto sin precio no
 * entra al carrito, se pregunta con buildProductInquiryHref.
 */
export type OrderLine = {
  nombre: string;
  cantidad: number;
  precio: number;
  /** Etiqueta + valor ya compuestos, p.ej. "Talla 8". */
  variante?: string;
};

/**
 * Texto del pedido para WhatsApp. Funcion pura: es la pieza con mas chance de
 * salir mal (encoding, saltos de linea, formato de precios) y la mas barata de
 * cubrir con tests, asi que no toca el DOM ni el estado.
 */
export function buildOrderMessage(negocio: string, lineas: OrderLine[]): string {
  const saludo = `Hola ${negocio}, quiero pedir:`;
  if (lineas.length === 0) return saludo;

  const items = lineas.map((l) => {
    const variante = l.variante ? ` (${l.variante})` : "";
    return `• ${l.cantidad} × ${l.nombre}${variante} — ${formatCOP(l.precio * l.cantidad)}`;
  });
  const total = lineas.reduce((suma, l) => suma + l.precio * l.cantidad, 0);

  return [saludo, ...items, `Total: ${formatCOP(total)}`].join("\n");
}

/** Enlace wa.me con el pedido escrito. */
export function buildOrderHref(whatsapp: string, mensaje: string): string {
  return `https://wa.me/${whatsapp}?text=${encodeURIComponent(mensaje)}`;
}

/**
 * Enlace para un producto puntual. Es el respaldo cuando el precio es null y
 * cuando no hay JavaScript: cada tarjeta lo conserva.
 */
export function buildProductInquiryHref(
  whatsapp: string,
  negocio: string,
  nombre: string,
): string {
  return buildOrderHref(whatsapp, `Hola ${negocio}, quiero preguntar por: ${nombre}`);
}
```

- [ ] **Step 4: Correr los tests y verificar que pasan**

Run: `npx vitest run lib/demos/order.test.ts`
Expected: PASS (8 tests).

- [ ] **Step 5: Commit**

```bash
git add lib/demos/order.ts lib/demos/order.test.ts
git commit -m "feat(demos): arma el mensaje de pedido para whatsapp"
```

---

## Task 3: Tema, tokens y layout base de la demo

**Files:**
- Create: `app/demos/[cliente]/demo.css`, `app/demos/[cliente]/layout.tsx`, `app/demos/[cliente]/page.tsx`

**Interfaces:**
- Consumes: `getDemo`, `DEMOS` (T1).
- Produces: la rama de rutas con tema aplicado y `noindex`. Clases utilitarias
  `bg-fondo`, `text-texto`, `bg-superficie`, `border-borde`, etc., disponibles para T4+.

**`page.tsx` en este task es un stub** (un `<h1>` con el nombre del negocio) para que la ruta
compile y se pueda ver el tema. La home real es la Tarea 9.

- [ ] **Step 1: Escribir demo.css**

Los 9 tokens derivados y sus porcentajes salen del handoff README, sección
"Capa de sistema — derivada". Las 4 de identidad las inyecta el layout por `style`.

```css
/*
 * Tokens de la demo. La capa de identidad (4 variables) la escribe el layout
 * desde demo.tema; estas 9 se derivan con color-mix() para que agregar un
 * cliente sea literalmente cuatro hex.
 *
 * Los hex de referencia para Guantes NR1 estan en el handoff README. color-mix
 * en srgb puede diferir ~2/255 por canal: se acepta. Si alguna se ve mal en el
 * caso de fondo claro, ajustar el porcentaje, NO hardcodear el hex.
 */
.demo-root {
  --superficie: color-mix(in srgb, var(--texto) 6%, var(--fondo));
  --superficie-foto: color-mix(in srgb, var(--texto) 9%, var(--fondo));
  --borde: color-mix(in srgb, var(--texto) 12%, var(--fondo));
  --borde-fuerte: color-mix(in srgb, var(--texto) 30%, var(--fondo));
  --cuerpo: color-mix(in srgb, var(--fondo) 25%, var(--texto));
  --atenuado: color-mix(in srgb, var(--fondo) 58%, var(--texto));
  --atenuado-suave: color-mix(in srgb, var(--fondo) 72%, var(--texto));
  --acento-suave: color-mix(in srgb, var(--fondo) 88%, var(--acento));
  --acento-profundo: color-mix(in srgb, var(--texto) 45%, var(--acento));

  /* La franja de XyraCode es el tema invertido: asi queda clara sobre una
     tienda oscura y oscura sobre una clara, sin caso especial. */
  --franja-fondo: var(--texto);
  --franja-texto: color-mix(in srgb, var(--texto) 30%, var(--fondo));
  --franja-borde: color-mix(in srgb, var(--fondo) 22%, var(--texto));

  background: var(--fondo);
  color: var(--texto);
  /* Compensa la franja (40px) + el nav (72px) al navegar por anclas. */
  scroll-padding-top: 84px;
}
```

- [ ] **Step 2: Escribir el layout**

```tsx
import type { Metadata } from "next";
import { Archivo, Manrope, Space_Mono } from "next/font/google";
import { notFound } from "next/navigation";
import { DEMOS, getDemo } from "@/lib/content";
import "./demo.css";

// Tipografia del SISTEMA, no del cliente: las tres son iguales en todas las
// demos. Se cargan aca y no en el root layout, asi el sitio de XyraCode no
// las descarga.
const archivo = Archivo({ variable: "--font-archivo", subsets: ["latin"], weight: ["500", "700"] });
const manrope = Manrope({ variable: "--font-manrope", subsets: ["latin"], weight: ["400", "500", "600"] });
const spaceMono = Space_Mono({ variable: "--font-mono-demo", subsets: ["latin"], weight: ["400", "700"] });

/**
 * NO alcanza con declarar `robots`. Next fusiona la metadata **superficialmente**
 * de la raiz hacia abajo, asi que toda clave que no se redefina aca se hereda de
 * app/layout.tsx: el titulo con "| XyraCode", el canonical a "/", la description
 * de la agencia y og:site_name = XyraCode. Eso convierte la tienda del cliente
 * en una pagina de la agencia — justo lo que el spec §2 pide evitar — y deja un
 * canonical a la home desde una pagina noindex, que es señal contradictoria.
 *
 * `title` usa template + default en vez de `absolute` a proposito: `absolute`
 * arreglaria solo esta ruta, y las paginas hijas (catalogo, detalle) que exporten
 * un title de tipo string volverian a caer en el titleTemplate de la raiz. Con un
 * template propio, cualquier hija queda cubierta sin acordarse de nada.
 */
export async function generateMetadata({
  params,
}: {
  params: Promise<{ cliente: string }>;
}): Promise<Metadata> {
  const { cliente } = await params;
  const demo = getDemo(cliente);
  // Sin demo la ruta no existe; el layout ya llama notFound(). Solo hay que
  // asegurar que ni siquiera ese caso herede la identidad de la agencia.
  if (!demo) return { robots: { index: false, follow: false } };

  const titulo = `${demo.negocio.nombre} — ${demo.negocio.tagline}`;
  const url = `/demos/${demo.slug}`;

  return {
    // Toda la rama fuera del indice. NO agregar Disallow en robots.ts:
    // impediria que Google lea esta etiqueta y la URL quedaria indexable por
    // enlaces externos.
    robots: { index: false, follow: false },
    title: { template: `%s · ${demo.negocio.nombre}`, default: titulo },
    description: demo.hero.subtitulo,
    // Autorreferencial. Heredar el "/" de la raiz apuntaria a la home de la
    // agencia desde la tienda de un cliente.
    alternates: { canonical: url },
    openGraph: {
      type: "website",
      url,
      siteName: demo.negocio.nombre,
      title: titulo,
      description: demo.hero.subtitulo,
    },
    twitter: {
      card: "summary_large_image",
      title: titulo,
      description: demo.hero.subtitulo,
    },
  };
}

// Un slug desconocido se corta a nivel de routing y lo atiende
// app/global-not-found.tsx. Por eso la demo no lleva not-found.tsx propia.
export const dynamicParams = false;

export function generateStaticParams() {
  return DEMOS.map((demo) => ({ cliente: demo.slug }));
}

export default async function DemoLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ cliente: string }>;
}) {
  const { cliente } = await params;
  const demo = getDemo(cliente);
  if (!demo) notFound();

  return (
    <div
      className={`demo-root ${archivo.variable} ${manrope.variable} ${spaceMono.variable} min-h-screen font-[family-name:var(--font-manrope)]`}
      style={
        {
          "--fondo": demo.tema.fondo,
          "--texto": demo.tema.texto,
          "--acento": demo.tema.acento,
          "--acento-texto": demo.tema.acentoTexto,
        } as React.CSSProperties
      }
    >
      {children}
    </div>
  );
}
```

- [ ] **Step 3: Stub de la home para que la ruta compile**

`app/demos/[cliente]/page.tsx`:

```tsx
import { notFound } from "next/navigation";
import { getDemo } from "@/lib/content";

export default async function DemoHome({ params }: { params: Promise<{ cliente: string }> }) {
  const { cliente } = await params;
  const demo = getDemo(cliente);
  if (!demo) notFound();

  return <h1 className="p-10 text-4xl font-bold">{demo.negocio.nombre}</h1>;
}
```

- [ ] **Step 4: Verificar el aislamiento de metadata contra el HTML construido**

Run: `npm run build`
Expected: en la lista de rutas aparece `● /demos/[cliente]` con `/demos/guantes-nr1`.

La regla de fusión de metadata de Next está documentada, pero una conclusión de este peso se
confirma contra el HTML servido, no contra la documentación:

```bash
python -c "
import pathlib, re
h = pathlib.Path('.next/server/app/demos/guantes-nr1.html').read_text(encoding='utf8')
def buscar(patron):
    m = re.search(patron, h)
    return m.group(1) if m else '*** AUSENTE ***'
print('title     :', buscar(r'<title>(.*?)</title>'))
print('robots    :', buscar(r'name=\"robots\" content=\"([^\"]*)\"'))
print('canonical :', buscar(r'rel=\"canonical\" href=\"([^\"]*)\"'))
print('og:site   :', buscar(r'property=\"og:site_name\" content=\"([^\"]*)\"'))
print('descr     :', buscar(r'name=\"description\" content=\"([^\"]{0,60})'))
"
```

Expected, los cuatro a la vez:

| Señal | Valor exigido |
|---|---|
| `robots` | `noindex, nofollow` |
| `title` | `Guantes NR1 — El inoxidable` · **no** puede contener `XyraCode` |
| `canonical` | `https://xyracode.com/demos/guantes-nr1` · **no** `https://xyracode.com/` |
| `og:site_name` | `Guantes NR1` · **no** `XyraCode` |
| `description` | la del negocio · **no** la de la agencia |

Si alguno sale con el valor de XyraCode, la metadata se está heredando y hay que corregir
`generateMetadata` antes de seguir: cada página nueva de la demo arrastraría el problema.

- [ ] **Step 5: Verificar el tema en el navegador**

Run: `npm run dev` y abrir `http://localhost:3000/demos/guantes-nr1`
Expected: fondo negro cálido `#0E0E10`, texto casi blanco. Con DevTools, comprobar que
`--superficie` resuelve a un gris muy oscuro y no a `unset`.

- [ ] **Step 6: Commit**

```bash
git add "app/demos/[cliente]"
git commit -m "feat(demos): ruta base con tema por cliente, fuentes y noindex"
```

---

## Task 4: Chrome de la tienda — franja, nav, footer, botón

**Files:**
- Create: `components/demos/DemoBar.tsx`, `StoreNav.tsx`, `MobileMenu.tsx`, `StoreFooter.tsx`, `StoreButton.tsx`
- Modify: `app/demos/[cliente]/layout.tsx`

**Interfaces:**
- Consumes: tipos `Demo` (T1), `CONTACT` de `@/lib/content` (para el WhatsApp de XyraCode).
- Produces:
  ```ts
  <DemoBar />                                        // sin props: solo XyraCode
  <StoreNav demo={demo} />
  <StoreFooter demo={demo} />
  <StoreButton href variant="primario"|"secundario" size?="sm"|"md">…</StoreButton>
  ```

Medidas y tokens exactos: handoff README, tabla "Componentes compartidos". Resumen:
franja `fixed top-0`, 40px desktop / 32px móvil · nav `sticky` a `top-10`/`top-8`, 72/52px ·
áreas táctiles mínimas 44px.

- [ ] **Step 1: DemoBar**

```tsx
import { CONTACT } from "@/lib/content";

/**
 * Unica presencia de XyraCode en la demo. Colores por inversion del tema
 * (ver --franja-* en demo.css): clara sobre tienda oscura y oscura sobre
 * clara, sin caso especial por cliente.
 */
export function DemoBar() {
  const href = `https://wa.me/${CONTACT.whatsapp}?text=${encodeURIComponent(
    "Hola XyraCode, vi una demo de tienda y quiero una asi.",
  )}`;

  return (
    <div className="fixed inset-x-0 top-0 z-50 flex h-8 items-center justify-between border-b border-[var(--franja-borde)] bg-[var(--franja-fondo)] px-4 md:h-10 md:px-6">
      <p className="font-[family-name:var(--font-mono-demo)] text-[11px] text-[var(--franja-texto)] md:text-[13px]">
        Demo · hecha por XyraCode
      </p>
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="font-[family-name:var(--font-mono-demo)] text-[11px] text-[var(--franja-texto)] underline underline-offset-2 md:text-[13px]"
      >
        Quiero una así
      </a>
    </div>
  );
}
```

- [ ] **Step 2: StoreButton, StoreNav, MobileMenu y StoreFooter**

Sin `"use client"` en `StoreButton` ni `StoreFooter` (los usa T10 desde el árbol cliente).
`MobileMenu` sí es cliente (abre y cierra). `StoreNav` recibe `demo` y renderiza
`demo.negocio.logoMarca` con `next/image` **a 40px de alto** — no 24px: la marca tiene alas y
letras solapadas y a 24px es ilegible (spec §5.9). El slot del carrito queda como `children`
para que T6 inserte `<CartButton />` sin tocar el nav.

- [ ] **Step 3: Montar el chrome en el layout**

En `app/demos/[cliente]/layout.tsx`, envolver `{children}`:

```tsx
      <DemoBar />
      <StoreNav demo={demo} />
      <main className="pt-[84px] md:pt-[112px]">{children}</main>
      <StoreFooter demo={demo} />
```

El `pt` compensa los 84px (móvil) / 112px (desktop) de franja + nav fijos.

- [ ] **Step 4: Verificar el apilado al hacer scroll**

Run: `npm run dev`, abrir `/demos/guantes-nr1`, achicar a 390px.
Expected: la franja queda fija arriba, el nav pegado abajo de ella, el contenido no queda
tapado, y en móvil los dos juntos no pasan de 84px. Comparar con `capturas/1b-home.png`,
tercer marco.

- [ ] **Step 5: Commit**

```bash
git add components/demos "app/demos/[cliente]/layout.tsx"
git commit -m "feat(demos): franja de credito, nav y footer de la tienda"
```

---

## Task 5: Tarjeta de producto, precio y grilla

**Files:**
- Create: `components/demos/PriceTag.tsx`, `ProductCard.tsx`, `ProductCard.test.tsx`, `ProductGrid.tsx`

**Interfaces:**
- Consumes: `DemoProduct`, `Demo` (T1), `formatCOP` (T1), `buildProductInquiryHref` (T2).
- Produces:
  ```ts
  <PriceTag precio={number | null} />
  <ProductCard producto={DemoProduct} demo={Demo} />   // sin "use client"
  <ProductGrid productos={DemoProduct[]} demo={Demo} />
  ```

`ProductCard` y `ProductGrid` **no llevan `"use client"` ni imports server-only**: T10 los usa
desde dentro de un componente cliente. `next/image` y `next/link` funcionan en ambos árboles.

- [ ] **Step 1: Escribir los tests de ProductCard**

`components/demos/ProductCard.test.tsx`:

```tsx
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { ProductCard } from "./ProductCard";
import type { Demo, DemoProduct } from "@/lib/content";

const demo = {
  slug: "guantes-nr1",
  negocio: { nombre: "Guantes NR1", whatsapp: "573044962704" },
  categorias: [{ slug: "guantes", nombre: "Guantes" }],
} as unknown as Demo;

const base: DemoProduct = {
  slug: "guante-corte-negativo",
  nombre: "Guante corte negativo látex 4 mm",
  precio: 149900,
  categoria: "guantes",
  imagen: { src: "/demos/guantes-nr1/guante-corte-negativo.webp", alt: "Guante", width: 800, height: 800 },
  descripcion: "Corte negativo, látex de 4 mm.",
};

describe("ProductCard", () => {
  it("muestra nombre, categoria y precio", () => {
    render(<ProductCard producto={base} demo={demo} />);
    expect(screen.getByText("Guante corte negativo látex 4 mm")).toBeInTheDocument();
    expect(screen.getByText("Guantes")).toBeInTheDocument();
    expect(screen.getByText("$ 149.900")).toBeInTheDocument();
  });

  it("enlaza al detalle del producto", () => {
    render(<ProductCard producto={base} demo={demo} />);
    expect(screen.getByRole("link", { name: /Guante corte negativo/ })).toHaveAttribute(
      "href",
      "/demos/guantes-nr1/p/guante-corte-negativo",
    );
  });

  it("con precio null muestra 'Consultar por WhatsApp' y no un precio", () => {
    render(<ProductCard producto={{ ...base, precio: null }} demo={demo} />);
    expect(screen.getByText("Consultar por WhatsApp")).toBeInTheDocument();
    expect(screen.queryByText(/^\$/)).not.toBeInTheDocument();
  });

  it("con precio null el CTA va directo a WhatsApp, no al carrito", () => {
    render(<ProductCard producto={{ ...base, precio: null }} demo={demo} />);
    const cta = screen.getByRole("link", { name: /CONSULTAR/i });
    expect(cta).toHaveAttribute("href", expect.stringContaining("wa.me/573044962704"));
  });

  it("siempre conserva un enlace wa.me con el producto, para el caso sin JavaScript", () => {
    render(<ProductCard producto={base} demo={demo} />);
    const enlaces = screen.getAllByRole("link");
    expect(enlaces.some((a) => a.getAttribute("href")?.includes("wa.me"))).toBe(true);
  });
});
```

- [ ] **Step 2: Correr los tests y verificar que fallan**

Run: `npx vitest run components/demos/ProductCard.test.tsx`
Expected: FAIL — no existe `./ProductCard`.

- [ ] **Step 3: Implementar PriceTag, ProductCard y ProductGrid**

`PriceTag`: con precio, `formatCOP` en `text-texto` grande (Archivo). Con `null`, la barra de
`acento` a la izquierda + etiqueta `Precio` en mono + `Consultar por WhatsApp` — ver
`capturas/1c-catalogo.png`, tarjeta "Bolso portaguantes".

`ProductCard`: foto 1:1 con `next/image` sobre `bg-[var(--superficie-foto)]`,
**`object-contain`, nunca `object-cover`** (recortaría el guante) y nunca fondo blanco puro
(delataría los recortes del material del cliente). Kicker de categoría en mono. Nombre con
`min-h` de 2 líneas para que un nombre largo no rompa la grilla. Precio anclado con
`mt-auto`. CTA: `AGREGAR` cuando hay precio (el slot lo llena T8), `CONSULTAR` como `<a>` a
`buildProductInquiryHref` cuando es `null`.

`ProductGrid`: `grid-cols-2 md:grid-cols-4` con **fracciones fijas, no `auto-fit`** — con 4
productos las columnas no se estiran (handoff, "Estructura por pantalla" §2).

- [ ] **Step 4: Correr los tests y verificar que pasan**

Run: `npx vitest run components/demos/ProductCard.test.tsx`
Expected: PASS (5 tests).

- [ ] **Step 5: Commit**

```bash
git add components/demos/PriceTag.tsx components/demos/ProductCard.tsx components/demos/ProductCard.test.tsx components/demos/ProductGrid.tsx
git commit -m "feat(demos): tarjeta de producto, precio y grilla"
```

---

## Task 6: Carrito — estado, persistencia y contador

**Files:**
- Create: `lib/demos/cart.ts`, `lib/demos/cart.test.ts`, `components/demos/CartProvider.tsx`, `CartProvider.test.tsx`, `CartButton.tsx`
- Modify: `app/demos/[cliente]/layout.tsx`, `components/demos/StoreNav.tsx`

**Interfaces:**
- Consumes: `Demo`, `DemoProduct` (T1), `OrderLine` (T2).
- Produces:
  ```ts
  // lib/demos/cart.ts
  type CartItem = { slug: string; variante?: string; cantidad: number };
  resolveCart(items: CartItem[], productos: DemoProduct[]): (OrderLine & { item: CartItem; producto: DemoProduct })[]
  cartStorageKey(demoSlug: string): string           // "carrito:<slug>"

  // CartProvider.tsx
  <CartProvider demo={Demo}>…</CartProvider>
  useCart(): {
    items: CartItem[]; lineas: ReturnType<typeof resolveCart>; total: number; unidades: number;
    abierto: boolean;
    add(slug: string, variante: string | undefined, cantidad: number): void;
    setCantidad(slug: string, variante: string | undefined, cantidad: number): void;
    remove(slug: string, variante?: string): void;
    abrir(): void; cerrar(): void;
  }
  <CartButton />
  ```

- [ ] **Step 1: Escribir el test de resolveCart**

`lib/demos/cart.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import { cartStorageKey, resolveCart } from "./cart";
import type { DemoProduct } from "@/lib/content";

const productos: DemoProduct[] = [
  { slug: "a", nombre: "Guante A", precio: 100000, categoria: "guantes", descripcion: "",
    imagen: { src: "/a.webp", alt: "A", width: 800, height: 800 } },
  { slug: "sin-precio", nombre: "Bolso", precio: null, categoria: "accesorios", descripcion: "",
    imagen: { src: "/b.webp", alt: "B", width: 800, height: 800 } },
];

describe("resolveCart", () => {
  it("resuelve nombre y precio desde los productos, no desde el storage", () => {
    const [linea] = resolveCart([{ slug: "a", cantidad: 2, variante: "Talla 8" }], productos);
    expect(linea.nombre).toBe("Guante A");
    expect(linea.precio).toBe(100000);
    expect(linea.cantidad).toBe(2);
  });

  it("descarta slugs que ya no existen en los datos", () => {
    // Un localStorage viejo puede tener productos que se quitaron del catalogo.
    // Sin este filtro el panel intenta renderizar undefined.
    expect(resolveCart([{ slug: "fantasma", cantidad: 1 }], productos)).toEqual([]);
  });

  it("descarta items sin precio: no deberian haber entrado al carrito", () => {
    expect(resolveCart([{ slug: "sin-precio", cantidad: 1 }], productos)).toEqual([]);
  });
});

describe("cartStorageKey", () => {
  it("aisla el carrito por demo", () => {
    expect(cartStorageKey("guantes-nr1")).toBe("carrito:guantes-nr1");
  });
});
```

- [ ] **Step 2: Correr y verificar que falla**

Run: `npx vitest run lib/demos/cart.test.ts`
Expected: FAIL — no existe `./cart`.

- [ ] **Step 3: Implementar cart.ts**

```ts
import type { DemoProduct } from "@/lib/content";
import type { OrderLine } from "./order";

/** Lo unico que se persiste. Nombre, foto y precio se resuelven al renderizar. */
export type CartItem = { slug: string; variante?: string; cantidad: number };

export type ResolvedLine = OrderLine & { item: CartItem; producto: DemoProduct };

export function cartStorageKey(demoSlug: string): string {
  return `carrito:${demoSlug}`;
}

/**
 * Cruza el carrito persistido con el catalogo actual. Guardar solo
 * slug/variante/cantidad hace imposible que un localStorage viejo muestre un
 * precio viejo, pero obliga a filtrar: un producto que se quito del catalogo,
 * o uno sin precio, no puede rendersarse como linea de pedido.
 */
export function resolveCart(items: CartItem[], productos: DemoProduct[]): ResolvedLine[] {
  return items.flatMap((item) => {
    const producto = productos.find((p) => p.slug === item.slug);
    if (!producto || producto.precio === null) return [];
    return [{
      item,
      producto,
      nombre: producto.nombre,
      cantidad: item.cantidad,
      precio: producto.precio,
      variante: item.variante,
    }];
  });
}
```

- [ ] **Step 4: Correr y verificar que pasa**

Run: `npx vitest run lib/demos/cart.test.ts`
Expected: PASS (4 tests).

- [ ] **Step 5: Escribir el test de CartProvider**

`components/demos/CartProvider.test.tsx` — cubrir: `add` suma unidades · `add` del mismo
slug+variante acumula en vez de duplicar la línea · `setCantidad(0)` quita el ítem ·
`total` multiplica precio por cantidad · el estado se escribe en
`localStorage["carrito:guantes-nr1"]` · **al montar con un `localStorage` que tiene un slug
inexistente, ese ítem no aparece** · el primer render (antes del `useEffect`) muestra el
carrito vacío.

Usar un componente sonda que consuma `useCart()` y renderice `unidades` y `total`, envuelto en
`<CartProvider demo={demo}>`. Limpiar `localStorage` en `beforeEach`.

- [ ] **Step 6: Implementar CartProvider y CartButton**

`CartProvider`: `"use client"`, `createContext` + `useState<CartItem[]>([])`.

**El `localStorage` se lee en un `useEffect`, nunca en el primer render**, o se rompe la
hidratación del HTML prerenderizado. El primer paint muestra el carrito vacío. Un segundo
`useEffect` persiste en cada cambio.

`CartButton`: `"use client"`, ícono `ShoppingBag` de lucide + globo con `unidades`. En 0 **no
hay globo** y el ícono baja a `--atenuado-suave`; el globo es pill de 18px con `min-w` que
crece a lo ancho con 2 dígitos (handoff, "Componentes compartidos"). `onClick` → `abrir()`.

- [ ] **Step 7: Montar el provider y el botón**

`CartProvider` envuelve el chrome dentro del layout (nav incluido, para que `CartButton` lea el
context). `<CartButton />` va en el slot del nav creado en T4.

- [ ] **Step 8: Correr los tests y el build**

Run: `npm test && npm run build`
Expected: todo verde; `/demos/[cliente]` sigue prerenderizándose.

- [ ] **Step 9: Commit**

```bash
git add lib/demos/cart.ts lib/demos/cart.test.ts components/demos/CartProvider.tsx components/demos/CartProvider.test.tsx components/demos/CartButton.tsx components/demos/StoreNav.tsx "app/demos/[cliente]/layout.tsx"
git commit -m "feat(demos): carrito con persistencia y contador en el nav"
```

---

## Task 7: Panel del carrito

**Files:**
- Create: `components/demos/CartDrawer.tsx`, `CartDrawer.test.tsx`, `components/demos/QuantityStepper.tsx`
- Modify: `app/demos/[cliente]/layout.tsx`

**Interfaces:**
- Consumes: `useCart` (T6), `buildOrderMessage`/`buildOrderHref` (T2), `formatCOP` (T1).
- Produces: `<CartDrawer demo={Demo} />`, `<QuantityStepper valor onChange min={1} />` (T11 lo reusa).

- [ ] **Step 1: Escribir los tests**

Cubrir: cierra con `Esc` · cierra al hacer clic en el overlay · **vacío no muestra subtotal ni
CTA de pedido**, muestra `TODAVÍA NO HAS AGREGADO NADA` y el botón `VER CATÁLOGO` · con ítems
muestra `SUBTOTAL` y `PEDIR POR WHATSAPP` · el `href` del CTA contiene `wa.me` y el nombre del
producto percent-encoded · bajar la cantidad a 0 quita el ítem.

- [ ] **Step 2: Correr y verificar que fallan**

Run: `npx vitest run components/demos/CartDrawer.test.tsx`
Expected: FAIL.

- [ ] **Step 3: Implementar QuantityStepper y CartDrawer**

`QuantityStepper`: 48px de alto, bordes compartidos, radio 4px, `−`/valor/`+`.

`CartDrawer`: overlay negro 60% + panel de 420px lateral en desktop, **pantalla completa bajo
la franja en móvil**. Cabecera `TU PEDIDO` + `N ítems` + cerrar. Ítems: miniatura 1:1 72/64px,
nombre, variante en mono (`Única` si el producto no tiene variantes), `QuantityStepper`, precio
de línea, quitar. Pie: `SUBTOTAL` grande y `PEDIR POR WHATSAPP` — **único relleno de `acento`
del panel** — más la nota del spec §5.7. Entra con `translateX` 180ms `ease-out` (en móvil de
abajo hacia arriba), overlay `opacity` 140ms.

Accesibilidad, que es alcance real y no un extra: `role="dialog"` + `aria-modal`, **foco
atrapado** mientras está abierto, cierre con `Esc` y con clic en el overlay, y foco visible con
`outline: 2px solid var(--acento)` y `outline-offset: 2px` — nunca el anillo azul por defecto.

- [ ] **Step 4: Correr y verificar que pasan**

Run: `npx vitest run components/demos/CartDrawer.test.tsx`
Expected: PASS.

- [ ] **Step 5: Verificar a mano en el navegador**

Run: `npm run dev`
Expected: con el panel abierto, `Tab` no sale del panel; `Esc` lo cierra; el clic en el overlay
lo cierra; a 390px ocupa la pantalla completa bajo la franja.

- [ ] **Step 6: Commit**

```bash
git add components/demos/CartDrawer.tsx components/demos/CartDrawer.test.tsx components/demos/QuantityStepper.tsx "app/demos/[cliente]/layout.tsx"
git commit -m "feat(demos): panel del carrito con pedido a whatsapp"
```

---

## Task 8: Agregar al carrito desde la tarjeta

**Files:**
- Create: `components/demos/QuickAddButton.tsx`, `QuickAddButton.test.tsx`
- Modify: `components/demos/ProductCard.tsx`

**Interfaces:**
- Consumes: `useCart` (T6), `DemoProduct` (T1).
- Produces: `<QuickAddButton producto={DemoProduct} />`.

- [ ] **Step 1: Escribir los tests**

Cubrir: al hacer clic agrega **1 unidad con la primera opción de `variantes`** · con un producto
sin `variantes` agrega sin variante · **abre el panel** después de agregar · el botón no se
renderiza para un producto con `precio: null` (ese caso lo cubre el `<a>` a WhatsApp de T5).

- [ ] **Step 2: Correr y verificar que fallan**

Run: `npx vitest run components/demos/QuickAddButton.test.tsx`
Expected: FAIL.

- [ ] **Step 3: Implementar y conectar**

`QuickAddButton` es `"use client"` y llama `add(slug, producto.variantes?.opciones[0], 1)`
seguido de `abrir()`. En `ProductCard`, ocupa el slot del CTA cuando `precio !== null`.

`ProductCard` **sigue sin `"use client"`**: importar un componente cliente desde un componente
compartido es válido, y es lo que permite que T10 lo use desde el árbol cliente.

- [ ] **Step 4: Correr todos los tests**

Run: `npm test`
Expected: todo verde, incluidos los 5 de `ProductCard` de T5.

- [ ] **Step 5: Commit**

```bash
git add components/demos/QuickAddButton.tsx components/demos/QuickAddButton.test.tsx components/demos/ProductCard.tsx
git commit -m "feat(demos): boton agregar en la tarjeta de producto"
```

---

## Task 9: Home de la tienda

**Files:**
- Create: `components/demos/StoreHero.tsx`, `CategoryCard.tsx`, `TrustStrip.tsx`
- Modify: `app/demos/[cliente]/page.tsx` (reemplaza el stub de T3)

**Interfaces:**
- Consumes: `Demo` (T1), `ProductGrid` (T5).
- Produces: la home completa.

Estructura, de `handoff` "Estructura por pantalla" §1: hero 2 columnas (texto / imagen 16:9) →
**"Los que más salen"** con los 4 `destacado` → 3 `CategoryCard` (la primera en `acento`) →
`TrustStrip` (3 celdas con separadores verticales en desktop, filas apiladas en móvil) → footer.

- [ ] **Step 1: Implementar los tres componentes**

`StoreHero` con `next/image` `priority` (es el LCP). `CategoryCard` enlaza a
`/demos/<cliente>/catalogo` — el filtro por categoría vive en el cliente (T10), así que la
tarjeta lleva al catálogo completo. `TrustStrip` recorre `demo.confianza`.

- [ ] **Step 2: Escribir la página**

`page.tsx` resuelve la demo con `getDemo`, filtra `productos.filter((p) => p.destacado)` y
compone las cuatro secciones.

- [ ] **Step 3: Verificar contra el diseño**

Run: `npm run dev` → `/demos/guantes-nr1`
Expected: coincide con `capturas/1b-home.png` en estructura y jerarquía, en desktop y a 390px.

- [ ] **Step 4: Commit**

```bash
git add components/demos/StoreHero.tsx components/demos/CategoryCard.tsx components/demos/TrustStrip.tsx "app/demos/[cliente]/page.tsx"
git commit -m "feat(demos): home de la tienda"
```

---

## Task 10: Catálogo con filtro por categoría

**Files:**
- Create: `app/demos/[cliente]/catalogo/page.tsx`, `components/demos/FilterableCatalog.tsx`, `FilterableCatalog.test.tsx`, `components/demos/CategoryEmpty.tsx`

**Interfaces:**
- Consumes: `Demo` (T1), `ProductGrid` y `ProductCard` (T5), `buildOrderHref` (T2).
- Produces: `<FilterableCatalog demo={Demo} />`, `<CategoryEmpty demo categoria />`.

**Por qué filtra en el cliente y no con CSS:** CSS no puede comparar el valor de dos atributos,
así que un filtro declarativo exigiría generar una regla por categoría. `FilterableCatalog`
recibe los productos como props y filtra en estado: unos pocos KB de JSON en una página
`noindex`. **Prohibido `searchParams`** — saca la página del prerender.

- [ ] **Step 1: Escribir los tests**

Cubrir: arranca en `Todos` con los 12 · al hacer clic en `Guantes` quedan solo los 5 y el chip
queda activo · `Todos` reinicia · **una categoría sin productos muestra `CategoryEmpty` y no la
grilla** · el encabezado muestra `Mostrando N de M` y N cambia al filtrar.

- [ ] **Step 2: Correr y verificar que fallan**

Run: `npx vitest run components/demos/FilterableCatalog.test.tsx`
Expected: FAIL.

- [ ] **Step 3: Implementar**

`FilterableCatalog` es `"use client"`, con `useState<string>("todos")`. Chips pill 40px, scroll
horizontal en móvil, activo con relleno `acento`.

`CategoryEmpty` — copy literal del spec §5.7, no improvisar: título
`NO HAY NADA EN <CATEGORÍA>`, texto
`Se nos agotó por ahora. Escríbenos y te avisamos cuando vuelva a entrar.`, botón
`PREGUNTAR POR WHATSAPP` y enlace `Ver todos los productos`.

La página es un Server Component que resuelve la demo y renderiza `<FilterableCatalog />`, y
exporta `metadata: { title: "Catálogo" }` — string simple, para que tome el `template` del
layout de la demo y salga `Catálogo · Guantes NR1`, nunca `Catálogo | XyraCode`.

- [ ] **Step 4: Correr los tests y el build**

Run: `npm test && npm run build`
Expected: verde, y `○ /demos/[cliente]/catalogo` prerenderizada.

- [ ] **Step 5: Commit**

```bash
git add "app/demos/[cliente]/catalogo" components/demos/FilterableCatalog.tsx components/demos/FilterableCatalog.test.tsx components/demos/CategoryEmpty.tsx
git commit -m "feat(demos): catalogo con filtro por categoria"
```

---

## Task 11: Detalle de producto

**Files:**
- Create: `app/demos/[cliente]/p/[producto]/page.tsx`, `components/demos/SizePicker.tsx`, `ProductPurchase.tsx`, `ProductPurchase.test.tsx`, `RelatedProducts.tsx`

**Interfaces:**
- Consumes: `useCart` (T6), `QuantityStepper` (T7), `ProductCard` (T5), `PriceTag` (T5), `buildProductInquiryHref` (T2).
- Produces: `<SizePicker opciones label valor onChange />`, `<ProductPurchase producto demo />`, `<RelatedProducts productos demo />`.

- [ ] **Step 1: Escribir los tests de ProductPurchase**

Cubrir: con `variantes` la talla es **obligatoria** — sin elegir, "Agregar al carrito" no
agrega · elegida una talla, agrega con esa variante y la cantidad del stepper · **sin
`variantes` el bloque Talla no se renderiza** y se puede agregar directo · con `precio: null` no
hay botón de agregar sino un enlace `Consultar por WhatsApp`.

- [ ] **Step 2: Correr y verificar que fallan**

Run: `npx vitest run components/demos/ProductPurchase.test.tsx`
Expected: FAIL.

- [ ] **Step 3: Implementar**

`SizePicker`: botones de 48px; el elegido con borde 2px `acento` y fondo `--acento-suave`.

`ProductPurchase` (`"use client"`): kicker, título, `PriceTag`, descripción, `SizePicker` si hay
`variantes`, `QuantityStepper` (mínimo 1, sin máximo), CTA y el enlace secundario a WhatsApp.
Cuando no hay variantes, **Cantidad ocupa el lugar de Talla con el mismo `gap`** — el layout no
se descuadra (`capturas/1d-detalle.png`, tercer marco).

`RelatedProducts`: 4 en desktop / 2 en móvil, de la misma categoría, excluyendo el actual.

La página: `generateStaticParams` sobre `DEMOS.flatMap` de cliente × producto, y
**`export const dynamicParams = false`**. Migas en mono. `generateMetadata` devuelve
`{ title: producto.nombre }` como string simple, para que el `template` del layout de la demo
produzca `Guante corte negativo látex 4 mm · Guantes NR1`.

- [ ] **Step 4: Verificar el prerender de las 12 páginas**

Run: `npm run build`
Expected: `● /demos/[cliente]/p/[producto]` con las 12 rutas listadas.

- [ ] **Step 5: Commit**

```bash
git add "app/demos/[cliente]/p" components/demos/SizePicker.tsx components/demos/ProductPurchase.tsx components/demos/ProductPurchase.test.tsx components/demos/RelatedProducts.tsx
git commit -m "feat(demos): detalle de producto con talla y cantidad"
```

---

## Task 12: Integración y verificación final

**Files:**
- Modify: `app/sitemap.ts` (solo un comentario)

Los 12 productos y los placeholders de imagen ya entraron en la Tarea 1: sin ellos las tareas
5 a 11 no tendrían nada que renderizar y `generateStaticParams` del detalle generaría cero
páginas.

- [ ] **Step 1: Dejar constancia en el sitemap**

En el comentario de cabecera de `app/sitemap.ts`, agregar una línea:

```
// Las rutas de /demos/* quedan fuera a proposito: son demos de clientes,
// van noindex y no deben aparecer en el sitemap.
```

- [ ] **Step 2: Verificación completa**

```bash
npm run lint && npm test && npm run build
```

Expected: sin errores. En la lista de rutas: `/demos/[cliente]`,
`/demos/[cliente]/catalogo` y `/demos/[cliente]/p/[producto]` con sus 12 slugs.

- [ ] **Step 3: Verificar el aislamiento**

```bash
grep -o 'name="robots" content="[^"]*"' .next/server/app/demos/guantes-nr1.html
grep -c "demos" .next/server/app/sitemap.xml.body || echo "0 — correcto"
grep -c "xyracode.com/#organization" .next/server/app/demos/guantes-nr1.html
```

Expected: `noindex, nofollow` · `0` ocurrencias de demos en el sitemap · el `@graph` de
XyraCode **todavía aparece** (1 o más) — eso lo resuelve la Tarea 13.

- [ ] **Step 4: Commit**

```bash
git add app/sitemap.ts
git commit -m "feat(demos): deja constancia de que las demos quedan fuera del sitemap"
```

### Pendiente de material del cliente (no bloquea el código)

Antes de mandarle el link a Nelson, y **solo** cuando llegue su material:

1. Reemplazar los 14 placeholders de `public/demos/guantes-nr1/` por las fotos reales, mismos
   nombres de archivo y mismas dimensiones. Cero cambios de código.
2. Ajustar nombres, precios y descripciones en `DEMOS`. **Precio ausente → `null`**, nunca
   inventado.
3. Confirmar los supuestos abiertos del spec §8: nombre comercial (`Guantes NR1` vs el `N1R`
   del logo), **ciudad y cobertura de envío**, y que `573044962704` es la línea del negocio.

---

## Task 13: `SiteChrome` — sacar XyraCode de la demo

> **BLOQUEADA hasta que `git status` esté limpio.** Esta tarea reescribe `app/layout.tsx`, que
> hoy tiene cambios sin commitear de otras tres líneas de trabajo. Ver la sección
> "Precondición" arriba.

**Files:**
- Create: `components/sections/SiteChrome.tsx`, `components/sections/SiteChrome.test.tsx`
- Modify: `lib/jsonld.ts`, `app/layout.tsx`, y las 9 `page.tsx` del sitio

**Interfaces:**
- Consumes: `SEO`, `CONTACT`, `SOCIALS`, `SERVICE_PAGES`.
- Produces: `SITE_GRAPH` (en `lib/jsonld.ts`), `<SiteChrome />`.

- [ ] **Step 1: Escribir el extractor de huella**

**El `@graph` NO está en el `<head>`.** Verificado en producción: el bloque
`application/ld+json` aparece en el byte 54045 de la home, con `</head>` cerrando en el 4594 —
está en el `<body>`. Una comparación que mire solo el `<head>` **no puede ver el único activo
que este refactor pone en riesgo**, y declararía verificado un `@graph` roto.

La huella es entonces `<head>` **más** todos los bloques `ld+json`, estos últimos parseados y
re-serializados con `sort_keys=True` para que un reordenamiento de claves no genere un falso
positivo ni tape uno real.

```bash
cat > /tmp/huella.py <<'PY'
import json, pathlib, re, sys

html = pathlib.Path(sys.argv[1]).read_text(encoding="utf8")

cabeza = re.search(r"<head>.*?</head>", html, re.S)
print("=== HEAD ===")
print(cabeza.group(0) if cabeza else "*** SIN HEAD ***")

bloques = re.findall(
    r'<script type="application/ld\+json"[^>]*>(.*?)</script>', html, re.S
)
print(f"=== LD+JSON: {len(bloques)} bloque(s) ===")
for bruto in bloques:
    # Normalizado: un cambio de orden de claves no es un cambio de contenido.
    print(json.dumps(json.loads(bruto), sort_keys=True, ensure_ascii=False, indent=1))
PY
echo "extractor listo"
```

- [ ] **Step 2: Tomar la línea base ANTES de tocar nada**

```bash
npm run build
rm -rf /tmp/base && mkdir -p /tmp/base
for f in $(find .next/server/app -name "*.html"); do
  python /tmp/huella.py "$f" > "/tmp/base/$(echo $f | tr '/' '_').txt"
done
ls /tmp/base | wc -l
```

Expected: 14 archivos de huella.

**El hash del HTML completo va a cambiar y es esperado**: agregar un nodo al árbol RSC altera
el payload de flight (`self.__next_f`), que es data de hidratación y no contenido. Lo que tiene
que salir idéntico es la huella.

- [ ] **Step 3: Escribir el test guardía**

`components/sections/SiteChrome.test.tsx`:

```tsx
import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

/**
 * Todas las paginas del sitio deben montar <SiteChrome />; las de /demos NO,
 * porque son tiendas de clientes y no llevan el JSON-LD ni el WhatsApp de
 * XyraCode. Este test reemplaza la garantia que habria dado un route group:
 * falla el dia que se cree un tipo de ruta nuevo y se olvide la linea.
 *
 * No usar fs.globSync: llego en Node 22 y este proyecto corre en Node 20.
 * readdirSync recursivo devuelve separadores de Windows en win32, asi que se
 * normalizan antes de filtrar.
 */
const paginas = readdirSync("app", { recursive: true })
  .map(String)
  .map((f) => f.split(/[\\/]/).join("/"))
  .filter((f) => f.endsWith("page.tsx") && !f.startsWith("demos/"));

describe("SiteChrome", () => {
  // Guarda contra un glob roto: it.each([]) correria cero tests y pasaria.
  // No se afirma un numero exacto a proposito: agregar una pagina al sitio es
  // legitimo, y el it.each de abajo ya la obliga a montar SiteChrome.
  it("encuentra paginas del sitio", () => {
    expect(paginas.length).toBeGreaterThan(0);
  });

  it.each(paginas)("%s monta SiteChrome", (ruta) => {
    expect(readFileSync(join("app", ruta), "utf8")).toContain("<SiteChrome />");
  });
});
```

- [ ] **Step 4: Correr y verificar que falla**

Run: `npx vitest run components/sections/SiteChrome.test.tsx`
Expected: FAIL — ninguna página lo monta todavía.

- [ ] **Step 5: Mover el `@graph` a `lib/jsonld.ts`**

Cortar el objeto `jsonLd` de `app/layout.tsx:62-139` y pegarlo en `lib/jsonld.ts` como
`export const SITE_GRAPH`, conservando **todos** los comentarios. Agregar los imports que
necesite (`CONTACT`, `SOCIALS`, `SERVICE_PAGES`).

- [ ] **Step 6: Crear SiteChrome**

```tsx
import { FloatingWhatsApp } from "@/components/sections/FloatingWhatsApp";
import { SITE_GRAPH } from "@/lib/jsonld";

/**
 * Los dos globales de XyraCode: el FAB de WhatsApp y el @graph del sitio.
 * Vivian en el root layout, pero un layout baja a TODA su rama y eso incluia
 * /demos/*, donde no corresponden: la tienda de un cliente no puede declarar
 * que pertenece a xyracode.com ni mostrar el WhatsApp de la agencia.
 *
 * Montarlo por pagina sigue la convencion que el codebase ya usa: cada pagina
 * declara su propio Navbar, Footer y JSON-LD. SiteChrome.test.tsx impide que
 * una pagina nueva se olvide de montarlo.
 */
export function SiteChrome() {
  return (
    <>
      <FloatingWhatsApp />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(SITE_GRAPH) }}
      />
    </>
  );
}
```

- [ ] **Step 7: Limpiar el root layout y montar en las 9 páginas**

De `app/layout.tsx`: quitar el objeto `jsonLd`, su `<script>`, `<FloatingWhatsApp />` y los
imports que queden sin uso. Conservar `metadata`, `viewport`, las fuentes y `<html>`/`<body>`.

En cada una de las 9 `page.tsx`, agregar el import y `<SiteChrome />` junto al `<script>` de
JSON-LD que ya tienen al final del fragmento.

- [ ] **Step 8: Correr el guardía y verificar que pasa**

Run: `npx vitest run components/sections/SiteChrome.test.tsx`
Expected: PASS (10 tests: el conteo + 9 páginas).

- [ ] **Step 9: Verificar contra la línea base**

```bash
npm run build
rm -rf /tmp/nuevo && mkdir -p /tmp/nuevo
for f in $(find .next/server/app -name "*.html"); do
  n="$(echo $f | tr '/' '_').txt"
  python /tmp/huella.py "$f" > "/tmp/nuevo/$n"
  if diff -q "/tmp/base/$n" "/tmp/nuevo/$n" >/dev/null 2>&1; then
    echo "OK       $f"
  else
    echo "DIFIERE  $f"
  fi
done
```

Expected: `OK` en las 12 URLs del sitio. Cualquier `DIFIERE` se investiga con
`diff /tmp/base/<n> /tmp/nuevo/<n>` **antes** de seguir: significa que el `<head>` o el `@graph`
cambiaron, y ninguno de los dos debería.

- [ ] **Step 10: Probar que el control funciona**

Un control que no se probó no es un control. Rompelo a propósito y comprobá que **falla**:

```bash
# Quitar SiteChrome de una pagina cualquiera y reconstruir.
sed -i 's|<SiteChrome />||' app/contacto/page.tsx
npm run build
python /tmp/huella.py .next/server/app/contacto.html > /tmp/roto.txt
diff -q /tmp/base/.next_server_app_contacto.html.txt /tmp/roto.txt \
  && echo "MAL: el control NO detecta el @graph faltante" \
  || echo "BIEN: el control detecta el @graph faltante"
git checkout app/contacto/page.tsx   # restaurar
npm run build
```

Expected: `BIEN`. Si sale `MAL`, la huella no está capturando el `ld+json` y hay que arreglar
`/tmp/huella.py` antes de confiar en el Step 9.

- [ ] **Step 11: Verificar que la demo quedó limpia**

```bash
grep -c "xyracode.com/#organization" .next/server/app/demos/guantes-nr1.html || echo "0 — correcto"
grep -c "wa-fab" .next/server/app/demos/guantes-nr1.html || echo "0 — correcto"
```

Expected: `0` en las dos. La tienda de NR1 ya no declara el `@graph` de XyraCode ni muestra su
botón flotante.

- [ ] **Step 12: Commit**

```bash
git add components/sections/SiteChrome.tsx components/sections/SiteChrome.test.tsx lib/jsonld.ts app/layout.tsx app/page.tsx app/servicios app/proyectos app/blog app/nosotros app/contacto
git commit -m "refactor(sitio): baja el json-ld y el fab del layout a las paginas"
```

---

## Autorrevisión de este plan

**Correcciones de la revisión SEO del 2026-07-29** (`auditoria-seo/2026-07-29-informe.md`):
el aislamiento de metadata entró en las restricciones globales y en T3 (antes solo se declaraba
`robots`, y el resto se heredaba de la raíz) · T3 Step 4 lo verifica contra el HTML construido ·
T13 Steps 1, 2 y 9 comparan `<head>` **más** los bloques `ld+json`, porque el `@graph` se sirve
en el `<body>` y la comparación anterior no podía verlo · T13 Step 10 prueba que ese control
falla cuando debe · T10 y T11 fijan `title` como string simple para que tomen el `template` de
la demo.

**Cobertura del spec:** §4 → T13 · §5.1 → T1 · §5.2 → T3 · §5.3 → T3 · §5.4 → T3, T10, T11 ·
§5.5 → T4–T11 · §5.6 → T2, T6, T7, T8 · §5.7 → T7, T10 (copy literal) · §5.8 → T3, T12 ·
§5.9 → T12 · §6 (tests) → repartido, uno por tarea · §7 → invertido a propósito, justificado en
"Precondición".

**Sin cubrir a propósito:** los assets reales de producto (T12 Step 1 genera placeholders;
las fotos las aporta el cliente) y los supuestos abiertos del spec §8 — nombre comercial,
ciudad, WhatsApp — que hay que confirmar **antes** de mandarle el link a Nelson, no antes de
codear.

**Consistencia de tipos:** `CartItem` (T6) es lo que se persiste; `OrderLine` (T2) es lo que
consume el mensaje; `ResolvedLine` (T6) extiende `OrderLine` y es el puente. `resolveCart`
filtra `precio === null`, que es lo que sostiene que `OrderLine.precio` sea `number` y no
`number | null`. `formatCOP` (T1) es el único formateador de precios en todo el árbol.
