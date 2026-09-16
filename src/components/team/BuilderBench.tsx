"use client";

import { motion } from "motion/react";
import { Plus, X } from "@phosphor-icons/react";
import { cssVars } from "@/lib/champions/palette";
import { slotJob } from "@/lib/champions/team-readout";
import { ROLE_LABEL } from "@/content/roles";
import { easeOut, motionTokens } from "@/components/motion/tokens";
import { PokemonArt } from "@/components/pokemon/PokemonArt";
import { TypeBadge } from "@/components/pokemon/TypeBadge";
import type { ArchetypeId, CatalogEntry } from "@/types/pokemon";

export function BuilderBench({
  mons,
  selectedIndex,
  intent,
  onSelect,
  onPickSlot,
  onClear,
}: {
  mons: (CatalogEntry | null)[];
  selectedIndex: number | null;
  intent: ArchetypeId | null;
  onSelect: (index: number) => void;
  onPickSlot: (index: number) => void;
  onClear: (index: number) => void;
}) {
  return (
    <aside className="flex flex-col gap-3">
      <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-muted">Bring three</p>
      <ul className="flex flex-col gap-3">
        {mons.map((p, i) => {
          const selected = selectedIndex === i;
          return (
            <motion.li
              key={i}
              layout
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: motionTokens.state, ease: easeOut, delay: i * 0.04 }}
            >
              {p ? (
                <div
                  className={`flex items-stretch gap-2 rounded-[22px] border p-2.5 transition-colors ${
                    selected
                      ? "border-ink/35 bg-[var(--mon-wash)] shadow-[0_12px_32px_rgba(0,0,0,0.22)]"
                      : "border-line bg-raised/35 hover:border-ink/20"
                  }`}
                  style={cssVars(p.palette)}
                >
                  <button
                    type="button"
                    onClick={() => onSelect(i)}
                    className="flex min-w-0 flex-1 items-center gap-3 text-left"
                  >
                    <PokemonArt
                      slug={p.slug}
                      src={p.artwork}
                      name={p.name}
                      share
                      size={64}
                      className="shrink-0"
                    />
                    <span className="min-w-0">
                      <span className="block truncate text-sm font-semibold tracking-tight">
                        {p.name}
                      </span>
                      <span className="mt-1 flex flex-wrap gap-1">
                        {p.types.map((t) => (
                          <TypeBadge key={t} type={t} size="sm" />
                        ))}
                      </span>
                      <span className="mt-1.5 block text-[11px] text-muted">
                        {ROLE_LABEL[slotJob(p, intent)]}
                      </span>
                    </span>
                  </button>
                  <div className="flex shrink-0 flex-col gap-1">
                    <button
                      type="button"
                      aria-label={`Change slot ${i + 1}`}
                      onClick={() => onPickSlot(i)}
                      className="rounded-full p-1.5 text-muted hover:bg-white/10 hover:text-ink"
                    >
                      <Plus size={14} weight="bold" />
                    </button>
                    <button
                      type="button"
                      aria-label={`Clear ${p.name}`}
                      onClick={() => onClear(i)}
                      className="rounded-full p-1.5 text-muted hover:bg-white/10 hover:text-ink"
                    >
                      <X size={14} weight="bold" />
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => onPickSlot(i)}
                  className={`flex min-h-[5.5rem] w-full items-center justify-center rounded-[22px] border border-dashed px-4 text-sm transition-colors ${
                    selected
                      ? "border-ink/40 bg-white/5 text-ink"
                      : "border-line text-muted hover:border-ink/25 hover:bg-white/[0.03]"
                  }`}
                >
                  Empty slot {i + 1}
                </button>
              )}
            </motion.li>
          );
        })}
      </ul>
    </aside>
  );
}
