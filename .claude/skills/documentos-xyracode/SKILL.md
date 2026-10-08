---
name: documentos-xyracode
description: Use when creating any client-facing business document under this project (XyraCode) to convert to PDF — cotización/propuesta comercial, contrato de servicios, cuenta de cobro/factura, acta de entrega, plan de implementación por fases, informe, or a new document type. Triggers: "cotización", "propuesta", "contrato", "cuenta de cobro", "factura", "acta de entrega", "plan por fases", "genera un documento para [cliente]".
---

# Documentos XyraCode

Genera documentos comerciales/legales como HTML sobrio con la identidad de XyraCode,
que se convierten a un PDF A4 autónomo (marca y logo incrustados; sin dependencias
externas).

**Regla de oro:** no empieces desde cero. Copia la plantilla del tipo de documento
desde `plantillas/`, edita el contenido y genera el PDF con el script. Todo lo visual
(colores, fuentes, portada, encabezado/pie, tablas, tarjetas, notas) vive en
`base.css` y se inyecta al generar.

**Puerta de aprobación (obligatoria):** el PDF **no se genera hasta que el usuario
apruebe el contenido**. Primero se entrega el HTML revisable (`--solo-html`) y se
presenta el contenido de las secciones clave en el chat; solo con su aprobación
explícita se imprime el PDF. Estos documentos van a un cliente y el PDF es el
artefacto que se envía: un valor, un alcance o una cláusula equivocada firmada
cuesta mucho más que una ronda de revisión.

## Arquitectura

```
plantillas/
  _documento-base.html   ← esqueleto para crear un tipo NUEVO
  cotizacion.html        ← propuesta comercial (portada + 7 secciones)
  contrato.html          ← contrato de prestación de servicios (4 págs, cláusulas + firmas)
  cuenta-de-cobro.html   ← cuenta de cobro / factura (1 pág, ítems + totales + datos de pago)
  acta-entrega.html      ← entrega y cierre (entregables, garantía, aceptación firmada)
  plan-fases.html        ← implementación por fases (prioridades + valor por fase)
  informe-tecnico.html   ← informe técnico denso (matriz de estado, modelo de datos,
                            máquinas de estado, estimación por bloques, preguntas al revisor)
base.css                 ← design-system compartido (editar aquí = editar TODOS los docs)
scripts/generar-pdf.py   ← inyecta base.css + logo y genera el PDF A4 verificado
```

Cada plantilla trae dos marcadores que el script reemplaza:
`/* __BASE_CSS__ */` (dentro de `<style>`) y `__LOGO_DATA__` (en los `<img>`).

## Dónde viven los documentos

**Todo lo generado va a `documentos/<cliente>/`** (HTML editable + PDF final), una carpeta
por cliente en kebab-case: `documentos/wg-soluciones/`, `documentos/morena-roja/`. Si la
carpeta del cliente no existe, créala. Lo que no pertenece a ningún cliente —calculadoras,
libros de tarifas, material reutilizable— va a `documentos/_comun/`.

`documentos/` está en `.gitignore`: son documentos de cliente, no código del sitio.
Nunca dejes documentos sueltos en la raíz del proyecto **ni en la raíz de `documentos/`**.

## Flujo

1. **Elige y copia** la plantilla a la carpeta del cliente:
   `plantillas/contrato.html` → `documentos/<cliente>/contrato-<cliente>.html`.
2. **Edita el contenido.** Reemplaza los marcadores tipo `[Nombre de la empresa]`,
   `[valor]`, `[plazo]`. Deja `/* __BASE_CSS__ */` y `__LOGO_DATA__` intactos.
3. **Deja el HTML revisable, sin PDF:**
   ```bash
   python .claude/skills/documentos-xyracode/scripts/generar-pdf.py documentos/<cliente>/contrato-<cliente>.html --solo-html
   ```
   Inyecta la base y el logo y se detiene. El HTML ya se ve con la marca completa al
   abrirlo en el navegador.
4. **Presenta y espera aprobación.** Muestra en el chat el contenido de las secciones
   que el usuario debe validar (valor, alcance, valor agregado, cláusulas, costos) y
   **espera su aprobación explícita**. No generes el PDF en este paso, aunque el
   documento parezca terminado.
5. **Genera el PDF, ya aprobado:**
   ```bash
   python .claude/skills/documentos-xyracode/scripts/generar-pdf.py documentos/<cliente>/contrato-<cliente>.html
   ```
   Las inyecciones ya hechas se saltan (son idempotentes), imprime a PDF A4 con fondos,
   y **avisa si el nº de páginas del PDF no coincide con las hojas
   `<section class="page">`** (señal de que una sección desbordó su A4).
6. **Abre y revisa el PDF.** Si Chrome no puede escribir en la carpeta del proyecto
   (error 0x5 "Acceso denegado"), genera en el scratchpad y copia el PDF con `cp`.

## Crear un tipo de documento NUEVO

1. Copia `plantillas/_documento-base.html` → `plantillas/<tipo>.html`.
2. Ajusta portada (o quítala para docs de 1 hoja como la cuenta de cobro) y duplica
   `<section class="page">` por cada hoja. Numera el `.runfoot`.
3. Usa los componentes de `base.css` (ver abajo). No inventes CSS de marca; si un
   documento necesita un estilo propio, agrégalo en su `<style>` **después** del
   marcador de base, como hacen `cuenta-de-cobro.html` y `plan-fases.html`.
4. Añade una fila a la tabla de arquitectura de este SKILL.md.

## Componentes de `base.css` (reutilizables)

