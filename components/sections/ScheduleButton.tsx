"use client";

import { getCalApi } from "@calcom/embed-react";
import { Calendar } from "lucide-react";
import Link from "next/link";
import { useCallback, useRef } from "react";
import { buttonClasses } from "@/components/ui/Button";
import { CONTACT, UI } from "@/lib/content";

type CalApi = Awaited<ReturnType<typeof getCalApi>>;

const NAMESPACE = "agendar";

/** Extrae el slug de un link de Cal.com: https://cal.com/xyracode/30min → xyracode/30min */
function calSlug(url: string): string | null {
  try {
    const u = new URL(url);
    if (!u.hostname.endsWith("cal.com")) return null;
    const path = u.pathname.replace(/^\/+|\/+$/g, "");
    return path || null;
  } catch {
    return null;
  }
}

/**
 * Botón "Agendar llamada". Con un CONTACT.calLink de Cal.com abre el
 * calendario en un popup (sin salir de la landing); si no, cae al mailto.
 */
export function ScheduleButton() {
  const slug = CONTACT.calLink ? calSlug(CONTACT.calLink) : null;
  const className = buttonClasses("ghost", "md", "cursor-pointer border-white/40");

  // Carga perezosa: el JS de terceros de Cal.com solo se descarga en la
  // primera interacción con el botón (hover/focus/click), no al montar la
  // home. Evita penalizar INP/LCP de la página más visitada.
  const calApi = useRef<Promise<CalApi> | null>(null);

  const warmUp = useCallback(() => {
    if (!slug) return calApi.current;
    if (!calApi.current) {
      calApi.current = getCalApi({ namespace: NAMESPACE }).then((cal) => {
        cal("ui", {
          cssVarsPerTheme: {
            light: { "cal-brand": "#0F766E" },
            dark: { "cal-brand": "#5EEAD4" },
          },
          hideEventTypeDetails: false,
          layout: "month_view",
        });
        cal("preload", { calLink: slug, type: "modal" });
        return cal;
      });
    }
    return calApi.current;
  }, [slug]);

  const openCal = useCallback(async () => {
    if (!slug) return;
    const cal = await warmUp();
    cal?.("modal", { calLink: slug, config: { layout: "month_view" } });
  }, [slug, warmUp]);

  // Fallback sin agenda configurada: mismo comportamiento que antes.
  if (!slug) {
    return (
      <Link
        href={`mailto:${CONTACT.email}?subject=Agendar%20llamada`}
        className={className}
      >
        {UI.cta.schedule} <Calendar size={20} aria-hidden />
      </Link>
    );
  }

  return (
    <button
      type="button"
      onMouseEnter={warmUp}
      onFocus={warmUp}
      onClick={openCal}
      className={className}
    >
      {UI.cta.schedule} <Calendar size={20} aria-hidden />
    </button>
  );
}
