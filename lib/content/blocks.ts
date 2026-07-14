/**
 * Modelo de bloques para cuerpos largos (casos de estudio y artículos de blog).
 * Unión discriminada mínima; ampliar `kind` solo cuando un contenido real lo pida.
 */
export type Block =
  | { kind: "h2"; text: string }
  | { kind: "p"; text: string }
  | { kind: "ul"; items: string[] }
  | { kind: "image"; src: string; alt: string; width: number; height: number; caption?: string }
  | { kind: "quote"; text: string };
