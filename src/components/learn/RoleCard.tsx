import Link from "next/link";
import { getPokemon } from "@/lib/catalog/load";
import { PokemonArt } from "@/components/pokemon/PokemonArt";
import type { RoleGuide } from "@/content/roles";
import { roleHref } from "@/content/roles";

export function RoleCard({ role }: { role: RoleGuide }) {
  const example = getPokemon(role.exampleSlug);
  return (
    <Link
      href={roleHref(role.id)}
      className="flex gap-4 rounded-3xl border border-line bg-raised/50 p-4 hover:bg-raised"
    >
      {example ? (
        <PokemonArt slug={example.slug} src={example.artwork} name={example.name} size={72} />
      ) : null}
      <div className="min-w-0">
        <h2 className="text-xl font-semibold">{role.name}</h2>
        <p className="mt-1 text-sm text-muted">{role.oneLiner}</p>
      </div>
    </Link>
  );
}
