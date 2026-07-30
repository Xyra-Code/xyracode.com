import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { StoreFooter } from "./StoreFooter";
import type { Demo } from "@/lib/content/demos";

/**
 * Demo mínima. El footer solo lee `negocio`, `categorias` y `persona.servicio`,
 * así que el resto del objeto no hace falta: lo que se prueba acá es justamente
 * que cada bloque dependa de su dato y desaparezca sin él.
 */
const demo = {
  slug: "guantes-nr1",
  negocio: {
    nombre: "Guantes NR1",
    tagline: "El inoxidable",
    lema: "Rendimiento. Control. Confianza.",
    whatsapp: "573044962704",
    logo: { src: "/demos/guantes-nr1/logo.png", alt: "Guantes NR1", width: 852, height: 728 },
    redes: [{ red: "instagram", href: "https://www.instagram.com/nelramosoficial1" }],
  },
  // Misma forma que los datos reales: una categoría con subcategorías y dos
  // planas. El footer solo dibuja el primer nivel (ver el test de abajo).
  categorias: [
    {
      slug: "guantes",
      nombre: "Guantes",
      subcategorias: [
        { slug: "edicion-pro", nombre: "Edición Pro" },
        { slug: "linea-estandar", nombre: "Línea estándar" },
      ],
    },
    { slug: "indumentaria", nombre: "Indumentaria" },
  ],
  persona: {
    nombre: "Nelson Ramos",
    servicio: { titulo: "Entrenamiento personalizado de arqueros", nota: "Sesiones." },
  },
} as unknown as Demo;

describe("StoreFooter", () => {
  it("enlaza el catálogo y cada categoría con su hash", () => {
    render(<StoreFooter demo={demo} />);

    const tienda = screen.getByRole("navigation", { name: "Tienda" });
    expect(tienda).toBeInTheDocument();

    expect(screen.getByRole("link", { name: "Catálogo" })).toHaveAttribute(
      "href",
      "/demos/guantes-nr1/catalogo",
    );
    // El hash y no un `?cat=`: el filtro corre en el navegador para que la página
    // siga prerenderizada, igual que en el nav.
    expect(screen.getByRole("link", { name: "Guantes" })).toHaveAttribute(
      "href",
      "/demos/guantes-nr1/catalogo#guantes",
    );
    expect(screen.getByRole("link", { name: "Indumentaria" })).toHaveAttribute(
      "href",
      "/demos/guantes-nr1/catalogo#indumentaria",
    );
  });

  it("lista solo el primer nivel: las subcategorías no bajan al footer", () => {
    render(<StoreFooter demo={demo} />);

    /*
      Las subcategorías se eligen DENTRO del catálogo, con la fila de chips que
      aparece al entrar a Guantes. Bajarlas acá haría un footer de siete enlaces
      donde dos son gamas del mismo producto, y además dejaría al footer
      contradiciendo al nav, que también lista el primer nivel.
    */
    expect(screen.queryByRole("link", { name: "Edición Pro" })).not.toBeInTheDocument();
    expect(screen.queryByRole("link", { name: "Línea estándar" })).not.toBeInTheDocument();
  });

  it("el enlace de contacto lleva el mensaje de consulta general de la tienda", () => {
    render(<StoreFooter demo={demo} />);

    // A la vista es "Escríbenos por" + el logo; la palabra "WhatsApp" vive en un
    // `sr-only`, así que entra en el nombre accesible.
    const contacto = screen.getByRole("link", { name: /Escríbenos por WhatsApp/ });
    expect(contacto).toHaveAttribute(
      "href",
      "https://wa.me/573044962704?text=" +
        encodeURIComponent("Hola Guantes NR1, vi su tienda y quiero preguntar por sus productos."),
    );
  });

  it("saca a la superficie el servicio de la persona, dirigido a ella por su nombre", () => {
    render(<StoreFooter demo={demo} />);

    const servicio = screen.getByRole("link", {
      name: /Entrenamiento personalizado de arqueros/,
    });
    expect(servicio).toHaveAttribute(
      "href",
      expect.stringContaining(encodeURIComponent("Hola Nelson Ramos, quiero información sobre")),
    );
  });

  it("muestra el pie con el nombre y el tagline del cliente", () => {
    render(<StoreFooter demo={demo} />);
    expect(screen.getByText(/Guantes NR1 · El inoxidable/)).toBeInTheDocument();
  });

  it("la firma es un solo enlace con la frase completa", () => {
    render(<StoreFooter demo={demo} />);

    /*
      La frase entera es el enlace y no solo "XyraCode": ahí vive el área táctil
      de 44px. Con la marca sola, el `min-h-11` empujaba su baseline fuera del
      renglón y la palabra salía corrida respecto a "Desarrollado por". El nombre
      accesible completo es lo que prueba que sigue siendo un enlace único.
    */
    expect(screen.getByRole("link", { name: "Desarrollado por XyraCode" })).toHaveAttribute(
      "href",
      "https://xyracode.com",
    );
  });

  it("sin redes, sin lema y sin servicio no deja bloques vacíos", () => {
    const minima = {
      ...demo,
      negocio: { ...demo.negocio, redes: undefined, lema: undefined },
      persona: undefined,
    } as unknown as Demo;

    render(<StoreFooter demo={minima} />);

    expect(screen.queryByRole("link", { name: /en Instagram/ })).not.toBeInTheDocument();
    expect(screen.queryByText(/Rendimiento\. Control\./)).not.toBeInTheDocument();
    expect(
      screen.queryByRole("link", { name: /Entrenamiento personalizado/ }),
    ).not.toBeInTheDocument();

    // Pero la tienda y el contacto siguen ahí: son los dos bloques que no
    // dependen de un campo opcional.
    expect(screen.getByRole("navigation", { name: "Tienda" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /Escríbenos por WhatsApp/ })).toBeInTheDocument();
  });
});
