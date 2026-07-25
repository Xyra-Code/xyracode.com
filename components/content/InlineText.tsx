import Link from "next/link";
import { Fragment } from "react";
import type { Inline } from "@/lib/content/blocks";

/**
 * Renderiza un texto que puede ser plano o una mezcla de texto y enlaces
 * internos. Vive aparte de BlockRenderer porque el modelo `Inline` también lo
 * usan secciones que no son cuerpos de bloques (por ejemplo /nosotros), y los
 * enlaces contextuales dentro de la frase son los que pesan para SEO.
 */
export function renderInline(text: string | Inline[]) {
  if (typeof text === "string") return text;
  return text.map((part, i) =>
    typeof part === "string" ? (
      <Fragment key={i}>{part}</Fragment>
    ) : (
      <Link key={i} href={part.href}>
        {part.text}
      </Link>
    ),
  );
}
