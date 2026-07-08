import type { MetadataRoute } from "next";

// Next.js sirve esto como /manifest.webmanifest. Los colores salen de la
// paleta de marca (globals.css): fondo crema, chrome oscuro como el navbar.
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "XyraCode — Desarrollo web y apps a medida",
    short_name: "XyraCode",
    description:
      "Agencia en Colombia de desarrollo web y apps a medida. Del prototipo a producción: rápido, escalable y sin fricción.",
    start_url: "/",
    display: "standalone",
    lang: "es-CO",
    background_color: "#f6fbfa",
    theme_color: "#08110f",
    icons: [
      {
        src: "/assets/favicon-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/assets/favicon-32.png",
        sizes: "32x32",
        type: "image/png",
      },
      {
        src: "/assets/favicon-16.png",
        sizes: "16x16",
        type: "image/png",
      },
    ],
  };
}
