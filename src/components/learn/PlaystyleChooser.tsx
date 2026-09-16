"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  ARCHETYPES,
  ARCHETYPE_LABEL,
  archetypeHref,
} from "@/content/archetypes";
import { LoadSampleSix } from "@/components/learn/LoadSampleSix";
import { Button } from "@/components/ui/Button";
import { PokemonArt } from "@/components/pokemon/PokemonArt";
import { getPokemon } from "@/lib/catalog/lookup";
import { cssVars } from "@/lib/champions/palette";
import type { ArchetypeId } from "@/types/pokemon";

type Opt = {
  id: string;
  label: string;
  hint: string;
  boosts: ArchetypeId[];
  /** Extra weight for a decisive preference (e.g. must-appear setter). */
  weight?: number;
};

const STEPS: { key: string; title: string; blurb: string; options: readonly Opt[] }[] = [
  {
    key: "pace",
    title: "How do you want turns to feel?",
    blurb: "Pace is the first filter. Everything else hangs off it.",
    options: [
      {
        id: "chess",
        label: "Chess match",
        hint: "Pivot, chip, then strike when a threat is gone.",
        boosts: ["balance", "grassy", "rain"],
      },
      {
        id: "sprint",
        label: "Sprint",
        hint: "Win by turn 4 or the snowball dies.",
        boosts: ["hyper-offense", "sun"],
      },
      {
        id: "clock",
        label: "Flip the clock",
        hint: "Slowest Pokémon move first for four turns.",
        boosts: ["trick-room"],
        weight: 2,
      },
    ],
  },
  {
    key: "margin",
    title: "If you mispredict a switch…",
    blurb: "Honest about how thin your HP bars can be.",
    options: [
      {
        id: "forgiving",
        label: "I want a net",
        hint: "A bad lead should not end the match.",
        boosts: ["balance", "rain", "grassy"],
      },
      {
        id: "medium",
        label: "Some risk is fine",
        hint: "I can take one wrong guess if the wincon is intact.",
        boosts: ["balance", "sun", "grassy", "trick-room"],
      },
      {
        id: "thin",
        label: "Glass is fine",
        hint: "I'll take the KO or I'll take the loss.",
        boosts: ["hyper-offense", "sun", "trick-room"],
      },
    ],
  },
  {
    key: "engine",
    title: "What should do the heavy lifting?",
    blurb: "The engine is how your three generates KOs.",
    options: [
      {
        id: "control",
        label: "Coverage and a cleaner",
        hint: "A breaker, a patch, then the Pokémon that finishes.",
        boosts: ["balance", "hyper-offense"],
      },
      {
        id: "rain",
        label: "Rain from the lead",
        hint: "Pelipper walks in. Water and Electro Shot cash it.",
        boosts: ["rain"],
        weight: 2,
      },
      {
        id: "sun",
        label: "Sun from the Mega",
        hint: "Charizardite Y — field and wincon in one slot.",
        boosts: ["sun"],
        weight: 2,
      },
      {
        id: "terrain",
        label: "Grassy Terrain as the room",
        hint: "Rillaboom walks in and Grassy Glide goes first.",
        boosts: ["grassy"],
        weight: 2,
      },
      {
        id: "room",
        label: "Trick Room as the room",
        hint: "Farigiraf sets. Slow trucks cash.",
        boosts: ["trick-room"],
        weight: 2,
      },
    ],
  },
  {
    key: "preview",
    title: "On the 90-second preview, you prefer…",
    blurb: "Styles differ in how loud they are before the lead drops.",
    options: [
      {
        id: "read",
        label: "Reading their six",
        hint: "I enjoy naming their plan and packing the answer.",
        boosts: ["balance", "hyper-offense"],
      },
      {
        id: "loud",
        label: "A must-appear setter",
        hint: "I want my plan obvious so I can practice one script.",
        boosts: ["rain", "sun", "grassy", "trick-room"],
      },
      {
        id: "hybrid",
        label: "A clock on a midrange six",
        hint: "Tailwind or terrain sitting on Balance — not pure glass.",
        boosts: ["balance", "grassy"],
      },
    ],
  },
  {
    key: "job",
    title: "Which job feels most fun to pilot?",
    blurb: "Last filter — the Pokémon you actually want to click with.",
    options: [
      {
        id: "pivot",
        label: "The living switch",
        hint: "Corvi, Hippo, Primarina, Golisopod — soak and hand off.",
        boosts: ["balance", "rain"],
      },
      {
        id: "snowball",
        label: "The Mega / kite snowball",
        hint: "Salamence, Dragonite, Y — delete before they answer.",
        boosts: ["hyper-offense", "sun", "balance"],
      },
      {
        id: "truck",
        label: "The slow truck",
        hint: "Kingambit, Gholdengo — move first under the room.",
        boosts: ["trick-room", "grassy"],
      },
      {
        id: "glide",
        label: "Priority and Unburden",
        hint: "Grassy Glide and berry-pop Speed.",
        boosts: ["grassy", "hyper-offense"],
      },
    ],
  },
];

