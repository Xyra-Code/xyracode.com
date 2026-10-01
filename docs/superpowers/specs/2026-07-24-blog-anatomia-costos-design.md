# Reenfocar la guía de precios: de rangos en pesos a anatomía del costo

**Fecha:** 2026-07-24
**Estado:** Aprobado, pendiente de plan de implementación
**Artículo afectado:** `/blog/cuanto-cuesta-una-web-colombia-2026`

## Problema

El único artículo del blog responde "¿cuánto cuesta una web?" con una lista de rangos en pesos por tipo de producto (landing $800.000–$3.000.000, e-commerce $5.000.000–$20.000.000, etc.). Eso genera dos problemas comerciales concretos:

1. **Ancla al producto, no al alcance.** El lector se auto-clasifica en el extremo bajo del rango antes de la primera conversación, y llega a negociar contra nuestro propio artículo. Un rango publicado se lee como tarifa, no como orden de magnitud, por más disclaimers que lleve.
2. **Las cifras espantan al segmento real.** Los rangos publicados están por encima de lo que la pyme local espera pagar. El artículo filtra hacia afuera leads que sí eran viables con un alcance más pequeño.

Hay además una incoherencia interna: en `lib/content/service-pages.ts:133` el sitio ya afirma *"el precio depende del alcance, no del tipo de proyecto"*, y el blog al que enlaza hace exactamente lo contrario — tabula precio **por** tipo de proyecto.

## Objetivo

Que el artículo siga respondiendo la intención de búsqueda comercial ("cuánto cuesta una web en Colombia") pero **cambiando el ancla**: en vez de decir cuánto vale cada producto, enseñar de qué está compuesto el costo — ítem por ítem, separando pago único de recurrente.

Meta de conversión: que el lead llegue preguntando *"¿cuáles de estos ítems necesito?"* en vez de *"¿por qué tan caro?"*.

## Decisiones tomadas

| Decisión | Elección | Razón |
|---|---|---|
| Slug | **Se mantiene** `cuanto-cuesta-una-web-colombia-2026` | Conserva el keyword comercial de mayor volumen. Cero redirects, cero riesgo SEO. |
| Cifras en pesos | **Solo en costos recurrentes** | Dominio, hosting, correo y comisiones de pasarela son públicos y verificables: dan credibilidad sin decir nada de nuestra tarifa. |
| Múltiplos relativos | **No** | Un "e-commerce ≈ 3–5× una landing" es una proporción que después habría que sostener al cotizar. El orden de magnitud lo transmite el conteo de ítems. |
| Artículo nuevo aparte | **No** | Una sola pieza, reenfocada. El cluster no necesita una segunda página sobre lo mismo. |

**Fuera de alcance:** crear artículos nuevos, rediseñar el listado `/blog`, cambiar la ilustración `PriceTagArt` de la tarjeta (una etiqueta de precio sigue representando bien un artículo sobre costos), y tocar los precios de las páginas de servicio.

## Identidad de la pieza

| Campo | Antes | Después |
|---|---|---|
| `slug` | `cuanto-cuesta-una-web-colombia-2026` | *(sin cambio)* |
| `title` (H1) | ¿Cuánto cuesta una página web en Colombia en 2026? | ¿Cuánto cuesta una página web en Colombia? Así se arma el precio |
| `seo.title` | ¿Cuánto Cuesta una Web en Colombia 2026? Guía y Precios \| XyraCode | ¿Cuánto cuesta una web en Colombia? Costos reales 2026 \| XyraCode |
| `seo.description` | Precios reales de páginas web en Colombia 2026: landing, sitios corporativos y tiendas online… | Qué se paga una sola vez y qué se paga cada mes en un proyecto web: dominio, hosting, integraciones, mantenimiento. La anatomía completa del costo. |
| `excerpt` | Rangos de precios reales del mercado colombiano… | El precio no depende del tipo de proyecto sino del alcance. Desglosamos ítem por ítem qué se paga una vez, qué se paga cada mes y qué aparece después. |
| `readingTime` | `~7 min` | `~12 min` (3.065 palabras) |
| `publishedISO` / `publishedLabel` | 2026-07-13 | *(sin cambio — es actualización, no republicación)* |
| `lastModified` | 2026-07-13 | `2026-07-24` |
| `category` | Guía | *(sin cambio)* |

El H1 conserva el keyword literal y añade la promesa que sí se cumple. Quien llega buscando un número se va sabiendo construir el suyo, en vez de irse con las manos vacías — que es lo que pasaría si se borraran las cifras sin reemplazar el ancla.

## Estructura del cuerpo

Doce secciones `h2`. El bloque 6 (la tabla) es el activo diferencial de la pieza.

### Bloque A — Reencuadre

**1. Dos cotizaciones por "lo mismo", con 5× de diferencia**
Abre en el problema real del lector, no en la respuesta. Ambas cotizaciones pueden ser honestas: describen alcances distintos con el mismo nombre.

