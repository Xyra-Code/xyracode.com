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

  it("propaga className al contenedor", () => {
    const { container } = render(
      <ArticleBody blocks={[{ kind: "p", text: "x" }]} className="max-w-180" />,
    );
    const wrapper = container.querySelector(".prose-xyra");
    expect(wrapper).toHaveClass("max-w-180");
  });
});
