import { FloatingWhatsApp } from "@/components/sections/FloatingWhatsApp";
import { SITE_GRAPH } from "@/lib/jsonld";

/**
 * Los dos globales de XyraCode: el botón flotante de WhatsApp y el `@graph` del
 * sitio.
 *
 * **Por qué no viven en el layout raíz.** Un layout baja a TODA su rama, y esa
 * rama incluye `app/demos/*`, que son tiendas de clientes. Ahí no corresponden:
 * la tienda de otro negocio no puede declarar que pertenece a xyracode.com ni
 * mostrar el WhatsApp de la agencia encima del suyo. Y como la herencia es
 * todo-o-nada hacia abajo, la única forma de excluir una rama es dejar de
 * heredar.
 *
 * **Por qué esto no es un patrón nuevo.** Cada página del sitio ya declara su
 * propio `<Navbar />`, `<Footer />` y su propio bloque de JSON-LD — ver el final
 * de `app/contacto/page.tsx`. Estos dos globales eran la única excepción a una
 * convención que el codebase ya seguía en todo lo demás.
 *
 * `SiteChrome.test.tsx` impide que una página nueva se olvide de montarlo, que es
 * lo que se pierde al no usar un route group.
 */
export function SiteChrome() {
  return (
    <>
      <FloatingWhatsApp />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(SITE_GRAPH) }}
      />
    </>
  );
}
