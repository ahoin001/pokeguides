"use client";

import { useEffect, useState } from "react";
import { type TypeId } from "@/types/pokemon";
import { TYPE_IDS_ALPHA, TYPE_LABEL, attackMultiplier, defensiveMatchup } from "@/lib/champions/types";
import { TypeIcon } from "@/components/pokemon/TypeIcon";

export function TypePlayground({ seed = "fire" }: { seed?: TypeId }) {
  const [attack, setAttack] = useState<TypeId>(seed);
  const [defend, setDefend] = useState<TypeId[]>(["grass"]);
  const def = defensiveMatchup(defend);
  const vs = defend.reduce((acc, d) => acc * attackMultiplier(attack, d), 1);

  useEffect(() => {
    setAttack(seed);
  }, [seed]);

  function toggleDefend(t: TypeId) {
    setDefend((cur) => {
      if (cur.includes(t)) return cur.filter((x) => x !== t);
      if (cur.length >= 2) return [cur[1], t];
      return [...cur, t];
    });
  }

  const call =
    vs === 0 ? "No effect" : vs < 1 ? "Not very effective" : vs > 1 ? "Super effective" : "Neutral";
  const multLabel = vs === 0 ? "0×" : `${vs}×`;

  const result = (
    <div className="rounded-[28px] border border-line bg-raised/40 px-5 py-6 md:px-10 md:py-10">
      {defend.length ? (
        <div className="space-y-6 md:space-y-8">
          <div className="flex flex-wrap items-center gap-4">
            <TypeIcon type={attack} size="lg" />
            <span className="text-sm text-muted">into</span>
            <span className="flex items-center gap-2.5">
              {defend.map((t) => (
                <TypeIcon key={t} type={t} size="lg" />
              ))}
            </span>
          </div>
          <p>
            <span className="block font-mono text-4xl font-semibold tracking-tight md:text-5xl">
              {multLabel}
            </span>
            <span className="mt-2 block text-base text-muted">{call}</span>
          </p>
          {def.weak.length ? (
            <div className="border-t border-line pt-6 md:pt-8">
              <p className="text-sm text-muted">They are also weak to</p>
              <div className="mt-4 flex flex-wrap gap-3">
                {def.weak.map((w) => (
                  <TypeIcon
                    key={w.type}
                    type={w.type}
                    size="md"
                    title={`${TYPE_LABEL[w.type]} ${w.mult}x on them`}
                  />
                ))}
              </div>
            </div>
          ) : null}
        </div>
      ) : (
        <p className="text-muted">Tap a defending type to see the matchup.</p>
      )}
    </div>
  );

  return (
    <div className="space-y-8 md:space-y-10">
      {/* Sticky result on mobile while picking */}
      <div className="sticky top-[calc(var(--sticky-shell)+0.5rem)] z-20 md:static md:z-auto">
        {result}
      </div>

      <section>
        <h3 className="text-sm text-muted">You attack with</h3>
        <TypePick value={[attack]} onPick={setAttack} />
      </section>
      <section>
        <h3 className="text-sm text-muted">They are. Tap one or two.</h3>
        <TypePick value={defend} onPick={toggleDefend} />
      </section>
    </div>
  );
}

function TypePick({
  value,
  onPick,
}: {
  value: TypeId[];
  onPick: (t: TypeId) => void;
}) {
  return (
    <div className="mt-4 grid grid-cols-6 gap-2 sm:grid-cols-9 sm:gap-3 md:gap-4">
      {TYPE_IDS_ALPHA.map((t) => {
        const on = value.includes(t);
        return (
          <button
            key={t}
            type="button"
            onClick={() => onPick(t)}
            aria-pressed={on}
            title={TYPE_LABEL[t]}
            className={`flex min-h-12 items-center justify-center rounded-2xl p-2 transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink ${
              on ? "bg-white/10 ring-2 ring-ink" : "opacity-45 hover:opacity-100"
            }`}
          >
            <TypeIcon type={t} size="md" />
          </button>
        );
      })}
    </div>
  );
}
