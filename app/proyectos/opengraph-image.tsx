import { ImageResponse } from "next/og";
import { loadOgAssets, OG_CONTENT_TYPE, OG_SIZE, OgFrame } from "@/lib/og";
import { SEO } from "@/lib/seo";

const OG = SEO.ogImage.proyectosHub;

export const alt = OG.alt;
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default async function Image() {
  const assets = await loadOgAssets();

  return new ImageResponse(
    (
      <OgFrame
        {...assets}
        eyebrow={OG.eyebrow}
        title={OG.title}
        footerLeft={OG.footerLeft}
      />
    ),
    { ...OG_SIZE },
  );
}
