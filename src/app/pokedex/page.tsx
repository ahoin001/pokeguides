"use client";

import { useMemo } from "react";
import Link from "next/link";
import { parseAsString, parseAsStringLiteral, useQueryState } from "nuqs";
import { catalog } from "@/lib/catalog/load";
import { searchCatalog, sortCatalog, type SortKey } from "@/lib/catalog/search";
import { PokemonCard } from "@/components/pokemon/PokemonCard";
import { getEditorial } from "@/lib/catalog/load";
import { TYPE_IDS } from "@/types/pokemon";
import { TypeIcon } from "@/components/pokemon/TypeIcon";
import { LEARN_ROLE_IDS, ROLE_LABEL, getRole, roleHref } from "@/content/roles";

const SORTS = ["dex", "name", "bst", "spe"] as const;

export default function PokedexPage() {
  const [q, setQ] = useQueryState("q", parseAsString.withDefault(""));
  const [type, setType] = useQueryState("type", parseAsString.withDefault(""));
  const [role, setRole] = useQueryState("role", parseAsString.withDefault(""));
  const [sort, setSort] = useQueryState("sort", parseAsStringLiteral(SORTS).withDefault("dex"));

  const rows = useMemo(() => {
    const found = searchCatalog(catalog, q, {
      type: type as never,
      role: role as never,
    });
    return sortCatalog(found, sort as SortKey);
  }, [q, type, role, sort]);

  const roleGuide = role ? getRole(role) : undefined;

  return (
    <div>
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-4xl font-semibold tracking-tight">Legal roster</h1>
          <p className="mt-2 text-muted">{rows.length} Pokémon in the current catalog.</p>
        </div>
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search name, type, ability"
          className="w-full rounded-2xl border border-line bg-sunken px-4 py-3 md:max-w-sm"
        />
      </div>
      <div className="mt-6 flex flex-wrap items-center gap-2">
        <div className="flex flex-wrap gap-1.5">
          {TYPE_IDS.map((t) => {
            const on = type === t;
            return (
              <button
                key={t}
                type="button"
                aria-pressed={on}
                onClick={() => setType(on ? "" : t)}
                className={`rounded-full p-0.5 transition ${on ? "ring-2 ring-ink" : "opacity-50 hover:opacity-100"}`}
              >
                <TypeIcon type={t} size="sm" />
              </button>
            );
          })}
        </div>
        <select
          value={role}
          onChange={(e) => setRole(e.target.value)}
          className="rounded-full border border-line bg-raised px-3 py-2 text-sm"
        >
          <option value="">All roles</option>
          {LEARN_ROLE_IDS.map((r) => (
            <option key={r} value={r}>
              {ROLE_LABEL[r]}
            </option>
          ))}
        </select>
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value as (typeof SORTS)[number])}
          className="rounded-full border border-line bg-raised px-3 py-2 text-sm"
        >
          <option value="dex">Dex number</option>
          <option value="name">Name</option>
          <option value="bst">BST</option>
          <option value="spe">Speed</option>
        </select>
      </div>
      {roleGuide ? (
        <p className="mt-4 max-w-2xl text-sm text-muted">
          {roleGuide.oneLiner}{" "}
          <Link href={roleHref(roleGuide.id)} className="underline">
            What {ROLE_LABEL[roleGuide.id]} is
          </Link>
        </p>
      ) : null}
      <div className="mt-8 grid grid-cols-2 gap-3 md:grid-cols-4">
        {rows.map((p) => (
          <PokemonCard key={p.slug} pokemon={p} job={getEditorial(p.slug)?.job} />
        ))}
      </div>
    </div>
  );
}
