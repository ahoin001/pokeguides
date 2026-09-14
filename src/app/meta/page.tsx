import Link from "next/link";
import { featuredPokemon, getEditorial, regulation } from "@/lib/catalog/load";
import { PokemonCard } from "@/components/pokemon/PokemonCard";

export default function MetaPage() {
  const featured = featuredPokemon();
  return (
    <div className="max-w-3xl">
      <p className="text-sm text-muted">Snapshot · {regulation.id} · not live usage</p>
      <h1 className="mt-2 text-4xl font-semibold tracking-tight">What to prepare for</h1>
      <p className="mt-4 text-lg text-muted">
        Rillaboom walked into M-C with Grassy Terrain and Fake Out. Kingambit still asks if you packed Fighting.
        Mega Salamence and Mega Charizard Y are the preview Megas people plan around. This page is editorial, not a
        scraped ladder.
      </p>
      <p className="mt-4 text-sm text-muted">
        Dates: {regulation.starts} to {regulation.ends}.{" "}
        <Link href="/regulation" className="underline">
          Full rules
        </Link>
      </p>
      <div className="mt-10 grid gap-4 sm:grid-cols-2">
        {featured.map((p) => (
          <PokemonCard key={p.slug} pokemon={p} job={getEditorial(p.slug)?.job} />
        ))}
      </div>
    </div>
  );
}
