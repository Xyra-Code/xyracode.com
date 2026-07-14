// ---------- Hero ----------

export type Stat = { value: string; label: string };


export const STATS: Stat[] = [
  { value: "100%", label: "Código propio, sin plantillas" },
  { value: "1:1", label: "Comunicación directa con el dev" },
  { value: "48h", label: "Primera propuesta" },
];

// ---------- Trust strip ----------

export const STACK = [
  "React",
  "Next.js",
  "Node",
  "TypeScript",
  "Tailwind",
  "PostgreSQL",
] as const;

// ---------- Proceso ----------

export type Step = { title: string; desc: string };

export const STEPS: Step[] = [
  {
    title: "Descubrimiento",
    desc: "Entendemos tu negocio, objetivos y usuarios.",
  },
  { title: "Diseño", desc: "Prototipamos la solución y validamos contigo." },
  {
    title: "Desarrollo",
    desc: "Construimos con código limpio y entregas por sprint.",
  },
  { title: "Lanzamiento", desc: "Deploy, medición y soporte post-launch." },
];
