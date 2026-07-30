import { act, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it } from "vitest";
import type { Demo, DemoProduct } from "@/lib/content/demos";
import { resetCartStores } from "@/lib/demos/cart-store";
import { CartProvider, useCart } from "./CartProvider";

const productos: DemoProduct[] = [
  {
    slug: "guante",
    nombre: "Guante A",
    // Sin precio de producto: el total sale del precio de cada talla, y las dos
    // valen distinto para que una talla mal resuelta se vea en el total.
    precio: null,
    categoria: "guantes",
    descripcion: "",
    imagen: { src: "/a.webp", alt: "A", width: 800, height: 800 },
    variantes: {
      label: "Talla",
      opciones: [
        { valor: "8", precio: 100000 },
        { valor: "9", precio: 110000 },
      ],
    },
  },
  {
    slug: "espuma",
    nombre: "Espuma",
    precio: 28000,
    categoria: "accesorios",
    descripcion: "",
    imagen: { src: "/b.webp", alt: "B", width: 800, height: 800 },
  },
];

const demo = { slug: "guantes-nr1", productos } as unknown as Demo;

/** Sonda: expone el estado del carrito y unos botones para manipularlo. */
function Sonda() {
  const { unidades, total, lineas, add, setCantidad, remove, vaciar } = useCart();
  return (
    <div>
      <p data-testid="unidades">{unidades}</p>
      <p data-testid="total">{total}</p>
      <p data-testid="lineas">{lineas.length}</p>
      <button onClick={() => add("guante", "8", 1)}>add guante 8</button>
      <button onClick={() => add("guante", "9", 2)}>add guante 9</button>
      <button onClick={() => add("espuma", undefined, 1)}>add espuma</button>
      <button onClick={() => setCantidad("guante", "8", 0)}>cero guante 8</button>
      <button onClick={() => remove("espuma", undefined)}>quitar espuma</button>
      <button onClick={vaciar}>vaciar</button>
    </div>
  );
}

function montar() {
  return render(
    <CartProvider demo={demo}>
      <Sonda />
    </CartProvider>,
  );
}

const clic = (nombre: string) => act(() => screen.getByText(nombre).click());
const leer = (id: string) => screen.getByTestId(id).textContent;

describe("CartProvider", () => {
  beforeEach(() => {
    localStorage.clear();
    // El store vive a nivel de módulo: su caché en memoria sobrevive entre
    // casos, así que limpiar el storage no alcanza para aislarlos.
    resetCartStores();
  });

  it("arranca vacío", () => {
    montar();
    expect(leer("unidades")).toBe("0");
    expect(leer("total")).toBe("0");
  });

  it("agrega unidades y calcula el total", () => {
    montar();
    clic("add guante 8");
    expect(leer("unidades")).toBe("1");
    expect(leer("total")).toBe("100000");
  });

  it("acumula en la misma línea cuando coinciden producto y variante", () => {
    montar();
    clic("add guante 8");
    clic("add guante 8");
    expect(leer("lineas")).toBe("1");
    expect(leer("unidades")).toBe("2");
  });

  it("crea líneas separadas para variantes distintas del mismo producto", () => {
    montar();
    clic("add guante 8");
    clic("add guante 9");
    expect(leer("lineas")).toBe("2");
    expect(leer("unidades")).toBe("3");
  });

  it("cobra cada talla a su propio precio", () => {
    // 1 × talla 8 (100.000) + 2 × talla 9 (110.000). Si el total resolviera una
    // sola cifra para todo el producto, acá saldría 300.000 o 330.000.
    montar();
    clic("add guante 8");
    clic("add guante 9");
    expect(leer("total")).toBe("320000");
  });

  it("quita el ítem al bajar la cantidad a cero", () => {
    montar();
    clic("add guante 8");
    clic("cero guante 8");
    expect(leer("lineas")).toBe("0");
  });

  it("quita un ítem sin variante", () => {
    montar();
    clic("add espuma");
    clic("quitar espuma");
    expect(leer("lineas")).toBe("0");
  });

  it("vaciar deja el carrito sin líneas, sin unidades y sin total", () => {
    montar();
    clic("add guante 8");
    clic("add espuma");
    clic("vaciar");
    expect(leer("lineas")).toBe("0");
    expect(leer("unidades")).toBe("0");
    expect(leer("total")).toBe("0");
  });

  it("vaciar también borra lo persistido, no solo lo que está en pantalla", () => {
    // Si el storage quedara con los ítems viejos, el carrito volvería solo al
    // refrescar y el comprador lo leería como que la tienda no le hizo caso.
    montar();
    clic("add espuma");
    clic("vaciar");
    expect(JSON.parse(localStorage.getItem("carrito:guantes-nr1") as string)).toEqual([]);
  });

  it("persiste en localStorage bajo la clave de la demo", () => {
    montar();
    clic("add espuma");
    const bruto = localStorage.getItem("carrito:guantes-nr1");
    expect(bruto).toBeTruthy();
    expect(JSON.parse(bruto as string)).toEqual([
      { slug: "espuma", variante: undefined, cantidad: 1 },
    ]);
  });

  it("rehidrata desde localStorage al montar", () => {
    localStorage.setItem(
      "carrito:guantes-nr1",
      JSON.stringify([{ slug: "guante", variante: "8", cantidad: 3 }]),
    );
    montar();
    expect(leer("unidades")).toBe("3");
    expect(leer("total")).toBe("300000");
  });

  it("descarta al rehidratar los slugs que ya no están en el catálogo", () => {
    // El localStorage sobrevive a los despliegues: si un producto se quita del
    // catálogo, el panel no puede intentar renderizarlo.
    localStorage.setItem(
      "carrito:guantes-nr1",
      JSON.stringify([
        { slug: "fantasma", cantidad: 5 },
        { slug: "espuma", cantidad: 1 },
      ]),
    );
    montar();
    expect(leer("lineas")).toBe("1");
    expect(leer("unidades")).toBe("1");
  });

  it("ignora un localStorage corrupto en vez de romper la tienda", () => {
    localStorage.setItem("carrito:guantes-nr1", "{no es json}");
    montar();
    expect(leer("unidades")).toBe("0");
  });
});
