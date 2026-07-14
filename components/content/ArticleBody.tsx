import type { Block } from "@/lib/content/blocks";
import { BlockRenderer } from "./BlockRenderer";

/**
 * Cuerpo de lectura largo (servicios, casos, artículos). Envuelve el
 * BlockRenderer (semántico, sin estilos, de Fase 1) en un contenedor
 * `.prose-xyra` que aplica la tipografía del handoff (globals.css).
 * El ancho de lectura lo fija el caller con `max-w-*`.
 */
export function ArticleBody({
  blocks,
  className = "",
}: {
  blocks: Block[];
  className?: string;
}) {
  return (
    <div className={`prose-xyra ${className}`.trim()}>
      <BlockRenderer blocks={blocks} />
    </div>
  );
}
