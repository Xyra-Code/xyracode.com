import { CreditCard, Headset, ShieldCheck, Truck } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { Demo } from "@/lib/content/demos";

/**
 * `demo.confianza` es un `string[]`: no trae iconos, y agregárselos obligaría a
 * escribir un nombre de icono a mano por cada cliente nuevo, cuando la promesa
 * del sistema es que una demo son cuatro hex y un objeto más.
 *
 * Así que el icono se infiere del texto. Elegir por posición sería más corto
 * pero se equivoca en silencio en cuanto un cliente ordene distinto sus tres
 * promesas; con palabras clave, un texto que no matchea cae en `ShieldCheck`,
 * que es genérico y nunca miente sobre lo que promete la celda.
 */
const ICONOS: { patron: RegExp; icono: LucideIcon }[] = [
  { patron: /env[íi]o|domicilio|entrega/i, icono: Truck },
  { patron: /pago|contraentrega|contra entrega|efectivo|transferencia/i, icono: CreditCard },
  { patron: /whatsapp|atenci[óo]n|asesor/i, icono: Headset },
];

function iconoDe(texto: string): LucideIcon {
  return ICONOS.find(({ patron }) => patron.test(texto))?.icono ?? ShieldCheck;
}

/**
 * Tira de confianza: tres celdas con separadores verticales en desktop y filas
 * apiladas en móvil (handoff, "Componentes compartidos"). Va a sangre, pegada
 * arriba del footer, para que se lea como un cierre de página y no como otra
 * sección más.
 */
export function TrustStrip({ demo }: { demo: Demo }) {
  return (
    <section className="border-t border-[var(--borde)]">
      <ul className="mx-auto max-w-[1240px] md:grid md:grid-cols-3">
        {demo.confianza.map((texto, indice) => {
          const Icono = iconoDe(texto);

          return (
            <li
              key={texto}
              /*
                El separador lo pone cada celda menos la primera: horizontal en
                móvil, vertical en desktop. Así no hay bordes dobles ni una línea
                colgando al final de la lista, y la tira sigue funcionando si
                alguna vez son dos entradas en lugar de tres.
              */
              className={`flex items-center gap-3 px-4 py-4 md:px-6 md:py-5 ${
                indice > 0
                  ? "border-t border-[var(--borde)] md:border-t-0 md:border-l md:border-l-[var(--borde)]"
                  : ""
              }`}
            >
              <Icono
                aria-hidden="true"
                size={20}
                strokeWidth={1.75}
                className="shrink-0 text-[var(--acento)]"
              />
              <span className="text-[14px] font-medium text-[var(--texto)] md:text-[15px]">
                {texto}
              </span>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
