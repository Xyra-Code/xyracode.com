import Image from "next/image";
import { renderInline as renderText } from "@/components/content/InlineText";
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
          case "h3":
            return <h3 key={i}>{block.text}</h3>;
          case "p":
            return <p key={i}>{renderText(block.text)}</p>;
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
          // El wrapper es el que scrollea en móvil: la tabla nunca debe
          // desbordar el ancho de lectura ni empujar el body horizontalmente.
          case "table":
            return (
              <div key={i} className="prose-table">
                <table>
                  {block.caption ? <caption>{block.caption}</caption> : null}
                  <thead>
                    <tr>
                      {block.head.map((cell) => (
                        <th key={cell} scope="col">
                          {cell}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {block.rows.map((row, j) => (
                      <tr key={j}>
                        {row.map((cell, k) =>
                          k === 0 ? (
                            <th key={k} scope="row">
                              {cell}
                            </th>
                          ) : (
                            <td key={k}>{cell}</td>
                          ),
                        )}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            );
        }
      })}
    </>
  );
}
