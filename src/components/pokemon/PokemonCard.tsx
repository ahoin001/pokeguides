"use client";

import Link from "next/link";
import { cssVars } from "@/lib/champions/palette";
import { useCompareStore } from "@/stores/compare";
import { useMotionSession } from "@/stores/motion-session";
import { useTeamStore } from "@/stores/team";
import type { CatalogEntry } from "@/types/pokemon";
import { PokemonArt } from "./PokemonArt";
import { TypeBadge } from "./TypeBadge";
import { UsageBadge } from "./UsageBadge";

type Density = "display" | "catalog" | "compact";

export function PokemonCard({
  pokemon,
  density = "catalog",
  job,
}: {
  pokemon: CatalogEntry;
  density?: Density;
  job?: string;
}) {
  const setOrigin = useMotionSession((s) => s.setOrigin);
  const addTeam = useTeamStore((s) => s.add);
  const toggleCompare = useCompareStore((s) => s.toggle);
  const compared = useCompareStore((s) => s.slugs.includes(pokemon.slug));

  const art = density === "compact" ? 56 : density === "display" ? 200 : 140;

  return (
    <article
      className="group relative overflow-hidden rounded-3xl border border-line/80 bg-raised/70"
      style={cssVars(pokemon.palette)}
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-80"
        style={{
          background: `radial-gradient(80% 70% at 70% 20%, color-mix(in srgb, var(--mon-wash) 38%, transparent), transparent 70%)`,
        }}
      />
      <Link
        href={`/pokemon/${pokemon.slug}`}
        onClick={() => setOrigin(pokemon.slug)}
        className={`relative flex ${density === "compact" ? "items-center gap-3 p-3" : "flex-col p-4"}`}
      >
        <PokemonArt
          slug={pokemon.slug}
          src={density === "compact" ? pokemon.sprite || pokemon.artwork : pokemon.artwork}
          name={pokemon.name}
          share
          size={art}
          className={density === "catalog" ? "mx-auto" : ""}
        />
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <p className="font-mono text-[11px] text-muted">#{String(pokemon.dexNo).padStart(3, "0")}</p>
            <UsageBadge slug={pokemon.slug} linked={false} />
          </div>
          <h3 className="truncate text-lg font-semibold tracking-tight">{pokemon.name}</h3>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {pokemon.types.map((t) => (
              <TypeBadge key={t} type={t} size="sm" />
            ))}
          </div>
          {job ? <p className="mt-2 line-clamp-2 text-sm text-muted">{job}</p> : null}
        </div>
      </Link>
      {density !== "display" ? (
        <div className="relative flex gap-2 border-t border-line/60 px-3 py-2 md:opacity-0 md:transition md:group-hover:opacity-100">
          <button
            type="button"
            onClick={() => toggleCompare(pokemon.slug)}
            className={`rounded-full px-3 py-1 text-xs ${compared ? "bg-ink text-bg" : "bg-white/5"}`}
          >
            Compare
          </button>
          <button
            type="button"
            onClick={() => addTeam(pokemon.slug)}
            className="rounded-full bg-white/5 px-3 py-1 text-xs"
          >
            Add to team
          </button>
          <UsageBadge slug={pokemon.slug} className="ml-auto" />
        </div>
      ) : null}
    </article>
  );
}
