import Link from "next/link";

export type Crumb = { label: string; href?: string };

/** Migas de pan mono/teal. El último item (sin href) es la página actual. */
export function Breadcrumb({ items }: { items: Crumb[] }) {
  return (
    <nav
      aria-label="Migas de pan"
      className="font-mono text-[13px] text-[rgba(226,247,242,0.5)]"
    >
      <ol className="flex flex-wrap items-center gap-2">
        {items.map((item, i) => (
          <li key={item.label} className="flex items-center gap-2">
            {item.href ? (
              <Link
                href={item.href}
                className="transition-colors hover:text-teal-300 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-teal-300"
              >
                {item.label}
              </Link>
            ) : (
              <span aria-current="page" className="text-teal-300">
                {item.label}
              </span>
            )}
            {i < items.length - 1 && <span aria-hidden>/</span>}
          </li>
        ))}
      </ol>
    </nav>
  );
}
