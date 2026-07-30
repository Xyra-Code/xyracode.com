import Image from "next/image";
import Link from "next/link";
import {
  FacebookIcon,
  InstagramIcon,
  TikTokIcon,
  XIcon,
  type BrandIcon,
} from "@/components/ui/BrandIcons";
import type { Demo, DemoRed } from "@/lib/content/demos";
import { buildServiceInquiryHref, buildStoreInquiryHref } from "@/lib/demos/order";
import { WhatsAppMark } from "./WhatsAppMark";
import { SEO } from "@/lib/seo";

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

/** Encabezado de columna. El mismo patrón mono que "Talla" y "Cantidad". */
const COLUMNA =
  "font-(family-name:--font-mono-demo) text-[10px] tracking-[0.14em] text-[var(--atenuado)] uppercase md:text-[11px]";

/**
 * Enlace de columna. `min-h-11` y no solo texto: en el footer los enlaces quedan
 * apilados a 15px y sin área táctil se tocan de a dos. Eran 36px (`min-h-9`), que
 * ya evitaba el error de dedo pero quedaba por debajo del mínimo de 44; 44 alarga
 * la columna unos 32px en total y es la altura que corresponde.
 *
 * El hover va al acento del cliente —el mismo verde de los íconos de redes— y no a
 * `--texto`: es un solo gesto de color para todo el pie, y el acento ya es el
 * color que esta tienda usa para decir "esto responde".
 */
const ENLACE =
  "inline-flex min-h-11 items-center text-[15px] text-[var(--atenuado)] transition-colors hover:text-[var(--acento)]";

/**
 * Footer del cliente, en tres columnas: marca, tienda y atención.
 *
 * **Todo lo que muestra sale de `demo`**, y eso es lo que lo hace reusable: las
 * categorías salen de `categorias`, el entrenamiento de `persona.servicio` y las
 * redes de `negocio.redes`. Un cliente sin persona, sin redes o con una sola
 * categoría dibuja el mismo footer con menos filas, sin un hueco y sin un caso
 * especial por cliente.
 *
 * Nada de esto se inventa: si el dato no está en `demos.ts`, la fila no existe.
 * Por eso no hay enlaces legales —Términos, Devoluciones— aunque una tienda real
 * los tendría: esas páginas no existen y un enlace muerto en la demo de un
 * prospecto es peor que la ausencia.
 *
 * Usa el lockup completo (`logo`, marca + tagline) a 56px, que es donde hay
 * espacio para que "EL INOXIDABLE" se lea; el nav usa la variante reducida.
 */
