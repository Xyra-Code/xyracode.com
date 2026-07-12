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
  role: "fundador & desarrollador full-stack — construyo tu web completa, del diseño a la base de datos",
  experience: "1 año construyendo productos web",
} as const;

/** Líneas de la tarjeta terminal `sobre-mi.sh` de /nosotros. */
export const ABOUT_TERMINAL: { key: string; value: string }[] = [
  { key: "rol", value: FOUNDER.role },
  { key: "base", value: `${CONTACT.location} 🇨🇴` },
  {
    key: "herramientas",
    value:
      "React · Next.js · Node · TypeScript · PostgreSQL — tecnología moderna para que tu web cargue rápido y no se quede vieja",
  },
  { key: "experiencia", value: FOUNDER.experience },
  { key: "proyectos activos", value: "máximo 3 a la vez" },
  { key: "respuesta", value: "primera propuesta en 48h ✓" },
];

/** Manifiesto "Cómo trabajo" de /nosotros. */
export const MANIFESTO: Step[] 
= [
  {
    title: "Sin teléfono roto",
    desc: "No hay gerente de cuenta que traduzca mal lo que pediste. Me cuentas tu idea y la misma persona la convierte en código.",
  },
  {
    title: "Pocos proyectos, bien hechos",
    desc: "Tomo máximo 3 proyectos en paralelo. El tuyo avanza todas las semanas, con entregas que puedes ver y probar.",
  },
  {
    title: "Aliados cuando el proyecto lo pide",
    desc: "Para ilustración, contenido o proyectos grandes sumo colaboradores de confianza. El punto de contacto siempre soy yo.",
  },
];

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
