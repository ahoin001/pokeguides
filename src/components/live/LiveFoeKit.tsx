"use client";

import { getPokemon } from "@/lib/catalog/lookup";
import { getRankedBySlug, legalSlugFromRankedName } from "@/lib/ranked/load";
import { cssVars } from "@/lib/champions/palette";
import { PokemonArt } from "@/components/pokemon/PokemonArt";
import { formatPct, shareLabel } from "@/lib/ranked/format";
import { teammateWhy } from "@/lib/live/compare";
import { MAX_FOES, useLiveMatchStore } from "@/stores/live-match";

export function LiveFoeKit({ foeSlug }: { foeSlug: string }) {
  const foes = useLiveMatchStore((s) => s.foes);
  const addFoe = useLiveMatchStore((s) => s.addFoe);

  const mon = getPokemon(foeSlug);
  const ranked = getRankedBySlug(foeSlug);
  if (!mon || !ranked) {
    return (
      <p className="text-sm text-muted">
        No Singles ladder kit for this name yet — compare Spe and types above.
      </p>
    );
  }

  return (
    <div className="space-y-4" style={cssVars(mon.palette)}>
      <div>
        <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.14em] text-muted">
          Ladder details
        </p>
        <p className="mt-1 text-sm text-muted">
          Ability, nature, and teammates. Common moves and items are on the Them panel.
        </p>
      </div>

      <dl className="space-y-2 text-sm">
        {ranked.ability ? (
          <div>
            <dt className="font-mono text-[10px] uppercase tracking-[0.12em] text-muted">
              Ability
            </dt>
            <dd className="mt-0.5">{shareLabel(ranked.ability)}</dd>
          </div>
        ) : null}
        {ranked.nature ? (
          <div>
            <dt className="font-mono text-[10px] uppercase tracking-[0.12em] text-muted">
              Nature
            </dt>
            <dd className="mt-0.5">{shareLabel(ranked.nature)}</dd>
          </div>
        ) : null}
        {ranked.spread ? (
          <div>
            <dt className="font-mono text-[10px] uppercase tracking-[0.12em] text-muted">
              Leading SP
            </dt>
            <dd className="mt-0.5 font-mono text-xs tabular-nums text-muted">
              {ranked.spread.hp}/{ranked.spread.atk}/{ranked.spread.def}/
              {ranked.spread.spa}/{ranked.spread.spd}/{ranked.spread.spe}
              {ranked.spread.pct != null ? ` · ${formatPct(ranked.spread.pct)}` : ""}
            </dd>
          </div>
        ) : null}
      </dl>

      {ranked.teammates.length ? (
        <div>
          <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.14em] text-muted">
            Often with
          </p>
          <ul className="mt-2 flex flex-wrap gap-2">
            {ranked.teammates.slice(0, 8).map((name) => {
              const slug = legalSlugFromRankedName(name);
              const partner = slug ? getPokemon(slug) : undefined;
              const logged = slug ? foes.includes(slug) : false;
              const full = foes.length >= MAX_FOES;
              const why = teammateWhy(slug ?? "", name);
              return (
                <li key={name}>
                  <button
                    type="button"
                    disabled={!slug || logged || full}
                    onClick={() => slug && addFoe(slug)}
                    title={
                      !slug
                        ? name
                        : logged
                          ? "Already logged"
                          : full
                            ? "Their six is full"
                            : `Add ${name}`
                    }
                    className="inline-flex items-center gap-2 rounded-full border border-line/70 bg-raised/40 py-1 pl-1 pr-3 text-left text-sm transition enabled:hover:border-ink/40 disabled:opacity-50"
                    style={partner ? cssVars(partner.palette) : undefined}
                  >
                    {partner ? (
                      <PokemonArt
                        slug={partner.slug}
                        src={partner.sprite || partner.artwork}
                        name={partner.name}
                        size={28}
                      />
                    ) : null}
                    <span className="min-w-0">
                      <span className="block font-medium leading-tight">
                        {partner?.name ?? name}
                      </span>
                      <span className="block text-[11px] text-muted">{why}</span>
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      ) : null}
    </div>
  );
}
