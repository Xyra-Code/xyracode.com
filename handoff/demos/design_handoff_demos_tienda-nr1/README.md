# Handoff · Demo de tienda para prospectos (sistema + identidad Palomita)

Archivo de diseño: `Demo Tienda - Sistema y Nelson.dc.html` (canvas, pan/zoom).
Cada pantalla lleva `data-screen-label` y un id citable: `1a` identidad · `1b` home ·
`1c` catálogo · `1d` detalle · `1e` carrito · `1f` prueba de sistema con segunda paleta.
Cada pantalla está en **desktop (1240px de contenido)** y **móvil (390px)**.

Negocio del primer cliente: **Palomita**, guantes de arquero e indumentaria de portero,
Villavicencio. 12 referencias, 3 categorías (Guantes 5 · Indumentaria 4 · Accesorios 3).

## Sobre los archivos de este paquete

Los `.dc.html` son **referencias de diseño**: prototipos que muestran la apariencia y el
comportamiento buscados, no código de producción para copiar. La tarea es **recrear estas
pantallas en el entorno del proyecto** (Next.js 16 App Router + Tailwind v4 + TypeScript,
prerender estático, iconos lucide) con sus patrones establecidos. Nada del HTML de estos
archivos debería terminar en el repo tal cual.

Archivos:

- `Demo-Tienda-Palomita.dc.html` — las seis pantallas lado a lado, cada una con
  `data-screen-label` e id citable (`1a`–`1f`), en desktop y 390px.
- `design_brief.md` — el brief corto: alcance, tokens, franja, componentes, aceptación.
- `README.md` — esta especificación detallada.
- `capturas/` — PNG de cada pantalla (`1a`–`1f`), referencia visual rápida. La fuente de
  verdad son este README y el `.dc.html`; en las capturas los marcos desktop y móvil quedan
  apilados por el ancho del lienzo.
- `support.js` — runtime del visor del prototipo. **No se porta al repo.**

## Fidelidad

Alta fidelidad de layout: estructura, jerarquía, espaciados y tipografía finales; copy
representativo; sin imágenes raster (todos los slots son recuadros punteados con su
proporción). Las interacciones no están cableadas: los estados (chip activo, talla
seleccionada, panel abierto, vacío) se muestran como composiciones estáticas.

Nota de dirección: el proyecto tiene el sistema **Nocturne** adjunto, pero §6 del brief pide
una identidad propia por cliente. Se tomó de Nocturne el criterio estructural —densidad
compacta, radio chico único, sin degradados ni sombras difusas, acento como marca y no como
relleno de grandes áreas— y se diseñó paleta y tipografía propias.

## Tokens · dos capas

### Capa de identidad — exactamente 4 variables (`tema` en el modelo de datos)

| variable | Palomita | Papelhoy (prueba `1f`) | uso |
|---|---|---|---|
| `fondo` | `#0E0E10` | `#F4F1EA` | fondo de página |
| `texto` | `#F2F2EF` | `#1B1A18` | texto principal y precios |
| `acento` | `#C6F24E` | `#E24A2B` | CTA, chip activo, kicker, contador, precio "consultar" |
| `acentoTexto` | `#0E0E10` | `#F7F3EC` | texto sobre `acento` |

El sistema funciona con `fondo` oscuro **y** claro: `1b`–`1e` son sobre fondo oscuro y `1f`
es sobre fondo claro, con el mismo layout y las mismas reglas de derivación.

### Capa de sistema — derivada, igual para todos los clientes

| token | regla de derivación | Palomita / Papelhoy |
|---|---|---|
| `superficie` | `mix(fondo, texto 6%)` | `#191A1C` / `#FAF8F3` |
| `superficieFoto` | `mix(fondo, texto 9%)` — base neutra detrás de toda foto | `#202124` / `#EBE7DE` |
| `borde` | `mix(fondo, texto 12%)` | `#26272A` / `#E0DBD1` |
| `bordeFuerte` | `mix(fondo, texto 30%)` | `#47484B` / `#B6B0A4` |
| `atenuado` | `mix(texto, fondo 58%)` | `#9A9B98` / `#6E6A62` |
| `atenuadoSuave` | `mix(texto, fondo 72%)` — solo metadatos mono chicos | `#6B6C69` / `#948F85` |
| `cuerpo` | `mix(texto, fondo 25%)` — párrafos largos | `#B6B7B3` / `#3E3B36` |
| `acentoSuave` | `mix(acento, fondo 88%)` — fondo de la talla elegida | `#23291A` / `#FBE7E1` |
| `acentoProfundo` | `mix(acento, texto 45%)` — texto sobre relleno de acento | `#40521A` / — |
| `franjaXyra` | **tema invertido**: fondo = `texto`, texto = `mix(fondo, texto 30%)`, borde = `mix(texto, fondo 22%)` | claro sobre tienda oscura / oscuro sobre tienda clara |
| `radio` | constante: `4px`; chips y contador `999px` | — |
| `sombra` | constante: ninguna. Elevación = borde 1px + overlay negro 60% | — |
| espaciado | escala constante 4/6/8/12/16/22/26/36/48/56 px | — |

