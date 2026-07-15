import { CONTACT } from "./contact";
import type { Step } from "./home";

// ---------- Nosotros ----------

export const FOUNDER = {
  name: "Yeison Enciso",
  /** Ruta en /public de la foto; si se pone en null, se muestra un marco placeholder. */
  photo: "/assets/team/founder.png" as string | null,
  /** Título corto para JSON-LD (jobTitle). La versión larga vive en ABOUT_TERMINAL. */
  jobTitle: "Fundador & desarrollador full-stack",
  /** Perfil personal de GitHub (fuente única: credenciales + sameAs del JSON-LD). */
  github: "https://github.com/YEENDJ",
  role: "fundador & desarrollador full-stack",
  experience: "1 año construyendo productos web",
} as const;

/** Líneas de la tarjeta terminal `sobre-mi.sh` de /nosotros. */
export const ABOUT_TERMINAL: { key: string; value: string }[] = [
  { key: "rol", value: FOUNDER.role },
  { key: "base", value: `${CONTACT.location} 🇨🇴` },
  {
    key: "herramientas",
    value:
      "React · Next.js · Node · TypeScript · PostgreSQL ",
  },
  { key: "experiencia", value: FOUNDER.experience },
  { key: "proyectos activos", value: "máximo 3 a la vez" },
  { key: "respuesta", value: "primera propuesta en menos de 48h ✓" },
];

/** Manifiesto "Cómo trabajo" de /nosotros. */
export const MANIFESTO: Step[] = [
  {
    title: "Sin teléfono roto",
    desc: "No hay gerente de cuenta que traduzca mal lo que pediste. Me cuentas tu idea y la misma persona la convierte en código.",
  },
  {
    title: "Te aviso cuando algo no conviene",
    desc: "Si tu idea se resuelve con una herramienta de $20 al mes en vez de un desarrollo a medida, te lo digo. Prefiero perder una venta que venderte algo que no necesitas.",
  },
  {
    title: "Pocos proyectos, bien hechos",
    desc: "Tomo máximo 3 proyectos en paralelo. El tuyo avanza todas las semanas, con entregas que puedes ver y probar.",
  },
  {
    title: "Entregas que puedes tocar",
    desc: "No mando reportes de avance en PDF: mando enlaces. Cada semana ves tu proyecto funcionando en una URL real, desde el celular si quieres.",
  },
  {
    title: "Hablo tu idioma, no jerga",
    desc: "Vengo de 10 años en ventas: sé explicar decisiones técnicas en términos de negocio. Nunca sales de una reunión sin entender qué se hizo y por qué.",
  },
  {
    title: "El código es tuyo",
    desc: "Todo lo que construyo te pertenece: repositorio, accesos y documentación a tu nombre desde el día uno. Si mañana quieres trabajar con otro equipo, te vas sin rehenes.",
  },
];

// ---------- Historia (/nosotros) ----------

export type CareerCommit = {
  /** Hash decorativo estilo git, solo visual. */
  hash: string;
  /** Prefijo tipo conventional commit: init, feat, release. */
  tag: string;
  title: string;
  desc: string;
  /** Año o período; si se omite, no se muestra. */
  period?: string;
};

/** Timeline `$ git log --reverse mi-carrera` de /nosotros, en orden cronológico. */
export const CAREER_LOG: CareerCommit[] = [
  {
    hash: "a3f1c02",
    tag: "init",
    title: "Técnico en sistemas",
    desc: "Donde empezó la curiosidad por entender cómo funcionan las cosas por dentro.",
    period: "2012",
  },
  {
    hash: "b7d94e1",
    tag: "feat",
    title: "Más de 10 años vendiendo telecomunicaciones",
    desc: "Una década escuchando clientes, entendiendo mercados y aprendiendo qué hace que un negocio compre o no. Hoy es mi mayor ventaja: entiendo tu negocio antes de escribir la primera línea de código.",
    period: "2015–2025",
  },
  {
    hash: "c2e58a9",
    tag: "feat",
    title: "Certificación full-stack en Henry",
    desc: "Formación intensiva en desarrollo web full-stack: JavaScript, React, Node y bases de datos, con proyectos reales en equipo.",
    period: "2025–2026",
  },
  {
    hash: "d915f3c",
    tag: "feat",
    title: "Primeros proyectos freelance",
    desc: "Encargos reales para clientes reales. Descubrí que lo mío es construir productos de punta a punta.",
    period: "2026",
  },
  {
    hash: "e4a07bd",
    tag: "release",
    title: "XyraCode v1.0",
    desc: "Lo formalicé: una agencia enfocada en construir y aportar valor a tu proyecto.",
    period: "2026",
  },
];

// ---------- Credenciales (/nosotros) ----------

export type CredentialLink = { href: string; label: string };

export type Credential = {
  title: string;
  /** Entidad emisora; si se omite, no se muestra. */
  issuer?: string;
  desc: string;
  /** Enlaces externos; la tarjeta renderiza un botón por cada uno. */
  links?: CredentialLink[];
  /** Imagen del certificado en /public; si se omite, la tarjeta no muestra imagen. */
  image?: string;
  /** true = tarjeta protagonista (ancho completo en desktop). */
  featured?: boolean;
};

export const CREDENTIALS: Credential[] = [
  {
    title: "Desarrollador Full-Stack",
    issuer: "Henry",
    desc: "Bootcamp intensivo de desarrollo web: JavaScript, React, Node y bases de datos, con proyectos reales en equipo.",
    links: [
      {
        href: "https://certs.soyhenry.com/certificates/7e403f3b-af18-4064-872c-9b43356ff023/2ddfa6c9-e142-4b74-ae7c-74383b67df2c/certificate.pdf",
        label: "Verificar certificado",
      },
    ],
    image: "/assets/certificates/henry.png",
    featured: true,
  },
  {
    title: "Técnico en Sistemas",
    issuer: "SENA",
    // OJO: page.tsx reemplaza este desc por un párrafo JSX con link a certificados.sena.edu.co.
    desc: "La base: hardware, redes y sistemas por dentro antes de escribir software. Título firmado digitalmente, verificable en certificados.sena.edu.co.",
    links: [
      { href: "/assets/certificates/sena.pdf", label: "Ver certificado" },
    ],
  },
  {
    title: "Código abierto",
    issuer: "GitHub",
    desc: "Mira cómo escribo código, no solo lo que digo de él: mi perfil personal y la organización de XyraCode, verificada con el dominio xyracode.com.",
    links: [
      { href: FOUNDER.github, label: "Ver perfil" },
      { href: "https://github.com/Xyra-Code", label: "Ver organización" },
    ],
  },
];

// ---------- Lado humano (/nosotros) ----------

/** Párrafos de la card "logout.log" del hero de /nosotros. */
export const PERSONAL = {
  paragraphs: [
    "Vivo y trabajo desde Villavicencio, la puerta del llano. Podría trabajar desde cualquier parte; me quedo porque desde aquí se construye igual de bien y se vive mejor.",
    "Desde aquí construimos lo que tu negocio necesita: mejorar tus ventas, ordenar tus procesos y, a un clic de distancia, reunirnos para plantear las mejores ideas.",
    "Trabajo con clientes de cualquier parte, pero siempre tendrás la atención directa de quien construye tu proyecto.",
  ],
} as const;
