import type { Block, Inline } from "./blocks";

export type BlogPost = {
  slug: string;
  seo: { title: string; description: string };
  /**
   * ISO 8601 con hora y offset; alimenta sitemap y dateModified.
   * Colombia es UTC-05:00 todo el año (sin horario de verano), así que el
   * offset es siempre `-05:00`. Sin él, Google interpreta la fecha en una zona
   * que elige por su cuenta y la señal de frescura queda a la deriva.
   * Convención: las ediciones se sellan a las 18:00 (cierre de jornada) para
   * que, si un post se publica y se edita el mismo día, dateModified nunca
   * quede antes que datePublished.
   */
  lastModified: string;
  /** Categoría (chip) — p.ej. "Guía". */
  category: string;
  /** Tiempo de lectura visible — p.ej. "~7 min". */
  readingTime: string;
  /**
   * ISO 8601 con hora y offset (JSON-LD datePublished). Convención: 09:00
   * -05:00, dentro de la jornada declarada en openingHoursSpecification.
   */
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

/** SEO de la página de listado /blog. */
export const BLOG_SEO = {
  title: "Blog de desarrollo web y software | XyraCode",
  description:
    "Guías y comparativas sobre desarrollo web, apps y e-commerce en Colombia: precios, tecnologías y decisiones que importan para tu proyecto.",
} as const;

/**
 * Prosa propia del hub. Un listado de tarjetas no explica por qué existe el
 * blog ni para quién está escrito; estos párrafos sí, y de paso reparten
 * enlaces hacia las páginas de servicio desde una URL de hub.
 */
export const BLOG_INTRO = {
  paragraphs: [
    "Escribimos para la persona que tiene que tomar una decisión técnica sin ser técnica: elegir entre dos cotizaciones que se llevan por un factor de cinco, entender qué se paga una vez y qué cada mes, o decidir si lo que necesita es una web o realmente una aplicación.",
    [
      "No son artículos de relleno ni listas de \"10 tendencias\". Cada guía sale de conversaciones reales con clientes y de cosas que hemos visto salir mal. Si después de leer quieres ver cómo aterrizamos eso en un proyecto, están las páginas de ",
      { text: "servicios", href: "/servicios" },
      " y los ",
      { text: "casos de estudio", href: "/proyectos" },
      ".",
    ],
  ] satisfies (string | Inline[])[],
} as const;

export const BLOG_POSTS: BlogPost[] = [
  {
    slug: "cuanto-cuesta-una-web-colombia-2026",
    seo: {
      // 58 caracteres: conserva el año (señal de frescura en una consulta de
      // precios) y la marca, sin que la SERP corte ninguno de los dos.
      title: "¿Cuánto cuesta una web en Colombia? Costos 2026 | XyraCode",
      description:
        "Qué se paga una sola vez y qué se paga cada mes en un proyecto web: dominio, hosting, integraciones, mantenimiento. La anatomía completa del costo.",
    },
    lastModified: "2026-07-24T18:00:00-05:00",
    category: "Guía",
    readingTime: "~12 min",
    publishedISO: "2026-07-13T09:00:00-05:00",
    publishedLabel: "13 de julio de 2026",
    title: "¿Cuánto cuesta una página web en Colombia? Así se arma el precio",
    excerpt:
      "El precio no depende del tipo de proyecto sino del alcance. Desglosamos ítem por ítem qué se paga una vez, qué se paga cada mes y qué aparece después.",
    // cover: pendiente (slot raster 4B); dejar sin definir hasta tener la imagen.
    body: [
      { kind: "h2", text: "Dos cotizaciones por \"lo mismo\", con cinco veces de diferencia" },
      {
        kind: "p",
        text:
          "Pediste cotización para tu página web y te llegaron dos. Una cuesta cinco veces lo que la otra. Las dos dicen \"sitio web corporativo\", las dos incluyen \"diseño profesional\" y las dos prometen que vas a salir en Google. Y ahí estás, tratando de entender si alguien te quiere robar o si alguien está regalando su trabajo.",
      },
      {
        kind: "p",
        text:
          "Lo más probable es que ninguna de las dos cosas. Ambas pueden ser honestas, porque \"página web\" no es un producto: es una categoría, como \"vehículo\". Bajo esa palabra cabe desde una plantilla adaptada en una tarde hasta una plataforma construida durante dos meses. Comparar los dos números sin comparar lo que hay debajo es comparar el precio de una moto con el de un camión porque ambos tienen ruedas.",
      },
      {
        kind: "p",
        text:
          "Así que esta guía no te va a dar una lista de precios. Te va a dar algo bastante más útil: el desglose de todo lo que se paga en un proyecto web, qué se paga una sola vez, qué se paga cada mes y qué de todo eso aparece cuando ya firmaste. Con eso vas a poder leer cualquier cotización que te llegue —la nuestra incluida— y saber exactamente qué estás comparando.",
      },
      { kind: "h2", text: "El precio depende del alcance, no del tipo de proyecto" },
      {
        kind: "p",
        text:
          "Esta es la idea que cambia todo, así que vale la pena decirla sin rodeos: no existe \"el precio de una landing\" ni \"el precio de un e-commerce\". Existe el precio de un alcance.",
      },
      {
        kind: "p",
        text: [
          "Dos ",
          { text: "tiendas online", href: "/servicios/ecommerce" },
          " pueden diferir en un orden de magnitud. Una vende quince productos, tiene una sola forma de envío y cobra con un botón de pago. La otra maneja cuatro mil referencias con tallas y colores, sincroniza inventario con el sistema contable, calcula envíos por ciudad y necesita un panel con tres tipos de usuario. Las dos son \"una tienda online\". Solo una de las dos es un proyecto de dos meses.",
        ],
      },
      {
        kind: "p",
        text:
          "Por eso, cuando alguien te da un precio antes de preguntarte por tu negocio, no te está cotizando: está adivinando. Y adivinar siempre le sale caro a alguien —a ti en sobrecostos cuando aparece lo que nadie contempló, o a quien cotizó, en trabajo que no cobró y termina haciendo a las carreras.",
      },
      { kind: "h2", text: "Los tres bloques de toda inversión web" },
      {
        kind: "p",
        text:
          "Todo lo que vas a pagar en tu proyecto cae en uno de tres bloques. Tenerlos separados en la cabeza es lo que te permite presupuestar sin sorpresas:",
      },
      {
        kind: "ul",
        items: [
          "Construcción (pago único). Todo el trabajo de llevar tu sitio de no existir a estar en línea. Se paga una vez, normalmente en dos o tres cuotas contra entregables.",
          "Operación (recurrente). Lo que cuesta mantener tu sitio encendido, seguro y funcionando. Se paga mientras el sitio exista, sin importar quién lo haya construido.",
          "Crecimiento (opcional y variable). Lo que inviertes para que el sitio traiga más clientes con el tiempo: contenido, SEO, campañas, mejoras. Ni es obligatorio ni empieza el día uno.",
        ],
      },
      {
        kind: "p",
        text:
          "El error de presupuesto más común no es equivocarse en el primer bloque. Es olvidar que existe el segundo.",
      },
      { kind: "h2", text: "Qué se paga una sola vez" },
      {
        kind: "p",
        text:
          "Estos son los ítems del bloque de construcción. Ningún proyecto los lleva todos, y esa es justamente la conversación que deberías tener con tu proveedor: cuáles de estos aplican a tu caso y cuáles no.",
      },
      {
        kind: "ul",
        items: [
          "Descubrimiento y arquitectura de información. Las sesiones para entender tu negocio, definir a quién le hablas, qué páginas necesitas y cómo se organiza el contenido. Por fuera se ve como \"reuniones\", pero es la etapa que decide si el sitio funciona o solo se ve bonito. Saltársela es la forma más cara de ahorrar.",
          "Diseño de interfaz. El diseño de cada pantalla: jerarquía visual, tipografía, color, cómo se comporta en celular. Aquí está la diferencia real entre adaptar un tema comprado y diseñar algo pensado para tu marca y para que la gente haga lo que quieres que haga.",
          "Desarrollo. Convertir el diseño en un sitio que funciona de verdad. Es la partida más grande de casi cualquier proyecto y la que más varía, porque un formulario de contacto y un sistema de reservas con disponibilidad en tiempo real no son el mismo trabajo, aunque los dos sean \"un formulario\".",
          "Contenido. Textos, fotos y video. Si los pones tú no cuestan dinero, pero cuestan tiempo, y son la causa número uno de proyectos que se retrasan. Si los produce el proveedor se cobran, porque redactar y fotografiar es trabajo profesional.",
          "Integraciones. Conectar tu sitio con lo que ya usas: pasarela de pagos, WhatsApp, CRM, facturación electrónica, sistema contable, calendario. Cada conexión es desarrollo propio, y varias arrastran además un costo recurrente que verás en el bloque siguiente.",
          "SEO técnico de base. Que el sitio cargue rápido, que Google pueda leerlo, que cada página tenga sus títulos y datos estructurados en orden. No es \"posicionar\": es construir sobre cimientos correctos. Hacerlo después cuesta varias veces más que hacerlo durante.",
          "Migración de contenido. Si ya tienes un sitio, pasar artículos, productos y sobre todo las URLs viejas hacia las nuevas sin perder el posicionamiento que ya ganaste. Casi nadie lo cotiza y, mal hecho, borra años de trabajo en Google en una tarde.",
          "Capacitación y entrega. Enseñarte a administrar tu sitio y entregarte los accesos. Debería estar incluido siempre. Si no aparece por ningún lado, pregunta por qué.",
        ],
      },
      { kind: "h2", text: "Qué se paga cada mes o cada año" },
      {
        kind: "p",
        text:
          "Este es el bloque que casi nunca se menciona en la reunión de venta y que después aparece en tu extracto bancario. Aquí sí hay cifras, porque son costos públicos que puedes verificar tú mismo en cinco minutos: no dependen de quién te construya el sitio.",
      },
      {
        kind: "ul",
        items: [
          "Dominio (tunombre.com). Entre $60.000 y $150.000 al año según la extensión; un .com.co suele costar más que un .com. Es el ítem más barato de toda la lista y el más importante de todos: es tu dirección, y si la pierdes, pierdes todo lo demás.",
          "Hosting o infraestructura. Desde $0 hasta cientos de miles al mes. Un sitio corporativo moderno puede correr sobre servicios con capa gratuita generosa; un e-commerce con tráfico real, imágenes y base de datos, no. Pregunta siempre en qué se va a hospedar el tuyo y cuánto cuesta cuando crezca.",
          "Correo corporativo. Alrededor de $25.000 a $35.000 mensuales por cada buzón (tunombre@tuempresa.com). Se cobra por usuario, así que escala con tu equipo. No viene incluido con el dominio, aunque mucha gente lo da por hecho.",
          "Servicios de terceros. Algunas funciones dependen de servicios externos que se pagan aparte: el envío de correos automáticos, los mapas, la facturación electrónica, el CRM o el sistema de reservas al que se conecta tu sitio. Muchos arrancan con una capa gratuita que alcanza al inicio y pasan a un plan pago cuando creces. Pide la lista completa, con lo que cuesta cada uno, antes de firmar.",
          "Comisión de la pasarela de pagos. En Colombia se mueve alrededor del 3% al 4% más un fijo por transacción, más IVA. No es un costo mensual sino un porcentaje de cada venta, y por eso es el que más pesa justo cuando el negocio empieza a funcionar.",
          "Mantenimiento y respaldos. Actualizaciones de seguridad, copias de respaldo, monitoreo y arreglos. Puede ser un plan mensual o una bolsa de horas que consumes cuando la necesitas. Es opcional en el mismo sentido en que es opcional cambiarle el aceite al carro.",
          "Contenido y SEO continuo. Artículos, actualizaciones, seguimiento de posiciones. Pertenece al bloque de crecimiento: no lo necesitas para lanzar, lo necesitas para que el sitio te traiga clientes solo.",
        ],
      },
      {
        kind: "p",
        text:
          "Súmalos antes de decidir. Un sitio \"económico\" que arrastra seis suscripciones puede costarte más en el año dos que uno que se pagó una vez y corre sobre infraestructura sin licencias.",
      },
      { kind: "h2", text: "Todo el costo de un proyecto web, en una tabla" },
      {
        kind: "p",
        text:
          "Guarda esta tabla: es la que te sirve para leer cualquier cotización que te llegue. La columna de la derecha es la que más gente descubre demasiado tarde.",
      },
      {
        kind: "table",
        head: ["Concepto", "Único o recurrente", "Quién lo asume", "A nombre de quién queda"],
        rows: [
          ["Descubrimiento y arquitectura", "Único", "Proyecto", "Cliente"],
          ["Diseño de interfaz", "Único", "Proyecto", "Cliente"],
          ["Desarrollo", "Único", "Proyecto", "Cliente (repositorio)"],
          ["Contenido (textos y fotos)", "Único", "Proyecto o cliente", "Cliente"],
          ["Integraciones", "Único + posible mensual", "Ambos", "Cliente"],
          ["SEO técnico de base", "Único", "Proyecto", "Cliente"],
          ["Migración y capacitación", "Único", "Proyecto", "Cliente"],
          ["Dominio", "Anual", "Cliente", "Cliente"],
          ["Hosting o infraestructura", "Mensual o anual", "Cliente", "Cliente"],
          ["Correo corporativo", "Mensual por usuario", "Cliente", "Cliente"],
          ["Certificado HTTPS", "Incluido", "—", "—"],
          ["Servicios de terceros", "Mensual o anual", "Cliente", "Cliente"],
          ["Pasarela de pagos", "% por transacción", "Cliente", "Cliente"],
          ["Mantenimiento y respaldos", "Mensual o bolsa de horas", "Cliente", "—"],
          ["Contenido y SEO continuo", "Mensual", "Cliente", "Cliente"],
        ],
        caption:
          "Desglose de costos de un proyecto web. Los ítems recurrentes se pagan mientras el sitio exista.",
      },
      {
        kind: "p",
        text:
          "Esa última columna no es un detalle legal. Si el dominio está registrado a nombre de tu proveedor, no eres dueño de tu dirección en internet. Si el repositorio es de él, no eres dueño de tu sitio. Cambiar de proveedor deja de ser una decisión tuya y pasa a ser una negociación. Pídelo por escrito desde la cotización, no al final.",
      },
      { kind: "h2", text: "Los costos que aparecen después" },
      {
        kind: "p",
        text:
          "Estos no salen en ninguna cotización porque no son del proyecto: son del futuro. Pero son reales, y conviene verlos venir.",
      },
      {
        kind: "ul",
        items: [
          "Saltos de plan. Tu hosting es barato hasta que el tráfico crece. Los planes escalan por tramos y el salto suele ser brusco. Pregunta cuál es el siguiente escalón y qué cuesta.",
          "Comisiones que crecen con las ventas. Un 4% por transacción es invisible cuando vendes poco y es una partida de nómina cuando vendes bien. Es el único costo que duele justo cuando el negocio va bien.",
          "Migración forzada. Las plataformas cerradas cambian precios y reglas cuando quieren. Si tu negocio vive sobre una y decide subir la tarifa o cerrar una función, tu única alternativa es rehacer.",
          "Rehacer a los dieciocho meses. El más caro de todos. Pasa cuando el sitio se construyó para el negocio de hoy y no para el de mañana: agregar algo simple obliga a tocarlo todo. No se evita con presupuesto, se evita con arquitectura.",
          "El costo de no tenerlo. El más difícil de cuantificar y el que más pesa: cada mes que tu competencia aparece en Google y tú no, es mercado que no vuelve.",
        ],
      },
      { kind: "h2", text: "Los seis factores que mueven tu presupuesto" },
      {
        kind: "p",
        text:
          "Si quieres estimar hacia dónde va tu proyecto antes de pedir cotización, mira estos seis. Son los que de verdad mueven la aguja:",
      },
      {
        kind: "ul",
        items: [
          "Cuántas plantillas únicas, no cuántas páginas. Veinte artículos de blog usan la misma plantilla y cuestan casi lo mismo que uno. Cinco páginas con cinco diseños distintos son cinco trabajos. Cuando te pregunten \"¿cuántas páginas?\", la respuesta útil es cuántas se ven diferente.",
          "Diseño a medida o tema adaptado. Adaptar un tema es más rápido y más barato, con el techo de que tu sitio se parecerá a otros miles. Diseñar desde cero cuesta más porque hay trabajo real de diseño detrás, y es lo que hace que tu marca no se vea genérica.",
          "Cuántas integraciones. Cada sistema externo que hay que conectar suma desarrollo, pruebas y una cosa más que se puede dañar después. Dos integraciones no cuestan el doble que una: cuestan más, porque además hay que hacerlas convivir.",
          "Quién produce el contenido. El factor que más subestima todo el mundo. Llegar con textos y fotos listos puede recortar semanas de calendario y una partida completa del presupuesto.",
          "Roles, estados y permisos. Un sitio que solo muestra información es una cosa. Uno donde la gente se registra, tiene perfiles, hay administradores con distintos permisos y las cosas cambian de estado —pedido creado, pagado, despachado— ya no es una web: es software. Ahí el costo cambia de categoría, no de escala.",
          "El plazo. La urgencia se paga. Comprimir un cronograma significa más gente en paralelo, y más gente en paralelo cuesta más por unidad de trabajo, no menos.",
        ],
      },
      {
        kind: "p",
        text: [
          "Si tu proyecto cae de lleno en ese quinto punto, no estás cotizando una web sino ",
          { text: "una aplicación a medida", href: "/servicios/apps-a-medida" },
          ", y conviene tratarlo como tal desde la primera conversación.",
        ],
      },
      { kind: "h2", text: "El cálculo que importa: cuánto cuesta a tres años" },
      {
        kind: "p",
        text:
          "Aquí está el error que hace que la gente sienta que le vendieron caro cuando en realidad le vendieron barato. Casi todo el mundo compara cotizaciones mirando el número de la construcción, que es un pago único, e ignora el bloque de operación, que se paga para siempre.",
      },
      {
        kind: "p",
        text:
          "Haz este ejercicio con cada propuesta que tengas sobre la mesa. Toma el pago único. Súmale doce meses de todo lo recurrente. Ahora proyéctalo a tres años. Ese número —no el primero— es lo que de verdad te cuesta la decisión.",
      },
      {
        kind: "p",
        text:
          "Es un ejercicio incómodo para todos los proveedores, nosotros incluidos, porque a veces el resultado es que la opción más simple gana. Pero es el único cálculo honesto. Y en la práctica es donde se cae la ilusión de la web ultrabarata: cuando le sumas la suscripción de la plataforma, la del tema, la de los plugins y la de la app de formularios, el mes treinta y seis cuenta otra historia.",
      },
      { kind: "h2", text: "Qué debe traer una cotización seria" },
      {
        kind: "p",
        text:
          "Con todo lo anterior en la cabeza ya puedes evaluar una propuesta sin ser técnico. Esto es lo que debería estar por escrito:",
      },
      {
        kind: "ul",
        items: [
          "El alcance, página por página. Qué páginas, qué secciones, qué funciones. Si dice \"sitio web corporativo\" y nada más, eso no es una cotización: es una intención.",
          "Qué queda explícitamente por fuera. Es la línea más valiosa del documento y la que casi nunca aparece. Un proveedor que escribe lo que no incluye es un proveedor que ya pensó el proyecto.",
          "La separación entre pago único y recurrente. Con el monto de cada uno y quién lo paga. Si no lo aclara, pregúntalo antes de firmar, no después.",
          "A nombre de quién quedan dominio, hosting y repositorio. Por escrito. La respuesta correcta es: a nombre tuyo.",
          "Tiempos y entregables. Qué recibes, cuándo, y qué necesitan de ti para cumplirlo. Casi todos los retrasos nacen de contenido que el cliente no entregó a tiempo, y una buena cotización lo dice de frente.",
          "Qué pasa después del lanzamiento. Cuánto soporte incluye, por cuánto tiempo y qué cuesta después. Una web no termina el día que sale.",
        ],
      },
      { kind: "h2", text: "Preguntas frecuentes" },
      { kind: "h3", text: "¿Qué costos son de una sola vez y cuáles son para siempre?" },
      {
        kind: "p",
        text:
          "De una sola vez: descubrimiento, diseño, desarrollo, producción de contenido, integraciones, SEO técnico de base, migración y capacitación. Para siempre: dominio, hosting, correo corporativo, licencias de plataformas o plugins, comisiones de la pasarela de pago y, de forma opcional, mantenimiento y contenido continuo. La regla simple: lo que construye tu sitio se paga una vez; lo que lo mantiene encendido se paga mientras exista.",
      },
      { kind: "h3", text: "¿Por qué dos cotizaciones por \"lo mismo\" son tan distintas?" },
      {
        kind: "p",
        text:
          "Porque casi nunca es lo mismo. Cambia el diseño (tema adaptado o a medida), el SEO técnico, la velocidad, las funciones reales detrás de cada pantalla, quién redacta el contenido, qué integraciones incluye y quién responde después del lanzamiento. Compara alcances, no números. Si una cotización es la mitad de la otra, la pregunta correcta no es por qué la otra es cara, sino qué trae de menos esta.",
      },
      { kind: "h3", text: "¿Puedo empezar con algo sencillo y mejorar después?" },
      {
        kind: "p",
        text:
          "Sí, y muchas veces es lo más inteligente, sobre todo si todavía estás validando el negocio. La condición es una sola: que los cimientos permitan crecer. Empezar pequeño sobre una base bien construida es estrategia; empezar pequeño sobre una plantilla cerrada es aplazar el día en que toca rehacerlo todo. Pregúntale a tu proveedor qué pasa el día que quieras agregar la función que hoy no necesitas.",
      },
      { kind: "h3", text: "¿Qué pasa si dejo de pagar el mantenimiento?" },
      {
        kind: "p",
        text:
          "Tu sitio no se apaga: sigue en línea mientras pagues dominio y hosting, que son cosas distintas. Lo que pierdes es todo lo demás —actualizaciones de seguridad, copias de respaldo, monitoreo y alguien a quien llamar cuando algo falla—. En sitios estáticos y modernos el riesgo es bajo; en sitios con plugins y base de datos, un año sin actualizar es una invitación abierta.",
      },
      { kind: "h3", text: "¿Por qué no publican una lista de precios?" },
      {
        kind: "p",
        text:
          "Porque cotizar sin conocer tu alcance es adivinar, y adivinar siempre le sale caro a alguien: a ti en sobrecostos cuando aparece lo que nadie contempló, o a nosotros en trabajo que no cobramos y terminamos haciendo a las carreras. Lo que sí hacemos es más útil que una lista: en la primera conversación te decimos cuáles de los ítems de este artículo aplican a tu caso y cuáles no necesitas, y de ahí sale un número con alcance definido.",
      },
      { kind: "h3", text: "¿Cuánto tarda en estar lista una web?" },
      {
        kind: "p",
        text: [
          "Una landing suele tomar de dos a tres semanas; ",
          { text: "un sitio corporativo a medida", href: "/servicios/desarrollo-web" },
          ", de cuatro a seis; una tienda o una aplicación a medida, varias semanas o meses según el alcance. El plazo depende menos del proveedor de lo que crees: la variable que más retrasa proyectos es el contenido —textos, fotos y aprobaciones— que tiene que salir de tu lado.",
        ],
      },
      { kind: "h2", text: "¿Cuáles de estos costos aplican a tu proyecto?" },
      {
        kind: "p",
        text:
          "Esa es la conversación que vale la pena tener, y es gratis. Cuéntanos qué necesitas y te decimos con honestidad cuáles de los ítems de este artículo aplican a tu caso, cuáles te puedes ahorrar y cuáles no conviene recortar. Si tu proyecto se resuelve con algo más simple de lo que tenías en mente, también te lo decimos.",
      },
    ],
  },
];
