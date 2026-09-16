"use client";

import Link from "next/link";
import { getPokemon } from "@/lib/catalog/lookup";
import { getRankedBySlug } from "@/lib/ranked/load";
import { cssVars } from "@/lib/champions/palette";
import { speBand } from "@/lib/champions/vs-stats";
import { PokemonArt } from "@/components/pokemon/PokemonArt";
import { TypeBadge } from "@/components/pokemon/TypeBadge";
import { KitUsagePanel } from "@/components/ladder/KitUsage";
import { tellsForSlug, ARCHETYPE_LABEL, archetypeHref } from "@/content/archetypes";
import { useLiveMatchStore } from "@/stores/live-match";
import type { ParsedBattleKit } from "@/lib/champions-battle/types";

function rankedToKit(slug: string): ParsedBattleKit | undefined {
  const ranked = getRankedBySlug(slug);
  if (!ranked) return undefined;
  return {
    moves: ranked.moves,
    items: ranked.items.length ? ranked.items : ranked.item ? [ranked.item] : [],
    abilities: ranked.ability ? [ranked.ability] : [],
    natures: ranked.nature ? [ranked.nature] : [],
    spreads: ranked.spread ? [ranked.spread] : [],
    teammates: ranked.teammates.map((name) => ({ name })),
  };
}

export function LiveFocusRail() {
  const focusSlug = useLiveMatchStore((s) => s.focusSlug);
  const setAttacker = useLiveMatchStore((s) => s.setAttacker);
  const setDefender = useLiveMatchStore((s) => s.setDefender);

  if (!focusSlug) {
    return (
      <aside className="rounded-[28px] border border-line/70 bg-raised/40 p-5">
        <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.14em] text-muted">
          Focus
        </p>
        <p className="mt-3 text-sm text-muted">Tap a Pokémon on stage for kit, Spe bands, and calc hooks.</p>
      </aside>
    );
  }

  const mon = getPokemon(focusSlug);
  if (!mon) {
    return (
      <aside className="rounded-[28px] border border-line/70 bg-raised/40 p-5">
        <p className="text-sm text-muted">That name is not in the legal catalog.</p>
      </aside>
    );
  }

  const kit = rankedToKit(focusSlug);
  const ranked = getRankedBySlug(focusSlug);
  const spe = speBand(mon);
  const tells = tellsForSlug(focusSlug);

  return (
    <aside
      className="max-h-[min(70dvh,40rem)] space-y-6 overflow-y-auto rounded-[28px] border border-line/70 bg-raised/50 p-5 lg:sticky lg:top-[calc(var(--sticky-stack)+1rem)]"
      style={cssVars(mon.palette)}
    >
      <div className="flex items-start gap-3">
        <PokemonArt slug={mon.slug} src={mon.artwork} name={mon.name} size={72} className="shrink-0" />
        <div className="min-w-0">
          <p className="font-mono text-[10px] text-muted">
            {ranked ? `Singles #${ranked.rank}` : "No ranked kit"}
          </p>
          <h2 className="mt-0.5 text-2xl font-semibold tracking-tight">{mon.name}</h2>
          <div className="mt-2 flex flex-wrap gap-1">
            {mon.types.map((t) => (
              <TypeBadge key={t} type={t} size="sm" />
            ))}
          </div>
          <p className="mt-2 font-mono text-xs text-muted">
            Spe {spe.at0}–{spe.at32}
            {ranked?.nature?.name ? ` · ${ranked.nature.name}` : ""}
          </p>
        </div>
      </div>

      {tells.length ? (
        <div className="flex flex-wrap gap-2">
          {tells.map(({ style }) => (
            <Link
              key={style.id}
              href={archetypeHref(style.id)}
              className="rounded-full border border-line/80 bg-bg/50 px-3 py-1 text-xs transition hover:border-ink/40"
            >
              Tell → {ARCHETYPE_LABEL[style.id]}
            </Link>
          ))}
          <Link
            href="/learn/reading-their-six"
            className="rounded-full px-2 py-1 text-xs text-muted underline hover:text-ink"
          >
            Classroom
          </Link>
        </div>
      ) : null}

      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => setAttacker(focusSlug)}
          className="rounded-full bg-ink px-3.5 py-1.5 text-xs font-medium text-bg"
        >
          Calc attacker
        </button>
        <button
          type="button"
          onClick={() => setDefender(focusSlug)}
          className="rounded-full border border-line px-3.5 py-1.5 text-xs"
        >
          Calc defender
        </button>
        <Link href={`/pokemon/${mon.slug}`} className="rounded-full border border-line px-3.5 py-1.5 text-xs">
          Dex
        </Link>
      </div>

      {kit ? (
        <KitUsagePanel kit={kit} />
      ) : (
        <p className="text-sm text-muted">No Champions Battle Data kit in the snapshot for this species.</p>
      )}
    </aside>
  );
}
