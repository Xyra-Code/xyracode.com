"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

type ProjectCarouselProps = {
  images: string[];
  className?: string;
};

const INTERVAL_MS = 3200;
const FADE_MS = 700;

/**
 * Carrete de capturas con auto-fade, sin controles: así toda la card puede
 * seguir siendo un único enlace (sin botones anidados dentro del <a>).
 * Con una sola imagen se muestra fija. Respeta `prefers-reduced-motion`:
 * si el usuario prefiere menos animación, no cicla (deja la primera).
 */
export function ProjectCarousel({ images, className = "" }: ProjectCarouselProps) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (images.length <= 1) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (reduced.matches) return;

    const id = window.setInterval(() => {
      setIndex((i) => (i + 1) % images.length);
    }, INTERVAL_MS);
    return () => window.clearInterval(id);
  }, [images.length]);

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {images.map((src, i) => (
        <Image
          key={src}
          src={src}
          alt=""
          fill
          sizes="(min-width: 768px) 33vw, 100vw"
          className="object-cover object-top transition-opacity ease-out"
          style={{
            opacity: i === index ? 1 : 0,
            transitionDuration: `${FADE_MS}ms`,
          }}
          // La primera es la visible inicialmente; conviene priorizarla.
          priority={i === 0}
        />
      ))}
    </div>
  );
}
