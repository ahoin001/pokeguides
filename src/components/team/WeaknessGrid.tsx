"use client";

import { AnimatePresence, motion } from "motion/react";
import { TYPE_LABEL } from "@/lib/champions/types";
import {
  teamWeaknessGrid,
  weaknessTileLabel,
  type WeaknessTile,
} from "@/lib/champions/team-weakness-grid";
import { easeOut, motionTokens } from "@/components/motion/tokens";
import { TypeIcon } from "@/components/pokemon/TypeIcon";
import type { CatalogEntry } from "@/types/pokemon";

const TONE: Record<WeaknessTile["tone"], string> = {
  "weak-many": "border-rose-400/35 bg-rose-500/15",
  "weak-some": "border-amber-400/30 bg-amber-500/12",
  immune: "border-sky-400/30 bg-sky-500/12",
  neutral: "border-line/70 bg-white/[0.03]",
};

export function WeaknessGrid({
  team,
  selectedType,
  onSelectType,
}: {
  team: CatalogEntry[];
  selectedType: WeaknessTile["type"] | null;
  onSelectType: (type: WeaknessTile["type"] | null) => void;
}) {
  if (!team.length) {
    return <p className="text-sm text-muted">Fill the bench to see type holes.</p>;
  }

  const tiles = teamWeaknessGrid(team);
  const open = selectedType ? tiles.find((t) => t.type === selectedType) : null;

  return (
    <div>
      <p className="text-sm text-muted">
        How many of your three are weak to each attack type. Tap a tile for who sits it.
      </p>
      <div className="mt-4 grid grid-cols-3 gap-2 sm:grid-cols-6 lg:grid-cols-9">
        {tiles.map((tile) => {
          const on = selectedType === tile.type;
          return (
            <button
              key={tile.type}
              type="button"
              title={weaknessTileLabel(tile)}
              aria-label={weaknessTileLabel(tile)}
              aria-pressed={on}
              onClick={() => onSelectType(on ? null : tile.type)}
              className={`flex flex-col items-center gap-1.5 rounded-2xl border px-1.5 py-2.5 transition-colors ${
                TONE[tile.tone]
              } ${on ? "ring-2 ring-ink/40" : ""}`}
            >
              <TypeIcon type={tile.type} size="sm" />
              <span className="text-[10px] font-medium tracking-tight text-ink/90">
                {TYPE_LABEL[tile.type]}
              </span>
              <span className="font-mono text-xs tabular-nums text-muted">
                {tile.weakCount ? tile.weakCount : "—"}
              </span>
            </button>
          );
        })}
      </div>

      <ul className="mt-4 flex flex-wrap gap-x-4 gap-y-1.5 text-[11px] text-muted">
        <li className="inline-flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-sm bg-rose-500/50" /> 3+ weak
        </li>
        <li className="inline-flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-sm bg-amber-500/45" /> 1–2 weak
        </li>
        <li className="inline-flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-sm bg-sky-500/45" /> Has immunity
        </li>
        <li className="inline-flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-sm bg-white/15" /> Neutral
        </li>
      </ul>

      <AnimatePresence initial={false}>
        {open ? (
          <motion.div
            key={open.type}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: motionTokens.state, ease: easeOut }}
            className="overflow-hidden"
          >
            <div className="mt-4 rounded-2xl border border-line bg-bg/50 p-3">
              <p className="text-sm font-medium">
                {TYPE_LABEL[open.type]}
                {open.worst >= 4 ? (
                  <span className="ml-2 font-mono text-xs text-rose-300">incl. 4×</span>
                ) : null}
              </p>
              <div className="mt-2 flex flex-wrap gap-2">
                {open.weak.map((w) => (
                  <span
                    key={`w-${w.slug}`}
                    className="rounded-full bg-rose-500/20 px-2.5 py-1 text-xs text-rose-100"
                  >
                    {w.name} · {w.mult}×
                  </span>
                ))}
                {open.resist.map((r) => (
                  <span
                    key={`r-${r.slug}`}
                    className="rounded-full bg-white/8 px-2.5 py-1 text-xs text-muted"
                  >
                    {r.name} resists · {r.mult}×
                  </span>
                ))}
                {open.immune.map((m) => (
                  <span
                    key={`i-${m.slug}`}
                    className="rounded-full bg-sky-500/20 px-2.5 py-1 text-xs text-sky-100"
                  >
                    {m.name} immune
                  </span>
                ))}
                {!open.weak.length && !open.resist.length && !open.immune.length ? (
                  <span className="text-xs text-muted">Everyone takes neutral.</span>
                ) : null}
              </div>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
