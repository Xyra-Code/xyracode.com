import { ImageResponse } from "next/og";
import { loadOgAssets, OG_CONTENT_TYPE, OG_SIZE, OgFrame } from "@/lib/og";
import { SEO } from "@/lib/seo";

const OG = SEO.ogImage.home;

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
        titleFontSize={76}
        title={
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ display: "flex" }}>Desarrollo web y apps a medida</div>
            <div style={{ display: "flex", gap: 22 }}>
              <div style={{ display: "flex" }}>que</div>
              <div style={{ display: "flex", color: "#5eead4" }}>impulsan</div>
              <div style={{ display: "flex" }}>tu negocio</div>
            </div>
          </div>
        }
        footerLeft={OG.footerLeft}
      />
    ),
    { ...OG_SIZE },
  );
}
