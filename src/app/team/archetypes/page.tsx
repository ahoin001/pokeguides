import Link from "next/link";
import { PageFrame } from "@/components/chrome/PageFrame";
import {
  ARCHETYPES,
  ARCHETYPE_LABEL,
  MARGIN_LABEL,
  PACING_LABEL,
  archetypeHref,
} from "@/content/archetypes";
import { getPokemon } from "@/lib/catalog/load";
import { cssVars } from "@/lib/champions/palette";
import { PokemonArt } from "@/components/pokemon/PokemonArt";

export const metadata = {
  title: "Team archetypes · Ringside",
  description: "Champions Singles team styles — what they look like, what beats them, what to build.",
};

export default function TeamArchetypesHubPage() {
  return (
    <PageFrame variant="board">
      <header className="max-w-2xl">
        <p className="font-mono text-xs uppercase tracking-[0.16em] text-muted">Team archetypes</p>
        <h1 className="mt-2 text-4xl font-semibold tracking-tight md:text-5xl">
          Name the plan on preview
        </h1>
        <p className="mt-3 text-lg text-muted">
          Six Singles styles. Each playbook covers tells, staples, answers, and what the style beats or
          loses to — so you know what you are facing and what to aim at.
        </p>
      </header>

      <ul className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {ARCHETYPES.map((a) => {
          const tells = a.tells
            .map((t) => getPokemon(t.slug))
            .filter(Boolean)
            .slice(0, 3);
          const wash = tells[0];
          return (
            <li key={a.id}>
              <Link
                href={archetypeHref(a.id)}
                className="flex h-full flex-col rounded-[28px] border border-line/70 bg-raised/40 p-5 transition hover:border-ink/40"
                style={wash ? cssVars(wash.palette) : undefined}
              >
                <div className="flex gap-2">
                  {tells.map((p) =>
                    p ? (
                      <PokemonArt
                        key={p.slug}
                        slug={p.slug}
                        src={p.sprite || p.artwork}
                        name={p.name}
                        size={48}
                      />
                    ) : null,
                  )}
                </div>
                <h2 className="mt-4 text-xl font-semibold tracking-tight">
                  {ARCHETYPE_LABEL[a.id]}
                </h2>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-muted">{a.oneLiner}</p>
                <p className="mt-4 font-mono text-[10px] uppercase tracking-[0.12em] text-muted">
                  {PACING_LABEL[a.pacing]} · {MARGIN_LABEL[a.margin]}
                </p>
              </Link>
            </li>
          );
        })}
      </ul>

      <p className="mt-10 text-sm text-muted">
        Still learning the names?{" "}
        <Link href="/learn/archetypes" className="underline hover:text-ink">
          Open the archetypes lesson
        </Link>{" "}
        or{" "}
        <Link href="/learn/reading-their-six" className="underline hover:text-ink">
          reading their six
        </Link>
        .
      </p>
    </PageFrame>
  );
}