**Valores de identidad que NO entran en las 4 variables** (importante antes de codear):

1. **El wordmark** necesita saber dónde se corta el nombre en dos pesos (`PALO|MITA`,
   `PAPEL|HOY`). No cabe en `tema`: si se quiere automático hay que agregar
   `negocio.wordmark: { parte1, parte2 }`. Mientras no exista, el corte se define a mano por
   demo o se acepta el nombre completo en un solo peso.
2. **La tipografía es del sistema, no del cliente**: Archivo + Manrope + Space Mono en todas
   las demos. Si un cliente pide otra, es una quinta variable y hay que decidirlo explícito.
3. La franja de XyraCode **sí** deriva del tema (regla de arriba). Fue el cambio respecto de
   la versión anterior: con clientes de fondo oscuro una franja constante oscura desaparecía.

## Paleta · justificación (Palomita)

Verde ácido (`#C6F24E`) sobre negro cálido (`#0E0E10`). Es el código visual del arquero
actual —guantes fluor, cancha de noche, luz artificial— y sirve al encargo por cuatro
razones: (a) espontáneo y moderno sin degradados, glassmorphism ni sombras; (b) el negro
como fondo hace que cualquier foto de guante recortada a la loca se vea deliberada, y el
ácido carga toda la energía sin necesidad de fotos buenas; (c) contraste texto/fondo 15.9:1 y
acento/fondo 13.4:1 — legible a 390px al sol y de noche; (d) es lo más lejano posible de la
paleta teal oscura de XyraCode y de cualquier plantilla de e-commerce genérica, que casi
siempre es blanca con azul.

El acento se reserva a CTA, chip activo, kicker, contador del carrito y el estado
"Consultar". El precio va en `texto`, grande: es la decisión de compra.

## Tipografía · justificación

- **Archivo** 700/500 en mayúsculas con tracking −0.03/−0.04em: bloques compactos de
  camiseta y cartel de cancha, con cifras anchas para que el precio pese. Da el tono
  deportivo sin recurrir a una display de moda que envejezca en un año.
- **Manrope** 400/500/600 en nombres de producto y descripciones: geométrica, abierta y
  contemporánea — moderna sin ser corporativa, y muy legible chica en Android de gama media.
- **Space Mono** en metadatos, migas, categoría de tarjeta y la franja de la demo: le pone el
  tono suelto y cumple el requisito de mono ~13px de la franja.

Escala: 60/46/44 título de página · 26/24/22/21 sección · 36/32/21/18 precio · 17/16/15/14
cuerpo · 12/11/10 mono.

## Componentes compartidos

| componente | notas |
|---|---|
| Franja XyraCode | `fixed top:0`, alto 40 desktop / 32 móvil, mono 13/11px + botón "Quiero una así" (`target="_blank"`). Color por inversión del tema. |
| Nav de tienda | `sticky top:40/32`, alto 72/52. Wordmark + enlaces (desktop) o wordmark + carrito + hamburguesa (móvil). |
| Contador de carrito | globo pill 18px, `min-width:18px`, crece a lo ancho con 2 dígitos; en 0 no hay globo y el ícono baja a `atenuadoSuave`. |
| Tarjeta de producto | foto 1:1 sobre `superficieFoto` + nombre con `min-height` de 2 líneas + precio anclado con `margin-top:auto` + CTA. Única tarjeta para grid, destacados y relacionados. |
| Chips de categoría | pill 999px, fila con scroll horizontal en móvil; activo = relleno `acento`. Alto 40px. |
| Selector de talla | botones de 48px; elegido = borde 2px `acento` + fondo `acentoSuave`. |
| Selector de cantidad | 48px de alto, bordes compartidos, radio 4px. |
| Botón primario | relleno `acento`, Archivo 700 en mayúsculas, tracking +0.02em. |
| Botón secundario | borde `bordeFuerte`, fondo transparente. |
| Panel de carrito | 420px lateral en desktop, pantalla completa bajo la franja en móvil. |
| Tira de confianza | 3 celdas con separadores verticales (desktop) / filas apiladas (móvil). |
| Footer del cliente | franja en `superficie` con wordmark, WhatsApp y ciudad. |

Iconos: lucide outline, trazo 1.6–1.75 a 18–20px.

## Estructura por pantalla

1. **Home** `/demos/[cliente]` — franja · nav · hero 2 columnas (texto / 16:9) · "Los que más
   salen" (4) · Categorías (3 tarjetas; la primera en `acento`) · tira de confianza · footer.
2. **Catálogo** `/demos/[cliente]/catalogo` — encabezado con conteo · chips (Todos + 3) ·
   grid 4 columnas (desktop) / 2 (móvil). Con 4 productos queda una fila sin estirarse porque
   las columnas son fracciones fijas, no `auto-fit`.
