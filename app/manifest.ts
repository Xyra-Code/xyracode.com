import type { MetadataRoute } from "next";
import { SEO } from "@/lib/seo";

// Next.js sirve esto como /manifest.webmanifest. Los colores salen de la
// paleta de marca (globals.css): fondo crema, chrome oscuro como el navbar.
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: SEO.manifest.name,
    short_name: SEO.manifest.shortName,
    description: SEO.home.shortDescription,
    start_url: "/",
    display: "standalone",
    lang: SEO.localeBcp47,
    background_color: "#f6fbfa",
    theme_color: "#08110f",
    icons: [
      {
        src: "/assets/favicons/favicon-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/assets/favicons/favicon-32.png",
        sizes: "32x32",
        type: "image/png",
      },
      {
        src: "/assets/favicons/favicon-16.png",
        sizes: "16x16",
        type: "image/png",
      },
    ],
  };
}
