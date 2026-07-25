import {
  GitHubIcon,
  InstagramIcon,
  LinkedInIcon,
  FacebookIcon,
  TikTokIcon,
  type BrandIcon,
} from "@/components/ui/BrandIcons";
import { CONTACT } from "./contact";

// ---------- Redes ----------

export type Social = { label: string; href: string; icon: BrandIcon };


export const SOCIALS: Social[] = [
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/company/xyra-code",
    icon: LinkedInIcon,
  },
  { label: "GitHub", href: "https://github.com/Xyra-Code", icon: GitHubIcon },
  {
    label: "Instagram",
    href: "https://instagram.com/xyra_code",
    icon: InstagramIcon,
  },
  { label: "Facebook",
    href: "https://www.facebook.com/xyracode",
    icon: FacebookIcon,
  },
  { label: "TikTok",
    href: "https://www.tiktok.com/@xyra_code",
    icon: TikTokIcon,
  }
];

// ---------- Footer ----------

export type FooterLink = { label: string; href?: string; external?: boolean };
export type FooterColumn = { title: string; items: FooterLink[] };

export const FOOTER_COLUMNS: FooterColumn[] = [
  {
    title: "Servicios",
    items: [
      { label: "Desarrollo web", href: "/servicios/desarrollo-web" },
      { label: "Apps a medida", href: "/servicios/apps-a-medida" },
      { label: "E-commerce", href: "/servicios/ecommerce" },
      // La página local vivía con un único enlace entrante (desde /servicios).
      // Aquí recibe uno desde todas las páginas del sitio.
      { label: "Desarrollo web en Villavicencio", href: "/servicios/desarrollo-web-villavicencio" },
      { label: "Ver todos los servicios", href: "/servicios" },
    ],
  },
  {
    title: "Empresa",
    items: [
      { label: "Nosotros", href: "/nosotros" },
      // Rutas reales, no anclas sueltas: los id #portfolio y #contacto solo
      // existen en la home, así que como anclas quedaban muertos en el resto
      // del sitio.
      { label: "Proyectos", href: "/proyectos" },
      { label: "Blog", href: "/blog" },
      { label: "Contacto", href: "/contacto" },
    ],
  },
  {
    title: "Contacto",
    items: [
      { label: CONTACT.email, href: `mailto:${CONTACT.email}` },
      { label: CONTACT.phoneDisplay, href: `tel:${CONTACT.phone}` },
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
