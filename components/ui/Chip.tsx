import type { ReactNode } from "react";

/** Pill mono/teal para tags y chips de stack (handoff §Chip, radio 8px). */
export function Chip({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <span
      className={`inline-flex items-center rounded-lg bg-[rgba(94,234,212,0.12)] px-2.5 py-1 font-mono text-[12px] text-teal-300 ${className}`}
    >
      {children}
    </span>
  );
}
