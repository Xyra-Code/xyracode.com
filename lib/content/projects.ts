import { ShoppingBag, type LucideIcon } from "lucide-react";

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
      "/assets/projects/vuelo-carmesi/1.png",
      "/assets/projects/vuelo-carmesi/2.png",
      "/assets/projects/vuelo-carmesi/3.png",
    ],
  },
];
