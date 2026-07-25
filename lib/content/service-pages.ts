import {
  Code2,
  Gauge,
  Globe,
  LayoutDashboard,
  MapPin,
  PenTool,
  ShoppingCart,
  type LucideIcon,
} from "lucide-react";
import type { Block } from "./blocks";

export type ServiceFeature = { icon: LucideIcon; title: string; desc: string };

export type ServicePage = {
  slug: string;
  seo: { title: string; description: string };
  /** ISO 8601; editar a mano al cambiar el contenido (alimenta el sitemap). */
  lastModified: string;
  /**
   * Cómo se presenta el servicio en el hub y en "Otros servicios". `title` es
   * el anchor text con el que apuntamos a esta página: keyword limpia, no el
   * h1 largo. Es la señal interna más fuerte que le damos a Google sobre de
   * qué trata la URL, así que se escribe corto y sin adornos.
   */
  card: { title: string; summary: string };
  /**
   * `serviceType` del JSON-LD: el nombre de categoría del servicio, en la
   * forma en que se busca ("Desarrollo de tiendas virtuales"). El h1 puede
   * llevar adornos de marca; esto no. Opcional: si falta, se omite el campo.
   */
  serviceType?: string;
  /** Slugs de servicios relacionados; alimenta el cross-linking del pie. */
  related: string[];
  hero: { eyebrow: string; h1: string; intro: string };
  /** Grid "Qué incluye" (3 tarjetas). */
  features: ServiceFeature[];
  /** Cuerpo largo para SEO: proceso, tecnologías, FAQ… El "más texto". */
  body: Block[];
  cta: { title: string; subtitle: string };
};

/** Slug del artículo de costos; se enlaza desde varios servicios y desde el hub. */
const GUIA_PRECIOS = "/blog/cuanto-cuesta-una-web-colombia-2026";

/** Caso de estudio con tienda y panel; es la prueba de que esto ya se hizo. */
const CASO_VUELO_CARMESI = "/proyectos/vuelo-carmesi";

/**
 * Página /servicios. NO es un índice de servicios: es la página de decisión
 * previa a la compra ("¿web, tienda o app?").
 *
 * El listado escueto que había antes competía por la misma intención que la
 * home y que /servicios/desarrollo-web, y de las tres era la más débil: Google
 * la descartaba y quedaba sin indexar. Al moverla a intención comparativa
 * ninguna de las tres URLs pelea con otra. Si alguien vuelve a ponerle un
 * title tipo "Servicios de desarrollo web", vuelve la canibalización.
 */
export const SERVICE_HUB: {
  seo: { title: string; description: string };
  hero: { eyebrow: string; h1: string; intro: string };
  body: Block[];
  cta: { title: string; subtitle: string };
} = {
  seo: {
    title: "¿Web, tienda online o app a medida? Cómo elegir | XyraCode",
    description:
      "Compara los tres caminos: qué resuelve cada uno, cuándo conviene, cuánto tarda y qué inversión pide. Guía honesta para decidir antes de cotizar.",
  },
  hero: {
    eyebrow: "Servicios",
    h1: "¿Qué necesita tu negocio: una web, una tienda o una app?",
    intro:
      "Tres caminos distintos para tres problemas distintos. Aquí te decimos cuál resuelve el tuyo, cuánto tarda cada uno y cuándo no vale la pena desarrollar a medida.",
  },
  body: [
    { kind: "h2", text: "Los tres caminos, en corto" },
    {
      kind: "p",
      text: "Casi todos los proyectos que llegan a XyraCode caben en uno de tres caminos. No se diferencian por tecnología (usamos el mismo stack en los tres), sino por el problema que resuelven: que te encuentren, que te compren o que tu operación deje de ser un caos.",
    },
    {
      kind: "table",
      caption: "Comparativa de los tres servicios principales.",
      head: ["Camino", "Qué resuelve", "Cuándo conviene", "Tiempo típico"],
      rows: [
        [
          "Sitio web a medida",
          "Que te encuentren en Google y confíen en ti",
          "Vendes servicios, o tu sitio actual no genera consultas",
          "2 a 6 semanas",
        ],
        [
          "Tienda online",
          "Vender sin tener que estar presente",
          "Tienes catálogo propio y hoy vendes por WhatsApp o redes",
          "4 a 8 semanas",
        ],
        [
          "App a medida",
          "Ordenar y automatizar tu operación interna",
          "Gestionas reservas, pedidos o inventario a mano",
          "4 semanas a varios meses",
        ],
      ],
    },
    {
      kind: "p",
      text: "Los tres se construyen igual de bien desde Villavicencio o desde cualquier parte de Colombia. Si eres un negocio de la región y prefieres tratar con alguien de aquí, ese es un cuarto camino que también cubrimos.",
    },
    { kind: "h2", text: "Cómo elegir sin equivocarte" },
    {
      kind: "p",
      text: "La pregunta correcta no es qué quieres construir, sino qué te está costando dinero hoy. Casi siempre la respuesta se ve sola:",
    },
    {
      kind: "ul",
      items: [
        "Nadie te encuentra en Google, o tu web actual es lenta y no trae consultas: necesitas un sitio a medida.",
        "Ya vendes, pero se te caen pedidos, cobras a mano y pierdes el control del inventario: necesitas una tienda online.",
        "Pasas horas cada semana copiando datos entre hojas de cálculo, agendando o coordinando por chat: necesitas una app a medida.",
        "Vas a lanzar algo nuevo y no tienes nada: empieza por la web. Es más barato crecer hacia lo demás que construir de más desde el principio.",
      ],
    },
    {
      kind: "p",
      text: "Muchos proyectos terminan combinando dos: una web pública que capta clientes y, detrás, un panel de administración que ordena la operación. No hace falta decidirlo todo hoy; sí conviene construir sobre una base que aguante lo que viene.",
    },
    { kind: "h2", text: "Cuánto cuesta cada camino" },
    {
      kind: "p",
      text: [
        "El precio depende del alcance, no del tipo de proyecto: una landing sencilla y un sitio corporativo de doce secciones son ambos \"desarrollo web\" y no cuestan lo mismo. Desglosamos ítem por ítem de qué se compone el costo en ",
        {
          text: "nuestra guía de qué se paga una vez y qué cada mes en un proyecto web",
          href: GUIA_PRECIOS,
        },
        ", con los factores que lo mueven hacia arriba y hacia abajo.",
      ],
    },
    {
      kind: "p",
      text: "Para tu caso puntual, la propuesta con alcance, cronograma y precio llega en menos de 48 horas desde la primera conversación. Sin compromiso.",
    },
    { kind: "h2", text: "Cuándo NO necesitas desarrollo a medida" },
    {
      kind: "p",
      text: "Preferimos perder una venta antes que venderte algo que no necesitas, así que vale la pena decirlo de frente. El desarrollo a medida no te conviene si:",
    },
    {
      kind: "ul",
      items: [
        "Estás validando si tu producto se vende y todavía no tienes clientes: una herramienta de bajo costo te deja probar más rápido y más barato.",
        "Tu necesidad la cubre completa una herramienta existente que ya usas y con la que estás cómodo.",
        "Tu web no es parte de cómo consigues clientes ni ingresos: con un perfil de negocio bien hecho y redes activas puede bastarte por ahora.",
        "No tienes quien alimente el proyecto después del lanzamiento. Un sitio a medida sin contenido ni mantenimiento rinde menos que uno sencillo bien cuidado.",
      ],
    },
    {
      kind: "p",
      text: "Si nos escribes y tu caso es uno de estos, te lo vamos a decir en la primera llamada. El desarrollo a medida rinde cuando tu presencia digital es parte central del negocio, no un adorno.",
    },
    { kind: "h2", text: "Preguntas frecuentes" },
    { kind: "h3", text: "¿Puedo empezar por una web y agregar la tienda después?" },
    {
      kind: "p",
      text: "Sí, y suele ser el camino más sensato. Construimos la web sobre una base pensada para crecer, de modo que sumar catálogo, pagos o un panel más adelante sea una fase nueva y no empezar de cero.",
    },
    { kind: "h3", text: "¿Cuál de los tres da resultados más rápido?" },
    {
      kind: "p",
      text: "La web, porque es la que menos tarda en construirse y la que empieza a captar desde el primer mes. Eso sí: posicionar en Google toma tiempo y contenido constante, en cualquiera de los tres caminos.",
    },
    { kind: "h3", text: "¿Cuál es la diferencia real entre una web y una app?" },
    {
      kind: "p",
      text: "Una web informa y capta clientes; una app opera tu negocio: gestiona datos, usuarios y procesos. Si lo que necesitas es que alguien vea algo, es web. Si necesitas que alguien haga algo dentro de un sistema, es app.",
    },
    { kind: "h3", text: "¿Y si mi caso no encaja en ninguno de los tres?" },
    {
      kind: "p",
      text: "Escríbenos igual. La mayoría de proyectos son mezclas, y parte del trabajo de la primera conversación es ponerle nombre a lo que necesitas antes de cotizarlo.",
    },
  ],
  cta: {
    title: "¿Todavía no tienes claro cuál es el tuyo?",
    subtitle:
      "Cuéntanos qué te está frenando hoy y te decimos cuál de los tres caminos resuelve tu caso, con alcance, tiempos y precio en 48 horas. Y si ninguno aplica, también te lo decimos.",
  },
};

