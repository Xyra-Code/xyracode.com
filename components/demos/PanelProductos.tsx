"use client";

import { ImagePlus, Pencil, Plus, Trash2, X } from "lucide-react";
import { type FormEvent, useState } from "react";
import type { Demo } from "@/lib/content/demos";
import { formatCOP } from "@/lib/demos/format";
import { precioDeTarjeta, type RangoPrecio } from "@/lib/demos/price";
import { storeButtonClasses } from "./StoreButton";

/**
 * Los productos del catálogo, con agregar, editar y eliminar.
 *
 * **La lista arranca del catálogo y vive en `useState`.** Sin eso, "eliminar" solo
 * podría borrar lo recién agregado y el prospecto descubriría el truco en el primer
 * clic. No persiste entre recargas, y para una demo eso alcanza: empezar de cero en
 * cada visita es incluso preferible.
 *
 * **El precio por talla es el modelo real, no una simplificación.** Un guante no
 * tiene un precio: tiene uno por talla, porque más talla es más látex. El
 * formulario pide el precio de la talla más chica y cuánto sube por talla —los
 * mismos dos números que usa `tallasGuante()` en los datos— y muestra el rango que
 * resulta, que es lo que la tarjeta del catálogo va a mostrar.
 */

/** Las tallas de guante del catálogo. Solo se usan para calcular el rango. */
const TALLAS = ["6", "7", "8", "9", "10", "11"];

type Fila = {
  id: string;
  nombre: string;
  categoria: string;
  /** Texto ya formateado: una cifra, un rango o "A consultar". */
  precio: string;
  /** `objectURL` de la foto elegida, si la hay. */
  foto?: string;
  /** Lo que el dueño acaba de hacer con la fila. Resalta el resultado del clic. */
  marca?: "nuevo" | "editado";
};

type Modo = "unico" | "por-talla";

/** Precio de la tarjeta como texto: puede ser una cifra, un rango o nada. */
function textoPrecio(valor: number | RangoPrecio | null): string {
  if (valor === null) return "A consultar";
  if (typeof valor === "number") return formatCOP(valor);
  return valor.min === valor.max
    ? formatCOP(valor.min)
    : `${formatCOP(valor.min)} – ${formatCOP(valor.max)}`;
}

