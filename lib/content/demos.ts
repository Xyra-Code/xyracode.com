/**
 * Demos de tienda para prospectos. Cada entrada de DEMOS es una tienda completa
 * navegable en /demos/<slug>, que se le manda por link al prospecto para cerrar
 * la venta: ve su marca, sus productos y sus precios funcionando.
 *
 * Toda la rama va `noindex` y fuera del sitemap, por eso el tipo NO lleva `seo`
 * ni `lastModified` como ServicePage, CaseStudy o BlogPost: no harían nada.
 *
 * Spec: docs/superpowers/specs/2026-07-29-demos-prospectos-design.md
 */

export type DemoImage = {
  src: string;
  alt: string;
  width: number;
  height: number;
};

export type DemoCategory = { slug: string; nombre: string };

export type DemoProduct = {
  slug: string;
  nombre: string;
  /**
   * COP entero, sin decimales. `null` cuando el material del cliente no muestra
   * el precio: la tarjeta pasa a "Consultar por WhatsApp" y el producto **no
   * entra al carrito**. Nunca inventar un número — el prospecto lee esto como
   * una propuesta comercial.
   */
  precio: number | null;
  /** Referencia a DemoCategory.slug. */
  categoria: string;
  imagen: DemoImage;
  descripcion: string;
  /** Ausente = producto sin variantes; el carrito lo muestra como "Única". */
  variantes?: { label: string; opciones: string[] };
  destacado?: boolean;
};

export type Demo = {
  /** Segmento de URL: /demos/<slug>. */
  slug: string;
  negocio: {
    nombre: string;
    tagline: string;
    /** Solo dígitos con indicativo, formato wa.me. Es el del CLIENTE. */
    whatsapp: string;
    ciudad: string;
    /** Lockup completo (marca + tagline). Footer, a 56px mínimo. */
    logo: DemoImage;
    /**
     * Variante reducida, solo la marca. Nav, a 40px de alto — no a 24px: la
     * marca tiene alas y letras solapadas y a esa altura es ilegible.
     */
    logoMarca: DemoImage;
  };
  /**
   * La capa de identidad: exactamente 4 variables. Los 9 tokens de sistema se
   * derivan de estas con color-mix() en app/demos/[cliente]/demo.css, así
   * agregar un cliente es literalmente cuatro valores hex.
   */
  tema: { fondo: string; texto: string; acento: string; acentoTexto: string };
  hero: { titulo: string; subtitulo: string; imagen: DemoImage };
  categorias: DemoCategory[];
  productos: DemoProduct[];
  /** Tira de confianza: 3 entradas. La primera deriva de negocio.ciudad. */
  confianza: string[];
};

// ---------- Guantes NR1 ----------

/**
 * SIN VERIFICAR (spec §8): entró por arrastre desde el brief de diseño y nadie
 * confirmó dónde opera el cliente. Alimenta la tira de confianza y el footer,
 * o sea lo primero que el prospecto lee. Confirmar antes de mandar el link. Si
 * vende por envío nacional, cambia la entrada de `confianza`, no solo el nombre.
 */
const NR1_CIUDAD = "Villavicencio";

const TALLAS_GUANTE = { label: "Talla", opciones: ["6", "7", "8", "9", "10", "11"] };
const TALLAS_ROPA = { label: "Talla", opciones: ["S", "M", "L", "XL"] };

/** Foto de producto: 1:1 800x800, un archivo por slug. */
function fotoNR1(slug: string, alt: string): DemoImage {
  return { src: `/demos/guantes-nr1/${slug}.webp`, alt, width: 800, height: 800 };
}

