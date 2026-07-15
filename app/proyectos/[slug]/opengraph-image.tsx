import { ImageResponse } from "next/og";
import { CASE_STUDIES } from "@/lib/content";
import { loadOgAssets, OG_CONTENT_TYPE, OG_SIZE, OgFrame } from "@/lib/og";

export const alt = "Caso de estudio de XyraCode";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export function generateStaticParams() {
  return CASE_STUDIES.map((c) => ({ slug: c.slug }));
}

export const dynamicParams = false;

export default async function Image({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const study = CASE_STUDIES.find((c) => c.slug === slug);
  const assets = await loadOgAssets();
  const title = study?.hero.h1 ?? "Caso de estudio";

  return new ImageResponse(
    (
      <OgFrame
        {...assets}
        eyebrow="Caso de estudio"
        title={title}
        titleFontSize={56}
        footerLeft="Desarrollo web y software a medida"
      />
    ),
    { ...OG_SIZE },
  );
}
