"use client";

import { useState } from "react";
import { getPokemon } from "@/lib/catalog/load";
import { cssVars } from "@/lib/champions/palette";
import { PokemonArt } from "@/components/pokemon/PokemonArt";
import { ManualSection } from "@/components/manuals/ManualSection";
import {
  flexPool,
  packList,
  packRequiresSwap,
  packsForSlug,
  resolveActiveBox,
  type ManualPack,
  type TeamManual,
} from "@/content/manuals";

export function ManualRosterHero({
  parent,
  packs,
  activeId,
  onSelectPack,
  focusSlug,
  onFocusSlug,
}: {
  parent: TeamManual;
  packs: ManualPack[];
  activeId: string;
  onSelectPack: (id: string) => void;
  focusSlug: string | null;
  onFocusSlug: (slug: string) => void;
}) {
  const pack = packs.find((p) => p.id === activeId);
  const box = resolveActiveBox(parent, activeId || undefined);
  const bring = new Set((pack?.slugs ?? parent.slugs).filter(Boolean) as string[]);
  const swap = pack && packRequiresSwap(pack) ? pack.requiresSwap : null;
  const alts = flexPool(parent);
  const [packAsk, setPackAsk] = useState<{ slug: string; packIds: string[] } | null>(null);

  function pickMon(slug: string) {
    onFocusSlug(slug);
    if (bring.has(slug)) {
      setPackAsk(null);
      return;
    }
    const hits = packsForSlug(packs, slug);
    if (hits.length === 1) {
      onSelectPack(hits[0].id);
      setPackAsk(null);
      return;
    }
    if (hits.length > 1) {
      setPackAsk({ slug, packIds: hits.map((h) => h.id) });
    } else {
      setPackAsk(null);
    }
  }

  function pickAlt(slug: string) {
    onFocusSlug(slug);
    const unlocked = packs.filter(
      (p) => packRequiresSwap(p) && p.requiresSwap.in === slug,
    );
    if (unlocked.length === 1) {
      onSelectPack(unlocked[0].id);
      setPackAsk(null);
      return;
    }
    if (unlocked.length > 1) {
      setPackAsk({ slug, packIds: unlocked.map((p) => p.id) });
    } else {
      setPackAsk(null);
    }
  }

  if (!box.length) return null;

  return (
    <ManualSection
      id="six"
      title="The six"
      purpose="Registered box, plus bench alts that swap in for a different six. Tap a Pokémon to open its set."
    >
      {swap ? (
        <p className="mb-4 text-sm text-muted">
          Active registration swaps{" "}
          <span className="font-medium text-ink">{getPokemon(swap.out)?.name ?? swap.out}</span>
          {" → "}
          <span className="font-medium text-ink">{getPokemon(swap.in)?.name ?? swap.in}</span>
        </p>
      ) : null}

      <ul className="grid grid-cols-3 gap-2 sm:grid-cols-6 sm:gap-3">
        {box.map((slug) => {
          const mon = getPokemon(slug);
          if (!mon) return null;
          const on = focusSlug === slug;
          const inBring = bring.has(slug);
          const isIn = swap?.in === slug;
          return (
            <li key={slug}>
              <button
                type="button"
                onClick={() => pickMon(slug)}
                className={`flex w-full flex-col items-center rounded-[24px] border px-2 py-3 transition sm:px-3 sm:py-4 ${
                  on
                    ? "border-ink/45 bg-raised"
                    : inBring
                      ? "border-ink/25 bg-raised/50 hover:border-ink/35"
                      : "border-line/70 bg-raised/25 opacity-80 hover:opacity-100"
                }`}
                style={cssVars(mon.palette)}
                aria-pressed={on}
              >
                <PokemonArt
                  slug={mon.slug}
                  src={mon.artwork || mon.sprite}
                  name={mon.name}
                  size={88}
                />
                <span className="mt-2 text-center text-sm font-medium tracking-tight">{mon.name}</span>
                {isIn ? (
                  <span className="mt-1 font-mono text-[10px] uppercase tracking-[0.08em] text-amber-200/90">
                    Flex in
                  </span>
                ) : inBring ? (
                  <span className="mt-1 font-mono text-[10px] uppercase tracking-[0.08em] text-muted">
                    Bring
                  </span>
                ) : (
                  <span className="mt-1 font-mono text-[10px] uppercase tracking-[0.08em] text-muted">
                    Box
                  </span>
                )}
              </button>
            </li>
          );
        })}
      </ul>

      {alts.length ? (
        <div className="mt-8">
          <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.14em] text-muted">
            Bench
          </p>
          <p className="mt-1 text-sm text-muted">
            Off-box swaps. Tap to inspect the set and load the package it unlocks.
          </p>
          <ul className="mt-3 grid gap-2 sm:grid-cols-3">
            {alts.map((alt) => {
              const mon = getPokemon(alt.slug);
              const instead = alt.insteadOf ? getPokemon(alt.insteadOf) : undefined;
              const on = focusSlug === alt.slug;
              const active = swap?.in === alt.slug;
              const unlocked = packList(parent).filter(
                (p) => packRequiresSwap(p) && p.requiresSwap.in === alt.slug,
              );
              if (!mon) return null;
              return (
                <li key={alt.slug}>
                  <button
                    type="button"
                    onClick={() => pickAlt(alt.slug)}
                    className={`flex w-full items-start gap-3 rounded-2xl border px-3 py-3 text-left transition ${
                      on || active
                        ? "border-amber-400/40 bg-amber-500/10"
                        : "border-line/70 bg-raised/30 hover:border-ink/25"
                    }`}
                    style={cssVars(mon.palette)}
                    aria-pressed={on}
                  >
                    <PokemonArt
                      slug={mon.slug}
                      src={mon.sprite || mon.artwork}
                      name={mon.name}
                      size={48}
                    />
                    <span className="min-w-0">
                      <span className="block font-medium tracking-tight">{mon.name}</span>
                      {instead ? (
                        <span className="mt-0.5 block text-xs text-muted">
                          instead of {instead.name}
                        </span>
                      ) : null}
                      {unlocked.length ? (
                        <span className="mt-1 block text-[11px] text-muted">
                          Unlocks {unlocked.map((p) => p.label).join(" · ")}
                        </span>
                      ) : null}
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      ) : null}

      {packAsk ? (
        <div className="mt-4 rounded-2xl border border-line bg-bg/50 p-3">
          <p className="text-sm text-muted">
            {getPokemon(packAsk.slug)?.name} appears in multiple packages — pick one:
          </p>
          <ul className="mt-2 flex flex-wrap gap-2">
            {packAsk.packIds.map((id) => {
              const p = packs.find((x) => x.id === id);
              if (!p) return null;
              return (
                <li key={id}>
                  <button
                    type="button"
                    onClick={() => {
                      onSelectPack(id);
                      setPackAsk(null);
                    }}
                    className="rounded-full border border-line bg-raised/50 px-3 py-1.5 text-sm hover:border-ink/35"
                  >
                    {p.label}
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      ) : null}
    </ManualSection>
  );
}
