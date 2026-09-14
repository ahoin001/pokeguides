import Link from "next/link";
import { notFound } from "next/navigation";
import { catalog, getEditorial, getPokemon } from "@/lib/catalog/load";
import { cssVars } from "@/lib/champions/palette";
import { statsWithSp } from "@/lib/champions/stats";
import { PokemonArt } from "@/components/pokemon/PokemonArt";
import { TypeBadge } from "@/components/pokemon/TypeBadge";
import { MatchupField } from "@/components/viz/MatchupField";
import { StatRadar } from "@/components/viz/StatRadar";
import { SpeedTape } from "@/components/viz/SpeedTape";
import { PokemonActions } from "@/components/pokemon/PokemonActions";
import { ROLE_LABEL, roleHref, getRole } from "@/content/roles";
import { getLiteracyRole } from "@/content/literacy-roles";
import { scorePokemon } from "@/lib/champions/role-score";

export function generateStaticParams() {
  return catalog.map((p) => ({ slug: p.slug }));
}

export default async function PokemonPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const pokemon = getPokemon(slug);
  if (!pokemon) notFound();
  const ed = getEditorial(slug);
  const score = scorePokemon(pokemon);
  const lit = getLiteracyRole(score.literacy);
  const sample = ed ? statsWithSp(pokemon.stats, ed.sampleSp) : null;
  const partners = (ed?.partners ?? [])
    .map((s) => getPokemon(s))
    .filter(Boolean);

  return (
    <article style={cssVars(pokemon.palette)}>
      <div className="grid items-center gap-8 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="flex justify-center">
          <PokemonArt slug={pokemon.slug} src={pokemon.artwork} name={pokemon.name} share size={320} />
        </div>
        <div>
          <p className="font-mono text-sm text-muted">#{String(pokemon.dexNo).padStart(3, "0")}</p>
          <h1 className="mt-1 text-5xl font-semibold tracking-tight">{pokemon.name}</h1>
          <div className="mt-4 flex flex-wrap gap-2">
            {pokemon.types.map((t) => (
              <TypeBadge key={t} type={t} />
            ))}
            {pokemon.form !== "base" ? (
              <span className="rounded-full border border-line px-2.5 py-1 text-xs">{pokemon.form}</span>
            ) : null}
          </div>
          <p className="mt-5 max-w-[40ch] text-lg text-muted">
            {ed?.job ??
              (lit
                ? `Looks like a ${lit.name.toLowerCase()} — ${ROLE_LABEL[score.role].toLowerCase()} on a three.`
                : "Champions-legal. Types and stats from the catalog.")}
          </p>
          <PokemonActions slug={pokemon.slug} />
        </div>
      </div>

      <section className="mt-16">
        <h2 className="text-2xl font-semibold">On a team</h2>
        <p className="mt-2 text-muted">
          {score.guessed ? "Guessed job: " : "Role: "}
          <Link href={roleHref(score.role)} className="underline">
            {ROLE_LABEL[score.role]}
          </Link>
          {lit ? ` · ${lit.name}` : null}
          {ed ? `. ${getRole(ed.role)?.oneLiner} Common kit: ${ed.kit}.` : ". Stats, ability, and kit — not a set."}
        </p>
        <ul className="mt-4 space-y-2 text-sm text-muted">
          {score.why.slice(0, 4).map((line) => (
            <li key={line}>{line}</li>
          ))}
        </ul>
        {partners.length ? (
          <div className="mt-4 flex flex-wrap gap-3 text-sm">
            {partners.map((p) =>
              p ? (
                <Link key={p.slug} href={`/pokemon/${p.slug}`} className="rounded-full bg-white/5 px-3 py-1">
                  {p.name}
                </Link>
              ) : null,
            )}
          </div>
        ) : null}
      </section>

      <section className="mt-16">
        <h2 className="text-2xl font-semibold">Matchup</h2>
        <div className="mt-6">
          <MatchupField types={pokemon.types} />
        </div>
      </section>

      <section className="mt-16 grid gap-10 md:grid-cols-2">
        <div>
          <h2 className="text-2xl font-semibold">Stats</h2>
          <StatRadar stats={pokemon.stats} />
          <dl className="mt-4 grid grid-cols-3 gap-3 font-mono text-sm">
            {(["hp", "atk", "def", "spa", "spd", "spe"] as const).map((k) => (
              <div key={k}>
                <dt className="text-muted uppercase">{k}</dt>
                <dd>{pokemon.stats[k]}</dd>
              </div>
            ))}
          </dl>
          {sample && ed ? (
            <p className="mt-4 text-sm text-muted">
              Sample 66 SP spread lands near {sample.spe} speed and {sample.hp} HP. Budget checked in the catalog.
            </p>
          ) : null}
        </div>
        <div>
          <h2 className="text-2xl font-semibold">Speed tape</h2>
          <div className="mt-6">
            <SpeedTape mons={[pokemon]} />
          </div>
          <h3 className="mt-8 text-sm text-muted">Abilities</h3>
          <p className="mt-2 capitalize">{pokemon.abilities.join(", ")}</p>
        </div>
      </section>
    </article>
  );
}
