import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { ProductCard } from "./ProductCard";
import type { Demo, DemoProduct } from "@/lib/content";

const demo = {
  slug: "guantes-nr1",
  negocio: { nombre: "Guantes NR1", whatsapp: "573044962704" },
  categorias: [{ slug: "guantes", nombre: "Guantes" }],
} as unknown as Demo;

const base: DemoProduct = {
  slug: "guante-corte-negativo",
  nombre: "Guante corte negativo látex 4 mm",
  precio: 149900,
  categoria: "guantes",
  imagen: { src: "/demos/guantes-nr1/guante-corte-negativo.webp", alt: "Guante", width: 800, height: 800 },
  descripcion: "Corte negativo, látex de 4 mm.",
};

describe("ProductCard", () => {
  it("muestra nombre, categoria y precio", () => {
    render(<ProductCard producto={base} demo={demo} />);
    expect(screen.getByText("Guante corte negativo látex 4 mm")).toBeInTheDocument();
    expect(screen.getByText("Guantes")).toBeInTheDocument();
    // Ojo: acá el espacio va NORMAL, al revés que en format.test.ts. formatCOP
    // emite U+00A0 y el DOM lo conserva, pero el normalizador por defecto de
    // Testing Library colapsa todo \s —el espacio duro incluido— a un espacio
    // simple antes de comparar, así que un U+00A0 en el matcher no matchea nunca.
    expect(screen.getByText("$ 149.900")).toBeInTheDocument();
  });

  it("enlaza al detalle del producto", () => {
    render(<ProductCard producto={base} demo={demo} />);
    expect(screen.getByRole("link", { name: /Guante corte negativo/ })).toHaveAttribute(
      "href",
      "/demos/guantes-nr1/p/guante-corte-negativo",
    );
  });

  it("con precio null muestra 'Consultar por WhatsApp' y no un precio", () => {
    render(<ProductCard producto={{ ...base, precio: null }} demo={demo} />);
    expect(screen.getByText("Consultar por WhatsApp")).toBeInTheDocument();
    expect(screen.queryByText(/^\$/)).not.toBeInTheDocument();
  });

  it("con precio null el CTA va directo a WhatsApp, no al carrito", () => {
    render(<ProductCard producto={{ ...base, precio: null }} demo={demo} />);
    const cta = screen.getByRole("link", { name: /CONSULTAR/i });
    expect(cta).toHaveAttribute("href", expect.stringContaining("wa.me/573044962704"));
  });

  it("siempre conserva un enlace wa.me con el producto, para el caso sin JavaScript", () => {
    render(<ProductCard producto={base} demo={demo} />);
    const enlaces = screen.getAllByRole("link");
    expect(enlaces.some((a) => a.getAttribute("href")?.includes("wa.me"))).toBe(true);
  });
});
