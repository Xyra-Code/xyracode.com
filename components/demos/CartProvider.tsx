"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  useSyncExternalStore,
} from "react";
import type { Demo } from "@/lib/content/demos";
import {
  cartStorageKey,
  cartTotal,
  cartUnits,
  resolveCart,
  sameCartItem,
  type CartItem,
  type ResolvedLine,
} from "@/lib/demos/cart";
import { getCartStore } from "@/lib/demos/cart-store";

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
  /** Deja el carrito en cero, storage incluido. */
  vaciar: () => void;
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
  // `abierto` sí es estado de interfaz y vive acá.
  const [abierto, setAbierto] = useState(false);

  /**
   * El carrito NO es estado de React: es estado externo (`localStorage`), y se
   * consume con `useSyncExternalStore`, que es la herramienta que React expone
   * para eso. El intento anterior —leer el storage en un `useEffect` y llamar a
   * `setItems`— viola `react-hooks/set-state-in-effect` y provoca un render extra.
   *
   * `getServerSnapshot` devuelve siempre el mismo array vacío, así que el HTML
   * prerenderizado sale con el carrito vacío y React repinta después de hidratar,
   * sin desajuste. Ver lib/demos/cart-store.ts.
   */
  const store = getCartStore(cartStorageKey(demo.slug));
  const items = useSyncExternalStore(
    store.subscribe,
    store.getSnapshot,
    store.getServerSnapshot,
  );
  const setItems = store.set;

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
    [setItems],
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
    [setItems],
  );

  const remove = useCallback((slug: string, variante?: string) => {
    setItems((previos) => previos.filter((item) => !sameCartItem(item, slug, variante)));
  }, [setItems]);

  // Devuelve un array nuevo y no la constante VACIO del store: el `set` lo
  // serializa igual y así no se comparte la referencia del snapshot del servidor.
  const vaciar = useCallback(() => setItems(() => []), [setItems]);

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
      vaciar,
      abrir,
      cerrar,
    };
  }, [items, demo.productos, abierto, add, setCantidad, remove, vaciar, abrir, cerrar]);

  return <Contexto.Provider value={valor}>{children}</Contexto.Provider>;
}