**2. El precio depende del alcance, no del tipo de proyecto**
Tesis explícita. Anuncia el mapa: todo proyecto se paga en tres bloques — **construcción** (una vez), **operación** (cada mes o año) y **crecimiento** (opcional y variable).

**3. Los tres bloques de toda inversión web**
Define los tres antes de desglosarlos, para que el lector tenga dónde colgar cada ítem.

### Bloque B — El desglose (corazón de la pieza)

**4. Qué se paga una sola vez**
`ul` con: descubrimiento y arquitectura de información · diseño de interfaz · desarrollo · contenido (textos, fotos, video) · integraciones · SEO técnico de base · migración de contenido existente · capacitación y entrega de accesos.

**5. Qué se paga cada mes o cada año**
`ul` con: dominio (anual) · hosting o infraestructura · correo corporativo · licencias, temas y APIs de terceros · comisión de pasarela por transacción · mantenimiento y respaldos · contenido y SEO continuo.
Aquí van las cifras en pesos, y solo aquí.

**6. Todo el costo de un proyecto web, en una tabla**
Bloque `table` de 4 columnas: **Concepto · Único o recurrente · Quién lo asume · A nombre de quién queda**.

La cuarta columna es la que convierte: es donde el lector descubre que su proveedor actual tiene el dominio a nombre propio. Las 15 filas, agrupadas primero los ítems únicos y después los recurrentes para que la tabla se lea en el mismo orden que las secciones 4 y 5:

| Concepto | Único o recurrente | Quién lo asume | A nombre de quién queda |
|---|---|---|---|
| Descubrimiento y arquitectura | Único | Proyecto | Cliente |
| Diseño de interfaz | Único | Proyecto | Cliente |
| Desarrollo | Único | Proyecto | Cliente (repositorio) |
| Contenido (textos y fotos) | Único | Proyecto o cliente | Cliente |
| Integraciones | Único + posible mensual | Ambos | Cliente |
| SEO técnico de base | Único | Proyecto | Cliente |
| Migración y capacitación | Único | Proyecto | Cliente |
| Dominio | Anual | Cliente | Cliente |
| Hosting o infraestructura | Mensual o anual | Cliente | Cliente |
| Correo corporativo | Mensual por usuario | Cliente | Cliente |
| Certificado HTTPS | Incluido | — | — |
| Servicios de terceros | Mensual o anual | Cliente | Cliente |
| Pasarela de pagos | % por transacción | Cliente | Cliente |
| Mantenimiento y respaldos | Mensual o bolsa de horas | Cliente | — |
| Contenido y SEO continuo | Mensual | Cliente | Cliente |

El modelo de bloques ya soporta `table` (`lib/content/blocks.ts`, commit `1e8a961`). `head` y cada fila deben tener la misma longitud: 4.

### Bloque C — Lo que nadie le contó

**7. Los costos que aparecen después**
Saltos de plan al crecer el tráfico · comisiones por transacción que escalan con las ventas · migración forzada cuando la plataforma cambia de reglas · rehacer el sitio a los 18 meses porque no se construyó para crecer.

**8. Los 6 factores que mueven tu presupuesto**
Reemplazo directo de la vieja lista de rangos. Ninguno es un precio:

1. Cantidad de **plantillas únicas** (no de páginas: veinte páginas con la misma plantilla cuestan casi lo mismo que una)
2. Diseño a medida vs. tema adaptado
3. Número de integraciones con sistemas externos
4. Quién produce el contenido
5. Roles, estados y permisos del sistema (login, flujos, aprobaciones)
6. Plazo — la urgencia comprime el cronograma y encarece

**9. El cálculo que importa: el costo a 3 años**
El argumento comercial más fuerte de la pieza, y no requiere una sola cifra propia: lo barato es barato el mes 1; hay que comparar el mes 36. Cuando el lector suma las suscripciones que arrastra una plantilla, el pago único a medida deja de parecer caro **por deducción propia**, no porque se lo hayamos dicho.

### Bloque D — Acción

**10. Qué debe traer una cotización seria**
Checklist: alcance página por página · qué queda explícitamente por fuera · qué es único y qué recurrente · a nombre de quién quedan dominio, hosting y repositorio · tiempos y entregables · qué pasa después del lanzamiento.

**11. Preguntas frecuentes** (ver sección siguiente)

**12. CTA**
No "cotización en 48 horas" genérico, sino el filtro de honestidad: *te decimos cuáles de estos ítems sí necesitas y cuáles no*.

## FAQ

Salen las dos preguntas que solo existían para colgar cifras (*"¿cuál es el precio mínimo de una página web en Colombia?"* y *"¿es mejor un freelancer o una agencia?"* — esta última ya está cubierta en las páginas de servicio tras el commit `91f6101`). Quedan seis:

