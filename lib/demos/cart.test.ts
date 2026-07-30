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
  {
    // Precio por talla: el caso de los guantes.
    slug: "por-talla",
    nombre: "Guante B",
    precio: null,
    categoria: "guantes",
    descripcion: "",
    imagen: { src: "/c.webp", alt: "C", width: 800, height: 800 },
    variantes: {
      label: "Talla",
      opciones: [
        { valor: "8", precio: 120000 },
        { valor: "9", precio: 130000 },
      ],
    },
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

  it("cobra el precio de la talla guardada, no uno del producto", () => {
    const [linea] = resolveCart([{ slug: "por-talla", cantidad: 1, variante: "9" }], productos);
    expect(linea.precio).toBe(130000);
  });

  it("descarta una talla que ya no existe en el catálogo", () => {
    // El localStorage sobrevive a los despliegues: una talla que el cliente dejó
    // de vender no resuelve a ningún precio, y sin precio no hay línea.
    expect(resolveCart([{ slug: "por-talla", cantidad: 1, variante: "13" }], productos)).toEqual(
      [],
    );
  });

  it("descarta un ítem sin talla en un producto que cobra por talla", () => {
    // Cobrar la talla más barata sería inventarle una elección al comprador.
    expect(resolveCart([{ slug: "por-talla", cantidad: 1 }], productos)).toEqual([]);
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
