import type { CartItem } from "./cart";

/**
 * Store externo del carrito, para consumir con `useSyncExternalStore`.
 *
 * ¿Por qué no `useState` + `useEffect`? Porque leer `localStorage` en un efecto y
 * llamar a `setState` es exactamente lo que prohíbe la regla
 * `react-hooks/set-state-in-effect`, y con razón: provoca un render extra y deja
 * el estado del servidor y el del cliente desincronizados a mano.
 * `useSyncExternalStore` es la herramienta que React expone para esto, con un
 * `getServerSnapshot` explícito para el prerender.
 *
 * El valor autoritativo vive en memoria y `localStorage` es solo persistencia
 * write-through. Así los snapshots devuelven **la misma referencia** mientras nada
 * cambie, que es lo que `useSyncExternalStore` exige para no entrar en un bucle
 * de renders.
 */

/** Referencia estable: el snapshot del servidor siempre es este mismo array. */
const VACIO: CartItem[] = [];

type Escucha = () => void;

export type CartStore = {
  subscribe: (escucha: Escucha) => () => void;
  getSnapshot: () => CartItem[];
  getServerSnapshot: () => CartItem[];
  set: (actualizar: (previos: CartItem[]) => CartItem[]) => void;
};

/** Un store por clave de storage, o sea uno por demo. */
const stores = new Map<string, CartStore>();

/**
 * Solo para tests. Los stores viven a nivel de módulo, así que su caché en
 * memoria sobrevive entre casos y `localStorage.clear()` no alcanza para aislar
 * uno de otro.
 */
export function resetCartStores() {
  stores.clear();
}

export function getCartStore(clave: string): CartStore {
  const existente = stores.get(clave);
  if (existente) return existente;

  const escuchas = new Set<Escucha>();
  let cache: CartItem[] = VACIO;
  let leido = false;

  /** Lee del storage una sola vez; después el valor en memoria es el bueno. */
  const leer = (): CartItem[] => {
    if (leido) return cache;
    leido = true;
    try {
      const bruto = window.localStorage.getItem(clave);
      const parseado: unknown = bruto ? JSON.parse(bruto) : [];
      if (Array.isArray(parseado)) cache = parseado as CartItem[];
    } catch {
      // Storage corrupto, deshabilitado o sin cuota (modo privado): la tienda
      // sigue funcionando con el carrito vacío en vez de romperse.
    }
    return cache;
  };

  const notificar = () => {
    for (const escucha of escuchas) escucha();
  };

  const store: CartStore = {
    subscribe: (escucha) => {
      escuchas.add(escucha);

      // Sincroniza entre pestañas: es el mismo comprador con dos pestañas de la
      // tienda abiertas, y ver dos carritos distintos se lee como un error.
      const alCambiarStorage = (evento: StorageEvent) => {
        if (evento.key !== clave) return;
        leido = false;
        leer();
        notificar();
      };
      window.addEventListener("storage", alCambiarStorage);

      return () => {
        escuchas.delete(escucha);
        window.removeEventListener("storage", alCambiarStorage);
      };
    },

    getSnapshot: leer,
    getServerSnapshot: () => VACIO,

    set: (actualizar) => {
      cache = actualizar(leer());
      try {
        window.localStorage.setItem(clave, JSON.stringify(cache));
      } catch {
        // Sin persistencia el carrito igual funciona en la sesión; solo no
        // sobrevive al refresco.
      }
      notificar();
    },
  };

  stores.set(clave, store);
  return store;
}
