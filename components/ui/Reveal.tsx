"use client";

import { useEffect, useRef, type ReactNode } from "react";

type RevealProps = {
  /** Retraso de entrada en ms, para escalonar tarjetas. */
  delay?: number;
  className?: string;
  children: ReactNode;
};

/**
 * Fade-in + slide-up (20px) al entrar en viewport (handoff §5).
 * `prefers-reduced-motion` se respeta vía CSS (.reveal en globals.css).
 */
export function Reveal({ delay = 0, className = "", children }: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add("is-visible");
          observer.disconnect();
        }
      },
      { rootMargin: "0px 0px -40px 0px" },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`reveal ${className}`}
      style={delay ? { transitionDelay: `${delay}ms` } : undefined}
    >
      {children}
    </div>
  );
}
