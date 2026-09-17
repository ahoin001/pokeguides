import type { ReactNode } from "react";
import { MANUAL_SCROLL_MT } from "@/components/manuals/ManualToc";

/** Chapter break for manual reading — stronger than nested cards. */
export function ManualSection({
  id,
  title,
  purpose,
  children,
  className = "",
  actions,
}: {
  id: string;
  title: string;
  purpose?: string;
  children: ReactNode;
  className?: string;
  actions?: ReactNode;
}) {
  return (
    <section
      id={id}
      className={`mt-14 border-t border-line/80 pt-10 first:mt-10 first:border-t-0 first:pt-0 ${MANUAL_SCROLL_MT} ${className}`}
    >
      <header className="flex max-w-3xl flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight md:text-3xl">{title}</h2>
          {purpose ? <p className="mt-2 max-w-[52ch] text-sm text-muted">{purpose}</p> : null}
        </div>
        {actions ? <div className="shrink-0">{actions}</div> : null}
      </header>
      <div className="mt-6">{children}</div>
    </section>
  );
}

/** In-section jump pills (Lead / Mid / Late under Game). */
export function ManualSubnav({
  items,
}: {
  items: { href: string; label: string }[];
}) {
  if (!items.length) return null;
  return (
    <nav aria-label="In this chapter" className="mb-6">
      <ul className="flex flex-wrap gap-1.5">
        {items.map((item) => (
          <li key={item.href}>
            <a
              href={item.href}
              className="inline-flex min-h-8 items-center rounded-full border border-line/80 bg-raised/40 px-3 text-xs font-medium text-muted transition hover:border-ink/40 hover:text-ink"
            >
              {item.label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
