"use client";

import { useEffect, useMemo, useState } from "react";
import { MagnifyingGlass, X } from "@phosphor-icons/react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { ensureSearchRoster, searchLegal, pokemonFromSearch } from "@/lib/catalog/client-search";
import { getPokemon } from "@/lib/catalog/lookup";
import { cssVars } from "@/lib/champions/palette";
import { PokemonArt } from "@/components/pokemon/PokemonArt";
import { MAX_FOES, useLiveMatchStore } from "@/stores/live-match";
import { LiveSideShell } from "@/components/live/LiveSideShell";
import { LiveRecentStrip } from "@/components/live/LiveRecentStrip";
import { easeOut, motionTokens } from "@/components/motion/tokens";

export function LiveFoeSearch({ exclude }: { exclude: string[] }) {
  const foes = useLiveMatchStore((s) => s.foes);
  const recent = useLiveMatchStore((s) => s.recent);
  const activeFoeSlug = useLiveMatchStore((s) => s.activeFoeSlug);
  const addFoe = useLiveMatchStore((s) => s.addFoe);
  const removeFoe = useLiveMatchStore((s) => s.removeFoe);
  const selectFoe = useLiveMatchStore((s) => s.selectFoe);
  const clearFoes = useLiveMatchStore((s) => s.clearFoes);
  const reduce = useReducedMotion();

  const highlighted =
    activeFoeSlug && foes.includes(activeFoeSlug)
      ? activeFoeSlug
      : foes[0] ?? null;

  const [q, setQ] = useState("");
  const [ready, setReady] = useState(false);

  useEffect(() => {
    void ensureSearchRoster().then(() => setReady(true));
  }, []);

  const hits = useMemo(() => {
    if (!ready || !q.trim()) return [];
    return searchLegal(q)
      .filter((p) => !exclude.includes(p.slug))
      .slice(0, 8);
  }, [q, ready, exclude]);

  return (
    <LiveSideShell
      eyebrow="Their six"
      title={`Log as revealed · ${foes.length}/${MAX_FOES}`}
      lede="Search as they preview or reveal. Tap one for the duel."
      action={
        foes.length ? (
          <button
            type="button"
            onClick={() => clearFoes()}
            className="text-xs text-muted underline hover:text-ink"
          >
            Clear
          </button>
        ) : (
          <span className="text-xs text-transparent select-none" aria-hidden>
            Clear
          </span>
        )
      }
      tools={<span className="text-xs text-muted">One-tap the same meta names below</span>}
      search={
        <div className="relative">
          <MagnifyingGlass
            size={16}
            className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-muted"
          />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder={ready ? "Search opponent…" : "Loading roster…"}
            disabled={!ready}
            className="w-full rounded-2xl border border-line bg-sunken py-3 pl-10 pr-4 text-sm"
          />
          <AnimatePresence>
            {hits.length ? (
              <motion.ul
                key="hits"
                initial={reduce ? false : { opacity: 0, y: -4, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={reduce ? undefined : { opacity: 0, y: -4, scale: 0.98 }}
                transition={{ duration: motionTokens.state, ease: easeOut }}
                className="absolute inset-x-0 top-[calc(100%+0.35rem)] z-20 origin-top flex flex-wrap gap-2 rounded-2xl border border-line bg-bg p-2 shadow-[0_16px_40px_rgba(0,0,0,0.45)]"
              >
                {hits.map((p) => (
                  <li key={p.slug}>
                    <button
                      type="button"
                      onClick={() => {
                        addFoe(p.slug);
                        setQ("");
                      }}
                      className="inline-flex items-center gap-2 rounded-full border border-line bg-raised/50 py-1 pl-1 pr-3 text-sm transition hover:border-ink/40 active:scale-[0.98]"
                      style={cssVars(p.palette)}
                    >
                      <PokemonArt slug={p.slug} src={p.sprite || p.artwork} name={p.name} size={28} />
                      {p.name}
                    </button>
                  </li>
                ))}
              </motion.ul>
            ) : null}
          </AnimatePresence>
        </div>
      }
      recents={
        <LiveRecentStrip
          slugs={recent}
          exclude={[...exclude, ...foes]}
          onPick={addFoe}
          emptyHint="Log a few foes — they stick here for the next game."
        />
      }
      slots={
        <ul className="grid grid-cols-3 gap-2 sm:grid-cols-6">
          {Array.from({ length: MAX_FOES }, (_, i) => {
            const slug = foes[i];
            const p = slug ? getPokemon(slug) ?? pokemonFromSearch(slug) : undefined;
            if (!p || !slug) {
              return (
                <li key={`empty-foe-${i}`} className="flex flex-col gap-1.5">
                  <div className="flex min-h-[5.75rem] flex-col items-center justify-center rounded-2xl border border-dashed border-line/80 bg-bg/20 px-2 py-3 text-center">
                    <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-muted">
                      Slot {i + 1}
                    </span>
                    <span className="mt-1 text-xs text-muted">Search</span>
                  </div>
                  <div className="min-h-[1.35rem]" aria-hidden />
                </li>
              );
            }
            const on = highlighted === slug;
            return (
              <li key={slug} className="flex flex-col gap-1.5">
                <div
                  className={`relative flex min-h-[5.75rem] flex-col items-center justify-center gap-1.5 rounded-2xl border px-1.5 py-2.5 transition ${
                    on
                      ? "border-ink/40 bg-white/10"
                      : "border-[color-mix(in_srgb,var(--mon-vibrant)_45%,transparent)] bg-[color-mix(in_srgb,var(--mon-wash)_18%,transparent)]"
                  }`}
                  style={cssVars(p.palette)}
                >
                  <button
                    type="button"
                    onClick={() => selectFoe(slug)}
                    className="flex w-full flex-col items-center gap-1.5"
                  >
                    <PokemonArt slug={p.slug} src={p.sprite || p.artwork} name={p.name} size={48} />
                    <span className="max-w-full truncate text-[11px] font-medium">{p.name}</span>
                  </button>
                  <button
                    type="button"
                    aria-label={`Remove ${p.name}`}
                    onClick={() => removeFoe(slug)}
                    className="absolute right-1.5 top-1.5 rounded-full bg-bg/70 p-1 text-muted hover:bg-bg hover:text-ink"
                  >
                    <X size={12} weight="bold" />
                  </button>
                </div>
                <div className="min-h-[1.35rem]" aria-hidden />
              </li>
            );
          })}
        </ul>
      }
      footer={null}
    />
  );
}
