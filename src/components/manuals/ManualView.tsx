"use client";

import Link from "next/link";
import { getPokemon } from "@/lib/catalog/load";
import { cssVars } from "@/lib/champions/palette";
import { PokemonArt } from "@/components/pokemon/PokemonArt";
import { ROLE_LABEL, roleHref } from "@/content/roles";
import { ARCHETYPE_LABEL, archetypeHref } from "@/content/archetypes";
import { getLiteracyRole } from "@/content/literacy-roles";
import { playLines, type TeamManual } from "@/content/manuals";
import { ManualBriefing } from "@/components/manuals/ManualBriefing";
import { ManualToc } from "@/components/manuals/ManualToc";
import { ManualPlan } from "@/components/manuals/ManualPlan";
import { ManualBranches } from "@/components/manuals/ManualBranches";
import { SlotMatchups } from "@/components/manuals/SlotMatchups";

export function ManualView({
  manual,
  sourced,
}: {
  manual: TeamManual;
  sourced: "canonical" | "local";
}) {
  const mons = manual.slugs.map((s) => (s ? getPokemon(s) : undefined));
  const wash = mons.find(Boolean);
  const switches = (manual.switches ?? []).filter((s) => s.into || s.send);
  const loops = manual.loops.filter((l) => l.title || l.body);
  const hazards = manual.hazards.filter((h) => h.title || h.body);

  return (
    <article className="mx-auto max-w-3xl" style={wash ? cssVars(wash.palette) : undefined}>
      <p className="text-sm text-muted">
        <Link href="/manuals" className="hover:text-ink">
          Field manuals
        </Link>
        {sourced === "local" ? " · Yours" : ""}
      </p>
      <h1 className="mt-2 text-4xl font-semibold tracking-tight">{manual.title}</h1>
      <p className="mt-3 text-lg text-muted">{manual.lede}</p>
      <p className="mt-2 text-sm text-muted">
        <Link href={archetypeHref(manual.archetype)} className="underline">
          {ARCHETYPE_LABEL[manual.archetype]}
        </Link>
        {" · "}
        {mons
          .map((p) => p?.name)
          .filter(Boolean)
          .join(" · ")}
      </p>

      <ManualBriefing manual={manual} />
      <ManualToc manual={manual} />

      {manual.philosophy ? (
        <p className="mt-10 max-w-[52ch] text-[17px] leading-relaxed">{manual.philosophy}</p>
      ) : null}
      {manual.meta ? <p className="mt-4 max-w-[52ch] text-sm text-muted">{manual.meta}</p> : null}

      {manual.plan?.length ? <ManualPlan plan={manual.plan} /> : null}

      <section id="three" className="mt-16 scroll-mt-28 md:scroll-mt-36">
        <h2 className="text-2xl font-semibold tracking-tight">The three</h2>
        <ol className="mt-6 space-y-6">
          {manual.slots.map((slot) => {
            const p = slot.slug ? getPokemon(slot.slug) : undefined;
            const lit = slot.literacy ? getLiteracyRole(slot.literacy) : undefined;
            const lines = playLines(slot.howToPlay);
            return (
              <li
                key={`${slot.slug}-${slot.title}`}
                className="rounded-[28px] border border-line bg-raised/40 p-5"
                style={p ? cssVars(p.palette) : undefined}
              >
                <div className="flex gap-4">
                  {p ? (
                    <Link href={`/pokemon/${p.slug}`} className="shrink-0">
                      <PokemonArt slug={p.slug} src={p.artwork} name={p.name} size={80} />
                    </Link>
                  ) : null}
                  <div className="min-w-0">
                    <p className="text-xs text-muted">
                      <Link href={roleHref(slot.job)} className="underline">
                        {ROLE_LABEL[slot.job]}
                      </Link>
                      {lit ? ` · ${lit.name}` : null}
                    </p>
                    {p ? (
                      <Link href={`/pokemon/${p.slug}`} className="mt-1 block text-xl font-semibold tracking-tight">
                        {p.name}
                      </Link>
                    ) : (
                      <p className="mt-1 text-xl font-semibold">{slot.title || "Empty slot"}</p>
                    )}
                    <p className="mt-0.5 text-sm font-medium">{slot.title}</p>
                    {p ? <SlotMatchups types={p.types} /> : null}
                    {slot.ability || slot.item ? (
                      <p className="mt-2 text-xs text-muted">
                        {slot.ability ? slot.ability : null}
                        {slot.ability && slot.item ? " · " : null}
                        {slot.item ? slot.item : null}
                      </p>
                    ) : null}
                  </div>
                </div>
                {slot.objective ? <p className="mt-4 text-sm">{slot.objective}</p> : null}
                <h3 className="mt-5 text-xs font-semibold uppercase tracking-wide text-muted">Kit</h3>
                <ul className="mt-2 divide-y divide-line/80">
                  {slot.moves
                    .filter((m) => m.name)
                    .map((move) => (
                      <li key={move.name} className="py-2">
                        <div className="grid gap-1 sm:grid-cols-[9rem_1fr] sm:gap-4">
                          <p className="font-medium">{move.name}</p>
                          <p className="text-sm text-muted">{move.why}</p>
                        </div>
                        {move.alts?.filter((a) => a.name).map((alt) => (
                          <p key={alt.name} className="mt-1.5 text-sm text-muted sm:pl-[calc(9rem+1rem)]">
                            <span className="font-medium text-ink">Swap {alt.name}. </span>
                            {alt.why}
                          </p>
                        ))}
                      </li>
                    ))}
                </ul>
                {lines.length ? (
                  <>
                    <h3 className="mt-5 text-xs font-semibold uppercase tracking-wide text-muted">Play</h3>
                    <ul className="mt-2 list-disc space-y-1.5 pl-5 text-sm text-muted">
                      {lines.map((line) => (
                        <li key={line}>{line}</li>
                      ))}
                    </ul>
                  </>
                ) : null}
              </li>
            );
          })}
        </ol>
      </section>

      {manual.phases.map((phase) => (
        <ManualBranches key={phase.id} phase={phase} />
      ))}

      {switches.length ? (
        <section id="switches" className="mt-16 scroll-mt-28 md:scroll-mt-36">
          <h2 className="text-2xl font-semibold tracking-tight">Switches</h2>
          <ul className="mt-5 divide-y divide-line overflow-hidden rounded-3xl border border-line bg-raised/40">
            {switches.map((row) => (
              <li key={`${row.into}-${row.send}`} className="grid grid-cols-[1fr_auto_1fr] items-baseline gap-3 px-4 py-3">
                <p className="font-medium">{row.into}</p>
                <p className="text-xs uppercase tracking-wide text-muted">send</p>
                <p className="font-medium">{row.send}</p>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {loops.length ? (
        <section id="loops" className="mt-16 scroll-mt-28 md:scroll-mt-36">
          <h2 className="text-2xl font-semibold tracking-tight">Loops</h2>
          <ol className="mt-5 space-y-4">
            {loops.map((loop, i) => (
              <li key={loop.title || i} className="flex gap-4">
                <span className="mt-0.5 w-6 shrink-0 text-sm text-muted">{i + 1}.</span>
                <div>
                  <h3 className="font-semibold">{loop.title}</h3>
                  <p className="mt-1 text-sm text-muted">{loop.body}</p>
                </div>
              </li>
            ))}
          </ol>
        </section>
      ) : null}

      {hazards.length ? (
        <section id="hazards" className="mt-16 scroll-mt-28 md:scroll-mt-36">
          <h2 className="text-2xl font-semibold tracking-tight">Hazards</h2>
          <ul className="mt-5 divide-y divide-line overflow-hidden rounded-3xl border border-line bg-raised/40">
            {hazards.map((hazard) => (
              <li key={hazard.title} className="px-4 py-3">
                <h3 className="font-semibold">{hazard.title}</h3>
                <p className="mt-1 text-sm text-muted">{hazard.body}</p>
              </li>
            ))}
          </ul>
        </section>
      ) : null}
    </article>
  );
}
