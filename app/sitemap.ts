import type { MetadataRoute } from "next";
import { BLOG_POSTS, CASE_STUDIES, SERVICE_PAGES } from "@/lib/content";

// Fecha real del último cambio de contenido de cada ruta fija (ISO 8601).
// Actualizar a mano — NO usar new Date() (le diría a Google que todo el
// sitio cambió en cada build). Las rutas de servicio y de proyectos derivan
// su fecha del campo lastModified de cada ServicePage / CaseStudy.
const LAST_MODIFIED = {
  home: "2026-07-13",
  serviciosHub: "2026-07-13",
  nosotros: "2026-07-13",
  proyectosHub: "2026-07-13",
  blogHub: "2026-07-13",
} as const;

const BASE = "https://xyracode.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const servicePages: MetadataRoute.Sitemap = SERVICE_PAGES.map((page) => ({
    url: `${BASE}/servicios/${page.slug}`,
    lastModified: page.lastModified,
    changeFrequency: "monthly",
    priority: 0.8,
  }));

  const caseStudies: MetadataRoute.Sitemap = CASE_STUDIES.map((c) => ({
    url: `${BASE}/proyectos/${c.slug}`,
    lastModified: c.lastModified,
    changeFrequency: "monthly",
    priority: 0.8,
  }));

  const blogPosts: MetadataRoute.Sitemap = BLOG_POSTS.map((p) => ({
    url: `${BASE}/blog/${p.slug}`,
    lastModified: p.lastModified,
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  return [
    {
      url: BASE,
      lastModified: LAST_MODIFIED.home,
      changeFrequency: "monthly",
      priority: 1,
    },
    {
      url: `${BASE}/servicios`,
      lastModified: LAST_MODIFIED.serviciosHub,
      changeFrequency: "monthly",
      priority: 0.9,
    },
    ...servicePages,
    {
      url: `${BASE}/proyectos`,
      lastModified: LAST_MODIFIED.proyectosHub,
      changeFrequency: "monthly",
      priority: 0.9,
    },
    ...caseStudies,
    {
      url: `${BASE}/nosotros`,
      lastModified: LAST_MODIFIED.nosotros,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${BASE}/blog`,
      lastModified: LAST_MODIFIED.blogHub,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    ...blogPosts,
  ];
}
