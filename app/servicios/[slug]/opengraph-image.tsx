import { ImageResponse } from "next/og";
import { SERVICE_PAGES } from "@/lib/content";
import { loadOgAssets, OG_CONTENT_TYPE, OG_SIZE, OgFrame } from "@/lib/og";

export const alt = "Servicio de desarrollo de XyraCode";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export function generateStaticParams() {
  return SERVICE_PAGES.map((page) => ({ slug: page.slug }));
}

export const dynamicParams = false;

export default async function Image({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const page = SERVICE_PAGES.find((p) => p.slug === slug);
  const assets = await loadOgAssets();
  const eyebrow = page?.hero.eyebrow ?? "Servicios";
  const title = page?.hero.h1 ?? "Servicios";

  return new ImageResponse(
    (
      <OgFrame
        {...assets}
        eyebrow={eyebrow}
        title={title}
        titleFontSize={60}
        footerLeft="Desarrollo web y software a medida"
      />
    ),
    { ...OG_SIZE },
  );
}
