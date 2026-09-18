"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useLiveMatchStore } from "@/stores/live-match";
import { LivePackageBar } from "@/components/live/LivePackageBar";
import { LiveFoeSearch } from "@/components/live/LiveFoeSearch";
import { LiveDuelStage } from "@/components/live/LiveDuelStage";
import { LiveFieldStrip } from "@/components/live/LiveFieldStrip";
import { LiveDamageCalc } from "@/components/live/LiveDamageCalc";
import { LiveFoeKit } from "@/components/live/LiveFoeKit";
import { LiveArchetypeHint } from "@/components/live/LiveArchetypeHint";
import { getPokemon } from "@/lib/catalog/lookup";
import { cssVars } from "@/lib/champions/palette";
import { liveDebug, liveDebugError } from "@/lib/live/debug";

type MobileTab = "setup" | "duel" | "kit";
type SetupSide = "yours" | "theirs";

const MOBILE_TABS: { id: MobileTab; label: string }[] = [
  { id: "setup", label: "Setup" },
  { id: "duel", label: "Duel" },
  { id: "kit", label: "Kit" },
];

export function LiveMatchStage() {
  const renderCount = useRef(0);
  renderCount.current += 1;

  const bring = useLiveMatchStore((s) => s.bring);
  const foes = useLiveMatchStore((s) => s.foes);
  const activeBringSlug = useLiveMatchStore((s) => s.activeBringSlug);
  const activeFoeSlug = useLiveMatchStore((s) => s.activeFoeSlug);
  const focusSlug = useLiveMatchStore((s) => s.focusSlug);
  const selectBring = useLiveMatchStore((s) => s.selectBring);
  const selectFoe = useLiveMatchStore((s) => s.selectFoe);

  const readyForDuel = bring.length > 0 && foes.length > 0;
  const [tab, setTab] = useState<MobileTab>(readyForDuel ? "duel" : "setup");
  const [setupSide, setSetupSide] = useState<SetupSide>("yours");
  const seededTab = useRef(false);

  const exclude = useMemo(() => [...bring, ...foes], [bring, foes]);

  useEffect(() => {
    if (seededTab.current) return;
    if (readyForDuel) {
      setTab("duel");
      seededTab.current = true;
    }
  }, [readyForDuel]);

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

  const activeFoe =
    (activeFoeSlug && foes.includes(activeFoeSlug) ? activeFoeSlug : foes[0]) ?? null;

  const matrix = bring.length && foes.length ? (
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
  ) : null;

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
        <h1 className="mt-2 text-3xl font-semibold tracking-tight md:text-5xl">On the stadium</h1>
        <p className="mt-2 hidden text-muted md:mt-3 md:block">
          Log their lead. Compare Spe and stats. Read the kit. Decide.
        </p>
      </header>

      {/* Mobile tabs */}
      <nav
        aria-label="Live panels"
        className="sticky z-30 top-[var(--sticky-shell)] -mx-4 mt-4 border-b border-line/70 bg-bg/90 px-4 py-2 backdrop-blur-md md:hidden"
      >
        <ul className="flex gap-1.5">
          {MOBILE_TABS.map((t) => {
            const on = tab === t.id;
            return (
              <li key={t.id} className="min-w-0 flex-1">
                <button
                  type="button"
                  aria-pressed={on}
                  onClick={() => setTab(t.id)}
                  className={`flex min-h-11 w-full items-center justify-center rounded-full px-3 text-sm font-medium transition ${
                    on ? "bg-ink text-bg" : "bg-white/6 text-muted hover:text-ink"
                  }`}
                >
                  {t.label}
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Mobile panels */}
      <div className="mt-5 md:hidden">
        {tab === "setup" ? (
          <div className="space-y-4">
            <ul className="flex gap-1.5">
              {(
                [
                  { id: "yours" as const, label: "Yours" },
                  { id: "theirs" as const, label: "Theirs" },
                ] as const
              ).map((s) => {
                const on = setupSide === s.id;
                return (
                  <li key={s.id} className="flex-1">
                    <button
                      type="button"
                      aria-pressed={on}
                      onClick={() => setSetupSide(s.id)}
                      className={`flex min-h-11 w-full items-center justify-center rounded-full px-3 text-sm font-medium transition ${
                        on
                          ? "border border-ink/30 bg-raised/50 text-ink"
                          : "border border-line/60 text-muted"
                      }`}
                    >
                      {s.label}
                    </button>
                  </li>
                );
              })}
            </ul>
            <section className="rounded-[28px] border border-line/60 bg-raised/30 p-4">
              {setupSide === "yours" ? (
                <LivePackageBar exclude={foes} compact />
              ) : (
                <LiveFoeSearch exclude={exclude} compact />
              )}
            </section>
            {readyForDuel ? (
              <button
                type="button"
                onClick={() => setTab("duel")}
                className="flex min-h-11 w-full items-center justify-center rounded-full bg-ink text-sm font-medium text-bg"
              >
                Open duel
              </button>
            ) : null}
          </div>
        ) : null}

        {tab === "duel" ? <LiveDuelStage showKit={false} /> : null}

        {tab === "kit" ? (
          <div className="space-y-5">
            {activeFoe ? (
              <div className="rounded-[28px] border border-line/60 bg-raised/30 p-5">
                <LiveFoeKit foeSlug={activeFoe} />
              </div>
            ) : (
              <p className="rounded-[28px] border border-dashed border-line/70 bg-raised/20 px-5 py-8 text-center text-sm text-muted">
                Log a foe in Setup to read their kit.
              </p>
            )}
            {foes.length ? <LiveArchetypeHint foeSlugs={foes} /> : null}
            {matrix}
          </div>
        ) : null}
      </div>

      {/* Desktop stacked layout */}
      <div className="mt-10 hidden space-y-8 md:block">
        <div className="grid items-stretch gap-4 lg:grid-cols-2">
          <section className="flex min-h-0 flex-col rounded-[28px] border border-line/60 bg-raised/30 p-4 md:p-5">
            <LivePackageBar exclude={foes} />
          </section>
          <section className="flex min-h-0 flex-col rounded-[28px] border border-line/60 bg-raised/30 p-4 md:p-5">
            <LiveFoeSearch exclude={exclude} />
          </section>
        </div>

        <LiveDuelStage showKit />

        {matrix}
      </div>

      <div className="hidden md:block">
        <LiveDamageCalc />
      </div>
    </div>
  );
}
