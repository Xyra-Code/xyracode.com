/**
 * Contenido editable de la landing en un solo lugar.
 * Para actualizar proyectos, métricas, servicios o datos de contacto,
 * editá este archivo — no hace falta tocar los componentes.
 */
import {
  Globe,
  LayoutDashboard,
  Palette,
  ShoppingBag,
  Smartphone,
  Wrench,
  Zap,
  type LucideIcon,
} from "lucide-react";
import {
  GitHubIcon,
  InstagramIcon,
  LinkedInIcon,
  type BrandIcon,
} from "@/components/ui/BrandIcons";

// ---------- Contacto ----------

export const CONTACT = {
  email: "contacto@xyracode.com",
  /** Solo dígitos con indicativo de país, formato wa.me. */
  whatsapp: "573106790518",
  /** Mensaje precargado al abrir el chat de WhatsApp. */
  whatsappMessage:
    "¡Hola XyraCode! Me gustaría contarles sobre un proyecto y pedir una cotización.",
  location: "Villavicencio, Colombia",
  /** Agenda pública de Cal.com; si se pone en null, el botón cae al mailto. */
  calLink: "https://cal.com/xyracode/30min" as string | null,
} as const;

// ---------- Hero ----------

export type Stat = { value: string; label: string };

// PLACEHOLDER: métricas de ejemplo — reemplazar con datos reales (handoff §9).
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

// ---------- Servicios ----------

export type Service = { icon: LucideIcon; title: string; desc: string };

export const SERVICES: Service[] = [
  {
    icon: Globe,
    title: "Sitios web",
    desc: "Landing, corporativos y e-commerce rápidos, medibles y a medida.",
  },
  {
    icon: LayoutDashboard,
    title: "Web apps",
    desc: "Plataformas y dashboards con foco en producto, datos y escala.",
  },
  {
    icon: Smartphone,
    title: "Apps móviles",
    desc: "Apps iOS/Android con una base de código, listas para crecer.",
  },
  {
    icon: Palette,
    title: "Diseño UI/UX",
    desc: "Interfaces claras y accesibles, del wireframe al sistema de diseño.",
  },
  {
    icon: Zap,
    title: "Performance",
    desc: "Optimización de velocidad, SEO técnico y Core Web Vitals.",
  },
  {
    icon: Wrench,
    title: "Mantenimiento",
    desc: "Soporte continuo, mejoras y monitoreo para que nada se caiga.",
  },
];

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

// ---------- Portfolio ----------

export type Project = {
  title: string;
  type: string;
  icon: LucideIcon;
  bg: string;
  tags: string[];
  /** URL del sitio en vivo (botón "Ver sitio"). Si se omite, no se muestra. */
  href?: string;
  /** URL del caso de estudio (botón "Caso de estudio", opcional). */
  caseStudyHref?: string;
  /** Capturas del proyecto (rutas en /public). Varias => carrete con auto-fade. Si se omite, se usa bg + icon. */
  images?: string[];
  /** Subtítulo con propuesta de valor (1 línea). */
  description?: string;
  /** Rol de la agencia, p. ej. "Diseño + Desarrollo full-stack". */
  role?: string;
  /** Año y estado, p. ej. "2026 · En producción". */
  status?: string;
  /** Features clave (2–3 bullets). */
  features?: string[];
};

// PLACEHOLDER: proyectos de ejemplo — reemplazar con casos reales (handoff §9).
export const PROJECTS: Project[] = [
  {
    title: "Vuelo Carmesí",
    type: "Web App · Reservas · E-commerce",
    description:
      "Plataforma de reservas y tienda para una finca de cacao agroecológico",
    role: "Diseño + Desarrollo full-stack",
    status: "2026 · En producción",
    icon: ShoppingBag,
    bg: "bg-[linear-gradient(150deg,#0F766E,#134E48)]",
    tags: ["Next.js 16", "NestJS", "PostgreSQL", "Prisma", "Cloudinary"],
    features: [
      "Reservas con validación de fechas (zona horaria de Bogotá)",
      "Panel de administración + tienda online",
      "Emails transaccionales y carga de imágenes en la nube",
    ],
    href: "https://vuelocarmesi.com",
    images: [
      "/assets/vuelo-carmesi.png",
      "/assets/vuelo-carmesi-2.png",
      "/assets/vuelo-carmesi-3.png",
    ],
  },
];

