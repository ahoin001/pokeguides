"use client";

import { getPokemon } from "@/lib/catalog/lookup";
import { TYPE_LABEL } from "@/lib/champions/types";
import { TYPE_IDS, type CatalogEntry, type TypeId } from "@/types/pokemon";
import { TypeIcon } from "@/components/pokemon/TypeIcon";
import { PokemonArt } from "@/components/pokemon/PokemonArt";
import { MANUAL_SCROLL_MT } from "@/components/manuals/ManualToc";
import type { ManualSwitch } from "@/content/manuals";

const LABEL_TO_TYPE = Object.fromEntries(
  TYPE_IDS.map((id) => [TYPE_LABEL[id].toLowerCase(), id]),
) as Record<string, TypeId>;

function resolveType(into: string): TypeId | undefined {
  const key = into.trim().toLowerCase();
  if (LABEL_TO_TYPE[key]) return LABEL_TO_TYPE[key];
  if ((TYPE_IDS as readonly string[]).includes(key)) return key as TypeId;
  return undefined;
}

function resolveSendMons(send: string, team: CatalogEntry[]) {
  const head = send.split(/[.—]/)[0] ?? send;
  const found = team.filter((p) => head.toLowerCase().includes(p.name.toLowerCase()));
  found.sort((a, b) => b.name.length - a.name.length);
  const seen = new Set<string>();
  return found.filter((p) => {
    if (seen.has(p.slug)) return false;
    seen.add(p.slug);
    return true;
  }).slice(0, 2);
}

export function ManualSwitchStrip({
  switches,
  teamSlugs = [],
  embed = false,
}: {
  switches: ManualSwitch[];
  teamSlugs?: string[];
  embed?: boolean;
}) {
  if (!switches.length) return null;
  const team = teamSlugs
    .map((s) => getPokemon(s))
    .filter((p): p is CatalogEntry => Boolean(p));

  return (
    <section
      id={embed ? undefined : "switches"}
      className={embed ? "" : `mt-8 ${MANUAL_SCROLL_MT}`}
    >
      {embed ? null : (
        <>
          <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-muted">Switch board</p>
          <h3 className="mt-1 text-lg font-semibold tracking-tight">They click a type — who walks in</h3>
          <p className="mt-1.5 max-w-[52ch] text-sm text-muted">
            Read the attack type on their Pokémon, then send the partner that takes it best. Reasons stay on the row so you know why.
          </p>
        </>
      )}
      <ul className={`${embed ? "mt-0" : "mt-4"} overflow-hidden rounded-[24px] border border-line bg-raised/40`}>
        {switches.map((row) => {
          const type = resolveType(row.into);
          let mons = resolveSendMons(row.send, team);
          if (!mons.length && team.length) {
            mons = team.filter((p) => p && row.send.toLowerCase().includes(p.name.toLowerCase())) as NonNullable<
              (typeof team)[number]
            >[];
          }
          const reason = row.send.includes(".")
            ? row.send.slice(row.send.indexOf(".") + 1).trim()
            : row.send;

          return (
            <li
              key={`${row.into}-${row.send}`}
              className="grid grid-cols-[auto_minmax(0,1fr)] items-start gap-3 border-t border-line/70 px-4 py-3 first:border-t-0 sm:grid-cols-[7rem_auto_minmax(0,1fr)] sm:items-center"
            >
              <div className="flex items-center gap-2">
                {type ? <TypeIcon type={type} size="md" /> : null}
                <p className="text-sm font-semibold tracking-tight">{row.into}</p>
              </div>
              <p className="hidden font-mono text-[10px] uppercase tracking-wide text-muted sm:block">send</p>
              <div className="min-w-0 sm:col-auto">
                <div className="flex flex-wrap items-center gap-2">
                  {mons.map((p) => (
                    <span key={p.slug} className="inline-flex items-center gap-2 rounded-full bg-white/6 py-1 pl-1 pr-2.5">
                      <PokemonArt slug={p.slug} src={p.sprite || p.artwork} name={p.name} size={28} />
                      <span className="text-sm font-medium">{p.name}</span>
                    </span>
                  ))}
                  {!mons.length ? <span className="text-sm font-medium">{row.send.split(".")[0]}</span> : null}
                </div>
                {reason ? <p className="mt-1.5 text-sm leading-relaxed text-muted">{reason}</p> : null}
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
