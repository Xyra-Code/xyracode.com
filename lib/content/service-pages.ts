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
  hero: { eyebrow: string; h1: string; intro: string };
  /** Grid "Qué incluye" (3 tarjetas). */
  features: ServiceFeature[];
  /** Cuerpo largo para SEO: proceso, tecnologías, FAQ… El "más texto". */
  body: Block[];
  cta: { title: string; subtitle: string };
};

export const SERVICE_PAGES: ServicePage[] = [
  {
    slug: "desarrollo-web",
    seo: {
      title: "Desarrollo Web a Medida en Colombia | XyraCode",
      description:
        "Sitios web rápidos, medibles y a medida, sin plantillas. Código propio, comunicación directa con el dev y primera propuesta en 48h. Cotiza tu proyecto.",
    },
    lastModified: "2026-07-13",
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
      { kind: "p", text: "¿Cuánto cuesta un sitio web a medida?" },
      {
        kind: "p",
        text: "Depende del alcance: número de páginas, funcionalidades, integraciones y diseño. Escribimos una guía completa sobre precios del mercado colombiano en 2026 que te da rangos reales. Para tu caso puntual, te enviamos una cotización clara en 48 horas.",
      },
      { kind: "p", text: "¿El sitio va a aparecer en Google?" },
      {
        kind: "p",
        text: "Construimos con SEO técnico desde la base para que Google pueda entender e indexar tu sitio. Posicionar por palabras clave competidas toma tiempo y contenido constante, pero salimos con los cimientos correctos.",
      },
      { kind: "p", text: "¿Puedo actualizar el contenido yo mismo?" },
      {
        kind: "p",
        text: "Sí. Según tu proyecto, dejamos el contenido editable o conectamos un gestor para que cambies textos e imágenes sin depender de nosotros.",
      },
      { kind: "p", text: "¿El código es mío?" },
      {
        kind: "p",
        text: "Totalmente. Repositorio, accesos y documentación quedan a tu nombre desde el día uno. Si mañana quieres trabajar con otro equipo, te vas sin rehenes.",
      },
      { kind: "p", text: "¿Trabajan con clientes fuera de Villavicencio?" },
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
    lastModified: "2026-07-13",
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
      { kind: "p", text: "¿Cuál es la diferencia entre una web y una app a medida?" },
      {
        kind: "p",
        text: "Una web informa y capta clientes; una app opera tu negocio: gestiona datos, usuarios y procesos. Muchos proyectos combinan ambas, como una web pública con un panel de administración detrás.",
      },
      { kind: "p", text: "¿Qué es un MVP y por qué me conviene empezar por ahí?" },
      {
        kind: "p",
        text: "Un MVP es la versión mínima que ya aporta valor real. Te permite lanzar antes, gastar menos y aprender de usuarios reales antes de invertir en funciones que quizá no necesitas.",
      },
      { kind: "p", text: "¿Pueden integrar pagos y otras herramientas que ya uso?" },
      {
        kind: "p",
        text: "Sí. Integramos pasarelas de pago, correos, WhatsApp, almacenamiento en la nube y APIs de terceros según tu operación.",
      },
      { kind: "p", text: "¿La app es solo web o también móvil?" },
      {
        kind: "p",
        text: "Construimos aplicaciones web que funcionan perfecto en el navegador del celular. Si tu proyecto necesita una app nativa en las tiendas, lo conversamos y definimos el mejor camino.",
      },
      { kind: "p", text: "¿El código y los datos son míos?" },
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
      title: "Desarrollo de Tiendas Online (E-commerce) | XyraCode Colombia",
      description:
        "Tiendas online a medida en Colombia: rápidas, con pagos, inventario y panel propio. Código tuyo y primera propuesta en 48h. Empieza a vender en línea.",
    },
    lastModified: "2026-07-13",
    hero: {
      eyebrow: "E-commerce",
      h1: "Tiendas online a medida para vender sin fricción",
      intro:
        "Tu negocio abierto 24/7: catálogo, carrito, pagos y un panel propio para gestionar pedidos e inventario. Rápida, medible y hecha a tu catálogo, sin las limitaciones de una plantilla.",
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
      { kind: "h2", text: "Qué es una tienda online a medida" },
      {
        kind: "p",
        text: "Una tienda online (o e-commerce) es tu negocio abierto 24/7: un sitio donde tus clientes ven productos, agregan al carrito, pagan y reciben confirmación, mientras tú gestionas pedidos, inventario y clientes desde un panel propio. Hacerla a medida significa que no te amoldas a las limitaciones de una plantilla: la tienda se ajusta a tu catálogo, tus formas de pago y tu manera de despachar.",
      },
      {
        kind: "p",
        text: "En XyraCode construimos e-commerce rápido, medible y a medida, con el mismo stack de productos modernos: React, Next.js, Node, PostgreSQL y las pasarelas de pago que usan los negocios en Colombia. La velocidad importa el doble en una tienda: cada segundo de más en cargar es gente que abandona el carrito antes de pagar.",
      },
      {
        kind: "p",
        text: "Ahora, seamos honestos: no todo negocio necesita una tienda a medida desde el día uno. Si estás validando si tus productos se venden en línea, a veces conviene empezar con una plataforma existente y migrar a medida cuando el volumen lo justifique. Te lo decimos de frente. El desarrollo a medida rinde cuando tienes catálogo propio, márgenes que sostienen la inversión, o necesidades que las plataformas cerradas no cubren.",
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
          "Pasarela de pagos integrada (tarjetas, PSE y billeteras, según lo que uses en Colombia).",
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
      { kind: "h2", text: "Tecnologías que usamos" },
      {
        kind: "ul",
        items: [
          "Next.js y React para una tienda veloz y bien posicionada en Google.",
          "Node y PostgreSQL para manejar productos, pedidos e inventario de forma confiable.",
          "TypeScript para reducir errores en algo tan sensible como cobrar.",
          "Pasarelas de pago integradas según tu operación en Colombia.",
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
      { kind: "h2", text: "Preguntas frecuentes" },
      { kind: "p", text: "¿Cuánto cuesta una tienda online en Colombia?" },
      {
        kind: "p",
        text: "Depende del tamaño del catálogo, las pasarelas de pago, los envíos y las reglas de tu negocio. En nuestra guía de precios del mercado colombiano 2026 damos rangos de referencia; para tu caso te cotizamos en 48 horas.",
      },
      { kind: "p", text: "¿Qué medios de pago puedo ofrecer?" },
      {
        kind: "p",
        text: "Integramos las pasarelas más usadas en Colombia (tarjetas, PSE, billeteras digitales). Elegimos la que mejor se ajuste a tus comisiones y a tu volumen.",
      },
      { kind: "p", text: "¿Puedo administrar la tienda yo mismo?" },
      {
        kind: "p",
        text: "Sí. Te entregamos un panel para gestionar productos, precios, inventario y pedidos sin tocar código, más una capacitación para usarlo.",
      },
      { kind: "p", text: "¿Me conviene una tienda a medida o una plataforma como Shopify?" },
      {
        kind: "p",
        text: "Depende de tu etapa. Si estás validando, a veces una plataforma cerrada es más rápida para arrancar. Si ya tienes volumen, catálogo particular o quieres control total y menos comisiones, la tienda a medida rinde más. Lo evaluamos contigo con honestidad.",
      },
      { kind: "p", text: "¿La tienda va a cargar rápido?" },
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
      title: "Desarrollo Web en Villavicencio | XyraCode",
      description:
        "Agencia de desarrollo web en Villavicencio. Sitios, tiendas y apps a medida, con atención directa del dev y propuesta en 48h. Cotiza tu proyecto local.",
    },
    lastModified: "2026-07-13",
    hero: {
      eyebrow: "Desarrollo web en Villavicencio",
      h1: "Desarrollo web en Villavicencio, hecho por alguien de aquí",
      intro:
        "Estudio de desarrollo web y software con base en Villavicencio, para negocios de la región y de toda Colombia. Mismos estándares que un producto moderno, con la cercanía de hablar con quien construye tu proyecto.",
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
        text: "XyraCode es un estudio de desarrollo web y software con base en Villavicencio, la puerta del llano. Construimos sitios web, tiendas online y aplicaciones a medida para negocios de la región y de toda Colombia, con código propio y sin plantillas.",
      },
      {
        kind: "p",
        text: "Podríamos trabajar desde cualquier parte; nos quedamos en Villavicencio porque desde aquí se construye igual de bien y se vive mejor. Y para un negocio local hay una ventaja concreta: hablas con alguien que conoce el mercado del Meta, que entiende cómo compra la gente de la región y que está a un clic (o a una reunión presencial) de distancia.",
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
      { kind: "p", text: "¿Atienden solo a clientes de Villavicencio?" },
      {
        kind: "p",
        text: "No. Tenemos base en Villavicencio, pero trabajamos con clientes de toda Colombia y del exterior. La diferencia con los negocios locales es que podemos vernos en persona cuando haga falta.",
      },
      { kind: "p", text: "¿Cuánto cuesta una página web en Villavicencio?" },
      {
        kind: "p",
        text: "Depende del alcance del proyecto. Escribimos una guía con rangos reales del mercado colombiano 2026, y para tu caso puntual te enviamos una cotización en 48 horas.",
      },
      { kind: "p", text: "¿Pueden reunirse en persona?" },
      {
        kind: "p",
        text: "Sí, cuando el proyecto lo amerite. También trabajamos muy bien por videollamada, que suele ser lo más práctico para avanzar rápido.",
      },
      { kind: "p", text: "¿Mi negocio local va a aparecer en Google?" },
      {
        kind: "p",
        text: "Construimos con SEO técnico de base y buenas prácticas para búsquedas locales. Posicionar toma tiempo y constancia, pero salimos con los cimientos correctos para competir en tu ciudad.",
      },
      { kind: "p", text: "¿El código es mío?" },
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
