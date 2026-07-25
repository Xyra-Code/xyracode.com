/**
 * Modelo de bloques para cuerpos largos (casos de estudio y artículos).
 * Unión discriminada mínima; ampliar `kind` solo cuando un contenido real lo pida.
 */

/**
 * Texto de un párrafo. El string plano cubre el 95% de los casos; el array
 * habilita enlaces contextuales dentro de la frase, que es donde el anchor
 * text pesa de verdad para SEO. No mezclar HTML: solo estos dos tipos.
 *
 * @example
 * { kind: "p", text: ["Lo explicamos en ", { text: "la guía de precios", href: "/blog/..." }, "."] }
 */
export type Inline = string | { text: string; href: string };

export type Block =
  | { kind: "h2"; text: string }
  | { kind: "h3"; text: string }
  | { kind: "p"; text: string | Inline[] }
  | { kind: "ul"; items: string[] }
  | { kind: "image"; src: string; alt: string; width: number; height: number; caption?: string }
  | { kind: "quote"; text: string }
  /** Comparativa. `head` y cada fila de `rows` deben tener la misma longitud. */
  | { kind: "table"; head: string[]; rows: string[][]; caption?: string };
