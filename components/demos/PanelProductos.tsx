"use client";

import { ImagePlus, Plus } from "lucide-react";
import { useState } from "react";
import type { Demo } from "@/lib/content";
import { formatCOP } from "@/lib/demos/format";
import { precioDeTarjeta } from "@/lib/demos/price";
import { storeButtonClasses } from "./StoreButton";

/**
 * Los productos del catálogo, y el formulario para agregar uno.
 *
 * **Lo agregado vive en `useState`, no en `localStorage`.** Lo que esta pantalla
 * tiene que probar es el circuito —lleno el formulario y el producto aparece
 * publicado—, y eso lo da el estado local. Persistirlo entre recargas exigiría un
 * store externo como el del carrito para no violar
 * `react-hooks/set-state-in-effect`, y no compra nada: en una demo, empezar de
 * cero en cada visita es incluso preferible.
 *
 * La vista previa **no** reusa `ProductCard`: esa tarjeta renderiza un
 * `next/image` y un producto recién agregado no tiene foto todavía, así que
 * saldría con la imagen rota. Acá el hueco de la foto se muestra vacío a
 * propósito, que es la verdad de lo que pasaría.
 */

type Agregado = { id: number; nombre: string; precio: number; categoria: string };

/** Precio de la tarjeta como texto: puede ser una cifra, un rango o nada. */
function precioTexto(demo: Demo, indice: number): string {
  const valor = precioDeTarjeta(demo.productos[indice]);
  if (valor === null) return "A consultar";
  if (typeof valor === "number") return formatCOP(valor);
  return valor.min === valor.max
    ? formatCOP(valor.min)
    : `${formatCOP(valor.min)} – ${formatCOP(valor.max)}`;
}

