import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

/**
 * Todas las páginas del sitio deben montar `<SiteChrome />`; las de `app/demos/`
 * **no**, porque son tiendas de clientes y no llevan el JSON-LD ni el WhatsApp de
 * XyraCode.
 *
 * Este test sustituye la garantía estructural que habría dado un route group: al
 * bajar los dos globales del layout raíz a las páginas, nada impide que una página
 * nueva se olvide de montarlos, y sin `SiteChrome` esa página saldría sin `@graph`.
 * Acá falla en CI, que es mejor que descubrirlo en Search Console.
 *
 * No se usa `fs.globSync`: llegó en Node 22 y este proyecto corre en Node 20.
 * `readdirSync` recursivo devuelve separadores de Windows en win32, así que se
 * normalizan antes de filtrar.
 */
const paginas = readdirSync("app", { recursive: true })
  .map(String)
  .map((archivo) => archivo.split(/[\\/]/).join("/"))
  .filter((archivo) => archivo.endsWith("page.tsx") && !archivo.startsWith("demos/"));

describe("SiteChrome", () => {
  /**
   * Guarda contra un listado roto: `it.each([])` correría cero casos y pasaría en
   * verde. No se afirma un número exacto a propósito — agregar una página al sitio
   * es legítimo, y el `it.each` de abajo ya la obliga a montar SiteChrome.
   */
  it("encuentra las páginas del sitio", () => {
    expect(paginas.length).toBeGreaterThan(0);
  });

  it.each(paginas)("%s monta SiteChrome", (ruta) => {
    expect(readFileSync(join("app", ruta), "utf8")).toContain("<SiteChrome />");
  });
});
