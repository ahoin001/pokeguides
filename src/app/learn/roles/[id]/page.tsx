import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { LEARN_ROLE_IDS, getRole, ROLE_LABEL, roleHref } from "@/content/roles";
import { LITERACY_ROLES } from "@/content/literacy-roles";
import { ARCHETYPES, archetypeHref, ARCHETYPE_LABEL } from "@/content/archetypes";
import { getPokemon, getEditorial } from "@/lib/catalog/load";
import { cssVars } from "@/lib/champions/palette";
import { PokemonArt } from "@/components/pokemon/PokemonArt";
import { TypeBadge } from "@/components/pokemon/TypeBadge";

export function generateStaticParams() {
  return LEARN_ROLE_IDS.map((id) => ({ id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const role = getRole(id);
  if (!role || !LEARN_ROLE_IDS.includes(role.id)) return { title: "Job" };
  return {
    title: role.name,
    description: role.oneLiner,
  };
}

export default async function RolePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const role = getRole(id);
  if (!role || !LEARN_ROLE_IDS.includes(role.id)) notFound();
  const example = getPokemon(role.exampleSlug);
  const second = getPokemon(role.secondExampleSlug);
  const job = example ? getEditorial(example.slug)?.job : undefined;
  const literacy = LITERACY_ROLES.filter((l) => role.literacy.includes(l.id));
  const styles = ARCHETYPES.filter((a) => role.usedBy.includes(a.id));
  const nextId = LEARN_ROLE_IDS[LEARN_ROLE_IDS.indexOf(role.id) + 1];
  const next = nextId ? getRole(nextId) : undefined;

  return (
    <article className="mx-auto max-w-3xl" style={example ? cssVars(example.palette) : undefined}>
      <p className="text-sm text-muted">
        <Link href="/learn/jobs" className="hover:text-ink">
          Jobs
        </Link>
      </p>
      <h1 className="mt-2 text-4xl font-semibold tracking-tight">{role.name}</h1>
      <p className="mt-4 text-lg text-muted">{role.oneLiner}</p>

      <div className="mt-10 grid gap-4 sm:grid-cols-2">
        {example ? <ExampleFace pokemon={example} job={job} label="Classroom" /> : null}
        {second ? (
          <ExampleFace
            pokemon={second}
            job={getEditorial(second.slug)?.job}
            label="Second example"
          />
        ) : null}
      </div>

      <p className="mt-10 text-[17px] leading-relaxed">{role.job}</p>

      <section className="mt-12">
        <h2 className="text-2xl font-semibold">How to spot it</h2>
        <ul className="mt-4 space-y-3 text-[17px] leading-relaxed text-muted">
          {role.spot.map((line) => (
            <li key={line}>{line}</li>
          ))}
        </ul>
      </section>

      <section className="mt-12">
        <h2 className="text-2xl font-semibold">What it needs</h2>
        <ul className="mt-4 space-y-3 text-[17px] leading-relaxed text-muted">
          {role.needs.map((line) => (
            <li key={line}>{line}</li>
          ))}
        </ul>
      </section>

      {literacy.length ? (
        <section className="mt-12">
          <h2 className="text-2xl font-semibold">On other sites</h2>
          <ul className="mt-4 space-y-3 text-sm text-muted">
            {literacy.map((l) => (
              <li key={l.id}>
                <span className="font-medium text-ink">{l.name}.</span> {l.spot}
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {styles.length ? (
        <section className="mt-12">
          <h2 className="text-2xl font-semibold">Used on these styles</h2>
          <div className="mt-4 flex flex-wrap gap-2">
            {styles.map((a) => (
              <Link key={a.id} href={archetypeHref(a.id)} className="rounded-full bg-white/5 px-3 py-1 text-sm">
                {ARCHETYPE_LABEL[a.id]}
              </Link>
            ))}
          </div>
        </section>
      ) : null}

      <Link href={`/pokedex?role=${role.id}`} className="mt-10 inline-block text-sm underline">
        Browse {ROLE_LABEL[role.id]} on the roster
      </Link>

      {next ? (
        <Link href={roleHref(next.id)} className="mt-12 block text-sm text-muted hover:text-ink">
          Next: {next.name}
        </Link>
      ) : (
        <Link href="/learn/building" className="mt-12 block text-sm text-muted hover:text-ink">
          Next: How you build a three
        </Link>
      )}
    </article>
  );
}

function ExampleFace({
  pokemon,
  job,
  label,
}: {
  pokemon: NonNullable<ReturnType<typeof getPokemon>>;
  job?: string;
  label: string;
}) {
  return (
    <div className="flex items-center gap-5 rounded-3xl border border-line bg-raised/50 p-5" style={cssVars(pokemon.palette)}>
      <PokemonArt slug={pokemon.slug} src={pokemon.artwork} name={pokemon.name} share size={96} />
      <div className="min-w-0">
        <p className="text-xs text-muted">{label}</p>
        <Link href={`/pokemon/${pokemon.slug}`} className="mt-1 block text-2xl font-semibold tracking-tight">
          {pokemon.name}
        </Link>
        <div className="mt-2 flex flex-wrap gap-1.5">
          {pokemon.types.map((t) => (
            <TypeBadge key={t} type={t} size="sm" />
          ))}
        </div>
        {job ? <p className="mt-2 text-sm text-muted">{job}</p> : null}
      </div>
    </div>
  );
}
