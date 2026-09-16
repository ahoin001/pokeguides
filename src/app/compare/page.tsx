"use client";

import { useMemo, useState } from "react";
import { PageFrame } from "@/components/chrome/PageFrame";
import { getPokemon } from "@/lib/catalog/lookup";
import { cssVars } from "@/lib/champions/palette";
import { useCompareStore } from "@/stores/compare";
import { PokemonArt } from "@/components/pokemon/PokemonArt";
import { TypeBadge } from "@/components/pokemon/TypeBadge";
import { StatRadar } from "@/components/viz/StatRadar";
import { SpeedTape } from "@/components/viz/SpeedTape";
import { MatchupField } from "@/components/viz/MatchupField";
import { PokemonPicker } from "@/components/pokemon/PokemonPicker";
import type { CatalogEntry } from "@/types/pokemon";

export default function ComparePage() {
  const slugs = useCompareStore((s) => s.slugs);
  const add = useCompareStore((s) => s.add);
  const remove = useCompareStore((s) => s.remove);
  const [open, setOpen] = useState(false);
  const mons = useMemo(() => slugs.map((s) => getPokemon(s)).filter(Boolean), [slugs]);

  return (
    <PageFrame variant="tool">
      <h1 className="text-4xl font-semibold tracking-tight">Compare</h1>
      <p className="mt-2 text-muted">Two or three from the catalog. First paint is local.</p>
      <div className="mt-8 grid gap-4 md:grid-cols-3">
        {mons.map(
          (p) =>
            p && (
              <div key={p.slug} className="rounded-3xl border border-line p-4" style={cssVars(p.palette)}>
                <button type="button" onClick={() => remove(p.slug)} className="text-xs text-muted">
                  Remove
                </button>
                <PokemonArt slug={p.slug} src={p.artwork} name={p.name} share size={160} className="mx-auto" />
                <h2 className="mt-2 text-xl font-semibold">{p.name}</h2>
                <div className="mt-2 flex gap-1">
                  {p.types.map((t) => (
                    <TypeBadge key={t} type={t} size="sm" />
                  ))}
                </div>
                <StatRadar stats={p.stats} />
                <p className="font-mono text-sm text-muted">BST {p.stats.bst}</p>
              </div>
            ),
        )}
        {slugs.length < 3 ? (
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="min-h-48 rounded-3xl border border-dashed border-line text-muted"
          >
            Add Pokémon
          </button>
        ) : null}
      </div>
      {mons.length ? (
        <div className="mt-12 grid gap-10 lg:grid-cols-2">
          <SpeedTape mons={mons as CatalogEntry[]} />
          {mons[0] ? <MatchupField types={mons[0].types} /> : null}
        </div>
      ) : null}
      {open ? (
        <div className="fixed inset-0 z-50 flex items-end bg-black/50 p-4 md:items-center md:justify-center">
          <div className="w-full max-w-lg rounded-t-3xl bg-raised p-5 md:rounded-3xl">
            <button type="button" className="mb-3 text-sm text-muted" onClick={() => setOpen(false)}>
              Close
            </button>
            <PokemonPicker
              exclude={slugs}
              onPick={(slug) => {
                add(slug);
                setOpen(false);
              }}
            />
          </div>
        </div>
      ) : null}
    </PageFrame>
  );
}
