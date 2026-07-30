import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import type { Demo, DemoProduct } from "@/lib/content/demos";
import { formatCOP } from "@/lib/demos/format";
import { PanelProductos } from "./PanelProductos";

/**
 * `formatCOP` separa el signo con U+00A0. Testing Library normaliza el texto del
 * DOM (y `\s` incluye el espacio duro) pero NO el string del matcher, así que
 * `getByText(formatCOP(n))` no encuentra nada. Hay que normalizar el esperado.
 */
const precio = (cop: number) => formatCOP(cop).replace(/ /g, " ");

const productos: DemoProduct[] = [
  {
    slug: "guante",
    nombre: "Guante corte negativo",
    // Sin precio propio: vive en las tallas, como en el catálogo real.
    precio: null,
    categoria: "guantes",
    descripcion: "",
    imagen: { src: "/a.webp", alt: "A", width: 800, height: 800 },
    variantes: {
      label: "Talla",
      opciones: [
        { valor: "8", precio: 149900 },
        { valor: "9", precio: 154900 },
      ],
    },
  },
  {
    slug: "espuma",
    nombre: "Espuma limpiadora",
    precio: 28000,
    categoria: "accesorios",
    descripcion: "",
    imagen: { src: "/b.webp", alt: "B", width: 800, height: 800 },
  },
];

const demo = {
  slug: "guantes-nr1",
  productos,
  categorias: [
    { slug: "guantes", nombre: "Guantes" },
    { slug: "accesorios", nombre: "Accesorios" },
  ],
} as unknown as Demo;

describe("PanelProductos", () => {
  it("arranca con el catálogo real y el rango de cada producto", () => {
    render(<PanelProductos demo={demo} />);

    expect(screen.getByText("En el catálogo · 2")).toBeInTheDocument();
    expect(
      screen.getByText(`${precio(149900)} – ${precio(154900)}`),
    ).toBeInTheDocument();
    expect(screen.getByText(precio(28000))).toBeInTheDocument();
  });

  it("eliminar quita la fila del catálogo", () => {
    render(<PanelProductos demo={demo} />);

    fireEvent.click(screen.getByRole("button", { name: "Eliminar Espuma limpiadora" }));

    expect(screen.queryByText("Espuma limpiadora")).not.toBeInTheDocument();
    expect(screen.getByText("En el catálogo · 1")).toBeInTheDocument();
  });

  it("publicar con precio por talla calcula el rango de las seis tallas", () => {
    render(<PanelProductos demo={demo} />);

    fireEvent.change(screen.getByLabelText("Nombre"), {
      target: { value: "Guante azul" },
    });
    fireEvent.change(screen.getByLabelText("Precio de la talla 6"), {
      target: { value: "99900" },
    });
    fireEvent.click(screen.getByRole("button", { name: /publicar/i }));

    // Seis tallas, cinco saltos de 5.000: de 99.900 a 124.900.
    expect(screen.getByText("En el catálogo · 3")).toBeInTheDocument();
    expect(
      screen.getByText(`${precio(99900)} – ${precio(124900)}`),
    ).toBeInTheDocument();
  });

  it("con un solo precio no inventa un rango", () => {
    render(<PanelProductos demo={demo} />);

    fireEvent.change(screen.getByLabelText("Nombre"), { target: { value: "Bolso" } });
    fireEvent.click(screen.getByRole("button", { name: "Un solo precio" }));
    fireEvent.change(screen.getByLabelText("Precio"), { target: { value: "89000" } });
    fireEvent.click(screen.getByRole("button", { name: /publicar/i }));

    expect(screen.getByText(precio(89000))).toBeInTheDocument();
    expect(screen.queryByText(`${precio(89000)} – ${precio(89000)}`)).toBeNull();
  });

  it("editar el nombre conserva el precio sin obligar a reescribirlo", () => {
    render(<PanelProductos demo={demo} />);

    fireEvent.click(screen.getByRole("button", { name: "Editar Espuma limpiadora" }));
    fireEvent.change(screen.getByLabelText("Nombre"), {
      target: { value: "Espuma limpiadora 500 ml" },
    });
    fireEvent.click(screen.getByRole("button", { name: /guardar cambios/i }));

    expect(screen.getByText("Espuma limpiadora 500 ml")).toBeInTheDocument();
    expect(screen.getByText(precio(28000))).toBeInTheDocument();
    // Editar no duplica: sigue habiendo dos productos.
    expect(screen.getByText("En el catálogo · 2")).toBeInTheDocument();
  });
});
