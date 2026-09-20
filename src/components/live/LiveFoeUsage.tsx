"use client";

import { useState } from "react";
import { getRankedBySlug } from "@/lib/ranked/load";
import { formatPct } from "@/lib/ranked/format";
import { getChampionsMove } from "@/lib/champions/move-data";
import { getItemBlurb } from "@/lib/champions/item-data";
import { Popover } from "@/components/ui/Popover";
import { MoveChip } from "@/components/moves/MoveChip";
import { MoveDetailPanel } from "@/components/moves/MoveDetailPanel";

/**
 * Compact ladder moves + items for the active foe — sits under THEM type strips.
 */
export function LiveFoeUsage({
  foeSlug,
  align = "end",
}: {
  foeSlug: string;
  /** Desktop THEM column is right-aligned; mobile uses start. */
  align?: "start" | "end";
}) {
  const ranked = getRankedBySlug(foeSlug);
  if (!ranked) return null;

  const moves = ranked.moves.slice(0, 12);
  const items = ranked.items.length
    ? ranked.items.slice(0, 4)
    : ranked.item
      ? [ranked.item]
      : [];

  if (!moves.length && !items.length) return null;

  const end = align === "end";

  return (
    <div className={`mt-4 min-w-0 space-y-3 border-t border-line/50 pt-3 ${end ? "md:text-right" : ""}`}>
      {moves.length ? (
        <div className="min-w-0">
          <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.12em] text-muted">
            Common moves
          </p>
          <ul className={`mt-1.5 flex flex-wrap gap-1.5 ${end ? "md:justify-end" : ""}`}>
            {moves.map((m) => (
              <li key={m.name} className="max-w-full">
                <MoveUsageChip name={m.name} pct={m.pct} align={align} />
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      {items.length ? (
        <div className="min-w-0">
          <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.12em] text-muted">
            Common items
          </p>
          <ul className={`mt-1.5 flex flex-wrap gap-1.5 ${end ? "md:justify-end" : ""}`}>
            {items.map((item) => (
              <li key={item.name} className="max-w-full">
                <ItemUsageChip name={item.name} pct={item.pct} align={align} />
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </div>
  );
}

function MoveUsageChip({
  name,
  pct,
  align,
}: {
  name: string;
  pct?: number;
  align: "start" | "end";
}) {
  const [open, setOpen] = useState(false);
  const move = getChampionsMove(name);
  const pctLabel = formatPct(pct);

  return (
    <Popover
      open={open}
      onOpenChange={setOpen}
      align={align}
      role="dialog"
      variant="battle"
      widthClassName="w-[min(100vw-2rem,18.5rem)]"
      trigger={({ open: isOpen, toggle, triggerProps }) => (
        <MoveChip
          {...triggerProps}
          name={name}
          type={move?.type}
          meta={pctLabel}
          selected={isOpen}
          aria-label={`${name}${pctLabel ? `, ${pctLabel}` : ""}`}
          onClick={toggle}
        />
      )}
    >
      <MoveDetailPanel
        name={move?.name ?? name}
        type={move?.type}
        category={move?.category}
        power={move?.basePower}
        priority={move?.priority}
        effect={move?.shortEffect}
        footnote={pctLabel ? `Ladder · ${pctLabel}` : null}
      />
    </Popover>
  );
}

function ItemUsageChip({
  name,
  pct,
  align,
}: {
  name: string;
  pct?: number;
  align: "start" | "end";
}) {
  const [open, setOpen] = useState(false);
  const blurb = getItemBlurb(name);
  const pctLabel = formatPct(pct);

  return (
    <Popover
      open={open}
      onOpenChange={setOpen}
      align={align}
      role="dialog"
      widthClassName="w-[min(100vw-2rem,18rem)]"
      trigger={({ toggle, triggerProps }) => (
        <button
          type="button"
          {...triggerProps}
          aria-label={`${name}${pctLabel ? `, ${pctLabel}` : ""}`}
          onClick={toggle}
          className="inline-flex max-w-full items-center gap-1 rounded-full border border-line/70 bg-raised/45 px-2 py-1 text-[11px] font-medium transition hover:border-ink/35"
        >
          <span className="truncate">{name}</span>
          {pctLabel ? (
            <span className="shrink-0 font-mono text-[9px] tabular-nums text-muted">{pctLabel}</span>
          ) : null}
        </button>
      )}
    >
      <div className="space-y-2 p-1 text-left">
        <div className="flex flex-wrap items-baseline gap-2">
          <p className="text-sm font-semibold tracking-tight">{blurb?.name ?? name}</p>
          {blurb?.tag ? (
            <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-muted">
              {blurb.tag}
            </span>
          ) : null}
        </div>
        <p className="text-sm leading-snug text-muted">
          {blurb?.body ?? "Common ladder hold — open the Items lesson for the full Does · When · Answer."}
        </p>
        {pctLabel ? (
          <p className="font-mono text-[10px] text-muted">Ladder · {pctLabel}</p>
        ) : null}
      </div>
    </Popover>
  );
}
