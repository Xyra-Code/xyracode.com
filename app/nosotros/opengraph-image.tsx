import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { loadOgAssets, OG_CONTENT_TYPE, OG_SIZE, OgFrame } from "@/lib/og";
import { SEO } from "@/lib/seo";

const OG = SEO.ogImage.nosotros;

export const alt = OG.alt;
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default async function Image() {
  const [assets, founder] = await Promise.all([
    loadOgAssets(),
    readFile(join(process.cwd(), "public/assets/team/founder.png"), "base64"),
  ]);
  const founderSrc = `data:image/png;base64,${founder}`;

  return new ImageResponse(
    (
      <OgFrame
        {...assets}
        eyebrow={OG.eyebrow}
        title={
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ display: "flex" }}>El desarrollador</div>
            <div style={{ display: "flex", color: "#5eead4" }}>
              detrás de XyraCode
            </div>
          </div>
        }
        footerLeft={OG.footerLeft}
        media={
          <img
            src={founderSrc}
            width={320}
            height={320}
            alt=""
            style={{
              borderRadius: 320,
              objectFit: "cover",
              border: "6px solid rgba(94,234,212,0.45)",
            }}
          />
        }
      />
    ),
    { ...OG_SIZE },
  );
}
