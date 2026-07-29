import { describe, expect, it } from "vitest";
import { buildOrderHref, buildProductInquiryHref } from "./order";

describe("buildOrderHref", () => {
  it("apunta a wa.me con el mensaje percent-encoded", () => {
    const href = buildOrderHref("573044962704", "Hola\nchau");
    expect(href).toBe("https://wa.me/573044962704?text=Hola%0Achau");
  });
});

describe("buildProductInquiryHref", () => {
  it("pregunta por un producto puntual", () => {
    const href = buildProductInquiryHref(
      "573044962704",
      "Guantes NR1",
      "Bolso portaguantes",
    );
    expect(href).toBe(
      "https://wa.me/573044962704?text=" +
        encodeURIComponent("Hola Guantes NR1, quiero preguntar por: Bolso portaguantes"),
    );
  });
});