export function PanelProductos({ demo }: { demo: Demo }) {
  const [filas, setFilas] = useState<Fila[]>(() =>
    demo.productos.map((producto) => ({
      id: producto.slug,
      nombre: producto.nombre,
      categoria: producto.categoria,
      precio: textoPrecio(precioDeTarjeta(producto)),
    })),
  );

  /** Contador propio: `filas.length` repetiría un id tras agregar, borrar y agregar. */
  const [creados, setCreados] = useState(0);
  const [editando, setEditando] = useState<string | null>(null);
  const [nombre, setNombre] = useState("");
  const [categoria, setCategoria] = useState(demo.categorias[0]?.slug ?? "");
  const [modo, setModo] = useState<Modo>("por-talla");
  const [base, setBase] = useState("");
  const [paso, setPaso] = useState("5000");
  const [foto, setFoto] = useState<string | undefined>(undefined);

  const valorBase = Number(base);
  const valorPaso = Number(paso);
  const baseValida = Number.isFinite(valorBase) && valorBase > 0;

  /** El rango que va a mostrar la tarjeta, con los números del formulario. */
  const previoPrecio: string = !baseValida
    ? "—"
    : modo === "unico"
      ? formatCOP(valorBase)
      : textoPrecio({
          min: valorBase,
          max: valorBase + (TALLAS.length - 1) * (Number.isFinite(valorPaso) ? valorPaso : 0),
        });

  /**
   * Libera un `objectURL`, salvo que alguna fila lo siga mostrando. Sin esa
   * salvedad, cambiar la foto mientras se edita un producto rompía la miniatura
   * de la lista: era la misma URL.
   */
  function soltar(url: string | undefined) {
    if (url && !filas.some((f) => f.foto === url)) URL.revokeObjectURL(url);
  }

  function limpiar() {
    soltar(foto);
    setEditando(null);
    setNombre("");
    setBase("");
    setPaso("5000");
    setModo("por-talla");
    setFoto(undefined);
  }

  function elegirFoto(archivo: File | undefined) {
    soltar(foto);
    setFoto(archivo ? URL.createObjectURL(archivo) : undefined);
  }

  function guardar(evento: FormEvent) {
    evento.preventDefault();
    if (!nombre.trim()) return;

    const anterior = filas.find((f) => f.id === editando);
    // Editando y sin tocar el precio, conserva el que tenía: obligar a
    // reescribirlo para corregir una palabra del nombre sería absurdo.
    if (!anterior && !baseValida) return;

    const fila: Fila = {
      id: editando ?? `nuevo-${creados + 1}`,
      nombre: nombre.trim(),
      categoria,
      precio: baseValida ? previoPrecio : (anterior?.precio ?? "A consultar"),
      foto,
      marca: editando ? "editado" : "nuevo",
    };

    setFilas((previas) =>
      editando ? previas.map((f) => (f.id === editando ? fila : f)) : [fila, ...previas],
    );
    if (!editando) setCreados((n) => n + 1);
    // La foto pasa a la fila, así que no se suelta acá: la sigue mostrando la lista.
    setEditando(null);
    setNombre("");
    setBase("");
    setFoto(undefined);
  }

  function editar(fila: Fila) {
    soltar(foto);
    setEditando(fila.id);
    setNombre(fila.nombre);
    setCategoria(fila.categoria);
    setFoto(fila.foto);
    setBase("");
    // Sube al formulario, que en móvil queda fuera de pantalla. `?.` en el método
    // y no solo en el nodo: jsdom no implementa `scrollIntoView`, y sin el guard
    // editar reventaría en los tests por algo que no es del componente.
    document.getElementById("form-producto")?.scrollIntoView?.({ block: "center" });
  }

  function eliminar(id: string) {
    const fila = filas.find((f) => f.id === id);
    setFilas((previas) => previas.filter((f) => f.id !== id));
    if (fila?.foto && fila.foto !== foto) URL.revokeObjectURL(fila.foto);
    if (editando === id) limpiar();
  }

  const nombreCategoria = (slug: string) =>
    demo.categorias.find((c) => c.slug === slug)?.nombre ?? slug;

  const etiqueta =
    "font-(family-name:--font-mono-demo) text-[11px] tracking-[0.1em] text-[var(--atenuado)] uppercase";
  const campo =
    "min-h-12 w-full rounded-[4px] border border-[var(--borde)] bg-[var(--fondo)] px-3 text-[15px] text-[var(--texto)] placeholder:text-[var(--atenuado-suave)]";
  const iconoBoton =
    "flex size-11 shrink-0 items-center justify-center rounded-[4px] border border-[var(--borde)] text-[var(--atenuado)] transition-colors hover:border-[var(--borde-fuerte)] hover:text-[var(--texto)]";

  return (
    <section aria-labelledby="panel-productos">
      <h2
        id="panel-productos"
        className="font-(family-name:--font-archivo) text-[20px] font-bold tracking-[-0.02em] uppercase md:text-[24px]"
      >
        Productos
      </h2>

      {/* ---------- Agregar o editar ---------- */}
      <form
        id="form-producto"
        onSubmit={guardar}
        className={`mt-5 rounded-[4px] border bg-[var(--superficie)] p-4 md:p-5 ${
          editando ? "border-[var(--acento)]" : "border-[var(--borde)]"
        }`}
      >
        <div className="flex items-center justify-between gap-3">
          <p className="min-w-0 truncate font-(family-name:--font-archivo) text-[14px] font-bold tracking-[0.02em] uppercase">
            {editando ? "Editar producto" : "Agregar producto"}
          </p>
          {editando && (
            <button type="button" onClick={limpiar} aria-label="Cancelar la edición" className={iconoBoton}>
              <X aria-hidden="true" size={16} strokeWidth={1.75} />
            </button>
          )}
        </div>

        {/* Una columna en móvil; dos desde 640px. */}
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

          {/* ---------- Foto ----------
              Vista previa real con objectURL: no sube nada a ningún lado, pero se
              ve la foto que el cliente eligió, que es lo que hace creíble el paso. */}
          <div className="flex flex-col gap-1.5">
            <span className={etiqueta}>Foto</span>
            <div className="flex items-center gap-3">
              <div className="flex size-16 shrink-0 items-center justify-center overflow-hidden rounded-[4px] border border-[var(--borde)] bg-[var(--superficie-foto)]">
                {foto ? (
                  // `<img>` y no next/image: el src es un blob: local, que el
                  // optimizador de Next no puede procesar.
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={foto} alt="" className="h-full w-full object-cover" />
                ) : (
                  <ImagePlus
                    aria-hidden="true"
                    size={20}
                    strokeWidth={1.5}
                    className="text-[var(--atenuado-suave)]"
                  />
                )}
              </div>
              <label className="min-w-0 flex-1">
                <span className="sr-only">Elegir foto del producto</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => elegirFoto(e.target.files?.[0])}
                  className="block w-full text-[13px] text-[var(--atenuado)] file:mr-3 file:min-h-11 file:rounded-[4px] file:border file:border-[var(--borde-fuerte)] file:bg-transparent file:px-3 file:font-(family-name:--font-archivo) file:text-[12px] file:font-bold file:tracking-[0.02em] file:text-[var(--texto)] file:uppercase"
                />
              </label>
            </div>
          </div>

          {/* ---------- Precio ---------- */}
          <fieldset className="sm:col-span-2">
            <legend className={etiqueta}>Precio</legend>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {(["por-talla", "unico"] as Modo[]).map((opcion) => (
                <button
                  key={opcion}
                  type="button"
                  aria-pressed={modo === opcion}
                  onClick={() => setModo(opcion)}
                  className={`min-h-11 rounded-[4px] border px-3 font-(family-name:--font-archivo) text-[11px] font-bold tracking-[0.04em] uppercase transition-colors ${
                    modo === opcion
                      ? "border-[var(--acento)] bg-[var(--acento-suave)] text-[var(--texto)]"
                      : "border-[var(--borde)] text-[var(--atenuado)] hover:text-[var(--texto)]"
                  }`}
                >
                  {opcion === "por-talla" ? "Por talla" : "Un solo precio"}
                </button>
              ))}
            </div>

            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              <label className="flex flex-col gap-1.5">
                <span className={etiqueta}>
                  {modo === "por-talla" ? "Precio de la talla 6" : "Precio"}
                </span>
                <input
                  value={base}
                  onChange={(e) => setBase(e.target.value)}
                  inputMode="numeric"
                  placeholder={editando ? "Dejar vacío para no cambiarlo" : "99900"}
                  required={!editando}
                  className={campo}
                />
              </label>

              {modo === "por-talla" && (
                <label className="flex flex-col gap-1.5">
                  <span className={etiqueta}>Sube por talla</span>
                  <input
                    value={paso}
                    onChange={(e) => setPaso(e.target.value)}
                    inputMode="numeric"
                    placeholder="5000"
                    className={campo}
                  />
                </label>
              )}
            </div>

            <p aria-live="polite" className="mt-3 text-[13px] text-[var(--atenuado)]">
              {modo === "por-talla"
                ? `Tallas ${TALLAS[0]} a ${TALLAS[TALLAS.length - 1]} · en la tarjeta se ve `
                : "En la tarjeta se ve "}
              <span className="font-(family-name:--font-archivo) font-bold text-[var(--texto)]">
                {previoPrecio}
              </span>
            </p>
          </fieldset>
        </div>

        <div className="mt-4 flex justify-end">
          <button type="submit" className={storeButtonClasses("primario")}>
            {editando ? (
              <>
                <Pencil aria-hidden="true" size={15} strokeWidth={2} />
                Guardar cambios
              </>
            ) : (
              <>
                <Plus aria-hidden="true" size={16} strokeWidth={2} />
                Publicar
              </>
            )}
          </button>
        </div>
      </form>

      {/* ---------- Catálogo ---------- */}
      {/* `aria-live` en el contador y no en la lista: anunciar la lista completa
          cada vez que se borra una fila es ruido; el número es la señal. */}
      <h3
        aria-live="polite"
        className="mt-8 font-(family-name:--font-mono-demo) text-[11px] tracking-[0.14em] text-[var(--atenuado)] uppercase"
      >
        En el catálogo · {filas.length}
      </h3>

      <ul className="mt-3 flex flex-col gap-2">
        {filas.map((fila) => (
          <li
            key={fila.id}
            className={`flex items-center gap-3 rounded-[4px] border bg-[var(--superficie)] p-3 ${
              fila.marca ? "border-[var(--acento)]" : "border-[var(--borde)]"
            }`}
          >
            <div className="flex size-11 shrink-0 items-center justify-center overflow-hidden rounded-[4px] bg-[var(--superficie-foto)]">
              {fila.foto ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={fila.foto} alt="" className="h-full w-full object-cover" />
              ) : (
                <ImagePlus
                  aria-hidden="true"
                  size={16}
                  strokeWidth={1.5}
                  className="text-[var(--atenuado-suave)]"
                />
              )}
            </div>

            {/* `min-w-0` + `truncate`: hay nombres de 60 caracteres en el catálogo
                real y sin esto rompen la fila a 320px. */}
            <div className="min-w-0 flex-1">
              <p className="truncate text-[14px] text-[var(--texto)]">{fila.nombre}</p>
              {/* El precio va en esta segunda línea y no en una columna aparte a la
                  derecha: una columna así hay que esconderla en móvil, y el precio
                  es justo el dato que se viene a revisar. Con `flex-wrap` cae a otro
                  renglón en las pantallas angostas en vez de desbordar. */}
              <p className="mt-0.5 flex flex-wrap items-baseline gap-x-2">
                <span
                  className={`min-w-0 truncate font-(family-name:--font-mono-demo) text-[10px] uppercase ${
                    fila.marca ? "text-[var(--acento)]" : "text-[var(--atenuado-suave)]"
                  }`}
                >
                  {fila.marca === "nuevo"
                    ? "Recién publicado"
                    : fila.marca === "editado"
                      ? "Actualizado"
                      : nombreCategoria(fila.categoria)}
                </span>
                <span className="font-(family-name:--font-archivo) text-[12px] font-bold whitespace-nowrap text-[var(--atenuado)]">
                  {fila.precio}
                </span>
              </p>
            </div>

            <div className="flex shrink-0 gap-1.5">
              <button
                type="button"
                onClick={() => editar(fila)}
                aria-label={`Editar ${fila.nombre}`}
                className={iconoBoton}
              >
                <Pencil aria-hidden="true" size={15} strokeWidth={1.75} />
              </button>
              <button
                type="button"
                onClick={() => eliminar(fila.id)}
                aria-label={`Eliminar ${fila.nombre}`}
                className={iconoBoton}
              >
                <Trash2 aria-hidden="true" size={15} strokeWidth={1.75} />
              </button>
            </div>
          </li>
        ))}
      </ul>

      {filas.length === 0 && (
        <p className="mt-4 text-[14px] text-[var(--atenuado)]">
          El catálogo quedó vacío. Publica un producto con el formulario de arriba.
        </p>
      )}
    </section>
  );
}
