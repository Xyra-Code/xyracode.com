import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Chip } from "./Chip";

describe("Chip", () => {
  it("renderiza el contenido y propaga className", () => {
    render(<Chip className="extra">Next.js</Chip>);
    const chip = screen.getByText("Next.js");
    expect(chip).toBeInTheDocument();
    expect(chip).toHaveClass("extra");
  });
});
