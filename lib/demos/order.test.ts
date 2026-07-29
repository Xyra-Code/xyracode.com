import { describe, expect, it } from "vitest";
import { buildOrderHref, buildOrderMessage, buildProductInquiryHref } from "./order";

// Intl es-CO separa el signo del número con U+00A0. Se nombra para que quede
// claro en los tests que no es un espacio normal.
const NBSP = " ";

describe("buildOrderMessage", () => {
  it("arma un pedido de un ítem con variante", () => {
    const msg = buildOrderMessage("Guantes NR1", [
      {
        nombre: "Guante corte negativo látex 4 mm",
        cantidad: 1,
        precio: 149900,
        variante: "Talla 8",
      },
    ]);
    expect(msg).toBe(
      "Hola Guantes NR1, quiero pedir:\n" +
        `• 1 × Guante corte negativo látex 4 mm (Talla 8) — $${NBSP}149.900\n` +
        `Total: $${NBSP}149.900`,
    );
  });

  it("multiplica el precio de línea por la cantidad", () => {
    const msg = buildOrderMessage("Guantes NR1", [
      { nombre: "Espuma limpiadora para látex 250 ml", cantidad: 2, precio: 28000 },
    ]);
    expect(msg).toContain(`• 2 × Espuma limpiadora para látex 250 ml — $${NBSP}56.000`);
    expect(msg).toContain(`Total: $${NBSP}56.000`);
  });

  it("omite el paréntesis cuando el ítem no tiene variante", () => {
    const msg = buildOrderMessage("Guantes NR1", [
      { nombre: "Vendaje elástico para dedos", cantidad: 1, precio: 18500 },
    ]);
    expect(msg).toContain("• 1 × Vendaje elástico para dedos — ");
    expect(msg).not.toContain("(");
  });

  it("suma varios ítems y usa un salto de línea por ítem", () => {
    const msg = buildOrderMessage("Guantes NR1", [
      {
        nombre: "Guante corte negativo látex 4 mm",
        cantidad: 2,
        precio: 149900,
        variante: "Talla 8",
      },
      {
        nombre: "Buzo de arquero manga larga con coderas",
        cantidad: 1,
        precio: 119000,
        variante: "Talla M",
      },
    ]);
    // saludo + 2 ítems + total
    expect(msg.split("\n")).toHaveLength(4);
    expect(msg).toContain(`Total: $${NBSP}418.800`);
  });

  it("devuelve solo el saludo cuando no hay ítems", () => {
    expect(buildOrderMessage("Guantes NR1", [])).toBe("Hola Guantes NR1, quiero pedir:");
  });
});

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
