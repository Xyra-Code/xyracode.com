import { CONTACT, UI } from "@/lib/content";

// Path oficial del glifo de WhatsApp (viewBox 0 0 32 32), tomado textual del
// handoff design_handoff_whatsapp.
const WHATSAPP_GLYPH =
  "M16.001 3.2C8.94 3.2 3.2 8.94 3.2 16c0 2.26.6 4.46 1.73 6.4L3.09 28.8l6.56-1.72a12.74 12.74 0 006.35 1.62h.01c7.06 0 12.8-5.74 12.8-12.8 0-3.42-1.33-6.63-3.75-9.05A12.7 12.7 0 0016 3.2zm0 2.13a10.6 10.6 0 017.54 3.13 10.6 10.6 0 013.13 7.54c0 5.88-4.79 10.67-10.67 10.67a10.6 10.6 0 01-5.4-1.48l-.39-.23-4.02 1.05 1.07-3.92-.25-.4a10.55 10.55 0 01-1.62-5.69c0-5.88 4.78-10.67 10.66-10.67zm-4.02 5.35c-.19 0-.5.07-.76.36-.26.29-1 .98-1 2.39s1.02 2.77 1.17 2.96c.14.19 2 3.06 4.86 4.29.68.29 1.2.46 1.62.59.68.22 1.3.19 1.79.12.55-.08 1.68-.69 1.92-1.35.24-.66.24-1.23.17-1.35-.07-.12-.26-.19-.55-.34-.29-.14-1.68-.83-1.94-.92-.26-.1-.45-.14-.64.15-.19.29-.73.92-.9 1.11-.16.19-.33.22-.62.07-.29-.14-1.2-.44-2.29-1.41-.85-.76-1.42-1.69-1.58-1.98-.16-.29-.02-.45.13-.59.13-.13.29-.34.43-.5.15-.17.19-.29.29-.48.1-.19.05-.36-.02-.5-.07-.15-.64-1.56-.9-2.13-.24-.56-.48-.48-.64-.49l-.55-.01z";

/**
 * FAB de WhatsApp, presente y siempre visible en todas las páginas (montado en
 * el layout). En reposo muestra solo el glifo teal con flotación + halo +
 * saludo; en hover despliega la etiqueta "Hablemos de tu proyecto".
 * Diseño: design_handoff_whatsapp.
 */
export function FloatingWhatsApp() {
  const href = `https://wa.me/${CONTACT.whatsapp}?text=${encodeURIComponent(
    CONTACT.whatsappMessage,
  )}`;

  return (
    // Wrapper fijo: posición y offsets (28px desktop / 20px móvil sobre el
    // notch). El FAB en sí vive dentro.
    <div className="fixed right-5 bottom-[calc(1.25rem+env(safe-area-inset-bottom))] z-9999 sm:right-7 sm:bottom-[calc(1.75rem+env(safe-area-inset-bottom))]">
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={UI.floatingWhatsApp.aria}
        className="wa-fab group flex items-center no-underline"
      >
        {/* Etiqueta: colapsada por defecto, se despliega en hover del FAB. */}
        <div className="max-w-0 overflow-hidden whitespace-nowrap opacity-0 transition-[max-width,opacity,margin] duration-300 ease-out group-hover:mr-3.5 group-hover:max-w-[280px] group-hover:opacity-100">
          <div className="flex flex-col rounded-2xl border border-[rgba(94,234,212,0.28)] bg-[rgba(11,31,28,0.85)] px-[18px] py-2.5 shadow-[0_18px_40px_-22px_rgba(0,0,0,0.8)] backdrop-blur-[14px]">
            <span className="text-[10px] font-extrabold tracking-[0.16em] text-[#5EEAD4] uppercase">
              {UI.floatingWhatsApp.eyebrow}
            </span>
            <span className="text-sm font-bold tracking-[-0.01em] text-white">
              {UI.floatingWhatsApp.label}
            </span>
          </div>
        </div>

        {/* Ícono: glifo teal sin círculo, con halo detrás. */}
        <div className="wa-core relative flex items-center justify-center transition-transform duration-200 ease-out">
          <span
            aria-hidden
            className="wa-halo pointer-events-none absolute h-14 w-14 rounded-full bg-[radial-gradient(circle,#10B981_0%,rgba(16,185,129,0)_70%)]"
          />
          <svg
            aria-hidden
            viewBox="0 0 32 32"
            width={56}
            height={56}
            fill="#5EEAD4"
            xmlns="http://www.w3.org/2000/svg"
            className="wa-glyph relative origin-center [filter:drop-shadow(0_8px_22px_rgba(16,185,129,0.5))]"
          >
            <path d={WHATSAPP_GLYPH} />
          </svg>
        </div>
      </a>
    </div>
  );
}
