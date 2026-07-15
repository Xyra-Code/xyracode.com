import { FOUNDER } from "./team";

// ---------- Textos de UI ----------

/** Copys visibles de la landing y de /nosotros (lo temático/decorativo vive en los componentes). */
export const UI = {
  nav: {
    // Anclas con "/" inicial para que funcionen también desde /nosotros.
    links: [
      { label: "Servicios", href: "/servicios" },
      { label: "Proceso", href: "/#proceso" },
      { label: "Proyectos", href: "/proyectos" },
      { label: "Nosotros", href: "/nosotros" },
    ],
    cta: "Cotizar",
    homeAria: "XyraCode — inicio",
    navAria: "Principal",
    openMenu: "Abrir menú",
    closeMenu: "Cerrar menú",
  },
  hero: {
    eyebrow: "Agencia de desarrollo web",
    paragraph:
      "Diseñamos sitios, apps y plataformas. Del prototipo a producción — rápido, escalable y sin fricción.",
    ctaPrimary: "Empezar proyecto",
    ctaSecondary: "Ver proyectos",
  },
  trust: { label: "Stack", aria: "Stack tecnológico" },
  services: {
    eyebrow: "Qué hacemos",
    title: "Servicios a medida",
    subtitle: "Todo el ciclo de tu producto digital, con un solo equipo.",
  },
  process: { eyebrow: "Cómo trabajamos", title: "Proceso en 4 pasos" },
  portfolio: {
    eyebrow: "Proyecto destacado",
    title: "Nuestro trabajo",
    liveSite: "Ver sitio",
    caseStudy: "Caso de estudio",
  },
  cta: {
    eyebrow: "¿Tienes un proyecto?",
    title: "Construyamos algo que funcione",
    paragraph:
      "Cuéntanos tu idea y te enviamos una propuesta en 48 horas. Completa el formulario o, si prefieres, escríbenos directo.",
    whatsapp: "WhatsApp",
    emailPrefix: "O por correo a",
    schedule: "Agendar Reunión",
  },
  floatingWhatsApp: {
    eyebrow: "WhatsApp",
    label: "Hablemos de tu proyecto",
    aria: "Escríbenos por WhatsApp",
  },
  footer: {
    tagline:
      "Agencia de desarrollo web. Diseño y código a medida para que tu negocio escale.",
    copyright: "© 2026 XyraCode. Todos los derechos reservados.",
    madeWith: "diseñado y programado con </> en Colombia",
  },
  nosotros: {
    headingPrefix: "El desarrollador detrás de",
    wordmarkAlt: "XyraCode",
    photoAlt: `Retrato de ${FOUNDER.name}, fundador de XyraCode`,
    photoPlaceholder: "[tu foto]",
    /** Párrafos de la card whoami.txt (tras "Soy {name}."). */
    whoami: [
      "Antes de escribir código pasé más de 10 años del lado del cliente, vendiendo servicios de telecomunicaciones y viendo de primera mano lo que un negocio necesita para estar a la vanguardia.",
      "XyraCode es una agencia que nace desde la necesidad de ayudar a los emprendedores a llevar sus ideas al mercado.",
    ],
    heroCtaPrimary: "Hablemos",
    heroCtaSecondary: "Ver proyectos",
    historyTitle: "Mi historia",
    credentialsTitle: "Credenciales verificables",
    manifestoTitle: "Cómo trabajo",
    finalCtaTitle: "¿Trabajamos juntos?",
    whatsappCta: "Escríbeme por WhatsApp",
    sobreMiAria: "Sobre mí",
  },
} as const;
