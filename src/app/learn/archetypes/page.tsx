import Link from "next/link";
import { ARCHETYPES, STYLE_ALIASES, archetypeHref, ARCHETYPE_LABEL } from "@/content/archetypes";
import { ArchetypeCard } from "@/components/learn/ArchetypeCard";
import { PlaystyleChooser } from "@/components/learn/PlaystyleChooser";

export default function ArchetypesHub() {
  return (
    <article className="mx-auto max-w-3xl">
      <p className="text-sm text-muted">
        <Link href="/learn" className="hover:text-ink">
          Learn
        </Link>
      </p>
      <h1 className="mt-2 text-4xl font-semibold tracking-tight">How a three wants to play</h1>
      <p className="mt-4 text-lg text-muted">
        An archetype is the plan. Balance is a chess match with a net. Hyper Offense is a sprint. Weather and Trick Room
        are modes the rest of the three is built to cash.
      </p>

      <ol className="mt-10 space-y-3">
        {ARCHETYPES.map((a) => (
          <li key={a.id}>
            <ArchetypeCard archetype={a} />
          </li>
        ))}
      </ol>

      <section className="mt-16">
        <h2 className="text-2xl font-semibold tracking-tight">Names you will hear</h2>
        <p className="mt-3 text-muted">
          Other games talk about three big styles. Champions keeps two of them and drops the third.
        </p>
        <ul className="mt-6 divide-y divide-line rounded-3xl border border-line">
          {STYLE_ALIASES.map((alias) => (
            <li key={alias.name} className="px-5 py-4">
              <p className="font-medium">
                {alias.name}
                {alias.mapsTo ? (
                  <>
                    {" "}
                    <span className="text-muted">is</span>{" "}
                    <Link href={archetypeHref(alias.mapsTo)} className="underline">
                      {ARCHETYPE_LABEL[alias.mapsTo]}
                    </Link>
                  </>
                ) : (
                  <span className="text-muted"> is not a Champions three</span>
                )}
              </p>
              <p className="mt-2 text-sm text-muted">{alias.body}</p>
            </li>
          ))}
        </ul>
      </section>

      <PlaystyleChooser />

      <Link href="/learn/preview" className="mt-12 block text-sm text-muted hover:text-ink">
        Next: Preview is the first turn
      </Link>
    </article>
  );
}