const WHY: Record<ArchetypeId, string[]> = {
  balance: [
    "M-C’s default ladder shape — you get switches when the lead goes wrong.",
    "Learn the meta names (Salamence, Garchomp, Primarina) while you learn the format.",
  ],
  "hyper-offense": [
    "You asked for a sprint and a thin margin — HO is that contract.",
    "Practice tip: if Ice and Fairy are still alive, keep the kite in the bag.",
  ],
  "trick-room": [
    "You want the clock flipped and a setter that must appear.",
    "Farigiraf is the tell — plan every lead as if it is coming.",
  ],
  rain: [
    "Drizzle is the team. Pelipper on preview ends the guessing.",
    "Pack Electric answers on the other side of every rain game.",
  ],
  sun: [
    "Drought Mega is setter and wincon — one stone, one plan.",
    "Rock and Water on their three is the funeral; don’t donate free turns.",
  ],
  grassy: [
    "Terrain is the room. Rillaboom walks in and Glide goes first.",
    "Fire deletes the engine — expect it and pack answers.",
  ],
};

export function PlaystyleChooser() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});

  const done = Object.keys(answers).length === STEPS.length;
  const current = STEPS[step]!;

  const picks = useMemo(() => {
    if (!done) return [];
    const scores = new Map<ArchetypeId, number>();
    const add = (ids: ArchetypeId[], weight = 1) => {
      for (const id of ids) scores.set(id, (scores.get(id) ?? 0) + weight);
    };
    for (const s of STEPS) {
      const chosen = s.options.find((o) => o.id === answers[s.key]);
      if (chosen) add(chosen.boosts, chosen.weight ?? 1);
    }
    return [...scores.entries()]
      .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
      .slice(0, 2)
      .map(([id, score]) => ({
        id,
        score,
        guide: ARCHETYPES.find((a) => a.id === id)!,
      }))
      .filter((x) => x.guide);
  }, [answers, done]);

  function choose(optionId: string) {
    const nextAnswers = { ...answers, [current.key]: optionId };
    setAnswers(nextAnswers);
    if (step < STEPS.length - 1) setStep(step + 1);
  }

  function reset() {
    setAnswers({});
    setStep(0);
  }

  return (
    <section className="mt-16 rounded-3xl border border-line bg-raised/40 p-5 md:p-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight">Find your ideal style</h2>
          <p className="mt-2 max-w-[48ch] text-sm text-muted">
            Five questions grounded in how M-C Singles actually plays. You’ll get up to two
            archetypes, the preview tells to memorize, and a sample six to load.
          </p>
        </div>
        {done ? (
          <Button type="button" variant="line" onClick={reset} className="shrink-0">
            Retake
          </Button>
        ) : null}
      </div>

      <ol className="mt-6 flex flex-wrap gap-2" aria-label="Survey progress">
        {STEPS.map((s, i) => {
          const filled = Boolean(answers[s.key]);
          const active = i === step && !done;
          return (
            <li key={s.key}>
              <button
                type="button"
                disabled={!filled && i > step}
                onClick={() => filled && setStep(i)}
                className={`inline-flex h-8 min-w-8 items-center justify-center rounded-full border px-2.5 text-xs font-medium transition ${
                  active
                    ? "border-ink bg-ink text-bg"
                    : filled
                      ? "border-line bg-bg text-ink hover:border-ink/50"
                      : "border-line/60 text-muted"
                }`}
                aria-current={active ? "step" : undefined}
              >
                {i + 1}
              </button>
            </li>
          );
        })}
      </ol>

      {!done ? (
        <fieldset className="mt-8">
          <legend className="text-lg font-semibold tracking-tight">{current.title}</legend>
          <p className="mt-1 text-sm text-muted">{current.blurb}</p>
          <div
            className={`mt-4 grid gap-2 ${
              current.options.length >= 4 ? "sm:grid-cols-2" : "sm:grid-cols-3"
            }`}
          >
            {current.options.map((opt) => (
              <Choice
                key={opt.id}
                active={answers[current.key] === opt.id}
                label={opt.label}
                hint={opt.hint}
                onClick={() => choose(opt.id)}
              />
            ))}
          </div>
          {step > 0 ? (
            <button
              type="button"
              className="mt-4 text-sm text-muted underline hover:text-ink"
              onClick={() => setStep(step - 1)}
            >
              Back
            </button>
          ) : null}
        </fieldset>
      ) : (
        <ul className="mt-8 space-y-5">
          {picks.map((p, rank) => (
            <li key={p.id} className="rounded-2xl border border-line bg-bg/60 p-4 md:p-5">
              <p className="text-xs font-medium uppercase tracking-wide text-muted">
                {rank === 0 ? "Best fit" : "Runner-up"}
              </p>
              <p className="mt-1 text-xl font-semibold tracking-tight">
                {ARCHETYPE_LABEL[p.id]}
              </p>
              <p className="mt-1 text-sm text-muted">{p.guide.oneLiner}</p>
              <ul className="mt-3 space-y-1.5 text-sm text-muted">
                {(WHY[p.id] ?? []).map((line) => (
                  <li key={line} className="flex gap-2">
                    <span className="text-ink/40" aria-hidden>
                      ·
                    </span>
                    <span>{line}</span>
                  </li>
                ))}
              </ul>
              {p.guide.tells.length ? (
                <div className="mt-4">
                  <p className="text-xs font-medium uppercase tracking-wide text-muted">
                    Preview tells to know
                  </p>
                  <ul className="mt-2 flex flex-wrap gap-2">
                    {p.guide.tells.slice(0, 8).map((tell) => {
                      const mon = getPokemon(tell.slug);
                      if (!mon) return null;
                      return (
                        <li key={tell.slug}>
                          <Link
                            href={`/pokemon/${mon.slug}`}
                            title={tell.why}
                            className="inline-flex items-center gap-2 rounded-full border border-line/70 bg-raised/50 py-1 pl-1 pr-3 text-sm transition hover:border-ink/40"
                            style={cssVars(mon.palette)}
                          >
                            <PokemonArt
                              slug={mon.slug}
                              src={mon.sprite || mon.artwork}
                              name={mon.name}
                              size={28}
                            />
                            <span className="font-medium">{mon.name}</span>
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              ) : null}
              <div className="mt-4 flex flex-wrap gap-3">
                <LoadSampleSix
                  slugs={p.guide.sampleSix}
                  label={`Load ${p.guide.name}`}
                  intent={p.id}
                />
                <Link
                  href={archetypeHref(p.id)}
                  className="inline-flex items-center text-sm underline"
                >
                  Open playbook
                </Link>
              </div>
            </li>
          ))}
        </ul>
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
      <span className={`mt-1 text-xs font-normal ${active ? "text-bg/70" : "text-muted"}`}>
        {hint}
      </span>
    </Button>
  );
}
