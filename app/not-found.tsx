import { NotFoundScreen } from "@/components/sections/NotFoundScreen";

/**
 * 404 de las llamadas a `notFound()` dentro de un segmento. Renderiza dentro del
 * root layout, así que no lleva `<html>` ni fuentes propias, y es la convención
 * donde Next **no** lee un `export const metadata`: el <title> lo resuelve el
 * layout. Por eso el título propio del handoff vive en `global-not-found.tsx`.
 *
 * Hoy ninguna ruta llega hasta acá: `/blog/[slug]` y `/proyectos/[slug]` son las
 * únicas que llaman a `notFound()`, y al declarar `dynamicParams = false` sus
 * slugs desconocidos ya cortan a nivel de routing, donde atiende
 * `global-not-found.tsx` (verificado sirviendo el build). Se mantiene igual
 * porque es el fallback documentado: si una ruta pasa a `dynamicParams = true` o
 * alguna página nueva llama a `notFound()`, esto evita caer en la pantalla por
 * defecto de Next, y al compartir `<NotFoundScreen />` se ve idéntico.
 */
export default function NotFound() {
  return <NotFoundScreen />;
}
