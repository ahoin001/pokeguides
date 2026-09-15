import { getPokemon } from "@/lib/catalog/load";
import { MatchupField } from "@/components/viz/MatchupField";
import { PokemonArt } from "@/components/pokemon/PokemonArt";
import { cssVars } from "@/lib/champions/palette";

const BAD = ["garchomp", "salamence-mega"] as const;
const PATCHED = ["garchomp", "kingambit", "gholdengo"] as const;

export function HolesCompare() {
  return (
    <div className="grid gap-8 lg:grid-cols-2">
      <Column title="Ice hole" slugs={[...BAD]} note="Two Dragons. Ice is 4× twice. There is no switch." />
      <Column
        title="Patched"
        slugs={[...PATCHED]}
        note="Gholdengo eats Fairy and Fighting. Kingambit still hates Earthquake — that is a different hole."
      />
    </div>
  );
}

function Column({ title, slugs, note }: { title: string; slugs: string[]; note: string }) {
  const mons = slugs.map((s) => getPokemon(s)).filter(Boolean);
  const face = mons[title === "Patched" ? mons.length - 1 : 0];
  const types = face?.types ?? [];
  return (
    <div className="rounded-[28px] border border-line bg-raised/40 p-4">
      <h3 className="font-semibold tracking-tight">{title}</h3>
      <div className="mt-3 flex gap-3">
        {mons.map((p) =>
          p ? (
            <div key={p.slug} className="text-center" style={cssVars(p.palette)}>
              <PokemonArt slug={p.slug} src={p.artwork} name={p.name} size={56} />
              <p className="mt-1 text-[11px]">{p.name}</p>
            </div>
          ) : null,
        )}
      </div>
      <p className="mt-3 text-sm text-muted">{note}</p>
      <div className="mt-4">
        <MatchupField types={types} />
      </div>
    </div>
  );
}
