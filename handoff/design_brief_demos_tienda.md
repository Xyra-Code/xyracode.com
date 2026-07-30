# Brief de diseño: demo de tienda para prospectos

> **Dirección**: este archivo va **hacia** Claude Design. Lo que vuelva se guarda como
> `handoff/design_handoff_demos_tienda/` siguiendo la convención de los otros handoffs.

---

## 1. Contexto

XyraCode es una agencia de desarrollo web en Villavicencio, Colombia. Para cerrar
prospectos que hoy venden por Instagram/WhatsApp, se les construye una **demo navegable
de su propia tienda** y se les manda el link. El prospecto no ve un mockup ni un
portafolio: ve su marca, sus productos y sus precios, funcionando.

El primer cliente es **Nelson**, que vende guantes de trabajo y dotación por Instagram.

Esta demo es la **primera de un sistema**, y el sistema tiene dos capas:

- **El sistema** (se diseña una vez, se reusa en todas las demos): layout, componentes,
  escala tipográfica, espaciados, radios, comportamiento.
- **La capa de identidad** (se diseña por cliente): paleta, wordmark, hero.

Lo que se te pide acá es **el sistema completo más la primera identidad**, la del negocio
de Nelson. La demo siguiente debe resolverse cambiando solo la capa de identidad.

## 2. Qué NO es

- **No es el sitio de XyraCode.** No lleva su nav, su footer, su paleta teal oscura ni
  su tipografía. Es la tienda del cliente. La única presencia de XyraCode es la franja
  de crédito de §5.
- No es un checkout real. No hay pasarela, ni cuentas de usuario, ni cálculo de envío.
  El pedido termina en WhatsApp.
- No lleva blog, ni "nosotros", ni páginas institucionales.

## 3. Restricciones técnicas que condicionan el diseño

El diseño se recrea en **Next.js 16 (App Router) + Tailwind CSS v4 + TypeScript**,
dirigido por datos. Esto no es negociable y afecta lo que se puede diseñar:

- **Todo se prerenderiza estático.** No hay servidor, ni base de datos, ni búsqueda en
  backend. El filtro de categorías corre en el navegador.
- **Mobile-first, obligatorio.** El cliente y sus compradores están en Android, en
  WhatsApp. Diseñá primero la vista de 390px y después el desktop. Si algo solo funciona
  en escritorio, no sirve.
- **El carrito vive en `localStorage`** del navegador. Se pierde entre dispositivos, y eso
  está bien.
- **Iconos: lucide** (outline), que ya es la dependencia del proyecto. No introduzcas otra
  familia de iconos.
- Sin JavaScript el catálogo y los precios tienen que seguir siendo legibles, y cada
  producto necesita un enlace directo a WhatsApp de respaldo. Contemplá ese estado.

## 4. Pantallas a diseñar

Tres rutas y un panel. Rutas reales:

| # | Pantalla | Ruta |
|---|---|---|
| 1 | Home de la tienda | `/demos/[cliente]` |
| 2 | Catálogo | `/demos/[cliente]/catalogo` |
| 3 | Detalle de producto | `/demos/[cliente]/p/[producto]` |
| 4 | Carrito (panel lateral) | sobre cualquiera de las anteriores |

**No diseñes una 404 para la tienda.** Todas las URLs de la demo se generan desde los datos
y el routing corta los slugs inexistentes antes de que se monte cualquier pantalla de la
tienda, así que una 404 propia sería código muerto.

### 1. Home
Franja de crédito → nav de la tienda (logo, enlaces, contador de carrito) → hero con
propuesta y foto → **productos destacados** (3–4) → **categorías** (3 tarjetas) → tira de
confianza ("Envío en la ciudad", "Pago contraentrega", "Atención por WhatsApp") → footer
del cliente con su WhatsApp y su ciudad.

### 2. Catálogo
Encabezado corto → **chips de categoría** (incluido "Todos", con estado activo visible) →
grid de ~12 productos. Cada tarjeta: foto, nombre, precio, y acción de agregar. El grid
tiene que verse bien con 12 y con 4.

