"use client";

import { useMemo } from "react";
import Link from "next/link";
import { getPokemon } from "@/lib/catalog/lookup";
import { cssVars } from "@/lib/champions/palette";
import { PokemonArt } from "@/components/pokemon/PokemonArt";
import { TypeBadge } from "@/components/pokemon/TypeBadge";
import { MultChip } from "@/components/scout/MultChip";
import { scoutField, type ScoutFoe, type ScoutSide } from "@/lib/champions/vs";
import { speBand, formatSpeRace, type SpeRaceKind } from "@/lib/champions/vs-stats";
import { TYPE_LABEL } from "@/lib/champions/types";
import { useLiveMatchStore } from "@/stores/live-match";
import type { CatalogEntry } from "@/types/pokemon";

function speLabel(kind: SpeRaceKind) {
  switch (kind) {
    case "always":
      return "You faster";
    case "can":
      return "Spe race";
    case "tie-band":
      return "Spe tie";
    case "outsped":
      return "They faster";
  }
}

export function LiveFieldStrip({
  ourSlugs,
  foeSlugs,
  focusSlug,
  onFocus,
}: {
  ourSlugs: string[];
  foeSlugs: string[];
  focusSlug: string | null;
  onFocus: (slug: string) => void;
}) {
  const bringMoves = useLiveMatchStore((s) => s.bringMoves);

  const ours = useMemo(
    () => ourSlugs.map((s) => getPokemon(s)).filter((p): p is CatalogEntry => Boolean(p)),
    [ourSlugs],
  );
  const foes = useMemo(
    () => foeSlugs.map((s) => getPokemon(s)).filter((p): p is CatalogEntry => Boolean(p)),
    [foeSlugs],
  );

  const field = useMemo(() => {
    if (!ours.length || !foes.length) return null;
    const sides: ScoutSide[] = ours.map((p) => {
      const moves = bringMoves[p.slug];
      return {
        slug: p.slug,
        types: p.types,
        ...(moves?.length ? { moves } : {}),
      };
    });
    const foeRows: ScoutFoe[] = foes.map((p) => ({
      slug: p.slug,
      types: p.types,
      speedAt0: p.speedAt0,
      speedAt32: p.speedAt32,
    }));
    const ourSpe = ours.map((p) => speBand(p));
    return scoutField(sides, foeRows, ourSpe);
  }, [ours, foes, bringMoves]);

  const usingMoves = ours.some((p) => (bringMoves[p.slug]?.length ?? 0) > 0);

  if (!ours.length || !foes.length) {
    return (
      <div className="rounded-[28px] border border-dashed border-line/80 bg-bg/30 px-5 py-8 text-center">
        <p className="text-sm text-muted">
          Load your six from Team, pick a bring of three, then search their preview — the field fills
          in.
        </p>
      </div>
    );
  }

  const shared = field ? [...new Set(field.byFoe.flatMap((r) => r.sharedHoles))] : [];

  return (
    <div className="space-y-5 rounded-[28px] border border-line/70 bg-bg/35 p-4 md:p-5">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.14em] text-muted">
            Field
          </p>
          <h2 className="mt-1 text-lg font-semibold tracking-tight">Bring vs preview</h2>
          <p className="mt-1 max-w-[48ch] text-sm text-muted">
            Each cell is one of yours vs one of theirs: how hard you hit, how hard they hit back, and
            who outspeeds.
          </p>
        </div>
        {shared.length ? (
          <p className="max-w-[28ch] text-sm text-muted">
            Shared weakness across your bring:{" "}
            <span className="text-ink">{shared.map((t) => TYPE_LABEL[t]).join(", ")}</span>
          </p>
        ) : (
          <p className="text-sm text-muted">No type hits every bring mon super-effectively.</p>
        )}
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[32rem] border-collapse text-left text-sm">
          <thead>
            <tr>
              <th className="pb-3 pr-3 font-mono text-[10px] font-semibold uppercase tracking-[0.12em] text-muted">
                Your bring
              </th>
              {foes.map((f) => (
                <th key={f.slug} className="pb-3 px-1.5 font-normal">
                  <button
                    type="button"
                    onClick={() => onFocus(f.slug)}
                    className={`mx-auto flex flex-col items-center gap-1 rounded-xl px-1 py-1 transition ${
                      focusSlug === f.slug ? "bg-white/10" : "hover:bg-white/5"
                    }`}
                    style={cssVars(f.palette)}
                  >
                    <PokemonArt slug={f.slug} src={f.sprite || f.artwork} name={f.name} size={40} />
                    <span className="max-w-[8ch] truncate text-[11px] font-medium">{f.name}</span>
                  </button>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {ours.map((o, oi) => (
              <tr key={o.slug} className="border-t border-line/50">
                <td className="py-3 pr-3 align-top">
                  <button
                    type="button"
                    onClick={() => onFocus(o.slug)}
                    className={`flex items-center gap-2 rounded-xl px-1 py-1 text-left transition ${
                      focusSlug === o.slug ? "bg-white/10" : "hover:bg-white/5"
                    }`}
                    style={cssVars(o.palette)}
                  >
                    <PokemonArt slug={o.slug} src={o.sprite || o.artwork} name={o.name} size={40} />
                    <span className="min-w-0">
                      <span className="block truncate font-medium">{o.name}</span>
                      <span className="mt-0.5 flex gap-1">
                        {o.types.map((t) => (
                          <TypeBadge key={t} type={t} size="sm" />
                        ))}
                      </span>
                      {(bringMoves[o.slug]?.length ?? 0) > 0 ? (
                        <span className="mt-1 block truncate text-[10px] text-muted">
                          {bringMoves[o.slug]!.length} move
                          {bringMoves[o.slug]!.length === 1 ? "" : "s"} set
                        </span>
                      ) : (
                        <span className="mt-1 block text-[10px] text-muted">STAB only</span>
                      )}
                    </span>
                  </button>
                </td>
                {foes.map((f, fi) => {
                  const cell = field?.cells[oi]?.[fi];
                  const race = field?.races[oi]?.[fi];
                  if (!cell) return <td key={f.slug} />;
                  const dealTitle = cell.bestMove
                    ? `Best you land: ${cell.bestMove.name} (${cell.bestMove.mult}×)`
                    : `Best STAB you land: ${cell.bestDealt}×`;
                  const takeTitle = `Worst STAB they land into you: ${cell.worstTaken}×`;
                  return (
                    <td key={f.slug} className="px-1.5 py-3 align-top">
                      <button
                        type="button"
                        onClick={() => onFocus(focusSlug === f.slug ? o.slug : f.slug)}
                        className="flex w-full flex-col gap-1.5 rounded-xl px-1.5 py-2 text-left transition hover:bg-white/5"
                      >
                        <div title={dealTitle}>
                          <p className="mb-0.5 font-mono text-[9px] uppercase tracking-[0.12em] text-muted">
                            You hit
                          </p>
                          <MultChip
                            mult={cell.bestDealt}
                            lane="out"
                            label={cell.bestMove?.name ?? "STAB"}
                          />
                        </div>
                        <div title={takeTitle}>
                          <p className="mb-0.5 font-mono text-[9px] uppercase tracking-[0.12em] text-muted">
                            They hit
                          </p>
                          <MultChip mult={cell.worstTaken} lane="in" label="STAB" />
                        </div>
                        {race ? (
                          <div title={formatSpeRace(race.kind)}>
                            <p className="mb-0.5 font-mono text-[9px] uppercase tracking-[0.12em] text-muted">
                              Speed
                            </p>
                            <span className="text-[11px] font-medium text-ink/90">
                              {speLabel(race.kind)}
                            </span>
                          </div>
                        ) : null}
                      </button>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <dl className="grid gap-2 text-xs text-muted sm:grid-cols-3">
        <div>
          <dt className="font-medium text-ink/80">You hit</dt>
          <dd className="mt-0.5">
            {usingMoves
              ? "Best multiplier from the moves you picked (falls back to STAB if none land)."
              : "Best STAB type into their typing. Pick moves above for real coverage."}
          </dd>
        </div>
        <div>
          <dt className="font-medium text-ink/80">They hit</dt>
          <dd className="mt-0.5">Worst STAB they can land into your typing (their kit not modeled yet).</dd>
        </div>
        <div>
          <dt className="font-medium text-ink/80">Speed</dt>
          <dd className="mt-0.5">
            Nature-neutral race at 0 vs 32 Spe SP.{" "}
            <Link href="/learn/reading-their-six" className="underline hover:text-ink">
              Classify their six
            </Link>
          </dd>
        </div>
      </dl>
    </div>
  );
}
