import { act, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it } from "vitest";
import { getDemo, type Demo } from "@/lib/content";
import { resetCartStores } from "@/lib/demos/cart-store";
import { CartProvider } from "./CartProvider";
import { FilterableCatalog } from "./FilterableCatalog";

/**
 * La demo real y no un fixture inventado: los conteos que afirman estos tests
 * —16 referencias, 9 guantes (4 Edición Pro + 5 línea estándar), 4 de
 * indumentaria y 3 de accesorios— son los del catálogo que se publica, así que si
 * mañana entra o sale un producto el test lo cuenta.
 */
const demo = getDemo("guantes-nr1") as Demo;

/**
 * NR1 tiene productos en sus tres categorías, así que el estado "categoría sin
 * resultados" no se puede ver con los datos reales. Se AGREGA una categoría
 * vacía en vez de vaciar una existente: así el resto de los conteos del archivo
 * sigue valiendo.
 */
const conCategoriaVacia: Demo = {
  ...demo,
  categorias: [...demo.categorias, { slug: "promociones", nombre: "Promociones" }],
};

function montar(datos: Demo = demo) {
  // El provider hace falta porque la grilla trae el botón de agregar cableado
  // contra el carrito.
  return render(
    <CartProvider demo={datos}>
      <FilterableCatalog demo={datos} />
    </CartProvider>,
  );
}

/** Una tarjeta = un ítem de la lista que renderiza ProductGrid. */
const tarjetas = () => screen.queryAllByRole("listitem");
const chip = (nombre: string) => screen.getByRole("button", { name: nombre });
const clic = (elemento: HTMLElement) => act(() => elemento.click());

