"use client";

import { motion } from "motion/react";
import { cssVars } from "@/lib/champions/palette";
import { easeOut, motionTokens } from "@/components/motion/tokens";
import { PokemonArt } from "@/components/pokemon/PokemonArt";
import type { CatalogEntry } from "@/types/pokemon";

export function SpeedTier({
  team,
  selectedSlug,
  onSelectSlug,
}: {
  team: CatalogEntry[];
  selectedSlug: string | null;
  onSelectSlug: (slug: string) => void;
}) {
  if (!team.length) {
    return <p className="text-sm text-muted">Add Pokémon to see Spe tiers on the bench.</p>;
  }

  const sorted = [...team].sort((a, b) => b.speedAt32 - a.speedAt32);
  const max = Math.max(...sorted.map((m) => m.speedAt32), 1);

  return (
    <div>
      <p className="text-sm text-muted">
        Level 50 Spe · nature-neutral. Base is 0 SP; Max is 32 SP. Tap a row to focus that slot.
      </p>
      <ul className="mt-4 space-y-2.5">
        {sorted.map((m, i) => {
          const on = selectedSlug === m.slug;
          return (
            <motion.li
              key={m.slug}
              initial={{ opacity: 0, x: -6 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: motionTokens.state, ease: easeOut, delay: i * 0.04 }}
            >
              <button
                type="button"
                onClick={() => onSelectSlug(m.slug)}
                className={`flex w-full items-center gap-3 rounded-2xl border px-3 py-2.5 text-left transition-colors ${
                  on ? "border-ink/30 bg-[var(--mon-wash)]" : "border-line/70 bg-white/[0.03] hover:bg-white/[0.05]"
                }`}
                style={cssVars(m.palette)}
              >
                <span className="w-5 shrink-0 font-mono text-[11px] text-muted">{i + 1}</span>
                <PokemonArt
                  slug={m.slug}
                  src={m.sprite || m.artwork}
                  name={m.name}
                  share
                  size={40}
                  className="shrink-0"
                />
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-semibold tracking-tight">{m.name}</span>
                  <span className="mt-1.5 block h-1.5 overflow-hidden rounded-full bg-white/8">
                    <span
                      className="block h-full rounded-full"
                      style={{
                        width: `${(m.speedAt32 / max) * 100}%`,
                        background: "var(--mon-vibrant)",
                      }}
                    />
                  </span>
                </span>
                <span className="shrink-0 text-right font-mono text-xs tabular-nums">
                  <span className="block text-ink">{m.speedAt32}</span>
                  <span className="text-muted">{m.speedAt0} base</span>
                </span>
              </button>
            </motion.li>
          );
        })}
      </ul>
    </div>
  );
}
