"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { getPokemon } from "@/lib/catalog/load";
import { PokemonArt } from "@/components/pokemon/PokemonArt";
import { easeOut, motionTokens } from "@/components/motion/tokens";
import type { ManualLineup } from "@/content/manuals";

export function ManualLineupBar({
  box,
  lineups,
  lineupId,
  onSelect,
}: {
  box: string[];
  lineups: ManualLineup[];
  lineupId: string;
  onSelect: (id: string) => void;
}) {
  const reduce = useReducedMotion();
  const active = lineups.find((l) => l.id === lineupId) ?? lineups[0];
  const activeSlugs = new Set(active?.slugs ?? []);
  const core = lineups[0];

  function pickForSlug(slug: string) {
    if (core && (core.slugs as string[]).includes(slug) && !lineups.slice(1).some((l) => (l.slugs as string[]).includes(slug))) {
      onSelect(core.id);
      return;
    }
    const hit = lineups.find((l) => (l.slugs as string[]).includes(slug) && l.id !== core?.id);
    if (hit) onSelect(hit.id);
    else if (core) onSelect(core.id);
  }

  return (
    <div className="mt-6 max-w-3xl">
      <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.14em] text-muted">Box · lineup</p>
      <ul className="mt-3 flex flex-wrap items-end gap-2">
        {box.map((slug) => {
          const mon = getPokemon(slug);
          const on = activeSlugs.has(slug);
          if (!mon) return null;
          return (
            <li key={slug}>
              <button
                type="button"
                onClick={() => pickForSlug(slug)}
                aria-pressed={on}
                title={on ? `${mon.name} · in` : `${mon.name} · bench`}
                className={`rounded-2xl border p-1.5 transition ${
                  on ? "border-ink/50 bg-white/10" : "border-transparent opacity-45 hover:opacity-80"
                }`}
              >
                <PokemonArt slug={mon.slug} src={mon.artwork} name={mon.name} size={48} />
              </button>
            </li>
          );
        })}
      </ul>

      <div className="mt-4 flex flex-wrap gap-2">
        {lineups.map((lineup) => {
          const on = lineup.id === active?.id;
          return (
            <button
              key={lineup.id}
              type="button"
              aria-pressed={on}
              onClick={() => onSelect(lineup.id)}
              className={`rounded-full border px-3 py-1.5 text-left text-sm transition ${
                on ? "border-ink bg-ink text-bg" : "border-line bg-raised text-muted hover:border-ink/40"
              }`}
            >
              <span className="font-medium">{lineup.label}</span>
              {on ? <span className={`mt-0.5 block text-[11px] ${on ? "text-bg/70" : ""}`}>{lineup.when}</span> : null}
            </button>
          );
        })}
      </div>

      <AnimatePresence mode="wait">
        {active ? (
          <motion.p
            key={active.id}
            initial={reduce ? false : { opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduce ? undefined : { opacity: 0, y: -4 }}
            transition={{ duration: motionTokens.state, ease: easeOut }}
            className="mt-3 max-w-[52ch] text-sm text-muted"
          >
            {active.identity}
          </motion.p>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
