import Image from "next/image";
import type { Demo } from "@/lib/content";

/**
 * Footer del cliente. Usa el lockup completo (`logo`, marca + tagline) a 56px,
 * que es donde hay espacio para que "EL INOXIDABLE" se lea; el nav usa la
 * variante reducida.
 */
export function StoreFooter({ demo }: { demo: Demo }) {
  const whatsapp = `https://wa.me/${demo.negocio.whatsapp}`;

  return (
    <footer className="mt-auto border-t border-[var(--borde)] bg-[var(--superficie)]">
      <div className="mx-auto flex max-w-[1240px] flex-col gap-6 px-4 py-9 md:flex-row md:items-end md:justify-between md:px-6">
        <div>
          <Image
            src={demo.negocio.logo.src}
            alt={demo.negocio.logo.alt}
            width={demo.negocio.logo.width}
            height={demo.negocio.logo.height}
            className="h-14 w-auto"
          />
          <p className="mt-3 font-(family-name:--font-mono-demo) text-[12px] text-[var(--atenuado-suave)]">
            {demo.negocio.ciudad}
          </p>
        </div>

        <div className="flex flex-col gap-1.5 md:items-end">
          <a
            href={whatsapp}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[15px] font-semibold text-[var(--texto)] underline decoration-[var(--borde-fuerte)] underline-offset-4 transition-colors hover:decoration-[var(--acento)]"
          >
            Escríbenos por WhatsApp
          </a>
          <p className="font-(family-name:--font-mono-demo) text-[12px] text-[var(--atenuado-suave)]">
            Pedidos y asesoría de lunes a sábado
          </p>
        </div>
      </div>
    </footer>
  );
}
