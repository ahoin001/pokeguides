"use client";

import { useEffect, useMemo, useRef } from "react";
import { useTeamStore } from "@/stores/team";
import { useLiveMatchStore } from "@/stores/live-match";
import { LivePackageBar } from "@/components/live/LivePackageBar";
import { LiveFoeSearch } from "@/components/live/LiveFoeSearch";
import { LiveDuelStage } from "@/components/live/LiveDuelStage";
import { LiveFieldStrip } from "@/components/live/LiveFieldStrip";
import { LiveDamageCalc } from "@/components/live/LiveDamageCalc";
import { getPokemon } from "@/lib/catalog/lookup";
import { cssVars } from "@/lib/champions/palette";
import { liveDebug, liveDebugError } from "@/lib/live/debug";

export function LiveMatchStage() {
  const renderCount = useRef(0);
  renderCount.current += 1;

  const slugs = useTeamStore((s) => s.slugs);
  const foes = useLiveMatchStore((s) => s.foes);
  const activeBringSlug = useLiveMatchStore((s) => s.activeBringSlug);
  const activeFoeSlug = useLiveMatchStore((s) => s.activeFoeSlug);
  const focusSlug = useLiveMatchStore((s) => s.focusSlug);
  const selectBring = useLiveMatchStore((s) => s.selectBring);
  const selectFoe = useLiveMatchStore((s) => s.selectFoe);

  // Stable snapshot — never filter inside the zustand selector (React #185).
  const bring = useMemo(() => slugs.filter(Boolean) as string[], [slugs]);
  const exclude = useMemo(() => [...bring, ...foes], [bring, foes]);

  useEffect(() => {
    liveDebug("[live/stage] mount", {
      bring,
      foes,
      activeBringSlug,
      activeFoeSlug,
      focusSlug,
    });
    return () => liveDebug("[live/stage] unmount");
    // Mount-only diagnostics.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const payload = {
      count: renderCount.current,
      bring,
      foes,
      activeBringSlug,
      activeFoeSlug,
      focusSlug,
    };
    if (renderCount.current > 40) {
      liveDebugError("[live/stage] render storm — likely unstable store selector", payload);
    } else if (renderCount.current <= 5 || renderCount.current % 10 === 0) {
      liveDebug("[live/stage] render", payload);
    }
  });

  const washSlug =
    (activeFoeSlug && foes.includes(activeFoeSlug) ? activeFoeSlug : null) ??
    (activeBringSlug && bring.includes(activeBringSlug) ? activeBringSlug : null) ??
    focusSlug ??
    bring[0] ??
    foes[0];
  const wash = washSlug ? getPokemon(washSlug) : undefined;

  return (
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
                  liveDebug("[live/stage] field focus", { slug });
                  if (bring.includes(slug)) selectBring(slug);
                  else if (foes.includes(slug)) selectFoe(slug);
                }}
              />
            </div>
          </details>
        ) : null}
      </div>

      <LiveDamageCalc />
    </div>
  );
}
