"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { MagnifyingGlass, Plus, X } from "@phosphor-icons/react";
import { ensureSearchRoster, searchLegal } from "@/lib/catalog/client-search";
import { getPokemon } from "@/lib/catalog/lookup";
import { cssVars } from "@/lib/champions/palette";
import { PokemonArt } from "@/components/pokemon/PokemonArt";
import { TypeBadge } from "@/components/pokemon/TypeBadge";
import { useMyBoxStore } from "@/stores/my-box";
import { useTeamStore } from "@/stores/team";

export function MyBoxBoard() {
  const owned = useMyBoxStore((s) => s.owned);
  const extras = useMyBoxStore((s) => s.extras);
  const filterBuilders = useMyBoxStore((s) => s.filterBuilders);
  const add = useMyBoxStore((s) => s.add);
  const remove = useMyBoxStore((s) => s.remove);
  const removeExtra = useMyBoxStore((s) => s.removeExtra);
  const setFilterBuilders = useMyBoxStore((s) => s.setFilterBuilders);
  const resetToSeed = useMyBoxStore((s) => s.resetToSeed);
  const addTeam = useTeamStore((s) => s.add);

  const [q, setQ] = useState("");
  const [addQ, setAddQ] = useState("");
  const [ready, setReady] = useState(false);

  useEffect(() => {
    void ensureSearchRoster().then(() => setReady(true));
  }, []);

  const mons = useMemo(() => {
    return owned
      .map((slug) => getPokemon(slug))
      .filter((p): p is NonNullable<typeof p> => Boolean(p))
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [owned]);

  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase();
    if (!needle) return mons;
    return mons.filter(
      (p) =>
        p &&
        (p.name.toLowerCase().includes(needle) ||
          p.slug.includes(needle) ||
          p.types.some((t) => t.includes(needle))),
    );
  }, [mons, q]);

  const addHits = useMemo(() => {
    if (!ready || !addQ.trim()) return [];
    return searchLegal(addQ)
      .filter((p) => !owned.includes(p.slug))
      .slice(0, 8);
  }, [addQ, ready, owned]);

  return (
    <div className="space-y-10">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div className="max-w-xl">
          <p className="font-mono text-xs uppercase tracking-[0.16em] text-muted">My box</p>
          <h1 className="mt-2 text-4xl font-semibold tracking-tight md:text-5xl">Your collection</h1>
          <p className="mt-3 text-muted">
            Local-only box for this browser — {owned.length} legal species. Team builder and Live can
            prefer these when the filter is on.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setFilterBuilders(!filterBuilders)}
            className={`rounded-full px-4 py-2 text-sm transition ${
              filterBuilders ? "bg-ink text-bg" : "border border-line text-muted hover:text-ink"
            }`}
          >
            {filterBuilders ? "Filter on" : "Filter off"} — builders
          </button>
          <button
            type="button"
            onClick={() => {
              if (confirm("Reset box to the seeded collection?")) resetToSeed();
            }}
            className="rounded-full border border-line px-4 py-2 text-sm text-muted hover:text-ink"
          >
            Reset seed
          </button>
        </div>
      </header>

      <section className="rounded-[28px] border border-line/70 bg-raised/30 p-4 md:p-5">
        <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.14em] text-muted">
          Add from roster
        </p>
        <div className="relative mt-3">
          <MagnifyingGlass
            size={16}
            className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-muted"
          />
          <input
            value={addQ}
            onChange={(e) => setAddQ(e.target.value)}
            placeholder={ready ? "Search legal Pokémon to own…" : "Loading roster…"}
            disabled={!ready}
            className="w-full rounded-2xl border border-line bg-sunken py-3 pl-10 pr-4 text-sm md:max-w-md"
          />
        </div>
        {addHits.length ? (
          <ul className="mt-3 flex flex-wrap gap-2">
            {addHits.map((p) => (
              <li key={p.slug}>
                <button
                  type="button"
                  onClick={() => {
                    add(p.slug);
                    setAddQ("");
                  }}
                  className="inline-flex items-center gap-2 rounded-full border border-line bg-bg/50 py-1 pl-1 pr-3 text-sm transition hover:border-ink/40"
                  style={cssVars(p.palette)}
                >
                  <PokemonArt slug={p.slug} src={p.sprite || p.artwork} name={p.name} size={28} />
                  {p.name}
                  <Plus size={12} weight="bold" />
                </button>
              </li>
            ))}
          </ul>
        ) : null}
      </section>

      <div className="relative max-w-md">
        <MagnifyingGlass
          size={16}
          className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-muted"
        />
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Filter your box…"
          className="w-full rounded-2xl border border-line bg-sunken py-3 pl-10 pr-4 text-sm"
        />
      </div>

      <ul className="grid gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
        {filtered.map((p) =>
          p ? (
            <li key={p.slug}>
              <div
                className="flex h-full flex-col rounded-2xl border border-line/70 bg-raised/40 p-3"
                style={cssVars(p.palette)}
              >
                <div className="flex items-start justify-between gap-2">
                  <Link href={`/pokemon/${p.slug}`} className="flex min-w-0 items-center gap-2">
                    <PokemonArt slug={p.slug} src={p.artwork} name={p.name} size={56} />
                    <span className="min-w-0">
                      <span className="block truncate font-medium tracking-tight">{p.name}</span>
                      <span className="mt-1 flex flex-wrap gap-1">
                        {p.types.map((t) => (
                          <TypeBadge key={t} type={t} size="sm" />
                        ))}
                      </span>
                    </span>
                  </Link>
                  <button
                    type="button"
                    aria-label={`Remove ${p.name}`}
                    onClick={() => remove(p.slug)}
                    className="rounded-full p-1.5 text-muted hover:bg-white/10 hover:text-ink"
                  >
                    <X size={14} weight="bold" />
                  </button>
                </div>
                <button
                  type="button"
                  onClick={() => addTeam(p.slug)}
                  className="mt-3 rounded-full border border-line px-3 py-1.5 text-xs transition hover:border-ink/40"
                >
                  Add to bring three
                </button>
              </div>
            </li>
          ) : null,
        )}
      </ul>

      {!filtered.length ? (
        <p className="text-sm text-muted">No owned species match that filter.</p>
      ) : null}

      {extras.length ? (
        <section>
          <h2 className="text-lg font-semibold tracking-tight">Off-roster notes</h2>
          <p className="mt-1 text-sm text-muted">
            You own these, but they are not (yet) on the Champions legal catalog used by the site.
          </p>
          <ul className="mt-4 space-y-2">
            {extras.map((e) => (
              <li
                key={e.name}
                className="flex flex-wrap items-start justify-between gap-3 rounded-2xl border border-dashed border-line/80 px-4 py-3"
              >
                <div>
                  <p className="font-medium">{e.name}</p>
                  <p className="mt-0.5 text-sm text-muted">{e.note}</p>
                </div>
                <button
                  type="button"
                  onClick={() => removeExtra(e.name)}
                  className="text-xs text-muted underline hover:text-ink"
                >
                  Dismiss
                </button>
              </li>
            ))}
          </ul>
        </section>
      ) : null}
    </div>
  );
}
