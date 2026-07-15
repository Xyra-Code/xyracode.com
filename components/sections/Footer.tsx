import Image from "next/image";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { FOOTER_COLUMNS, SOCIALS, UI } from "@/lib/content";

export function Footer() {
  return (
    <footer className="bg-night-footer px-5 pt-13 pb-8.5 text-white/60 sm:px-10">
      <div className="mx-auto max-w-300">
        <div className="flex flex-wrap justify-between gap-8 border-b border-white/8 pb-8.5">
          <div className="max-w-70">
            <Image
              src="/assets/brand/mark.png"
              alt=""
              width={51}
              height={30}
              className="mb-4 h-7.5 w-auto"
            />
            <p className="text-[13px] leading-[1.6] text-white/50">
              {UI.footer.tagline}
            </p>
            <ul className="mt-4 flex gap-4">
              {SOCIALS.map((social) => (
                <li key={social.label}>
                  <a
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.label}
                    className="text-white/50 transition-colors duration-200 hover:text-teal-300 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-teal-300"
                  >
                    <social.icon size={20} />
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div className="flex flex-wrap gap-14">
            {FOOTER_COLUMNS.map((column) => (
              <div key={column.title}>
                <Eyebrow as="p" size="sm" className="mb-3.5 text-white/40">
                  {column.title}
                </Eyebrow>
                <ul className="flex flex-col gap-2.5 text-[13px]">
                  {column.items.map((item) => (
                    <li key={item.label}>
                      {item.href ? (
                        <a
                          href={item.href}
                          {...(item.external
                            ? { target: "_blank", rel: "noopener noreferrer" }
                            : {})}
                          className="transition-colors duration-200 hover:text-teal-300 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-teal-300"
                        >
                          {item.label}
                        </a>
                      ) : (
                        item.label
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
        <div className="flex flex-wrap justify-between gap-2.5 pt-5.5 text-xs text-white/40">
          <span>{UI.footer.copyright}</span>
          <span className="font-mono">{UI.footer.madeWith}</span>
        </div>
      </div>
    </footer>
  );
}
