"use client";

import Link from "next/link";
import { PokemonArt } from "@/components/pokemon/PokemonArt";
import { ROLE_LABEL } from "@/content/roles";
import type { Suggestion } from "@/lib/champions/suggest";
import { rankedPartnerCite } from "@/lib/ranked/partners";

const SOURCE_LABEL: Record<Suggestion["source"], string> = {
  ranked: "Ranked",
  starter: "Usage",
  classroom: "Classroom",
  coverage: "Coverage",
  archetype: "Style",
};

export function NextPicks({
  suggestions,
  filledCount,
  onPick,
}: {
  suggestions: Suggestion[];
  filledCount: number;
  onPick: (slug: string) => void;
}) {
  if (!suggestions.length || filledCount >= 3) return null;

  const title =
    filledCount === 0 ? "High-usage starters" : filledCount === 1 ? "Usual partners" : "Next picks";

  return (
    <section className="mt-6 rounded-[24px] border border-line bg-raised/25 p-4">
      <div className="flex flex-wrap items-end justify-between gap-2">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-muted">{title}</p>
          <p className="mt-1 max-w-[52ch] text-sm text-muted">
            {filledCount === 0
              ? "Legal Ranked Singles names to open with. Partners appear after you lock one in."
              : "Ranked Singles teammate co-occurrence first. Coverage and classroom notes are labeled."}
          </p>
        </div>
        <p className="font-mono text-[10px] text-muted">{rankedPartnerCite()}</p>
      </div>

      <ul className="mt-4 grid gap-2 sm:grid-cols-2">
        {suggestions.map((s) => (
          <li key={s.pokemon.slug}>
            <button
              type="button"
              onClick={() => onPick(s.pokemon.slug)}
              className="flex w-full items-start gap-3 rounded-2xl border border-line bg-bg/40 px-3 py-2.5 text-left transition hover:border-ink/30 hover:bg-white/5"
            >
              <PokemonArt
                slug={s.pokemon.slug}
                src={s.pokemon.sprite || s.pokemon.artwork}
                name={s.pokemon.name}
                size={40}
                className="shrink-0"
              />
              <span className="min-w-0 flex-1">
                <span className="flex flex-wrap items-baseline gap-2">
                  <span className="font-medium tracking-tight">{s.pokemon.name}</span>
                  <span className="font-mono text-[10px] uppercase tracking-[0.1em] text-muted">
                    {SOURCE_LABEL[s.source]} · {ROLE_LABEL[s.job]}
                  </span>
                </span>
                <span className="mt-0.5 block text-xs leading-snug text-muted">{s.why}</span>
              </span>
            </button>
          </li>
        ))}
      </ul>

      <p className="mt-3 text-[11px] text-muted">
        Co-occurrence from{" "}
        <Link href="/meta" className="underline">
          Ranked Singles Battle Data
        </Link>
        . Not win rate. Not doubles.
      </p>
    </section>
  );
}
