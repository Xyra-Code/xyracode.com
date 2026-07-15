/**
 * Chrome compartido de las imágenes Open Graph (1200×630).
 *
 * Todas las cards son una misma familia: fondo de "estudio de ingeniería"
 * (glows radiales en degradado, marca XC al sangre como marca de agua, marco
 * técnico de línea fina y barra de acento junto al titular). Cada ruta
 * `opengraph-image.tsx` solo aporta su contenido; el look vive aquí.
 *
 * Nota Satori: `filter: blur()` NO se renderiza, por eso la profundidad se
 * construye con `radial-gradient`. Todo contenedor con más de un hijo debe
 * declarar `display: "flex"`.
 */
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import type { ReactNode } from "react";
import { SEO } from "@/lib/seo";

export const OG_SIZE = { width: 1200, height: 630 } as const;
export const OG_CONTENT_TYPE = "image/png";

const INK = "#08110F";
const MINT = "#5eead4";
const SOFT = "rgba(226,247,242,0.72)";
const LINE = "rgba(94,234,212,0.14)";

/** Carga (en base64) los assets de marca que reutilizan todas las cards. */
export async function loadOgAssets() {
  const [logo, mark] = await Promise.all([
    readFile(
      join(process.cwd(), "public/assets/brand/logo-horizontal.png"),
      "base64",
    ),
    readFile(
      join(process.cwd(), "public/assets/brand/variants/xc-teal-mark-white.png"),
      "base64",
    ),
  ]);
  return {
    logoSrc: `data:image/png;base64,${logo}`,
    markSrc: `data:image/png;base64,${mark}`,
  };
}

type OgFrameProps = {
  logoSrc: string;
  markSrc: string;
  /** Etiqueta corta en versalitas sobre el titular. */
  eyebrow: string;
  /** Titular: string simple o JSX con acentos de color. */
  title: ReactNode;
  footerLeft: string;
  footerRight?: string;
  /** Media opcional a la derecha del titular (p. ej. foto del fundador). */
  media?: ReactNode;
  /** Tamaño del titular; súbelo cuando el copy sea corto. */
  titleFontSize?: number;
};

export function OgFrame({
  logoSrc,
  markSrc,
  eyebrow,
  title,
  footerLeft,
  footerRight = SEO.ogImage.footerRight,
  media,
  titleFontSize = 68,
}: OgFrameProps) {
  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: "70px 80px",
        color: "#ffffff",
        backgroundColor: INK,
        backgroundImage: [
          "radial-gradient(circle at 86% -6%, rgba(16,185,129,0.34) 0%, rgba(16,185,129,0) 46%)",
          "radial-gradient(circle at -2% 108%, rgba(45,120,105,0.55) 0%, rgba(45,120,105,0) 44%)",
          "linear-gradient(150deg, #08110F 0%, #0d2b26 58%, #0F3D34 100%)",
        ].join(", "),
      }}
    >
      {/* Marca de agua XC sangrando por la esquina inferior derecha */}
      <img
        src={markSrc}
        width={560}
        height={560}
        alt=""
        style={{
          position: "absolute",
          bottom: -150,
          right: -110,
          opacity: 0.07,
        }}
      />

      {/* Marco técnico de línea fina */}
      <div
        style={{
          position: "absolute",
          top: 28,
          left: 28,
          right: 28,
          bottom: 28,
          border: `1px solid ${LINE}`,
          borderRadius: 20,
        }}
      />

      {/* Fila superior: logo */}
      <div style={{ display: "flex" }}>
        <img src={logoSrc} height={58} alt="" />
      </div>

      {/* Bloque central: barra de acento + titular (+ media opcional) */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 56,
        }}
      >
        <div style={{ display: "flex", alignItems: "stretch", gap: 28 }}>
          <div
            style={{
              display: "flex",
              width: 6,
              borderRadius: 6,
              background: MINT,
            }}
          />
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div
              style={{
                display: "flex",
                fontSize: 20,
                letterSpacing: 6,
                textTransform: "uppercase",
                color: MINT,
                marginBottom: 20,
              }}
            >
              {eyebrow}
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                fontSize: titleFontSize,
                fontWeight: 800,
                lineHeight: 1.06,
                letterSpacing: -2,
                maxWidth: media ? 620 : 880,
              }}
            >
              {title}
            </div>
          </div>
        </div>
        {media}
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
        <span style={{ color: SOFT }}>{footerLeft}</span>
        <span style={{ color: MINT, fontWeight: 700 }}>{footerRight}</span>
      </div>
    </div>
  );
}
