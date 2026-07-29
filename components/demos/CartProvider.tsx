"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import type { Demo } from "@/lib/content";
import {
  cartStorageKey,
  cartTotal,
  cartUnits,
  resolveCart,
  sameCartItem,
  type CartItem,
  type ResolvedLine,
} from "@/lib/demos/cart";

type CartContexto = {
  items: CartItem[];
  lineas: ResolvedLine[];
  /** COP. */
  total: number;
  /** Suma de unidades, no de líneas: es lo que muestra el globo del nav. */
  unidades: number;
  abierto: boolean;
  add: (slug: string, variante: string | undefined, cantidad: number) => void;
  setCantidad: (slug: string, variante: string | undefined, cantidad: number) => void;
  remove: (slug: string, variante?: string) => void;
  abrir: () => void;
  cerrar: () => void;
};

const Contexto = createContext<CartContexto | null>(null);

export function useCart(): CartContexto {
  const ctx = useContext(Contexto);
  if (!ctx) throw new Error("useCart debe usarse dentro de <CartProvider>");
  return ctx;
}

export function CartProvider({
  demo,
  children,
}: {
  demo: Demo;
  children: React.ReactNode;
}) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [abierto, setAbierto] = useState(false);
  const clave = cartStorageKey(demo.slug);

  /**
   * El `localStorage` se lee en un efecto y NUNCA en el primer render: leerlo
   * durante el render rompería la hidratación del HTML prerenderizado, porque el
   * servidor no tiene storage. El primer paint muestra el carrito vacío y el
   * contenido aparece un tick después.
   */
  useEffect(() => {
    try {
      const bruto = window.localStorage.getItem(clave);
      if (!bruto) return;
      const guardado: unknown = JSON.parse(bruto);
      if (Array.isArray(guardado)) setItems(guardado as CartItem[]);
    } catch {
      // Storage corrupto o deshabilitado (modo privado, cuota llena): la tienda
      // tiene que seguir funcionando con el carrito vacío, no romperse.
    }
  }, [clave]);

  // Persiste en cada cambio. `items` arranca vacío, así que el primer disparo
  // escribe "[]" — inofensivo y evita tener que distinguir el montaje.
  useEffect(() => {
    try {
      window.localStorage.setItem(clave, JSON.stringify(items));
    } catch {
      // Sin storage el carrito funciona igual, solo no sobrevive al refresco.
    }
  }, [clave, items]);

  const add = useCallback(
    (slug: string, variante: string | undefined, cantidad: number) => {
      setItems((previos) => {
        const existente = previos.findIndex((item) => sameCartItem(item, slug, variante));
        if (existente === -1) return [...previos, { slug, variante, cantidad }];
        // Acumula en la línea que ya existe en vez de duplicarla.
        return previos.map((item, i) =>
          i === existente ? { ...item, cantidad: item.cantidad + cantidad } : item,
        );
      });
    },
    [],
  );

  const setCantidad = useCallback(
    (slug: string, variante: string | undefined, cantidad: number) => {
      setItems((previos) =>
        cantidad <= 0
          ? // Llegar a cero quita el ítem: es el comportamiento que espera
            // cualquiera que baje la cantidad hasta el fondo.
            previos.filter((item) => !sameCartItem(item, slug, variante))
          : previos.map((item) =>
              sameCartItem(item, slug, variante) ? { ...item, cantidad } : item,
            ),
      );
    },
    [],
  );

  const remove = useCallback((slug: string, variante?: string) => {
    setItems((previos) => previos.filter((item) => !sameCartItem(item, slug, variante)));
  }, []);

  const abrir = useCallback(() => setAbierto(true), []);
  const cerrar = useCallback(() => setAbierto(false), []);

  const valor = useMemo<CartContexto>(() => {
    // Resuelve contra el catálogo actual y descarta lo que ya no existe o no
    // tiene precio. Ver resolveCart.
    const lineas = resolveCart(items, demo.productos);
    return {
      items,
      lineas,
      total: cartTotal(lineas),
      unidades: cartUnits(lineas),
      abierto,
      add,
      setCantidad,
      remove,
      abrir,
      cerrar,
    };
  }, [items, demo.productos, abierto, add, setCantidad, remove, abrir, cerrar]);

  return <Contexto.Provider value={valor}>{children}</Contexto.Provider>;
}