export function StoreFooter({ demo }: { demo: Demo }) {
  const base = `/demos/${demo.slug}`;
  const { negocio } = demo;
  const redes = negocio.redes ?? [];
  const servicio = demo.persona?.servicio;

  const whatsapp = buildStoreInquiryHref(negocio.whatsapp, negocio.nombre);

  /**
   * Las mismas categorías que el nav y con el mismo hash: el filtro del catálogo
   * corre en el navegador —leer `searchParams` sacaría la página del prerender— y
   * un hash sí sobrevive al prerender.
   */
  const enlaces = [
    { href: `${base}/catalogo`, label: "Catálogo" },
    ...demo.categorias.map((categoria) => ({
      href: `${base}/catalogo#${categoria.slug}`,
      label: categoria.nombre,
    })),
  ];

  /**
   * El año se resuelve en el **build**, no en cada visita, porque toda la rama de
   * demos se prerenderiza. Es el comportamiento correcto acá y cada despliegue lo
   * refresca: NO agregarle `await connection()` para que sea del request, eso
   * sacaría la tienda entera del prerender estático a cambio de un número.
   */
  const anio = new Date().getFullYear();

  return (
    <footer className="mt-auto border-t border-[var(--borde)] bg-[var(--superficie)]">
      {/*
        Apilado en teléfonos angostos, marca a lo ancho con dos columnas debajo
        desde 640px, y tres columnas desde 768px. La marca se lleva la fracción
        más ancha: es la única columna con un párrafo.
      */}
      <div className="mx-auto grid max-w-[1240px] gap-8 px-4 py-10 sm:grid-cols-2 md:grid-cols-[1.2fr_1fr_1.1fr] md:gap-12 md:px-6 md:py-12">
        <div className="sm:col-span-2 md:col-span-1">
          <Link href={base} aria-label={negocio.nombre} className="inline-flex">
            <Image
              src={negocio.logo.src}
              alt={negocio.logo.alt}
              width={negocio.logo.width}
              height={negocio.logo.height}
              // Alto fijo de 56px en todos los anchos; el asset mide 852px. Sin
              // `sizes` se descargaba entero para pintar 66px de ancho.
              sizes="66px"
              className="h-14 w-auto"
            />
          </Link>

          {/*
            El lema, no el tagline: el tagline ya está dibujado dentro del lockup
            y repetirlo debajo lo diría dos veces. Va en caja normal y en cuerpo,
            al revés que el kicker del hero —que es mono, en acento y en
            mayúsculas—: es la misma frase, así que tiene que leerse como el cierre
            y no como un segundo encabezado.
          */}
          {negocio.lema && (
            <p className="mt-3 max-w-[30ch] text-[15px] leading-[1.5] text-[var(--atenuado)]">
              {negocio.lema}
            </p>
          )}

          {/*
            El -mx-3 saca el padding del área táctil (44px con un ícono de 18) de
            los dos lados: simétrico, para no correr el eje. Así el primer ícono
            arranca en el margen del footer en vez de 13px adentro. Por lo mismo el
            mt es chico: el área táctil ya aporta 13px de aire arriba.

            `size-11` y no `size-10`: eran 40×40, y son cuatro objetivos pegados
            entre sí en el borde inferior de la pantalla, que es donde el pulgar
            menos acierta.
          */}
          {redes.length > 0 && (
            <ul className="mt-2 -mx-3 flex flex-wrap items-center">
              {redes.map(({ red, href }) => {
                const { nombre, icon: Icon } = REDES[red];
                return (
                  <li key={red}>
                    <a
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`${negocio.nombre} en ${nombre}`}
                      className="inline-flex size-11 items-center justify-center rounded-[4px] text-[var(--atenuado-suave)] transition-colors hover:text-[var(--acento)]"
                    >
                      <Icon size={18} />
                    </a>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        {/* `nav` con nombre: son los enlaces de la tienda, no una lista de texto. */}
        <nav aria-label="Tienda">
          <h2 className={COLUMNA}>Tienda</h2>
          <ul className="mt-1.5">
            {enlaces.map((enlace) => (
              <li key={enlace.href}>
                <Link href={enlace.href} className={ENLACE}>
                  {enlace.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div>
          <h2 className={COLUMNA}>Atención</h2>

          {/* El único enlace del footer en `--texto`: es la vía de contacto, y en
              una tienda que cierra por chat es lo que más se toca de acá abajo. */}
          <a
            href={whatsapp}
            target="_blank"
            rel="noopener noreferrer"
            className="group mt-1.5 inline-flex min-h-11 w-fit items-center gap-1.5 text-[15px] font-semibold text-[var(--texto)] transition-colors hover:text-[var(--acento)]"
          >
            {/* El subrayado va en las palabras y no en el `<a>`: cruzando el logo
                se leería como un tachado. El hover sigue siendo del enlace
                completo, de ahí el `group`. */}
            <span className="underline decoration-[var(--borde-fuerte)] underline-offset-4 transition-colors group-hover:decoration-[var(--acento)]">
              Escríbenos por
            </span>{" "}
            <WhatsAppMark size={17} />
          </a>

          {/*
            La segunda línea de negocio, que hasta ahora solo se veía a mitad de
            la home: acá queda alcanzable desde cualquier pantalla de la tienda.
            El enlace es el mismo de esa sección —lo arma `buildServiceInquiryHref`
            para las dos— así que el mensaje que le llega es idéntico.
          */}
          {servicio && demo.persona && (
            <div className="mt-4 border-t border-[var(--borde)] pt-4">
              <a
                href={buildServiceInquiryHref(
                  negocio.whatsapp,
                  demo.persona.nombre,
                  servicio.titulo,
                )}
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex min-h-11 max-w-[26ch] items-center gap-1.5 text-[15px] leading-[1.4] text-[var(--atenuado)] transition-colors hover:text-[var(--acento)]"
              >
                <span>{servicio.titulo}</span>
                <WhatsAppMark size={15} />
              </a>
            </div>
          )}
        </div>
      </div>

      {/*
        Pie legal, separado por una regla: es el cierre del documento y no una
        cuarta columna. Todo en mono y atenuado, que es como esta tienda escribe
        sus metadatos.
      */}
      <div className="border-t border-[var(--borde)]">
        <div className="mx-auto flex max-w-[1240px] flex-col gap-1 px-4 py-5 font-(family-name:--font-mono-demo) text-[11px] text-[var(--atenuado-suave)] sm:flex-row sm:items-center sm:justify-between sm:gap-4 md:px-6 md:text-[12px]">
          <p>
            © {anio} {negocio.nombre} · {negocio.tagline}
          </p>
          {/*
            La única firma de XyraCode en la demo desde que se quitó la franja, y
            por eso tiene que verse clickeable: sin el subrayado quedaba como texto
            plano. Discreta igual —atenuada y en mono, como el resto del pie— porque
            el protagonista es el cliente. Abre en pestaña nueva para no sacar al
            prospecto de su tienda.
          */}
          <p>
            {/*
              La frase COMPLETA es el enlace, y de ahí sale el área táctil: el
              `min-h-11` colgaba de "XyraCode" sola, y una caja inline-flex de 44px
              metida en un renglón de 11px baja su propia baseline ~14px, así que la
              palabra salía corrida respecto a "Desarrollado por" y el pie legal
              crecía a lo alto. El `align-middle` no lo arreglaba: movía el
              desajuste de lugar. Con el `<a>` envolviendo las dos palabras no hay
              texto suelto contra el que desalinearse y los 44px se cumplen igual.

              El espacio entre las palabras lo pone el `gap-1`: en flex el texto
              suelto es un ítem anónimo y el navegador le recorta el espacio final.
              El `{" "}` literal va igual, por el nombre accesible —mismo motivo que
              en `WhatsAppMark`—: sin él se leería "Desarrollado porXyraCode".
            */}
            <a
              href={SEO.siteUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex min-h-11 items-center gap-1 transition-colors hover:text-[var(--acento)]"
            >
              Desarrollado por{" "}
              {/* Subrayado a intensidad completa y NO al 40% como en la franja que
                  se quitó: allá el texto iba sobre el tema invertido, acá ya es el
                  token más apagado de la paleta y bajarle la opacidad al subrayado
                  lo borraba. Va solo en la marca —no en "Desarrollado por"— para
                  que se lea como firma y no como una frase entera enlazada. */}
              <span className="underline decoration-[var(--atenuado-suave)] underline-offset-2 transition-colors group-hover:decoration-[var(--acento)]">
                XyraCode
              </span>
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
