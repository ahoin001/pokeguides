import type { ReactNode } from "react";
import {
  MoveCategoryIcon,
  moveCategoryLabel,
} from "@/components/moves/MoveCategoryIcon";
import type { MoveCategory } from "@/lib/champions/damage";

type MoveStatGridProps = {
  category?: MoveCategory | null;
  power?: number | null;
  /** Accuracy % when known; otherwise shown as —. */
  accuracy?: number | null;
  /** Optional full-width range strip (Singles / Doubles). */
  range?: string | null;
  className?: string;
};

function Cell({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <div className="flex min-w-0 flex-col items-center justify-center gap-1 border-[var(--battle-panel-line)] px-2 py-2.5 text-center first:border-l-0">
      <div className="flex min-h-7 items-center justify-center text-[var(--battle-panel-ink)]">
        {children}
      </div>
      <p className="font-mono text-[9px] uppercase tracking-[0.12em] text-[var(--battle-panel-muted)]">
        {label}
      </p>
    </div>
  );
}

/**
 * Battle-style Category · Power · Accuracy grid.
 */
export function MoveStatGrid({
  category,
  power,
  accuracy,
  range,
  className = "",
}: MoveStatGridProps) {
  const powerLabel =
    power != null && power > 0 ? String(power) : power === 0 ? "—" : "—";
  const accLabel = accuracy != null && accuracy > 0 ? String(accuracy) : "—";

  return (
    <div className={`overflow-hidden rounded-xl ${className}`}>
      <div className="grid grid-cols-3 divide-x divide-[var(--battle-panel-line)] border border-[var(--battle-panel-line)] bg-[color-mix(in_srgb,var(--battle-panel)_55%,transparent)]">
        <Cell label="Category">
          {category ? (
            <span className="flex flex-col items-center gap-0.5">
              <MoveCategoryIcon category={category} className="h-6 w-8 object-contain" />
              <span className="sr-only">{moveCategoryLabel(category)}</span>
            </span>
          ) : (
            <span className="font-mono text-sm text-[var(--battle-panel-muted)]">—</span>
          )}
        </Cell>
        <Cell label="Power">
          <span className="font-mono text-base font-semibold tabular-nums tracking-tight">
            {powerLabel}
          </span>
        </Cell>
        <Cell label="Accuracy">
          <span className="font-mono text-base font-semibold tabular-nums tracking-tight">
            {accLabel}
          </span>
        </Cell>
      </div>
      {range ? (
        <div className="border border-t-0 border-[var(--battle-panel-line)] bg-[color-mix(in_srgb,var(--battle-panel)_40%,transparent)] px-3 py-2 text-center">
          <p className="font-mono text-[9px] uppercase tracking-[0.12em] text-[var(--battle-panel-muted)]">
            Range
          </p>
          <p className="mt-0.5 text-sm font-medium text-[var(--battle-panel-ink)]">{range}</p>
        </div>
      ) : null}
    </div>
  );
}
