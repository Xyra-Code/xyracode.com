import { ArrowRight } from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";
import type { ReactNode } from "react";
import { Footer } from "@/components/sections/Footer";
import { Navbar } from "@/components/sections/Navbar";
import { WhatsAppIcon } from "@/components/ui/BrandIcons";
import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";
import {
  ABOUT_TERMINAL,
  CAREER_LOG,
  CONTACT,
  CREDENTIALS,
  FOUNDER,
  MANIFESTO,
  PERSONAL,
} from "@/lib/content";

export const metadata: Metadata = {
  title: { absolute: "Nosotros — El desarrollador detrás de XyraCode" },
  description:
    "XyraCode es una agencia unipersonal de desarrollo web en Villavicencio, Colombia. Más de 10 años entendiendo clientes antes de programar: trato directo, un solo responsable y código propio.",
  alternates: {
    canonical: "/nosotros",
  },
  openGraph: {
    url: "/nosotros",
    title: "Nosotros — El desarrollador detrás de XyraCode",
    description:
      "Agencia de desarrollo web en Villavicencio, Colombia. Más de 10 años entendiendo clientes antes de programar.",
  },
};

const SITE_URL = "https://xyracode.com";

// Person enlazada a la Organization del layout (mismo @id) para E-E-A-T:
// Google une "fundador" y "empresa" como entidades relacionadas.
const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Person",
      "@id": `${SITE_URL}/nosotros#person`,
      name: FOUNDER.name,
      jobTitle: "Fundador & desarrollador full-stack",
      url: `${SITE_URL}/nosotros`,
      ...(FOUNDER.photo && { image: `${SITE_URL}${FOUNDER.photo}` }),
      email: CONTACT.email,
      address: {
        "@type": "PostalAddress",
        addressLocality: "Villavicencio",
        addressRegion: "Meta",
        addressCountry: "CO",
      },
      worksFor: { "@id": `${SITE_URL}/#organization` },
      knowsAbout: ["React", "Next.js", "Node", "TypeScript", "PostgreSQL"],
      sameAs: [
        "https://github.com/YEENDJ",
        "https://github.com/Xyra-Code",
      ],
      alumniOf: [
        {
          "@type": "EducationalOrganization",
          name: "Henry",
          url: "https://www.soyhenry.com",
        },
        {
          "@type": "EducationalOrganization",
          name: "SENA",
          url: "https://www.sena.edu.co",
        },
      ],
      hasCredential: [
        {
          "@type": "EducationalOccupationalCredential",
          name: "Desarrollador Full-Stack",
          credentialCategory: "certificate",
          recognizedBy: { "@type": "EducationalOrganization", name: "Henry" },
          url: "https://certs.soyhenry.com/certificates/7e403f3b-af18-4064-872c-9b43356ff023/2ddfa6c9-e142-4b74-ae7c-74383b67df2c/certificate.pdf",
        },
        {
          "@type": "EducationalOccupationalCredential",
          name: "Técnico en Sistemas",
          credentialCategory: "certificate",
          recognizedBy: { "@type": "EducationalOrganization", name: "SENA" },
          url: `${SITE_URL}/assets/certificado-tecnico-sena.pdf`,
        },
      ],
    },
    {
      "@type": "ProfessionalService",
      "@id": `${SITE_URL}/#organization`,
      founder: { "@id": `${SITE_URL}/nosotros#person` },
    },
  ],
};

const whatsappHref = `https://wa.me/${CONTACT.whatsapp}?text=${encodeURIComponent(
  CONTACT.whatsappMessage,
)}`;

function TerminalCard({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="h-full overflow-hidden rounded-[20px] border border-[rgba(94,234,212,0.2)] bg-white/3">
      <div className="flex items-center gap-2.5 border-b border-[rgba(94,234,212,0.12)] px-6 py-4">
        <span aria-hidden className="h-3 w-3 rounded-full bg-[#D9734E]" />
        <span aria-hidden className="h-3 w-3 rounded-full bg-[#F29C50]" />
        <span aria-hidden className="h-3 w-3 rounded-full bg-brand-secondary" />
        <span className="ml-3 font-mono text-[13px] text-[rgba(226,247,242,0.5)]">
          {label}
        </span>
      </div>
      {children}
    </div>
  );
}

