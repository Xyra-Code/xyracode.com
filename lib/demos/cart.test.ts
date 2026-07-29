import { describe, expect, it } from "vitest";
import type { DemoProduct } from "@/lib/content";
import { cartStorageKey, resolveCart } from "./cart";

const productos: DemoProduct[] = [
  {
    slug: "a",
    nombre: "Guante A",
    precio: 100000,
    categoria: "guantes",
    descripcion: "",
    imagen: { src: "/a.webp", alt: "A", width: 800, height: 800 },
  },
  {
    slug: "sin-precio",
    nombre: "Bolso",
    precio: null,
    categoria: "accesorios",
    descripcion: "",
    imagen: { src: "/b.webp", alt: "B", width: 800, height: 800 },
  },
];

describe("resolveCart", () => {
  it("resuelve nombre y precio desde los productos, no desde el storage", () => {
    const [linea] = resolveCart([{ slug: "a", cantidad: 2, variante: "Talla 8" }], productos);
    expect(linea.nombre).toBe("Guante A");
    expect(linea.precio).toBe(100000);
    expect(linea.cantidad).toBe(2);
    expect(linea.variante).toBe("Talla 8");
  });

  it("descarta slugs que ya no existen en los datos", () => {
    // Un localStorage viejo puede tener productos que se quitaron del catálogo.
    // Sin este filtro el panel intentaría renderizar undefined.
    expect(resolveCart([{ slug: "fantasma", cantidad: 1 }], productos)).toEqual([]);
  });

  it("descarta ítems sin precio: no deberían haber entrado al carrito", () => {
    expect(resolveCart([{ slug: "sin-precio", cantidad: 1 }], productos)).toEqual([]);
  });

  it("conserva el orden en que se agregaron", () => {
    const lineas = resolveCart(
      [
        { slug: "a", cantidad: 1, variante: "Talla 9" },
        { slug: "a", cantidad: 3, variante: "Talla 8" },
      ],
      productos,
    );
    expect(lineas.map((l) => l.variante)).toEqual(["Talla 9", "Talla 8"]);
  });
});

describe("cartStorageKey", () => {
  it("aísla el carrito por demo", () => {
    expect(cartStorageKey("guantes-nr1")).toBe("carrito:guantes-nr1");
    expect(cartStorageKey("otro-cliente")).toBe("carrito:otro-cliente");
  });
});
