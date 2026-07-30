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

export type DemoCategory = {
  slug: string;
  nombre: string;
  /**
   * Subcategorías, p. ej. Guantes → Edición Pro / Línea estándar.
   *
   * **Un solo nivel de anidación, a propósito.** El catálogo las muestra como una
   * segunda fila de chips debajo de la categoría abierta; un tercer nivel no
   * tendría dónde dibujarse sin convertir el filtro en un árbol, y una tienda de
   * este tamaño no lo necesita.
   *
   * Los slugs de subcategoría comparten espacio con los de categoría porque el
   * filtro del catálogo guarda **un** slug en el hash y lo resuelve contra las
   * dos listas. Tienen que ser únicos en toda la demo, no solo dentro de su
   * padre: `guantes/pro` y `ropa/pro` colisionarían.
   */
  subcategorias?: DemoCategory[];
};

/**
 * Una opción de variante con su propio precio en COP.
 *
 * El precio vive acá y no en el producto porque en los guantes **depende de la
 * talla**: la tarjeta del catálogo muestra el rango y el precio real aparece en
 * el detalle cuando la persona elige. Un solo número por producto obligaría a
 * mostrar en la tarjeta un precio que después cambia, que es justo lo que hace
 * que un comprador abandone el carrito.
 */
export type DemoVariante = { valor: string; precio: number };

