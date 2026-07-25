import type { Metadata } from "next";
import { Cta } from "@/components/sections/Cta";
import { Footer } from "@/components/sections/Footer";
import { Navbar } from "@/components/sections/Navbar";
import { WhatsAppIcon } from "@/components/ui/BrandIcons";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Reveal } from "@/components/ui/Reveal";
import { CONTACT } from "@/lib/content";
import { breadcrumbLd } from "@/lib/jsonld";
import { SEO } from "@/lib/seo";

export const metadata: Metadata = {
  title: { absolute: SEO.contacto.title },
  description: SEO.contacto.description,
  alternates: { canonical: "/contacto" },
  openGraph: {
    url: "/contacto",
    title: SEO.contacto.title,
    description: SEO.contacto.description,
  },
};

const SITE_URL = SEO.siteUrl;

const whatsappHref = `https://wa.me/${CONTACT.whatsapp}?text=${encodeURIComponent(
  CONTACT.whatsappMessage,
)}`;

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "ContactPage",
      "@id": `${SITE_URL}/contacto#webpage`,
      name: "Contacto",
      url: `${SITE_URL}/contacto`,
      isPartOf: { "@id": `${SITE_URL}/#website` },
      about: { "@id": `${SITE_URL}/#organization` },
      inLanguage: SEO.localeBcp47,
    },
    breadcrumbLd("/contacto", [{ name: "Contacto", path: "/contacto" }]),
  ],
};

/** Canal de contacto: etiqueta arriba, valor accionable abajo. */
function Canal({
  label,
  href,
  value,
  external = false,
  children,
}: {
  label: string;
  href?: string;
  value: string;
  external?: boolean;
  children?: React.ReactNode;
}) {
  return (
    <div className="rounded-[18px] border border-[rgba(94,234,212,0.18)] bg-white/3 px-6 py-5">
      <p className="mb-1.5 font-mono text-[12px] tracking-[0.14em] text-teal-300 uppercase">
        {label}
      </p>
      {href ? (
        <a
          href={href}
          {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
          className="inline-flex items-center gap-2 text-[17px] font-semibold text-white underline decoration-white/25 underline-offset-4 transition-colors duration-200 hover:text-teal-300 hover:decoration-teal-300"
        >
          {children}
          {value}
        </a>
      ) : (
        <p className="text-[17px] font-semibold text-white">{value}</p>
      )}
    </div>
  );
}

export default function ContactoPage() {
  return (
    <>
      <Navbar />
      <main className="bg-night text-white">
        <section
          aria-labelledby="contacto-page-title"
          className="px-6 pt-[72px] pb-14 md:px-16"
        >
          <Reveal className="mx-auto flex max-w-300 flex-col gap-4">
            <Breadcrumb
              items={[{ label: "Inicio", href: "/" }, { label: "Contacto" }]}
            />
            <Eyebrow as="p" className="text-teal-300">
              Contacto
            </Eyebrow>
            <h1
              id="contacto-page-title"
              className="text-[40px] leading-[1.05] font-extrabold tracking-[-0.03em] md:text-[52px]"
            >
              Hablemos de tu proyecto
            </h1>
            <p className="max-w-160 text-[19px] leading-[1.6] text-[rgba(226,247,242,0.72)]">
              Escríbenos por el canal que prefieras. Respondemos el mismo día
              hábil y, si el proyecto tiene sentido, te enviamos una propuesta
              con alcance, tiempos y precio en menos de 48 horas.
            </p>
            <p className="max-w-160 text-[16px] leading-[1.7] text-[rgba(226,247,242,0.6)]">
              Estamos en Villavicencio, Meta, y trabajamos con clientes de toda
              Colombia. Si estás en la ciudad podemos vernos en persona; si no,
              todo el proceso funciona igual de bien en remoto.
            </p>
          </Reveal>
        </section>

        {/* NAP en texto seleccionable: es lo que sostiene la coherencia con el
            perfil de Google Business y lo que un crawler puede leer. */}
        <section aria-label="Canales de contacto" className="px-6 pb-16 md:px-16">
          <Reveal className="mx-auto grid max-w-300 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Canal
              label="WhatsApp"
              href={whatsappHref}
              value="Escribir por WhatsApp"
              external
            >
              <WhatsAppIcon />
            </Canal>
            <Canal
              label="Teléfono"
              href={`tel:${CONTACT.phone}`}
              value={CONTACT.phoneDisplay}
            />
            <Canal
              label="Correo"
              href={`mailto:${CONTACT.email}`}
              value={CONTACT.email}
            />
            <Canal label="Dónde estamos" value={CONTACT.location} />
          </Reveal>
          <Reveal className="mx-auto mt-6 max-w-300">
            <p className="text-[15px] text-[rgba(226,247,242,0.55)]">
              Horario de atención: lunes a viernes, 8:00 a 12:00 y 2:00 a 6:00
              (hora de Colombia).
            </p>
          </Reveal>
        </section>

        <Cta />
      </main>
      <Footer />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </>
  );
}
