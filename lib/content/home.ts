import type { Inline } from "./blocks";

// ---------- Hero ----------

export type Stat = { value: string; label: string };


export const STATS: Stat[] = [
  { value: "100%", label: "Código propio, sin plantillas" },
  { value: "1:1", label: "Comunicación directa con el dev" },
  { value: "48h", label: "Primera propuesta" },
];

// ---------- Trust strip ----------

export const STACK = [
  "React",
  "Next.js",
  "Node",
  "TypeScript",
  "Tailwind",
  "PostgreSQL",
] as const;

// ---------- Contexto y preguntas frecuentes (home) ----------

/**
 * La home tenía 368 palabras de texto visible: menos de un tercio que cualquier
 * página de servicio, siendo la URL con más autoridad del dominio. Estos dos
 * bloques le dan superficie temática y, de paso, son el sitio natural para los
 * enlaces contextuales hacia las páginas de servicio y la página local.
 */
export const HOME_INTRO = {
  eyebrow: "Por qué nos buscan",
  title: "Software que se adapta a tu operación, no al revés",
  paragraphs: [
    [
      "Casi siempre nos escriben por uno de dos problemas: una web que ya no acompaña lo que el negocio vende, o una operación que se quedó grande para las hojas de cálculo. XyraCode es una agencia colombiana de desarrollo web y software a medida: trabajamos desde ",
      {
        text: "Villavicencio, Meta",
        href: "/servicios/desarrollo-web-villavicencio",
      },
      ", con clientes de todo el país, y en los dos casos el punto de partida es el mismo: entender cómo funciona tu negocio antes de escribir una línea de código.",
    ],
    [
      "El origen del problema suele ser el mismo: el sitio se armó sobre una plantilla que no se deja tocar. Nosotros no usamos plantillas ni constructores. Cada proyecto se escribe en código propio, lo que significa que puedes cambiar cualquier cosa después y que el sitio no depende de la licencia de nadie. Según lo que necesites, eso toma la forma de un ",
      { text: "sitio web a medida", href: "/servicios/desarrollo-web" },
      ", una ",
      { text: "tienda online", href: "/servicios/ecommerce" },
      " o una ",
      { text: "aplicación que opere tu negocio", href: "/servicios/apps-a-medida" },
      ". Si no sabes cuál de los tres es tu caso, la ",
      { text: "página de servicios", href: "/servicios" },
      " los compara lado a lado.",
    ],
    [
      "Y no hay intermediarios: hablas directamente con quien escribe el código, no con alguien que traduce lo que pediste, y eso se nota en los tiempos y en las decisiones que se toman por el camino. Puedes ver ",
      { text: "cómo trabajamos en un proyecto real", href: "/proyectos" },
      " o ",
      { text: "quién está detrás", href: "/nosotros" },
      ".",
    ],
  ] satisfies Inline[][],
} as const;

export type Faq = { q: string; a: string | Inline[] };

export const HOME_FAQ = {
  eyebrow: "Antes de escribir",
  title: "Preguntas que nos hacen siempre",
  items: [
    {
      q: "¿Cuánto cuesta una página web?",
      a: [
        "No hay un precio de \"una web\": hay un precio de un alcance. Una landing de una sección y un sitio de doce páginas con panel de administración son ambos \"desarrollo web\" y no cuestan lo mismo. Desglosamos ítem por ítem de qué se compone el costo en ",
        {
          text: "nuestra guía de precios de una web en Colombia",
          href: "/blog/cuanto-cuesta-una-web-colombia-2026",
        },
        ", y te damos precio cerrado en la propuesta.",
      ],
    },
    {
      q: "¿Cuánto se demora un proyecto?",
      a: "Una landing suele tomar de dos a tres semanas; un sitio corporativo, de cuatro a seis; una tienda o una aplicación a medida, varias semanas o meses según el alcance. Lo que más retrasa proyectos no es el desarrollo: son los textos, las fotos y las aprobaciones que salen de tu lado.",
    },
    {
      q: "¿Trabajan con clientes fuera de Villavicencio?",
      a: "Sí. Estamos en Villavicencio y ahí podemos reunirnos en persona, pero la mayoría de proyectos se hace en remoto con clientes de otras ciudades de Colombia. El proceso es el mismo: descubrimiento, prototipo, desarrollo por entregas y lanzamiento.",
    },
    {
      q: "¿El código y los accesos quedan a mi nombre?",
      a: "Sí, desde el primer día. Repositorio, dominio, hosting y base de datos quedan a tu nombre. Si algún día decides trabajar con otro equipo, te llevas todo sin pedirnos permiso.",
    },
    {
      q: "¿Se puede actualizar el contenido sin saber programar?",
      a: "Depende de lo que necesites cambiar y con qué frecuencia. Para textos e imágenes que cambian seguido montamos un panel de administración; para un sitio que cambia dos veces al año, mantenerlo en código sale más barato y más rápido. Lo decidimos contigo antes de empezar, no después.",
    },
  ] satisfies Faq[],
} as const;

// ---------- Proceso ----------

export type Step = { title: string; desc: string };

export const STEPS: Step[] = [
  {
    title: "Descubrimiento",
    desc: "Entendemos tu negocio, objetivos y usuarios.",
  },
  { title: "Diseño", desc: "Prototipamos la solución y validamos contigo." },
  {
    title: "Desarrollo",
    desc: "Construimos con código limpio y entregas por sprint.",
  },
  { title: "Lanzamiento", desc: "Deploy, medición y soporte post-launch." },
];