1. **¿Qué costos son de una sola vez y cuáles son para siempre?** — resumen ejecutable de la tabla, pensada para extracción por buscadores.
2. **¿Por qué dos cotizaciones por "lo mismo" son tan distintas?** — se conserva, es la más fuerte.
3. **¿Puedo empezar barato y mejorar después?** — sí, con la condición de que los cimientos permitan crecer sin rehacer.
4. **¿Qué pasa si dejo de pagar el mantenimiento?** — el sitio no se apaga, pero se degrada: sin actualizaciones, sin respaldos, sin quién responda.
5. **¿Por qué no publican una lista de precios?** — respondida de frente: *cotizar sin conocer el alcance es adivinar, y adivinar siempre le sale caro a alguien*. Esta convierte la ausencia de cifras en señal de seriedad en vez de evasiva.
6. **¿Cuánto tarda en estar lista una web?** — se conserva.

Formato obligatorio: cada pregunta es un `h3` seguido **inmediatamente** de un `p`. `faqLd` deriva el nodo de ahí y solo lee pares `h3` + `p` consecutivos.

## Datos estructurados

El artículo emite hoy `BlogPosting` + `BreadcrumbList`, pero no `FAQPage`, teniendo `faqLd` disponible en `lib/jsonld.ts`. Se añade al `@graph` de `app/blog/[slug]/page.tsx`:

```ts
...(faqLd(path, post.body) ?? []),
```

Se usa spread con fallback a array vacío porque `faqLd` devuelve `null` en artículos sin sección de FAQ, y el `@graph` no debe contener nulos.

**Expectativa realista:** desde 2023 Google reserva el rich result de FAQ a sitios de gobierno y salud, así que esto **no** pintará acordeones en la SERP. El valor está en que buscadores y respuestas generativas extraigan el par pregunta/respuesta limpio.

## Enlaces salientes del artículo

El artículo no enlazaba a ninguna página de servicio. Se añaden dos enlaces contextuales dentro de bloques `p` (los `ul` solo aceptan strings planos, así que no admiten enlaces):

| Sección | Anchor | Destino |
|---|---|---|
| 2 — El precio depende del alcance | tiendas online | `/servicios/ecommerce` |
| 8 — Los seis factores | una aplicación a medida | `/servicios/apps-a-medida` |

El segundo cierra el punto de "roles, estados y permisos": si el proyecto cae ahí, deja de ser una web y el lector debe llegar a la página correcta.

## Enlaces internos a corregir

Cuatro anchors en `lib/content/service-pages.ts` prometen rangos que el artículo dejará de dar. El anchor text pesa para SEO, así que deben apuntar al nuevo ángulo:

| Línea | Anchor actual | Anchor nuevo |
|---|---|---|
| 133 | nuestra guía de cuánto cuesta una página web en Colombia | nuestra guía de qué se paga una vez y qué cada mes en un proyecto web |
| 330 | una guía completa con los precios de páginas web en Colombia | una guía completa de los costos de una página web en Colombia |
| 745 | nuestra guía de precios del mercado colombiano 2026 | nuestra guía de costos de un proyecto web en Colombia |
| 894 | una guía con rangos reales de cuánto cuesta una web en Colombia | una guía con el desglose de costos de una web en Colombia |

El texto que rodea cada anchor también menciona "rangos" o "precios reales" y debe ajustarse en la misma edición. El comentario de `GUIA_PRECIOS` en la línea 43 dice "artículo de precios"; conviene actualizarlo a "artículo de costos".

## Archivos afectados

| Archivo | Cambio |
|---|---|
| `lib/content/blog.ts` | Metadata (`title`, `seo`, `excerpt`, `readingTime`, `lastModified`) y `body` completo reescrito |
| `app/blog/[slug]/page.tsx` | Importar `faqLd` y añadirlo al `@graph` |
| `lib/content/service-pages.ts` | 4 anchors + texto circundante + comentario de la constante |
| `contenido/borradores/blog-cuanto-cuesta-una-web-colombia-2026.md` | Sincronizar el borrador con el artículo publicado |

No se tocan componentes: `ArticleBody` ya renderiza todos los `kind` necesarios (`h2`, `h3`, `p`, `ul`, `table`).

## Criterios de aceptación

1. El artículo no contiene ninguna cifra en pesos referida a construcción o desarrollo.
2. Las únicas cifras en pesos corresponden a ítems recurrentes públicos y verificables (dominio, hosting, correo, comisiones de pasarela).
3. La tabla maestra renderiza con `head` y todas las filas de longitud 4.
4. El `@graph` del artículo incluye un nodo `FAQPage` con 6 entradas, derivadas del cuerpo visible.
5. Ningún enlace interno promete "rangos" o "precios" que el artículo no entrega.
6. El slug no cambia y no se requiere ningún redirect.
7. `npm run build`, `npm run lint` y `npm test` pasan sin errores nuevos.
