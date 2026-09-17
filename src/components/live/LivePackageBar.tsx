"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { MagnifyingGlass, X } from "@phosphor-icons/react";
import { ensureSearchRoster, searchLegal } from "@/lib/catalog/client-search";
import { getPokemon } from "@/lib/catalog/lookup";
import { cssVars } from "@/lib/champions/palette";
import { PokemonArt } from "@/components/pokemon/PokemonArt";
import { useTeamStore } from "@/stores/team";
import { useLiveMatchStore } from "@/stores/live-match";
import { LiveBringPresets } from "@/components/live/LiveBringPresets";

/** Freely pick a bring of three on Live — package is a shortcut, presets recall kits. */
export function LivePackageBar({ exclude = [] }: { exclude?: string[] }) {
  const box = useTeamStore((s) => s.box);
  const slugs = useTeamStore((s) => s.slugs);
  const add = useTeamStore((s) => s.add);
  const remove = useTeamStore((s) => s.remove);
  const selectBring = useLiveMatchStore((s) => s.selectBring);
  const activeBringSlug = useLiveMatchStore((s) => s.activeBringSlug);
  const clearBringMoves = useLiveMatchStore((s) => s.clearBringMoves);

  const boxFilled = box.filter(Boolean) as string[];
  const bringFilled = slugs.filter(Boolean) as string[];
  const highlighted =
    activeBringSlug && bringFilled.includes(activeBringSlug)
      ? activeBringSlug
      : bringFilled[0] ?? null;

  const [q, setQ] = useState("");
  const [ready, setReady] = useState(false);

  useEffect(() => {
    void ensureSearchRoster().then(() => setReady(true));
  }, []);

  const blocked = useMemo(
    () => new Set([...exclude, ...bringFilled]),
    [exclude, bringFilled],
  );

  const hits = useMemo(() => {
    if (!ready || !q.trim()) return [];
    return searchLegal(q)
      .filter((p) => !blocked.has(p.slug))
      .slice(0, 8);
  }, [q, ready, blocked]);

  function bringIn(slug: string) {
    selectBring(slug);
    if (slugs.includes(slug)) return;
    if (!add(slug)) {
      const first = slugs.find(Boolean);
      if (first) {
        remove(first);
        clearBringMoves(first);
      }
      add(slug);
    }
    setQ("");
  }

  function drop(slug: string) {
    remove(slug);
    clearBringMoves(slug);
  }

  function togglePackage(slug: string) {
    if (slugs.includes(slug)) {
      drop(slug);
      return;
    }
    bringIn(slug);
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.14em] text-muted">
            Your bring
          </p>
          <h2 className="mt-1 text-lg font-semibold tracking-tight">
            {bringFilled.length}/3 on the field
          </h2>
          <p className="mt-1 max-w-[40ch] text-sm text-muted">
            Search or tap your six. Tap a slot to compare. Presets restore a common three.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <LiveBringPresets />
          <Link href="/team" className="text-xs text-muted underline hover:text-ink">
            Edit on Team
          </Link>
        </div>
      </div>

      <div className="relative">
        <MagnifyingGlass
          size={16}
          className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-muted"
        />
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder={ready ? "Search to add to bring…" : "Loading roster…"}
          disabled={!ready}
          className="w-full rounded-2xl border border-line bg-sunken py-3 pl-10 pr-4 text-sm"
        />
      </div>

      {hits.length ? (
        <ul className="flex flex-wrap gap-2">
          {hits.map((p) => (
            <li key={p.slug}>
              <button
                type="button"
                onClick={() => bringIn(p.slug)}
                className="inline-flex items-center gap-2 rounded-full border border-line bg-raised/50 py-1 pl-1 pr-3 text-sm transition hover:border-ink/40"
                style={cssVars(p.palette)}
              >
                <PokemonArt slug={p.slug} src={p.sprite || p.artwork} name={p.name} size={28} />
                {p.name}
              </button>
            </li>
          ))}
        </ul>
      ) : null}

      <ul className="grid grid-cols-3 gap-2">
        {[0, 1, 2].map((i) => {
          const slug = slugs[i];
          const p = slug ? getPokemon(slug) : undefined;
          if (!p || !slug) {
            return (
              <li
                key={`empty-${i}`}
                className="flex min-h-[6.5rem] flex-col items-center justify-center rounded-2xl border border-dashed border-line/80 bg-bg/20 px-2 py-3 text-center"
              >
                <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-muted">
                  Slot {i + 1}
                </span>
                <span className="mt-1 text-xs text-muted">Search above</span>
              </li>
            );
          }
          const focused = highlighted === slug;
          return (
            <li key={slug}>
              <div
                className={`relative flex flex-col items-center gap-1.5 rounded-2xl border px-1.5 py-2.5 transition ${
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
                  <PokemonArt slug={p.slug} src={p.sprite || p.artwork} name={p.name} size={56} />
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
            </li>
          );
        })}
      </ul>

      {boxFilled.length ? (
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.12em] text-muted">
            From your six — tap to toggle
          </p>
          <ul className="mt-2 grid grid-cols-3 gap-2 sm:grid-cols-6">
            {boxFilled.map((slug) => {
              const p = getPokemon(slug);
              if (!p) return null;
              const on = slugs.includes(slug);
              return (
                <li key={slug}>
                  <button
                    type="button"
                    onClick={() => togglePackage(slug)}
                    title={on ? `Drop ${p.name}` : `Bring ${p.name}`}
                    className={`flex w-full flex-col items-center gap-1 rounded-2xl border px-1 py-2 transition ${
                      on
                        ? "border-ink/35 bg-white/10"
                        : "border-line/70 bg-bg/30 opacity-75 hover:opacity-100"
                    }`}
                    style={cssVars(p.palette)}
                  >
                    <PokemonArt slug={p.slug} src={p.sprite || p.artwork} name={p.name} size={40} />
                    <span className="max-w-full truncate text-[10px] font-medium">{p.name}</span>
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      ) : null}
    </div>
  );
}
