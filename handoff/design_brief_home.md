# Brief de diseño: rediseño visual de la home de xyracode.com

> **Dirección**: este archivo va **hacia** Claude Design. Lo que vuelva se guarda como
> `handoff/design_handoff_home/` siguiendo la convención de los otros handoffs.

---

## 1. El encargo en una línea

Rediseñar **los estilos y la presentación visual de la home** —composición, jerarquía,
tratamiento tipográfico, superficies, densidad, ritmo y motion— **sin tocar el resto del
sitio**.

Y una cosa concreta antes que ninguna otra: **quiero abandonar la estrategia de bloques
estáticos de color fijo intercalados.** Hoy cada sección es una franja de ancho completo
con su color de fondo, apiladas una tras otra, y el color es lo único que las separa. Eso
es lo que hay que reemplazar. §4.1 lo desarrolla, y es el criterio con el que voy a mirar
la propuesta.

xyracode.com tiene 9 rutas más (servicios, proyectos, blog, nosotros, contacto, 404). Este
encargo es **solo `/`**. Las demás rutas se quedan exactamente como están, y eso no es un
detalle administrativo: es la restricción que más condiciona lo que podés proponer, porque
la home comparte componentes con ellas. §3 lo detalla.

## 2. Contexto

XyraCode es una agencia colombiana de desarrollo web y software a medida, en Villavicencio
(Meta), con clientes en todo el país. Detrás hay **un desarrollador**: el cliente habla
directamente con quien escribe el código, no con un intermediario.

Su diferencial real, verificable en el propio código del sitio:

- **Código propio, sin plantillas ni constructores.** Nada de WordPress ni Wix.
- **El repositorio, el dominio y la base de datos quedan a nombre del cliente** desde el
  día uno. Si se va con otro equipo, se lleva todo.
- **Trato 1:1** con el dev.
- **Propuesta en 48 horas.**

