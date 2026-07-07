# xyracode.com

Sitio web oficial de Xyra Code - Agencia de desarrollo de software.

Landing page construida con **Next.js (App Router) + TypeScript + Tailwind CSS v4**, siguiendo el handoff de diseño en [`handoff/design_handoff_xyracode_landing/`](handoff/design_handoff_xyracode_landing/README.md).

## Desarrollo

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # build de producción (typecheck incluido)
npm run lint     # ESLint
```

## Formulario de contacto (Resend)

El form de `#contacto` envía por **Resend** vía Server Action ([app/actions/contact.ts](app/actions/contact.ts)) y el lead llega a `CONTACT.email` (`contacto@xyracode.com`). Configuración:

1. Copiar `.env.example` a `.env.local`.
2. Crear cuenta en <https://resend.com> y una API key en <https://resend.com/api-keys> → `RESEND_API_KEY`.
3. Verificar el dominio `xyracode.com` en Resend (*Domains → Add domain*): agregar los registros DNS que muestra (SPF + DKIM) en Cloudflare. Una vez verificado, dejar `CONTACT_FROM=XyraCode Web <web@xyracode.com>`.

Sin verificar el dominio se puede probar con `CONTACT_FROM=onboarding@resend.dev` (Resend solo permite enviar al email de registro de la cuenta en ese modo). Sin `RESEND_API_KEY`, el form funciona igual en desarrollo: valida y loguea el lead en la consola del servidor. En producción (Vercel), cargar las mismas variables en *Project Settings → Environment Variables*.

**Agenda**: el botón "Agendar llamada" usa `CONTACT.calLink` de [lib/content.ts](lib/content.ts) — pegar ahí el link de Cal.com cuando exista la cuenta (mientras sea `null` cae al `mailto:`). Las URLs de redes del footer también viven en `SOCIALS` dentro de ese archivo.

## Estructura

- `app/` — layout (fuentes con `next/font`, metadata), página única, tokens de marca en `globals.css`, favicon (`icon.svg`).
- `components/ui/` — primitivos: `Eyebrow`, `Button`, `SectionHeading`, `Card`, `Reveal`.
- `components/sections/` — las 8 secciones de la landing en orden: Navbar → Hero → TrustStrip → Services → Process → Portfolio → Cta → Footer.
- `public/assets/` — logos de marca (copiados del handoff).

> ⚠️ Los proyectos de portfolio y las métricas del hero son **placeholders** — reemplazar con datos reales antes de publicar (handoff §9).
