import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Breadcrumb } from "./Breadcrumb";

describe("Breadcrumb", () => {
  it("enlaza los items con href y marca el último como página actual", () => {
    render(
      <Breadcrumb
        items={[
          { label: "Inicio", href: "/" },
          { label: "Servicios", href: "/servicios" },
          { label: "Desarrollo web" },
        ]}
      />,
    );
    expect(screen.getByRole("link", { name: "Inicio" })).toHaveAttribute(
      "href",
      "/",
    );
    expect(screen.getByRole("link", { name: "Servicios" })).toHaveAttribute(
      "href",
      "/servicios",
    );
    const current = screen.getByText("Desarrollo web");
    expect(current).toHaveAttribute("aria-current", "page");
    expect(screen.queryByRole("link", { name: "Desarrollo web" })).toBeNull();
  });
});
