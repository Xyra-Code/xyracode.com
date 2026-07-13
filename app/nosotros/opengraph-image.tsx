import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";

export const alt = "Yeison Enciso — El desarrollador detrás de XyraCode";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  const [logo, founder] = await Promise.all([
    readFile(
      join(process.cwd(), "public/assets/xc-teal-horizontal-trans.png"),
      "base64",
    ),
    readFile(join(process.cwd(), "public/assets/founder.png"), "base64"),
  ]);
  const logoSrc = `data:image/png;base64,${logo}`;
  const founderSrc = `data:image/png;base64,${founder}`;

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
        {/* Blob de acento */}
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

        {/* Logo (fondo transparente) */}
        <img src={logoSrc} height={64} alt="" />

        {/* Titular + foto */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 60,
          }}
        >
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
              Nosotros
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                fontSize: 68,
                fontWeight: 800,
                lineHeight: 1.06,
                letterSpacing: -2,
              }}
            >
              <span>El desarrollador</span>
              <span style={{ color: "#5eead4" }}>detrás de XyraCode</span>
            </div>
          </div>
          <img
            src={founderSrc}
            width={330}
            height={330}
            alt=""
            style={{
              borderRadius: 330,
              objectFit: "cover",
              border: "6px solid rgba(94,234,212,0.45)",
            }}
          />
        </div>

        {/* Pie */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            fontSize: 26,
          }}
        >
          <span style={{ color: "rgba(226,247,242,0.72)" }}>
            Yeison Enciso · Villavicencio, Colombia
          </span>
          <span style={{ color: "#5eead4", fontWeight: 700 }}>
            xyracode.com
          </span>
        </div>
      </div>
    ),
    { ...size },
  );
}
