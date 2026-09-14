import { getPokemon } from "@/lib/catalog/load";
import { PokemonCard } from "@/components/pokemon/PokemonCard";
import { getEditorial } from "@/lib/catalog/load";

export function SampleSix({ slugs, note }: { slugs: string[]; note?: string }) {
  const mons = slugs.map((s) => getPokemon(s)).filter(Boolean);
  return (
    <div>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {mons.map((p) =>
          p ? <PokemonCard key={p.slug} pokemon={p} job={getEditorial(p.slug)?.job} density="compact" /> : null,
        )}
      </div>
      {note ? <p className="mt-3 text-sm text-muted">{note}</p> : null}
    </div>
  );
}
