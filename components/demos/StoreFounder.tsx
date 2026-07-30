import Image from "next/image";
import type { Demo } from "@/lib/content/demos";
import { buildServiceInquiryHref } from "@/lib/demos/order";
import { WhatsAppMark } from "./WhatsAppMark";

/**
 * La persona detrás de la marca.
 *
 * **Por qué esta sección existe:** el producto de un cliente así se puede igualar
 * —cualquiera importa guantes— pero su carrera no. En una tienda de marca personal,
 * esto no es "sobre nosotros": es el argumento de compra. Sin él la tienda se lee
 * como la de cualquier distribuidor.
 *
 * Va **después de los destacados y antes de las categorías**, no al principio: el
 * visitante llega buscando guantes, ve guantes, y recién entonces recibe la razón
 * para comprarle a él y no a Adidas. Arrancar con la biografía convertiría la home
 * en una página institucional.
 *
 * El retrato es 4:5 y va a la izquierda, alternando con el hero —que tiene su
 * imagen a la derecha— para que la home no caiga en una columna repetida.
 *
 * **La columna de la foto crece en dos pasos (300px → 380px) y no de una.** Con
 * los 380px fijos desde 768px, la foto salía más ancha que el relato: medido a
 * 768px daba foto 380 / texto 292, o sea un retrato de 380×475 al lado de una
 * biografía de 38 caracteres por línea. La foto le ganaba al argumento que está
 * ahí para sostener. A 300px el reparto a 768 queda 300/372 y el texto vuelve a
 * mandar; los 380px del diseño entran a 1024, donde sobra ancho para los dos.
 */
export function StoreFounder({ demo }: { demo: Demo }) {
  const persona = demo.persona;
  if (!persona) return null;

  const servicio = persona.servicio;
  // El footer enlaza al mismo servicio; el mensaje lo arma la misma función para
  // que no se digan dos cosas distintas según por dónde le escribieron.
  const consulta = servicio
    ? buildServiceInquiryHref(demo.negocio.whatsapp, persona.nombre, servicio.titulo)
    : null;

  return (
    <section
      aria-labelledby="quien-esta-detras"
      className="border-y border-[var(--borde)] bg-[var(--superficie)]"
    >
      <div className="mx-auto grid max-w-[1240px] gap-7 px-4 py-10 md:grid-cols-[minmax(0,300px)_1fr] md:items-center md:gap-10 md:px-6 md:py-14 lg:grid-cols-[minmax(0,380px)_1fr] lg:gap-12">
        <div className="overflow-hidden rounded-[4px] border border-[var(--borde)] bg-[var(--superficie-foto)]">
          <Image
            src={persona.foto.src}
            alt={persona.foto.alt}
            width={persona.foto.width}
            height={persona.foto.height}
            // Ancho completo en móvil, la columna de 300px entre 768 y 1023, y
            // la de 380px desde ahí.
            sizes="(max-width: 767px) 100vw, (max-width: 1023px) 300px, 380px"
            className="aspect-4/5 w-full object-cover"
          />
        </div>

        <div>
          <p className="font-(family-name:--font-mono-demo) text-[11px] tracking-[0.16em] text-[var(--acento)] uppercase md:text-[12px]">
            {persona.rol}
          </p>

          <h2
            id="quien-esta-detras"
            className="mt-3 font-(family-name:--font-archivo) text-[30px] leading-[1] font-bold tracking-[-0.03em] text-[var(--texto)] uppercase md:text-[42px]"
          >
            {persona.nombre}
          </h2>

          <p className="mt-4 max-w-[52ch] text-[16px] leading-[1.6] text-[var(--cuerpo)] md:text-[17px]">
            {persona.relato}
          </p>

          {/*
            Los clubes van como lista y no como párrafo separado por puntos: es
            una enumeración, y un lector de pantalla debe anunciar cuántos son.
          */}
          {persona.credenciales.length > 0 && (
            <ul
              aria-label={`Clubes de ${persona.nombre}`}
              className="mt-6 flex flex-wrap gap-2"
            >
              {persona.credenciales.map((club) => (
                <li
                  key={club}
                  className="rounded-[4px] border border-[var(--borde)] px-2.5 py-1.5 font-(family-name:--font-mono-demo) text-[11px] tracking-[0.08em] text-[var(--atenuado)] uppercase"
                >
                  {club}
                </li>
              ))}
            </ul>
          )}

          {/*
            Segunda línea de negocio. Hoy es un enlace a WhatsApp porque el flujo
            de agenda todavía no existe; cuando exista, este bloque apunta ahí. Va
            acá y no en una sección propia porque el entrenamiento se vende por la
            misma razón que los guantes: quién lo da.
          */}
          {servicio && consulta && (
            <div className="mt-7 border-t border-[var(--borde)] pt-5">
              <p className="font-(family-name:--font-archivo) text-[15px] font-bold tracking-[0.02em] text-[var(--texto)] uppercase">
                {servicio.titulo}
              </p>
              <p className="mt-1.5 max-w-[46ch] text-[15px] leading-[1.55] text-[var(--atenuado)]">
                {servicio.nota}
              </p>
              <a
                href={consulta}
                target="_blank"
                rel="noopener noreferrer"
                className="group mt-3 inline-flex min-h-11 items-center gap-2 font-(family-name:--font-archivo) text-[13px] font-bold tracking-[0.02em] text-[var(--acento)] uppercase"
              >
                {/* El logo de WhatsApp reemplaza a la vez la palabra y el
                    `MessageCircle` genérico que iba delante: dos íconos de chat
                    en el mismo enlace serían ruido, y el de marca dice a qué app
                    abre. El subrayado va en las palabras y no en el `<a>`:
                    cruzando el logo se leería como un tachado. */}
                <span className="underline decoration-[var(--acento)]/40 underline-offset-4 transition-colors group-hover:decoration-[var(--acento)]">
                  Consultar por
                </span>{" "}
                <WhatsAppMark size={16} />
              </a>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