const NR1_PRODUCTOS: DemoProduct[] = [
  {
    slug: "guante-corte-negativo-latex-4mm",
    nombre: "Guante corte negativo látex 4 mm",
    precio: 149900,
    categoria: "guantes",
    imagen: fotoNR1("guante-corte-negativo-latex-4mm", "Guante de arquero corte negativo en látex de 4 mm"),
    descripcion:
      "Látex de 4 mm con corte negativo: la costura va por dentro, así el guante queda ajustado a la mano y el agarre se siente más directo.",
    variantes: TALLAS_GUANTE,
    destacado: true,
  },
  {
    slug: "guante-corte-plano-entrenamiento",
    nombre: "Guante corte plano para entrenamiento diario",
    precio: 89900,
    categoria: "guantes",
    imagen: fotoNR1("guante-corte-plano-entrenamiento", "Guante de arquero corte plano para entrenamiento"),
    descripcion:
      "Corte plano en látex resistente, pensado para entrenar todos los días sin gastar el guante de partido.",
    variantes: TALLAS_GUANTE,
  },
  {
    slug: "guante-hibrido-roll-finger-dedo-espina",
    nombre: "Guante híbrido roll finger con dedo espina para partido de competencia",
    precio: 189000,
    categoria: "guantes",
    imagen: fotoNR1("guante-hibrido-roll-finger-dedo-espina", "Guante híbrido roll finger con dedo espina"),
    descripcion:
      "Roll finger en los laterales y dedo espina con varillas: sujeción de competencia y protección contra la hiperextensión.",
    variantes: TALLAS_GUANTE,
    destacado: true,
  },
  {
    // Sin variantes a propósito: la talla ya está en el nombre. Sirve además
    // como caso de prueba del estado "producto sin variantes".
    slug: "guante-infantil-talla-5-velcro",
    nombre: "Guante infantil talla 5 con velcro ancho",
    precio: 64900,
    categoria: "guantes",
    imagen: fotoNR1("guante-infantil-talla-5-velcro", "Guante de arquero infantil talla 5 con velcro ancho"),
    descripcion:
      "Para arqueros en formación. El velcro ancho lo deja firme sin apretar la muñeca.",
  },
  {
    slug: "guante-portero-cancha-arena",
    nombre: "Guante de portero para cancha de arena",
    precio: 74000,
    categoria: "guantes",
    imagen: fotoNR1("guante-portero-cancha-arena", "Guante de portero con palma reforzada para cancha de arena"),
    descripcion:
      "Palma reforzada para superficies abrasivas. Aguanta la arena sin pelarse a las dos semanas.",
    variantes: TALLAS_GUANTE,
  },
  {
    slug: "buzo-arquero-manga-larga-coderas",
    nombre: "Buzo de arquero manga larga con coderas",
    precio: 119000,
    categoria: "indumentaria",
    imagen: fotoNR1("buzo-arquero-manga-larga-coderas", "Buzo de arquero manga larga con coderas acolchadas"),
    descripcion:
      "Manga larga con acolchado en los codos, en tela que respira para entrenar con calor.",
    variantes: TALLAS_ROPA,
    destacado: true,
  },
  {
    slug: "pantaloneta-acolchada-arquero",
    nombre: "Pantaloneta acolchada de arquero",
    precio: 79900,
    categoria: "indumentaria",
    imagen: fotoNR1("pantaloneta-acolchada-arquero", "Pantaloneta acolchada de arquero"),
    descripcion:
      "Acolchado en caderas y muslos para las caídas laterales, sin estorbar en el salto.",
    variantes: TALLAS_ROPA,
  },
  {
    slug: "medias-compresion-rodilla",
    nombre: "Medias de compresión hasta la rodilla",
    precio: 34900,
    categoria: "indumentaria",
    imagen: fotoNR1("medias-compresion-rodilla", "Medias de compresión de arquero hasta la rodilla"),
    descripcion:
      "Compresión graduada que sostiene la pantorrilla en los partidos largos.",
    variantes: TALLAS_ROPA,
  },
  {
    slug: "rodilleras-refuerzo-lateral",
    nombre: "Rodilleras con refuerzo lateral",
    precio: 72000,
    categoria: "indumentaria",
    imagen: fotoNR1("rodilleras-refuerzo-lateral", "Rodilleras de arquero con refuerzo lateral"),
    descripcion:
      "Refuerzo lateral sobre la rótula, sin restarle movilidad a la flexión.",
    variantes: TALLAS_ROPA,
  },
  {
    // precio: null → la tarjeta muestra "Consultar por WhatsApp" y el CTA va
    // directo al chat. Este producto no entra al carrito.
    slug: "bolso-portaguantes-malla-secado",
    nombre: "Bolso portaguantes con malla de secado",
    precio: null,
    categoria: "accesorios",
    imagen: fotoNR1("bolso-portaguantes-malla-secado", "Bolso portaguantes con compartimento de malla para secado"),
    descripcion:
      "Compartimento en malla para que el látex se seque después del partido y el bolso no coja olor.",
  },
  {
    slug: "espuma-limpiadora-latex-250ml",
    nombre: "Espuma limpiadora para látex 250 ml",
    precio: 28000,
    categoria: "accesorios",
    imagen: fotoNR1("espuma-limpiadora-latex-250ml", "Espuma limpiadora para látex de guantes, 250 ml"),
    descripcion:
      "Limpia el látex sin resecarlo. Un pulverizado después de cada partido y el agarre dura más.",
    destacado: true,
  },
  {
    slug: "vendaje-elastico-dedos-2-rollos",
    nombre: "Vendaje elástico para dedos · 2 rollos",
    precio: 18500,
    categoria: "accesorios",
    imagen: fotoNR1("vendaje-elastico-dedos-2-rollos", "Vendaje elástico para dedos de arquero, dos rollos"),
    descripcion: "Dos rollos para asegurar los dedos antes del partido.",
  },
];

export const DEMOS: Demo[] = [
  {
    slug: "guantes-nr1",
    negocio: {
      nombre: "Guantes NR1",
      tagline: "El inoxidable",
      // Del chat de Instagram. Confirmar que es la línea del negocio (spec §8).
      whatsapp: "573044962704",
      ciudad: NR1_CIUDAD,
      logo: {
        src: "/demos/guantes-nr1/logo.png",
        alt: "Guantes NR1 — El inoxidable",
        width: 852,
        height: 728,
      },
      logoMarca: {
        src: "/demos/guantes-nr1/logo-mark.png",
        alt: "Guantes NR1",
        width: 852,
        height: 604,
      },
    },
    tema: {
      fondo: "#0E0E10",
      texto: "#F2F2EF",
      acento: "#C6F24E",
      acentoTexto: "#0E0E10",
    },
    hero: {
      titulo: "Guantes de arquero que aguantan la temporada",
      subtitulo:
        "Corte negativo, roll finger e híbridos. Indumentaria de portero y accesorios para entrenar y competir.",
      imagen: {
        src: "/demos/guantes-nr1/hero.webp",
        alt: "Arquero atajando un balón con guantes NR1",
        width: 1600,
        height: 900,
      },
    },
    categorias: [
      { slug: "guantes", nombre: "Guantes" },
      { slug: "indumentaria", nombre: "Indumentaria" },
      { slug: "accesorios", nombre: "Accesorios" },
    ],
    productos: NR1_PRODUCTOS,
    confianza: [
      `Envío en ${NR1_CIUDAD}`,
      "Pago contra entrega",
      "Atención por WhatsApp",
    ],
  },
];

/** Resuelve una demo por su slug de URL. */
export function getDemo(slug: string): Demo | undefined {
  return DEMOS.find((demo) => demo.slug === slug);
}

/** Resuelve un producto dentro de una demo. */
export function getDemoProduct(demo: Demo, slug: string): DemoProduct | undefined {
  return demo.productos.find((producto) => producto.slug === slug);
}
