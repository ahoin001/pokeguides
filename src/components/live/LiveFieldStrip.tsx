"use client";

import { useMemo } from "react";
import Link from "next/link";
import { getPokemon } from "@/lib/catalog/lookup";
import { cssVars } from "@/lib/champions/palette";
import { PokemonArt } from "@/components/pokemon/PokemonArt";
import { TypeBadge } from "@/components/pokemon/TypeBadge";
import { MultChip } from "@/components/scout/MultChip";
import { scoutField, type ScoutFoe, type ScoutSide } from "@/lib/champions/vs";
import { speBand, formatSpeRaceShort } from "@/lib/champions/vs-stats";
import { TYPE_LABEL } from "@/lib/champions/types";
import type { CatalogEntry } from "@/types/pokemon";

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
    const sides: ScoutSide[] = ours.map((p) => ({ slug: p.slug, types: p.types }));
    const foeRows: ScoutFoe[] = foes.map((p) => ({
      slug: p.slug,
      types: p.types,
      speedAt0: p.speedAt0,
      speedAt32: p.speedAt32,
    }));
    const ourSpe = ours.map((p) => speBand(p));
    return scoutField(sides, foeRows, ourSpe);
  }, [ours, foes]);

  if (!ours.length || !foes.length) {
    return (
      <div className="rounded-[28px] border border-dashed border-line/80 bg-bg/30 px-5 py-8 text-center">
        <p className="text-sm text-muted">
          Load your six from Team, pick a bring of three, then search their preview — the field fills in.
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
        </div>
        {shared.length ? (
          <p className="text-sm text-muted">
            Shared holes:{" "}
            {shared.map((t) => TYPE_LABEL[t]).join(", ")}
          </p>
        ) : (
          <p className="text-sm text-muted">No shared SE hole across the whole bring.</p>
        )}
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[28rem] border-collapse text-left text-sm">
          <thead>
            <tr>
              <th className="pb-2 pr-3 font-mono text-[10px] font-semibold uppercase tracking-[0.12em] text-muted">
                Ours
              </th>
              {foes.map((f) => (
                <th key={f.slug} className="pb-2 px-1.5 font-normal">
                  <button
                    type="button"
                    onClick={() => onFocus(f.slug)}
                    className={`mx-auto flex flex-col items-center gap-1 rounded-xl px-1 py-1 transition ${
                      focusSlug === f.slug ? "bg-white/10" : "hover:bg-white/5"
                    }`}
                    style={cssVars(f.palette)}
                  >
                    <PokemonArt slug={f.slug} src={f.sprite || f.artwork} name={f.name} size={40} />
                    <span className="max-w-[7ch] truncate text-[11px]">{f.name}</span>
                  </button>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {ours.map((o, oi) => (
              <tr key={o.slug} className="border-t border-line/50">
                <td className="py-2.5 pr-3">
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
                    </span>
                  </button>
                </td>
                {foes.map((f, fi) => {
                  const cell = field?.cells[oi]?.[fi];
                  const race = field?.races[oi]?.[fi];
                  if (!cell) return <td key={f.slug} />;
                  return (
                    <td key={f.slug} className="px-1.5 py-2.5 align-middle">
                      <button
                        type="button"
                        onClick={() => onFocus(focusSlug === f.slug ? o.slug : f.slug)}
                        className="flex w-full flex-col items-center gap-1 rounded-xl px-1 py-1.5 transition hover:bg-white/5"
                      >
                        <MultChip mult={cell.bestDealt} lane="out" label="out" />
                        <MultChip mult={cell.worstTaken} lane="in" label="in" />
                        {race ? (
                          <span className="font-mono text-[10px] text-muted">
                            {formatSpeRaceShort(race.kind)}
                          </span>
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
      <p className="text-xs text-muted">
        Out = best STAB you land. In = worst STAB you take. Spe = band race at 0 / 32 SP.{" "}
        <Link href="/learn/reading-their-six" className="underline hover:text-ink">
          Classify their six
        </Link>
        .
      </p>
    </div>
  );
}
