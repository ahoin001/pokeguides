"use client";

import { useMemo } from "react";
import { useTeamStore } from "@/stores/team";
import { useLiveMatchStore } from "@/stores/live-match";
import { LivePackageBar } from "@/components/live/LivePackageBar";
import { LiveFoeSearch } from "@/components/live/LiveFoeSearch";
import { LiveBringMoves } from "@/components/live/LiveBringMoves";
import { LiveFieldStrip } from "@/components/live/LiveFieldStrip";
import { LiveFocusRail } from "@/components/live/LiveFocusRail";
import { LiveDamageCalc } from "@/components/live/LiveDamageCalc";
import { getPokemon } from "@/lib/catalog/lookup";
import { cssVars } from "@/lib/champions/palette";

export function LiveMatchStage() {
  const slugs = useTeamStore((s) => s.slugs);
  const foes = useLiveMatchStore((s) => s.foes);
  const focusSlug = useLiveMatchStore((s) => s.focusSlug);
  const setFocus = useLiveMatchStore((s) => s.setFocus);

  const bring = useMemo(() => slugs.filter(Boolean) as string[], [slugs]);
  const exclude = useMemo(() => [...bring, ...foes], [bring, foes]);

  const wash = focusSlug
    ? getPokemon(focusSlug)
    : bring[0]
      ? getPokemon(bring[0])
      : foes[0]
        ? getPokemon(foes[0])
        : undefined;

  return (
    <div className="relative" style={wash ? cssVars(wash.palette) : undefined}>
      {/* Stadium atmosphere */}
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
          Your registered six, their preview, kits, and a Champions damage calc — one tool for the
          ninety-second clock.
        </p>
      </header>

      <div className="mt-10 grid gap-8 lg:grid-cols-[minmax(0,1fr)_22rem] lg:items-start">
        <div className="space-y-10">
          <section className="rounded-[28px] border border-line/60 bg-raised/30 p-4 md:p-5">
            <LivePackageBar />
          </section>

          <section className="rounded-[28px] border border-line/60 bg-raised/30 p-4 md:p-5">
            <LiveFoeSearch exclude={exclude} />
          </section>

          {bring.length ? <LiveBringMoves ourSlugs={bring} /> : null}

          <LiveFieldStrip
            ourSlugs={bring}
            foeSlugs={foes}
            focusSlug={focusSlug}
            onFocus={setFocus}
          />
        </div>

        <LiveFocusRail />
      </div>

      <LiveDamageCalc />
    </div>
  );
}
