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
  /**
   * Distintivo corto sobre la foto, p. ej. "Edición Pro". Sale de las piezas del
   * cliente, no lo inventamos: él marca así algunas referencias.
   */
  insignia?: string;
};

/**
 * Perfil del cliente en una red. Solo la URL y qué red es: el ícono lo resuelve
 * StoreFooter contra `red`. Acá no puede vivir el componente del ícono porque el
 * objeto Demo completo cruza al árbol cliente (`<CartProvider demo={demo}>`) y
 * una función no es serializable a través de esa frontera.
 */
export type DemoRed = {
  red: "instagram" | "facebook" | "tiktok" | "x";
  href: string;
};

/**
 * La persona detrás de la marca. **Opcional**: no todo cliente es una marca
 * personal —una papelería no tiene fundador que mostrar— y sin este campo la home
 * no dibuja la sección.
 *
 * Para un cliente como este es la pieza que ningún competidor puede copiar: el
 * producto se iguala, la carrera no.
 */
export type DemoPersona = {
  nombre: string;
  /** Credencial en una línea, para el kicker. */
  rol: string;
  /** Retrato. 4:5 — un formato vertical le da presencia sin comerse la pantalla. */
  foto: DemoImage;
  /** Relato en primera persona, dos o tres frases. */
  relato: string;
  /**
   * Credenciales cortas para la fila de etiquetas: clubes, títulos, años. Se
   * escriben **como las escribe el cliente**, sin expandir abreviaturas: "AMÉRICA"
   * puede ser América de Cali y "BOCA" puede ser más de un club, y adivinar mal un
   * nombre en la tienda de un profesional es peor que abreviarlo.
   */
  credenciales: string[];
  /**
   * Segunda línea de negocio, si la tiene. Este cliente vende entrenamientos
   * personalizados, individuales y en grupo, y hoy los cierra por DM. Mientras el
   * flujo de agenda no exista, esto lo saca a la superficie con un enlace.
   */
  servicio?: { titulo: string; nota: string };
};