export function PanelProductos({ demo }: { demo: Demo }) {
  const [agregados, setAgregados] = useState<Agregado[]>([]);
  const [nombre, setNombre] = useState("");
  const [precio, setPrecio] = useState("");
  const [categoria, setCategoria] = useState(demo.categorias[0]?.slug ?? "");

  const ultimo = agregados[agregados.length - 1];

  function publicar(evento: React.FormEvent) {
    evento.preventDefault();
    const valor = Number(precio);
    if (!nombre.trim() || !Number.isFinite(valor) || valor <= 0) return;

    setAgregados((previos) => [
      ...previos,
      { id: previos.length + 1, nombre: nombre.trim(), precio: valor, categoria },
    ]);
    setNombre("");
    setPrecio("");
  }

  const etiqueta =
    "font-(family-name:--font-mono-demo) text-[11px] tracking-[0.1em] text-[var(--atenuado)] uppercase";
  const campo =
    "min-h-12 w-full rounded-[4px] border border-[var(--borde)] bg-[var(--fondo)] px-3 text-[15px] text-[var(--texto)] placeholder:text-[var(--atenuado-suave)]";

  return (
    <section aria-labelledby="panel-productos">
      <h2
        id="panel-productos"
        className="font-(family-name:--font-archivo) text-[20px] font-bold tracking-[-0.02em] uppercase md:text-[24px]"
      >
        Productos
      </h2>

      {/* ---------- Agregar ---------- */}
      <form
        onSubmit={publicar}
        className="mt-5 rounded-[4px] border border-[var(--borde)] bg-[var(--superficie)] p-4 md:p-5"
      >
        <p className="font-(family-name:--font-archivo) text-[14px] font-bold tracking-[0.02em] uppercase">
          Agregar producto
        </p>

        {/* Una columna en móvil; dos desde 640px. El nombre ocupa el ancho
            completo también en escritorio porque es el campo más largo. */}
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <label className="flex flex-col gap-1.5 sm:col-span-2">
            <span className={etiqueta}>Nombre</span>
            <input
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              placeholder="Guante corte negativo azul"
              required
              className={campo}
            />
          </label>

          <label className="flex flex-col gap-1.5">
            <span className={etiqueta}>Precio (COP)</span>
            <input
              value={precio}
              onChange={(e) => setPrecio(e.target.value)}
              inputMode="numeric"
              placeholder="149900"
              required
              className={campo}
            />
          </label>

          <label className="flex flex-col gap-1.5">
            <span className={etiqueta}>Categoría</span>
            <select
              value={categoria}
              onChange={(e) => setCategoria(e.target.value)}
              className={campo}
            >
              {demo.categorias.map((c) => (
                <option key={c.slug} value={c.slug}>
                  {c.nombre}
                </option>
              ))}
            </select>
          </label>
        </div>

        <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="flex items-start gap-2 text-[13px] leading-[1.5] text-[var(--atenuado)]">
            <ImagePlus aria-hidden="true" size={15} strokeWidth={1.75} className="mt-0.5 shrink-0" />
            <span className="min-w-0">En tu tienda subes la foto acá mismo.</span>
          </p>
          <button type="submit" className={storeButtonClasses("primario", false, "shrink-0")}>
            <Plus aria-hidden="true" size={16} strokeWidth={2} />
            Publicar
          </button>
        </div>
      </form>

      {/* ---------- Vista previa de lo último agregado ---------- */}
      {ultimo && (
        <div
          // `aria-live`: el producto aparece sin navegar, así que quien usa lector
          // de pantalla no recibiría ninguna señal de que se publicó.
          aria-live="polite"
          className="mt-5 rounded-[4px] border border-[var(--acento)] bg-[var(--superficie)] p-4 md:p-5"
        >
          <p className="font-(family-name:--font-mono-demo) text-[11px] tracking-[0.14em] text-[var(--acento)] uppercase">
            Publicado · así se ve en tu tienda
          </p>

          <div className="mt-4 w-full max-w-[240px]">
            <div className="overflow-hidden rounded-[4px] border border-[var(--borde)]">
              {/* Hueco de la foto, vacío a propósito: el producto recién creado
                  todavía no tiene imagen. */}
              <div className="flex aspect-square items-center justify-center border-b border-[var(--borde)] bg-[var(--superficie-foto)]">
                <ImagePlus
                  aria-hidden="true"
                  size={24}
                  strokeWidth={1.5}
                  className="text-[var(--atenuado-suave)]"
                />
              </div>
              <div className="p-3">
                <p className="font-(family-name:--font-mono-demo) text-[10px] tracking-[0.12em] text-[var(--atenuado-suave)] uppercase">
                  {demo.categorias.find((c) => c.slug === ultimo.categoria)?.nombre ??
                    ultimo.categoria}
                </p>
                <p className="mt-1.5 min-h-[2.7em] text-[14px] leading-[1.35] text-[var(--texto)]">
                  {ultimo.nombre}
                </p>
                <p className="mt-1 font-(family-name:--font-archivo) text-[18px] font-bold tracking-[-0.02em]">
                  {formatCOP(ultimo.precio)}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ---------- Catálogo actual ---------- */}
      <h3 className="mt-8 font-(family-name:--font-mono-demo) text-[11px] tracking-[0.14em] text-[var(--atenuado)] uppercase">
        En el catálogo · {demo.productos.length + agregados.length}
      </h3>

      <ul className="mt-3 flex flex-col gap-2">
        {agregados
          .slice()
          .reverse()
          .map((producto) => (
            <li
              key={producto.id}
              className="flex items-center gap-3 rounded-[4px] border border-[var(--acento)] bg-[var(--superficie)] px-3 py-3"
            >
              <div className="min-w-0 flex-1">
                <p className="truncate text-[14px] text-[var(--texto)]">{producto.nombre}</p>
                <p className="font-(family-name:--font-mono-demo) text-[10px] text-[var(--acento)] uppercase">
                  Recién agregado
                </p>
              </div>
              <span className="shrink-0 font-(family-name:--font-archivo) text-[14px] font-bold whitespace-nowrap">
                {formatCOP(producto.precio)}
              </span>
            </li>
          ))}

        {demo.productos.map((producto, indice) => (
          <li
            key={producto.slug}
            className="flex items-center gap-3 rounded-[4px] border border-[var(--borde)] bg-[var(--superficie)] px-3 py-3"
          >
            {/* `min-w-0` + `truncate`: hay nombres de 60 caracteres en el
                catálogo real y sin esto rompen la fila a 320px. */}
            <div className="min-w-0 flex-1">
              <p className="truncate text-[14px] text-[var(--texto)]">{producto.nombre}</p>
              <p className="font-(family-name:--font-mono-demo) text-[10px] text-[var(--atenuado-suave)] uppercase">
                {demo.categorias.find((c) => c.slug === producto.categoria)?.nombre ??
                  producto.categoria}
              </p>
            </div>
            <span className="shrink-0 font-(family-name:--font-archivo) text-[14px] font-bold whitespace-nowrap text-[var(--atenuado)]">
              {precioTexto(demo, indice)}
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}
