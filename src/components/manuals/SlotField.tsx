import type { ReactNode } from "react";

export const SLOT_GRID = "grid grid-cols-[5rem_minmax(0,1fr)] items-start gap-x-2.5";

/** Shared label rail so Type / Weak / Ability / Item line up across a slot card. */
export function SlotField({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <div className={SLOT_GRID}>
      <p
        className="pt-1 font-mono text-[10px] font-medium uppercase tracking-[0.12em] text-muted"
        aria-hidden={!label}
      >
        {label || "\u00a0"}
      </p>
      <div className="min-w-0">{children}</div>
    </div>
  );
}

export function SlotSection({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="border-t border-line/70 pt-4">
      <h3 className="font-mono text-[10px] font-semibold uppercase tracking-[0.14em] text-muted">{title}</h3>
      <div className="mt-2.5 space-y-3">{children}</div>
    </section>
  );
}
