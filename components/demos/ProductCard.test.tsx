import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { ProductCard } from "./ProductCard";
import type { Demo, DemoProduct } from "@/lib/content/demos";

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

  it("con precio null dice 'Consultar', sin el logo de WhatsApp y sin precio", () => {
    render(<ProductCard producto={{ ...base, precio: null }} demo={demo} />);
    // "Consultar" a secas: la palabra "WhatsApp" que emitía el `sr-only` del logo
    // no puede aparecer en el textContent del bloque de precio.
    expect(screen.getByText("Consultar")).toBeInTheDocument();
    expect(screen.queryByText(/WhatsApp/)).not.toBeInTheDocument();
    expect(screen.queryByText(/^\$/)).not.toBeInTheDocument();
  });

  it("con precio null el CTA lleva al detalle, no al chat", () => {
    render(<ProductCard producto={{ ...base, precio: null }} demo={demo} />);
    const cta = screen.getByRole("link", { name: /ver producto/i });
    expect(cta).toHaveAttribute("href", "/demos/guantes-nr1/p/guante-corte-negativo");
  });

  it("ninguna tarjeta deja un enlace a wa.me, con precio o sin él", () => {
    // La consulta por WhatsApp vive en el detalle, en el hero y en el pie. Desde
    // la grilla no hay talla elegida ni pregunta concreta que mandar, así que un
    // `wa.me` acá saca a la persona del sitio antes de ver el producto.
    for (const producto of [base, { ...base, precio: null }]) {
      const { unmount } = render(<ProductCard producto={producto} demo={demo} />);
      const hrefs = screen.getAllByRole("link").map((a) => a.getAttribute("href"));
      expect(hrefs.some((href) => href?.includes("wa.me"))).toBe(false);
      unmount();
    }
  });

  it("sin CTA inyectado el respaldo es el detalle del producto", () => {
    // Es lo que se ve cuando la tarjeta se usa suelta y cuando el navegador no
    // ejecuta JavaScript: el carrito no abre, pero la ficha completa sigue ahí.
    render(<ProductCard producto={base} demo={demo} />);
    expect(screen.getByRole("link", { name: /ver producto/i })).toHaveAttribute(
      "href",
      "/demos/guantes-nr1/p/guante-corte-negativo",
    );
  });
});
