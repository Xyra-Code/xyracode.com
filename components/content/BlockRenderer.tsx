import Image from "next/image";
import type { Block } from "@/lib/content/blocks";

/**
 * Renderiza un cuerpo de bloques a HTML semántico. Sin clases de estilo:
 * la presentación se define en las plantillas de cada tipo de contenido.
 */
export function BlockRenderer({ blocks }: { blocks: Block[] }) {
  return (
    <>
      {blocks.map((block, i) => {
        switch (block.kind) {
          case "h2":
            return <h2 key={i}>{block.text}</h2>;
          case "p":
            return <p key={i}>{block.text}</p>;
          case "ul":
            return (
              <ul key={i}>
                {block.items.map((item, j) => (
                  <li key={j}>{item}</li>
                ))}
              </ul>
            );
          case "image":
            return (
              <figure key={i}>
                <Image
                  src={block.src}
                  alt={block.alt}
                  width={block.width}
                  height={block.height}
                />
                {block.caption ? <figcaption>{block.caption}</figcaption> : null}
              </figure>
            );
          case "quote":
            return <blockquote key={i}>{block.text}</blockquote>;
        }
      })}
    </>
  );
}
