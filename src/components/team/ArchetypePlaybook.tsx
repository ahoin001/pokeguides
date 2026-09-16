import Link from "next/link";
import {
  ARCHETYPE_LABEL,
  MARGIN_LABEL,
  PACING_LABEL,
  archetypeHref,
  archetypeHubHref,
  type ArchetypeEdge,
  type ArchetypePlaybookGuide,
} from "@/content/archetypes";
import { getPokemon } from "@/lib/catalog/load";
import { cssVars } from "@/lib/champions/palette";
import { PokemonArt } from "@/components/pokemon/PokemonArt";
import { SampleSix } from "@/components/learn/SampleSix";
import { LoadSampleSix } from "@/components/learn/LoadSampleSix";
import { CompareSplit } from "@/components/learn/CompareSplit";
import { manualsForArchetype, manualHref } from "@/content/manuals";
import type { ArchetypeId } from "@/types/pokemon";

export function ArchetypePlaybook({
  style,
  prevId,
  nextId,
}: {
  style: ArchetypePlaybookGuide;
  prevId?: ArchetypeId;
  nextId?: ArchetypeId;
}) {
  const wash = getPokemon(style.core.slugs[0]) ?? getPokemon(style.staples[0]?.slug);
  const manuals = manualsForArchetype(style.id);

  return (
    <article className="mx-auto max-w-4xl" style={wash ? cssVars(wash.palette) : undefined}>
      <p className="text-sm text-muted">
        <Link href={archetypeHubHref()} className="hover:text-ink">
          Team archetypes
        </Link>
      </p>

      <header className="mt-3">
        <div className="flex flex-wrap items-center gap-2">
          <span className="rounded-full bg-white/8 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.14em] text-muted">
            {PACING_LABEL[style.pacing]}
          </span>
          <span className="rounded-full bg-white/8 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.14em] text-muted">
            {MARGIN_LABEL[style.margin]} margin
          </span>
        </div>
        <h1 className="mt-4 text-4xl font-semibold tracking-tight md:text-5xl">{style.name}</h1>
        <p className="mt-3 max-w-[40ch] text-lg text-muted">{style.oneLiner}</p>
      </header>

      <section className="mt-10">
        <h2 className="font-mono text-[10px] font-semibold uppercase tracking-[0.14em] text-muted">
          Identity
        </h2>
        <ul className="mt-4 grid gap-3 sm:grid-cols-2">
          {style.playbook.identity.map((line) => (
            <li
              key={line}
              className="rounded-2xl border border-line/70 bg-raised/40 px-4 py-3 text-[15px] leading-snug"
            >
              {line}
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-14">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight">Preview tells</h2>
            <p className="mt-1 text-sm text-muted">
              If you see these, you are likely facing {style.name}.{" "}
              <Link href="/learn/reading-their-six" className="underline hover:text-ink">
                Tell classroom
              </Link>
            </p>
          </div>
        </div>
        <ul className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {style.tells.map((tell) => {
            const mon = getPokemon(tell.slug);
            if (!mon) return null;
            return (
              <li key={tell.slug}>
                <Link
                  href={`/pokemon/${mon.slug}`}
                  title={tell.why}
                  className="flex h-full items-start gap-3 rounded-2xl border border-line/70 bg-bg/40 p-3 transition hover:border-ink/35"
                  style={cssVars(mon.palette)}
                >
                  <PokemonArt slug={mon.slug} src={mon.artwork} name={mon.name} size={56} className="shrink-0" />
                  <span className="min-w-0">
                    <span className="block font-medium tracking-tight">{mon.name}</span>
                    <span className="mt-1 line-clamp-3 text-xs leading-relaxed text-muted">{tell.why}</span>
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      </section>

      <section className="mt-14">
        <h2 className="text-2xl font-semibold tracking-tight">Staples to build it</h2>
        <p className="mt-1 text-sm text-muted">Popular species that define this plan on the ladder.</p>
        <ul className="mt-6 grid gap-3 sm:grid-cols-2">
          {style.staples.map((s) => {
            const mon = getPokemon(s.slug);
            if (!mon) return null;
            return (
              <li key={s.slug}>
                <Link
                  href={`/pokemon/${mon.slug}`}
                  className="flex items-start gap-3 rounded-2xl border border-line/70 bg-raised/40 p-3 transition hover:border-ink/35"
                  style={cssVars(mon.palette)}
                >
                  <PokemonArt slug={mon.slug} src={mon.artwork} name={mon.name} size={56} className="shrink-0" />
                  <span className="min-w-0">
                    <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-muted">
                      {s.role}
                    </span>
                    <span className="mt-0.5 block font-medium tracking-tight">{mon.name}</span>
                    <span className="mt-1 block text-sm leading-relaxed text-muted">{s.why}</span>
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      </section>

      <section className="mt-14">
        <h2 className="text-2xl font-semibold tracking-tight">How it wins</h2>
        <p className="mt-3 max-w-[62ch] text-[17px] leading-relaxed text-muted">{style.playbook.howItWins}</p>
        <div className="mt-6 grid gap-3 md:grid-cols-3">
          <TurnCard title="Lead" body={style.turnByTurn.lead} />
          <TurnCard title="Mid" body={style.turnByTurn.mid} />
          <TurnCard title="Late" body={style.turnByTurn.late} />
        </div>
      </section>

      <section className="mt-14">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <h2 className="text-2xl font-semibold tracking-tight">Sample three</h2>
          <LoadSampleSix slugs={style.sampleSix} intent={style.id} />
        </div>
        <p className="mt-2 text-sm text-muted">{style.core.name} — {style.core.why}</p>
        <div className="mt-4">
          <SampleSix slugs={style.sampleSix} note={style.sampleNote} />
        </div>
      </section>

      <section className="mt-14 grid gap-10 lg:grid-cols-2">
        <EdgeBlock title="Strong into" hint="Matchups this plan usually likes." edges={style.favors} />
        <EdgeBlock title="Weak into" hint="Matchups that punish this plan." edges={style.struggles} />
      </section>

      <section className="mt-14">
        <h2 className="text-2xl font-semibold tracking-tight">Answers to bring against it</h2>
        <p className="mt-1 text-sm text-muted">Reach for these when their six screams {style.name}.</p>
        <ul className="mt-6 flex flex-wrap gap-2">
          {style.answers.map((a) => {
            const mon = getPokemon(a.slug);
            if (!mon) return null;
            return (
              <li key={a.slug}>
                <Link
                  href={`/pokemon/${mon.slug}`}
                  title={a.why}
                  className="inline-flex max-w-full items-center gap-2 rounded-full border border-line/70 bg-bg/50 py-1.5 pl-1.5 pr-3.5 text-sm transition hover:border-ink/40"
                  style={cssVars(mon.palette)}
                >
                  <PokemonArt slug={mon.slug} src={mon.artwork} name={mon.name} size={32} />
                  <span className="min-w-0">
                    <span className="block font-medium leading-tight">{mon.name}</span>
                    <span className="block max-w-[18ch] truncate text-[11px] text-muted">{a.why}</span>
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      </section>

      <section className="mt-14 grid gap-8 md:grid-cols-2">
        <ScriptList title="Facing it" lines={style.playbook.vsScript} />
        <ScriptList title="Building it" lines={style.playbook.buildPriorities} />
      </section>

      <section className="mt-10">
        <h2 className="text-lg font-semibold tracking-tight">On their preview</h2>
        <ol className="mt-4 space-y-3">
          {style.playbook.previewScript.map((line, i) => (
            <li key={line} className="flex gap-3 text-[15px] leading-relaxed text-muted">
              <span className="font-mono text-xs text-ink/70">{String(i + 1).padStart(2, "0")}</span>
              <span>{line}</span>
            </li>
          ))}
        </ol>
      </section>

      {manuals.length ? (
        <section className="mt-14">
          <h2 className="text-2xl font-semibold tracking-tight">Field manuals</h2>
          <p className="mt-1 text-sm text-muted">Exam threes for this style.</p>
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

      {style.compareTo.map((other) => (
        <CompareSplit key={other} a={style.id} b={other} />
      ))}

      <nav className="mt-16 flex flex-wrap items-center justify-between gap-4 border-t border-line/70 pt-8 text-sm">
        <Link href={archetypeHubHref()} className="text-muted hover:text-ink">
          All archetypes
        </Link>
        <div className="flex flex-wrap gap-4">
          {prevId ? (
            <Link href={archetypeHref(prevId)} className="text-muted hover:text-ink">
              ← {ARCHETYPE_LABEL[prevId]}
            </Link>
          ) : null}
          {nextId ? (
            <Link href={archetypeHref(nextId)} className="text-muted hover:text-ink">
              {ARCHETYPE_LABEL[nextId]} →
            </Link>
          ) : null}
        </div>
      </nav>
    </article>
  );
}

function TurnCard({ title, body }: { title: string; body: string }) {
  return (
    <div className="rounded-2xl border border-line/70 bg-raised/40 p-4">
      <h3 className="font-mono text-[10px] font-semibold uppercase tracking-[0.14em] text-muted">
        {title}
      </h3>
      <p className="mt-2 text-sm leading-relaxed text-muted">{body}</p>
    </div>
  );
}

function ScriptList({ title, lines }: { title: string; lines: string[] }) {
  return (
    <div>
      <h2 className="text-xl font-semibold tracking-tight">{title}</h2>
      <ul className="mt-4 space-y-3">
        {lines.map((line) => (
          <li
            key={line}
            className="border-l-2 border-[color-mix(in_srgb,var(--mon-vibrant,#c8b48a)_55%,transparent)] pl-3 text-sm leading-relaxed text-muted"
          >
            {line}
          </li>
        ))}
      </ul>
    </div>
  );
}

function EdgeBlock({
  title,
  hint,
  edges,
}: {
  title: string;
  hint: string;
  edges: ArchetypeEdge[];
}) {
  return (
    <div>
      <h2 className="text-xl font-semibold tracking-tight">{title}</h2>
      <p className="mt-1 text-sm text-muted">{hint}</p>
      <ul className="mt-5 space-y-5">
        {edges.map((edge) => (
          <li key={`${title}-${edge.vs}`} className="border-t border-line/60 pt-4 first:border-t-0 first:pt-0">
            <Link href={archetypeHref(edge.vs)} className="font-medium underline-offset-4 hover:underline">
              {ARCHETYPE_LABEL[edge.vs]}
            </Link>
            <p className="mt-2 text-sm leading-relaxed text-muted">{edge.why}</p>
            <MonChips label="Reach for" slugs={edge.yourExamples} />
            <MonChips label="Their tells" slugs={edge.theirExamples} />
          </li>
        ))}
      </ul>
    </div>
  );
}

function MonChips({ label, slugs }: { label: string; slugs: string[] }) {
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
                className="inline-flex items-center gap-1.5 rounded-full border border-line/70 bg-bg/40 py-1 pl-1 pr-2.5 text-xs"
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
