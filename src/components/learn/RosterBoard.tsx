import Link from "next/link";
import { getPokemon } from "@/lib/catalog/load";
import { cssVars } from "@/lib/champions/palette";
import { PokemonArt } from "@/components/pokemon/PokemonArt";
import { TypeBadge } from "@/components/pokemon/TypeBadge";
import { ROLE_LABEL, roleHref } from "@/content/roles";
import { getLiteracyRole } from "@/content/literacy-roles";
import type { ArchetypeSlot } from "@/content/archetypes";

export function RosterBoard({ roster }: { roster: ArchetypeSlot[] }) {
  return (
    <ol className="mt-6 space-y-4">
      {roster.map((slot) => {
        const example = getPokemon(slot.exampleSlug);
        const lit = getLiteracyRole(slot.literacy);
        return (
          <li
            key={`${slot.job}-${slot.exampleSlug}-${slot.alias}`}
            className="rounded-3xl border border-line bg-raised/40 p-4"
            style={example ? cssVars(example.palette) : undefined}
          >
            <div className="flex gap-4">
              {example ? (
                <Link href={`/pokemon/${example.slug}`} className="shrink-0">
                  <PokemonArt slug={example.slug} src={example.artwork} name={example.name} size={72} />
                </Link>
              ) : null}
              <div className="min-w-0">
                <p className="text-xs text-muted">
                  <Link href={roleHref(slot.job)} className="underline">
                    {ROLE_LABEL[slot.job]}
                  </Link>
                  {lit ? ` · ${slot.alias}` : null}
                </p>
                {example ? (
                  <Link href={`/pokemon/${example.slug}`} className="mt-1 block font-semibold">
                    {example.name}
                  </Link>
                ) : (
                  <p className="mt-1 font-semibold">{slot.alias}</p>
                )}
                {example ? (
                  <div className="mt-1 flex flex-wrap gap-1">
                    {example.types.map((t) => (
                      <TypeBadge key={t} type={t} size="sm" />
                    ))}
                  </div>
                ) : null}
                <p className="mt-2 text-sm text-muted">{slot.why}</p>
              </div>
            </div>
          </li>
        );
      })}
    </ol>
  );
}
