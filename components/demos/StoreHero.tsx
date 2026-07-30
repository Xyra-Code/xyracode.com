import Image from "next/image";
import type { Demo } from "@/lib/content";
import { buildStoreInquiryHref } from "@/lib/demos/order";
import { StoreButton } from "./StoreButton";
import { WhatsAppMark } from "./WhatsAppMark";

/**
 * Hero de la home: dos columnas en desktop (texto / imagen 16:9) y una sola
 * columna en móvil (handoff, "Estructura por pantalla" §1).
 *
 * La imagen es el LCP de la demo —es lo más grande arriba del pliegue— así que
 * va con `priority`: sin eso Next la carga en diferido y el prospecto ve el
 * hueco durante el primer segundo, que es justo el segundo que decide la venta.
 *
 * Acá sí `object-cover`, al contrario que en la foto de producto: el slot es
 * 16:9 igual que el asset (1600×900), y si un cliente entrega una imagen con
 * otra proporción es mejor recortarla que dejar franjas de fondo a los lados.
 * En la tarjeta de producto el recorte se prohíbe porque cortaría el guante.
 */
export function StoreHero({ demo }: { demo: Demo }) {
  const { negocio, hero } = demo;

  // El mismo mensaje que el enlace del footer: son las dos consultas generales de
  // la tienda, así que el texto lo arma una sola función.
  const whatsapp = buildStoreInquiryHref(negocio.whatsapp, negocio.nombre);

  return (
    /*
      Grilla con posiciones explícitas en desktop en vez de dos columnas con el
      texto y los botones en un mismo `div`: en móvil el handoff pone la imagen
      ENTRE el párrafo y los botones, y con un solo bloque de texto el orden del
      DOM la dejaría al final. Así el orden natural del documento ya es el de
      móvil, y en desktop la imagen ocupa las dos filas de la derecha.
    */
    <section className="mx-auto grid max-w-[1240px] gap-6 px-4 py-9 md:grid-cols-2 md:gap-11 md:px-6 md:py-14">
      <div className="md:col-start-1 md:row-start-1">
        {/*
          El kicker es el LEMA, no el tagline: "Rendimiento. Control. Confianza."
          es lo que encabeza sus nueve piezas de producto, y verlo acá es lo que le
          hace reconocer la tienda como suya. El tagline ("El inoxidable") es quién
          es, y vive en el logo y en el <title>. Si un cliente no tiene lema, cae al
          tagline en vez de dejar el hueco.

          Antes decía `tagline · ciudad` (rubro · zona, como el handoff), pero la
          ciudad no estaba confirmada con el cliente y salió de la demo.
        */}
        <p className="font-(family-name:--font-mono-demo) text-[11px] tracking-[0.16em] text-[var(--acento)] uppercase md:text-[12px]">
          {negocio.lema ?? negocio.tagline}
        </p>

        {/*
          Caja normal en el JSX y `uppercase` por CSS: en mayúscula sostenida
          algunos lectores de pantalla deletrean letra por letra.
        */}
        <h1 className="mt-4 font-(family-name:--font-archivo) text-[38px] leading-[0.95] font-bold tracking-[-0.03em] text-[var(--texto)] uppercase md:text-[56px]">
          {hero.titulo}
        </h1>

        <p className="mt-5 max-w-[46ch] text-[16px] leading-[1.55] text-[var(--cuerpo)] md:text-[17px]">
          {hero.subtitulo}
        </p>
      </div>

      <div className="md:col-start-2 md:row-span-2 md:row-start-1">
        <div className="overflow-hidden rounded-[4px] border border-[var(--borde)] bg-[var(--superficie-foto)]">
          <Image
            src={hero.imagen.src}
            alt={hero.imagen.alt}
            width={hero.imagen.width}
            height={hero.imagen.height}
            priority
            // Ancho completo en móvil, media pantalla arriba de 768px, y nunca
            // más de la mitad del contenedor de 1240px.
            sizes="(max-width: 767px) 100vw, (max-width: 1240px) 50vw, 620px"
            className="aspect-video w-full object-cover"
          />
        </div>
      </div>

      {/*
        Ancho completo apilado en móvil y en fila en desktop. Se usa `w-full
        md:w-auto` en vez de la prop `full` de StoreButton, que es incondicional.
      */}
      <div className="flex flex-col gap-3 md:col-start-1 md:row-start-2 md:flex-row md:items-end">
        <StoreButton href={`/demos/${demo.slug}/catalogo`} className="w-full md:w-auto">
          Ver catálogo
        </StoreButton>
        <StoreButton
          href={whatsapp}
          variant="secundario"
          external
          className="w-full md:w-auto"
        >
          Escribir por{" "}
          <WhatsAppMark size={17} />
        </StoreButton>
      </div>
    </section>
  );
}
