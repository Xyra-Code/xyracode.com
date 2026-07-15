import type { Block } from "./blocks";

export type BlogPost = {
  slug: string;
  seo: { title: string; description: string };
  /** ISO 8601; alimenta sitemap y dateModified. */
  lastModified: string;
  /** Categoría (chip) — p.ej. "Guía". */
  category: string;
  /** Tiempo de lectura visible — p.ej. "~7 min". */
  readingTime: string;
  /** Fecha de publicación en ISO (JSON-LD datePublished). */
  publishedISO: string;
  /** Fecha de publicación visible — p.ej. "13 de julio de 2026". */
  publishedLabel: string;
  /** Título visible (H1), distinto del seo.title. */
  title: string;
  /** Bajada / resumen (1-2 frases). También usado como resumen en el índice. */
  excerpt: string;
  /** Portada raster (slot 4B). Opcional: si falta, se pinta un fondo de marca. */
  cover?: { src: string; alt: string };
  /** Cuerpo del artículo. */
  body: Block[];
};

export const BLOG_POSTS: BlogPost[] = [
  {
    slug: "cuanto-cuesta-una-web-colombia-2026",
    seo: {
      title: "¿Cuánto Cuesta una Web en Colombia 2026? Guía y Precios | XyraCode",
      description:
        "Precios reales de páginas web en Colombia 2026: landing, sitios corporativos y tiendas online. Factores, rangos estimados y cómo elegir sin equivocarte.",
    },
    lastModified: "2026-07-13",
    category: "Guía",
    readingTime: "~7 min",
    publishedISO: "2026-07-13",
    publishedLabel: "13 de julio de 2026",
    title: "¿Cuánto cuesta una página web en Colombia en 2026?",
    excerpt:
      "Rangos de precios reales del mercado colombiano, qué factores mueven el costo y cómo evitar pagar de más (o de menos).",
    // cover: pendiente (slot raster 4B); dejar sin definir hasta tener la imagen.
    body: [
      { kind: "h2", text: "La respuesta honesta: depende, pero aquí tienes rangos reales" },
      {
        kind: "p",
        text:
          "Si buscas cuánto cuesta una página web en Colombia, seguramente ya te topaste con dos extremos: anuncios de \"tu web desde $99.000\" y cotizaciones de varios millones de pesos por lo que parece el mismo sitio. Ambos pueden ser legítimos, porque \"página web\" describe cosas muy distintas: desde una plantilla armada en una tarde hasta una plataforma construida a medida durante semanas.",
      },
      {
        kind: "p",
        text:
          "En esta guía te damos rangos estimados del mercado colombiano para 2026, explicamos qué factores mueven el precio, cómo elegir sin que te vendan humo y los errores más comunes que terminan costando el doble. Los valores que verás son rangos de referencia del mercado, no cotizaciones cerradas: el precio real siempre depende de tu proyecto puntual.",
      },
      { kind: "h2", text: "Rangos de precios estimados en Colombia 2026" },
      {
        kind: "p",
        text:
          "Estos son rangos aproximados que se ven en el mercado colombiano en 2026. Varían según el proveedor (freelancer, agencia pequeña o agencia grande), la ciudad y el nivel de personalización. Tómalos como orden de magnitud, no como tarifa fija.",
      },
      {
        kind: "ul",
        items: [
          "Landing page (una sola página): entre $800.000 y $3.000.000 aproximadamente. Una página con tu propuesta, servicios y contacto, pensada para convertir. El precio sube con diseño a medida, animaciones y buen SEO técnico.",
          "Sitio web corporativo (varias secciones): entre $2.500.000 y $10.000.000 aproximadamente. Home, servicios, nosotros, blog y contacto, con diseño propio y optimización. El rango es amplio porque depende de cuántas páginas, cuánto diseño a medida y qué integraciones lleve.",
          "Tienda online / e-commerce: entre $5.000.000 y $20.000.000 o más. Catálogo, carrito, pasarela de pagos, gestión de pedidos e inventario y panel de administración. El tamaño del catálogo y las reglas del negocio marcan la diferencia.",
          "Aplicación web o plataforma a medida: desde $10.000.000 en adelante, fácilmente más según el alcance. Aquí no se paga \"una web\", se paga software que opera tu negocio, con usuarios, roles, base de datos y lógica particular.",
          "Plantillas y creadores tipo autoservicio (Wix, Shopify, WordPress con tema): desde muy económico, con costos mensuales de suscripción. Sirven para validar o empezar, con la limitación de amoldarte a lo que la plataforma permite.",
        ],
      },
      {
        kind: "p",
        text:
          "A estos valores casi siempre se suman costos recurrentes que conviene tener claros desde el principio (más abajo los detallamos).",
      },
      { kind: "h2", text: "Qué factores mueven el precio" },
      {
        kind: "p",
        text:
          "Dos webs que \"se ven parecidas\" pueden costar muy distinto. Estos son los factores que realmente pesan:",
      },
      {
        kind: "ul",
        items: [
          "Diseño a medida vs. plantilla. Una plantilla adaptada es más barata y rápida; un diseño propio, alineado a tu marca y pensado para convertir, cuesta más porque hay trabajo real de diseño detrás.",
          "Cantidad de páginas y contenido. No es lo mismo una landing que un sitio de veinte páginas. Y el contenido (textos, fotos) también cuesta: si el proveedor lo redacta, se cobra.",
          "Funcionalidades. Formularios simples son económicos; reservas, pagos, login de usuarios, paneles de administración o integraciones con otras herramientas suben el precio porque son desarrollo, no maquetación.",
          "SEO técnico y rendimiento. Un sitio construido para cargar rápido y ser indexable por Google requiere más trabajo que uno que solo \"se ve bien\". Ese trabajo se paga y se recupera en visibilidad.",
          "Quién lo hace. Un freelancer suele ser más económico que una agencia grande con varias personas. Lo importante no es el título, sino el resultado, la comunicación y a quién le reclamas si algo falla.",
          "A medida vs. software empaquetado. El desarrollo a medida cuesta más de entrada pero te da control total y cero comisiones de plataforma; las plataformas cerradas cuestan menos al inicio pero cobran mensualidad y te limitan.",
        ],
      },
      { kind: "h2", text: "Los costos recurrentes que casi nadie te menciona" },
      {
        kind: "p",
        text:
          "El precio de construir la web es solo una parte. Para que funcione hay costos que se repiten cada año, y conviene presupuestarlos:",
      },
      {
        kind: "ul",
        items: [
          "Dominio (tu nombre.com): un costo anual bajo, del orden de decenas a cientos de miles de pesos según la extensión.",
          "Hosting o infraestructura: desde planes económicos mensuales hasta infraestructura moderna. Muchos sitios modernos corren en servicios con capa gratuita generosa, pero un e-commerce con tráfico real sí tiene costo.",
          "Certificado de seguridad (HTTPS): hoy suele venir incluido, pero verifícalo.",
          "Mantenimiento y soporte: actualizaciones, respaldos, mejoras y arreglos. Puede ser por horas o un plan mensual.",
          "Suscripciones de plataformas o pasarelas de pago: si usas Shopify, un CRM o una pasarela, cada una tiene su costo o comisión por transacción.",
        ],
      },
      {
        kind: "p",
        text: "Una cotización seria te dice qué es pago único y qué es recurrente. Si no lo aclara, pregúntalo antes de firmar.",
      },
      { kind: "h2", text: "Cómo elegir sin equivocarte" },
      {
        kind: "p",
        text:
          "Elegir proveedor no es elegir el más barato ni el más caro, es elegir el que entiende tu negocio y te deja en buena posición para crecer. Algunas señales de una buena decisión:",
      },
      {
        kind: "ul",
        items: [
          "Te preguntan por tu negocio antes de darte un precio. Quien cotiza sin entender qué necesitas, está adivinando.",
          "La cotización detalla el alcance. Qué páginas, qué funciones, qué entregables, qué tiempos y qué queda por fuera. Un precio suelto sin alcance es una trampa esperando a pasar.",
          "El código y los accesos quedan a tu nombre. Repositorio, dominio, hosting y cuentas deben ser tuyos. Si el proveedor los retiene, quedas de rehén.",
          "Te explican en tu idioma. Un buen proveedor traduce lo técnico a decisiones de negocio, no te llena de jerga para justificar el precio.",
          "Miras trabajos anteriores. Pide ejemplos reales y, si puedes, escribe a un cliente anterior.",
          "Hay alguien responsable después del lanzamiento. Una web no termina el día que sale; pregunta cómo es el soporte.",
        ],
      },
      { kind: "h2", text: "Errores comunes que terminan costando más" },
      {
        kind: "ul",
        items: [
          "Elegir por el precio más bajo. La web de $99.000 suele ser una plantilla genérica, lenta y sin SEO, que toca rehacer en un año. Lo barato sale caro.",
          "Pagar por funciones que no necesitas. No todo negocio requiere un desarrollo a medida enorme. A veces una solución sencilla o una herramienta existente resuelve mejor y por menos. Un buen aliado te lo dice.",
          "Olvidar los costos recurrentes. Presupuestar solo la construcción y llevarte la sorpresa del hosting, el dominio y el mantenimiento.",
          "No pedir el código ni los accesos. Descubrir, cuando quieres cambiar de proveedor, que no eres dueño de tu propia web.",
          "Ignorar la velocidad y el SEO. Un sitio bonito que carga lento y no aparece en Google no cumple su trabajo, que es traerte clientes.",
          "No definir el alcance. Sin un alcance claro, el proyecto se estira, cambian las expectativas y el precio final no se parece al inicial.",
        ],
      },
      { kind: "h2", text: "Entonces, ¿cuánto deberías invertir?" },
      {
        kind: "p",
        text:
          "Piensa en tu web como una inversión, no como un gasto. La pregunta no es \"cuál es la más barata\", sino \"cuánto me puede traer esta web y qué necesito para lograrlo\". Un negocio que valida una idea puede empezar con algo sencillo; uno que ya vende y quiere escalar suele justificar una inversión mayor en un desarrollo a medida que rinda por años.",
      },
      {
        kind: "p",
        text:
          "Lo importante es tener una cotización clara, con alcance definido, costos recurrentes explícitos y un aliado que te diga la verdad, aunque a veces esa verdad sea \"esto lo resuelves con algo más simple\".",
      },
      { kind: "h2", text: "Preguntas frecuentes" },
      { kind: "h3", text: "¿Cuál es el precio mínimo de una página web en Colombia?" },
      {
        kind: "p",
        text:
          "Puedes encontrar plantillas y creadores por muy poco, incluso gratis con suscripción mensual. Una landing profesional a medida arranca en el orden del millón de pesos. El mínimo depende de si buscas algo genérico o algo hecho para tu negocio.",
      },
      { kind: "h3", text: "¿Es mejor un freelancer o una agencia?" },
      {
        kind: "p",
        text:
          "Depende de tu proyecto y presupuesto. Un freelancer o estudio pequeño suele dar mejor precio y trato directo; una agencia grande, más músculo para proyectos complejos. Lo clave es la comunicación, el resultado y que el código quede a tu nombre.",
      },
      { kind: "h3", text: "¿Cuánto tarda en estar lista una web?" },
      {
        kind: "p",
        text:
          "Una landing suele tomar de 2 a 3 semanas; un sitio corporativo, de 4 a 6; una tienda o app a medida, varias semanas o meses según el alcance.",
      },
      { kind: "h3", text: "¿Por qué dos cotizaciones por \"lo mismo\" son tan distintas?" },
      {
        kind: "p",
        text:
          "Porque casi nunca es lo mismo. Cambia el diseño (plantilla vs. a medida), el SEO, la velocidad, las funciones, quién redacta el contenido y quién responde después del lanzamiento. Compara alcances, no solo precios.",
      },
      { kind: "h3", text: "¿Vale la pena pagar por SEO desde el inicio?" },
      {
        kind: "p",
        text:
          "Sí, al menos el SEO técnico de base. Construir sin él significa rehacer trabajo después. Posicionar por palabras competidas toma tiempo y contenido, pero salir con los cimientos correctos es mucho más barato que corregirlos luego.",
      },
      { kind: "h2", text: "¿Quieres una cotización clara para tu caso?" },
      {
        kind: "p",
        text:
          "En XyraCode te damos una propuesta con alcance, tiempos y precio en menos de 48 horas, sin jerga y sin venderte lo que no necesitas. Cuéntanos tu idea y te decimos con honestidad cuál es el mejor camino para tu presupuesto.",
      },
    ],
  },
];
