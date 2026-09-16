"use client";

import { useEffect, useMemo, useState } from "react";
import { MagnifyingGlass, X } from "@phosphor-icons/react";
import { ensureSearchRoster, searchLegal, pokemonFromSearch } from "@/lib/catalog/client-search";
import { getPokemon } from "@/lib/catalog/lookup";
import { cssVars } from "@/lib/champions/palette";
import { PokemonArt } from "@/components/pokemon/PokemonArt";
import { MAX_FOES, useLiveMatchStore } from "@/stores/live-match";

export function LiveFoeSearch({ exclude }: { exclude: string[] }) {
  const foes = useLiveMatchStore((s) => s.foes);
  const recent = useLiveMatchStore((s) => s.recent);
  const focusSlug = useLiveMatchStore((s) => s.focusSlug);
  const addFoe = useLiveMatchStore((s) => s.addFoe);
  const removeFoe = useLiveMatchStore((s) => s.removeFoe);
  const setFocus = useLiveMatchStore((s) => s.setFocus);
  const clearFoes = useLiveMatchStore((s) => s.clearFoes);

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

  const blocked = new Set(exclude);

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-end justify-between gap-2">
        <div>
          <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.14em] text-muted">
            Their preview
          </p>
          <h2 className="mt-1 text-lg font-semibold tracking-tight">Up to {MAX_FOES}</h2>
        </div>
        {foes.length ? (
          <button type="button" onClick={() => clearFoes()} className="text-xs text-muted underline hover:text-ink">
            Clear
          </button>
        ) : null}
      </div>

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
      </div>

      {hits.length ? (
        <ul className="flex flex-wrap gap-2">
          {hits.map((p) => (
            <li key={p.slug}>
              <button
                type="button"
                onClick={() => {
                  addFoe(p.slug);
                  setQ("");
                }}
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

      <ul className="flex flex-wrap gap-2">
        {foes.map((slug) => {
          const p = getPokemon(slug) ?? pokemonFromSearch(slug);
          if (!p) return null;
          const on = focusSlug === slug;
          return (
            <li key={slug}>
              <div
                className={`inline-flex items-center gap-1 rounded-full border py-1 pl-1 pr-1.5 transition ${
                  on ? "border-ink/50 bg-white/10" : "border-line bg-bg/40"
                }`}
                style={cssVars(p.palette)}
              >
                <button
                  type="button"
                  onClick={() => setFocus(slug)}
                  className="inline-flex items-center gap-2 pr-1 text-sm"
                >
                  <PokemonArt slug={p.slug} src={p.sprite || p.artwork} name={p.name} size={32} />
                  {p.name}
                </button>
                <button
                  type="button"
                  aria-label={`Remove ${p.name}`}
                  onClick={() => removeFoe(slug)}
                  className="rounded-full p-1 text-muted hover:bg-white/10 hover:text-ink"
                >
                  <X size={12} weight="bold" />
                </button>
              </div>
            </li>
          );
        })}
      </ul>

      {!foes.length && recent.length ? (
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.12em] text-muted">Recent</p>
          <ul className="mt-1.5 flex flex-wrap gap-2">
            {recent
              .filter((s) => !blocked.has(s))
              .slice(0, 5)
              .map((slug) => {
                const p = getPokemon(slug);
                if (!p) return null;
                return (
                  <li key={slug}>
                    <button
                      type="button"
                      onClick={() => addFoe(slug)}
                      className="inline-flex items-center gap-1.5 rounded-full border border-line/70 px-2.5 py-1 text-xs text-muted transition hover:text-ink"
                    >
                      {p.name}
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
