import { act, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it } from "vitest";
import type { Demo, DemoProduct } from "@/lib/content";
import { resetCartStores } from "@/lib/demos/cart-store";
import { CartProvider, useCart } from "./CartProvider";
import { CheckoutFlow } from "./CheckoutFlow";

const productos: DemoProduct[] = [
  {
    slug: "guante",
    nombre: "Guante corte negativo",
    // El precio vive en la talla, no en el producto: el total del checkout tiene
    // que salir de la talla 8 que carga el Control.
    precio: null,
    categoria: "guantes",
    descripcion: "",
    imagen: { src: "/a.webp", alt: "A", width: 800, height: 800 },
    variantes: {
      label: "Talla",
      opciones: [
        { valor: "8", precio: 149900 },
        { valor: "9", precio: 154900 },
      ],
    },
  },
];

const demo = {
  slug: "guantes-nr1",
  negocio: { nombre: "Guantes NR1", whatsapp: "573044962704" },
  productos,
} as unknown as Demo;

function Control() {
  const { add } = useCart();
  return <button onClick={() => add("guante", "8", 2)}>cargar</button>;
}

function montar() {
  return render(
    <CartProvider demo={demo}>
      <Control />
      <CheckoutFlow demo={demo} />
    </CartProvider>,
  );
}

const cargar = () => act(() => screen.getByText("cargar").click());

describe("CheckoutFlow", () => {
  beforeEach(() => {
    localStorage.clear();
    resetCartStores();
  });

  it("con el carrito vacío no muestra la nota ni el resumen", () => {
    // Es el estado del HTML prerenderizado: el carrito vive en el navegador, así
    // que en el servidor siempre está vacío.
    montar();
    expect(screen.getByText(/tu carrito está vacío/i)).toBeInTheDocument();
    expect(screen.queryByText(/nota de xyracode/i)).not.toBeInTheDocument();
  });

  it("con ítems muestra el resumen y el total multiplicado", () => {
    montar();
    cargar();
    expect(screen.getByText("2 × Guante corte negativo")).toBeInTheDocument();
    expect(screen.getByText("Talla 8")).toBeInTheDocument();
    // 2 × 149.900. getByText necesita espacio normal: el normalizador de Testing
    // Library colapsa el U+00A0 del DOM pero no el del matcher.
    expect(screen.getAllByText("$ 299.800").length).toBeGreaterThan(0);
  });

  it("explica que el pago va por la pasarela que el cliente elija", () => {
    montar();
    cargar();
    expect(screen.getByText(/nota de xyracode/i)).toBeInTheDocument();
    expect(screen.getByText(/aquí tu comprador pagaría/i)).toBeInTheDocument();
    expect(screen.getByText(/pasarela de pagos que tú elijas/i)).toBeInTheDocument();
    expect(
      screen.getByText(/se activa con la cuenta de comercio de tu negocio/i),
    ).toBeInTheDocument();
  });

  it("NO muestra un formulario de tarjeta", () => {
    // Decisión explícita: un formulario de pago que parece real invita a que
    // alguien escriba su tarjeta de verdad.
    montar();
    cargar();
    expect(screen.queryByLabelText(/tarjeta/i)).not.toBeInTheDocument();
    expect(screen.queryByLabelText(/cvv/i)).not.toBeInTheDocument();
  });

  it("el CTA lleva al WhatsApp de XyraCode con la demo identificada", () => {
    montar();
    cargar();
    const cta = screen.getByRole("link", { name: /quiero mi tienda funcionando/i });
    const href = cta.getAttribute("href") ?? "";
    // El de la AGENCIA, no el del cliente: este botón es un lead para XyraCode.
    expect(href).toContain("wa.me/573106790518");
    expect(href).not.toContain("573044962704");
    // Con varias demos circulando, el mensaje tiene que decir de cuál viene.
    expect(decodeURIComponent(href)).toContain("Guantes NR1");
  });

  it("ofrece volver a la tienda", () => {
    montar();
    cargar();
    expect(screen.getByRole("link", { name: /volver a la tienda/i })).toHaveAttribute(
      "href",
      "/demos/guantes-nr1",
    );
  });

  it("enlaza a xyracode.com para quien prefiera mirar antes de escribir", () => {
    montar();
    cargar();
    expect(screen.getByRole("link", { name: "xyracode.com" })).toHaveAttribute(
      "href",
      "https://xyracode.com",
    );
  });
});