3. **Detalle** `/demos/[cliente]/p/[producto]` — migas mono · foto 1:1 + columna de compra
   (kicker, título, precio, descripción, talla, cantidad, CTA, WhatsApp secundario) ·
   4 relacionados (2 en móvil).
4. **Carrito** — overlay negro 60% + panel; header con conteo y cerrar · ítems (miniatura
   72/64px, nombre, variante mono, cantidad, precio de línea, quitar) · pie con subtotal
   grande y **Pedir por WhatsApp** a 19px sobre `acento`: único relleno de acento del panel.

## Estados (§8) — dónde verlos

| estado | ubicación |
|---|---|
| Carrito vacío | `1e`, tercer marco |
| `precio: null` | `1c` (tarjeta "Bolso portaguantes") y `1d` tercer marco: barra de acento, etiqueta "Precio" y CTA que pasa a "Consultar por WhatsApp" |
| Sin variantes | `1d` tercer marco: desaparece el bloque Talla, Cantidad ocupa su lugar, mismo `gap` |
| Categoría sin resultados | `1c`, tercer marco |
| Nombre largo (2 líneas) | `1c`: "Guante híbrido roll finger con dedo espina para partido de competencia" — `min-height` de 2 líneas en toda tarjeta |
| Contador 0 / 1 / 2 dígitos | `1c`, cuarto marco |
| Sin JavaScript | nota en `1e`: catálogo y precios son HTML estático; cada tarjeta conserva su enlace `wa.me` con el producto en el mensaje |
| Apilado sticky al hacer scroll | `1b`, tercer marco (offsets y proporción en pantalla) |
| Foto de cliente "fea" | `1c` y `1f`: dos productos con fondo distinto y recorte torcido, contenidos en el cuadro 1:1 sobre `superficieFoto` |

## Interacciones, estado y comportamiento

Todo corre en el navegador; no hay servidor ni base de datos.

| interacción | comportamiento |
|---|---|
| Chip de categoría | filtra el array de productos en cliente; un solo chip activo; "Todos" reinicia. Sin recarga ni cambio de ruta (o `?cat=` si se quiere compartible). |
| "Agregar" en tarjeta | agrega 1 unidad con la variante por defecto (la primera) y abre el panel del carrito. |
| Detalle: talla y cantidad | estado local; talla obligatoria si el producto tiene `variantes`; cantidad mínima 1, sin máximo. |
| "Agregar al carrito" | escribe en el carrito y abre el panel. |
| Panel de carrito | abre desde el nav; cierra con la X, con clic en el overlay y con `Esc`; foco atrapado dentro mientras está abierto. |
| Cantidad en el panel | −/+ actualizan la línea; llegar a 0 quita el ítem. |
| "Pedir por WhatsApp" | abre `wa.me/<negocio.whatsapp>` en pestaña nueva con el pedido escrito (nombre, variante, cantidad y subtotal). |
| "Preguntar / Consultar por WhatsApp" | igual, con el producto y su enlace. Es el respaldo cuando `precio` es `null` y cuando no hay JS. |
| "Quiero una así" | WhatsApp de XyraCode, pestaña nueva. |

Estado necesario: `carrito: { slug, variante, cantidad }[]` persistido en `localStorage`
por demo (`carrito:<demo.slug>`), `panelAbierto: boolean`, `categoriaActiva: string`, y en el
detalle `varianteElegida` + `cantidad`. El contador del nav es la suma de cantidades. Nada de
esto se pierde al navegar entre rutas; sí se pierde entre dispositivos, y está bien.

Transiciones: panel entra con `transform: translateX` en 180ms `ease-out` (en móvil de abajo
hacia arriba), overlay con `opacity` en 140ms. Hover: superficies suben un paso del ramp,
botón primario baja a `mix(acento, texto 12%)`. Foco de teclado: `outline: 2px solid acento`
con `outline-offset: 2px` — nunca el anillo azul del navegador. Sin animaciones decorativas.

Responsive: un único quiebre a **768px**. Debajo, todo a una columna, grid de producto a 2
columnas, chips con scroll horizontal, panel a pantalla completa, nav con hamburguesa.

## Slots de assets

| slot | proporción | tamaño | uso |
|---|---|---|---|
| Foto de producto | 1:1 | 800×800 | tarjeta de grid, detalle y miniatura del carrito — una sola imagen por producto |
| Imagen del hero | 16:9 | 1600×900 | solo home |
| Logo del negocio | libre, alto 24px | opcional | si falta, wordmark tipográfico |

Tratamiento de foto: proporción forzada, `object-fit: contain`, fondo `superficieFoto` y 1px
de `borde` abajo. Nunca `cover` (recortaría el guante) y nunca blanco puro (delataría los
recortes del cliente).

## Prueba de reuso

`1f` es el catálogo completo con `fondo/texto/acento/acentoTexto` de una papelería —y con
fondo claro, el caso opuesto al de Palomita— **sin un solo cambio de layout, escala o
espaciado**. Lee como otra marca, que es la prueba que pedía §6.