### 3. Detalle de producto
Migas de pan → foto grande → nombre, precio, descripción corta → **selector de variante**
(p. ej. Talla: S/M/L) → selector de cantidad → botón "Agregar al carrito" → enlace
secundario "Preguntar por WhatsApp" → 3–4 productos relacionados abajo.

### 4. Carrito — panel lateral
Se abre desde el nav. Lista de ítems (foto chica, nombre, variante, cantidad editable,
precio de línea, quitar), subtotal, y el botón principal **"Pedir por WhatsApp"**. Ese
botón es el clímax de toda la pantalla: tiene que ser lo más evidente del panel.

## 5. La franja de crédito de XyraCode

Es lo único de XyraCode en toda la demo. Especificación:

- Fija arriba, sobre el nav de la tienda. Alto ~40px.
- Fondo oscuro, contraste claro contra la tienda (que es clara — ver §6).
- Tipografía mono, ~13px: **"Demo · hecha por XyraCode"**.
- A la derecha, un botón discreto: "Quiero una así" → abre WhatsApp de XyraCode en pestaña
  nueva.
- **Discreta, no una barra de publicidad.** El protagonista es el cliente.
- **Resolvé el apilado**: el nav de la tienda también es sticky. Dos elementos fijos
  encima del otro necesitan un offset explícito, y en móvil no puede comerse un tercio de
  la pantalla. Mostrá cómo se comporta al hacer scroll.

## 6. Identidad visual

**Diseñá una identidad propia para el negocio de Nelson, de cero.**

No la tomes de su Instagram. Su perfil actual es el de un vendedor informal, y la
identidad diseñada es exactamente el producto que se le está vendiendo: si la demo replica
la estética que ya tiene, le estamos mostrando lo que ya tiene. Tiene que abrir el link y
ver su negocio mejor de lo que se lo había imaginado.

### Qué tiene que comunicar

Dotación y seguridad industrial vendida por alguien serio: **robustez, confianza y precio
claro**. Un comprador de guantes de trabajo decide por especificación y precio, no por
aspiración. La identidad tiene que verse **establecida**, no boutique.

### Restricciones duras

1. **No puede parecerse a XyraCode.** El sitio de la agencia es oscuro con teal y Plus
   Jakarta Sans. La tienda tiene que leerse como otra empresa, no como una sección de
   xyracode.com.
2. **No puede leerse como plantilla de e-commerce genérica.** Si se parece a un tema de
   Shopify cualquiera, falló el encargo.
3. **Tiene que sobrevivir fotos de producto malas.** Las fotos salen del Instagram del
   cliente: fondos distintos, iluminación distinta, recortes distintos. La identidad no
   puede depender de que las fotos sean limpias ni consistentes. Resolvelo en el sistema
   —superficie neutra detrás de la foto, proporción forzada, encuadre— y mostralo con al
   menos una foto simulada "fea" en el diseño.
4. **Legibilidad móvil antes que sofisticación.** Precios y nombres tienen que leerse a
   390px, al sol, en un Android de gama media.

Dentro de eso, **la paleta y la tipografía son tu decisión**. No te estoy pidiendo un
naranja de seguridad ni un fondo claro en particular: quiero la elección que resuelva mejor
el encargo, con su justificación en el handoff. Lo único que sí pido es que evites
degradados, glassmorphism y sombras difusas — no envejecen bien y contradicen el "robusto".

### Entregables de identidad

- **Wordmark tipográfico** con el nombre del negocio (no hay logo). Mostralo en el nav, en
  el footer y suelto.
- Paleta con su justificación.
- Elección tipográfica con su justificación.

### Contrato de tokens: dos capas separadas

Esto es lo que hace que el sistema sea reusable, así que es requisito, no sugerencia.
Separá en el handoff:

**Capa de identidad — exactamente estas cuatro variables.** Es lo que el código cambia por
cliente:

```
fondo · texto · acento · acentoTexto
```

