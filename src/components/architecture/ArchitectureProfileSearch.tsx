"use client";

import { useMemo, useState } from "react";
import { ArchitectureProfileCard } from "@/components/architecture/ArchitectureProfileCard";
import { searchArchitectureProfiles } from "@/lib/architecture/load";
import { getPokemon } from "@/lib/catalog/lookup";
import { PokemonArt } from "@/components/pokemon/PokemonArt";

export function ArchitectureProfileSearch({
  partySlugs = [],
  initialSlug = null,
}: {
  partySlugs?: string[];
  initialSlug?: string | null;
}) {
  const [q, setQ] = useState("");
  const [slug, setSlug] = useState<string | null>(initialSlug);

  const results = useMemo(() => searchArchitectureProfiles(q, 10), [q]);
  const active = slug ?? initialSlug ?? results[0]?.slug ?? null;

  return (
    <div className="space-y-4">
      <div>
        <label className="font-mono text-[10px] uppercase tracking-[0.14em] text-muted" htmlFor="arch-search">
          Search architecture profile
        </label>
        <input
          id="arch-search"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Name, slug, or archetype…"
          className="mt-1.5 w-full rounded-2xl border border-line bg-bg/60 px-3.5 py-2.5 text-sm outline-none ring-ink/20 focus:ring-2"
        />
        {results.length ? (
          <ul className="mt-2 flex max-h-40 flex-wrap gap-1.5 overflow-y-auto">
            {results.map((p) => {
              const mon = getPokemon(p.slug);
              const on = active === p.slug;
              return (
                <li key={p.slug}>
                  <button
                    type="button"
                    onClick={() => setSlug(p.slug)}
                    className={`inline-flex items-center gap-1.5 rounded-full border px-2 py-1 text-xs transition ${
                      on
                        ? "border-ink bg-ink text-bg"
                        : "border-line bg-raised/40 text-muted hover:text-ink"
                    }`}
                  >
                    {mon ? (
                      <PokemonArt
                        slug={mon.slug}
                        src={mon.sprite || mon.artwork}
                        name={mon.name}
                        size={18}
                      />
                    ) : null}
                    {p.name}
                  </button>
                </li>
              );
            })}
          </ul>
        ) : (
          <p className="mt-2 text-xs text-muted">No scored profiles match.</p>
        )}
      </div>

      {active ? (
        <ArchitectureProfileCard slug={active} partySlugs={partySlugs} />
      ) : null}
    </div>
  );
}
