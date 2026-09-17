"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { MagnifyingGlass, X } from "@phosphor-icons/react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { ensureSearchRoster, searchLegal } from "@/lib/catalog/client-search";
import { getPokemon } from "@/lib/catalog/lookup";
import { megaAltChips, megaChipLabel } from "@/lib/catalog/megas";
import { cssVars } from "@/lib/champions/palette";
import { PokemonArt } from "@/components/pokemon/PokemonArt";
import { useTeamStore } from "@/stores/team";
import { MAX_BRING, useLiveMatchStore } from "@/stores/live-match";
import { LiveBringPresets } from "@/components/live/LiveBringPresets";
import { LiveSideShell } from "@/components/live/LiveSideShell";
import { LiveRecentStrip } from "@/components/live/LiveRecentStrip";
import { easeOut, motionTokens } from "@/components/motion/tokens";

const SLOT_INDEXES = [0, 1, 2, 3, 4, 5] as const;

/** Freely pick up to six on Live — Team box/three are shortcuts, presets recall kits. */
export function LivePackageBar({ exclude = [] }: { exclude?: string[] }) {
  const box = useTeamStore((s) => s.box);
  const teamSlugs = useTeamStore((s) => s.slugs);
  const bring = useLiveMatchStore((s) => s.bring);
  const recent = useLiveMatchStore((s) => s.recent);
  const addBring = useLiveMatchStore((s) => s.addBring);
  const removeBring = useLiveMatchStore((s) => s.removeBring);
  const setBringSlot = useLiveMatchStore((s) => s.setBringSlot);
  const loadBring = useLiveMatchStore((s) => s.loadBring);
  const selectBring = useLiveMatchStore((s) => s.selectBring);
  const activeBringSlug = useLiveMatchStore((s) => s.activeBringSlug);
  const clearBringMoves = useLiveMatchStore((s) => s.clearBringMoves);

  const boxFilled = box.filter(Boolean) as string[];
  const teamFilled = teamSlugs.filter(Boolean) as string[];
  const fromTeam = boxFilled.length ? boxFilled : teamFilled;
  const highlighted =
    activeBringSlug && bring.includes(activeBringSlug)
      ? activeBringSlug
      : bring[0] ?? null;

  const [q, setQ] = useState("");
  const [ready, setReady] = useState(false);
  const [seeded, setSeeded] = useState(false);
  const reduce = useReducedMotion();

  useEffect(() => {
    void ensureSearchRoster().then(() => setReady(true));
  }, []);

  useEffect(() => {
    if (seeded) return;
    const finish = () => {
      const live = useLiveMatchStore.getState();
      if (live.bring.length) {
        setSeeded(true);
        return;
      }
      const team = useTeamStore.getState();
      const fromBox = team.box.filter(Boolean) as string[];
      const fromThree = team.slugs.filter(Boolean) as string[];
      const seed = fromBox.length ? fromBox : fromThree;
      if (seed.length) loadBring(seed);
      setSeeded(true);
    };
    const api = useLiveMatchStore.persist;
    if (api.hasHydrated()) finish();
    else return api.onFinishHydration(finish);
  }, [seeded, loadBring]);

  const blocked = useMemo(
    () => new Set([...exclude, ...bring]),
    [exclude, bring],
  );

  const hits = useMemo(() => {
    if (!ready || !q.trim()) return [];
    return searchLegal(q)
      .filter((p) => !blocked.has(p.slug))
      .slice(0, 8);
  }, [q, ready, blocked]);

  function bringIn(slug: string) {
    selectBring(slug);
    if (bring.includes(slug)) return;
    addBring(slug);
    setQ("");
  }

  function drop(slug: string) {
    removeBring(slug);
    clearBringMoves(slug);
  }

  function swapForm(index: number, from: string, to: string) {
    if (from === to) return;
    if (bring.includes(to)) return;
    setBringSlot(index, to);
    clearBringMoves(from);
    selectBring(to);
  }

  function togglePackage(slug: string) {
    if (bring.includes(slug)) {
      drop(slug);
      return;
    }
    bringIn(slug);
  }

  return (
    <LiveSideShell
      eyebrow="Your six"
      title={`${bring.length}/${MAX_BRING} on the field`}
      lede="Tap a mon for the duel. Mega chips swap mid-fight."
      action={
        <Link href="/team" className="text-xs text-muted underline hover:text-ink">
          Edit on Team
        </Link>
      }
      tools={<LiveBringPresets />}
      search={
        <div className="relative">
          <MagnifyingGlass
            size={16}
            className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-muted"
          />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder={ready ? "Search to add…" : "Loading roster…"}
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
                      onClick={() => bringIn(p.slug)}
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
          exclude={[...exclude, ...bring]}
          onPick={bringIn}
          emptyHint="Optional quick adds — presets cover full teams."
        />
      }
      slots={
        <ul className="grid grid-cols-3 gap-2 sm:grid-cols-6">
          {SLOT_INDEXES.map((i) => {
            const slug = bring[i];
            const p = slug ? getPokemon(slug) : undefined;
            if (!p || !slug) {
              return (
                <li key={`empty-${i}`} className="flex flex-col gap-1.5">
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
            const focused = highlighted === slug;
            const alts = megaAltChips(slug).filter((alt) => !bring.includes(alt.slug));
            return (
              <li key={slug} className="flex flex-col gap-1.5">
                <div
                  className={`relative flex min-h-[5.75rem] flex-col items-center justify-center gap-1.5 rounded-2xl border px-1.5 py-2.5 transition ${
                    focused
                      ? "border-ink/40 bg-white/10"
                      : "border-[color-mix(in_srgb,var(--mon-vibrant)_45%,transparent)] bg-[color-mix(in_srgb,var(--mon-wash)_18%,transparent)]"
                  }`}
                  style={cssVars(p.palette)}
                >
                  <button
                    type="button"
                    onClick={() => selectBring(slug)}
                    className="flex w-full flex-col items-center gap-1.5"
                  >
                    <PokemonArt slug={p.slug} src={p.sprite || p.artwork} name={p.name} size={48} />
                    <span className="max-w-full truncate text-[11px] font-medium">{p.name}</span>
                  </button>
                  <button
                    type="button"
                    aria-label={`Remove ${p.name}`}
                    onClick={() => drop(slug)}
                    className="absolute right-1.5 top-1.5 rounded-full bg-bg/70 p-1 text-muted hover:bg-bg hover:text-ink"
                  >
                    <X size={12} weight="bold" />
                  </button>
                </div>
                <div className="flex min-h-[1.35rem] flex-wrap justify-center gap-1">
                  {alts.map((alt) => (
                    <button
                      key={alt.slug}
                      type="button"
                      title={`Swap to ${alt.name}`}
                      onClick={() => swapForm(i, slug, alt.slug)}
                      className="rounded-full border border-line/70 bg-raised/40 px-2 py-0.5 text-[10px] font-medium text-muted transition hover:border-ink/35 hover:text-ink"
                      style={cssVars(alt.palette)}
                    >
                      {megaChipLabel(alt)}
                    </button>
                  ))}
                </div>
              </li>
            );
          })}
        </ul>
      }
      footer={
        fromTeam.length ? (
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.12em] text-muted">
              From Team — tap to toggle
            </p>
            <ul className="mt-2 grid grid-cols-3 gap-2 sm:grid-cols-6">
              {fromTeam.map((pkgSlug) => {
                const mon = getPokemon(pkgSlug);
                if (!mon) return null;
                const on = bring.includes(pkgSlug);
                return (
                  <li key={pkgSlug}>
                    <button
                      type="button"
                      onClick={() => togglePackage(pkgSlug)}
                      title={on ? `Drop ${mon.name}` : `Add ${mon.name}`}
                      className={`flex w-full flex-col items-center gap-1 rounded-2xl border px-1 py-2 transition ${
                        on
                          ? "border-ink/35 bg-white/10"
                          : "border-line/70 bg-bg/30 opacity-75 hover:opacity-100"
                      }`}
                      style={cssVars(mon.palette)}
                    >
                      <PokemonArt
                        slug={mon.slug}
                        src={mon.sprite || mon.artwork}
                        name={mon.name}
                        size={36}
                      />
                      <span className="max-w-full truncate text-[10px] font-medium">{mon.name}</span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        ) : null
      }
    />
  );
}
