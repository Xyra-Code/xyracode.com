import { describe, expect, it } from "vitest";
import type { Demo, DemoProduct } from "@/lib/content";
import { agendaDemo, pedidosDemo } from "./panel";

const productos: DemoProduct[] = [
  {
    slug: "por-talla",
    nombre: "Guante por talla",
    precio: null,
    categoria: "guantes",
    descripcion: "",
    imagen: { src: "/a.webp", alt: "A", width: 800, height: 800 },
    variantes: {
      label: "Talla",
      opciones: [
        { valor: "8", precio: 100000 },
        { valor: "9", precio: 110000 },
        { valor: "10", precio: 120000 },
      ],
    },
  },
  {
    slug: "precio-unico",
    nombre: "Espuma limpiadora",
    precio: 28000,
    categoria: "accesorios",
    descripcion: "",
    imagen: { src: "/b.webp", alt: "B", width: 800, height: 800 },
  },
  {
    slug: "sin-precio",
    nombre: "Bolso a consultar",
    precio: null,
    categoria: "accesorios",
    descripcion: "",
    imagen: { src: "/c.webp", alt: "C", width: 800, height: 800 },
  },
];

const conServicio = {
  slug: "guantes-nr1",
  productos,
  persona: { servicio: { titulo: "Entrenamiento", nota: "" } },
} as unknown as Demo;

const sinServicio = { slug: "otra", productos } as unknown as Demo;

describe("pedidosDemo", () => {
  it("es determinista: dos llamadas dan lo mismo", () => {
    // Sin esto el prerender daria un HTML distinto en cada build.
    expect(pedidosDemo(conServicio)).toEqual(pedidosDemo(conServicio));
  });

  it("nunca incluye un producto sin precio publicado", () => {
    // Ese producto no entra al carrito, asi que un pedido con el no existe.
    const nombres = pedidosDemo(conServicio).flatMap((p) => p.lineas.map((l) => l.nombre));
    expect(nombres).not.toContain("Bolso a consultar");
  });

  it("cobra el precio de la talla, no el del producto", () => {
    const linea = pedidosDemo(conServicio)
      .flatMap((p) => p.lineas)
      .find((l) => l.nombre === "Guante por talla");
    // La talla del medio de tres opciones es la 9.
    expect(linea?.talla).toBe("9");
    expect(linea?.precio).toBe(110000);
  });

  it("el total es la suma de precio por cantidad", () => {
    for (const pedido of pedidosDemo(conServicio)) {
      const esperado = pedido.lineas.reduce((s, l) => s + l.precio * l.cantidad, 0);
      expect(pedido.total).toBe(esperado);
    }
  });

  it("no repite el mismo producto dentro de un pedido", () => {
    for (const pedido of pedidosDemo(conServicio)) {
      const nombres = pedido.lineas.map((l) => l.nombre);
      expect(new Set(nombres).size).toBe(nombres.length);
    }
  });

  it("sin productos vendibles devuelve una lista vacia", () => {
    const soloConsultar = { slug: "x", productos: [productos[2]] } as unknown as Demo;
    expect(pedidosDemo(soloConsultar)).toEqual([]);
  });
});

describe("agendaDemo", () => {
  it("solo existe si el cliente vende el servicio", () => {
    expect(agendaDemo(conServicio).length).toBeGreaterThan(0);
    expect(agendaDemo(sinServicio)).toEqual([]);
  });

  it("un grupo lleno no admite mas cupos que su total", () => {
    for (const sesion of agendaDemo(conServicio)) {
      if (sesion.cupos) expect(sesion.cupos.tomados).toBeLessThanOrEqual(sesion.cupos.total);
    }
  });
});
