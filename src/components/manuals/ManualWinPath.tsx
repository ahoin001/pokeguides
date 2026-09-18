"use client";

import { getPokemon } from "@/lib/catalog/load";
import { cssVars } from "@/lib/champions/palette";
import { PokemonArt } from "@/components/pokemon/PokemonArt";
import {
  resolvePackStrategy,
  type ManualEndgame,
  type ManualPack,
  type TeamManual,
} from "@/content/manuals";

function pathSlugs(path: string): string[] {
  return path
    .split(/[→>,/|]+/)
    .map((s) => s.trim())
    .filter(Boolean)
    .flatMap((token) => {
      const mon = getPokemon(token);
      if (mon) return [mon.slug];
      // allow raw names that match slug-ish
      const bySlug = getPokemon(token.toLowerCase().replace(/\s+/g, "-"));
      return bySlug ? [bySlug.slug] : [];
    });
}

export function ManualWinPath({
  parent,
  pack,
}: {
  parent: TeamManual;
  pack?: ManualPack;
}) {
  const all = parent.construction?.endgames ?? [];
  const strategy = pack ? resolvePackStrategy(pack) : null;
  const linked =
    pack?.endgameIds?.length
      ? all.filter((e) => pack.endgameIds!.includes(e.id))
      : all;
  const shown: ManualEndgame[] = linked.length ? linked : all;

  if (!shown.length && !strategy?.winCondition) return null;

  return (
    <div className="space-y-8">
      {strategy?.winCondition ? (
        <div className="rounded-[28px] border border-line bg-raised/40 px-5 py-6 sm:px-7">
          <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.14em] text-muted">
            This package wins by
          </p>
          <p className="mt-3 max-w-[52ch] text-xl font-semibold tracking-tight sm:text-2xl">
            {strategy.winCondition}
          </p>
          {strategy.gamePlan ? (
            <p className="mt-3 max-w-[48ch] text-sm text-muted">{strategy.gamePlan}</p>
          ) : null}
        </div>
      ) : null}

      {shown.length ? (
        <ul className="grid gap-4 md:grid-cols-3">
          {shown.map((eg, i) => {
            const slugs = pathSlugs(eg.path);
            const primary = slugs[0] ? getPokemon(slugs[0]) : getPokemon(eg.path);
            const active =
              pack?.endgameIds?.includes(eg.id) ||
              (pack && slugs.some((s) => (pack.slugs as string[]).includes(s)));
            return (
              <li
                key={eg.id}
                className={`rounded-[28px] border px-5 py-6 transition ${
                  active
                    ? "border-ink/35 bg-raised/50"
                    : "border-line/70 bg-raised/25 opacity-75"
                }`}
                style={primary ? cssVars(primary.palette) : undefined}
              >
                <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.14em] text-muted">
                  Endgame {i + 1}
                </p>
                <h3 className="mt-2 text-lg font-semibold tracking-tight">{eg.label}</h3>
                {slugs.length || primary ? (
                  <div className="mt-4 flex items-end gap-1">
                    {(slugs.length ? slugs : primary ? [primary.slug] : []).map((slug) => {
                      const mon = getPokemon(slug);
                      if (!mon) return null;
                      return (
                        <PokemonArt
                          key={slug}
                          slug={mon.slug}
                          src={mon.sprite || mon.artwork}
                          name={mon.name}
                          size={56}
                        />
                      );
                    })}
                  </div>
                ) : null}
                <p className="mt-4 text-sm leading-relaxed text-muted">{eg.how}</p>
                {active && pack ? (
                  <p className="mt-3 font-mono text-[10px] uppercase tracking-[0.1em] text-ink">
                    Pursued by {pack.label}
                  </p>
                ) : null}
              </li>
            );
          })}
        </ul>
      ) : null}
    </div>
  );
}
