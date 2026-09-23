"use client";

import { useState } from "react";
import { getChampionsMove } from "@/lib/champions/move-data";
import { Popover } from "@/components/ui/Popover";
import { MoveChip, type MoveChipSize } from "@/components/moves/MoveChip";
import { MoveDetailPanel } from "@/components/moves/MoveDetailPanel";

function chipMeta(name: string) {
  const move = getChampionsMove(name);
  if (!move) return { move: undefined, meta: null as string | null };
  if (move.category === "status" || !move.basePower) {
    return { move, meta: move.category };
  }
  const pri =
    move.priority && move.priority !== 0
      ? ` · ${move.priority > 0 ? `+${move.priority}` : move.priority}`
      : "";
  return { move, meta: `${move.basePower}${pri}` };
}

/**
 * Shared manual / kit move row — always uses battle MoveChip styling when the
 * Champions move DB knows the name; plain chip fallback otherwise.
 */
export function MoveNoteRow({
  name,
  why,
  alts,
  size = "md",
  density = "comfortable",
}: {
  name: string;
  why?: string;
  alts?: { name: string; why?: string }[];
  size?: MoveChipSize;
  density?: "compact" | "comfortable";
}) {
  const compact = density === "compact";
  const { move, meta } = chipMeta(name);
  const [open, setOpen] = useState(false);

  return (
    <li
      className={
        compact
          ? "rounded-xl border border-line/50 bg-raised/20 px-2.5 py-2"
          : "border-t border-white/8 py-2.5 first:border-t-0 first:pt-0"
      }
    >
      <div className="flex flex-wrap items-center gap-2">
        <Popover
          open={open}
          onOpenChange={setOpen}
          align="start"
          role="dialog"
          variant="battle"
          widthClassName="w-[min(100vw-2rem,18.5rem)]"
          trigger={({ open: isOpen, toggle, triggerProps }) => (
            <MoveChip
              {...triggerProps}
              name={move?.name ?? name}
              type={move?.type}
              meta={meta}
              size={size}
              selected={isOpen}
              onClick={toggle}
              aria-label={`${name}${meta ? `, ${meta}` : ""}`}
              title={move?.shortEffect || name}
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
            footnote={move ? null : "Not in the Champions move DB yet."}
          />
        </Popover>
      </div>

      {why ? (
        <p
          className={`mt-1.5 leading-snug text-muted ${
            compact ? "text-[11px]" : "text-sm"
          }`}
        >
          {why}
        </p>
      ) : null}

      {alts
        ?.filter((a) => a.name)
        .map((alt) => {
          const altMeta = chipMeta(alt.name);
          return (
            <div key={alt.name} className={compact ? "mt-2" : "mt-2.5"}>
              <p className="mb-1 font-mono text-[9px] font-semibold uppercase tracking-[0.1em] text-muted">
                Swap
              </p>
              <MoveChip
                as="span"
                name={altMeta.move?.name ?? alt.name}
                type={altMeta.move?.type}
                meta={altMeta.meta}
                size="sm"
              />
              {alt.why ? (
                <p
                  className={`mt-1 leading-snug text-muted ${
                    compact ? "text-[11px]" : "text-sm"
                  }`}
                >
                  {alt.why}
                </p>
              ) : null}
            </div>
          );
        })}
    </li>
  );
}
