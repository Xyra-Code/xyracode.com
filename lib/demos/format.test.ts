import { describe, expect, it } from "vitest";
import { formatCOP } from "./format";

describe("formatCOP", () => {
  it("formatea miles con punto y espacio duro", () => {
    // Intl es-CO separa el signo del número con U+00A0, no con un espacio
    // normal: un test escrito con espacio normal falla sin decir por qué.
    expect(formatCOP(149900)).toBe("$ 149.900");
  });

  it("formatea millones", () => {
    expect(formatCOP(1250000)).toBe("$ 1.250.000");
  });

  it("no muestra decimales", () => {
    expect(formatCOP(28000)).toBe("$ 28.000");
  });

  it("formatea el cero", () => {
    expect(formatCOP(0)).toBe("$ 0");
  });
});