export default function Nosotros() {
  return (
    <>
      <Navbar />
      <main className="bg-night text-white">
        {/* Hero "whoami" */}
        <section
          aria-labelledby="nosotros-title"
          className="relative overflow-hidden px-6 pt-[90px] pb-25 md:px-16"
        >
          <div
            aria-hidden
            className="absolute -top-50 left-[30%] h-[700px] w-[700px] rounded-full bg-brand-primary opacity-30 blur-[150px]"
          />
          <Reveal className="relative mx-auto flex max-w-225 flex-col items-center gap-10 text-center">
            <div className="h-45 w-45 shrink-0 overflow-hidden rounded-full border-2 border-[rgba(94,234,212,0.4)] shadow-[0_30px_70px_-30px_rgba(16,185,129,0.5)]">
              {FOUNDER.photo ? (
                <Image
                  src={FOUNDER.photo}
                  alt={`Retrato de ${FOUNDER.name}, fundador de XyraCode`}
                  width={360}
                  height={360}
                  priority
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-white/4 font-mono text-[13px] text-white/40">
                  [tu foto]
                </div>
              )}
            </div>
            <div className="flex flex-col items-center gap-5">
              <p aria-hidden className="font-mono text-[15px] text-teal-300">
                $ whoami
              </p>
              <h1
                id="nosotros-title"
                className="max-w-205 text-[40px] leading-[1.02] font-extrabold tracking-[-0.03em] md:text-[62px]"
              >
                El desarrollador detrás de{" "}
                <Image
                  src="/assets/xyracode-wordmark-trim.png"
                  alt="XyraCode"
                  width={648}
                  height={58}
                  priority
                  className="inline-block h-[0.56em] w-auto align-baseline"
                />
              </h1>
            </div>
            <div className="grid w-full gap-6 text-left md:grid-cols-2">
              <TerminalCard label="whoami.txt">
                <p className="px-6 py-6 text-[17px] leading-[1.75] text-[rgba(226,247,242,0.7)] md:px-8 md:py-7">
                  Soy{" "}
                  <strong className="font-bold text-white">{FOUNDER.name}</strong>.
                  Antes de escribir código pasé más de 10 años del lado del
                  cliente,Vendiendo servicios de telecomunicaciones y desde 
                  aquí evidenciar la necesidad de que los clientes estén a la vanguardia.
                  <br />
                  <br />
                  XyraCode es una agencia que nace desde la necesidad de ayudar a los
                  emprendedores a llevar sus ideas al mercado.
                </p>
              </TerminalCard>
              <TerminalCard label="logout.log">
                <div className="flex flex-col gap-4 px-6 py-6 md:px-8 md:py-7">
                  {PERSONAL.paragraphs.map((p) => (
                    <p
                      key={p}
                      className="text-[17px] leading-[1.75] text-[rgba(226,247,242,0.7)]"
                    >
                      {p}
                    </p>
                  ))}
                </div>
              </TerminalCard>
            </div>
            <div className="flex flex-wrap justify-center gap-4">
              <Button href="/#contacto">
                Hablemos <ArrowRight size={20} aria-hidden />
              </Button>
              <Button href="/#portfolio" variant="ghost" className="border-white/22">
                Ver proyectos
              </Button>
            </div>
          </Reveal>
        </section>

        {/* Tarjeta terminal sobre-mi.sh */}
        <section aria-label="Sobre mí" className="px-6 pb-22 md:px-16">
          <Reveal delay={120} className="mx-auto max-w-160">
            <TerminalCard label="sobre-mi.sh">
              <dl className="px-6 py-7 font-mono text-[15px] leading-[2.2] text-emerald-200 md:px-10 md:py-8">
                {ABOUT_TERMINAL.map((line) => (
                  <div key={line.key} className="flex flex-wrap gap-x-2">
                    <dt className="text-teal-300">{line.key}:</dt>
                    <dd>{line.value}</dd>
                  </div>
                ))}
              </dl>
            </TerminalCard>
          </Reveal>
        </section>

        {/* Timeline "Mi historia" */}
        <section aria-labelledby="historia-title" className="px-6 pb-25 md:px-16">
          <div className="mx-auto flex max-w-205 flex-col gap-12">
            <Reveal>
              <p aria-hidden className="mb-3 font-mono text-[15px] text-teal-300">
                $ git log --reverse mi-carrera
              </p>
              <h2
                id="historia-title"
                className="text-[32px] leading-[1.05] font-extrabold tracking-[-0.03em] md:text-[40px]"
              >
                Mi historia
              </h2>
            </Reveal>
            <ol className="ml-1.5 flex flex-col gap-11 border-l border-[rgba(94,234,212,0.22)]">
              {CAREER_LOG.map((commit, i) => (
                <li key={commit.hash} className="relative pl-8 md:pl-12">
                  <span
                    aria-hidden
                    className="absolute top-1.5 -left-[7px] h-3.5 w-3.5 rounded-full border-2 border-teal-300 bg-night"
                  />
                  <Reveal delay={i * 90} className="flex flex-col gap-2.5">
                    <p className="font-mono text-[13px] text-[rgba(226,247,242,0.45)]">
                      <span aria-hidden className="text-teal-300">
                        {commit.hash}
                      </span>{" "}
                      <span className="text-emerald-200">{commit.tag}</span>
                      {commit.period && <span> · {commit.period}</span>}
                    </p>
                    <h3 className="text-[22px] font-extrabold tracking-[-0.02em] md:text-[26px]">
                      {commit.title}
                    </h3>
                    <p className="max-w-150 text-base leading-[1.7] text-[rgba(226,247,242,0.65)]">
                      {commit.desc}
                    </p>
                  </Reveal>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* Credenciales verificables */}
        <section
          aria-labelledby="credenciales-title"
          className="px-6 pb-25 md:px-16"
        >
          <div className="mx-auto flex max-w-225 flex-col gap-10">
            <Reveal>
              <p aria-hidden className="mb-3 font-mono text-[15px] text-teal-300">
                $ ls certificados/
              </p>
              <h2
                id="credenciales-title"
                className="text-[32px] leading-[1.05] font-extrabold tracking-[-0.03em] md:text-[40px]"
              >
                Credenciales verificables
              </h2>
            </Reveal>
            <div className="grid gap-6 md:grid-cols-2">
              {CREDENTIALS.map((cred, i) => (
                <Reveal
                  key={cred.title}
                  delay={i * 100}
                  className={`h-full ${cred.featured ? "md:col-span-2" : ""}`}
                >
                  <article className="flex h-full flex-col gap-4 rounded-[20px] border border-[rgba(94,234,212,0.2)] bg-white/3 p-7 md:p-9">
                    {cred.image && (
                      <div className="overflow-hidden rounded-xl border border-white/10">
                        <Image
                          src={cred.image}
                          alt={`Certificado: ${cred.title}${cred.issuer ? ` — ${cred.issuer}` : ""}`}
                          width={1400}
                          height={792}
                          className="h-auto w-full"
                        />
                      </div>
                    )}
                    <div className="flex flex-col gap-1.5">
                      <h3 className="text-[20px] font-extrabold tracking-[-0.02em]">
                        {cred.title}
                      </h3>
                      {cred.issuer && (
                        <p className="font-mono text-[13px] text-teal-300">
                          {cred.issuer}
                        </p>
                      )}
                    </div>
                    <p className="text-[15px] leading-[1.7] text-[rgba(226,247,242,0.65)]">
                      {/* Excepción al patrón content.ts: este párrafo lleva un link inline. */}
                      {cred.title === "Técnico en Sistemas" ? (
                        <>
                          La base: hardware, redes y sistemas por dentro antes
                          de escribir software. Título firmado digitalmente,
                          verificable en{" "}
                          <a
                            href="https://certificados.sena.edu.co"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-teal-300 underline underline-offset-4 transition-colors hover:text-teal-200"
                          >
                            certificados.sena.edu.co
                          </a>
                          .
                        </>
                      ) : (
                        cred.desc
                      )}
                    </p>
                    {cred.links && cred.links.length > 0 && (
                      <div className="mt-auto flex flex-wrap gap-3 pt-2">
                        {cred.links.map((link) => (
                          <Button
                            key={link.href}
                            href={link.href}
                            target="_blank"
                            variant="ghost"
                            className="border-white/22"
                          >
                            {link.label} <ArrowRight size={18} aria-hidden />
                          </Button>
                        ))}
                      </div>
                    )}
                  </article>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* Manifiesto "Cómo trabajo" */}
        <section
          aria-labelledby="como-trabajo-title"
          className="bg-brand-ink px-6 py-25 md:px-16"
        >
          <div className="mx-auto flex max-w-225 flex-col gap-14">
            <Reveal>
              <h2
                id="como-trabajo-title"
                className="text-xs font-extrabold tracking-[0.22em] text-teal-300 uppercase"
              >
                Cómo trabajo
              </h2>
            </Reveal>
            {MANIFESTO.map((item, i) => (
              <Reveal
                key={item.title}
                delay={i * 100}
                className="flex flex-col items-start gap-4 sm:flex-row sm:gap-10"
              >
                <span
                  aria-hidden
                  className="min-w-[110px] text-[56px] leading-none font-extrabold tracking-[-0.04em] text-[rgba(94,234,212,0.25)] md:text-[80px]"
                >
                  0{i + 1}
                </span>
                <div>
                  <h3 className="mb-2.5 text-[22px] font-extrabold tracking-[-0.02em] md:text-[26px]">
                    {item.title}
                  </h3>
                  <p className="max-w-140 text-base leading-[1.7] text-[rgba(226,247,242,0.65)]">
                    {item.desc}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </section>

        {/* CTA final */}
        <section
          aria-labelledby="nosotros-cta-title"
          className="relative overflow-hidden px-6 py-25 text-center md:px-16"
        >
          <div
            aria-hidden
            className="absolute top-1/2 left-1/2 h-[700px] w-[700px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand-primary opacity-25 blur-[150px]"
          />
          <Reveal className="relative flex flex-col items-center gap-6">
            <p aria-hidden className="font-mono text-[15px] text-teal-300">
              $ xyra start --tu-proyecto
            </p>
            <h2
              id="nosotros-cta-title"
              className="text-[32px] leading-[1.05] font-extrabold tracking-[-0.03em] md:text-[44px]"
            >
              ¿Trabajamos juntos?
            </h2>
            <Button href={whatsappHref} target="_blank" className="mt-2">
              <WhatsAppIcon /> Escríbeme por WhatsApp{" "}
              <ArrowRight size={20} aria-hidden />
            </Button>
            <p className="font-mono text-[13px] text-[rgba(226,247,242,0.45)]">
              {CONTACT.email} · {CONTACT.location}
            </p>
          </Reveal>
        </section>
      </main>
      <Footer />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </>
  );
}
