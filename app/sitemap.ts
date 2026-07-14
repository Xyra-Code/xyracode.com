import type { MetadataRoute } from "next";

// Fecha real del último cambio de contenido de cada ruta (ISO 8601).
// Actualizar a mano cuando cambie el contenido de la página — NO usar new Date():
// eso le diría a Google que todo el sitio cambió en cada build/despliegue.
const LAST_MODIFIED = {
  home: "2026-07-13",
  nosotros: "2026-07-13",
} as const;

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: "https://xyracode.com",
      lastModified: LAST_MODIFIED.home,
      changeFrequency: "monthly",
      priority: 1,
    },
    {
      url: "https://xyracode.com/nosotros",
      lastModified: LAST_MODIFIED.nosotros,
      changeFrequency: "monthly",
      priority: 0.8,
    },
  ];
}
