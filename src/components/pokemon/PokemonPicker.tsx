"use client";

import { useEffect, useMemo, useState } from "react";
import { ensureSearchRoster, searchLegal } from "@/lib/catalog/client-search";
import { getPokemon } from "@/lib/catalog/lookup";
import { usageForSlug } from "@/lib/ranked/usage-client";
import { TypeBadge } from "./TypeBadge";
import { ROLE_LABEL } from "@/content/roles";
import type { Suggestion } from "@/lib/champions/suggest";
import { rankedPartnerCite } from "@/lib/ranked/partners";
import { useMyBoxStore } from "@/stores/my-box";
import type { CatalogEntry } from "@/types/pokemon";

const SOURCE_LABEL: Record<Suggestion["source"], string> = {
  ranked: "Ranked",
  starter: "Usage",
  classroom: "Classroom",
  coverage: "Coverage",
  archetype: "Style",
};

export function PokemonPicker({
  onPick,
  exclude = [],
  suggested = [],
  autoFocus = true,
}: {
  onPick: (slug: string) => void;
  exclude?: string[];
  suggested?: Suggestion[];
  autoFocus?: boolean;
}) {
  const [q, setQ] = useState("");
  const [ready, setReady] = useState(false);
  const owned = useMyBoxStore((s) => s.owned);
  const filterBuilders = useMyBoxStore((s) => s.filterBuilders);
  const [boxOnly, setBoxOnly] = useState(filterBuilders);

  useEffect(() => {
    setBoxOnly(filterBuilders);
  }, [filterBuilders]);

  useEffect(() => {
    void ensureSearchRoster().then(() => setReady(true));
  }, []);

  const ownedSet = useMemo(() => new Set(owned), [owned]);

  const results = useMemo(() => {
    if (!ready) return [];
    let list: CatalogEntry[];
    if (boxOnly) {
      const needle = q.trim().toLowerCase();
      list = owned
        .map((slug) => getPokemon(slug))
        .filter((p): p is CatalogEntry => Boolean(p))
        .filter((p) => !exclude.includes(p.slug))
        .filter(
          (p) =>
            !needle ||
            p.name.toLowerCase().includes(needle) ||
            p.slug.includes(needle) ||
            p.types.some((t) => t.includes(needle)),
        )
        .sort((a, b) => a.name.localeCompare(b.name))
        .slice(0, 24);
    } else {
      list = searchLegal(q)
        .filter((p) => !exclude.includes(p.slug))
        .slice(0, 12);
    }
    return list;
  }, [q, exclude, ready, boxOnly, owned]);

  const shown = suggested.filter((s) => {
    if (exclude.includes(s.pokemon.slug)) return false;
    if (boxOnly && !ownedSet.has(s.pokemon.slug)) return false;
    return true;
  });

  return (
    <div>
      <div className="flex flex-wrap items-center gap-2">
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder={boxOnly ? "Search your box…" : "Search the legal roster"}
          className="min-w-0 flex-1 rounded-2xl border border-line bg-sunken px-4 py-3 text-ink outline-none placeholder:text-muted focus:border-ink/40"
          autoFocus={autoFocus}
        />
        <button
          type="button"
          onClick={() => setBoxOnly((v) => !v)}
          className={`shrink-0 rounded-full px-3 py-2 text-xs transition ${
            boxOnly ? "bg-ink text-bg" : "border border-line text-muted hover:text-ink"
          }`}
        >
          {boxOnly ? "My box" : "All legal"}
        </button>
      </div>
      {boxOnly && !owned.length ? (
        <p className="mt-3 text-sm text-muted">
          Your box is empty. Add species on{" "}
          <a href="/team/box" className="underline">
            My box
          </a>{" "}
          or switch to All legal.
        </p>
      ) : null}
      {shown.length && !q.trim() ? (
        <div className="mt-4">
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <p className="text-xs font-medium uppercase tracking-wide text-muted">Suggested</p>
            <p className="font-mono text-[10px] text-muted">{rankedPartnerCite()}</p>
          </div>
          <ul className="mt-2 max-h-56 overflow-auto">
            {shown.map((s) => (
              <li key={s.pokemon.slug}>
                <button
                  type="button"
                  onClick={() => onPick(s.pokemon.slug)}
                  className="flex w-full items-start justify-between gap-3 rounded-xl px-3 py-2 text-left hover:bg-white/5"
                >
                  <span className="min-w-0">
                    <span className="block">{s.pokemon.name}</span>
                    <span className="mt-0.5 block text-xs text-muted">{s.why}</span>
                  </span>
                  <span className="shrink-0 text-right text-[10px] uppercase tracking-[0.08em] text-muted">
                    <span className="block">{SOURCE_LABEL[s.source]}</span>
                    <span className="mt-0.5 block normal-case tracking-normal">{ROLE_LABEL[s.job]}</span>
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
      <ul className="mt-3 max-h-72 overflow-auto">
        {results.map((p) => {
          const usage = usageForSlug(p.slug);
          const inBox = ownedSet.has(p.slug);
          return (
            <li key={p.slug}>
              <button
                type="button"
                onClick={() => onPick(p.slug)}
                className="flex w-full items-center justify-between rounded-xl px-3 py-2 text-left hover:bg-white/5"
              >
                <span>
                  <span className="block">
                    {p.name}
                    {!boxOnly && inBox ? (
                      <span className="ml-2 font-mono text-[10px] uppercase text-muted">owned</span>
                    ) : null}
                  </span>
                  {usage ? (
                    <span className="mt-0.5 block font-mono text-[10px] text-muted">
                      Singles #{usage.rank}
                      {usage.move ? ` · ${usage.move}` : ""}
                    </span>
                  ) : null}
                </span>
                <span className="flex gap-1">
                  {p.types.map((t) => (
                    <TypeBadge key={t} type={t} size="sm" />
                  ))}
                </span>
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
