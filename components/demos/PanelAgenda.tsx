import { Users, User } from "lucide-react";
import type { SesionDemo } from "@/lib/demos/panel";

/**
 * La agenda de entrenamientos.
 *
 * Es la mitad del negocio que ninguna plataforma de e-commerce le resuelve: un
 * carrito vende objetos, no horarios. Que la agenda y los pedidos vivan en el
 * mismo panel es el argumento que justifica un desarrollo a medida frente a una
 * plantilla.
 */
export function PanelAgenda({ sesiones }: { sesiones: SesionDemo[] }) {
  if (sesiones.length === 0) return null;

  return (
    <section aria-labelledby="panel-agenda">
      <h2
        id="panel-agenda"
        className="font-(family-name:--font-archivo) text-[20px] font-bold tracking-[-0.02em] uppercase md:text-[24px]"
      >
        Agenda
      </h2>

      <ul className="mt-5 flex flex-col gap-3">
        {sesiones.map((sesion) => {
          const Icono = sesion.tipo === "Grupo" ? Users : User;
          const lleno = sesion.cupos && sesion.cupos.tomados >= sesion.cupos.total;
          return (
            <li
              key={`${sesion.dia}-${sesion.hora}-${sesion.quien}`}
              className="flex items-start gap-3 rounded-[4px] border border-[var(--borde)] bg-[var(--superficie)] p-4"
            >
              <Icono
                aria-hidden="true"
                size={18}
                strokeWidth={1.75}
                className="mt-0.5 shrink-0 text-[var(--acento)]"
              />

              {/* `min-w-0` en la columna central: el nombre del grupo puede ser
                  largo y sin esto empuja los cupos fuera de la tarjeta. */}
              <div className="min-w-0 flex-1">
                <p className="truncate text-[15px] font-semibold text-[var(--texto)]">
                  {sesion.quien}
                </p>
                <p className="mt-0.5 font-(family-name:--font-mono-demo) text-[11px] text-[var(--atenuado-suave)]">
                  {sesion.dia} · {sesion.hora} · {sesion.tipo}
                </p>
              </div>

              {sesion.cupos && (
                <p
                  className={`shrink-0 font-(family-name:--font-archivo) text-[12px] font-bold tracking-[0.04em] uppercase ${
                    lleno ? "text-[var(--atenuado-suave)]" : "text-[var(--acento)]"
                  }`}
                >
                  {lleno ? "Completo" : `${sesion.cupos.tomados}/${sesion.cupos.total}`}
                </p>
              )}
            </li>
          );
        })}
      </ul>
    </section>
  );
}