**Capa de sistema** — todo lo demás (bordes, superficies, atenuados, sombras, radios): se
**derivan** de esas cuatro o son constantes iguales para todos los clientes. Dejá dicho en
el handoff cómo se deriva cada una.

Si un valor de identidad no cabe en las cuatro variables, decilo explícitamente en el
handoff en vez de agregar una quinta por lo bajo: significa que hay que ampliar el modelo
de datos, y es mejor saberlo ahora.

### Prueba de que el sistema aguanta

Al final, repetí **una** pantalla (la del catálogo) con una **segunda paleta** de un rubro
distinto —una tienda de café, una papelería, lo que quieras— cambiando solo esas cuatro
variables. Si esa pantalla se lee como otra marca sin tocar el layout, el sistema funciona.
Si no, la separación de capas no quedó bien y hay que corregirla antes de codear.

## 7. Modelo de datos que el diseño debe poder alimentar

El diseño no puede pedir campos que el modelo no tiene. Este es el contrato:

```ts
type DemoProduct = {
  slug: string;
  nombre: string;
  precio: number | null;      // COP entero. null → "Consultar por WhatsApp"
  categoria: string;
  imagen: { src, alt, width, height };
  descripcion: string;
  variantes?: { label: string; opciones: string[] };   // "Talla": ["S","M","L"]
  destacado?: boolean;
};

type Demo = {
  slug: string;
  negocio: { nombre, tagline, whatsapp, ciudad, logo? };
  tema: { fondo, texto, acento, acentoTexto };
  hero: { titulo, subtitulo, imagen };
  categorias: { slug, nombre }[];
  productos: DemoProduct[];
  confianza: string[];
};
```

**Una sola imagen por producto.** No diseñes galerías ni carruseles de producto: no hay
campo para eso y el material del cliente no lo tiene.

## 8. Estados que hay que diseñar (no los omitas)

Acá es donde los diseños de tienda fallan:

1. **Carrito vacío** — el panel abierto sin ítems.
2. **Producto sin precio** (`precio: null`) — muestra "Consultar por WhatsApp" donde iría
   el precio. Tiene que verse intencional, no roto.
3. **Producto sin variantes** — el selector de talla desaparece; el layout no se descuadra.
4. **Categoría sin resultados** al filtrar.
5. **Nombre de producto largo** — dos líneas en la tarjeta sin romper el grid.
6. **Contador del carrito** en el nav: en 0, en 1 y en 2 dígitos.

## 9. Volumen representativo

12 productos, 3 categorías, 4 destacados. Copy representativo de dotación industrial
(guantes de vaqueta, de nitrilo, de carnaza, gafas, botas…) con precios plausibles en COP.
El texto final sale de los datos reales; lo que importa es que el layout aguante ese
volumen y esa longitud de nombres.

## 10. Slots de assets

Marcá con recuadro punteado, indicando proporción y tamaño:

- Foto de producto: **cuadrada, 800×800** (tarjeta de grid, detalle y miniatura del carrito
  salen todas de esta única imagen).
- Imagen del hero: **16:9, ~1600×900**.
- Logo del negocio: opcional; si no está, wordmark.

## 11. Formato de entrega

Igual que `handoff/design_handoff_plantillas/`:

- Un `.dc.html` con las pantallas lado a lado, cada una con su `data-screen-label`.
  Incluí ahí el wordmark, y la pantalla de catálogo con la segunda paleta que pide §6.
- Un `README.md` con:
  - fidelidad;
  - **tokens en las dos capas separadas de §6**, con la regla de derivación de cada token
    de sistema;
  - la justificación de paleta y tipografía;
  - componentes compartidos;
  - estructura por pantalla;
  - los estados de §8;
  - los slots de assets con sus tamaños;
  - y cualquier valor de identidad que **no** haya entrado en las cuatro variables.
- **Alta fidelidad de layout**: estructura, jerarquía, espaciados y tipografía finales.
  Copy representativo. Sin imágenes raster.
- Vista móvil (390px) **y** desktop de cada pantalla, no solo desktop.
