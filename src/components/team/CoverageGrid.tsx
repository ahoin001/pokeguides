"use client";

import { AnimatePresence, motion } from "motion/react";
import { TYPE_LABEL } from "@/lib/champions/types";
import {
  coverageTileLabel,
  teamCoverageGrid,
  type CoverageTile,
} from "@/lib/champions/team-coverage-grid";
import { easeOut, motionTokens } from "@/components/motion/tokens";
import { TypeIcon } from "@/components/pokemon/TypeIcon";
import type { CatalogEntry, TypeId } from "@/types/pokemon";

const TONE: Record<CoverageTile["tone"], string> = {
  "cover-many": "border-emerald-400/35 bg-emerald-500/15",
  "cover-some": "border-lime-400/30 bg-lime-500/12",
  soft: "border-amber-400/25 bg-amber-500/10",
  none: "border-line/70 bg-white/[0.03]",
};

export function CoverageGrid({
  team,
  selectedType,
  onSelectType,
}: {
  team: CatalogEntry[];
  selectedType: TypeId | null;
  onSelectType: (type: TypeId | null) => void;
}) {
  if (!team.length) {
    return <p className="text-sm text-muted">Fill the bench to see what you hit hard.</p>;
  }

  const tiles = teamCoverageGrid(team);
  const open = selectedType ? tiles.find((t) => t.type === selectedType) : null;

  return (
    <div>
      <p className="text-sm text-muted">
        How many of your three hit each type super-effectively with STAB. Tap a tile for who covers it.
      </p>
      <div className="mt-4 grid grid-cols-3 gap-2 sm:grid-cols-6 lg:grid-cols-9">
        {tiles.map((tile) => {
          const on = selectedType === tile.type;
          return (
            <button
              key={tile.type}
              type="button"
              title={coverageTileLabel(tile)}
              aria-label={coverageTileLabel(tile)}
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
                {tile.hitCount ? tile.hitCount : "—"}
              </span>
            </button>
          );
        })}
      </div>

      <ul className="mt-4 flex flex-wrap gap-x-4 gap-y-1.5 text-[11px] text-muted">
        <li className="inline-flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-sm bg-emerald-500/50" /> 2–3 cover
        </li>
        <li className="inline-flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-sm bg-lime-500/45" /> 1 covers
        </li>
        <li className="inline-flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-sm bg-amber-500/40" /> Resisted
        </li>
        <li className="inline-flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-sm bg-white/15" /> No STAB SE
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
                Into {TYPE_LABEL[open.type]}
                {open.best >= 4 ? (
                  <span className="ml-2 font-mono text-xs text-emerald-300">incl. 4×</span>
                ) : null}
              </p>
              <div className="mt-2 flex flex-wrap gap-2">
                {open.hits.map((h) => (
                  <span
                    key={`h-${h.slug}-${h.stab}`}
                    className="rounded-full bg-emerald-500/20 px-2.5 py-1 text-xs text-emerald-100"
                  >
                    {h.name} · {TYPE_LABEL[h.stab]} {h.mult}×
                  </span>
                ))}
                {!open.hits.length ? (
                  <span className="text-xs text-muted">
                    Nobody on the bench hits this type super-effectively with STAB.
                  </span>
                ) : null}
              </div>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
