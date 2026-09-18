"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useEffect } from "react";
import { getPokemon } from "@/lib/catalog/lookup";
import { cssVars } from "@/lib/champions/palette";
import { defensiveMatchup, offensiveMatchup } from "@/lib/champions/types";
import { PokemonArt } from "@/components/pokemon/PokemonArt";
import { TypeBadge } from "@/components/pokemon/TypeBadge";
import { LiveStatCompare } from "@/components/live/LiveStatCompare";
import { LiveSpeHero } from "@/components/live/LiveSpeHero";
import { LiveFoeKit } from "@/components/live/LiveFoeKit";
import { LiveFoeUsage } from "@/components/live/LiveFoeUsage";
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
import type { TypeId } from "@/types/pokemon";

function TypeStrip({
  label,
  types,
  empty = false,
}: {
  label: string;
  types: { type: TypeId; mark?: string }[];
  empty?: boolean;
}) {
  if (!types.length && !empty) return null;
  return (
    <div>
      <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.12em] text-muted">
        {label}
      </p>
      {types.length ? (
        <ul className="mt-1.5 flex flex-wrap gap-1">
          {types.slice(0, 8).map((t) => (
            <li key={`${label}-${t.type}`}>
              <TypeBadge type={t.type} size="sm" mark={t.mark} />
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-1.5 text-xs text-muted">—</p>
      )}
    </div>
  );
}

function CompactTypeCell({
  label,
  types,
}: {
  label: string;
  types: { type: TypeId; mark?: string }[];
}) {
  return (
    <div className="rounded-2xl border border-line/50 bg-raised/25 px-3 py-2.5">
      <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.12em] text-muted">
        {label}
      </p>
      {types.length ? (
        <ul className="mt-1.5 flex flex-wrap gap-1">
          {types.slice(0, 6).map((t) => (
            <li key={`${label}-${t.type}`}>
              <TypeBadge type={t.type} size="sm" mark={t.mark} />
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-1.5 text-xs text-muted">—</p>
      )}
    </div>
  );
}

function SideChip({
  slug,
  active,
  caption,
  onPick,
}: {
  slug: string;
  active: boolean;
  caption?: string;
  onPick: () => void;
}) {
  const mon = getPokemon(slug);
  if (!mon) return null;
  return (
    <button
      type="button"
      onClick={onPick}
      aria-pressed={active}
      className={`inline-flex min-h-11 items-center gap-2 rounded-full border py-1 pl-1 pr-3 text-sm transition ${
        active
          ? "border-ink/40 bg-white/10"
          : "border-line/70 bg-raised/40 hover:border-ink/30"
      }`}
      style={cssVars(mon.palette)}
    >
      <PokemonArt
        slug={mon.slug}
        src={mon.sprite || mon.artwork}
        name={mon.name}
        size={28}
      />
      <span className="font-medium">{mon.name}</span>
      {caption ? <span className="text-xs text-muted">{caption}</span> : null}
    </button>
  );
}

export function LiveDuelStage({ showKit = true }: { showKit?: boolean }) {
  const bringSlugs = useLiveMatchStore((s) => s.bring);
  const foes = useLiveMatchStore((s) => s.foes);
  const activeBringSlug = useLiveMatchStore((s) => s.activeBringSlug);
  const activeFoeSlug = useLiveMatchStore((s) => s.activeFoeSlug);
  const selectBring = useLiveMatchStore((s) => s.selectBring);
  const selectFoe = useLiveMatchStore((s) => s.selectFoe);
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
      showKit,
    });
  }, [bringSlugs, foes, activeBringSlug, activeFoeSlug, reduce, showKit]);

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
          Set your six, then log theirs. Spe and stats land here.
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
            ? "Pick your side in Setup — tap a Pokémon to set the active."
            : "Log their lead in Setup. The compare stage opens as soon as both sides are set."}
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

  const speDetails = (
    <>
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
    </>
  );

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
          {/* Mobile face-off */}
          <div className="md:hidden">
            <div className="grid grid-cols-[1fr_auto_1fr] items-start gap-2 px-4 pb-2 pt-5">
              <div className="min-w-0 text-center" style={cssVars(our.palette)}>
                <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.14em] text-muted">
                  You
                </p>
                <div className="mt-2 flex justify-center">
                  <PokemonArt slug={our.slug} src={our.artwork} name={our.name} size={88} />
                </div>
                <p className="mt-2 truncate text-base font-semibold tracking-tight">{our.name}</p>
                <ul className="mt-1.5 flex flex-wrap justify-center gap-1">
                  {our.types.map((t) => (
                    <li key={t}>
                      <TypeBadge type={t} size="sm" />
                    </li>
                  ))}
                </ul>
                <p className="mt-1.5 font-mono text-[11px] text-muted">
                  Spe {speBand(our).at0}–{speBand(our).at32}
                </p>
              </div>

              <div className="flex flex-col items-center pt-10">
                <span className="rounded-full bg-sunken/80 px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.14em] text-muted">
                  VS
                </span>
              </div>

              <div className="min-w-0 text-center" style={cssVars(their.palette)}>
                <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.14em] text-muted">
                  Them
                </p>
                <div className="mt-2 flex justify-center">
                  <PokemonArt slug={their.slug} src={their.artwork} name={their.name} size={88} />
                </div>
                <p className="mt-2 truncate text-base font-semibold tracking-tight">{their.name}</p>
                <ul className="mt-1.5 flex flex-wrap justify-center gap-1">
                  {their.types.map((t) => (
                    <li key={t}>
                      <TypeBadge type={t} size="sm" />
                    </li>
                  ))}
                </ul>
                <p className="mt-1.5 font-mono text-[11px] text-muted">
                  Spe {speBand(their).at0}–{speBand(their).at32}
                </p>
              </div>
            </div>

            <div className="border-t border-line/50 bg-sunken/40 px-4 py-4 text-center">
              <p className="text-xl font-semibold tracking-tight">{liveSpeCallout(race.kind)}</p>
              {ladder ? (
                <p className="mt-1 font-mono text-[11px] text-muted">{ladder}</p>
              ) : (
                <p className="mt-1 text-[11px] text-muted">Nature-neutral bands · 0–32 Spe SP</p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-2 px-4 py-4">
              <CompactTypeCell
                label="You take 2×"
                types={ourDef.weak.map((w) => ({ type: w.type, mark: `${w.mult}×` }))}
              />
              <CompactTypeCell
                label="You hit 2×"
                types={ourOff.strong.map((t) => ({ type: t }))}
              />
              <CompactTypeCell
                label="They take 2×"
                types={theirDef.weak.map((w) => ({ type: w.type, mark: `${w.mult}×` }))}
              />
              <CompactTypeCell
                label="They hit 2×"
                types={theirOff.strong.map((t) => ({ type: t }))}
              />
            </div>
            <div className="px-4 pb-4">
              <LiveFoeUsage foeSlug={foeSlug} align="start" />
            </div>

            <details className="border-t border-line/60">
              <summary className="cursor-pointer list-none px-4 py-3.5 font-mono text-[10px] font-semibold uppercase tracking-[0.14em] text-muted marker:content-none [&::-webkit-details-marker]:hidden">
                Spe scenarios · other stats
              </summary>
              <div className="border-t border-line/50 px-4 pb-5 pt-3">{speDetails}</div>
            </details>
          </div>

          {/* Desktop three-column */}
          <div className="hidden md:block">
            <div className="grid gap-0 md:grid-cols-[1fr_auto_1fr]">
              <div className="p-5 md:p-6" style={cssVars(our.palette)}>
                <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.14em] text-muted">
                  You
                </p>
                <div className="mt-3 flex items-start gap-3">
                  <PokemonArt slug={our.slug} src={our.artwork} name={our.name} size={96} />
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
                    empty
                  />
                  <TypeStrip
                    label="Strong into"
                    types={ourOff.strong.map((t) => ({ type: t }))}
                    empty
                  />
                  <TypeStrip
                    label="Not affected by"
                    types={ourDef.immune.map((t) => ({ type: t }))}
                    empty
                  />
                  <TypeStrip
                    label="Has no effect on"
                    types={ourOff.fails.map((t) => ({ type: t }))}
                    empty
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
                  <PokemonArt slug={their.slug} src={their.artwork} name={their.name} size={96} />
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
                    empty
                  />
                  <TypeStrip
                    label="Strong into"
                    types={theirOff.strong.map((t) => ({ type: t }))}
                    empty
                  />
                  <TypeStrip
                    label="Not affected by"
                    types={theirDef.immune.map((t) => ({ type: t }))}
                    empty
                  />
                  <TypeStrip
                    label="Has no effect on"
                    types={theirOff.fails.map((t) => ({ type: t }))}
                    empty
                  />
                  <LiveFoeUsage foeSlug={foeSlug} align="end" />
                </div>
              </div>
            </div>

            <div className="border-t border-line/60 px-5 py-5 md:px-6">{speDetails}</div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Active swap chips — always useful; denser on mobile */}
      <div className="space-y-3">
        {bringSlugs.length > 1 ? (
          <div>
            <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.14em] text-muted">
              Your side
            </p>
            <ul className="mt-2 flex flex-wrap gap-2">
              {bringSlugs.map((slug) => {
                const mon = getPokemon(slug);
                if (!mon) return null;
                return (
                  <li key={slug}>
                    <SideChip
                      slug={slug}
                      active={slug === bringSlug}
                      caption={
                        slug === bringSlug
                          ? undefined
                          : liveSpeCallout(liveSpeRace(mon, their).kind)
                      }
                      onPick={() => selectBring(slug)}
                    />
                  </li>
                );
              })}
            </ul>
          </div>
        ) : null}
        {foes.length > 1 ? (
          <div>
            <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.14em] text-muted">
              Their side
            </p>
            <ul className="mt-2 flex flex-wrap gap-2">
              {foes.map((slug) => (
                <li key={slug}>
                  <SideChip
                    slug={slug}
                    active={slug === foeSlug}
                    onPick={() => selectFoe(slug)}
                  />
                </li>
              ))}
            </ul>
          </div>
        ) : null}
      </div>

      {showKit ? (
        <>
          <div className="rounded-[28px] border border-line/60 bg-raised/30 p-5">
            <LiveFoeKit foeSlug={foeSlug} />
          </div>
          <LiveArchetypeHint foeSlugs={foes} />
        </>
      ) : null}
    </section>
  );
}
