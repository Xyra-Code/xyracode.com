import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { CASE_STUDIES } from "@/lib/content";
import { SEO } from "@/lib/seo";

export const alt = "Caso de estudio de XyraCode";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export function generateStaticParams() {
  return CASE_STUDIES.map((c) => ({ slug: c.slug }));
}

export default async function Image({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const study = CASE_STUDIES.find((c) => c.slug === slug);
  const logo = await readFile(
    join(process.cwd(), "public/assets/brand/logo-horizontal.png"),
    "base64",
  );
  const logoSrc = `data:image/png;base64,${logo}`;
  const title = study?.hero.h1 ?? "Caso de estudio";

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "72px 80px",
          color: "#ffffff",
          backgroundColor: "#08110F",
          backgroundImage:
            "linear-gradient(155deg, #08110F 0%, #0d2b26 58%, #0F3D34 100%)",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: -140,
            right: -120,
            width: 460,
            height: 460,
            borderRadius: 460,
            background: "#10b981",
            opacity: 0.22,
            filter: "blur(120px)",
          }}
        />
        <img src={logoSrc} height={64} alt="" />
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              fontSize: 20,
              letterSpacing: 6,
              textTransform: "uppercase",
              color: "#5eead4",
              marginBottom: 22,
            }}
          >
            Caso de estudio
          </div>
          <div
            style={{
              display: "flex",
              fontSize: 56,
              fontWeight: 800,
              lineHeight: 1.06,
              letterSpacing: -2,
              maxWidth: 940,
            }}
          >
            {title}
          </div>
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            fontSize: 26,
          }}
        >
          <span style={{ color: "rgba(226,247,242,0.72)" }}>
            Desarrollo web y software a medida
          </span>
          <span style={{ color: "#5eead4", fontWeight: 700 }}>
            {SEO.ogImage.footerRight}
          </span>
        </div>
      </div>
    ),
    { ...size },
  );
}
