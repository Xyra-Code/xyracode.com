import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import { FloatingWhatsApp } from "@/components/sections/FloatingWhatsApp";
import { NotFoundScreen } from "@/components/sections/NotFoundScreen";
import { SEO } from "@/lib/seo";
import "./globals.css";

/**
 * 404 de las URLs que no matchean ninguna ruta (requiere
 * `experimental.globalNotFound`). Next resuelve esto a nivel de routing y saltea
 * el render del root layout, así que el documento va completo: `<html>`,
 * `<body>`, los estilos globales y la fuente. Es también la única de las dos
 * convenciones de 404 donde el `export const metadata` se lee — en
 * `app/not-found.tsx` Next lo ignora en silencio.
 */

// Solo Plus Jakarta Sans: la 404 no usa `font-mono`, y bajar una segunda
// familia para una página de error es peso al puro costo.
const jakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  // El metadataBase se repite porque el del root layout no llega hasta acá; sin
  // él el build avisa que no puede resolver URLs y asume localhost.
  metadataBase: new URL(SEO.siteUrl),
  // Sin `template`: al saltearse el layout, este title es el documento entero.
  title: SEO.notFound.title,
  // Sin `robots`: Next ya inyecta `noindex` por devolver status 404, y
  // declararlo acá emitía la etiqueta dos veces. `noindex` sin `nofollow` deja
  // los enlaces rastreables, que es lo que pedía el handoff.
};

// Mismo chrome oscuro que el resto del sitio (globals.css: night #08110f).
export const viewport: Viewport = {
  themeColor: "#08110f",
  colorScheme: "light",
};

export default function GlobalNotFound() {
  return (
    <html
      lang="es-CO"
      data-scroll-behavior="smooth"
      className={`${jakarta.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">
        <NotFoundScreen />
        <FloatingWhatsApp />
      </body>
    </html>
  );
}