export type Demo = {
  /** Segmento de URL: /demos/<slug>. */
  slug: string;
  negocio: {
    nombre: string;
    /** Apodo o bajada de la marca. Va en el logo y en el <title>. */
    tagline: string;
    /**
     * Promesa de producto, en las palabras del cliente. Distinto del tagline:
     * "El inoxidable" es quién es, el lema es qué promete. Encabeza el hero.
     */
    lema?: string;
    /**
     * Los atributos que el cliente pone en TODAS sus piezas de producto. Van en el
     * detalle, que es donde alguien decide comprar. Se escriben como los escribe
     * él: son sus argumentos de venta, no los nuestros.
     */
    beneficios?: string[];
    /** Solo dígitos con indicativo, formato wa.me. Es el del CLIENTE. */
    whatsapp: string;
    /** Lockup completo (marca + tagline). Footer, a 56px mínimo. */
    logo: DemoImage;
    /**
     * Variante reducida, solo la marca. Nav, a 40px de alto — no a 24px: la
     * marca tiene alas y letras solapadas y a esa altura es ilegible.
     */
    logoMarca: DemoImage;
    /**
     * Redes del cliente, en el orden en que se muestran en el footer. Opcional:
     * un cliente puede no tener ninguna, y entonces el footer no dibuja la fila.
     */
    redes?: DemoRed[];
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
  /** La persona detrás de la marca. Ausente = la home no muestra la sección. */
  persona?: DemoPersona;
  /** Tira de confianza: 3 entradas, texto libre. */
  confianza: string[];
};

// ---------- Guantes NR1 ----------

/*
 * La ciudad del cliente ya no existe en el modelo. Venía por arrastre del brief
 * de diseño, nadie confirmó dónde opera (spec §8) y salió de los tres lugares
 * donde se veía: la tira de confianza (los envíos son nacionales), el footer y
 * el kicker del hero. Si algún día se confirma, vuelve como campo de `negocio`.
 */

const TALLAS_GUANTE = { label: "Talla", opciones: ["6", "7", "8", "9", "10", "11"] };
const TALLAS_ROPA = { label: "Talla", opciones: ["S", "M", "L", "XL"] };

/**
 * Obsequio que acompaña a todos los guantes. Va como constante y no escrito en
 * cada descripción para que no se desincronice: si la promoción cambia o se
 * termina, se edita en un solo lugar y no en cinco.
 */
const OBSEQUIO_GUANTES =
  " Incluye de obsequio el shampoo NR1 para lavarlos y cuidar el látex.";

/** Foto de producto: 1:1 800x800, un archivo por slug. */
function fotoNR1(slug: string, alt: string): DemoImage {
  return { src: `/demos/guantes-nr1/${slug}.webp`, alt, width: 800, height: 800 };
}

const NR1_PRODUCTOS: DemoProduct[] = [
  {
    slug: "guante-corte-negativo-latex-4mm",
    insignia: "Edición Pro",
    nombre: "Guante corte negativo látex 4 mm",
    precio: 149900,
    categoria: "guantes",
    imagen: fotoNR1("guante-corte-negativo-latex-4mm", "Guante de arquero corte negativo en látex de 4 mm"),
    descripcion:
      "Látex de 4 mm con corte negativo: la costura va por dentro, así el guante queda ajustado a la mano y el agarre se siente más directo." + OBSEQUIO_GUANTES,
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
      "Corte plano en látex resistente, pensado para entrenar todos los días sin gastar el guante de partido." + OBSEQUIO_GUANTES,
    variantes: TALLAS_GUANTE,
  },
  {
    slug: "guante-hibrido-roll-finger-dedo-espina",
    insignia: "Edición Pro",
    nombre: "Guante híbrido roll finger con dedo espina para partido de competencia",
    precio: 189000,
    categoria: "guantes",
    imagen: fotoNR1("guante-hibrido-roll-finger-dedo-espina", "Guante híbrido roll finger con dedo espina"),
    descripcion:
      "Roll finger en los laterales y dedo espina con varillas: sujeción de competencia y protección contra la hiperextensión. Ideales para entrenamiento y partidos." + OBSEQUIO_GUANTES,
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
      "Para arqueros en formación. El velcro ancho lo deja firme sin apretar la muñeca." + OBSEQUIO_GUANTES,
  },
  {
    slug: "guante-portero-cancha-arena",
    nombre: "Guante de portero para cancha de arena",
    precio: 74000,
    categoria: "guantes",
    imagen: fotoNR1("guante-portero-cancha-arena", "Guante de portero con palma reforzada para cancha de arena"),
    descripcion:
      "Palma reforzada para superficies abrasivas. Aguanta la arena sin pelarse a las dos semanas." + OBSEQUIO_GUANTES,
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
      // Los dos salen textuales de sus nueve flyers de producto.
      lema: "Rendimiento. Control. Confianza.",
      beneficios: [
        "Excelente agarre",
        "Máxima protección",
        "Cómodos y transpirables",
        "Diseño profesional",
      ],
      // Del chat de Instagram. Confirmar que es la línea del negocio (spec §8).
      whatsapp: "573044962704",
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
      /**
       * Perfiles que el cliente pasó él mismo (2026-07-29), así que no llevan la
       * marca de SIN VERIFICAR del resto de sus datos.
       *
       * Facebook va con `www` y no con el `web.facebook.com` original: `web.` es
       * la variante que salta la app móvil, y el perfil es un `profile.php?id=`
       * porque es cuenta personal, no página de negocio — no tiene URL con nombre.
       */
      redes: [
        { red: "instagram", href: "https://www.instagram.com/nelramosoficial1" },
        {
          red: "facebook",
          href: "https://www.facebook.com/profile.php?id=100066874174711",
        },
        { red: "tiktok", href: "https://www.tiktok.com/@nelsonramos034" },
        { red: "x", href: "https://x.com/NelRamosOficial" },
      ],
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
    /**
     * COPY PARA APROBAR CON ÉL. El relato está escrito en su voz a partir de lo
     * único que sabemos con certeza —su bio: arquero y director técnico, con paso
     * por esos clubes— pero son palabras nuestras puestas en su boca. Se muestra,
     * no se publica, hasta que él lo confirme.
     *
     * Las credenciales van tal como las escribe en su bio, sin expandir: "AMÉRICA"
     * y "BOCA" admiten más de un club, y equivocarle el nombre de un equipo donde
     * jugó es peor que abreviarlo.
     *
     * El número de seguidores NO va acá a propósito. Es un argumento de venta para
     * la agencia, no un elemento de conversión para su comprador: a quien va a
     * comprar guantes le importa que haya atajado en primera, no cuánta gente lo
     * sigue. Y un número así envejece; una carrera no.
     */
    persona: {
      nombre: "Nelson Ramos",
      rol: "Arquero profesional y director técnico",
      foto: {
        src: "/demos/guantes-nr1/nelson-ramos.webp",
        alt: "Nelson Ramos, arquero profesional, con guantes NR1",
        width: 900,
        height: 1125,
      },
      relato:
        "Soy arquero y director técnico, y sé qué le pasa a un guante en el minuto ochenta: cuándo el látex deja de agarrar y cuándo la costura empieza a molestar. Por eso hice NR1. No vendo una referencia que no haya probado en cancha.",
      credenciales: [
        "Dep. Pasto",
        "América",
        "Millonarios",
        "Medellín",
        "Fortaleza",
        "Dep. Quito",
        "Bucaramanga",
        "Boca",
      ],
      servicio: {
        titulo: "Entrenamiento personalizado de arqueros",
        nota: "Sesiones individuales o en grupo, con seguimiento. Escríbeme y armamos el plan.",
      },
    },
    confianza: [
      "Envío a todo el país",
      "Pago en línea seguro",
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
