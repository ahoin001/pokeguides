"use client";

import { useEffect, useMemo, useState } from "react";
import { ensureSearchRoster, searchLegal } from "@/lib/catalog/client-search";
import { PokemonArt } from "@/components/pokemon/PokemonArt";
import { TypeBadge } from "@/components/pokemon/TypeBadge";

export function NoteFoeSearch({
  exclude,
  taken,
  onPick,
  onCancel,
}: {
  exclude: string[];
  taken: string[];
  onPick: (slug: string) => void;
  onCancel: () => void;
}) {
  const [q, setQ] = useState("");
  const [ready, setReady] = useState(false);

  useEffect(() => {
    void ensureSearchRoster().then(() => setReady(true));
  }, []);

  const results = useMemo(() => {
    if (!ready) return [];
    return searchLegal(q).filter((p) => !exclude.includes(p.slug)).slice(0, 10);
  }, [q, exclude, ready]);

  return (
    <div className="rounded-[24px] border border-line bg-bg/95 p-4">
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm font-medium">Who are they sending?</p>
        <button type="button" onClick={onCancel} className="text-sm text-muted hover:text-ink">
          Cancel
        </button>
      </div>
      <input
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="Search the legal roster"
        className="mt-3 w-full rounded-2xl border border-line bg-sunken px-4 py-3 text-ink outline-none placeholder:text-muted focus:border-ink/40"
        autoFocus
      />
      <ul className="mt-2 max-h-56 overflow-auto">
        {results.map((p) => {
          const pinned = taken.includes(p.slug);
          return (
            <li key={p.slug}>
              <button
                type="button"
                onClick={() => onPick(p.slug)}
                className="flex w-full items-center justify-between gap-3 rounded-xl px-3 py-2 text-left hover:bg-white/5"
              >
                <span className="flex min-w-0 items-center gap-3">
                  <PokemonArt slug={p.slug} src={p.sprite || p.artwork} name={p.name} size={36} />
                  <span className="truncate">
                    {p.name}
                    {pinned ? <span className="ml-2 text-xs text-muted">· pinned · open</span> : null}
                  </span>
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
