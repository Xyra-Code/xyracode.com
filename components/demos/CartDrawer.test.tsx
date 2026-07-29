import { act, fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it } from "vitest";
import type { Demo, DemoProduct } from "@/lib/content";
import { CartDrawer } from "./CartDrawer";
import { resetCartStores } from "@/lib/demos/cart-store";
import { CartProvider, useCart } from "./CartProvider";

const productos: DemoProduct[] = [
  {
    slug: "guante",
    nombre: "Guante corte negativo",
    precio: 149900,
    categoria: "guantes",
    descripcion: "",
    imagen: { src: "/a.webp", alt: "A", width: 800, height: 800 },
    variantes: { label: "Talla", opciones: ["8", "9"] },
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
  negocio: { nombre: "Guantes NR1", whatsapp: "573044962704" },
  productos,
} as unknown as Demo;

/** Abre el panel y permite cargarlo, desde dentro del provider. */
function Control() {
  const { abrir, add } = useCart();
  return (
    <div>
      <button onClick={abrir}>abrir</button>
      <button onClick={() => add("guante", "8", 1)}>cargar guante</button>
      <button onClick={() => add("espuma", undefined, 2)}>cargar espuma</button>
    </div>
  );
}

function montar() {
  return render(
    <CartProvider demo={demo}>
      <Control />
      <CartDrawer demo={demo} />
    </CartProvider>,
  );
}

const clic = (nombre: string) => act(() => screen.getByText(nombre).click());

describe("CartDrawer", () => {
  beforeEach(() => {
    localStorage.clear();
    // El store vive a nivel de módulo: su caché en memoria sobrevive entre
    // casos, así que limpiar el storage no alcanza para aislarlos.
    resetCartStores();
  });

  it("no renderiza nada mientras está cerrado", () => {
    montar();
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("vacío: muestra el mensaje y no muestra subtotal ni CTA de pedido", () => {
    montar();
    clic("abrir");
    expect(screen.getByText(/todavía no has agregado nada/i)).toBeInTheDocument();
    expect(screen.getByText(/ver catálogo/i)).toBeInTheDocument();
    expect(screen.queryByText(/^subtotal$/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/PEDIR POR WHATSAPP/i)).not.toBeInTheDocument();
  });

  it("con ítems: muestra subtotal y el CTA de pedido", () => {
    montar();
    clic("cargar guante");
    clic("abrir");
    expect(screen.getByText(/^subtotal$/i)).toBeInTheDocument();
    expect(screen.getByText(/PEDIR POR WHATSAPP/i)).toBeInTheDocument();
  });

  it("el CTA arma el pedido en un enlace wa.me del cliente", () => {
    montar();
    clic("cargar guante");
    clic("abrir");
    const cta = screen.getByRole("link", { name: /PEDIR POR WHATSAPP/i });
    const href = cta.getAttribute("href") ?? "";
    expect(href).toContain("wa.me/573044962704");
    expect(decodeURIComponent(href)).toContain("Guante corte negativo");
    expect(decodeURIComponent(href)).toContain("Hola Guantes NR1, quiero pedir:");
  });

  it("muestra la variante, y 'Única' cuando el producto no tiene", () => {
    montar();
    clic("cargar guante");
    clic("cargar espuma");
    clic("abrir");
    expect(screen.getByText("Talla 8")).toBeInTheDocument();
    expect(screen.getByText("Única")).toBeInTheDocument();
  });

  it("bajar la cantidad a cero quita el ítem", () => {
    montar();
    clic("cargar guante");
    clic("abrir");
    act(() => screen.getByLabelText("Quitar uno").click());
    expect(screen.getByText(/todavía no has agregado nada/i)).toBeInTheDocument();
  });

  it("cierra con Escape", () => {
    montar();
    clic("abrir");
    expect(screen.getByRole("dialog")).toBeInTheDocument();
    act(() => {
      fireEvent.keyDown(document, { key: "Escape" });
    });
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("cierra al hacer clic en el overlay", () => {
    montar();
    clic("abrir");
    act(() => screen.getByTestId("cart-overlay").click());
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("cierra con el botón de cerrar", () => {
    montar();
    clic("abrir");
    act(() => screen.getByLabelText("Cerrar el pedido").click());
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("es un diálogo modal para lectores de pantalla", () => {
    montar();
    clic("abrir");
    const panel = screen.getByRole("dialog");
    expect(panel).toHaveAttribute("aria-modal", "true");
  });
});
