"use client";

import Link from "next/link";
import { getPokemon } from "@/lib/catalog/lookup";
import { cssVars } from "@/lib/champions/palette";
import { PokemonArt } from "@/components/pokemon/PokemonArt";
import {
  flexPool,
  packList,
  packRequiresSwap,
  type TeamManual,
} from "@/content/manuals";

/** Flex-pool strip: alts that unlock swap-gated packages. */
export function ManualFlexSwaps({
  parent,
  onSelectPack,
}: {
  parent: TeamManual;
  onSelectPack?: (packId: string) => void;
}) {
  const alts = flexPool(parent);
  const packs = packList(parent);
  if (!alts.length) return null;

  return (
    <section
      aria-label="Flex swaps"
      className="rounded-[24px] border border-line/70 bg-sunken/40 px-4 py-4"
    >
      <div className="flex flex-wrap items-end justify-between gap-2">
        <div>
          <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.14em] text-muted">
            Flex pool
          </p>
          <p className="mt-1 text-sm text-muted">
            Swap candidates off the core six — unlock packages the default registration cannot run.
          </p>
        </div>
      </div>
      <ul className="mt-4 space-y-3">
        {alts.map((alt) => {
          const mon = getPokemon(alt.slug);
          const instead = alt.insteadOf ? getPokemon(alt.insteadOf) : undefined;
          const unlocked = packs.filter(
            (p) =>
              packRequiresSwap(p) &&
              p.requiresSwap.in === alt.slug &&
              (!alt.insteadOf || p.requiresSwap.out === alt.insteadOf),
          );
          return (
            <li
              key={alt.slug}
              className="flex flex-wrap items-start gap-3 rounded-2xl border border-line/60 bg-raised/40 p-3"
              style={mon ? cssVars(mon.palette) : undefined}
            >
              {mon ? (
                <Link href={`/pokemon/${mon.slug}`} className="shrink-0">
                  <PokemonArt
                    slug={mon.slug}
                    src={mon.sprite || mon.artwork}
                    name={mon.name}
                    size={48}
                  />
                </Link>
              ) : null}
              <div className="min-w-0 flex-1">
                <p className="font-medium tracking-tight">
                  {mon?.name ?? alt.slug}
                  {instead ? (
                    <span className="font-normal text-muted"> instead of {instead.name}</span>
                  ) : null}
                </p>
                <p className="mt-1 text-sm text-muted">{alt.why}</p>
                {(alt.answers || alt.costs) && (
                  <p className="mt-1.5 text-[12px] text-muted">
                    {alt.answers ? <span>Gains: {alt.answers}</span> : null}
                    {alt.answers && alt.costs ? " · " : null}
                    {alt.costs ? <span>Costs: {alt.costs}</span> : null}
                  </p>
                )}
                {unlocked.length ? (
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {unlocked.map((p) => (
                      <button
                        key={p.id}
                        type="button"
                        onClick={() => onSelectPack?.(p.id)}
                        className="rounded-full border border-line px-2.5 py-1 text-[11px] font-medium text-muted transition hover:border-ink/40 hover:text-ink"
                      >
                        Unlocks · {p.label}
                      </button>
                    ))}
                  </div>
                ) : null}
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