Quien llega a la home viene de dos sitios: de una búsqueda en Google ("desarrollo web
Villavicencio", "cuánto cuesta una página web") o de un enlace que le mandaron por
WhatsApp. En los dos casos **llega en Android, con datos móviles, y decide en segundos**.
La conversión no es una compra: es que escriba por WhatsApp o llene el formulario.

---

## 3. Alcance: qué podés tocar y qué no

Esta es la sección más importante del brief. El sitio corre en **Tailwind CSS v4**, donde
no hay archivo de config: los tokens viven en `@theme` dentro de `app/globals.css`, que
carga en **todas** las rutas. Y varios componentes de la home los usan también las otras
páginas. Así que "rediseñar solo la home" tiene un mapa concreto:

### 3.1 Libre — solo existe en la home

Rediseñá esto sin pedir permiso. Nada de lo que hagas acá se ve en otra ruta:

| Archivo | Qué es |
|---|---|
| `app/page.tsx` | el orden de las secciones |
| `components/sections/Hero.tsx` | hero |
| `components/sections/TrustStrip.tsx` | franja de stack |
| `components/sections/HomeIntro.tsx` | bloque de prosa |
| `components/sections/Services.tsx` | grilla de servicios |
| `components/sections/Process.tsx` | los 4 pasos |
| `components/sections/Portfolio.tsx` | caso destacado |
| `components/sections/ProjectCarousel.tsx` | carrusel de capturas |
| `components/sections/HomeFaq.tsx` | preguntas frecuentes |
| `components/ui/Card.tsx` | **hoy solo lo usan Services y Process** |
| `components/ui/SectionHeading.tsx` | **hoy solo lo usan las 4 secciones de la home** |

`Card` y `SectionHeading` están en `ui/` como si fueran primitivas compartidas, pero
ninguna otra ruta las importa. **Son tuyas.** Si tu propuesta las disuelve o las reemplaza
por otra cosa, ningún otro archivo se rompe.

### 3.2 Compartido — cambiarlo repinta otras rutas

| Archivo | Lo usan además |
|---|---|
| `components/sections/Navbar.tsx` | las 9 rutas + la 404 |
| `components/sections/Footer.tsx` | las 9 rutas |
| `components/sections/Cta.tsx` | también `/contacto` |
| `components/sections/ContactForm.tsx`, `ScheduleButton.tsx` | vía `Cta` |
| `components/ui/Button.tsx` | navbar, `/nosotros`, `/servicios`, `/servicios/[slug]` |
| `components/ui/Eyebrow.tsx` | `/blog`, `/proyectos`, `/servicios`, `/contacto`, footer |
| `components/ui/Reveal.tsx` | todas las rutas |
| `app/globals.css` → `@theme`, `.reveal`, `.prose-xyra` | todas las rutas |

Reglas para esta lista:

- **Navbar y footer están fuera de alcance.** Son el marco. Dibujalos tal cual están en tus
  pantallas para que se vea la página completa, pero no los rediseñes.
- **`Button`, `Eyebrow` y `Reveal` no se modifican en su definición.** Si la home necesita
  otro tratamiento, se resuelve **por composición** —clases extra desde el llamador, que es
  como el código ya lo hace hoy con el borde del botón ghost— o **con una variante nueva
  que solo la home usa**. Decí cuál de las dos y por qué.
- **`.prose-xyra` no se toca**: es la tipografía de los artículos y las páginas de
  servicio, y la home ni la usa.
- **Los tokens de `@theme` no se redefinen.** Si tu diseño necesita colores o valores
  nuevos, pedilos como **variables nuevas con prefijo propio** (p. ej. `--home-*`) o como
  clases con alcance a la home. Redefinir `--color-brand-primary` repinta el sitio entero.

### 3.3 `Cta` — hay que decidirlo, no esquivarlo

La banda de contacto es la única sección de la home que otra ruta reusa entera:
`/contacto` monta el mismo componente. Elegí una y justificala en el README:

- **A.** Dejarla como está y adaptar el diseño de la home a su alrededor.
- **B.** Rediseñarla y aceptar que `/contacto` cambia con ella. *(Sale del alcance
  "solo la home" — solo si el resultado es claramente mejor para las dos.)*
- **C.** Agregarle una variante que solo use la home, y que `/contacto` siga con la actual.

### 3.4 La identidad de marca se queda

No la rediseñes: está desplegada en todo el sitio y vive en `@theme`. Lo que es libre es
**cómo la usás dentro de la home** — proporciones, dominancia, dónde va cada color, qué
tanto peso tipográfico, qué superficies.

```
--color-night          #08110f    fondos oscuros (hero, portfolio, nav)
--color-night-mid      #0d2b26    paso intermedio del degradado del hero
--color-night-deep     #0f3d34    fin del degradado del hero
--color-night-footer   #050c0a    footer
--color-brand-primary  #0f766e    teal 700 — acento sobre claro, CTA
--color-brand-secondary#10b981    emerald 500 — botón primario
--color-brand-ink      #0b1f1c    texto sobre claro
--color-brand-cream    #f6fbfa    fondo del body
teal-300               #5eead4    acento sobre oscuro (eyebrows, enlaces, tags)
slate-500 / slate-600             texto secundario y prosa sobre claro
rgba(226,247,242,.78)             texto de párrafo sobre oscuro
```

Tipografía: **Plus Jakarta Sans** (`--font-sans`) y **JetBrains Mono** (`--font-mono`),
cargadas con `next/font/google` en el layout raíz.

Escala actual. **Los tamaños, pesos y tracking sí son tuyos** dentro de la home; las
familias no:

| Rol | Valor actual |
|---|---|
| H1 | 34px móvil / 52px desktop · 800 · tracking −0.035em · line-height 1.05 |
| H2 | 32px / 40px · 800 · tracking −0.03em |
| H3 tarjeta | 16–17px · 700 |
| Eyebrow | 11px · 800 · UPPERCASE · tracking 0.2em |
| Párrafo | 16.5–17.5px · line-height 1.6–1.75 |
| Mono | 10.5–13px (tags, numeración, pie del footer) |
| Radios | tarjetas 16px (`rounded-2xl`) · botones 10px |

Si tu propuesta necesita una tercera familia display, podés pedirla —**pero la carga la
paga todo el sitio**, porque las fuentes se declaran en el layout raíz. Justificala y decí
exactamente dónde se usa.

### 3.5 El contenido no se recorta

Todo el texto vive en `lib/content/`. Los dos bloques de prosa larga (`HomeIntro` y
`HomeFaq`) existen por una razón concreta: la home tenía 368 palabras visibles siendo la
URL con más autoridad del dominio, y esos bloques reparten los enlaces internos hacia las
páginas de servicio. **Rediseñalos, no los podes.** Dos consecuencias:

- Los enlaces contextuales siguen **dentro de la prosa**, no convertidos en botones. Su
  valor depende de estar en el cuerpo del texto.
- Si proponés acordeón para las preguntas, las respuestas siguen en el HTML
  (`<details>/<summary>` sirve; ocultarlas con JS no).

### 3.6 Las anclas siguen existiendo

Son destino de enlaces desde la navbar y desde otras rutas. Podés reordenar, fusionar o
partir secciones, pero **cada `id` tiene que seguir en algún lugar de la página**:

```
#contacto   ← navbar "Cotizar", CTA del hero, enlaces desde otras páginas
#portfolio  ← botón secundario del hero
#servicios  #proceso  #quienes-somos  #preguntas
```

---

## 4. Estructura actual

Diez bandas de ancho completo apiladas. La columna interna es 1200px salvo donde se indica.

```
┌──────────────────────────────────────────────────────────┐
│ NAVBAR  sticky · #08110f 85% + blur · logo 56px          │  fuera de alcance
├──────────────────────────────────────────────────────────┤
│ HERO   degradado 155° #08110F→#0d2b26→#0F3D34            │
│  ┌───────────────────────┬────────────────────────┐      │
│  │ eyebrow               │  ╭──────────────────╮  │      │
│  │ H1 con 1 palabra teal │  │ ● ● ●  deploy.sh │  │      │
│  │ párrafo               │  │ $ xyra build     │  │      │
│  │ [btn] [btn ghost]     │  │ → compilando…    │  │      │
│  │ 100% │ 1:1 │ 48h      │  │ ✓ build 8.2s     │  │      │
│  └───────────────────────┴──╰──────────────────╯──┘      │
│  + 2 blobs difusos (blur 110–120px)      1.08fr / 0.92fr │
├──────────────────────────────────────────────────────────┤
│ TRUST   #08110f plano                                    │  1 línea
│  STACK · React Next.js Node TypeScript Tailwind Postgres │
├──────────────────────────────────────────────────────────┤
│ HOME INTRO   crema · columna 760px · alineado izquierda  │
│  eyebrow + H2 + 3 párrafos con enlaces internos          │  ~330 palabras
├──────────────────────────────────────────────────────────┤
│ SERVICIOS   crema · 1200px · encabezado CENTRADO         │
│  ┌─────┐┌─────┐┌─────┐   6 tarjetas blancas iguales      │
│  ┌─────┐┌─────┐┌─────┐   icono 48px + título + 2 líneas  │
├──────────────────────────────────────────────────────────┤
│ PROCESO   crema · 1200px · encabezado CENTRADO           │
│  ┌───┐┌───┐┌───┐┌───┐    4 tarjetas · mono 01 02 03 04   │
├──────────────────────────────────────────────────────────┤
│ PORTFOLIO   #08110f · 1200px · encabezado izquierda      │
│  ┌────────────┬──────────────────────┐   UN solo caso    │
│  │ texto+tags │  carrusel 1898×865   │   2fr / 3fr       │
├──────────────────────────────────────────────────────────┤
│ FAQ   crema · columna 760px · alineado izquierda         │
│  eyebrow + H2 + 5 pares pregunta/respuesta               │  ~400 palabras
├──────────────────────────────────────────────────────────┤
│ CTA   degradado 150° #0F766E→#0d5f56   (compartida, §3.3)│
│  ┌──────────────────┬──────────────────┐                 │
│  │ H2 + botones     │  formulario      │                 │
├──────────────────────────────────────────────────────────┤
│ FOOTER   #050c0a · logo+tagline+redes │ 3 columnas       │  fuera de alcance
└──────────────────────────────────────────────────────────┘
  + FAB de WhatsApp fijo abajo a la derecha, sobre todo lo anterior
```

### Qué está mal, concretamente

1. **El patrón "eyebrow + H2 centrado + tarjetas" se repite cuatro veces.** Servicios,
   Proceso, Intro y FAQ usan el mismo componente de encabezado con el mismo peso. Nada
   indica qué sección importa más, así que ninguna importa.
2. **La alternancia claro/oscuro no significa nada.** Oscuro, oscuro, claro, claro, claro,
   oscuro, claro, teal, oscuro. Es ritmo decorativo: el fondo no codifica ninguna
   diferencia real entre lo que contiene.
3. **El ancho de columna salta 1200 → 760 → 1200 → 760** sin ninguna señal visual que
   explique el cambio de medida. Se lee como dos páginas intercaladas.
4. **El hero es la respuesta de plantilla.** Eyebrow, H1 con una palabra en color, dos
   botones, tres números con divisores, blobs difusos y una tarjeta glassy con una terminal
   falsa. La terminal es `aria-hidden`, muestra un log inventado y no dice nada cierto
   sobre XyraCode: podría estar en la home de cualquier agencia del mundo.
5. **Los tres números del hero son promesas, no métricas** (100% código propio, 1:1
   comunicación, 48h propuesta), pero están tipografiados como si fueran resultados
   medidos. La forma miente sobre el contenido.
6. **El único activo fuerte está en la posición 7.** Hay *un* proyecto real, en producción,
   con capturas propias — y el layout que lo contiene está construido como una lista de
   muchos. Con `n = 1` se ve escaso; el diseño tiene que hacer que **uno bien contado valga
   más que seis inventados**.
7. **Seis servicios en tarjetas idénticas** de icono + título + dos líneas: mucho espacio,
   poca información, ninguna diferencia entre ellos.
8. **Los dos bloques de prosa se leen como muros de texto.** No sobran: les falta
   tratamiento tipográfico que invite a leerlos.

### 4.1 La estrategia que hay que abandonar

Los ocho puntos de arriba son síntomas. La causa es una sola decisión estructural, y es lo
que quiero cambiar:

> **Cada sección es un bloque de ancho completo con un color de fondo fijo, y los bloques se
> apilan alternando colores. El fondo es la única herramienta de separación de la página.**

Nueve franjas, cinco cambios de fondo, cero relación entre el color y lo que contiene. Por
qué no funciona:

- **El color no codifica nada.** Servicios y Proceso comparten fondo crema por vecindad, no
  porque tengan algo en común; Portfolio es oscuro y la FAQ clara sin que eso diga nada de
  ninguna de las dos. Si mañana se reordenan las secciones, los colores quedan iguales y
  siguen sin significar nada. Un recurso que sobrevive a cualquier reordenamiento no está
  informando: está decorando.
- **Todo pesa lo mismo.** Cuando cada bloque grita "acá empieza otra cosa" con la misma
  intensidad, ninguno puede señalar que *él* es el importante. Por eso el caso real y la
  franja de logos de stack tienen la misma presencia.
- **En móvil es peor.** A 390px todo es una sola columna, así que la única estructura que
  queda es la tira de colores. La página se scrollea como un semáforo, y lo que el visitante
  percibe es "cuántas franjas faltan", no "de qué me están hablando".
- **Los bordes son duros y arbitrarios.** Cada corte es un `background-color` de borde a
  borde. Nada atraviesa, nada se solapa, nada se continúa. Es una pila de diapositivas
  pegadas, no una página.

**Qué te estoy pidiendo:** que la separación y la jerarquía salgan de otro lado. Cuáles
herramientas usás es tu decisión y es el corazón del encargo — espacio, escala tipográfica,
retícula, superficies que se solapan o rompen el borde, contenido que sangra de una sección
a la siguiente, un fondo que evoluciona en vez de conmutar, densidad variable, ritmo
vertical, o algo que no está en esta lista. No te estoy pidiendo "todo claro" ni "todo
oscuro": te estoy pidiendo que el fondo deje de ser el que hace el trabajo.

**Tres cosas que no cuentan como resolverlo:**

1. **Reordenar las mismas franjas.** Si el resultado sigue siendo N bloques de color plano
   en otro orden, no cambió la estrategia, cambió la lista.
2. **Repintarlas.** Cambiar el crema por otro claro, o meter un degradado donde había un
   plano, es la misma decisión con otros valores.
3. **Apoyarse en lo de siempre.** La home ya usa degradados, blobs con blur de 110px,
   glassmorphism y sombras difusas como muleta. Si la propuesta nueva se apoya otra vez en
   eso, tampoco cambió nada.

Si al final alguna sección sigue siendo un bloque de color pleno, que sea porque **gana algo
concreto** siéndolo, y decilo en el README. Una excepción justificada está bien; nueve son
la estrategia de nuevo.

---

## 5. Lo que la home tiene que lograr

En orden de prioridad, para que tu propuesta se pueda evaluar contra algo:

1. **Que en los primeros 5 segundos, en un teléfono, quede claro qué se vende y a quién.**
2. **Que el diferencial se vea, no se afirme.** "Código propio, el repo queda a tu nombre,
   hablás con quien programa" es material de diseño, no una bala de una lista. Ese es el
   mundo del que tienen que salir las decisiones formales.
3. **Que el proyecto real sea la prueba**, y que ocupe el lugar que merece una prueba.
4. **Que llegar a WhatsApp o al formulario sea trivial desde cualquier punto de la página.**
5. **Que la prosa larga se lea**, sin dejar de ser prosa larga.

Del hero: abrí con lo más característico de este negocio, en la forma que corresponda —
titular, demostración, dato, momento interactivo. La terminal falsa es justamente la
elección genérica; si ponés algo en ese lugar, que sea cierto.

## 6. Restricciones técnicas

El diseño se recrea en **Next.js 16 (App Router) + Tailwind CSS v4 + TypeScript**, con
componentes de servidor por defecto.

- **Mobile-first, obligatorio.** Diseñá 390px primero y después desktop. El breakpoint real
  del sitio es `md` (768px); casi todo pasa de una columna a dos o más ahí.
- **La home es estática y se prerenderiza.** No hay estado de servidor.
- **Iconos: `lucide-react`**, ya es dependencia. No introduzcas otra familia.
- **Motion existente**: entrada `fade-in + slide-up 20px`, 0.55s ease-out, escalonada
  50–60ms entre tarjetas, disparada por `IntersectionObserver` una sola vez, con
  `prefers-reduced-motion` respetado y un `<noscript>` que muestra todo. Podés proponer
  otra cosa **para la home**, pero `Reveal` y la clase `.reveal` son compartidas (§3.2):
  si tu motion es distinto, va como CSS con alcance a la home, no reescribiendo `.reveal`.
- **El hero es el LCP.** No metas imágenes pesadas ni fuentes extra arriba del pliegue sin
  decirlo.
- **El FAB de WhatsApp es fijo abajo a la derecha** y no se va. En 390px se come una
  esquina: tenelo en cuenta al ubicar cualquier acción en esa zona.
- **Bug abierto**: la navbar sticky mide ~85px pero `scroll-padding-top` está en 72px, así
  que al navegar por anclas el título queda 13px debajo de la barra. Como la navbar está
  fuera de alcance, alcanza con que digas el valor correcto.

## 7. Contrato de datos: lo que existe de verdad

El diseño no puede pedir campos que no hay. Esto es todo lo que la home puede mostrar:

```ts
STATS      3 items  { value: "100%" | "1:1" | "48h", label: string }
STACK      6 strings  React · Next.js · Node · TypeScript · Tailwind · PostgreSQL
SERVICES   6 items  { icon: LucideIcon, title: string, desc: string }  // desc ≈ 60–70 car.
STEPS      4 items  { title: string, desc: string }                    // es una secuencia real
HOME_INTRO 3 párrafos con enlaces inline
HOME_FAQ   5 items  { q: string, a: string | Inline[] }
PROJECTS   1 item   { title, type, description, role, status, tags[5],
                      images[4] (1898×865), href, caseStudyHref, features[3] }
```

Sobre `PROJECTS`: **hay uno solo y van a ser pocos.** Diseñá para `n = 1` y mostrá cómo se
comporta con `n = 3`. Un grid pensado para nueve casos es un grid vacío.

Las capturas son **1898×865 (≈2.2:1) y se muestran completas, sin recortar**: son pantallas
de una app y recortarlas las rompe. Si tu layout necesita otra proporción, decilo — implica
volver a capturar.

Assets disponibles en `/public`:

```
/assets/brand/logo-nav.png · wordmark.png · mark.png (+ variantes claro/oscuro)
/assets/projects/vuelo-carmesi/{principal,2,3,4}.png   1898×865
/assets/team/founder.png                                foto del fundador
/assets/certificates/henry.png                          certificado verificable
```

**No hay fotos de oficina, de equipo ni de clientes.** Si tu propuesta necesita imágenes
que no están ahí, marcalas como slot punteado con proporción y tamaño, y decí qué habría
que producir.

## 8. Estados y casos borde que no podés omitir

1. **390px**: la vista real de la mayoría de visitantes. Cada sección, no solo el hero.
2. **`PROJECTS` con un solo caso** — el estado real de hoy.
3. **Un servicio con título de dos líneas** dentro de su tarjeta.
4. **Sin JavaScript**: todo el contenido visible.
5. **`prefers-reduced-motion: reduce`**: sin animaciones de entrada, sin scroll suave.

*(El menú móvil y los estados del formulario pertenecen a componentes compartidos: no los
diseñes, solo no los rompas.)*

## 9. Piso de calidad, sin anunciarlo

- Contraste AA en todo el texto, incluidos los grises sobre oscuro y los teal sobre teal.
- Foco de teclado visible en cada elemento interactivo (hoy: `outline-2 offset-4 teal-300`).
- Un solo `<h1>`, jerarquía de encabezados sin saltos, secciones con `aria-labelledby`.
- Áreas táctiles de 44px como mínimo en móvil.

## 10. Una sola apuesta

Gastá la audacia en un lugar. Elegí **el** elemento por el que esta home se va a recordar,
hacelo bien, y mantené todo lo demás disciplinado y callado. Antes de entregar, sacá un
accesorio.

Decí explícitamente en el README cuál es esa apuesta y por qué es la correcta para *este*
negocio y no para una agencia cualquiera.

## 11. Formato de entrega

Igual que `handoff/design_handoff_xyracode_landing/` y `handoff/design_handoff_nosotros/`:

- Un **`.dc.html`** con las pantallas lado a lado, cada una con su `data-screen-label`:
  **móvil 390px y desktop** de la home completa, más los estados de §8. La vista de 390px
  tiene que ser **la página entera de arriba abajo**, no secciones sueltas: es la única
  forma de ver si el problema de §4.1 quedó resuelto o solo repintado.
- Un **`README.md`** con:
  - la fidelidad de lo entregado;
  - **cómo se separan y jerarquizan las secciones ahora que el fondo dejó de hacer ese
    trabajo** (§4.1). Nombrá las herramientas que reemplazan al bloque de color, y si alguna
    sección sigue siendo un fondo pleno, qué gana siéndolo. Es lo primero que voy a leer;
  - **una tabla de impacto**: por cada cambio propuesto, si es *home-exclusivo* (§3.1),
    *composición desde el llamador*, *variante nueva* o *toca algo compartido* (§3.2). Este
    es el entregable que decide si el rediseño se puede implementar sin arrastrar el resto
    del sitio, así que no lo dejes implícito;
  - **el orden de secciones propuesto y la razón de cada movimiento**;
  - la decisión de §3.3 sobre `Cta`, con su justificación;
  - cuál es la apuesta de §10 y por qué;
  - la escala tipográfica final, espaciados y radios, como tokens **con prefijo propio**;
  - qué pasa con `Card` y `SectionHeading`: sobreviven, mutan o desaparecen;
  - el valor de `scroll-padding-top` que resuelve §6;
  - los slots de assets que haya que producir, con proporción y tamaño;
  - qué decisiones tomaste que **contradicen** este brief, si las hay, y por qué.
- **Alta fidelidad de layout**: estructura, jerarquía, espaciados y tipografía finales. Usá
  el copy real de §7 — está todo en `lib/content/`. Sin imágenes raster: las capturas del
  proyecto van como recuadro punteado con la proporción 1898×865 marcada.
