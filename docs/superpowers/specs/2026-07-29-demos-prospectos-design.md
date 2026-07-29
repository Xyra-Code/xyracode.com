# Demos de tienda para prospectos — diseño

**Fecha:** 2026-07-29 · **Estado:** aprobado, pendiente de plan de implementación

## 1. Objetivo

Cerrar prospectos que hoy venden por Instagram/WhatsApp mostrándoles una **demo navegable
de su propia tienda**, publicada en el dominio de la agencia y enviada por link. El
prospecto no ve un mockup ni un portafolio: ve su marca, sus productos y sus precios,
funcionando, con un carrito que termina el pedido en WhatsApp.

Primer cliente: **Guantes NR1** (guantes de arquero e indumentaria de portero,
Villavicencio, Meta). Contacto: Nelson, `573044962704`.

Es la primera de un sistema: la demo siguiente se resuelve agregando un objeto a un array
y cambiando cuatro variables de color.

## 2. Decisiones y su razón

| Decisión | Razón |
|---|---|
| Ruta en el dominio de la agencia (`/demos/[cliente]`), no subdominio | Reusa el repo, el deploy y `lib/`. Un subdominio aparte exigía un proyecto de hosting y un repo nuevos sin beneficio: la demo va `noindex`, así que el aislamiento por dominio no compra nada. |
| `SiteChrome` en las 9 páginas del sitio, en vez de route groups | Ver §4. Consigue el mismo aislamiento con 18 líneas en vez de mover 9 carpetas, y sin el riesgo abierto de herencia de metadata files. |
| Marca del cliente al 100% + franja discreta de crédito | El prospecto tiene que proyectarse como dueño. El crédito visible protege la autoría sin robar protagonismo. |
| Identidad diseñada de cero, no copiada de su Instagram | La identidad **es** el producto que se vende. Replicar su estética actual le muestra lo que ya tiene. |
| Sistema común + capa de identidad por cliente | Impacto alto por cliente sin rediseñar: cambian 4 variables de color y los datos. Validado en el handoff (`1f`). |
| Carrito en `localStorage`, pedido a WhatsApp | Es el patrón real de un comercio pyme en Colombia. Una pasarela convierte la demo en el producto que hay que cotizar. |
| `noindex` sin `Disallow` en robots.txt | Ver §5.8. Un `Disallow` impediría leer la etiqueta `noindex`. |
| Todo prerenderizado estático | Coherente con el resto del sitio (30 páginas estáticas hoy). Sin servidor ni base de datos. |

## 3. Alcance

**Dentro:** `SiteChrome` y su test guardía · `lib/content/demos.ts` con los tipos y la
entrada de Guantes NR1 · rutas `/demos/[cliente]`, `/catalogo`, `/p/[producto]` · layout con
franja de crédito, nav, footer y panel de carrito · tema de 4 variables con 9 tokens
derivados · carrito persistido con pedido armado a WhatsApp · copy en español colombiano ·
`noindex` en toda la rama · accesibilidad del panel.

**Fuera, a propósito:** pasarela de pago · inventario · panel de administración · cuentas de
usuario · cálculo de envío · buscador (12 productos: las categorías alcanzan) · galerías de
producto (una sola imagen por producto) · 404 propia de la tienda (ver §5.4) · tipografía
por cliente (ver §5.3).

La demo **no** entra al sitemap ni al portafolio público.

## 4. Fase 1 — `SiteChrome`

### Problema

[app/layout.tsx](../../../app/layout.tsx) inyecta en toda página el `@graph` JSON-LD de
XyraCode (`WebSite` + `ProfessionalService`, líneas 62-139) y el
[FloatingWhatsApp](../../../components/sections/FloatingWhatsApp.tsx) con el número de la
agencia. Un layout solo fluye hacia abajo: no hay forma de excluir una rama. Sin cambio, la
tienda del cliente declararía pertenecer a xyracode.com y mostraría el WhatsApp de la
agencia encima del suyo.

### Solución

