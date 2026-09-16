import Link from "next/link";
import { PageFrame } from "@/components/chrome/PageFrame";
import { featuredPokemon, getEditorial, regulation } from "@/lib/catalog/load";
import { PokemonCard } from "@/components/pokemon/PokemonCard";

export default function HomePage() {
  const featured = featuredPokemon().slice(0, 3);
  return (
    <PageFrame variant="board" className="space-y-16">
      <section className="grid items-end gap-10 lg:grid-cols-[1.2fr_0.8fr]">
        <div>
          <p className="text-sm text-muted">
            {regulation.name} · {regulation.starts} to {regulation.ends}
          </p>
          <h1 className="mt-3 max-w-[14ch] text-5xl font-semibold tracking-tight md:text-6xl">
            Sit ringside. Learn the fight.
          </h1>
          <p className="mt-5 max-w-[42ch] text-lg text-muted">
            Pokémon Champions, taught first. Legal roster, then a three.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/learn" className="rounded-full bg-ink px-5 py-2.5 text-sm font-medium text-bg">
              Start learning
            </Link>
            <Link href="/live" className="rounded-full border border-line px-5 py-2.5 text-sm">
              Live Match
            </Link>
            <Link href="/pokedex" className="rounded-full border border-line px-5 py-2.5 text-sm">
              Browse the roster
            </Link>
          </div>
        </div>
        <ol className="space-y-4 text-sm">
          <li className="rounded-2xl border border-line bg-raised/60 p-4">A Pokémon is a job, not a spreadsheet.</li>
          <li className="rounded-2xl border border-line bg-raised/60 p-4">Build a three around one win condition.</li>
          <li className="rounded-2xl border border-line bg-raised/60 p-4">Read their list. Then send.</li>
        </ol>
      </section>

      <section>
        <div className="flex flex-wrap gap-4 text-sm text-muted">
          <Link href="/meta" className="underline hover:text-ink">
            Meta
          </Link>
          <Link href="/regulation">Regulation</Link>
          <Link href="/glossary">Glossary</Link>
          <Link href="/about">About</Link>
        </div>
        <h2 className="mt-10 text-2xl font-semibold tracking-tight">Three to know this format</h2>
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {featured.map((p) => (
            <PokemonCard key={p.slug} pokemon={p} job={getEditorial(p.slug)?.job} density="display" />
          ))}
        </div>
      </section>
    </PageFrame>
  );
}
