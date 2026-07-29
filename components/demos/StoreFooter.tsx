import Image from "next/image";
import {
  FacebookIcon,
  InstagramIcon,
  TikTokIcon,
  XIcon,
  type BrandIcon,
} from "@/components/ui/BrandIcons";
import type { Demo, DemoRed } from "@/lib/content";
import { WhatsAppMark } from "./WhatsAppMark";

/**
 * Ícono y nombre accesible por red. El mapa vive acá y no en los datos de la demo
 * porque el objeto Demo cruza a componentes cliente y un componente no viaja por
 * esa frontera; los datos solo guardan `red` + `href`.
 */
const REDES: Record<DemoRed["red"], { nombre: string; icon: BrandIcon }> = {
  instagram: { nombre: "Instagram", icon: InstagramIcon },
  facebook: { nombre: "Facebook", icon: FacebookIcon },
  tiktok: { nombre: "TikTok", icon: TikTokIcon },
  x: { nombre: "X", icon: XIcon },
};

/**
 * Footer del cliente. Usa el lockup completo (`logo`, marca + tagline) a 56px,
 * que es donde hay espacio para que "EL INOXIDABLE" se lea; el nav usa la
 * variante reducida.
 */
export function StoreFooter({ demo }: { demo: Demo }) {
  const whatsapp = `https://wa.me/${demo.negocio.whatsapp}`;
  const redes = demo.negocio.redes ?? [];

  return (
    <footer className="mt-auto border-t border-[var(--borde)] bg-[var(--superficie)]">
      <div className="mx-auto flex max-w-[1240px] flex-col gap-6 px-4 py-9 md:flex-row md:items-end md:justify-between md:px-6">
        {/*
          `items-center` sobre un `w-fit`: logo y redes comparten eje vertical sin
          que el bloque deje de estar pegado a la izquierda del footer. Es la
          única forma de que el centrado aguante solo — la fila de redes crece
          40px por cada red que se agregue y ya es más ancha que el logo, así que
          cualquier margen fijo se desalinearía a la siguiente red.
        */}
        <div className="flex w-fit flex-col items-center">
          <Image
            src={demo.negocio.logo.src}
            alt={demo.negocio.logo.alt}
            width={demo.negocio.logo.width}
            height={demo.negocio.logo.height}
            className="h-14 w-auto"
          />
          {/*
            El -mx-2.5 saca el padding del área táctil (40px con un ícono de 18)
            de los dos lados: simétrico, para no correr el eje. Así el primer
            ícono arranca en el margen del footer en vez de 11px adentro. Por lo
            mismo el mt es chico: el área táctil ya aporta 11px de aire arriba.
          */}
          {redes.length > 0 && (
            <ul className="mt-0.5 -mx-2.5 flex items-center">
              {redes.map(({ red, href }) => {
                const { nombre, icon: Icon } = REDES[red];
                return (
                  <li key={red}>
                    <a
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`${demo.negocio.nombre} en ${nombre}`}
                      className="inline-flex size-10 items-center justify-center rounded-[4px] text-[var(--atenuado-suave)] transition-colors hover:text-[var(--acento)]"
                    >
                      <Icon size={18} />
                    </a>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        <div className="flex flex-col gap-1.5 md:items-end">
          <a
            href={whatsapp}
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center gap-1.5 text-[15px] font-semibold text-[var(--texto)]"
          >
            {/* El subrayado va en las palabras y no en el `<a>`: cruzando el logo
                se leería como un tachado. El hover sigue siendo del enlace
                completo, de ahí el `group`. */}
            <span className="underline decoration-[var(--borde-fuerte)] underline-offset-4 transition-colors group-hover:decoration-[var(--acento)]">
              Escríbenos por
            </span>{" "}
            <WhatsAppMark size={17} />
          </a>
          <p className="font-(family-name:--font-mono-demo) text-[12px] text-[var(--atenuado-suave)]">
            Pedidos y asesoría de lunes a sábado
          </p>
        </div>
      </div>
    </footer>
  );
}
