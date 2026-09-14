"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ARCHETYPES, archetypeHref, ARCHETYPE_LABEL } from "@/content/archetypes";
import { LoadSampleSix } from "@/components/learn/LoadSampleSix";
import { Button } from "@/components/ui/Button";
import type { ArchetypeId } from "@/types/pokemon";

const PACE = [
  {
    id: "chess",
    label: "Chess match",
    hint: "Control the board. Strike when a threat is gone.",
    boosts: ["balance", "grassy", "rain"] as ArchetypeId[],
  },
  {
    id: "sprint",
    label: "Sprint",
    hint: "Win by turn 4 or the snowball dies.",
    boosts: ["hyper-offense", "sun"] as ArchetypeId[],
  },
  {
    id: "clock",
    label: "Flip the clock",
    hint: "Slowest Pokémon move first.",
    boosts: ["trick-room"] as ArchetypeId[],
  },
] as const;

const MARGIN = [
  {
    id: "forgiving",
    label: "I want a net",
    hint: "A mispredict should not end the match.",
    boosts: ["balance", "grassy", "rain"] as ArchetypeId[],
  },
  {
    id: "thin",
    label: "Glass is fine",
    hint: "I'll take the KO or I'll take the loss.",
    boosts: ["hyper-offense", "sun", "trick-room"] as ArchetypeId[],
  },
] as const;

const ENGINE = [
  {
    id: "control",
    label: "Coverage and a cleaner",
    hint: "A breaker, then the Pokémon that finishes.",
    boosts: ["balance", "hyper-offense"] as ArchetypeId[],
  },
  {
    id: "weather",
    label: "Rain or sun from the lead",
    hint: "The field is the team.",
    boosts: ["rain", "sun"] as ArchetypeId[],
  },
  {
    id: "terrain",
    label: "Grassy Terrain as the room",
    hint: "Rillaboom walks in and Glide goes first.",
    boosts: ["grassy"] as ArchetypeId[],
  },
  {
    id: "room",
    label: "Trick Room as the room",
    hint: "Build slow on purpose.",
    boosts: ["trick-room"] as ArchetypeId[],
  },
] as const;

export function PlaystyleChooser() {
  const [pace, setPace] = useState<(typeof PACE)[number]["id"] | null>(null);
  const [margin, setMargin] = useState<(typeof MARGIN)[number]["id"] | null>(null);
  const [engine, setEngine] = useState<(typeof ENGINE)[number]["id"] | null>(null);

  const picks = useMemo(() => {
    if (!pace || !margin || !engine) return [];
    const scores = new Map<ArchetypeId, number>();
    const add = (ids: ArchetypeId[]) => {
      for (const id of ids) scores.set(id, (scores.get(id) ?? 0) + 1);
    };
    add(PACE.find((p) => p.id === pace)!.boosts);
    add(MARGIN.find((p) => p.id === margin)!.boosts);
    add(ENGINE.find((p) => p.id === engine)!.boosts);
    return [...scores.entries()]
      .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
      .slice(0, 2)
      .map(([id, score]) => ({ id, score, guide: ARCHETYPES.find((a) => a.id === id)! }))
      .filter((x) => x.guide);
  }, [pace, margin, engine]);

  return (
    <section className="mt-16 rounded-3xl border border-line bg-raised/40 p-5 md:p-6">
      <h2 className="text-2xl font-semibold tracking-tight">What fits you</h2>
      <p className="mt-2 text-sm text-muted">Three questions. One or two styles. Load a three and see how it feels.</p>

      <fieldset className="mt-8">
        <legend className="text-sm font-medium">Pace</legend>
        <div className="mt-3 grid gap-2 sm:grid-cols-3">
          {PACE.map((opt) => (
            <Choice key={opt.id} active={pace === opt.id} label={opt.label} hint={opt.hint} onClick={() => setPace(opt.id)} />
          ))}
        </div>
      </fieldset>

      <fieldset className="mt-8">
        <legend className="text-sm font-medium">If you mispredict</legend>
        <div className="mt-3 grid gap-2 sm:grid-cols-2">
          {MARGIN.map((opt) => (
            <Choice key={opt.id} active={margin === opt.id} label={opt.label} hint={opt.hint} onClick={() => setMargin(opt.id)} />
          ))}
        </div>
      </fieldset>

      <fieldset className="mt-8">
        <legend className="text-sm font-medium">What should do the work</legend>
        <div className="mt-3 grid gap-2 sm:grid-cols-2">
          {ENGINE.map((opt) => (
            <Choice key={opt.id} active={engine === opt.id} label={opt.label} hint={opt.hint} onClick={() => setEngine(opt.id)} />
          ))}
        </div>
      </fieldset>

      {picks.length ? (
        <ul className="mt-8 space-y-4">
          {picks.map((p) => (
            <li key={p.id} className="rounded-2xl border border-line bg-bg/60 p-4">
              <p className="font-semibold">{ARCHETYPE_LABEL[p.id]}</p>
              <p className="mt-1 text-sm text-muted">{p.guide.oneLiner}</p>
              <div className="mt-4 flex flex-wrap gap-3">
                <LoadSampleSix slugs={p.guide.sampleSix} label={`Load ${p.guide.name}`} intent={p.id} />
                <Link href={archetypeHref(p.id)} className="inline-flex items-center text-sm underline">
                  Read the style
                </Link>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-8 text-sm text-muted">Answer all three to get a style.</p>
      )}
    </section>
  );
}

function Choice({
  active,
  label,
  hint,
  onClick,
}: {
  active: boolean;
  label: string;
  hint: string;
  onClick: () => void;
}) {
  return (
    <Button
      type="button"
      variant={active ? "primary" : "line"}
      aria-pressed={active}
      onClick={onClick}
      className="h-auto min-h-16 flex-col items-start whitespace-normal px-4 py-3 text-left"
    >
      <span>{label}</span>
      <span className={`mt-1 text-xs font-normal ${active ? "text-bg/70" : "text-muted"}`}>{hint}</span>
    </Button>
  );
}