// ---------- Nosotros ----------

export const FOUNDER = {
  name: "Yeison Enciso",
  /** Ruta en /public de la foto; si se pone en null, se muestra un marco placeholder. */
  photo: "/assets/founder.png" as string | null,
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
// MOCK: años aproximados — confirmar con Yeison antes del deploy definitivo.
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
    image: "/assets/certificado-henry-1400.png",
    featured: true,
  },
  {
    title: "Técnico en Sistemas",
    issuer: "SENA",
    // OJO: page.tsx reemplaza este desc por un párrafo JSX con link a certificados.sena.edu.co.
    desc: "La base: hardware, redes y sistemas por dentro antes de escribir software. Título firmado digitalmente, verificable en certificados.sena.edu.co.",
    links: [
      { href: "/assets/certificado-tecnico-sena.pdf", label: "Ver certificado" },
    ],
  },
  {
    title: "Código abierto",
    issuer: "GitHub",
    desc: "Mira cómo escribo código, no solo lo que digo de él: mi perfil personal y la organización de XyraCode, verificada con el dominio xyracode.com.",
    links: [
      { href: "https://github.com/YEENDJ", label: "Ver perfil" },
      { href: "https://github.com/Xyra-Code", label: "Ver organización" },
    ],
  },
];

// ---------- Lado humano (/nosotros) ----------

/** Párrafos de la card "logout.log" del hero de /nosotros. */
export const PERSONAL = {
  paragraphs: [
    "Vivo y trabajo desde Villavicencio, la puerta del llano. Podría trabajar desde cualquier parte; me quedo porque desde aquí se construye igual de bien y se vive mejor.",
    // PLACEHOLDER: hobbies concretos de Yeison — reemplazar esta línea cuando los pase.
    "Desde aquí podemos construir y mejorar tus necesidades, puedes mejorar la ventas y desde un click, podemos reunirnos y plantear las mejores ideas",
    "Trabajo con clientes de cualquier parte, pero siempre tendras la atención directa de quien construye tu proyecto.",
  ],
} as const;

// ---------- Redes ----------

export type Social = { label: string; href: string; icon: BrandIcon };

// PLACEHOLDER: reemplazar con las URLs reales de cada perfil.
export const SOCIALS: Social[] = [
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/company/xyra-code",
    icon: LinkedInIcon,
  },
  { label: "GitHub", href: "https://github.com/Xyra-Code", icon: GitHubIcon },
  {
    label: "Instagram",
    href: "https://instagram.com/xyracode",
    icon: InstagramIcon,
  },
];

// ---------- Footer ----------

export type FooterLink = { label: string; href?: string; external?: boolean };
export type FooterColumn = { title: string; items: FooterLink[] };

export const FOOTER_COLUMNS: FooterColumn[] = [
  {
    title: "Servicios",
    items: [
      { label: "Sitios web", href: "#servicios" },
      { label: "Apps a medida", href: "#servicios" },
      { label: "Mantenimiento", href: "#servicios" },
    ],
  },
  {
    title: "Empresa",
    items: [
      { label: "Nosotros", href: "/nosotros" },
      { label: "Proyectos", href: "#portfolio" },
      { label: "Contacto", href: "#contacto" },
    ],
  },
  {
    title: "Contacto",
    items: [
      { label: CONTACT.email, href: `mailto:${CONTACT.email}` },
      {
        label: "WhatsApp",
        href: `https://wa.me/${CONTACT.whatsapp}?text=${encodeURIComponent(
          CONTACT.whatsappMessage,
        )}`,
        external: true,
      },
      { label: CONTACT.location },
    ],
  },
];
