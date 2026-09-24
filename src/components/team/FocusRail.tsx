"use client";

import { useMemo } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Crosshair } from "@phosphor-icons/react";
import { cssVars } from "@/lib/champions/palette";
import { level50At0 } from "@/lib/champions/vs-stats";
import { slotJob } from "@/lib/champions/team-readout";
import { scorePokemon } from "@/lib/champions/role-score";
import { ROLE_LABEL } from "@/content/roles";
import { easeOut, motionTokens } from "@/components/motion/tokens";
import { ArchitectureProfileCard } from "@/components/architecture/ArchitectureProfileCard";
import { PokemonArt } from "@/components/pokemon/PokemonArt";
import { TypeBadge } from "@/components/pokemon/TypeBadge";
import { getPokemon } from "@/lib/catalog/lookup";
import { rankedPartnerCite, rankedPartnersFor } from "@/lib/ranked/partners";
import { SlotMoveEditor } from "@/components/team/SlotMoveEditor";
import type { ArchetypeId, CatalogEntry, Stats } from "@/types/pokemon";

const STAT_KEYS = [
  { key: "hp" as const, label: "HP" },
  { key: "atk" as const, label: "Atk" },
  { key: "def" as const, label: "Def" },
  { key: "spa" as const, label: "SpA" },
  { key: "spd" as const, label: "SpD" },
  { key: "spe" as const, label: "Spe" },
];

function barTone(value: number, max: number) {
  const r = value / max;
  if (r >= 0.85) return "bg-emerald-400/80";
  if (r >= 0.55) return "bg-amber-300/75";
  return "bg-rose-400/70";
}

export function FocusRail({
  mon,
  intent,
  moves = [],
  onMovesChange,
  onOpenScout,
  onChangeSlot,
  onSuggestPick,
  partySlugs = [],
}: {
  mon: CatalogEntry | null;
  intent: ArchetypeId | null;
  moves?: string[];
  onMovesChange?: (moves: string[]) => void;
  onOpenScout: () => void;
  onChangeSlot: () => void;
  /** Optional: tap a usual partner to add it to an empty bench slot. */
  onSuggestPick?: (slug: string) => void;
  /** Registered six for C-MAG / exclusivity overlays. */
  partySlugs?: string[];
}) {
  const roleScore = mon ? scorePokemon(mon) : null;
  const partners = useMemo(() => {
    if (!mon) return [];
    return rankedPartnersFor([mon.slug], 4)
      .map((p) => getPokemon(p.slug))
      .filter((p): p is CatalogEntry => Boolean(p));
  }, [mon]);

  return (
    <aside className="flex min-h-0 flex-col">
      <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-muted">Focus</p>
      <AnimatePresence mode="wait" initial={false}>
        {mon ? (
          <motion.div
            key={mon.slug}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 6 }}
            transition={{ duration: motionTokens.layout, ease: easeOut }}
            className="mt-3 flex flex-1 flex-col rounded-[24px] border border-line bg-raised/40 p-4"
            style={cssVars(mon.palette)}
          >
            <div className="flex items-start gap-3">
              <PokemonArt
                slug={mon.slug}
                src={mon.artwork}
                name={mon.name}
                share
                size={96}
                className="shrink-0"
              />
              <div className="min-w-0 flex-1">
                <h3 className="text-lg font-semibold tracking-tight">{mon.name}</h3>
                <div className="mt-1.5 flex flex-wrap gap-1">
                  {mon.types.map((t) => (
                    <TypeBadge key={t} type={t} size="sm" />
                  ))}
                </div>
                <p className="mt-2 text-xs text-muted">
                  {roleScore?.guessed ? "Guessed job: " : "Job: "}
                  {ROLE_LABEL[slotJob(mon, intent)]}
                </p>
              </div>
            </div>

            <StatBars stats={level50At0(mon.stats)} />

            {onMovesChange ? (
              <div className="mt-5 border-t border-line/70 pt-4">
                <SlotMoveEditor
                  slug={mon.slug}
                  moves={moves}
                  onChange={onMovesChange}
                  compact
                />
              </div>
            ) : null}

            {partners.length ? (
              <div className="mt-4">
                <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-muted">
                  Usually with · {rankedPartnerCite()}
                </p>
                <ul className="mt-2 flex flex-wrap gap-1.5">
                  {partners.map((p) => (
                    <li key={p.slug}>
                      {onSuggestPick ? (
                        <button
                          type="button"
                          onClick={() => onSuggestPick(p.slug)}
                          className="rounded-full bg-white/6 px-2.5 py-1 text-xs text-muted transition hover:bg-white/10 hover:text-ink"
                        >
                          {p.name}
                        </button>
                      ) : (
                        <span className="rounded-full bg-white/6 px-2.5 py-1 text-xs text-muted">
                          {p.name}
                        </span>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}

            <div className="mt-4">
              <ArchitectureProfileCard
                slug={mon.slug}
                partySlugs={partySlugs.length ? partySlugs : undefined}
                compact
              />
            </div>

            <div className="mt-auto flex flex-col gap-2 pt-5">
              <button
                type="button"
                onClick={onOpenScout}
                className="inline-flex items-center justify-center gap-2 rounded-full bg-ink px-4 py-2.5 text-sm font-medium text-bg"
              >
                <Crosshair size={16} weight="bold" />
                Open scout
              </button>
              <button
                type="button"
                onClick={onChangeSlot}
                className="rounded-full border border-line px-4 py-2 text-sm text-muted hover:bg-white/5"
              >
                Change Pokémon
              </button>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="empty"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="mt-3 flex flex-1 flex-col items-start justify-center rounded-[24px] border border-dashed border-line bg-white/[0.02] p-5"
          >
            <p className="text-sm font-medium">No slot focused</p>
            <p className="mt-2 max-w-[28ch] text-sm text-muted">
              Select a bench mon for Level 50 stats, or open an empty slot to pick.
            </p>
            <button
              type="button"
              onClick={onChangeSlot}
              className="mt-4 rounded-full bg-ink px-4 py-2 text-sm font-medium text-bg"
            >
              Add to bench
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </aside>
  );
}

function StatBars({ stats }: { stats: Stats }) {
  const values = STAT_KEYS.map(({ key }) => stats[key]);
  const max = Math.max(...values, 1);
  return (
    <div className="mt-5 space-y-2">
      <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-muted">
        Level 50 · 0 SP
      </p>
      {STAT_KEYS.map(({ key, label }) => {
        const v = stats[key];
        return (
          <div key={key} className="grid grid-cols-[2.25rem_2.5rem_1fr] items-center gap-2 text-xs">
            <span className="font-medium text-muted">{label}</span>
            <span className="font-mono tabular-nums text-ink">{v}</span>
            <span className="h-1.5 overflow-hidden rounded-full bg-white/8">
              <span
                className={`block h-full rounded-full ${barTone(v, max)}`}
                style={{ width: `${(v / max) * 100}%` }}
              />
            </span>
          </div>
        );
      })}
    </div>
  );
}
