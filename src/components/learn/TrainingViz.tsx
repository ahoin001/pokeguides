"use client";

import { useState } from "react";
import { getPokemon } from "@/lib/catalog/load";
import { cssVars } from "@/lib/champions/palette";
import { PokemonArt } from "@/components/pokemon/PokemonArt";

const SPREADS = [
  {
    id: "race",
    name: "32 Spe statement",
    slug: "garchomp",
    item: "Loaded Dice",
    sp: { hp: 2, atk: 32, def: 0, spa: 0, spd: 0, spe: 32 },
    why: "The race is the plan. Leftover 2 in HP. If Cott already clocked, move Spe into Def.",
  },
  {
    id: "sash",
    name: "Sash clock",
    slug: "whimsicott",
    item: "Focus Sash",
    sp: { hp: 2, atk: 0, def: 0, spa: 32, spd: 0, spe: 32 },
    why: "Lives the Fake Out you should not have taken. Then Tailwind. Cloak is the bulk swap.",
  },
  {
    id: "sitrus",
    name: "Sitrus stay",
    slug: "corviknight",
    item: "Sitrus Berry",
    sp: { hp: 32, atk: 0, def: 32, spa: 0, spd: 2, spe: 0 },
    why: "The shield stays in the slot. Sitrus is a second HP bar. Sash here would be a waste of the wall.",
  },
  {
    id: "mega",
    name: "The stone",
    slug: "charizard-mega-y",
    item: "Charizardite Y",
    sp: { hp: 2, atk: 0, def: 0, spa: 32, spd: 0, spe: 32 },
    why: "The item slot is the Mega. Drought plus Heat Wave. You do not also hold Sitrus.",
  },
] as const;

const STATS = [
  { key: "hp", label: "HP" },
  { key: "atk", label: "Atk" },
  { key: "def", label: "Def" },
  { key: "spa", label: "SpA" },
  { key: "spd", label: "SpD" },
  { key: "spe", label: "Spe" },
] as const;

export function TrainingViz() {
  const [id, setId] = useState<(typeof SPREADS)[number]["id"]>("race");
  const row = SPREADS.find((s) => s.id === id) ?? SPREADS[0];
  const mon = getPokemon(row.slug);

  return (
    <div className="space-y-5" style={mon ? cssVars(mon.palette) : undefined}>
      <ul className="flex flex-wrap gap-2">
        {SPREADS.map((s) => (
          <li key={s.id}>
            <button
              type="button"
              onClick={() => setId(s.id)}
              className={`rounded-full px-3.5 py-1.5 text-sm transition ${
                s.id === id ? "bg-ink text-bg" : "bg-white/6 text-muted hover:bg-white/10 hover:text-ink"
              }`}
            >
              {s.item}
            </button>
          </li>
        ))}
      </ul>
      <div className="rounded-[28px] border border-line bg-raised/50 p-5">
        <div className="flex items-center gap-4">
          {mon ? <PokemonArt slug={mon.slug} src={mon.artwork} name={mon.name} size={72} /> : null}
          <div>
            <p className="font-semibold tracking-tight">{row.name}</p>
            <p className="mt-1 text-sm text-muted">
              {mon?.name} · {row.item}
            </p>
          </div>
        </div>
        <ul className="mt-5 grid grid-cols-6 gap-1">
          {STATS.map((s) => {
            const n = row.sp[s.key];
            return (
              <li
                key={s.key}
                className={`rounded-lg px-1 py-2 text-center ${n ? "bg-white/10" : "bg-white/[0.04]"}`}
              >
                <p className="font-mono text-[10px] uppercase tracking-[0.08em] text-muted">{s.label}</p>
                <p className={`mt-1 font-mono text-[15px] tabular-nums leading-none ${n ? "font-semibold" : "text-muted/45"}`}>
                  {n || "–"}
                </p>
              </li>
            );
          })}
        </ul>
        <p className="mt-4 text-sm leading-relaxed text-muted">{row.why}</p>
        <p className="mt-2 font-mono text-[11px] text-muted">
          {Object.values(row.sp).reduce((a, b) => a + b, 0 as number)} / 66
        </p>
      </div>
    </div>
  );
}
