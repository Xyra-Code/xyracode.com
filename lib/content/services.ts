import {
  Globe,
  LayoutDashboard,
  Palette,
  Smartphone,
  Wrench,
  Zap,
  type LucideIcon,
} from "lucide-react";

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
