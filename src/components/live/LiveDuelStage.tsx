"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useEffect, useMemo } from "react";
import { getPokemon } from "@/lib/catalog/lookup";
import { cssVars } from "@/lib/champions/palette";
import { defensiveMatchup, offensiveMatchup } from "@/lib/champions/types";
import { PokemonArt } from "@/components/pokemon/PokemonArt";
import { TypeBadge } from "@/components/pokemon/TypeBadge";
import { LiveStatCompare } from "@/components/live/LiveStatCompare";
import { LiveSpeHero } from "@/components/live/LiveSpeHero";
import { LiveFoeKit } from "@/components/live/LiveFoeKit";
import { LiveArchetypeHint } from "@/components/live/LiveArchetypeHint";
import { easeOut, motionTokens } from "@/components/motion/tokens";
import {
  ladderSpeLine,
  liveSpeCallout,
  liveSpeRace,
  liveStatsForSlug,
} from "@/lib/live/compare";
import { speBand } from "@/lib/champions/vs-stats";
import { liveDebug } from "@/lib/live/debug";
import { useLiveMatchStore } from "@/stores/live-match";
import { useTeamStore } from "@/stores/team";

function TypeStrip({
  label,
  types,
}: {
  label: string;
  types: { type: Parameters<typeof TypeBadge>[0]["type"]; mark?: string }[];
}) {
  if (!types.length) return null;
  return (
    <div>
      <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.12em] text-muted">
        {label}
      </p>
      <ul className="mt-1.5 flex flex-wrap gap-1">
        {types.slice(0, 6).map((t) => (
          <li key={`${label}-${t.type}`}>
            <TypeBadge type={t.type} size="sm" mark={t.mark} />
          </li>
        ))}
      </ul>
    </div>
  );
}

