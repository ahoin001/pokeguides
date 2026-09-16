import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ARCHETYPES,
  getArchetype,
  archetypeHref,
  MARGIN_LABEL,
  PACING_LABEL,
  ARCHETYPE_LABEL,
  type ArchetypeEdge,
} from "@/content/archetypes";
import { getPokemon } from "@/lib/catalog/load";
import { cssVars } from "@/lib/champions/palette";
import { PokemonArt } from "@/components/pokemon/PokemonArt";
import { TypeBadge } from "@/components/pokemon/TypeBadge";
import { SampleSix } from "@/components/learn/SampleSix";
import { LoadSampleSix } from "@/components/learn/LoadSampleSix";
import { CompareSplit } from "@/components/learn/CompareSplit";
import { RosterBoard } from "@/components/learn/RosterBoard";
import { ARCHETYPE_IDS } from "@/types/pokemon";
import { manualsForArchetype, manualHref } from "@/content/manuals";

export function generateStaticParams() {
  return ARCHETYPE_IDS.map((id) => ({ id }));
}

export default async function ArchetypePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const style = getArchetype(id);
  if (!style) notFound();
  const coreMons = style.core.slugs.map((s) => getPokemon(s));
  const next = ARCHETYPES[ARCHETYPES.findIndex((a) => a.id === style.id) + 1];
  const wash = coreMons.find(Boolean);
  const manuals = manualsForArchetype(style.id);

  return (
    <article className="mx-auto max-w-3xl" style={wash ? cssVars(wash.palette) : undefined}>
      <p className="text-sm text-muted">
        <Link href="/learn/archetypes" className="hover:text-ink">
          Styles
        </Link>
      </p>
      <h1 className="mt-2 text-4xl font-semibold tracking-tight">{style.name}</h1>
      <p className="mt-4 text-lg text-muted">{style.oneLiner}</p>
      <p className="mt-3 text-sm text-muted">
        {PACING_LABEL[style.pacing]} · {MARGIN_LABEL[style.margin]}
      </p>

      <p className="mt-10 text-[17px] leading-relaxed">{style.philosophy}</p>

      <section className="mt-16">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 className="text-2xl font-semibold">On preview</h2>
            <p className="mt-2 text-sm text-muted">
              If you see these, you are likely facing {style.name}.{" "}
              <Link href="/learn/reading-their-six" className="underline hover:text-ink">
                Full tell board
              </Link>
              .
            </p>
          </div>
        </div>
        <ul className="mt-6 grid gap-3 sm:grid-cols-2">
          {style.tells.map((tell) => {
            const mon = getPokemon(tell.slug);
            if (!mon) return null;
            return (
              <li key={tell.slug}>
                <Link
                  href={`/pokemon/${mon.slug}`}
                  title={tell.why}
                  className="flex items-start gap-3 rounded-2xl border border-line bg-raised/50 p-3 transition hover:border-ink/40"
                  style={cssVars(mon.palette)}
                >
                  <PokemonArt slug={mon.slug} src={mon.artwork} name={mon.name} size={56} className="shrink-0" />
                  <span className="min-w-0">
                    <span className="block font-medium">{mon.name}</span>
                    <span className="mt-1 text-sm leading-relaxed text-muted">{tell.why}</span>
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>

        <div className="mt-10 grid gap-8 md:grid-cols-2">
          <PreviewEdges title="Strong into" edges={style.favors} />
          <PreviewEdges title="Weak into" edges={style.struggles} />
        </div>
      </section>

      <section className="mt-12 grid gap-6 md:grid-cols-3">
        <TurnBlock title="Lead" body={style.turnByTurn.lead} />
        <TurnBlock title="Mid" body={style.turnByTurn.mid} />
        <TurnBlock title="Late" body={style.turnByTurn.late} />
      </section>

      <section className="mt-16">
        <h2 className="text-2xl font-semibold">The core</h2>
        <p className="mt-2 text-muted">{style.core.name}</p>
        <div className="mt-4 flex flex-wrap gap-4">
          {coreMons.map((p) =>
            p ? (
              <Link
                key={p.slug}
                href={`/pokemon/${p.slug}`}
                className="flex items-center gap-3 rounded-2xl border border-line bg-raised/50 px-3 py-2"
                style={cssVars(p.palette)}
              >
                <PokemonArt slug={p.slug} src={p.artwork} name={p.name} size={56} />
                <span>
                  <span className="block font-medium">{p.name}</span>
                  <span className="mt-1 flex gap-1">
                    {p.types.map((t) => (
                      <TypeBadge key={t} type={t} size="sm" />
                    ))}
                  </span>
                </span>
              </Link>
            ) : null,
          )}
        </div>
        <p className="mt-4 text-[17px] leading-relaxed text-muted">{style.core.why}</p>
      </section>

      <section className="mt-16">
        <h2 className="text-2xl font-semibold">Jobs on the three</h2>
        <p className="mt-2 text-sm text-muted">
          Each slot is a Champions job. The alias is the name other guides use.
        </p>
        <RosterBoard roster={style.roster} />
      </section>

      <section className="mt-16">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <h2 className="text-2xl font-semibold">Sample three</h2>
          <LoadSampleSix slugs={style.sampleSix} intent={style.id} />
        </div>
        <div className="mt-4">
          <SampleSix slugs={style.sampleSix} note={style.sampleNote} />
        </div>
      </section>

      <section className="mt-16 grid gap-8 md:grid-cols-2">
        <div>
          <h2 className="text-2xl font-semibold">Fits when</h2>
          <ul className="mt-4 space-y-3 text-muted">
            {style.fitsWhen.map((line) => (
              <li key={line}>{line}</li>
            ))}
          </ul>
        </div>
        <div>
          <h2 className="text-2xl font-semibold">Hard when</h2>
          <ul className="mt-4 space-y-3 text-muted">
            {style.hardWhen.map((line) => (
              <li key={line}>{line}</li>
            ))}
          </ul>
        </div>
      </section>

      {style.compareTo.map((other) => (
        <CompareSplit key={other} a={style.id} b={other} />
      ))}

      {style.compareTo.length ? (
        <p className="mt-6 text-sm text-muted">
          Also read{" "}
          {style.compareTo.map((other, i) => (
            <span key={other}>
              {i ? ", " : ""}
              <Link href={archetypeHref(other)} className="underline">
                {ARCHETYPE_LABEL[other]}
              </Link>
            </span>
          ))}
          .
        </p>
      ) : null}

      {manuals.length ? (
        <section className="mt-16">
          <h2 className="text-2xl font-semibold">Classroom manuals</h2>
          <p className="mt-2 text-sm text-muted">The exam for this style. Load the three, then walk the tree.</p>
          <ul className="mt-4 divide-y divide-line rounded-3xl border border-line">
            {manuals.map((m) => (
              <li key={m.id}>
                <Link href={manualHref(m.id)} className="block px-5 py-4 transition hover:bg-raised/70">
                  <p className="font-semibold tracking-tight">{m.title}</p>
                  <p className="mt-1 text-sm text-muted">{m.lede}</p>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {next ? (
        <Link href={archetypeHref(next.id)} className="mt-12 block text-sm text-muted hover:text-ink">
          Next: {next.name}
        </Link>
      ) : (
        <Link href="/learn/abilities" className="mt-12 block text-sm text-muted hover:text-ink">
          Next: Great Ball — abilities
        </Link>
      )}
    </article>
  );
}

function TurnBlock({ title, body }: { title: string; body: string }) {
  return (
    <div className="rounded-3xl border border-line bg-raised/40 p-4">
      <h3 className="font-semibold">{title}</h3>
      <p className="mt-2 text-sm text-muted">{body}</p>
    </div>
  );
}

function PreviewEdges({ title, edges }: { title: string; edges: ArchetypeEdge[] }) {
  return (
    <div>
      <h3 className="text-lg font-semibold tracking-tight">{title}</h3>
      <ul className="mt-4 space-y-5">
        {edges.map((edge) => (
          <li key={`${title}-${edge.vs}`} className="border-t border-line/60 pt-4 first:border-t-0 first:pt-0">
            <Link href={archetypeHref(edge.vs)} className="font-medium underline-offset-4 hover:underline">
              {ARCHETYPE_LABEL[edge.vs]}
            </Link>
            <p className="mt-2 text-sm leading-relaxed text-muted">{edge.why}</p>
            <EdgeMons label="Reach for" slugs={edge.yourExamples} />
            <EdgeMons label="Their tells" slugs={edge.theirExamples} />
          </li>
        ))}
      </ul>
    </div>
  );
}

function EdgeMons({ label, slugs }: { label: string; slugs: string[] }) {
  const mons = slugs.map((s) => getPokemon(s)).filter(Boolean);
  if (!mons.length) return null;
  return (
    <div className="mt-3">
      <p className="font-mono text-[10px] uppercase tracking-[0.12em] text-muted">{label}</p>
      <ul className="mt-1.5 flex flex-wrap gap-2">
        {mons.map((p) =>
          p ? (
            <li key={p.slug}>
              <Link
                href={`/pokemon/${p.slug}`}
                className="inline-flex items-center gap-1.5 rounded-full border border-line bg-raised/40 py-1 pl-1 pr-2.5 text-xs"
                style={cssVars(p.palette)}
              >
                <PokemonArt slug={p.slug} src={p.artwork} name={p.name} size={28} />
                {p.name}
              </Link>
            </li>
          ) : null,
        )}
      </ul>
    </div>
  );
}
