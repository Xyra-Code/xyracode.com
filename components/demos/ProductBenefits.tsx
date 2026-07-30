import { Award, Hand, Shield, Wind } from "lucide-react";
import type { Demo } from "@/lib/content/demos";

/**
 * Los cuatro atributos que el cliente pone en **todas** sus piezas de producto.
 * Van en el detalle, que es donde alguien decide comprar, y son sus palabras: si
 * él eligió esos cuatro argumentos, la tienda no debería inventar otros.
 *
 * El ícono se elige por palabra clave y no por posición del array, igual que en
 * `TrustStrip`: elegir por índice se equivocaría en silencio en cuanto un cliente
 * ordene distinto sus beneficios o tenga tres en vez de cuatro.
 */
const ICONOS = [
  { claves: /agarre|adherencia|grip/i, icon: Hand },
  { claves: /protecci|refuerzo|seguridad/i, icon: Shield },
  { claves: /transpirab|c[óo]modo|ventila/i, icon: Wind },
  { claves: /dise[ñn]o|profesional|calidad/i, icon: Award },
] as const;

function iconoDe(beneficio: string) {
  return ICONOS.find(({ claves }) => claves.test(beneficio))?.icon ?? Award;
}

export function ProductBenefits({ demo }: { demo: Demo }) {
  const beneficios = demo.negocio.beneficios ?? [];
  if (beneficios.length === 0) return null;

  return (
    <ul
      aria-label="Características"
      className="mt-7 grid gap-x-5 gap-y-3 border-t border-[var(--borde)] pt-6 sm:grid-cols-2"
    >
      {beneficios.map((beneficio) => {
        const Icono = iconoDe(beneficio);
        return (
          <li key={beneficio} className="flex items-center gap-2.5">
            <Icono
              aria-hidden="true"
              size={17}
              strokeWidth={1.75}
              className="shrink-0 text-[var(--acento)]"
            />
            <span className="text-[14px] text-[var(--cuerpo)] md:text-[15px]">{beneficio}</span>
          </li>
        );
      })}
    </ul>
  );
}
