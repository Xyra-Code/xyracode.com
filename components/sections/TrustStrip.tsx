import { Eyebrow } from "@/components/ui/Eyebrow";
import { STACK } from "@/lib/content";

export function TrustStrip() {
  return (
    <section
      aria-label="Stack tecnológico"
      className="border-t border-white/5 bg-night px-5 py-5.5 sm:px-10"
    >
      <ul className="mx-auto flex max-w-300 flex-wrap items-center justify-center gap-x-10 gap-y-3">
        <li>
          <Eyebrow size="sm" className="text-white/35">
            Stack
          </Eyebrow>
        </li>
        {STACK.map((tech) => (
          <li key={tech} className="text-[15px] font-bold text-white/55">
            {tech}
          </li>
        ))}
      </ul>
    </section>
  );
}