export function LiveDuelStage() {
  const slugs = useTeamStore((s) => s.slugs);
  const bringSlugs = useMemo(
    () => slugs.filter(Boolean) as string[],
    [slugs],
  );
  const foes = useLiveMatchStore((s) => s.foes);
  const activeBringSlug = useLiveMatchStore((s) => s.activeBringSlug);
  const activeFoeSlug = useLiveMatchStore((s) => s.activeFoeSlug);
  const selectBring = useLiveMatchStore((s) => s.selectBring);
  const setAttacker = useLiveMatchStore((s) => s.setAttacker);
  const setDefender = useLiveMatchStore((s) => s.setDefender);
  const setCalcOpen = useLiveMatchStore((s) => s.setCalcOpen);
  const reduce = useReducedMotion();

  useEffect(() => {
    liveDebug("[live/duel]", {
      bringSlugs,
      foes,
      activeBringSlug,
      activeFoeSlug,
      reduce,
    });
  }, [bringSlugs, foes, activeBringSlug, activeFoeSlug, reduce]);

  const bringSlug =
    (activeBringSlug && bringSlugs.includes(activeBringSlug)
      ? activeBringSlug
      : bringSlugs[0]) ?? null;
  const foeSlug =
    (activeFoeSlug && foes.includes(activeFoeSlug) ? activeFoeSlug : foes[0]) ??
    null;

  const our = bringSlug ? getPokemon(bringSlug) : undefined;
  const their = foeSlug ? getPokemon(foeSlug) : undefined;

  if (!bringSlugs.length && !foes.length) {
    return (
      <section className="rounded-[32px] border border-dashed border-line/70 bg-raised/20 px-5 py-10 text-center">
        <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.14em] text-muted">
          Duel
        </p>
        <p className="mt-3 text-sm text-muted">
          Set your three, then log their lead. Spe and stats land here.
        </p>
      </section>
    );
  }

  if (!our || !their || !bringSlug || !foeSlug) {
    return (
      <section className="rounded-[32px] border border-line/60 bg-raised/30 px-5 py-8">
        <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.14em] text-muted">
          Duel
        </p>
        <p className="mt-3 max-w-[40ch] text-sm text-muted">
          {!our
            ? "Pick your bring above — tap a Pokémon to set the active."
            : "Log their lead above. The compare stage opens as soon as both sides are set."}
        </p>
      </section>
    );
  }

  const ourLive = liveStatsForSlug(bringSlug, our);
  const theirLive = liveStatsForSlug(foeSlug, their);
  const race = liveSpeRace(our, their);
  const ladder = ladderSpeLine(bringSlug, our, foeSlug, their);
  const ourDef = defensiveMatchup(our.types);
  const theirDef = defensiveMatchup(their.types);
  const ourOff = offensiveMatchup(our.types);
  const theirOff = offensiveMatchup(their.types);

  const others = bringSlugs.filter((s) => s !== bringSlug);

  return (
    <section className="space-y-6">
      <AnimatePresence mode="wait">
        <motion.div
          key={`${bringSlug}-${foeSlug}`}
          initial={reduce ? false : { opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={reduce ? undefined : { opacity: 0, y: -6 }}
          transition={{ duration: motionTokens.state, ease: easeOut }}
          className="overflow-hidden rounded-[32px] border border-line/70 bg-raised/40 shadow-[0_22px_60px_rgba(0,0,0,0.28)]"
        >
          <div className="grid gap-0 md:grid-cols-[1fr_auto_1fr]">
            <div className="p-5 md:p-6" style={cssVars(our.palette)}>
              <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.14em] text-muted">
                You
              </p>
              <div className="mt-3 flex items-start gap-3">
                  <PokemonArt
                    slug={our.slug}
                    src={our.artwork}
                    name={our.name}
                    size={96}
                  />
                <div className="min-w-0 pt-1">
                  <p className="text-xl font-semibold tracking-tight">{our.name}</p>
                  <ul className="mt-2 flex flex-wrap gap-1">
                    {our.types.map((t) => (
                      <li key={t}>
                        <TypeBadge type={t} size="sm" />
                      </li>
                    ))}
                  </ul>
                  <p className="mt-2 font-mono text-[11px] text-muted">
                    Spe {speBand(our).at0}–{speBand(our).at32}
                  </p>
                </div>
              </div>
              <div className="mt-4 space-y-3">
                <TypeStrip
                  label="Weak to"
                  types={ourDef.weak.map((w) => ({
                    type: w.type,
                    mark: `${w.mult}×`,
                  }))}
                />
                <TypeStrip
                  label="Strong into"
                  types={ourOff.strong.map((t) => ({ type: t }))}
                />
              </div>
            </div>

            <div className="flex flex-col items-center justify-center gap-2 border-y border-line/50 bg-sunken/40 px-4 py-5 md:border-x md:border-y-0">
              <p className="text-center text-lg font-semibold tracking-tight">
                {liveSpeCallout(race.kind)}
              </p>
              {ladder ? (
                <p className="max-w-[22ch] text-center font-mono text-[11px] text-muted">
                  {ladder}
                </p>
              ) : (
                <p className="max-w-[22ch] text-center text-[11px] text-muted">
                  Nature-neutral bands · 0–32 Spe SP
                </p>
              )}
              <button
                type="button"
                onClick={() => {
                  setAttacker(bringSlug);
                  setDefender(foeSlug);
                  setCalcOpen(true);
                }}
                className="mt-2 rounded-full border border-line px-3 py-1.5 text-xs text-muted transition hover:border-ink/40 hover:text-ink"
              >
                Will this KO? Open calc
              </button>
            </div>

            <div className="p-5 md:p-6" style={cssVars(their.palette)}>
              <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.14em] text-muted">
                Them
              </p>
              <div className="mt-3 flex items-start gap-3 md:flex-row-reverse md:text-right">
                  <PokemonArt
                    slug={their.slug}
                    src={their.artwork}
                    name={their.name}
                    size={96}
                  />
                <div className="min-w-0 pt-1 md:flex md:flex-col md:items-end">
                  <p className="text-xl font-semibold tracking-tight">{their.name}</p>
                  <ul className="mt-2 flex flex-wrap gap-1 md:justify-end">
                    {their.types.map((t) => (
                      <li key={t}>
                        <TypeBadge type={t} size="sm" />
                      </li>
                    ))}
                  </ul>
                  <p className="mt-2 font-mono text-[11px] text-muted">
                    Spe {speBand(their).at0}–{speBand(their).at32}
                  </p>
                </div>
              </div>
              <div className="mt-4 space-y-3 md:text-right">
                <TypeStrip
                  label="Weak to"
                  types={theirDef.weak.map((w) => ({
                    type: w.type,
                    mark: `${w.mult}×`,
                  }))}
                />
                <TypeStrip
                  label="Strong into"
                  types={theirOff.strong.map((t) => ({ type: t }))}
                />
              </div>
            </div>
          </div>

          <div className="border-t border-line/60 px-5 py-5 md:px-6">
            <LiveSpeHero ours={our} theirs={their} />

            <p className="mb-3 mt-6 font-mono text-[10px] font-semibold uppercase tracking-[0.14em] text-muted">
              Other stats · ladder SP when known
            </p>
            <p className="mb-4 text-xs text-muted">
              Green wins the row · red loses it. Skim Atk / SpA for threats; HP / Def / SpD for bulk.
            </p>
            <LiveStatCompare
              ours={{
                stats: ourLive.stats,
                wash: our.palette.wash,
                vibrant: our.palette.vibrant,
              }}
              theirs={{
                stats: theirLive.stats,
                wash: their.palette.wash,
                vibrant: their.palette.vibrant,
              }}
            />
          </div>
        </motion.div>
      </AnimatePresence>

      {others.length ? (
        <div>
          <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.14em] text-muted">
            Spe vs your other two
          </p>
          <ul className="mt-2 flex flex-wrap gap-2">
            {others.map((slug) => {
              const mon = getPokemon(slug);
              if (!mon) return null;
              const r = liveSpeRace(mon, their);
              return (
                <li key={slug}>
                  <button
                    type="button"
                    onClick={() => selectBring(slug)}
                    className="inline-flex items-center gap-2 rounded-full border border-line/70 bg-raised/40 py-1 pl-1 pr-3 text-sm transition hover:border-ink/40"
                    style={cssVars(mon.palette)}
                  >
                    <PokemonArt
                      slug={mon.slug}
                      src={mon.sprite || mon.artwork}
                      name={mon.name}
                      size={28}
                    />
                    <span className="font-medium">{mon.name}</span>
                    <span className="text-xs text-muted">{liveSpeCallout(r.kind)}</span>
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      ) : null}

      <div className="rounded-[28px] border border-line/60 bg-raised/30 p-5">
        <LiveFoeKit foeSlug={foeSlug} />
      </div>

      <LiveArchetypeHint foeSlugs={foes} />
    </section>
  );
}
