import type { Demo, DemoProduct } from "@/lib/content";
import { precioDe } from "./price";

/**
 * Datos de muestra del panel de administración.
 *
 * **Deterministas a propósito**: sin `Math.random()` ni `new Date()`. Las dos
 * cosas romperían el prerender —cada build daría un HTML distinto— y `new Date()`
 * además hornearía la fecha de compilación, así que a la semana el panel mostraría
 * pedidos "de hoy" que son de hace siete días. Por eso los días son etiquetas
 * relativas ("Hoy", "Ayer") y no fechas.
 *
 * Los pedidos se derivan del catálogo real del cliente: ver sus propios productos
 * y sus propios precios en el panel es lo que hace creíble la pantalla. Inventar
 * "Producto 1 — $10.000" la convierte en un mockup.
 */

export type EstadoPedido = "nuevo" | "preparando" | "despachado";

export type PedidoDemo = {
  numero: string;
  comprador: string;
  ciudad: string;
  dia: string;
  estado: EstadoPedido;
  lineas: { nombre: string; talla?: string; cantidad: number; precio: number }[];
  total: number;
};

/** Compradores de muestra. Nombres comunes en Colombia, ninguno real. */
const COMPRADORES = [
  { nombre: "Andrés Villalba", ciudad: "Bogotá" },
  { nombre: "Juan David Ospina", ciudad: "Medellín" },
  { nombre: "Santiago Rueda", ciudad: "Villavicencio" },
  { nombre: "Kevin Mosquera", ciudad: "Cali" },
  { nombre: "Mateo Arango", ciudad: "Pereira" },
] as const;

const DIAS = ["Hoy", "Hoy", "Ayer", "Ayer", "Hace 3 días"] as const;
const ESTADOS: EstadoPedido[] = ["nuevo", "nuevo", "preparando", "despachado", "despachado"];

/** Toma la talla del medio de las disponibles: la que más se pide. */
function tallaTipica(producto: DemoProduct): string | undefined {
  const opciones = producto.variantes?.opciones;
  if (!opciones || opciones.length === 0) return undefined;
  return opciones[Math.floor(opciones.length / 2)]?.valor;
}

export function pedidosDemo(demo: Demo): PedidoDemo[] {
  // Solo productos con precio resoluble: un pedido de algo "a consultar" no
  // existe, porque ese producto nunca entra al carrito.
  const vendibles = demo.productos.filter(
    (producto) => precioDe(producto, tallaTipica(producto)) !== null,
  );
  if (vendibles.length === 0) return [];

  return COMPRADORES.map((comprador, indice) => {
    // Dos productos por pedido, recorriendo el catálogo en orden: determinista y
    // sin repetir siempre el mismo par.
    const elegidos = [
      vendibles[indice % vendibles.length],
      vendibles[(indice * 2 + 1) % vendibles.length],
    ].filter((producto, i, todos) => todos.indexOf(producto) === i);

    const lineas = elegidos.map((producto, i) => {
      const talla = tallaTipica(producto);
      return {
        nombre: producto.nombre,
        talla,
        cantidad: i === 0 ? 1 : 2,
        precio: precioDe(producto, talla) ?? 0,
      };
    });

    return {
      numero: `NR1-${(1042 + indice * 7).toString()}`,
      comprador: comprador.nombre,
      ciudad: comprador.ciudad,
      dia: DIAS[indice],
      estado: ESTADOS[indice],
      lineas,
      total: lineas.reduce((suma, l) => suma + l.precio * l.cantidad, 0),
    };
  });
}

export type SesionDemo = {
  dia: string;
  hora: string;
  tipo: "Individual" | "Grupo";
  quien: string;
  cupos?: { tomados: number; total: number };
};

/**
 * Agenda de entrenamientos. Existe solo si el cliente vende el servicio: sin
 * `persona.servicio` el panel no dibuja la pestaña, igual que la home no dibuja
 * la sección de la persona cuando no hay `persona`.
 */
export function agendaDemo(demo: Demo): SesionDemo[] {
  if (!demo.persona?.servicio) return [];
  return [
    { dia: "Hoy", hora: "4:00 p. m.", tipo: "Individual", quien: "Santiago Rueda" },
    {
      dia: "Hoy",
      hora: "6:00 p. m.",
      tipo: "Grupo",
      quien: "Arqueros sub-15",
      cupos: { tomados: 6, total: 8 },
    },
    { dia: "Mañana", hora: "7:00 a. m.", tipo: "Individual", quien: "Kevin Mosquera" },
    {
      dia: "Sábado",
      hora: "9:00 a. m.",
      tipo: "Grupo",
      quien: "Escuela de porteros",
      cupos: { tomados: 8, total: 8 },
    },
  ];
}
