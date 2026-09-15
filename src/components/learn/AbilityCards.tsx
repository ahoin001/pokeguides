"use client";

import { useState } from "react";
import { getPokemon } from "@/lib/catalog/load";
import { cssVars } from "@/lib/champions/palette";
import { PokemonArt } from "@/components/pokemon/PokemonArt";
import type { LessonBeat } from "@/content/curriculum";

export function AbilityCards({ beats }: { beats: LessonBeat[] }) {
  const cards = beats.filter((b) => b.example);
  const [active, setActive] = useState(cards[0]?.example?.slug ?? "");
  const current = cards.find((c) => c.example?.slug === active) ?? cards[0];
  const mon = current?.example ? getPokemon(current.example.slug) : undefined;

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]" style={mon ? cssVars(mon.palette) : undefined}>
      <ul className="grid grid-cols-2 gap-2 sm:grid-cols-3">
        {cards.map((card) => {
          const p = card.example ? getPokemon(card.example.slug) : undefined;
          const on = card.example?.slug === active;
          if (!p || !card.example) return null;
          return (
            <li key={card.example.slug}>
              <button
                type="button"
                onClick={() => setActive(card.example!.slug)}
                className={`flex w-full flex-col items-center rounded-2xl border px-2 py-3 text-center transition ${
                  on ? "border-ink/40 bg-white/10" : "border-line bg-raised/40 hover:bg-raised"
                }`}
                style={cssVars(p.palette)}
              >
                <PokemonArt slug={p.slug} src={p.artwork} name={p.name} size={56} />
                <span className="mt-2 text-sm font-medium">{card.title}</span>
                <span className="mt-0.5 text-[10px] text-muted">{p.name}</span>
              </button>
            </li>
          );
        })}
      </ul>
      {current ? (
        <div className="rounded-[28px] border border-line bg-raised/50 p-5">
          {mon ? (
            <div className="flex items-center gap-4">
              <PokemonArt slug={mon.slug} src={mon.artwork} name={mon.name} size={88} />
              <div>
                <p className="text-xl font-semibold tracking-tight">{current.title}</p>
                <p className="mt-1 text-sm text-muted">{mon.name}</p>
              </div>
            </div>
          ) : null}
          <p className="mt-4 text-[17px] leading-relaxed">{current.body}</p>
        </div>
      ) : null}
    </div>
  );
}
