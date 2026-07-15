import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import type { Block } from "@/lib/content/blocks";
import { BlockRenderer } from "./BlockRenderer";

// next/image necesita infra de Next; en jsdom lo sustituimos por un <img> simple.
vi.mock("next/image", () => ({
  default: (props: { src: string; alt: string }) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={props.src} alt={props.alt} />
  ),
}));

describe("BlockRenderer", () => {
  it("renderiza cada tipo de bloque con su etiqueta semántica", () => {
    const blocks: Block[] = [
      { kind: "h2", text: "Título" },
      { kind: "h3", text: "Subtítulo" },
      { kind: "p", text: "Un párrafo." },
      { kind: "ul", items: ["uno", "dos"] },
      {
        kind: "image",
        src: "/x.png",
        alt: "captura",
        width: 1200,
        height: 800,
        caption: "pie",
      },
      { kind: "quote", text: "una cita" },
    ];

    const { container } = render(<BlockRenderer blocks={blocks} />);

    expect(
      screen.getByRole("heading", { level: 2, name: "Título" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { level: 3, name: "Subtítulo" }),
    ).toBeInTheDocument();
    expect(screen.getByText("Un párrafo.")).toBeInTheDocument();
    expect(screen.getAllByRole("listitem")).toHaveLength(2);
    expect(screen.getByRole("img", { name: "captura" })).toBeInTheDocument();
    expect(screen.getByText("pie").tagName).toBe("FIGCAPTION");
    expect(container.querySelector("blockquote")).toHaveTextContent("una cita");
  });

  it("omite el figcaption cuando no hay caption", () => {
    const blocks: Block[] = [
      { kind: "image", src: "/y.png", alt: "sin pie", width: 100, height: 100 },
    ];
    const { container } = render(<BlockRenderer blocks={blocks} />);
    expect(container.querySelector("figcaption")).toBeNull();
  });
});
