"use client";

import { useEffect, useMemo } from "react";
import { LayoutGroup } from "motion/react";
import { useTeamStore } from "@/stores/team";
import { useLiveMatchStore } from "@/stores/live-match";
import { LivePackageBar } from "@/components/live/LivePackageBar";
import { LiveFoeSearch } from "@/components/live/LiveFoeSearch";
import { LiveDuelStage } from "@/components/live/LiveDuelStage";
import { LiveFieldStrip } from "@/components/live/LiveFieldStrip";
import { LiveDamageCalc } from "@/components/live/LiveDamageCalc";
import { getPokemon } from "@/lib/catalog/lookup";
import { cssVars } from "@/lib/champions/palette";

export function LiveMatchStage() {
  const slugs = useTeamStore((s) => s.slugs);
  const foes = useLiveMatchStore((s) => s.foes);
  const activeBringSlug = useLiveMatchStore((s) => s.activeBringSlug);
  const activeFoeSlug = useLiveMatchStore((s) => s.activeFoeSlug);
  const focusSlug = useLiveMatchStore((s) => s.focusSlug);
  const setActiveBring = useLiveMatchStore((s) => s.setActiveBring);
  const setActiveFoe = useLiveMatchStore((s) => s.setActiveFoe);
  const setFocus = useLiveMatchStore((s) => s.setFocus);

  const bring = useMemo(() => slugs.filter(Boolean) as string[], [slugs]);
  const exclude = useMemo(() => [...bring, ...foes], [bring, foes]);

  useEffect(() => {
    if (!bring.length) {
      if (activeBringSlug) setActiveBring(null);
      return;
    }
    if (!activeBringSlug || !bring.includes(activeBringSlug)) {
      setActiveBring(bring[0]!);
    }
  }, [bring, activeBringSlug, setActiveBring]);

  useEffect(() => {
    if (!foes.length) {
      if (activeFoeSlug) setActiveFoe(null);
      return;
    }
    if (!activeFoeSlug || !foes.includes(activeFoeSlug)) {
      setActiveFoe(foes[foes.length - 1]!);
    }
  }, [foes, activeFoeSlug, setActiveFoe]);

  const washSlug = activeFoeSlug ?? activeBringSlug ?? focusSlug ?? bring[0] ?? foes[0];
  const wash = washSlug ? getPokemon(washSlug) : undefined;

  return (
    <LayoutGroup>
      <div className="relative" style={wash ? cssVars(wash.palette) : undefined}>
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-[-1.5rem] top-[-1.5rem] -z-10 h-[28rem] rounded-[40px] opacity-90 md:inset-x-[-2rem]"
          style={{
            background:
              "radial-gradient(ellipse 80% 60% at 50% 0%, color-mix(in srgb, var(--mon-wash, #3a4558) 55%, transparent), transparent 70%), linear-gradient(180deg, color-mix(in srgb, var(--mon-vibrant, #c8b48a) 12%, transparent), transparent 55%)",
          }}
        />

        <header className="max-w-2xl">
          <p className="font-mono text-xs uppercase tracking-[0.16em] text-muted">Live Match</p>
          <h1 className="mt-2 text-4xl font-semibold tracking-tight md:text-5xl">On the stadium</h1>
          <p className="mt-3 text-muted">
            Log their lead. Compare Spe and stats. Read the kit. Decide.
          </p>
        </header>

        <div className="mt-10 space-y-8">
          <div className="grid gap-4 lg:grid-cols-2">
            <section className="rounded-[28px] border border-line/60 bg-raised/30 p-4 md:p-5">
              <LivePackageBar exclude={foes} />
            </section>
            <section className="rounded-[28px] border border-line/60 bg-raised/30 p-4 md:p-5">
              <LiveFoeSearch exclude={exclude} />
            </section>
          </div>

          <LiveDuelStage />

          {bring.length && foes.length ? (
            <details className="rounded-[28px] border border-line/50 bg-raised/20 open:bg-raised/30">
              <summary className="cursor-pointer list-none px-5 py-4 font-mono text-[10px] font-semibold uppercase tracking-[0.14em] text-muted marker:content-none [&::-webkit-details-marker]:hidden">
                All matchups · type matrix
              </summary>
              <div className="border-t border-line/50 px-4 pb-5 pt-2 md:px-5">
                <LiveFieldStrip
                  ourSlugs={bring}
                  foeSlugs={foes}
                  focusSlug={focusSlug}
                  onFocus={(slug) => {
                    setFocus(slug);
                    if (bring.includes(slug)) setActiveBring(slug);
                    if (foes.includes(slug)) setActiveFoe(slug);
                  }}
                />
              </div>
            </details>
          ) : null}
        </div>

        <LiveDamageCalc />
      </div>
    </LayoutGroup>
  );
}
