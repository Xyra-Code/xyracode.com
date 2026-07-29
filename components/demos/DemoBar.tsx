import { CONTACT } from "@/lib/content";

/**
 * Única presencia de XyraCode en la demo. Los colores salen de `--franja-*`
 * (demo.css), que son el tema del cliente invertido: así la franja queda clara
 * sobre una tienda oscura y oscura sobre una clara, sin necesitar un caso
 * especial por cliente.
 *
 * Discreta a propósito: el protagonista es el cliente, no la agencia.
 * Alto 32px en móvil / 40px en desktop — el nav se pega justo debajo.
 */
export function DemoBar() {
  const href = `https://wa.me/${CONTACT.whatsapp}?text=${encodeURIComponent(
    "Hola XyraCode, vi una demo de tienda y quiero una así.",
  )}`;

  return (
    <div className="fixed inset-x-0 top-0 z-50 flex h-8 items-center justify-between gap-4 border-b border-[var(--franja-borde)] bg-[var(--franja-fondo)] px-4 md:h-10 md:px-6">
      <p className="font-(family-name:--font-mono-demo) text-[11px] text-[var(--franja-texto)] md:text-[13px]">
        Demo · hecha por XyraCode
      </p>
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="shrink-0 font-(family-name:--font-mono-demo) text-[11px] whitespace-nowrap text-[var(--franja-texto)] underline decoration-[var(--franja-texto)]/40 underline-offset-2 transition-colors hover:decoration-[var(--franja-texto)] md:text-[13px]"
      >
        Quiero una así
      </a>
    </div>
  );
}
