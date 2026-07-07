"use client";

import { getCalApi } from "@calcom/embed-react";
import { Calendar } from "lucide-react";
import Link from "next/link";
import { useEffect } from "react";
import { buttonClasses } from "@/components/ui/Button";
import { CONTACT } from "@/lib/content";

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

  useEffect(() => {
    if (!slug) return;
    (async () => {
      const cal = await getCalApi({ namespace: NAMESPACE });
      cal("ui", {
        cssVarsPerTheme: {
          light: { "cal-brand": "#0F766E" },
          dark: { "cal-brand": "#5EEAD4" },
        },
        hideEventTypeDetails: false,
        layout: "month_view",
      });
    })();
  }, [slug]);

  // Fallback sin agenda configurada: mismo comportamiento que antes.
  if (!slug) {
    return (
      <Link
        href={`mailto:${CONTACT.email}?subject=Agendar%20llamada`}
        className={className}
      >
        Agendar llamada <Calendar size={20} aria-hidden />
      </Link>
    );
  }

  return (
    <button
      type="button"
      data-cal-namespace={NAMESPACE}
      data-cal-link={slug}
      data-cal-config={`{"layout":"month_view"}`}
      className={className}
    >
      Agendar llamada <Calendar size={20} aria-hidden />
    </button>
  );
}
