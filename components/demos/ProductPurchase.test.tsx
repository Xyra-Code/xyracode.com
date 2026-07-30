import { act, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it } from "vitest";
import type { Demo, DemoProduct } from "@/lib/content/demos";
import { resetCartStores } from "@/lib/demos/cart-store";
import { CartProvider, useCart } from "./CartProvider";
import { ProductPurchase } from "./ProductPurchase";

const conTalla: DemoProduct = {
  slug: "guante",
  nombre: "Guante corte negativo látex 4 mm",
  // El precio vive en cada talla, no en el producto.
  precio: null,
  categoria: "guantes",
  descripcion: "Látex alemán de 4 mm con corte negativo.",
  imagen: { src: "/a.webp", alt: "A", width: 800, height: 800 },
  variantes: {
    label: "Talla",
    opciones: [
      { valor: "7", precio: 149900 },
      { valor: "8", precio: 154900 },
      { valor: "9", precio: 159900 },
      { valor: "10", precio: 164900 },
    ],
  },
};

const sinVariantes: DemoProduct = {
  slug: "espuma",
  nombre: "Espuma limpiadora para látex 250 ml",
  precio: 28000,
  categoria: "accesorios",
  descripcion: "Espuma para limpiar el látex después de cada partido.",
  imagen: { src: "/b.webp", alt: "B", width: 800, height: 800 },
};

const sinPrecio: DemoProduct = {
  slug: "bolso",
  nombre: "Bolso portaguantes con malla de secado",
  precio: null,
  categoria: "accesorios",
  descripcion: "Compartimento con malla para que el látex seque.",
  imagen: { src: "/c.webp", alt: "C", width: 800, height: 800 },
};

const demo = {
  slug: "guantes-nr1",
  negocio: { nombre: "Guantes NR1", whatsapp: "573044962704" },
  categorias: [
    { slug: "guantes", nombre: "Guantes" },
    { slug: "accesorios", nombre: "Accesorios" },
  ],
  productos: [conTalla, sinVariantes, sinPrecio],
} as unknown as Demo;

/** Sonda: expone lo que quedó en el carrito, desde dentro del provider. */
function Sonda() {
  const { items, unidades } = useCart();
  return (
    <div>
      <p data-testid="unidades">{unidades}</p>
      <p data-testid="items">{JSON.stringify(items)}</p>
    </div>
  );
}

function montar(producto: DemoProduct) {
  return render(
    <CartProvider demo={demo}>
      <ProductPurchase producto={producto} demo={demo} />
      <Sonda />
    </CartProvider>,
  );
}

const clic = (elemento: HTMLElement) => act(() => elemento.click());
const clicTexto = (patron: RegExp) => clic(screen.getByRole("button", { name: patron }));
const items = () => JSON.parse(screen.getByTestId("items").textContent ?? "[]");