| Componente | Clases |
|-----------|--------|
| Hoja A4 + impresión | `.page`, `.page.cover`, `.page-pad`, `@page A4` |
| Portada | `.cover-top/-logo/-tag/-mid/-kicker/-title/-sub/-rule/-meta/-contact` |
| Encabezado / pie corridos | `.runhead` (img+span), `.runfoot` (span + `.mono .dot`) |
| Sección numerada | `.section`, `.sec-head`, `.sec-num`, `.sec-title` |
| Bloque de alcance | `.block`, `.block-head`, `.block-body`, `.grid2/.grid3`, `.feat h5`, `ul.checks` |
| Tarjetas "por qué" | `.why-grid`, `.why-card` (`.ic`, h5, p) |
| Lista de valor | `.value-list` (2 col) con `li > .tick + b` |
| Tabla de valores | `.invoice table` (`th/td.r`, `.desc`, `.total-row`, `.price`, `.price-lg`) |
| Pago | `.pay`, `.pay-card` (`.pct` + `.amt` + `.txt`) |
| Listas | `ul.plain`, `ul.plain.warn` (ámbar) |
| Nota / caveat | `.callout` (borde ámbar con `style="border-left-color:#d97706"`) |
| Chips | `.chips`, `.chip` |
| Banda destacada | `.time-band` (`.big`, `.unit`) |
| Firmas | `.sign`, `.line b` |
| Cierre | `.cta-band` |

Tokens de marca (en `base.css`): teal `#0f766e`, emerald `#10b981`, mint `#5eead4`,
tinta `#0b1f1c`, crema `#f6fbfa`, oscuros `#08110f/#0d2b26/#0f3d34`, ámbar `#d97706`.
Fuentes: Plus Jakarta Sans (cuerpo) y JetBrains Mono (números/etiquetas). Logo:
`public/assets/brand/logo-horizontal.png`. Contacto: `contacto@xyracode.com` ·
`+57 310 390 9056` · Villavicencio (fuente `lib/content/contact.ts`).

## Convenciones de contenido

- **Trato formal (usted)** en todo documento y en los mensajes de acompañamiento.
- **Portada** con Cliente / Fecha / Elaborado por (XyraCode) + datos de contacto.
- **Coherencia beneficios ↔ "No incluye":** lo que va gratis por un período debe
  aparecer en "No incluye" con su continuación (renovación del dominio desde el 2º
  año, hosting back tras los meses incluidos). Nunca contradecir el valor agregado.
- **Escalabilidad: no la enumeres.** La nota ámbar que detallaba los costos futuros
  servicio por servicio se retiró (decisión del usuario, 2026-07-30): enumerar cobros
  hipotéticos sin cifras genera más ansiedad en el cliente que claridad. Basta la
  aclaración sobria de que los planes incluidos operan **hasta un tope** y que
  superarlo se cobra según las tarifas vigentes de cada proveedor. No decir "planes
  gratuitos"; di "sin costo" y aclara que son **permanentes**, no promociones.
- **Costos de operación con cifras** (decisión del usuario, 2026-10-06): el anexo de
  infraestructura lleva valores, como el Anexo A de `cotizacion.html`: precio en USD,
  equivalente aproximado en COP con la TRM y su fecha, y totales por etapa (al
  publicar, escenario probable, máximo previsible). **Verifica los precios vigentes
  de cada proveedor antes de escribirlos**; nunca los tomes de memoria ni de otra
  propuesta vieja.
- **Sin promesas sobre el tráfico.** No afirmar que el tráfico no genera cobro: aunque
  Cloudflare no mida ancho de banda, el egreso del API y el cómputo de la base de
  datos sí se facturan por uso. Es un absoluto que no se sostiene.
- **Tarjetas de pago** muestran porcentaje **y valor real en COP** (`.pct` + `.amt`).
- **Pasarela Wompi:** integración incluida; comisiones y cuenta de comercio, del cliente.

## Errores comunes

| Síntoma | Causa | Arreglo |
|---------|-------|---------|
| PDF con más páginas que hojas `.page` | Una sección desbordó su A4 | Listas a 2 columnas; reduce `.page-pad` y `.section { margin-top }` en su `<style>` |
| Fondos/colores no salen | No se imprimen fondos | Ya viene `print-color-adjust: exact` + headless; no uses el diálogo manual sin "Gráficos de fondo" |
| Chrome no escribe (0x5) | Permisos de la carpeta | Genera en scratchpad y copia con `cp` |
| Logo o estilos ausentes | Quedaron marcadores sin reemplazar | Corre el script (inyecta base + logo) antes de imprimir |
| Documento con tuteo | Texto informal | Reescribe a usted; revisa portada y cierre |
| `base.css` duplicada en cada corrida | El marcador de base quedó **literal dentro de `base.css`**, así que sobrevive a la inyección y el script lo vuelve a encontrar | Nunca escribas el marcador literal en `base.css` (ni en comentarios). Verifica con `grep -c` que el documento generado tenga **0 marcadores** |
| PDF con estilos duplicados tras aprobar | Se corrió el script dos veces con el bug anterior presente | Regenera el HTML desde la plantilla y vuelve a inyectar |

## Mensajes de acompañamiento (formal)

- **Envío:** ofrecer resolver dudas y ajustar el alcance; respetar su tiempo de decisión.
- **Ante "lo pensamos":** reafirmar que la propuesta es completa y ofrecer el
  `plan-fases.html` (priorizar lo esencial, distribuir la inversión), sin devaluar la
  propuesta original ni presionar.
