import {
  GitHubIcon,
  InstagramIcon,
  LinkedInIcon,
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
