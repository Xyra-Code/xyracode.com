import { ContactForm } from "@/components/sections/ContactForm";
import { ScheduleButton } from "@/components/sections/ScheduleButton";
import { WhatsAppIcon } from "@/components/ui/BrandIcons";
import { Button } from "@/components/ui/Button";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Reveal } from "@/components/ui/Reveal";
import { CONTACT } from "@/lib/content";

export function Cta() {
  return (
    <section
      id="contacto"
      aria-labelledby="contacto-title"
      className="relative overflow-hidden bg-[linear-gradient(150deg,#0F766E_0%,#0d5f56_100%)] px-5 py-22 text-white sm:px-10"
    >
      <div
        aria-hidden
        className="absolute -top-25 right-[10%] h-85 w-85 rounded-full bg-emerald-400 opacity-25 blur-[100px]"
      />
      <Reveal className="relative mx-auto grid max-w-300 items-start gap-12 md:grid-cols-2 md:gap-16">
        {/* Columna izquierda: mensaje + canales directos */}
        <div>
          <Eyebrow as="p" className="mb-4.5 text-teal-100">
            ¿Tienes un proyecto?
          </Eyebrow>
          <h2
            id="contacto-title"
            className="mb-5 text-[34px] leading-[1.05] font-extrabold tracking-[-0.03em] md:text-[46px]"
          >
            Construyamos algo que funcione
          </h2>
          <p className="mb-8 max-w-105 text-[17px] leading-[1.55] text-[rgba(236,253,245,0.85)]">
            Cuéntanos tu idea y te enviamos una propuesta en 48 horas. Completa el
            formulario o, si prefieres, escríbenos directo.
          </p>
          <div className="flex flex-wrap gap-3.5">
            <ScheduleButton />
            <Button
              href={`https://wa.me/${CONTACT.whatsapp}?text=${encodeURIComponent(CONTACT.whatsappMessage)}`}
              target="_blank"
              variant="ghost"
              className="border-white/40"
            >
              <WhatsAppIcon /> WhatsApp
            </Button>
          </div>
          <p className="mt-6 text-sm text-[rgba(236,253,245,0.7)]">
            O por correo a{" "}
            <a
              href={`mailto:${CONTACT.email}`}
              className="font-medium text-white underline decoration-white/40 underline-offset-4 transition-colors duration-200 hover:decoration-white"
            >
              {CONTACT.email}
            </a>
          </p>
        </div>

        {/* Columna derecha: formulario */}
        <ContactForm />
      </Reveal>
    </section>
  );
}