export const SERVICE_PAGES: ServicePage[] = [
  {
    slug: "desarrollo-web",
    seo: {
      title: "Desarrollo Web a Medida, sin Plantillas | XyraCode",
      description:
        "Sitios web rápidos, medibles y a medida, sin plantillas. Código propio, comunicación directa con el dev y primera propuesta en 48h. Cotiza tu proyecto.",
    },
    lastModified: "2026-07-24",
    card: {
      title: "Desarrollo web a medida",
      summary:
        "Sitios corporativos y landings hechos a mano para cargar rápido, posicionar y convertir.",
    },
    related: ["ecommerce", "apps-a-medida", "desarrollo-web-villavicencio"],
    hero: {
      eyebrow: "Desarrollo web",
      h1: "Desarrollo web a medida para negocios que quieren vender más",
      intro:
        "Sitios corporativos y landings hechos a mano, pensados para cargar rápido, posicionar y convertir. Sin plantillas, sin ataduras: código propio que puedes escalar.",
    },
    features: [
      {
        icon: Globe,
        title: "Sitios a medida",
        desc: "Cada página se diseña y programa para tu negocio, no se rellena una plantilla genérica.",
      },
      {
        icon: Gauge,
        title: "Rendimiento y SEO técnico",
        desc: "Core Web Vitals, HTML semántico y metadata cuidada para que Google te encuentre.",
      },
      {
        icon: Code2,
        title: "Código propio",
        desc: "Te entregamos el código y la infraestructura: sin lock-in a un constructor cerrado.",
      },
    ],
    body: [
      { kind: "h2", text: "Qué es el desarrollo web a medida" },
      {
        kind: "p",
        text: 'Desarrollo web a medida significa construir tu sitio desde cero, con código propio, pensado para tu negocio y no para el molde de una plantilla. En XyraCode no partimos de un tema comprado que hay que "acomodar": partimos de tus objetivos, tus usuarios y la acción que quieres que la gente haga cuando entra a tu web.',
      },
      {
        kind: "p",
        text: "La diferencia se nota en tres cosas: velocidad, control y crecimiento. Un sitio a medida carga en segundos, hace exactamente lo que necesitas (ni una función de más que te haga lento) y se puede ampliar cuando tu negocio crece, sin tener que empezar de nuevo. Trabajamos con el mismo stack que usan los productos modernos: React, Next.js, Node, TypeScript, Tailwind y PostgreSQL.",
      },
      {
        kind: "p",
        text: "Si tu idea se resuelve mejor con una herramienta económica de $20 al mes en lugar de un desarrollo a medida, te lo decimos. Preferimos perder una venta antes que venderte algo que no necesitas. El desarrollo a medida tiene sentido cuando tu web es parte central de cómo consigues clientes o ingresos.",
      },
      { kind: "h2", text: "Para quién es este servicio" },
      {
        kind: "p",
        text: "Este servicio es para ti si tu sitio actual no está trayendo clientes, si dependes de una plantilla lenta que ya no puedes personalizar, o si estás lanzando un negocio y quieres empezar con una base sólida en lugar de un parche que tendrás que rehacer en un año.",
      },
      { kind: "p", text: "Trabajamos especialmente bien con:" },
      {
        kind: "ul",
        items: [
          "Emprendedores y pymes que quieren un sitio profesional que genere confianza y consultas.",
          "Negocios locales de Villavicencio y toda Colombia que necesitan aparecer en Google y convertir visitas en clientes.",
          "Empresas con un sitio viejo, lento o difícil de actualizar que necesitan una renovación completa.",
          "Proyectos que empiezan como landing pero que van a crecer hacia una plataforma o tienda.",
        ],
      },
      { kind: "h2", text: "Qué incluye" },
      {
        kind: "p",
        text: 'Un proyecto de desarrollo web con nosotros no es solo "las pantallas". Incluye todo lo que un sitio necesita para funcionar y rendir:',
      },
      {
        kind: "ul",
        items: [
          "Diseño a medida alineado a tu marca, del wireframe a la interfaz final, claro y accesible.",
          "Desarrollo con código limpio en React y Next.js, versionado en un repositorio que es tuyo desde el día uno.",
          "Diseño responsive que se ve y funciona igual de bien en celular, tablet y computador.",
          "SEO técnico de base: estructura semántica, metadatos, sitemap, datos estructurados y buenas prácticas para que Google entienda y posicione tu sitio.",
          "Rendimiento y Core Web Vitals: optimización de velocidad de carga, que hoy es un factor directo de posicionamiento y de conversión.",
          "Formularios de contacto conectados a tu correo o WhatsApp, con validación y protección básica.",
          "Analítica para que midas visitas, origen del tráfico y qué páginas convierten.",
          "Deploy y puesta en producción en infraestructura moderna, con dominio y certificado seguro (HTTPS).",
        ],
      },
      { kind: "h2", text: "Cómo trabajamos" },
      {
        kind: "p",
        text: "Trabajamos por etapas cortas, con entregas que puedes ver y probar cada semana. No mandamos reportes de avance en PDF: mandamos enlaces a tu proyecto funcionando en una URL real.",
      },
      {
        kind: "ul",
        items: [
          "Descubrimiento. Entendemos tu negocio, tus objetivos y tus usuarios. Aquí definimos qué debe lograr el sitio y cómo lo vamos a medir.",
          "Diseño. Prototipamos la solución y la validamos contigo antes de escribir una sola línea de código de producción.",
          "Desarrollo. Construimos por sprints, con entregas que ves y pruebas. Nada de sorpresas al final.",
          "Lanzamiento. Deploy, medición y soporte post-launch para que el sitio arranque en firme.",
        ],
      },
      {
        kind: "p",
        text: "En todo el proceso hablas directamente con quien construye tu proyecto. No hay gerente de cuenta que traduzca mal lo que pediste: me cuentas tu idea y la misma persona la convierte en código.",
      },
      { kind: "h2", text: "Tecnologías que usamos" },
      {
        kind: "p",
        text: "Usamos herramientas modernas, estables y con comunidad grande, para que tu sitio sea rápido hoy y mantenible mañana:",
      },
      {
        kind: "ul",
        items: [
          "React y Next.js para interfaces rápidas y bien posicionadas en buscadores.",
          "TypeScript para código más seguro y con menos errores.",
          "Tailwind CSS para un diseño consistente y fácil de evolucionar.",
          "Node y PostgreSQL cuando el proyecto necesita lógica de servidor o base de datos.",
        ],
      },
      {
        kind: "p",
        text: "Elegimos el stack según lo que tu proyecto necesita, no al revés. Y todo queda documentado a tu nombre.",
      },
      { kind: "h2", text: "Entregables y tiempos" },
      {
        kind: "p",
        text: "Al cerrar el proyecto recibes: el sitio en producción, el repositorio de código con todos los accesos a tu nombre, la documentación básica para operarlo y una breve capacitación para que puedas actualizar el contenido que corresponda.",
      },
      {
        kind: "p",
        text: "Los tiempos dependen del alcance, pero como referencia: una landing profesional suele tomar de 2 a 3 semanas, y un sitio corporativo de varias secciones entre 4 y 6 semanas. Te damos una primera propuesta con alcance y cronograma en menos de 48 horas desde nuestra primera conversación.",
      },
      {
        kind: "p",
        text: "Tomamos máximo 3 proyectos en paralelo, así que el tuyo avanza todas las semanas con atención real.",
      },
      { kind: "h2", text: "Preguntas frecuentes" },
      { kind: "h3", text: "¿Cuánto cuesta un sitio web a medida?" },
      {
        kind: "p",
        text: [
          "Depende del alcance: número de páginas, funcionalidades, integraciones y diseño. Escribimos ",
          {
            text: "una guía completa de los costos de una página web en Colombia",
            href: GUIA_PRECIOS,
          },
          " que desglosa qué se paga una sola vez y qué es recurrente. Para tu caso puntual, te enviamos una cotización clara en 48 horas.",
        ],
      },
      { kind: "h3", text: "¿El sitio va a aparecer en Google?" },
      {
        kind: "p",
        text: "Construimos con SEO técnico desde la base para que Google pueda entender e indexar tu sitio. Posicionar por palabras clave competidas toma tiempo y contenido constante, pero salimos con los cimientos correctos.",
      },
      { kind: "h3", text: "¿Puedo actualizar el contenido yo mismo?" },
      {
        kind: "p",
        text: "Sí. Según tu proyecto, dejamos el contenido editable o conectamos un gestor para que cambies textos e imágenes sin depender de nosotros.",
      },
      { kind: "h3", text: "¿El código es mío?" },
      {
        kind: "p",
        text: "Totalmente. Repositorio, accesos y documentación quedan a tu nombre desde el día uno. Si mañana quieres trabajar con otro equipo, te vas sin rehenes.",
      },
      { kind: "h3", text: "¿Trabajan con clientes fuera de Villavicencio?" },
      {
        kind: "p",
        text: "Sí. Trabajamos con clientes de cualquier parte de Colombia y del mundo. Siempre tendrás atención directa de quien construye tu proyecto, y estamos a un clic de una videollamada.",
      },
    ],
    cta: {
      title: "¿Listos para empezar?",
      subtitle:
        "Cuéntanos tu idea y te enviamos una propuesta con alcance, tiempos y precio en 48 horas. Sin compromiso y sin jerga: te explicamos cada decisión en términos de tu negocio.",
    },
  },
  {
    slug: "apps-a-medida",
    seo: {
      title: "Desarrollo de Apps a Medida en Colombia | XyraCode",
      description:
        "Web apps, plataformas y dashboards a medida para tu negocio. Código propio, foco en producto y datos, primera propuesta en 48h. Cotiza sin compromiso.",
    },
    lastModified: "2026-07-24",
    card: {
      title: "Apps y plataformas a medida",
      summary:
        "Paneles, reservas, dashboards y herramientas internas para lo que hoy resuelves en hojas de cálculo.",
    },
    related: ["desarrollo-web", "ecommerce"],
    hero: {
      eyebrow: "Apps a medida",
      h1: "Apps y plataformas a medida que ordenan tu negocio",
      intro:
        "Software construido para cómo funciona tu negocio: paneles, reservas, dashboards y herramientas internas que hoy resuelves a mano en hojas de cálculo. Construimos con foco en producto, datos y escala.",
    },
    features: [
      {
        icon: PenTool,
        title: "Diseño de producto",
        desc: "Traducimos tu proceso real en pantallas claras que la gente usa sin manual, del prototipo a la interfaz final.",
      },
      {
        icon: Code2,
        title: "Backend a medida",
        desc: "Node, NestJS y PostgreSQL con Prisma para lógica de negocio y datos confiables, con roles y permisos.",
      },
      {
        icon: LayoutDashboard,
        title: "Panel de administración",
        desc: "Gestiona tu operación, tus datos y tus procesos desde un panel propio, sin depender de nadie.",
      },
    ],
    body: [
      { kind: "h2", text: "Qué es una app a medida" },
      {
        kind: "p",
        text: "Una app a medida es software construido específicamente para cómo funciona tu negocio: una plataforma, un panel de administración, un sistema de reservas, un dashboard de datos o una herramienta interna que automatiza lo que hoy haces a mano en hojas de cálculo y mensajes de WhatsApp.",
      },
      {
        kind: "p",
        text: "A diferencia de un sitio web, que existe sobre todo para informar y captar, una app existe para operar: gestiona información, ejecuta procesos, conecta usuarios y crece con tu negocio. En XyraCode construimos aplicaciones web con foco en producto, datos y escala, usando el mismo stack con el que se construyen productos modernos: React, Next.js, Node, NestJS, TypeScript y PostgreSQL.",
      },
      {
        kind: "p",
        text: "No toda idea necesita una app a medida. Si tu problema se resuelve con una herramienta existente, te lo decimos. El desarrollo a medida tiene sentido cuando ninguna herramienta del mercado encaja con tu proceso, cuando pagas varias suscripciones que no se hablan entre sí, o cuando tu operación crece más rápido de lo que tus hojas de cálculo aguantan.",
      },
      { kind: "h2", text: "Para quién es este servicio" },
      {
        kind: "p",
        text: "Este servicio es para ti si tu negocio ya funciona pero se está volviendo difícil de administrar, si tienes un proceso repetitivo que consume horas cada semana, o si tienes una idea de producto digital y necesitas construir la primera versión que funcione de verdad.",
      },
      { kind: "p", text: "Trabajamos bien con:" },
      {
        kind: "ul",
        items: [
          "Negocios que gestionan reservas, citas, pedidos o inventario y hoy lo hacen manualmente.",
          "Emprendedores con una idea de plataforma o SaaS que necesitan un MVP sólido para validar.",
          "Empresas que quieren un panel interno para ver sus datos y tomar decisiones.",
          "Equipos que pagan varias herramientas sueltas y quieren una sola que se ajuste a su forma de trabajar.",
        ],
      },
      { kind: "h2", text: "Qué incluye" },
      {
        kind: "p",
        text: "Un proyecto de app a medida cubre todo el ciclo, desde definir el producto hasta ponerlo en producción:",
      },
      {
        kind: "ul",
        items: [
          "Definición de producto: traducimos tu operación real en funcionalidades concretas y priorizadas.",
          "Diseño de interfaz y experiencia claro y accesible, pensado para que la gente lo use sin manual.",
          "Frontend en React y Next.js rápido y responsive, que funciona en celular y computador.",
          "Backend con Node/NestJS y base de datos PostgreSQL con Prisma, para lógica de negocio y datos confiables.",
          "Autenticación y roles: distintos permisos para administradores, staff y clientes.",
          "Panel de administración para que gestiones tu operación sin depender de nadie.",
          "Integraciones: pagos, emails transaccionales, carga de imágenes en la nube, WhatsApp o las APIs que tu proceso necesite.",
          "Deploy y monitoreo en infraestructura moderna, con el código versionado a tu nombre.",
        ],
      },
      { kind: "h2", text: "Cómo trabajamos" },
      {
        kind: "p",
        text: "Construir una app es un proceso de decisiones, no solo de programar. Por eso trabajamos cerca, con entregas cortas que puedes probar y ajustar antes de seguir.",
      },
      {
        kind: "ul",
        items: [
          "Descubrimiento. Mapeamos tu proceso actual y definimos qué debe hacer la app, para quién y con qué prioridad. Aquí decidimos el alcance de la primera versión.",
          "Diseño. Prototipamos las pantallas clave y validamos el flujo contigo. Es más barato cambiar un prototipo que cambiar código.",
          "Desarrollo por sprints. Construimos funcionalidad por funcionalidad, con entregas semanales en una URL real que puedes usar desde tu celular.",
          "Lanzamiento y evolución. Deploy, medición y soporte. Una app viva casi siempre sigue creciendo, y planeamos para eso.",
        ],
      },
      {
        kind: "p",
        text: "Hablas directamente con quien construye. Vengo de más de 10 años en ventas, así que explico cada decisión técnica en términos de negocio: nunca sales de una reunión sin entender qué se hizo y por qué.",
      },
      { kind: "h2", text: "Tecnologías que usamos" },
      {
        kind: "ul",
        items: [
          "React y Next.js para interfaces rápidas y modernas.",
          "Node y NestJS para un backend organizado y escalable.",
          "PostgreSQL con Prisma para datos confiables y consultas seguras.",
          "TypeScript de punta a punta, para menos errores en producción.",
          "Cloudinary, servicios de email y pasarelas de pago según lo que el proyecto requiera.",
        ],
      },
      {
        kind: "p",
        text: "Elegimos cada pieza por una razón, no por moda, y todo queda documentado para que otro equipo pueda continuar si algún día lo necesitas.",
      },
      { kind: "h2", text: "Entregables y tiempos" },
      {
        kind: "p",
        text: "Recibes la aplicación en producción, el repositorio con todos los accesos a tu nombre, la documentación técnica básica y una capacitación para operar el panel de administración.",
      },
      {
        kind: "p",
        text: "Los tiempos dependen mucho del alcance. Un MVP enfocado (una o dos funcionalidades centrales bien hechas) suele tomar de 4 a 8 semanas; una plataforma más completa, varios meses en fases. Preferimos lanzar algo útil pronto y crecer, antes que tardar un año en un producto gigante que nadie ha probado. Te damos alcance y cronograma en la propuesta, que llega en menos de 48 horas.",
      },
      { kind: "h2", text: "Preguntas frecuentes" },
      { kind: "h3", text: "¿Cuál es la diferencia entre una web y una app a medida?" },
      {
        kind: "p",
        text: "Una web informa y capta clientes; una app opera tu negocio: gestiona datos, usuarios y procesos. Muchos proyectos combinan ambas, como una web pública con un panel de administración detrás.",
      },
      { kind: "h3", text: "¿Qué es un MVP y por qué me conviene empezar por ahí?" },
      {
        kind: "p",
        text: "Un MVP es la versión mínima que ya aporta valor real. Te permite lanzar antes, gastar menos y aprender de usuarios reales antes de invertir en funciones que quizá no necesitas.",
      },
      { kind: "h3", text: "¿Pueden integrar pagos y otras herramientas que ya uso?" },
      {
        kind: "p",
        text: "Sí. Integramos pasarelas de pago, correos, WhatsApp, almacenamiento en la nube y APIs de terceros según tu operación.",
      },
      { kind: "h3", text: "¿La app es solo web o también móvil?" },
      {
        kind: "p",
        text: "Construimos aplicaciones web que funcionan perfecto en el navegador del celular. Si tu proyecto necesita una app nativa en las tiendas, lo conversamos y definimos el mejor camino.",
      },
      { kind: "h3", text: "¿El código y los datos son míos?" },
      {
        kind: "p",
        text: "Sí. Repositorio, accesos, base de datos y documentación quedan a tu nombre desde el inicio.",
      },
    ],
    cta: {
      title: "Cuéntanos qué quieres construir",
      subtitle:
        "Si tienes una idea o un proceso que te está quitando tiempo, hablemos. Te enviamos una propuesta con alcance, tiempos y precio en 48 horas, y te decimos con honestidad si vale la pena construirlo a medida.",
    },
  },
  {
    slug: "ecommerce",
    seo: {
      title: "Desarrollo de Tiendas Virtuales y E-commerce en Colombia | XyraCode",
      description:
        "Desarrollo de tiendas virtuales a medida en Colombia: catálogo, carrito, pagos con Wompi, PayU o PSE y panel propio. El código es tuyo y cotizamos en 48h.",
    },
    lastModified: "2026-07-24",
    /**
     * "Tienda virtual" es el término con que se busca esto en Colombia;
     * "tienda online" y "e-commerce" son las variantes. El anchor text lleva
     * el primero y el cuerpo cubre los tres: misma intención, tres formas de
     * escribirla. No volver a dejar la página hablando solo de "e-commerce".
     */
    serviceType: "Desarrollo de tiendas virtuales",
    card: {
      title: "Tiendas virtuales (e-commerce)",
      summary:
        "Catálogo, carrito, pagos y un panel propio para gestionar pedidos e inventario.",
    },
    related: ["desarrollo-web", "apps-a-medida", "desarrollo-web-villavicencio"],
    hero: {
      eyebrow: "E-commerce",
      h1: "Desarrollo de tiendas virtuales a medida en Colombia",
      intro:
        "Tu negocio abierto 24/7 y vendiendo sin fricción: catálogo, carrito, pagos y un panel propio para gestionar pedidos e inventario. Rápida, medible y hecha a tu catálogo, sin las limitaciones de una plantilla.",
    },
    features: [
      {
        icon: ShoppingCart,
        title: "Catálogo y checkout",
        desc: "Productos, variantes y un checkout optimizado para que el cliente pague en los menos pasos posibles.",
      },
      {
        icon: Gauge,
        title: "Rendimiento que no pierde ventas",
        desc: "Velocidad y Core Web Vitals cuidados: cada segundo de más es un carrito abandonado.",
      },
      {
        icon: LayoutDashboard,
        title: "Panel de administración",
        desc: "Gestiona productos, precios, inventario y pedidos sin tocar código ni depender de nadie.",
      },
    ],
    body: [
      { kind: "h2", text: "Qué es una tienda virtual a medida" },
      {
        kind: "p",
        text: "Una tienda virtual (también la vas a ver como tienda online o e-commerce: es lo mismo) es tu negocio abierto 24/7: un sitio donde tus clientes ven productos, agregan al carrito, pagan y reciben confirmación, mientras tú gestionas pedidos, inventario y clientes desde un panel propio. Hacerla a medida significa que no te amoldas a las limitaciones de una plantilla: la tienda se ajusta a tu catálogo, tus formas de pago y tu manera de despachar.",
      },
      {
        kind: "p",
        text: "En XyraCode construimos tiendas virtuales rápidas, medibles y a medida, con el mismo stack de productos modernos: React, Next.js, Node, PostgreSQL y las pasarelas de pago que de verdad se usan en Colombia. La velocidad importa el doble en una tienda: cada segundo de más en cargar es gente que abandona el carrito antes de pagar.",
      },
      {
        kind: "p",
        text: "Y no, una tienda a medida no es un lujo reservado a las marcas grandes. Ese es el mito que nos hace competencia: que si estás empezando solo te queda alquilar una plantilla. Nosotros ajustamos el alcance y la tarifa al tamaño de tu negocio, arrancando por lo esencial (catálogo, carrito, pagos y panel) y sumando por fases a medida que vendes. Prefieres pagar una vez por algo que es tuyo, en vez de una mensualidad más una comisión sobre cada venta que crece justo cuando te empieza a ir bien.",
      },
      { kind: "h2", text: "Para quién es este servicio" },
      {
        kind: "p",
        text: "Este servicio es para ti si ya vendes (por WhatsApp, redes o presencial) y quieres profesionalizar la venta en línea, si te quedaste corto con una plataforma cerrada, o si tu catálogo y tu operación necesitan reglas que una tienda genérica no permite.",
      },
      { kind: "p", text: "Trabajamos bien con:" },
      {
        kind: "ul",
        items: [
          "Marcas y productores que quieren vender directo al consumidor sin comisiones altas de terceros.",
          "Negocios que venden por WhatsApp y quieren ordenar pedidos, pagos e inventario.",
          "Tiendas con catálogo particular (variantes, reservas, productos por temporada) que no encaja en plantillas.",
          "Emprendimientos locales de Villavicencio y toda Colombia listos para dar el salto al comercio electrónico.",
        ],
      },
      {
        kind: "p",
        text: [
          "Trabajamos con negocios de todo el país por videollamada, y si estás en la región tenemos la opción de vernos en persona: mira cómo trabajamos el ",
          {
            text: "desarrollo web en Villavicencio y el Meta",
            href: "/servicios/desarrollo-web-villavicencio",
          },
          ".",
        ],
      },
      { kind: "h2", text: "Qué incluye" },
      {
        kind: "p",
        text: "Una tienda online con nosotros incluye todo lo necesario para vender y administrar, no solo el catálogo bonito:",
      },
      {
        kind: "ul",
        items: [
          "Catálogo de productos con categorías, variantes, fotos y buscador.",
          "Carrito y checkout optimizados para que el cliente pague en los menos pasos posibles.",
          "Pasarela de pagos integrada: Wompi, PayU, Mercado Pago, ePayco o Bold, con tarjetas, PSE y billeteras como Nequi.",
          "Panel de administración para gestionar productos, precios, inventario y pedidos sin depender de nadie.",
          "Gestión de pedidos y estados (recibido, pagado, enviado, entregado) y notificaciones al cliente.",
          "Emails transaccionales: confirmación de compra, actualización de envío y recuperación de carrito.",
          "SEO técnico y rendimiento: fichas de producto indexables y carga veloz para no perder ventas.",
          "Analítica de ventas para saber qué productos y canales funcionan.",
        ],
      },
      { kind: "h2", text: "Cómo trabajamos" },
      {
        kind: "p",
        text: "Una tienda toca dinero real, así que trabajamos con cuidado y con entregas que puedes probar antes de abrir al público.",
      },
      {
        kind: "ul",
        items: [
          "Descubrimiento. Entendemos tu catálogo, tus formas de pago y envío, y cómo despachas hoy. Definimos las reglas del negocio.",
          "Diseño. Prototipamos la experiencia de compra y el panel de administración, y los validamos contigo.",
          "Desarrollo por sprints. Construimos catálogo, checkout, pagos y panel, con entregas semanales que revisas en una URL real.",
          "Lanzamiento. Hacemos pruebas de compra de punta a punta, configuramos la pasarela real y salimos a producción con medición activa.",
        ],
      },
      {
        kind: "p",
        text: "Hablas siempre con quien construye tu tienda. Y si en el camino veo una forma de que vendas más o gastes menos, te lo digo.",
      },
      { kind: "h2", text: "Un caso real: Vuelo Carmesí" },
      {
        kind: "p",
        text: [
          "Vuelo Carmesí es una finca de agroturismo de cacao en Cubarral, Meta, que vendía sus productos por WhatsApp y coordinaba visitas a mano. Le construimos una tienda virtual con catálogo, carrito y checkout, más un panel donde ve pedidos, reservas, ingresos y stock bajo en la misma pantalla. Puedes ver el detalle en ",
          { text: "el caso de estudio completo", href: CASO_VUELO_CARMESI },
          ".",
        ],
      },
      {
        kind: "image",
        src: "/assets/projects/vuelo-carmesi/3.png",
        alt: "Carrito de compras de la tienda virtual de Vuelo Carmesí, con el resumen del pedido y el botón de checkout",
        width: 1898,
        height: 868,
        caption: "Carrito y resumen de pedido de la tienda de Vuelo Carmesí, en producción.",
      },
      { kind: "h2", text: "Tecnologías que usamos" },
      {
        kind: "ul",
        items: [
          "Next.js y React para una tienda veloz y bien posicionada en Google.",
          "Node y PostgreSQL para manejar productos, pedidos e inventario de forma confiable.",
          "TypeScript para reducir errores en algo tan sensible como cobrar.",
          "Pasarelas de pago colombianas (Wompi, PayU, Mercado Pago, ePayco, Bold) integradas según tus comisiones y tu volumen.",
          "Servicios de email y almacenamiento de imágenes en la nube (como Cloudinary) para catálogo y notificaciones.",
        ],
      },
      { kind: "h2", text: "Entregables y tiempos" },
      {
        kind: "p",
        text: "Recibes la tienda en producción, el panel de administración, el repositorio con todos los accesos a tu nombre, la documentación y una capacitación para que gestiones productos y pedidos con autonomía.",
      },
      {
        kind: "p",
        text: "Como referencia, una tienda con catálogo, checkout, pagos y panel suele tomar entre 4 y 8 semanas, según el tamaño del catálogo, las integraciones y las reglas de negocio. Te entregamos alcance, tiempos y precio en la propuesta, que llega en menos de 48 horas.",
      },
      { kind: "h2", text: "¿Tienda a medida o plataforma como Shopify?" },
      {
        kind: "p",
        text: "Es la pregunta que más nos hacen. Shopify y WooCommerce son buenas herramientas y salen baratas el primer mes; lo que casi nadie te cuenta es lo que cuestan al año, entre plan, apps y comisión sobre cada venta. Antes de decidir por el precio de arranque, mira la foto completa:",
      },
      {
        kind: "table",
        head: ["Criterio", "Tienda a medida", "Shopify", "WooCommerce"],
        rows: [
          [
            "Inversión inicial",
            "Ajustable: definimos el alcance según tu presupuesto",
            "Baja: plantilla y listo",
            "Media: plantilla más configuración",
          ],
          [
            "Costo mensual",
            "Solo hosting y dominio, sin comisión por venta",
            "Plan mensual más comisión sobre cada venta",
            "Hosting, plugins y licencias que se renuevan",
          ],
          [
            "Qué pasa si vendes más",
            "Pagas lo mismo",
            "Pagas más: la comisión sube con tus ventas",
            "Pagas más plugins a medida que creces",
          ],
          ["Tiempo de salida", "4 a 8 semanas", "Días", "1 a 3 semanas"],
          [
            "Reglas de negocio propias",
            "Sin límite",
            "Solo lo que permita una app del store",
            "Según el plugin que exista",
          ],
          [
            "Velocidad",
            "Bajo nuestro control",
            "Buena, pero poco ajustable",
            "Depende de cuántos plugins cargues",
          ],
          ["Dueño del código", "Tú", "Shopify", "Tú, sobre WordPress"],
          [
            "Conviene cuando",
            "Quieres que la tienda sea tuya y no ceder un porcentaje de cada venta",
            "Necesitas publicar esta semana y la comisión no te preocupa",
            "Ya usas WordPress y tu catálogo es simple",
          ],
        ],
        caption:
          "Comparativa orientativa entre las tres formas de montar una tienda en Colombia.",
      },
      {
        kind: "p",
        text: "Si estás empezando, esa columna de la izquierda sigue siendo para ti: no cotizamos a todos con la misma vara. Definimos juntos qué necesitas de verdad para la primera versión, la sacamos con eso, y el resto se suma cuando las ventas lo pidan. Así una marca que arranca paga lo que corresponde a su tamaño y no una tarifa pensada para una empresa grande.",
      },
      {
        kind: "p",
        text: "Cuéntanos qué vendes y con qué presupuesto cuentas, y te decimos con números si te sirve más una tienda a medida o una plataforma. Si en tu caso la respuesta es la plataforma, te lo vamos a decir igual.",
      },
      { kind: "h2", text: "Preguntas frecuentes" },
      { kind: "h3", text: "¿Cuánto cuesta una tienda online en Colombia?" },
      {
        kind: "p",
        text: [
          "Depende del tamaño del catálogo, las pasarelas de pago, los envíos y las reglas de tu negocio. En ",
          {
            text: "nuestra guía de costos de un proyecto web en Colombia",
            href: GUIA_PRECIOS,
          },
          " explicamos qué se paga una vez y qué cada mes; para tu caso te cotizamos en 48 horas.",
        ],
      },
      { kind: "h3", text: "¿Qué medios de pago puedo ofrecer?" },
      {
        kind: "p",
        text: "Integramos las pasarelas más usadas en Colombia: Wompi, PayU, Mercado Pago, ePayco y Bold. Con cualquiera de ellas tus clientes pagan con tarjeta, PSE o billeteras como Nequi. Elegimos la que mejor se ajuste a tus comisiones y a tu volumen; si ya tienes una cuenta abierta, trabajamos con esa.",
      },
      { kind: "h3", text: "¿Puedo administrar la tienda yo mismo?" },
      {
        kind: "p",
        text: "Sí. Te entregamos un panel para gestionar productos, precios, inventario y pedidos sin tocar código, más una capacitación para usarlo.",
      },
      { kind: "h3", text: "¿Me conviene una tienda a medida o una plataforma como Shopify?" },
      {
        kind: "p",
        text: "Shopify te saca a vender en días y sale barato el primer mes, pero se queda con un porcentaje de cada venta y la tienda nunca es tuya. Una tienda a medida se paga una vez, no cobra comisión y crece con las reglas de tu negocio. Y no hace falta ser una empresa grande: ajustamos el alcance de la primera versión a tu presupuesto y sumamos por fases. Dinos qué vendes y lo comparamos con números sobre tu caso.",
      },
      { kind: "h3", text: "¿La tienda va a cargar rápido?" },
      {
        kind: "p",
        text: "Sí, es una prioridad. Optimizamos velocidad y Core Web Vitals porque en e-commerce la lentitud se paga en carritos abandonados.",
      },
    ],
    cta: {
      title: "Abre tu tienda con bases sólidas",
      subtitle:
        "Cuéntanos qué vendes y cómo despachas, y te enviamos una propuesta clara en 48 horas. Sin plantillas genéricas y sin promesas vacías: una tienda que es tuya y está hecha para vender.",
    },
  },
  {
    slug: "desarrollo-web-villavicencio",
    seo: {
      title: "Desarrollo Web en Villavicencio y el Meta | XyraCode",
      description:
        "Agencia de desarrollo web en Villavicencio y todo el Meta. Sitios, tiendas y apps a medida, con atención directa del dev y propuesta en 48h. Cotiza tu proyecto.",
    },
    lastModified: "2026-07-24",
    card: {
      title: "Desarrollo web en Villavicencio",
      summary:
        "Sitios, tiendas y apps para negocios del Meta, con la opción de vernos en persona.",
    },
    related: ["desarrollo-web", "ecommerce", "apps-a-medida"],
    hero: {
      eyebrow: "Desarrollo web en Villavicencio",
      h1: "Desarrollo web en Villavicencio, hecho por alguien de aquí",
      intro:
        "Agencia de desarrollo web y software con base en Villavicencio, para negocios de la región y de toda Colombia. Mismos estándares que un producto moderno, con la cercanía de hablar con quien construye tu proyecto.",
    },
    features: [
      {
        icon: MapPin,
        title: "Cercanía real",
        desc: "Reuniones presenciales cuando el proyecto lo amerita y contexto del mercado del Meta, además de videollamada.",
      },
      {
        icon: Globe,
        title: "Sitios, tiendas y apps",
        desc: "Construimos sitios corporativos, e-commerce y plataformas a medida para negocios de Villavicencio y toda Colombia.",
      },
      {
        icon: Code2,
        title: "Mismos estándares globales",
        desc: "El mismo stack y las mismas prácticas que usan los productos modernos del mundo, con base local.",
      },
    ],
    body: [
      { kind: "h2", text: "Una agencia de desarrollo web con base en Villavicencio" },
      {
        kind: "p",
        text: "XyraCode nace y opera desde Villavicencio, la puerta del llano. Construimos sitios web, tiendas online y aplicaciones a medida, con código propio y sin plantillas.",
      },
      {
        kind: "p",
        text: "Podríamos trabajar desde cualquier parte; nos quedamos en Villavicencio porque desde aquí se construye igual de bien y se vive mejor. Y para un negocio local hay una ventaja concreta: hablas con alguien que conoce el mercado del Meta, que entiende cómo compra la gente de la región y que está a un clic (o a una reunión presencial) de distancia.",
      },
      {
        kind: "p",
        text: "Atendemos todo el departamento, no solo la capital: trabajamos con negocios de Acacías, Granada, Puerto López, Cumaral, Restrepo y San Martín. Para los proyectos del Meta la cercanía es real y podemos vernos en persona; para el resto del país, la videollamada funciona igual de bien.",
      },
      {
        kind: "p",
        text: 'Si buscas "desarrollo web en Villavicencio" es probable que quieras dos cosas: un sitio profesional que traiga clientes y alguien cercano y confiable que lo construya. Eso es exactamente lo que hacemos.',
      },
      { kind: "h2", text: "Por qué elegir un desarrollador local" },
      { kind: "p", text: "Contratar a alguien de tu ciudad no es solo comodidad; cambia cómo se trabaja:" },
      {
        kind: "ul",
        items: [
          "Cercanía real. Podemos reunirnos presencialmente cuando el proyecto lo amerite, además de las videollamadas.",
          "Contexto de mercado. Entendemos cómo se mueve el comercio en Villavicencio y el Meta, y qué genera confianza en clientes de la región.",
          "Comunicación directa. Hablas con quien construye tu proyecto, sin intermediarios ni gerentes de cuenta que traduzcan mal lo que pediste.",
          "Compromiso con lo local. Nos importa que a los negocios de la región les vaya bien; tu éxito es nuestra mejor carta de presentación.",
        ],
      },
      {
        kind: "p",
        text: "Al mismo tiempo, no estamos limitados a lo local: usamos las mismas herramientas y estándares que cualquier producto moderno del mundo. Tu negocio en Villavicencio compite con un sitio tan rápido y bien hecho como el de cualquier empresa grande.",
      },
      { kind: "h2", text: "Qué construimos para negocios de Villavicencio" },
      {
        kind: "ul",
        items: [
          "Sitios web corporativos y landing pages para profesionales, comercios y empresas de la región que quieren presencia seria en internet.",
          "Tiendas online (e-commerce) para marcas y productores del Meta que quieren vender más allá del mostrador.",
          "Aplicaciones y plataformas a medida para ordenar reservas, citas, pedidos o procesos internos.",
          "Renovación de sitios viejos o lentos que ya no traen clientes ni se pueden actualizar.",
        ],
      },
      {
        kind: "p",
        text: "Todo con SEO técnico de base para que aparezcas en Google cuando alguien busque tu servicio en la ciudad, y con la velocidad que hoy exigen tanto los usuarios como el buscador.",
      },
      { kind: "h2", text: "Cómo trabajamos" },
      { kind: "p", text: "El proceso es el mismo rigor, estés en Villavicencio o en cualquier parte del país:" },
      {
        kind: "ul",
        items: [
          "Descubrimiento. Nos reunimos (presencial o por videollamada) para entender tu negocio, tus clientes y qué debe lograr el proyecto.",
          "Diseño. Prototipamos y validamos contigo antes de programar.",
          "Desarrollo por sprints. Entregas semanales que revisas en una URL real, desde el celular si quieres.",
          "Lanzamiento y soporte. Deploy, medición y acompañamiento para que el proyecto arranque en firme.",
        ],
      },
      {
        kind: "p",
        text: "Tomamos máximo 3 proyectos a la vez, así que el tuyo avanza todas las semanas con atención de verdad. Y si tu idea se resuelve con una herramienta económica en lugar de un desarrollo a medida, te lo digo: prefiero perder una venta que venderte algo que no necesitas.",
      },
      { kind: "h2", text: "Tecnologías que usamos" },
      {
        kind: "p",
        text: "Trabajamos con el mismo stack de los productos modernos: React, Next.js, Node, TypeScript, Tailwind y PostgreSQL. Es un stack rápido, estable y con comunidad grande, lo que significa que tu proyecto será veloz hoy y mantenible mañana. Todo el código queda documentado y a tu nombre desde el día uno.",
      },
      { kind: "h2", text: "Preguntas frecuentes" },
      { kind: "h3", text: "¿Atienden solo a clientes de Villavicencio?" },
      {
        kind: "p",
        text: "No. Tenemos base en Villavicencio, pero trabajamos con clientes de toda Colombia y del exterior. La diferencia con los negocios locales es que podemos vernos en persona cuando haga falta.",
      },
      { kind: "h3", text: "¿Cuánto cuesta una página web en Villavicencio?" },
      {
        kind: "p",
        text: [
          "Depende del alcance del proyecto. Escribimos ",
          {
            text: "una guía con el desglose de costos de una web en Colombia",
            href: GUIA_PRECIOS,
          },
          ", y para tu caso puntual te enviamos una cotización en 48 horas.",
        ],
      },
      { kind: "h3", text: "¿Pueden reunirse en persona?" },
      {
        kind: "p",
        text: "Sí, cuando el proyecto lo amerite. También trabajamos muy bien por videollamada, que suele ser lo más práctico para avanzar rápido.",
      },
      { kind: "h3", text: "¿Mi negocio local va a aparecer en Google?" },
      {
        kind: "p",
        text: "Construimos con SEO técnico de base y buenas prácticas para búsquedas locales. Posicionar toma tiempo y constancia, pero salimos con los cimientos correctos para competir en tu ciudad.",
      },
      { kind: "h3", text: "¿El código es mío?" },
      {
        kind: "p",
        text: "Sí. Repositorio, accesos y documentación quedan a tu nombre desde el inicio. Si mañana quieres cambiar de equipo, te vas sin rehenes.",
      },
    ],
    cta: {
      title: "Hablemos de tu proyecto en Villavicencio",
      subtitle:
        "Cuéntame qué necesita tu negocio y te envío una propuesta con alcance, tiempos y precio en 48 horas. Estemos en el mismo café de Villavicencio o en una videollamada, tendrás la atención directa de quien construye tu proyecto.",
    },
  },
];
