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

## Arquitectura

```
plantillas/
  _documento-base.html   ← esqueleto para crear un tipo NUEVO
  cotizacion.html        ← propuesta comercial (portada + 7 secciones)
  contrato.html          ← contrato de prestación de servicios (4 págs, cláusulas + firmas)
  cuenta-de-cobro.html   ← cuenta de cobro / factura (1 pág, ítems + totales + datos de pago)
  acta-entrega.html      ← entrega y cierre (entregables, garantía, aceptación firmada)
  plan-fases.html        ← implementación por fases (prioridades + valor por fase)
base.css                 ← design-system compartido (editar aquí = editar TODOS los docs)
scripts/generar-pdf.py   ← inyecta base.css + logo y genera el PDF A4 verificado
```

Cada plantilla trae dos marcadores que el script reemplaza:
`/* __BASE_CSS__ */` (dentro de `<style>`) y `__LOGO_DATA__` (en los `<img>`).

## Dónde viven los documentos

**Todo lo generado va a `documentos/` en la raíz del repo** (HTML editable + PDF final).
La carpeta está en `.gitignore`: son documentos de cliente, no código del sitio.
Nunca dejes documentos sueltos en la raíz del proyecto.

## Flujo

1. **Elige y copia** la plantilla a `documentos/`:
   `plantillas/contrato.html` → `documentos/contrato-<cliente>.html`.
2. **Edita el contenido.** Reemplaza los marcadores tipo `[Nombre de la empresa]`,
   `[valor]`, `[plazo]`. Deja `/* __BASE_CSS__ */` y `__LOGO_DATA__` intactos.
3. **Genera el PDF:**
   ```bash
   python .claude/skills/documentos-xyracode/scripts/generar-pdf.py documentos/contrato-<cliente>.html
   ```
   El script inyecta la base y el logo, imprime a PDF A4 con fondos, y **avisa si el
   nº de páginas del PDF no coincide con las hojas `<section class="page">`** (señal
   de que una sección desbordó su A4).
4. **Abre y revisa.** Si Chrome no puede escribir en la carpeta del proyecto
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
`+57 310 679 0518` · Villavicencio (fuente `lib/content/contact.ts`).

## Convenciones de contenido

- **Trato formal (usted)** en todo documento y en los mensajes de acompañamiento.
- **Portada** con Cliente / Fecha / Elaborado por (XyraCode) + datos de contacto.
- **Coherencia beneficios ↔ "No incluye":** lo que va gratis por un período debe
  aparecer en "No incluye" con su continuación (renovación del dominio desde el 2º
  año, hosting back tras los meses incluidos). Nunca contradecir el valor agregado.
- **Nota ámbar de escalabilidad** en cotizaciones: los servicios en la nube (front,
  DB, Cloudinary, correos) vienen incluidos **hasta un tope de recursos**; al
  superarlo pueden generar costos futuros según tráfico/consumo, asumidos por el
  cliente. No decir "planes gratuitos".
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

## Mensajes de acompañamiento (formal)

- **Envío:** ofrecer resolver dudas y ajustar el alcance; respetar su tiempo de decisión.
- **Ante "lo pensamos":** reafirmar que la propuesta es completa y ofrecer el
  `plan-fases.html` (priorizar lo esencial, distribuir la inversión), sin devaluar la
  propuesta original ni presionar.
