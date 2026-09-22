"use client";

import { getPokemon } from "@/lib/catalog/load";
import { cssVars } from "@/lib/champions/palette";
import { PokemonArt } from "@/components/pokemon/PokemonArt";
import type { ManualPackFieldPlan, ManualPackLeadPlan } from "@/content/manuals";

function Face({ slug, size = 48 }: { slug: string; size?: number }) {
  const mon = getPokemon(slug);
  if (!mon) {
    return (
      <span className="inline-flex h-12 w-12 items-center justify-center rounded-full border border-line bg-sunken text-[10px] text-muted">
        {slug.slice(0, 3) || "?"}
      </span>
    );
  }
  return (
    <span style={cssVars(mon.palette)}>
      <PokemonArt slug={mon.slug} src={mon.sprite || mon.artwork} name={mon.name} size={size} />
    </span>
  );
}

function nameOf(slug: string) {
  return getPokemon(slug)?.name ?? slug;
}

function EdgeChips({
  edges,
}: {
  edges: { from: string; to: string; creates: string; converts: string }[];
}) {
  if (!edges.length) return null;
  return (
    <ul className="mt-4 space-y-2">
      {edges.map((e, i) => (
        <li
          key={`${e.from}-${e.to}-${i}`}
          className="flex flex-wrap items-center gap-2 rounded-2xl border border-line/70 bg-raised/40 px-3 py-2.5 text-sm"
        >
          <span className="font-medium">{nameOf(e.from)}</span>
          <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-muted">creates</span>
          <span className="text-muted">{e.creates}</span>
          <span className="text-muted" aria-hidden>
            →
          </span>
          <span className="font-medium">{nameOf(e.to)}</span>
          <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-muted">converts</span>
          <span className="text-muted">{e.converts}</span>
        </li>
      ))}
    </ul>
  );
}

/** Doubles pack field board — lead pair, back pair, create→convert edges. */
export function ManualFieldPlanBoard({ plan }: { plan: ManualPackFieldPlan }) {
  return (
    <div className="space-y-5 rounded-[28px] border border-[color-mix(in_srgb,var(--format-doubles-accent)_40%,var(--line))] bg-[var(--format-doubles-wash)] p-5">
      <div>
        <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.14em] text-[var(--format-doubles-accent)]">
          Field plan · Lead pair
        </p>
        <div className="mt-3 flex flex-wrap items-center gap-3">
          <Face slug={plan.leadPair[0]} />
          <Face slug={plan.leadPair[1]} />
          <p className="min-w-0 flex-1 text-sm leading-snug text-muted">{plan.leadWhy}</p>
        </div>
        {plan.turn1 ? (
          <p className="mt-3 max-w-[52ch] text-sm">
            <span className="font-medium">Turn 1. </span>
            <span className="text-muted">{plan.turn1}</span>
          </p>
        ) : null}
      </div>

      <div>
        <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.14em] text-muted">
          Back pair
        </p>
        <ul className="mt-3 grid gap-3 sm:grid-cols-2">
          {plan.backPair.map((slug) => {
            const job = plan.backJobs.find((j) => j.slug === slug)?.job;
            return (
              <li
                key={slug}
                className="flex items-start gap-3 rounded-2xl border border-line/60 bg-bg/40 px-3 py-3"
              >
                <Face slug={slug} size={40} />
                <div className="min-w-0">
                  <p className="text-sm font-medium">{nameOf(slug)}</p>
                  {job ? <p className="mt-1 text-sm text-muted">{job}</p> : null}
                </div>
              </li>
            );
          })}
        </ul>
      </div>

      <EdgeChips edges={plan.pairEdges ?? []} />

      {plan.bringInTriggers?.length ? (
        <div>
          <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.14em] text-muted">
            Bring-in triggers
          </p>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-muted">
            {plan.bringInTriggers.map((t) => (
              <li key={t}>{t}</li>
            ))}
          </ul>
        </div>
      ) : null}
    </div>
  );
}

/** Singles pack lead clock — Lead → Mid → Late + entry edges. */
export function ManualLeadPlanBoard({ plan }: { plan: ManualPackLeadPlan }) {
  const beats: { label: string; slug?: string; why?: string }[] = [
    { label: "Lead", slug: plan.lead, why: plan.leadWhy },
    ...(plan.mid ? [{ label: "Mid", slug: plan.mid, why: plan.midWhy }] : []),
    ...(plan.late ? [{ label: "Late", slug: plan.late, why: plan.lateWhy }] : []),
  ];

  return (
    <div className="space-y-5 rounded-[28px] border border-line bg-raised/35 p-5">
      <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.14em] text-muted">
        Lead & clock
      </p>
      <ol className="grid gap-3 sm:grid-cols-3">
        {beats.map((b) => (
          <li
            key={b.label}
            className="rounded-2xl border border-line/70 bg-bg/50 px-3 py-3"
          >
            <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.12em] text-muted">
              {b.label}
            </p>
            {b.slug ? (
              <div className="mt-2 flex items-center gap-2">
                <Face slug={b.slug} size={40} />
                <p className="text-sm font-medium">{nameOf(b.slug)}</p>
              </div>
            ) : null}
            {b.why ? <p className="mt-2 text-sm leading-snug text-muted">{b.why}</p> : null}
          </li>
        ))}
      </ol>
      {plan.turn1 ? (
        <p className="max-w-[52ch] text-sm">
          <span className="font-medium">Turn 1. </span>
          <span className="text-muted">{plan.turn1}</span>
        </p>
      ) : null}
      <EdgeChips edges={plan.entryEdges ?? []} />
    </div>
  );
}