Bajar esos dos globales del layout a las páginas que sí los quieren. Es el patrón que el
codebase ya usa: cada página monta su propio `<Navbar />`, `<Footer />` y su propio bloque
JSON-LD (ver [app/contacto/page.tsx:148-155](../../../app/contacto/page.tsx#L148-L155)). Los
dos globales del root layout son la única excepción.

| Archivo | Cambio |
|---|---|
| `lib/jsonld.ts` | `+ SITE_GRAPH`, movido textual desde `app/layout.tsx:62-139`. Es el archivo cuyo encabezado ya declara ser el hogar de los nodos reusables. |
| `components/sections/SiteChrome.tsx` | **nuevo**. Server Component: `<FloatingWhatsApp />` + el `<script type="application/ld+json">` con `SITE_GRAPH`. |
| `app/layout.tsx` | `−` el objeto `jsonLd` y su `<script>`, `−` `<FloatingWhatsApp />`, `−` 2 imports. |
| Las 9 `page.tsx` del sitio | `+` 1 import, `+` `<SiteChrome />`. 18 líneas en total. |
| `components/sections/SiteChrome.test.tsx` | **nuevo**. Guardía: ver abajo. |

Las 9 páginas: `app/page.tsx`, `app/servicios/page.tsx`, `app/servicios/[slug]/page.tsx`,
`app/proyectos/page.tsx`, `app/proyectos/[slug]/page.tsx`, `app/blog/page.tsx`,
`app/blog/[slug]/page.tsx`, `app/nosotros/page.tsx`, `app/contacto/page.tsx`.

`<SiteChrome />` va junto al `<script>` de JSON-LD que cada página ya tiene al final de su
fragmento. El DOM plano resultante es idéntico al actual: hoy el `<body>` es
`noscript → children → FAB → script`; después es `noscript → children`, donde `children`
termina en `FAB → script`.

### Guardía

`SiteChrome.test.tsx` lee los `page.tsx` bajo `app/`, **excluye `app/demos/`**, y exige que
cada uno contenga `<SiteChrome />`. Falla en CI el día que se cree un tipo de ruta nuevo y
se olvide la línea. Sustituye la garantía estructural que habría dado un route group.

### Verificación

`npm run build` y comparar contra la línea base tomada antes del cambio (14 HTML
prerenderizados). **El hash de cada archivo va a diferir y es esperado**: agregar un nodo al
árbol RSC cambia el payload de flight que Next incrusta (`self.__next_f.push`), que es data
de hidratación y no contenido. Lo que tiene que salir **idéntico** en las 12 URLs del sitio
es el `<head>` completo y el contenido del `@graph`.

## 5. Fase 2 — la demo

### 5.1 Modelo de datos — `lib/content/demos.ts`

```ts
export type DemoImage = { src: string; alt: string; width: number; height: number };

export type DemoCategory = { slug: string; nombre: string };

export type DemoProduct = {
  slug: string;
  nombre: string;
  /** COP entero, sin decimales. null → "Consultar por WhatsApp" (§5.7). */
  precio: number | null;
  /** Referencia a DemoCategory.slug. */
  categoria: string;
  imagen: DemoImage;
  descripcion: string;
  /** Ausente → el producto no tiene variantes; el carrito lo muestra como "Única". */
  variantes?: { label: string; opciones: string[] };
  destacado?: boolean;
};

export type Demo = {
  /** Segmento de URL: /demos/<slug>. */
  slug: string;
  negocio: {
    nombre: string;
    tagline: string;
    /** Solo dígitos con indicativo, formato wa.me. Es el del CLIENTE, no el de XyraCode. */
    whatsapp: string;
    ciudad: string;
    /** Lockup completo (marca + tagline) → logo.png. Footer. */
    logo: DemoImage;
    /** Variante reducida, solo la marca → logo-mark.png. Nav. */
    logoMarca: DemoImage;
  };
  /** La capa de identidad. Exactamente 4 variables — ver §5.2. */
  tema: { fondo: string; texto: string; acento: string; acentoTexto: string };
  hero: { titulo: string; subtitulo: string; imagen: DemoImage };
  categorias: DemoCategory[];
  productos: DemoProduct[];
  /** Tira de confianza: 3 entradas. */
  confianza: string[];
};

export const DEMOS: Demo[] = [ /* guantes-nr1 */ ];
```

Se exporta desde `lib/content/index.ts` con `export * from "./demos"`.

**Sin `seo` ni `lastModified`**, a diferencia de `CaseStudy` y `BlogPost`: la rama va
`noindex` y fuera del sitemap, así que esos campos no harían nada.

**`precio: null` es obligatorio, no un lujo.** Si el material del cliente no muestra un
precio, se marca `null`. Inventar un número en algo que el prospecto lee como propuesta
comercial es un riesgo de credibilidad.

### 5.2 Tema — 4 variables de identidad, 9 derivadas

El layout de `[cliente]` escribe las 4 variables de `tema` como custom properties en su
wrapper, y las 9 de sistema se derivan **en CSS** con `color-mix()`. Consecuencia: agregar un
cliente es literalmente cuatro valores hex.

Identidad de Guantes NR1 (del handoff, sin cambios):

```
fondo #0E0E10 · texto #F2F2EF · acento #C6F24E · acentoTexto #0E0E10
```

Derivadas, iguales para todos los clientes:

| token | derivación |
|---|---|
| `superficie` | `color-mix(in srgb, var(--texto) 6%, var(--fondo))` |
| `superficieFoto` | `… 9% …` — base neutra detrás de toda foto |
| `borde` | `… 12% …` |
| `bordeFuerte` | `… 30% …` |
| `cuerpo` | `color-mix(in srgb, var(--fondo) 25%, var(--texto))` — párrafos |
| `atenuado` | `… 58% …` |
| `atenuadoSuave` | `… 72% …` — solo metadatos mono chicos |
| `acentoSuave` | `color-mix(in srgb, var(--fondo) 88%, var(--acento))` — fondo de talla elegida |
| `acentoProfundo` | `color-mix(in srgb, var(--texto) 45%, var(--acento))` — texto sobre relleno de `acento` cuando `acentoTexto` no da contraste suficiente |

La franja de XyraCode deriva por **inversión del tema**: fondo = `texto`, texto =
`mix(fondo, texto 30%)`, borde = `mix(texto, fondo 22%)`. Así queda clara sobre una tienda
oscura y oscura sobre una clara, sin caso especial.

Constantes de sistema: radio `4px` (chips y contador `999px`) · sin sombras — la elevación es
borde 1px más overlay negro 60% · escala de espaciado 4/6/8/12/16/22/26/36/48/56 px.

**Tolerancia:** el handoff lista los hex resultantes para NR1 (`superficie #191A1C`,
`superficieFoto #202124`, `borde #26272A`, `bordeFuerte #47484B`, `atenuado #9A9B98`,
`atenuadoSuave #6B6C69`, `cuerpo #B6B7B3`, `acentoSuave #23291A`, `acentoProfundo #40521A`).
`color-mix(in srgb)` puede diferir ~2/255 por canal de esos valores. Se acepta la
derivación; si en la revisión visual alguna se ve mal —sobre todo en el caso de fondo claro—
se ajusta el porcentaje, no se hardcodea el hex. `color-mix()` está soportado desde Chrome
111 / Safari 16.2 / Firefox 113; el público objetivo es Android moderno.

### 5.3 Tipografía

**Del sistema, no del cliente:** Archivo (700/500, mayúsculas, tracking −0.03/−0.04em) +
Manrope (400/500/600) + Space Mono, iguales para todas las demos. Se cargan con `next/font`
en el layout de `[cliente]`, no en el root layout: el sitio de XyraCode no las descarga.

Uso: Archivo en títulos, precios y botones · Manrope en nombres de producto y descripciones ·
Space Mono en metadatos, migas, kicker de categoría y la franja de la demo.

Si un cliente pidiera otra familia, es una quinta variable de identidad y se decide
explícitamente. Fuera de alcance hoy.

### 5.4 Rutas

```
app/demos/[cliente]/
├─ layout.tsx              franja · tema · fuentes · CartProvider · nav · footer · panel · noindex
├─ page.tsx                home
├─ catalogo/page.tsx       grid completo + filtro
└─ p/[producto]/page.tsx   detalle
```

`generateStaticParams` en `[cliente]` y en `p/[producto]`, con
**`export const dynamicParams = false`** en ambos. Eso es parte del contrato, no un detalle:
es lo que hace que un slug inexistente se corte a nivel de routing y atienda
`app/global-not-found.tsx`, igual que ya pasa con `blog/[slug]` y `proyectos/[slug]`. Por eso
**no hay 404 propia de la tienda**: sería código muerto. Consecuencia aceptada:
`/demos/slug-inexistente` muestra la 404 de XyraCode, que para una demo que no existe es
correcto.

**El filtro de categorías corre en el navegador**, no por `searchParams`: leerlos saca la
página del prerender estático. La página sirve los 12 productos y un componente cliente
muestra u oculta. Se pierde la URL compartible por categoría, irrelevante en una demo.

Stack fijo: franja 40px desktop / 32px móvil + nav 72/52 = **112px / 84px**, con
`scroll-padding-top: 84px`. Nada más se fija. Quiebre único en **768px** (el `md:` de
Tailwind que el sitio ya usa).

### 5.5 Componentes — `components/demos/`

Primitivos propios. **No se reusa `components/ui/`**: `Button` está acoplado a la marca de
XyraCode en las tres variantes (`bg-brand-secondary`, `text-night`, `outline-teal-300`,
`hover:bg-teal-100`) y además solo renderiza `<Link>`.

| componente | tipo | notas |
|---|---|---|
| `DemoBar` | server | franja de crédito; color por inversión del tema; botón "Quiero una así" a WhatsApp de XyraCode con `target="_blank"` |
| `StoreNav` | server | logo + enlaces (desktop) / logo + carrito + hamburguesa (móvil) |
| `MobileMenu` | client | despliegue del nav en móvil |
| `StoreFooter` | server | lockup, tagline, WhatsApp y ciudad sobre `superficie` |
| `StoreButton` | ambos | primario (relleno `acento`, Archivo 700 mayúsculas) y secundario (borde `bordeFuerte`) |
| `StoreHero` | server | 2 columnas: texto / imagen 16:9 |
| `ProductCard` | ambos | única para grid, destacados y relacionados. Foto 1:1 sobre `superficieFoto`, kicker de categoría en mono, nombre con `min-height` de 2 líneas, precio anclado con `margin-top:auto`, CTA |
| `PriceTag` | ambos | precio en `texto` grande, o el estado `null` con barra de `acento` y etiqueta "Precio" |
| `ProductGrid` | ambos | 4 columnas desktop / 2 móvil, **fracciones fijas, no `auto-fit`** — con 4 productos no se estiran |
| `CategoryCard` | server | 3 en la home; la primera en `acento` |
| `TrustStrip` | server | 3 celdas con separadores / filas apiladas en móvil |
| `RelatedProducts` | server | 4 desktop / 2 móvil |
| `FilterableCatalog` | client | chips + grid + estado vacío. Recibe `productos` y `categorias`, filtra en estado. Ver nota abajo |
| `CategoryEmpty` | ambos | estado sin resultados: título con el nombre de la categoría, texto, CTA a WhatsApp, enlace a todos |
| `SizePicker` | client | botones 48px; elegido = borde 2px `acento` + fondo `acentoSuave` |
| `QuantityStepper` | client | 48px; se reusa en el detalle y en el panel |
| `ProductPurchase` | client | bloque de compra del detalle: talla + cantidad + "Agregar al carrito" |
| `QuickAddButton` | client | "AGREGAR" de la tarjeta: 1 unidad, primera variante, y abre el panel |
| `CartProvider` | client | context + `localStorage` |
| `CartButton` | client | contador en el nav |
| `CartDrawer` | client | el panel |

**"ambos" significa sin `"use client"` y sin imports server-only**, para que el mismo
componente se pueda usar tanto desde el árbol servidor (home, detalle, relacionados) como
desde dentro de `FilterableCatalog`. `next/image` y `next/link` funcionan en los dos.

**Por qué el catálogo filtra desde un componente cliente y no con CSS:** CSS no puede
comparar el valor de dos atributos, así que un filtro puramente declarativo exigiría generar
una regla por categoría. `FilterableCatalog` recibe los 12 productos como props y filtra en
estado: son unos pocos KB de JSON en una página `noindex`, y el código queda directo. La home
y los relacionados siguen usando `ProductGrid` desde el servidor, sin JavaScript.

Iconos: lucide outline, trazo 1.6–1.75 a 18–20px. Áreas táctiles mínimas 44px.

Tratamiento de foto: proporción forzada 1:1, `object-fit: contain`, fondo `superficieFoto`,
borde inferior 1px. **Nunca `cover`** (recortaría el guante) y **nunca blanco puro**
(delataría los recortes del material del cliente).

### 5.6 Carrito y pedido

Estado persistido: `carrito: { slug, variante, cantidad }[]` en
`localStorage["carrito:<demo.slug>"]`. Estado efímero: `panelAbierto`, `categoriaActiva`, y
en el detalle `varianteElegida` + `cantidad`.

**El carrito guarda solo slug, variante y cantidad**; nombre, foto y precio se resuelven
mirando `DEMOS` al renderizar. Así un `localStorage` viejo no puede mostrar un precio viejo.
Contrapartida a manejar: si un producto desaparece de `DEMOS`, hay que **filtrar los slugs
desconocidos** al hidratar, o el panel intenta renderizar `undefined`.

El contador del nav es la suma de cantidades. En 0 no hay globo y el ícono baja a
`atenuadoSuave`; el globo es pill de 18px con `min-width` y crece a lo ancho con 2 dígitos.

`lib/demos/order.ts` es **una función pura**: recibe el carrito resuelto y devuelve el texto.
Es la pieza con más chance de salir mal (encoding, saltos de línea, formato de precios) y la
más barata de cubrir con tests. `lib/demos/format.ts` expone `formatCOP()` sobre
`Intl.NumberFormat("es-CO", { style: "currency", currency: "COP", maximumFractionDigits: 0 })`.

**Hidratación:** el `localStorage` se lee en `useEffect`, nunca en el primer render, o se
rompe el HTML prerenderizado. El primer paint muestra el carrito vacío.

**Sin JavaScript:** el catálogo y los precios siguen legibles (HTML estático) y cada tarjeta
conserva un enlace `wa.me` con ese producto en el mensaje. El panel no abre, y está bien.

Comportamiento del panel: abre desde el nav; cierra con la X, con clic en el overlay y con
`Esc`; **foco atrapado** mientras está abierto. Entra con `translateX` en 180ms `ease-out`
(en móvil de abajo hacia arriba), overlay con `opacity` en 140ms. Llegar a cantidad 0 quita
el ítem. Vacío: sin subtotal y sin CTA de pedido.

Foco de teclado en toda la demo: `outline: 2px solid var(--acento)` con `outline-offset: 2px`.
Nunca el anillo por defecto del navegador.

### 5.7 Copy — español colombiano

El handoff trae el copy en voseo rioplatense ("agregaste", "Armá", "Escribinos", "Se acabó
la tanda"). La tienda es para Villavicencio, Meta: se reescribe. Textos definitivos:

| Ubicación | Copy |
|---|---|
| Franja | `Demo · hecha por XyraCode` + botón `Quiero una así` |
| Catálogo, encabezado | `CATÁLOGO` · `12 referencias · precios en pesos` · `Mostrando N de M` |
| Chips | `Todos` · `Guantes` · `Indumentaria` · `Accesorios` |
| Tarjeta, CTA | `AGREGAR` — y `CONSULTAR` cuando `precio` es `null` |
| `precio: null` | etiqueta `Precio` + `Consultar por WhatsApp` |
| Sin resultados | `NO HAY NADA EN <CATEGORÍA>` · `Se nos agotó por ahora. Escríbenos y te avisamos cuando vuelva a entrar.` · botón `PREGUNTAR POR WHATSAPP` · enlace `Ver todos los productos` |
| Detalle | `Talla` · `Cantidad` · `Agregar al carrito` · `Preguntar por WhatsApp` |
| Panel, cabecera | `TU PEDIDO` + `N ítems` |
| Panel, pie | `SUBTOTAL` · `PEDIR POR WHATSAPP` |
| Panel, nota | `El pedido se abre en WhatsApp con los ítems escritos. El envío y la forma de pago se acuerdan ahí.` |
| Panel, vacío | `TODAVÍA NO HAS AGREGADO NADA` · `Arma tu pedido desde el catálogo y lo envías por WhatsApp en un solo mensaje.` · botón `VER CATÁLOGO` |
| Variante ausente | `Única` |
| Tira de confianza | `Envío en <negocio.ciudad>` · `Pago contra entrega` · `Atención por WhatsApp` — vive en `confianza[]`, derivado de los datos, nunca escrito a mano en JSX |

Mensaje de pedido:

```
Hola Guantes NR1, quiero pedir:
• 2 × Guante corte negativo látex 4 mm (Talla 8) — $ 299.800
• 1 × Buzo de arquero manga larga con coderas (Talla M) — $ 119.000
Total: $ 418.800
```

Regla general: sin voseo, sin modismos rioplatenses, tuteo. Todo el copy de interfaz vive en
componentes o en `lib/content/demos.ts`; nada se escribe suelto en JSX de página.

### 5.8 Aislamiento

`export const metadata = { robots: { index: false, follow: false } }` en
`app/demos/[cliente]/layout.tsx` — cubre la rama entera.

**No se toca [app/robots.ts](../../../app/robots.ts), y es deliberado.** Agregar
`Disallow: /demos` impediría que Google **lea** la etiqueta `noindex`, y la URL quedaría
indexable por enlaces externos. Crawl permitido + `noindex` es la combinación correcta.

[app/sitemap.ts](../../../app/sitemap.ts) no cambia: es manual y no deriva de `DEMOS`. Se le
agrega una línea al comentario de cabecera dejando constancia de que las demos quedan fuera
a propósito.

**`robots` no alcanza: hay que cortar también la herencia de metadata.** El layout raíz define
`title.template`, `description`, `alternates.canonical: "/"`, `openGraph` y `twitter`, y Next
fusiona la metadata **superficialmente** de la raíz hacia abajo: toda clave que la demo no
redefina se hereda. Sin esto, cada URL de demo se sirve con el título `| XyraCode`, un
`canonical` a la home de la agencia y el `og:site_name` de XyraCode. El layout de la demo usa
`generateMetadata` y declara `robots`, `title` (con `template` propio, para que las páginas
hijas no caigan en el de la raíz), `description`, `alternates` autorreferencial, `openGraph` y
`twitter`.

**Superficie rastreable — umbral anotado.** Cada demo agrega 14 páginas y hasta ~126 URLs de
`/_next/image` (9 variantes de `srcset` por imagen, medidas en el HTML de producción). Con las
12 URLs indexables actuales eso es irrelevante: el presupuesto de rastreo pesa en sitios de
decenas de miles de URLs, y estas no están enlazadas ni en el sitemap. **A partir de ~20 demos
publicadas conviene revisarlo**, y la salida entonces **no** es `Disallow: /demos` en
`robots.txt` —taparía el `noindex`— sino `X-Robots-Tag: noindex` por cabecera para la rama, que
permite el rastreo y expresa lo mismo.

### 5.9 Assets — `public/demos/guantes-nr1/`

| archivo | campo | estado | uso |
|---|---|---|---|
| `logo-mark.png` | `negocio.logoMarca` | **listo** — 852×604, alpha reconstruido | nav, **a 40px de alto** |
| `logo.png` | `negocio.logo` | **listo** — 852×728, lockup con tagline | footer, a 56px mínimo |
| 12 fotos de producto | `producto.imagen` | pendiente | 1:1, 800×800, WebP, una por slug |
| `hero.webp` | `hero.imagen` | pendiente | 16:9, 1600×900 |

El original venía de un generador de imágenes con el ajedrezado de transparencia **quemado en
los píxeles** (alpha 255 en todo el archivo) y una marca de agua abajo a la derecha. El alpha
se reconstruyó desde la luminancia y la marca de agua se eliminó **por recorte** — estaba en
y≈900-945 y el logo termina en y=873, así que no se retocó ningún píxel del logo.

`logo-mark.png` existe porque a las alturas de nav el lockup no funciona: la marca tiene alas
y letras solapadas, mucho más densa que un wordmark, y "EL INOXIDABLE" a 24px es ilegible.
Por eso el nav va a 40px y no a los 24px que asumía el handoff.

Para producción conviene pedirle a Nelson el vector; para la demo el PNG alcanza.

## 6. Tests

Colocados junto al archivo que prueban, como
[Breadcrumb.test.tsx](../../../components/ui/Breadcrumb.test.tsx).

| test | cubre |
|---|---|
| `SiteChrome.test.tsx` | guardía de las 9 páginas (§4) |
| `format.test.ts` | `formatCOP()`: miles, millones, y `null` |
| `order.test.ts` | armado del mensaje: un ítem, varios, con y sin variante, precio `null`, encoding del salto de línea, total |
| `CartProvider.test.tsx` | agregar, quitar, cambiar cantidad, cantidad 0 quita el ítem, total, persistencia, y **filtrado de slugs desconocidos** al hidratar |
| `ProductCard.test.tsx` | precio visible, CTA presente, y el caso `precio: null` con su CTA `CONSULTAR` |
| `CartDrawer.test.tsx` | cierre con `Esc`, cierre por overlay, estado vacío sin CTA de pedido |

## 7. Orden de trabajo

1. Cerrar y commitear el trabajo del 404 que está en el working tree. No mezclar.
2. Tomar la línea base: `npm run build` + hashes de los 14 HTML prerenderizados.
3. Fase 1 (`SiteChrome`) en un commit. Verificar según §4.
4. Fase 2 (la demo) — puede ir en varios commits.

Fase 1 no bloquea a la 2: son independientes. Se hace primero solo para que la demo nazca
limpia desde el primer render local.

**El hosting es Netlify, no Vercel.** Verificado el 2026-07-29 por la cabecera
`Server: Netlify` en producción. El README del proyecto dice Vercel y está equivocado. Importa
para dónde se cargan las variables de entorno y dónde se revisa el deploy preview de la rama.

## 8. Supuestos y decisiones abiertas

1. **`negocio.nombre = "Guantes NR1"`**, como se indicó. La marca del logo dibuja `N1R`
   (N — 1 — R). Si el orden comercial correcto es el del dibujo, es un cambio de una línea:
   afecta el `alt` del logo y el saludo del mensaje de WhatsApp.
2. **`whatsapp: "573044962704"`**, tomado del chat de Instagram. Confirmar que es la línea del
   negocio y no la personal antes de enviar el link.
3. **Los 12 productos, sus precios y sus fotos** salen del Instagram del cliente. Los del
   handoff son representativos. Precio ausente → `null`, nunca inventado.
4. **El hero** necesita una imagen 16:9 que el material de Instagram probablemente no tenga
   en esa proporción. Si no aparece una usable, se resuelve con una composición sobre
   `superficieFoto` en vez de estirar una foto cuadrada.
5. **`negocio.tagline = "El inoxidable"`**, tomado del propio logo.
6. **`negocio.ciudad = "Villavicencio"` NO está verificado.** Es el dato más frágil del spec:
   entró por arrastre —el brief decía que *XyraCode* está en Villavicencio y el diseño lo
   aplicó también al cliente— y nadie confirmó dónde opera Nelson.

   **Aparece en tres lugares visibles, y uno es el primero de todos:**
   - el **kicker del hero** (`EL INOXIDABLE · VILLAVICENCIO`), arriba del pliegue;
   - `Envío en <ciudad>` en la tira de confianza;
   - el footer.

   Confirmar **antes** de mandar el link. Si vende por envío nacional en vez de local, no cambia
   solo el nombre de la ciudad: cambia la entrada de `confianza[]` (`Envío a todo el país`) y hay
   que decidir qué dice el kicker, porque una zona que no es su zona lo delata en el primer
   segundo.
7. **`logo` y `logoMarca` son obligatorios** porque este cliente los tiene. El handoff
   contemplaba un wordmark tipográfico en dos pesos para clientes sin logo; no se implementa
   hoy (nada lo usaría). Cuando aparezca un cliente sin logo, los campos pasan a opcionales y
   se agrega un componente `Wordmark` con `negocio.wordmark: { parte1, parte2 }`.

## 9. Referencias

- Brief enviado a diseño: [handoff/design_brief_demos_tienda.md](../../../handoff/design_brief_demos_tienda.md)
- Handoff recibido: `handoff/demos/design_handoff_demos_tienda-nr1/` — `README.md` es la
  especificación detallada; `capturas/1a`–`1f` la referencia visual. `support.js` **no se
  porta al repo**.