describe("ProductPurchase", () => {
  beforeEach(() => {
    localStorage.clear();
    // El store del carrito vive a nivel de módulo: su caché en memoria sobrevive
    // entre casos, así que limpiar el storage no alcanza para aislarlos.
    resetCartStores();
  });

  it("muestra kicker, nombre, precio y descripción", () => {
    montar(conTalla);
    expect(screen.getByText("Guantes")).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "Guante corte negativo látex 4 mm" }),
    ).toBeInTheDocument();
    // Sin talla elegida, el precio es el RANGO de las cuatro tallas: la más
    // barata y la más cara. Espacio NORMAL en los matchers: el normalizador de
    // Testing Library colapsa el U+00A0 del DOM, pero no el del matcher.
    expect(screen.getByText("$ 149.900")).toBeInTheDocument();
    expect(screen.getByText("$ 164.900")).toBeInTheDocument();
    expect(screen.getByText(/el precio depende de la talla/i)).toBeInTheDocument();
    expect(screen.getByText(/Látex alemán de 4 mm/)).toBeInTheDocument();
  });

  it("al elegir la talla el rango se reemplaza por el precio de esa talla", () => {
    // Es la razón de ser del selector: en los guantes el precio depende de la
    // talla, así que la cifra exacta no puede existir antes de elegir.
    montar(conTalla);
    clicTexto(/^9$/);

    expect(screen.getByText("$ 159.900")).toBeInTheDocument();
    // Ni la cifra más baja del rango ni la más alta siguen en pantalla.
    expect(screen.queryByText("$ 149.900")).not.toBeInTheDocument();
    expect(screen.queryByText("$ 164.900")).not.toBeInTheDocument();
    expect(screen.queryByText(/el precio depende de la talla/i)).not.toBeInTheDocument();
  });

  it("cambiar de talla cambia el precio", () => {
    montar(conTalla);
    clicTexto(/^7$/);
    expect(screen.getByText("$ 149.900")).toBeInTheDocument();
    clicTexto(/^10$/);
    expect(screen.getByText("$ 164.900")).toBeInTheDocument();
    expect(screen.queryByText("$ 149.900")).not.toBeInTheDocument();
  });

  it("sin variantes muestra un precio y no un rango", () => {
    montar(sinVariantes);
    expect(screen.getByText("$ 28.000")).toBeInTheDocument();
    expect(screen.queryByText(/el precio depende de la talla/i)).not.toBeInTheDocument();
  });

  it("con variantes renderiza el bloque de talla, sin ninguna preseleccionada", () => {
    montar(conTalla);
    expect(screen.getByRole("group", { name: "Talla" })).toBeInTheDocument();
    for (const talla of ["7", "8", "9", "10"]) {
      expect(screen.getByRole("button", { name: talla })).toHaveAttribute(
        "aria-pressed",
        "false",
      );
    }
  });

  it("sin talla elegida el CTA no agrega nada y avisa", () => {
    montar(conTalla);
    clicTexto(/agregar al carrito/i);
    expect(screen.getByTestId("unidades").textContent).toBe("0");
    expect(items()).toEqual([]);
    expect(screen.getByText(/elige una talla/i)).toBeInTheDocument();
  });

  it("con la talla elegida agrega esa variante y la cantidad del stepper", () => {
    montar(conTalla);
    clicTexto(/^9$/);
    // Dos clics en "+" para verificar que la cantidad que llega al carrito es la
    // del stepper y no un 1 fijo.
    clicTexto(/agregar uno/i);
    clicTexto(/agregar uno/i);
    clicTexto(/agregar al carrito/i);

    expect(items()).toEqual([{ slug: "guante", variante: "9", cantidad: 3 }]);
    expect(screen.getByTestId("unidades").textContent).toBe("3");
  });

  it("elegir una talla marca ese botón y desmarca el anterior", () => {
    montar(conTalla);
    clicTexto(/^8$/);
    expect(screen.getByRole("button", { name: "8" })).toHaveAttribute("aria-pressed", "true");
    clicTexto(/^9$/);
    expect(screen.getByRole("button", { name: "8" })).toHaveAttribute("aria-pressed", "false");
    expect(screen.getByRole("button", { name: "9" })).toHaveAttribute("aria-pressed", "true");
  });

  it("sin variantes no renderiza el bloque de talla y agrega directo", () => {
    montar(sinVariantes);
    expect(screen.queryByRole("group", { name: /talla/i })).not.toBeInTheDocument();
    clicTexto(/agregar al carrito/i);
    expect(items()).toEqual([{ slug: "espuma", variante: undefined, cantidad: 1 }]);
  });

  it("con precio null no hay botón de agregar, sino un enlace a WhatsApp", () => {
    montar(sinPrecio);
    expect(
      screen.queryByRole("button", { name: /agregar al carrito/i }),
    ).not.toBeInTheDocument();

    const cta = screen.getByRole("link", { name: /consultar por whatsapp/i });
    const href = cta.getAttribute("href") ?? "";
    expect(href).toContain("wa.me/573044962704");
    expect(decodeURIComponent(href)).toContain(
      "Hola Guantes NR1, quiero preguntar por: Bolso portaguantes con malla de secado",
    );
  });

  it("con precio conserva un enlace a WhatsApp para preguntar", () => {
    montar(conTalla);
    const secundario = screen.getByRole("link", { name: /preguntar por whatsapp/i });
    expect(secundario.getAttribute("href")).toContain("wa.me/573044962704");
  });
});