describe("FilterableCatalog", () => {
  beforeEach(() => {
    // El hash es la fuente de verdad del filtro y jsdom lo conserva entre
    // casos: sin este reset, un test arrancaría con la categoría del anterior.
    window.history.replaceState(null, "", "/");
    localStorage.clear();
    resetCartStores();
  });

  it("arranca en 'Todos' con el catálogo completo", () => {
    montar();
    expect(tarjetas()).toHaveLength(16);
    expect(chip("Todos")).toHaveAttribute("aria-pressed", "true");
  });

  it("al hacer clic en 'Guantes' deja solo los guantes y activa ese chip", () => {
    montar();
    clic(chip("Guantes"));
    expect(tarjetas()).toHaveLength(9);
    expect(chip("Guantes")).toHaveAttribute("aria-pressed", "true");
    expect(chip("Todos")).toHaveAttribute("aria-pressed", "false");
  });

  it("'Todos' reinicia el filtro", () => {
    montar();
    clic(chip("Indumentaria"));
    expect(tarjetas()).toHaveLength(4);
    clic(chip("Todos"));
    expect(tarjetas()).toHaveLength(16);
    expect(chip("Indumentaria")).toHaveAttribute("aria-pressed", "false");
  });

  it("el encabezado cuenta cuántas referencias se están mostrando", () => {
    montar();
    expect(screen.getByText("Mostrando 16 de 16")).toBeInTheDocument();
    clic(chip("Guantes"));
    expect(screen.getByText("Mostrando 9 de 16")).toBeInTheDocument();
  });

  describe("subcategorías", () => {
    it("solo la categoría que las tiene despliega la segunda fila", () => {
      montar();
      // En "Todos" no hay ninguna categoría abierta, así que no hay qué subdividir.
      expect(screen.queryByRole("group", { name: /filtrar dentro de/i })).not.toBeInTheDocument();

      clic(chip("Guantes"));
      expect(
        screen.getByRole("group", { name: "Filtrar dentro de Guantes" }),
      ).toBeInTheDocument();

      // Indumentaria no tiene subcategorías: la fila desaparece en vez de quedar
      // vacía.
      clic(chip("Indumentaria"));
      expect(screen.queryByRole("group", { name: /filtrar dentro de/i })).not.toBeInTheDocument();
    });

    it("acota a la subcategoría sin desmarcar la categoría padre", () => {
      montar();
      clic(chip("Guantes"));
      clic(chip("Edición Pro"));

      expect(tarjetas()).toHaveLength(4);
      expect(screen.getByText("Mostrando 4 de 16")).toBeInTheDocument();
      // El segundo nivel acota al primero, no lo reemplaza.
      expect(chip("Guantes")).toHaveAttribute("aria-pressed", "true");
      expect(chip("Edición Pro")).toHaveAttribute("aria-pressed", "true");
      expect(chip("Todos")).toHaveAttribute("aria-pressed", "false");
    });

    it("'Todo en Guantes' vuelve a la categoría completa, no al catálogo entero", () => {
      montar();
      clic(chip("Guantes"));
      clic(chip("Línea estándar"));
      expect(tarjetas()).toHaveLength(5);

      clic(chip("Todo en Guantes"));
      expect(tarjetas()).toHaveLength(9);
      expect(chip("Guantes")).toHaveAttribute("aria-pressed", "true");
      expect(chip("Línea estándar")).toHaveAttribute("aria-pressed", "false");
    });

    it("los 9 guantes se reparten entre las dos subcategorías, sin dejar ninguno afuera", () => {
      montar();
      clic(chip("Guantes"));
      clic(chip("Edición Pro"));
      const pro = tarjetas().length;
      clic(chip("Línea estándar"));
      const estandar = tarjetas().length;
      expect(pro + estandar).toBe(9);
    });
  });

  it("una categoría sin productos muestra el estado vacío y ninguna tarjeta", () => {
    montar(conCategoriaVacia);
    clic(chip("Promociones"));
    expect(tarjetas()).toHaveLength(0);
    // El copy va en caja normal y las mayúsculas las pone el CSS, así que el
    // texto del DOM está en caja de oración.
    expect(screen.getByText(/no hay nada en promociones/i)).toBeInTheDocument();
    expect(
      screen.getByText(/se nos agotó por ahora\. escríbenos y te avisamos cuando vuelva a entrar\./i),
    ).toBeInTheDocument();
  });

  it("el estado vacío ofrece WhatsApp del cliente y volver a todos los productos", () => {
    montar(conCategoriaVacia);
    clic(chip("Promociones"));

    const preguntar = screen.getByRole("link", { name: /preguntar por whatsapp/i });
    expect(preguntar.getAttribute("href")).toContain("wa.me/573044962704");

    clic(screen.getByRole("button", { name: /ver todos los productos/i }));
    expect(tarjetas()).toHaveLength(16);
  });

  it("activa la categoría del hash al montar: el nav enlaza a /catalogo#<slug>", () => {
    window.history.replaceState(null, "", "#indumentaria");
    montar();
    expect(tarjetas()).toHaveLength(4);
    expect(chip("Indumentaria")).toHaveAttribute("aria-pressed", "true");
  });

  it("un hash de SUBcategoría también abre su categoría padre", () => {
    // El hash guarda un solo slug y puede ser de cualquiera de los dos niveles.
    window.history.replaceState(null, "", "#edicion-pro");
    montar();
    expect(tarjetas()).toHaveLength(4);
    expect(chip("Edición Pro")).toHaveAttribute("aria-pressed", "true");
    expect(chip("Guantes")).toHaveAttribute("aria-pressed", "true");
  });

  it("ignora un hash que no corresponde a ninguna categoría", () => {
    window.history.replaceState(null, "", "#fantasma");
    montar();
    expect(tarjetas()).toHaveLength(16);
    expect(chip("Todos")).toHaveAttribute("aria-pressed", "true");
  });

  it("los guantes muestran el rango de sus tallas y la indumentaria una cifra", () => {
    // En los guantes el precio depende de la talla y la talla se elige en el
    // detalle, así que en la grilla lo honesto es el rango. En indumentaria todas
    // las tallas valen igual, y ahí un rango sería ruido. Espacio NORMAL en los
    // matchers: el normalizador de Testing Library colapsa el U+00A0 que emite
    // formatCOP, pero no toca el string que se le pasa.
    montar();

    // Piso de la línea estándar (5 referencias) y techo de Edición Pro (4).
    expect(screen.getAllByText("$ 99.900")).toHaveLength(5);
    expect(screen.getAllByText("$ 159.900")).toHaveLength(4);
    // 129.900 es a la vez el techo del estándar y el piso del Pro: sale en los 9.
    expect(screen.getAllByText("$ 129.900")).toHaveLength(9);

    // Una sola cifra, sin rango.
    expect(screen.getByText("$ 119.000")).toBeInTheDocument();

    // Y el accesorio sin precio publicado dice "Consultar" a secas: la consulta
    // por WhatsApp se hace en su detalle, no desde la grilla.
    expect(screen.getByText("Consultar")).toBeInTheDocument();
  });

  it("el CTA de un guante lleva a elegir talla; el de un precio único agrega", () => {
    montar();

    // Agregar un guante desde la grilla metería una talla que nadie eligió, a un
    // precio que la tarjeta nunca mostró: el rango no es un precio.
    clic(chip("Guantes"));
    const elegir = screen.getAllByRole("link", { name: /elegir talla/i });
    expect(elegir).toHaveLength(9);
    expect(elegir[0].getAttribute("href")).toContain("/demos/guantes-nr1/p/");
    expect(screen.queryByRole("link", { name: /^agregar$/i })).not.toBeInTheDocument();

    // En accesorios, con precio único, el agregado directo sigue existiendo: son
    // dos de los tres (el tercero no tiene precio publicado).
    clic(chip("Accesorios"));
    expect(screen.queryAllByRole("link", { name: /elegir talla/i })).toHaveLength(0);
    expect(screen.getAllByRole("link", { name: /^agregar$/i })).toHaveLength(2);
  });
});
