import type { ReactNode } from "react";

type CardProps = {
  /** Lift al hover: translateY(-3px) + sombra fría (handoff §5). */
  hoverLift?: boolean;
  className?: string;
  children: ReactNode;
};

/** Superficie blanca: radio 16px, borde fino frío (handoff §4.4/§4.5). */
export function Card({ hoverLift = false, className = "", children }: CardProps) {
  return (
    <div
      className={`rounded-2xl border border-[rgba(15,23,42,0.06)] bg-white ${
        hoverLift
          ? "transition-all duration-[220ms] ease-out hover:-translate-y-[3px] hover:shadow-[0_22px_44px_-26px_rgba(11,31,28,0.38)]"
          : ""
      } ${className}`}
    >
      {children}
    </div>
  );
}
