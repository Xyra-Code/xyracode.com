import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import type { Block } from "@/lib/content/blocks";
import { ArticleBody } from "./ArticleBody";

// next/image necesita infra de Next; en jsdom lo sustituimos por un <img> simple.
vi.mock("next/image", () => ({
  default: (props: { src: string; alt: string }) => (
    // eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text
    <img src={props.src} alt={props.alt} />
  ),
}));

describe("ArticleBody", () => {
  it("envuelve el renderer en .prose-xyra y pinta HTML semántico", () => {
    const blocks: Block[] = [
      { kind: "h2", text: "Sección" },
      { kind: "p", text: "Un párrafo largo." },
    ];
    const { container } = render(<ArticleBody blocks={blocks} />);
    expect(container.querySelector(".prose-xyra")).not.toBeNull();
    expect(
      screen.getByRole("heading", { level: 2, name: "Sección" }),
    ).toBeInTheDocument();
    expect(screen.getByText("Un párrafo largo.")).toBeInTheDocument();
  });

  it("pinta enlaces contextuales dentro de un párrafo", () => {
    const blocks: Block[] = [
      {
        kind: "p",
        text: [
          "Lo explicamos en ",
          { text: "la guía de precios", href: "/blog/precios" },
          ".",
        ],
      },
    ];
    render(<ArticleBody blocks={blocks} />);
    const link = screen.getByRole("link", { name: "la guía de precios" });
    expect(link).toHaveAttribute("href", "/blog/precios");
    // El texto alrededor del enlace no se pierde al partir el párrafo.
    expect(screen.getByText(/Lo explicamos en/)).toBeInTheDocument();
  });

  it("pinta la tabla con encabezados de columna y de fila", () => {
    const blocks: Block[] = [
      {
        kind: "table",
        caption: "Comparativa",
        head: ["Camino", "Qué resuelve"],
        rows: [["Sitio web", "Que te encuentren"]],
      },
    ];
    const { container } = render(<ArticleBody blocks={blocks} />);
    // El wrapper es el que scrollea: sin él la tabla desborda en móvil.
    expect(container.querySelector(".prose-table table")).not.toBeNull();
    expect(screen.getByRole("columnheader", { name: "Camino" })).toBeInTheDocument();
    expect(screen.getByRole("rowheader", { name: "Sitio web" })).toBeInTheDocument();
    expect(screen.getByRole("cell", { name: "Que te encuentren" })).toBeInTheDocument();
  });

  it("propaga className al contenedor", () => {
    const { container } = render(
      <ArticleBody blocks={[{ kind: "p", text: "x" }]} className="max-w-180" />,
    );
    const wrapper = container.querySelector(".prose-xyra");
    expect(wrapper).toHaveClass("max-w-180");
  });
});
