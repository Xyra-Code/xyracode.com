import { act, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it } from "vitest";
import { getDemo, type Demo } from "@/lib/content";
import { resetCartStores } from "@/lib/demos/cart-store";
import { CartProvider } from "./CartProvider";
import { FilterableCatalog } from "./FilterableCatalog";

/**
 * La demo real y no un fixture inventado: los conteos que afirman estos tests
 * (12 referencias, 5 guantes, 4 de indumentaria) son los del catálogo que se
 * publica, así que si mañana entra o sale un producto el test lo cuenta.
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
    expect(tarjetas()).toHaveLength(12);
    expect(chip("Todos")).toHaveAttribute("aria-pressed", "true");
  });

  it("al hacer clic en 'Guantes' deja solo los guantes y activa ese chip", () => {
    montar();
    clic(chip("Guantes"));
    expect(tarjetas()).toHaveLength(5);
    expect(chip("Guantes")).toHaveAttribute("aria-pressed", "true");
    expect(chip("Todos")).toHaveAttribute("aria-pressed", "false");
  });

  it("'Todos' reinicia el filtro", () => {
    montar();
    clic(chip("Indumentaria"));
    expect(tarjetas()).toHaveLength(4);
    clic(chip("Todos"));
    expect(tarjetas()).toHaveLength(12);
    expect(chip("Indumentaria")).toHaveAttribute("aria-pressed", "false");
  });

  it("el encabezado cuenta cuántas referencias se están mostrando", () => {
    montar();
    expect(screen.getByText("Mostrando 12 de 12")).toBeInTheDocument();
    clic(chip("Guantes"));
    expect(screen.getByText("Mostrando 5 de 12")).toBeInTheDocument();
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
    expect(tarjetas()).toHaveLength(12);
  });

  it("activa la categoría del hash al montar: el nav enlaza a /catalogo#<slug>", () => {
    window.history.replaceState(null, "", "#indumentaria");
    montar();
    expect(tarjetas()).toHaveLength(4);
    expect(chip("Indumentaria")).toHaveAttribute("aria-pressed", "true");
  });

  it("ignora un hash que no corresponde a ninguna categoría", () => {
    window.history.replaceState(null, "", "#fantasma");
    montar();
    expect(tarjetas()).toHaveLength(12);
    expect(chip("Todos")).toHaveAttribute("aria-pressed", "true");
  });

  it("muestra el precio formateado, y el estado sin precio del producto que no lo tiene", () => {
    montar();
    // Espacio NORMAL en el matcher: el normalizador de Testing Library colapsa
    // el U+00A0 que emite formatCOP, pero no toca el string que se le pasa.
    expect(screen.getByText("$ 149.900")).toBeInTheDocument();
    // "Consultar por" a la vista + el logo de WhatsApp; la palabra sigue en el
    // DOM (`sr-only`), de ahí que se mida por textContent y no por getByText.
    expect(screen.getByText(/Consultar por/)).toHaveTextContent(
      "Consultar por WhatsApp",
    );
  });
});
