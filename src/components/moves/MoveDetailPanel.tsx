import { TypeGlyph } from "@/components/pokemon/TypeGlyph";
import { MoveStatGrid } from "@/components/moves/MoveStatGrid";
import { typeFillInkClass } from "@/components/moves/typeInk";
import { TYPE_LABEL } from "@/lib/champions/types";
import type { MoveCategory } from "@/lib/champions/damage";
import type { TypeId } from "@/types/pokemon";

export type MoveDetailPanelProps = {
  name: string;
  type?: TypeId | null;
  category?: MoveCategory | null;
  power?: number | null;
  accuracy?: number | null;
  priority?: number | null;
  effect?: string | null;
  /** Ladder % footer, etc. */
  footnote?: string | null;
  range?: string | null;
  className?: string;
};

/**
 * Champions-inspired move detail glass — Category / Power / Accuracy + effect.
 */
export function MoveDetailPanel({
  name,
  type,
  category,
  power,
  accuracy,
  priority,
  effect,
  footnote,
  range,
  className = "",
}: MoveDetailPanelProps) {
  const ink = type ? typeFillInkClass(type) : "";
  const pri =
    priority != null && priority !== 0
      ? `Pri ${priority > 0 ? `+${priority}` : priority}`
      : null;

  return (
    <div
      className={`space-y-3 rounded-2xl border border-[var(--battle-panel-line)] bg-[var(--battle-panel)] p-3 text-left text-[var(--battle-panel-ink)] shadow-[var(--shadow)] ${className}`}
    >
      <div className="flex flex-wrap items-center gap-2">
        {type ? (
          <span
            className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold ${ink}`}
            style={{ background: `var(--type-${type})` }}
          >
            <TypeGlyph type={type} className="h-3 w-3" />
            {TYPE_LABEL[type]}
          </span>
        ) : null}
        <p className="text-sm font-semibold tracking-tight">{name}</p>
        {pri ? (
          <span className="font-mono text-[10px] text-[var(--battle-panel-muted)]">{pri}</span>
        ) : null}
      </div>

      <MoveStatGrid
        category={category}
        power={power}
        accuracy={accuracy}
        range={range}
      />

      <p className="text-sm leading-snug text-[var(--battle-panel-muted)]">
        {effect?.trim() || "No effect text synced for this move yet."}
      </p>

      {footnote ? (
        <p className="font-mono text-[10px] text-[var(--battle-panel-muted)]">{footnote}</p>
      ) : null}
    </div>
  );
}
