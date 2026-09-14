"use client";

import { useMemo, useState } from "react";
import { catalog } from "@/lib/catalog/load";
import { searchCatalog } from "@/lib/catalog/search";
import { TypeBadge } from "./TypeBadge";
import { ROLE_LABEL } from "@/content/roles";
import type { Suggestion } from "@/lib/champions/suggest";

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
  const results = useMemo(() => {
    return searchCatalog(catalog, q).filter((p) => !exclude.includes(p.slug)).slice(0, 12);
  }, [q, exclude]);

  const shown = suggested.filter((s) => !exclude.includes(s.pokemon.slug));

  return (
    <div>
      <input
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="Search the legal roster"
        className="w-full rounded-2xl border border-line bg-sunken px-4 py-3 text-ink outline-none placeholder:text-muted focus:border-ink/40"
        autoFocus={autoFocus}
      />
      {shown.length && !q.trim() ? (
        <div className="mt-4">
          <p className="text-xs font-medium uppercase tracking-wide text-muted">Suggested</p>
          <ul className="mt-2 max-h-56 overflow-auto">
            {shown.map((s) => (
              <li key={s.pokemon.slug}>
                <button
                  type="button"
                  onClick={() => onPick(s.pokemon.slug)}
                  className="flex w-full items-start justify-between gap-3 rounded-xl px-3 py-2 text-left hover:bg-white/5"
                >
                  <span>
                    <span className="block">{s.pokemon.name}</span>
                    <span className="mt-0.5 block text-xs text-muted">{s.why}</span>
                  </span>
                  <span className="shrink-0 text-xs text-muted">{ROLE_LABEL[s.job]}</span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
      <ul className="mt-3 max-h-72 overflow-auto">
        {results.map((p) => (
          <li key={p.slug}>
            <button
              type="button"
              onClick={() => onPick(p.slug)}
              className="flex w-full items-center justify-between rounded-xl px-3 py-2 text-left hover:bg-white/5"
            >
              <span>{p.name}</span>
              <span className="flex gap-1">
                {p.types.map((t) => (
                  <TypeBadge key={t} type={t} size="sm" />
                ))}
              </span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
