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
    // `null` a propósito, con el precio viviendo solo en las tallas: si el panel
    // leyera `producto.precio` en vez del precio de la talla, la línea se caería
    // del carrito y estos casos fallarían en vez de pasar por casualidad.
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
    expect(screen.queryByText(/ir a pagar/i)).not.toBeInTheDocument();
  });

  it("con ítems: muestra subtotal y el CTA de pago", () => {
    montar();
    clic("cargar guante");
    clic("abrir");
    expect(screen.getByText(/^subtotal$/i)).toBeInTheDocument();
    expect(screen.getByText(/ir a pagar/i)).toBeInTheDocument();
  });

  it("el CTA lleva al checkout, no a WhatsApp", () => {
    // El proceso de compra va por el checkout. WhatsApp queda solo para dudas,
    // así que el botón principal del panel no puede ser un wa.me.
    montar();
    clic("cargar guante");
    clic("abrir");
    expect(screen.getByRole("link", { name: /ir a pagar/i })).toHaveAttribute(
      "href",
      "/demos/guantes-nr1/checkout",
    );
  });

  it("conserva un enlace a WhatsApp para dudas, no para pedir", () => {
    montar();
    clic("cargar guante");
    clic("abrir");
    const duda = screen.getByRole("link", { name: /escríbenos/i });
    const href = duda.getAttribute("href") ?? "";
    expect(href).toContain("wa.me/573044962704");
    expect(decodeURIComponent(href)).toContain("tengo una duda");
    expect(decodeURIComponent(href)).not.toContain("quiero pedir:");
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

  it("ofrece vaciar el pedido cuando hay ítems", () => {
    montar();
    clic("cargar guante");
    clic("abrir");
    expect(screen.getByRole("button", { name: /vaciar el pedido/i })).toBeInTheDocument();
  });

  it("no ofrece vaciar un pedido que ya está vacío", () => {
    montar();
    clic("abrir");
    expect(screen.queryByRole("button", { name: /vaciar el pedido/i })).not.toBeInTheDocument();
  });

  it("el primer clic en vaciar pide confirmación y no borra nada", () => {
    // Es la única acción del panel que no se puede deshacer: quitar un ítem se
    // vuelve a agregar de memoria, un pedido de ocho líneas no.
    montar();
    clic("cargar guante");
    clic("cargar espuma");
    clic("abrir");
    clic("Vaciar el pedido");
    expect(screen.getByText("Talla 8")).toBeInTheDocument();
    expect(screen.getByText("Única")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /sí, vaciar/i })).toBeInTheDocument();
  });

  it("confirmar vacía el pedido", () => {
    montar();
    clic("cargar guante");
    clic("abrir");
    clic("Vaciar el pedido");
    clic("Sí, vaciar");
    expect(screen.getByText(/todavía no has agregado nada/i)).toBeInTheDocument();
  });

  it("cancelar deja el pedido intacto y devuelve el botón", () => {
    montar();
    clic("cargar guante");
    clic("abrir");
    clic("Vaciar el pedido");
    clic("Cancelar");
    expect(screen.getByText("Talla 8")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /vaciar el pedido/i })).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /sí, vaciar/i })).not.toBeInTheDocument();
  });

  it("cerrar el panel descarta la confirmación pendiente", () => {
    // Reabrir con un "¿Seguro?" colgado de la sesión anterior deja al comprador
    // a un clic de borrar algo que ya no recuerda haber pedido borrar.
    montar();
    clic("cargar guante");
    clic("abrir");
    clic("Vaciar el pedido");
    act(() => screen.getByLabelText("Cerrar el pedido").click());
    clic("abrir");
    expect(screen.queryByRole("button", { name: /sí, vaciar/i })).not.toBeInTheDocument();
    expect(screen.getByRole("button", { name: /vaciar el pedido/i })).toBeInTheDocument();
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
