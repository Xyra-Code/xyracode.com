import { ImageResponse } from "next/og";
import { BLOG_POSTS } from "@/lib/content";
import { loadOgAssets, OG_CONTENT_TYPE, OG_SIZE, OgFrame } from "@/lib/og";

export const alt = "Artículo del blog de XyraCode";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export function generateStaticParams() {
  return BLOG_POSTS.map((p) => ({ slug: p.slug }));
}

export const dynamicParams = false;

export default async function Image({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = BLOG_POSTS.find((p) => p.slug === slug);
  const assets = await loadOgAssets();
  const title = post?.title ?? "Blog";
  const eyebrow = post ? `${post.category} · ${post.readingTime}` : "Blog";

  return new ImageResponse(
    (
      <OgFrame
        {...assets}
        eyebrow={eyebrow}
        title={title}
        titleFontSize={54}
        footerLeft="Blog · XyraCode"
      />
    ),
    { ...OG_SIZE },
  );
}