export type DemoProduct = {
  slug: string;
  nombre: string;
  /**
   * COP entero, sin decimales, para el producto de precio único.
   *
   * `null` cuando el material del cliente no muestra el precio: la tarjeta pasa a
   * "Consultar por [logo]" y el producto **no entra al carrito**. Nunca inventar
   * un número — el prospecto lee esto como una propuesta comercial.
   *
   * **Se omite cuando `variantes` trae precio por opción**: ahí el precio real es
   * el de la talla elegida y este campo no se lee. Para consultar cualquiera de
   * los dos casos sin preguntar por la forma del dato están `precioDe()` y
   * `rangoDe()` en `lib/demos/price.ts`; ningún componente debería tocar este
   * campo directo.
   */
  precio?: number | null;
  /** Referencia a DemoCategory.slug, siempre de primer nivel. */
  categoria: string;
  /**
   * Referencia a una `DemoCategory.slug` de las `subcategorias` de su categoría.
   * Ausente = el producto vive en la categoría a secas, que es lo que pasa cuando
   * esa categoría no tiene subdivisiones.
   */
  subcategoria?: string;
  imagen: DemoImage;
  descripcion: string;
  /** Ausente = producto sin variantes; el carrito lo muestra como "Única". */
  variantes?: { label: string; opciones: DemoVariante[] };
  /**
   * Candidato a "Los que más salen" en la home, que muestra **una sola fila de
   * 4**: marcar más de cuatro no agrega una segunda fila, la home corta en el
   * cuarto en el orden de este arreglo.
   */
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
   * escriben **como las escribe el cliente**, sin expandir abreviaturas ni
   * partirlas: "AMÉRICA" puede ser América de Cali, y un nombre de dos palabras
   * puede ser un solo club. Adivinar mal —o cortar uno en dos— le inventa una
   * carrera que no tuvo, y en la tienda de un profesional eso es peor que
   * quedarse corto.
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

/**
 * Tallas de guante. La 5 entra porque una de las nueve fotos la muestra
 * etiquetada; el resto del rango sigue SIN VERIFICAR, como todo lo que no sale
 * de sus piezas.
 */
const TALLAS_GUANTE = ["5", "6", "7", "8", "9", "10", "11"];
const TALLAS_ROPA = ["S", "M", "L", "XL"];

/**
 * **PRECIOS SIN CONFIRMAR — placeholder hasta que el cliente pase su lista.**
 *
 * Ninguno de sus nueve flyers muestra un precio, así que acá no hay dato: hay
 * una escala inventada, y está construida para que se vea que lo es y para
 * inventar lo menos posible. Son tres números —dos anclas y un paso— de los que
 * salen las 63 combinaciones talla × modelo, en vez de 63 cifras escritas a
 * mano que además nadie podría revisar.
 *
 * La única jerarquía que sí sale de su material es el tier: el sello "EDICIÓN
 * PRO ★★★★★" está estampado en 4 de las 9 piezas y no en las otras 5.
 *
 * Al confirmarse la lista real, lo que se edita es esto y nada más.
 */
const PRECIO_PRO = 129900;
const PRECIO_ESTANDAR = 99900;
/** Lo que sube el precio por cada talla: más látex y más tela por par. */
const PASO_TALLA = 5000;

/**
 * Arma el bloque de tallas con un precio por cada una a partir del precio de la
 * talla más chica. El precio real lo resuelve el detalle cuando la persona
 * elige; la tarjeta del catálogo muestra el rango (ver `lib/demos/price.ts`).
 */
function tallasGuante(precioBase: number) {
  return {
    label: "Talla",
    opciones: TALLAS_GUANTE.map((valor, indice) => ({
      valor,
      precio: precioBase + indice * PASO_TALLA,
    })),
  };
}

/**
 * Tallas de ropa, **todas al mismo precio**: en indumentaria el precio no cambia
 * con la talla, y por eso una S y una XL valen igual.
 *
 * Pasa por el mismo tipo que los guantes —cada opción con su precio— y eso es lo
 * que hace que no haya un caso especial en ningún componente: con todas las
 * opciones iguales, `rangoDe()` devuelve `null` y la tarjeta muestra una cifra en
 * vez de un rango, sola.
 */
function tallasRopa(precio: number) {
  return {
    label: "Talla",
    opciones: TALLAS_ROPA.map((valor) => ({ valor, precio })),
  };
}

/**
 * Obsequio que acompaña a todos los guantes. Va como constante y no escrito en
 * cada descripción para que no se desincronice: si la promoción cambia o se
 * termina, se edita en un solo lugar y no en cinco.
 */
const OBSEQUIO_GUANTES =
  " Incluye de obsequio el shampoo NR1 para lavarlos y cuidar el látex.";

/**
 * Foto de producto: 1:1 1080x1080, un archivo por slug.
 *
 * Las nueve son los flyers que el cliente publica, normalizados a cuadrado con
 * `fit: 'contain'` sobre el fondo de la tienda — no recortados: es su diseño y
 * un `cover` le comería el borde. Por eso son piezas de marketing completas, con
 * su título y sus cuatro promesas adentro de la imagen, y no fotos de producto
 * sobre fondo limpio. Es el material que existe.
 */
function fotoNR1(slug: string, alt: string): DemoImage {
  return { src: `/demos/guantes-nr1/${slug}.webp`, alt, width: 1080, height: 1080 };
}

/**
 * Los nueve guantes que el cliente publica, en el orden de su carrusel (el
 * contador que quedó quemado en cada captura: 2/10 a 10/10).
 *
 * **Los nombres describen el colorway y nada más**, porque es lo único que sus
 * piezas dicen: ninguna nombra un modelo, ni un corte, ni un material. Los
 * nombres anteriores —"corte negativo látex 4 mm", "híbrido roll finger con dedo
 * espina"— eran inventados, y en la tienda de un arquero profesional un dato
 * técnico falso lo descalifica frente a su propio cliente.
 *
 * Tampoco llevan `insignia`: el sello "EDICIÓN PRO" ya viene estampado dentro de
 * la foto, y el chip de la tarjeta lo mostraría dos veces sobre la misma imagen.
 * Ese sello es, en cambio, lo que decide la categoría.
 */
const NR1_PRODUCTOS: DemoProduct[] = [
  {
    slug: "guante-negro-puntos-rojos",
    nombre: "Guante de arquero negro con puntos rojos",
    categoria: "guantes",
    subcategoria: "linea-estandar",
    imagen: fotoNR1(
      "guante-negro-puntos-rojos",
      "Guante de arquero negro con puntos rojos de agarre, en su estuche con visor",
    ),
    descripcion:
      "Negro con puntos rojos en relieve sobre la palma y el escudo NR1 al centro. Viene en su estuche con visor." +
      OBSEQUIO_GUANTES,
    variantes: tallasGuante(PRECIO_ESTANDAR),
  },
  {
    slug: "guante-blanco-rojo-puntos",
    nombre: "Guante de arquero blanco y rojo con puntos",
    categoria: "guantes",
    subcategoria: "edicion-pro",
    imagen: fotoNR1(
      "guante-blanco-rojo-puntos",
      "Guante de arquero blanco con puntos rojos y dorso rojo, en su estuche con visor",
    ),
    descripcion:
      "Palma blanca con puntos rojos y dorso a franjas rojas. Viene en su estuche con visor." +
      OBSEQUIO_GUANTES,
    variantes: tallasGuante(PRECIO_PRO),
    destacado: true,
  },
  {
    slug: "guante-negro-dorado",
    nombre: "Guante de arquero negro y dorado",
    categoria: "guantes",
    subcategoria: "linea-estandar",
    imagen: fotoNR1(
      "guante-negro-dorado",
      "Guante de arquero negro con franjas doradas, en su estuche con visor",
    ),
    descripcion:
      "Negro con franjas en V doradas y el escudo NR1 en dorado sobre el dorso. Viene en su estuche con visor." +
      OBSEQUIO_GUANTES,
    variantes: tallasGuante(PRECIO_ESTANDAR),
  },
  {
    slug: "guante-impact-negro-rojo",
    nombre: "Guante de arquero Impact negro y rojo",
    categoria: "guantes",
    subcategoria: "edicion-pro",
    imagen: fotoNR1(
      "guante-impact-negro-rojo",
      "Guante de arquero negro con líneas rojas y el sello Impact, en su estuche con visor",
    ),
    descripcion:
      "Negro con líneas rojas quebradas y el sello IMPACT sobre el puño. Viene en su estuche con visor." +
      OBSEQUIO_GUANTES,
    variantes: tallasGuante(PRECIO_PRO),
    destacado: true,
  },
  {
    slug: "guante-negro-celeste",
    nombre: "Guante de arquero negro y celeste",
    categoria: "guantes",
    subcategoria: "linea-estandar",
    imagen: fotoNR1(
      "guante-negro-celeste",
      "Guante de arquero negro con el escudo en celeste, en su estuche con visor",
    ),
    descripcion:
      "Negro con el escudo en celeste al centro del dorso. Viene en su estuche con visor." +
      OBSEQUIO_GUANTES,
    variantes: tallasGuante(PRECIO_ESTANDAR),
  },
  {
    slug: "guante-verde-limon-rojo",
    nombre: "Guante de arquero verde limón y rojo",
    categoria: "guantes",
    subcategoria: "edicion-pro",
    imagen: fotoNR1(
      "guante-verde-limon-rojo",
      "Guante de arquero verde limón con franjas rojas, en su estuche con visor",
    ),
    descripcion:
      "Verde limón con franjas en V rojas y puño tejido en el mismo verde. Viene en su estuche con visor." +
      OBSEQUIO_GUANTES,
    variantes: tallasGuante(PRECIO_PRO),
    destacado: true,
  },
  {
    slug: "guante-blanco-naranja",
    nombre: "Guante de arquero blanco y naranja",
    categoria: "guantes",
    subcategoria: "linea-estandar",
    imagen: fotoNR1(
      "guante-blanco-naranja",
      "Guante de arquero blanco con franjas naranja, en su estuche con visor",
    ),
    descripcion:
      "Blanco con franjas en V naranja y el escudo en azul sobre el dorso. Viene en su estuche con visor." +
      OBSEQUIO_GUANTES,
    variantes: tallasGuante(PRECIO_ESTANDAR),
  },
  {
    slug: "guante-azul-rey",
    nombre: "Guante de arquero azul rey",
    categoria: "guantes",
    subcategoria: "edicion-pro",
    imagen: fotoNR1(
      "guante-azul-rey",
      "Guante de arquero azul rey con el dorso negro en relieve, en su estuche con visor",
    ),
    descripcion:
      "Azul rey con el dorso negro en relieve y el escudo al centro. Viene en su estuche con visor." +
      OBSEQUIO_GUANTES,
    variantes: tallasGuante(PRECIO_PRO),
    destacado: true,
  },
  {
    slug: "guante-amarillo-negro",
    nombre: "Guante de arquero amarillo y negro",
    categoria: "guantes",
    subcategoria: "linea-estandar",
    imagen: fotoNR1(
      "guante-amarillo-negro",
      "Guante de arquero negro con franjas amarillas, en su estuche con visor",
    ),
    descripcion:
      "Negro con franjas en V amarillas y el escudo en blanco sobre el dorso. Viene en su estuche con visor." +
      OBSEQUIO_GUANTES,
    variantes: tallasGuante(PRECIO_ESTANDAR),
  },

  /*
   * ---------- Indumentaria y accesorios ----------
   *
   * SIN MATERIAL DEL CLIENTE. Estos siete no salen de ninguna pieza suya: ni las
   * fotos —son placeholders grises con el nombre escrito— ni los nombres, ni las
   * descripciones, ni los precios. Existen para que las categorías Indumentaria y
   * Accesorios tengan qué mostrar.
   *
   * Es la deuda visible de la demo: en cuanto él pase fotos y precios de su
   * indumentaria, esto se reemplaza igual que se reemplazaron los cinco guantes
   * inventados que estaban antes. Y si resulta que no vende nada de esto, se
   * borran los siete y con ellos las dos categorías.
   */
  {
    slug: "buzo-arquero-manga-larga-coderas",
    nombre: "Buzo de arquero manga larga con coderas",
    categoria: "indumentaria",
    imagen: fotoNR1(
      "buzo-arquero-manga-larga-coderas",
      "Buzo de arquero manga larga con coderas acolchadas",
    ),
    descripcion:
      "Manga larga con acolchado en los codos, en tela que respira para entrenar con calor.",
    variantes: tallasRopa(119000),
  },
  {
    slug: "pantaloneta-acolchada-arquero",
    nombre: "Pantaloneta acolchada de arquero",
    categoria: "indumentaria",
    imagen: fotoNR1("pantaloneta-acolchada-arquero", "Pantaloneta acolchada de arquero"),
    descripcion:
      "Acolchado en caderas y muslos para las caídas laterales, sin estorbar en el salto.",
    variantes: tallasRopa(79900),
  },
  {
    slug: "medias-compresion-rodilla",
    nombre: "Medias de compresión hasta la rodilla",
    categoria: "indumentaria",
    imagen: fotoNR1(
      "medias-compresion-rodilla",
      "Medias de compresión de arquero hasta la rodilla",
    ),
    descripcion: "Compresión graduada que sostiene la pantorrilla en los partidos largos.",
    variantes: tallasRopa(34900),
  },
  {
    slug: "rodilleras-refuerzo-lateral",
    nombre: "Rodilleras con refuerzo lateral",
    categoria: "indumentaria",
    imagen: fotoNR1("rodilleras-refuerzo-lateral", "Rodilleras de arquero con refuerzo lateral"),
    descripcion: "Refuerzo lateral sobre la rótula, sin restarle movilidad a la flexión.",
    variantes: tallasRopa(72000),
  },
  {
    // Sin variantes: el precio es único y va en `precio`.
    //
    // Con este precio publicado, NINGÚN producto del catálogo queda en
    // `precio: null`, así que el estado "Consultar" ya no se ve con datos
    // reales. Lo cubre un producto agregado en el test de la grilla
    // (`conProductoSinPrecio` en `FilterableCatalog.test.tsx`) — si mañana
    // vuelve a haber una referencia sin precio, ese doble deja de hacer falta.
    slug: "bolso-portaguantes-malla-secado",
    nombre: "Bolso portaguantes con malla de secado",
    precio: 169900,
    categoria: "accesorios",
    imagen: fotoNR1(
      "bolso-portaguantes-malla-secado",
      "Bolso portaguantes con compartimento de malla para secado",
    ),
    descripcion:
      "Compartimento en malla para que el látex se seque después del partido y el bolso no coja olor.",
  },
  {
    // Sin variantes: el precio es único y va en `precio`.
    slug: "espuma-limpiadora-latex-250ml",
    nombre: "Espuma limpiadora para látex 250 ml",
    precio: 28000,
    categoria: "accesorios",
    imagen: fotoNR1(
      "espuma-limpiadora-latex-250ml",
      "Espuma limpiadora para látex de guantes, 250 ml",
    ),
    descripcion:
      "Limpia el látex sin resecarlo. Un pulverizado después de cada partido y el agarre dura más.",
  },
  {
    slug: "vendaje-elastico-dedos-2-rollos",
    nombre: "Vendaje elástico para dedos · 2 rollos",
    precio: 18500,
    categoria: "accesorios",
    imagen: fotoNR1(
      "vendaje-elastico-dedos-2-rollos",
      "Vendaje elástico para dedos de arquero, dos rollos",
    ),
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
      titulo: "Guantes profesionales para arqueros NR1",
      /*
        Ya no promete cortes ni materiales: "corte negativo, roll finger e
        híbridos" era inventado y sus piezas no lo dicen. Lo que sí sale de sus
        nueve flyers: nueve colores, estuche, entrenamiento y partido, envío
        nacional. La indumentaria queda nombrada al final porque existe en el
        catálogo, pero sin describirla — de eso no hay material.
      */
      subtitulo:
        "Nueve colores, tallas 5 a 11, cada par en su estuche con visor. Ideales para entrenamiento y partidos, con envío a todo el país. También indumentaria y accesorios de portero.",
      /*
        Foto real que entregó el cliente, 2:1. El slot del hero es 16:9, así que
        `object-cover` recorta ~6% por lado y el arquero queda centrado igual; no
        se recorta nada en vertical.

        **1900×950 es un upscale ×2 de los 950×475 que entregó** (lanczos3 +
        unsharp), y no invento de resolución: en un display 2x el slot pide 1240
        px de ancho y `object-cover` solo usa 844 de los 950, así que el navegador
        estiraba ×1.47 con su propio filtro y se veía blanda. Sirviéndole píxeles
        ya interpolados y enfocados, la reducción la hace Next y el resultado se
        lee más limpio — verificado comparando ambas a 1240×698.

        Esto es un parche: lo que hace falta es el archivo grande del cliente. Los
        950 px son una copia web, cualquier celular da 3000+. Cuando lo manden,
        reemplazar y borrar este párrafo.

        El alt NO dice "guantes NR1": en la foto los guantes son de otra marca
        —se le lee el logo—, y afirmarlo sería describir algo que la imagen no
        muestra. Describe lo que se ve y ya.
      */
      imagen: {
        src: "/demos/guantes-nr1/hero.webp",
        alt: "Arquero de rodillas asegurando el balón contra el pecho en la cancha",
        width: 1900,
        height: 950,
      },
    },
    categorias: [
      {
        slug: "guantes",
        nombre: "Guantes",
        /*
          Las dos subcategorías salen del **sello de sus propias piezas**:
          "EDICIÓN PRO ★★★★★" está estampado en 4 de los 9 flyers y no en los
          otros 5. Es la única división que su material sostiene.

          Van como subcategorías de Guantes y no como categorías de primer nivel
          porque no son otro tipo de producto: es el mismo guante en dos gamas.
        */
        subcategorias: [
          { slug: "edicion-pro", nombre: "Edición Pro" },
          { slug: "linea-estandar", nombre: "Línea estándar" },
        ],
      },
      { slug: "indumentaria", nombre: "Indumentaria" },
      { slug: "accesorios", nombre: "Accesorios" },
    ],
    productos: NR1_PRODUCTOS,
    /**
     * COPY PARA APROBAR CON ÉL. El relato ya no lo inventamos: son datos públicos
     * de su carrera —debut en Pasto, retiro en 2022 con Boca Juniors de Cali a los
     * 40, 13 goles de los que 7 fueron de tiro libre— contados en primera persona.
     * Las palabras siguen siendo nuestras, así que se muestra y no se publica hasta
     * que él lo confirme, pero lo que afirma se puede verificar.
     *
     * Cuenta la trayectoria y nada más: no cierra con un argumento de venta. La
     * carrera ES el argumento, y explicarla suena a folleto.
     *
     * Queda fuera a propósito su récord de gol de tiro libre en tres partidos
     * consecutivos. Es su dato más llamativo, pero afirmar un récord mundial en la
     * tienda es de él, no nuestro: si lo confirma, entra.
     *
     * Las credenciales van como las escribe en su bio. "BOCA JUNIORS CALI" es UN
     * club —Boca Juniors de Cali, donde se retiró—, no dos: leerlo como "Boca" y
     * "Cali" le inventa un paso por Argentina y otro por el América.
     *
     * El número de seguidores NO va acá a propósito. Es un argumento de venta para
     * la agencia, no un elemento de conversión para su comprador: a quien va a
     * comprar guantes le importa que haya atajado en primera, no cuánta gente lo
     * sigue. Y un número así envejece; una carrera no.
     */
    persona: {
      nombre: "Nelson Ramos",
      rol: "Director técnico profesional y arquero",
      foto: {
        src: "/demos/guantes-nr1/nelson-ramos.webp",
        alt: "Nelson Ramos, director técnico y arquero, con guantes NR1",
        width: 900,
        height: 1125,
      },
      relato:
        "Arranqué en el Deportivo Pasto y me retiré en 2022 con Boca Juniors de Cali, a los 40 años. En el medio pasé por Millonarios, América, el Medellín, Bucaramanga y Quito, y metí 13 goles, 7 de tiro libre. Hoy dirijo, entreno arqueros y hago los guantes que me hubiera gustado tener cuando empecé.",
      credenciales: [
        "Dep. Pasto",
        "América",
        "Millonarios",
        "Medellín",
        "Fortaleza",
        "Dep. Quito",
        "Bucaramanga",
        "Boca Juniors de Cali",
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
