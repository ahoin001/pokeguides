"use client";

import { useMemo } from "react";
import Link from "next/link";
import { parseAsString, parseAsStringLiteral, useQueryState } from "nuqs";
import { PageFrame } from "@/components/chrome/PageFrame";
import { catalog } from "@/lib/catalog/load";
import { getEditorial } from "@/lib/catalog/load";
import { searchCatalog, sortCatalog, type SortKey } from "@/lib/catalog/search";
import { PokemonCard } from "@/components/pokemon/PokemonCard";
import { PokemonArt } from "@/components/pokemon/PokemonArt";
import { TypeIcon } from "@/components/pokemon/TypeIcon";
import { MoveChip } from "@/components/moves/MoveChip";
import { MoveStatGrid } from "@/components/moves/MoveStatGrid";
import { TYPE_IDS } from "@/types/pokemon";
import { TYPE_LABEL } from "@/lib/champions/types";
import type { TypeId } from "@/types/pokemon";
import type { MoveCategory } from "@/lib/champions/damage";
import {
  MOVE_PRIORITY_FILTERS,
  MOVE_TAG_IDS,
  MOVE_TAG_LABEL,
  categoryLabel,
  filterChampionsMoves,
  listChampionsMoves,
  priorityFilterLabel,
  sortChampionsMoves,
  type MovePriorityFilterId,
  type MoveSortKey,
  type MoveTagId,
  type IndexedMove,
} from "@/lib/champions/move-index";
import {
  ABILITY_TAG_IDS,
  ABILITY_TAG_LABEL,
  filterChampionsAbilities,
  listChampionsAbilities,
  sortChampionsAbilities,
  type AbilitySortKey,
  type AbilityTagId,
  type IndexedAbility,
} from "@/lib/champions/ability-index";
import {
  ROLE_FAMILIES,
  ROLE_FAMILY_GROUPS,
  getRoleFamily,
  isRoleFamilyId,
  pokemonRunsTool,
  type RoleFamilyId,
} from "@/lib/champions/role-index";

const MODES = ["pokemon", "moves", "abilities"] as const;
export type ReferenceMode = (typeof MODES)[number];

const POKEMON_SORTS = ["dex", "name", "bst", "spe", "usage"] as const;
const MOVE_SORTS = ["name", "power", "priority", "type", "category"] as const;
const ABILITY_SORTS = ["name", "carriers"] as const;
const CATEGORIES = ["", "physical", "special", "status"] as const;
const PRIORITY_IDS = MOVE_PRIORITY_FILTERS.map((f) => f.id);

function asPokemonSort(value: string): SortKey {
  return (POKEMON_SORTS as readonly string[]).includes(value) ? (value as SortKey) : "dex";
}

function asMoveSort(value: string): MoveSortKey {
  return (MOVE_SORTS as readonly string[]).includes(value) ? (value as MoveSortKey) : "name";
}

function asAbilitySort(value: string): AbilitySortKey {
  return (ABILITY_SORTS as readonly string[]).includes(value) ? (value as AbilitySortKey) : "name";
}

export function ReferenceBoard({ defaultMode }: { defaultMode: ReferenceMode }) {
  const [mode, setMode] = useQueryState(
    "mode",
    parseAsStringLiteral(MODES).withDefault(defaultMode),
  );
  const [q, setQ] = useQueryState("q", parseAsString.withDefault(""));
  const [family, setFamily] = useQueryState("family", parseAsString.withDefault(""));
  const [tool, setTool] = useQueryState("tool", parseAsString.withDefault(""));

  const familyId = isRoleFamilyId(family) ? family : "";
  const familyGuide = getRoleFamily(familyId);
  const tools = familyGuide?.tools ?? [];
  const activeTool = tools.some((t) => t.id === tool) ? tool : "";

  const placeholder =
    mode === "pokemon"
      ? "Search name, type, ability"
      : mode === "moves"
        ? "Search name, type, effect…"
        : "Search ability, effect, Pokémon…";

  return (
    <PageFrame variant="board">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <div className="inline-flex rounded-full border border-line bg-raised/50 p-1">
            {MODES.map((id) => {
              const on = mode === id;
              const label = id === "pokemon" ? "Pokémon" : id === "moves" ? "Moves" : "Abilities";
              return (
                <button
                  key={id}
                  type="button"
                  aria-pressed={on}
                  onClick={() => setMode(id)}
                  className={`rounded-full px-4 py-1.5 text-sm font-medium transition ${
                    on ? "bg-ink text-bg" : "text-muted hover:text-ink"
                  }`}
                >
                  {label}
                </button>
              );
            })}
          </div>
          <h1 className="mt-4 text-4xl font-semibold tracking-tight">
            {mode === "pokemon"
              ? "Legal roster"
              : mode === "moves"
                ? "Move appendix"
                : "Ability appendix"}
          </h1>
        </div>
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder={placeholder}
          className="w-full rounded-2xl border border-line bg-sunken px-4 py-3 md:max-w-sm"
        />
      </div>

      <div className="mt-6 flex flex-wrap items-center gap-2">
        <select
          value={familyId}
          onChange={(e) => {
            void setFamily(e.target.value);
            void setTool("");
          }}
          className="rounded-full border border-line bg-raised px-3 py-2 text-sm"
        >
          <option value="">All roles</option>
          {ROLE_FAMILY_GROUPS.map((group) => (
            <optgroup key={group.id} label={group.label}>
              {ROLE_FAMILIES.filter((f) => f.group === group.id).map((f) => (
                <option key={f.id} value={f.id}>
                  {f.label}
                </option>
              ))}
            </optgroup>
          ))}
        </select>
        {tools.length ? (
          <div className="flex flex-wrap gap-1.5">
            {tools.map((t) => {
              const on = activeTool === t.id;
              return (
                <button
                  key={t.id}
                  type="button"
                  aria-pressed={on}
                  onClick={() => setTool(on ? "" : t.id)}
                  className={`rounded-full border px-2.5 py-1 text-[11px] font-medium transition ${
                    on
                      ? "border-ink bg-ink text-bg"
                      : "border-line/80 bg-canvas/40 text-muted hover:text-ink"
                  }`}
                >
                  {t.label}
                </button>
              );
            })}
          </div>
        ) : null}
      </div>
      {familyGuide ? (
        <p className="mt-3 max-w-2xl text-sm text-muted">
          {familyGuide.label}
          {activeTool ? ` · ${tools.find((t) => t.id === activeTool)?.label}` : ""} — Pokémon that
          learn or run the tool, moves in the family, abilities that fill it. Ladder usage is who
          actually clicks it.
        </p>
      ) : (
        <p className="mt-3 max-w-2xl text-sm text-muted">
          Filter the M-C roster the way a role compendium does: pick a job, then the move or ability
          that fills it.
        </p>
      )}

      {mode === "pokemon" ? (
        <PokemonPanel q={q} family={familyId} tool={activeTool} />
      ) : mode === "moves" ? (
        <MovesPanel q={q} family={familyId} />
      ) : (
        <AbilitiesPanel q={q} family={familyId} />
      )}
    </PageFrame>
  );
}

function PokemonPanel({
  q,
  family,
  tool,
}: {
  q: string;
  family: RoleFamilyId | "";
  tool: string;
}) {
  const [type, setType] = useQueryState("type", parseAsString.withDefault(""));
  const [sort, setSort] = useQueryState("sort", parseAsString.withDefault("dex"));
  const familyGuide = getRoleFamily(family);
  const activeTool = familyGuide?.tools.find((t) => t.id === tool);

  const rows = useMemo(() => {
    const found = searchCatalog(catalog, q, {
      type: type as never,
      family,
      tool: tool || undefined,
    });
    return sortCatalog(found, asPokemonSort(sort));
  }, [q, type, family, tool, sort]);

  return (
    <>
      <p className="mt-2 text-muted">
        {rows.length} Pokémon in the current catalog
        {familyGuide ? ` · ${familyGuide.label}` : ""}
        {activeTool ? ` · ${activeTool.label}` : ""}
        {type ? ` · ${TYPE_LABEL[type as TypeId]}` : ""}.
      </p>
      <div className="mt-4 flex flex-wrap items-center gap-2">
        <div className="flex flex-wrap gap-1.5">
          {TYPE_IDS.map((t) => {
            const on = type === t;
            return (
              <button
                key={t}
                type="button"
                aria-pressed={on}
                onClick={() => setType(on ? "" : t)}
                className={`rounded-full p-0.5 transition ${on ? "ring-2 ring-ink" : "opacity-50 hover:opacity-100"}`}
              >
                <TypeIcon type={t} size="sm" />
              </button>
            );
          })}
        </div>
        <select
          value={asPokemonSort(sort)}
          onChange={(e) => setSort(e.target.value)}
          className="rounded-full border border-line bg-raised px-3 py-2 text-sm"
        >
          <option value="dex">Dex number</option>
          <option value="name">Name</option>
          <option value="bst">BST</option>
          <option value="spe">Speed</option>
          <option value="usage">Ladder usage</option>
        </select>
      </div>
      <div className="mt-8 grid grid-cols-2 gap-3 md:grid-cols-4">
        {rows.map((p) => {
          const runs = activeTool ? pokemonRunsTool(p, activeTool) : false;
          return (
            <PokemonCard
              key={p.slug}
              pokemon={p}
              job={runs ? `Runs ${activeTool?.label} on ladder` : getEditorial(p.slug)?.job}
            />
          );
        })}
      </div>
      {!rows.length ? (
        <p className="mt-10 text-center text-sm text-muted">No Pokémon match those filters.</p>
      ) : null}
    </>
  );
}

function MovesPanel({ q, family }: { q: string; family: RoleFamilyId | "" }) {
  const all = useMemo(() => listChampionsMoves(), []);
  const [type, setType] = useQueryState("type", parseAsString.withDefault(""));
  const [category, setCategory] = useQueryState("cat", parseAsString.withDefault(""));
  const [tag, setTag] = useQueryState("tag", parseAsString.withDefault(""));
  const [priority, setPriority] = useQueryState(
    "pri",
    parseAsStringLiteral(PRIORITY_IDS).withDefault(""),
  );
  const [sort, setSort] = useQueryState("sort", parseAsString.withDefault("name"));

  const rows = useMemo(() => {
    const found = filterChampionsMoves(all, {
      q,
      type: (type || "") as TypeId | "",
      category: (category || "") as MoveCategory | "",
      tag: (tag || "") as MoveTagId | "",
      family,
      priority: priority as MovePriorityFilterId,
    });
    return sortChampionsMoves(found, asMoveSort(sort));
  }, [all, q, type, category, tag, family, priority, sort]);

  return (
    <>
      <p className="mt-2 text-muted">
        {rows.length} of {all.length} Champions moves
        {priority ? ` · Pri ${priorityFilterLabel(priority)}` : ""}
        {tag ? ` · ${MOVE_TAG_LABEL[tag as MoveTagId]}` : ""}
        {category ? ` · ${categoryLabel(category as MoveCategory)}` : ""}
        {type ? ` · ${TYPE_LABEL[type as TypeId]}` : ""}.
      </p>

      <div className="mt-4 flex flex-wrap items-center gap-2">
        <div className="flex flex-wrap gap-1.5">
          {TYPE_IDS.map((t) => {
            const on = type === t;
            return (
              <button
                key={t}
                type="button"
                aria-pressed={on}
                title={TYPE_LABEL[t]}
                onClick={() => setType(on ? "" : t)}
                className={`rounded-full p-0.5 transition ${on ? "ring-2 ring-ink" : "opacity-50 hover:opacity-100"}`}
              >
                <TypeIcon type={t} size="sm" />
              </button>
            );
          })}
        </div>

        <div className="flex flex-wrap gap-1.5">
          {CATEGORIES.map((c) => {
            const on = category === c;
            const label = c ? categoryLabel(c) : "All cats";
            return (
              <button
                key={c || "all"}
                type="button"
                aria-pressed={on}
                onClick={() => setCategory(c)}
                className={`rounded-full border px-3 py-1.5 text-xs font-medium transition ${
                  on ? "border-ink bg-ink text-bg" : "border-line bg-raised text-muted hover:text-ink"
                }`}
              >
                {label}
              </button>
            );
          })}
        </div>

        <div className="flex flex-wrap gap-1.5">
          {MOVE_PRIORITY_FILTERS.map((f) => {
            const on = priority === f.id;
            return (
              <button
                key={f.id || "pri-any"}
                type="button"
                aria-pressed={on}
                onClick={() => setPriority(f.id)}
                className={`rounded-full border px-3 py-1.5 text-xs font-medium transition ${
                  on ? "border-ink bg-ink text-bg" : "border-line bg-raised text-muted hover:text-ink"
                }`}
              >
                {f.id ? `Pri ${f.label}` : f.label}
              </button>
            );
          })}
        </div>

        <select
          value={asMoveSort(sort)}
          onChange={(e) => setSort(e.target.value)}
          className="rounded-full border border-line bg-raised px-3 py-2 text-sm"
        >
          <option value="name">Name</option>
          <option value="power">Base power</option>
          <option value="priority">Priority</option>
          <option value="type">Type</option>
          <option value="category">Category</option>
        </select>
      </div>

      <div className="mt-4 flex flex-wrap gap-1.5">
        {MOVE_TAG_IDS.map((id) => {
          const on = tag === id;
          return (
            <button
              key={id}
              type="button"
              aria-pressed={on}
              onClick={() => setTag(on ? "" : id)}
              className={`rounded-full border px-2.5 py-1 text-[11px] font-medium transition ${
                on ? "border-ink bg-ink text-bg" : "border-line/80 bg-canvas/40 text-muted hover:text-ink"
              }`}
            >
              {MOVE_TAG_LABEL[id]}
            </button>
          );
        })}
      </div>

      <ul className="mt-8 divide-y divide-line/50 overflow-hidden rounded-[28px] border border-line/70 bg-raised/25">
        {rows.map((m) => (
          <li key={m.name}>
            <MoveRow move={m} />
          </li>
        ))}
        {!rows.length ? (
          <li className="px-5 py-10 text-center text-sm text-muted">No moves match those filters.</li>
        ) : null}
      </ul>
    </>
  );
}

function AbilitiesPanel({ q, family }: { q: string; family: RoleFamilyId | "" }) {
  const all = useMemo(() => listChampionsAbilities(), []);
  const [tag, setTag] = useQueryState("atag", parseAsString.withDefault(""));
  const [sort, setSort] = useQueryState("asort", parseAsString.withDefault("name"));

  const rows = useMemo(() => {
    const found = filterChampionsAbilities(all, {
      q,
      tag: (tag || "") as AbilityTagId | "",
      family,
    });
    return sortChampionsAbilities(found, asAbilitySort(sort));
  }, [all, q, tag, family, sort]);

  return (
    <>
      <p className="mt-2 text-muted">
        {rows.length} of {all.length} abilities on the legal roster
        {tag ? ` · ${ABILITY_TAG_LABEL[tag as AbilityTagId]}` : ""}.
      </p>

      <div className="mt-4 flex flex-wrap items-center gap-2">
        <div className="flex flex-wrap gap-1.5">
          <button
            type="button"
            aria-pressed={!tag}
            onClick={() => setTag("")}
            className={`rounded-full border px-2.5 py-1 text-[11px] font-medium transition ${
              !tag ? "border-ink bg-ink text-bg" : "border-line/80 bg-canvas/40 text-muted hover:text-ink"
            }`}
          >
            All tags
          </button>
          {ABILITY_TAG_IDS.map((id) => {
            const on = tag === id;
            return (
              <button
                key={id}
                type="button"
                aria-pressed={on}
                onClick={() => setTag(on ? "" : id)}
                className={`rounded-full border px-2.5 py-1 text-[11px] font-medium transition ${
                  on ? "border-ink bg-ink text-bg" : "border-line/80 bg-canvas/40 text-muted hover:text-ink"
                }`}
              >
                {ABILITY_TAG_LABEL[id]}
              </button>
            );
          })}
        </div>

        <select
          value={asAbilitySort(sort)}
          onChange={(e) => setSort(e.target.value)}
          className="rounded-full border border-line bg-raised px-3 py-2 text-sm"
        >
          <option value="name">Name</option>
          <option value="carriers">Most carriers</option>
        </select>
      </div>

      <ul className="mt-8 divide-y divide-line/50 overflow-hidden rounded-[28px] border border-line/70 bg-raised/25">
        {rows.map((a) => (
          <li key={a.slug}>
            <AbilityRow ability={a} />
          </li>
        ))}
        {!rows.length ? (
          <li className="px-5 py-10 text-center text-sm text-muted">
            No abilities match those filters.
          </li>
        ) : null}
      </ul>
    </>
  );
}

function MoveRow({ move }: { move: IndexedMove }) {
  const pri =
    move.priority !== 0
      ? move.priority > 0
        ? `Pri +${move.priority}`
        : `Pri ${move.priority}`
      : null;

  return (
    <div className="flex flex-col gap-3 px-4 py-3.5 md:px-5">
      <div className="flex flex-wrap items-center gap-2">
        <MoveChip as="span" name={move.name} type={move.type} size="md" meta={pri} />
        <span className="rounded-full border border-line/70 px-2 py-0.5 text-[10px] font-medium text-muted">
          {categoryLabel(move.category)}
        </span>
      </div>

      <div className="grid gap-3 sm:grid-cols-[minmax(0,14rem)_1fr] sm:items-start">
        <MoveStatGrid category={move.category} power={move.basePower} />
        <div className="min-w-0">
          {move.shortEffect ? (
            <p className="text-sm leading-snug text-muted">{move.shortEffect}</p>
          ) : (
            <p className="text-sm text-muted/70">No effect text synced yet.</p>
          )}
          {move.tags.length ? (
            <ul className="mt-2 flex flex-wrap gap-1">
              {move.tags.map((t) => (
                <li
                  key={t}
                  className="rounded-full bg-sunken/60 px-2 py-0.5 font-mono text-[9px] uppercase tracking-[0.08em] text-muted"
                >
                  {MOVE_TAG_LABEL[t]}
                </li>
              ))}
            </ul>
          ) : null}
        </div>
      </div>
    </div>
  );
}

function AbilityRow({ ability }: { ability: IndexedAbility }) {
  const shown = ability.carriers.slice(0, 8);
  const extra = ability.carriers.length - shown.length;

  return (
    <div className="flex flex-col gap-3 px-4 py-3.5 md:px-5">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <div className="min-w-0">
          <p className="text-base font-semibold tracking-tight">{ability.name}</p>
          {ability.shortEffect ? (
            <p className="mt-1 text-sm leading-snug text-muted">{ability.shortEffect}</p>
          ) : (
            <p className="mt-1 text-sm text-muted/70">No effect text synced yet.</p>
          )}
          {ability.tags.length ? (
            <ul className="mt-2 flex flex-wrap gap-1">
              {ability.tags.map((t) => (
                <li
                  key={t}
                  className="rounded-full bg-canvas/60 px-2 py-0.5 font-mono text-[9px] uppercase tracking-[0.08em] text-muted"
                >
                  {ABILITY_TAG_LABEL[t]}
                </li>
              ))}
            </ul>
          ) : null}
        </div>
        <p className="shrink-0 font-mono text-xs text-muted">
          {ability.carriers.length} carrier{ability.carriers.length === 1 ? "" : "s"}
        </p>
      </div>

      {shown.length ? (
        <ul className="flex flex-wrap gap-1.5">
          {shown.map((c) => (
            <li key={c.slug}>
              <Link
                href={`/pokemon/${c.slug}`}
                className="inline-flex items-center gap-1.5 rounded-full border border-line/60 bg-raised/40 py-0.5 pr-2.5 pl-0.5 text-xs transition hover:border-ink/35"
                title={c.name}
              >
                <PokemonArt slug={c.slug} src={c.sprite || c.artwork} name={c.name} size={22} />
                <span className="max-w-[9rem] truncate">{c.name}</span>
              </Link>
            </li>
          ))}
          {extra > 0 ? (
            <li className="inline-flex items-center rounded-full px-2 py-1 font-mono text-[10px] text-muted">
              +{extra} more
            </li>
          ) : null}
        </ul>
      ) : null}
    </div>
  );
}
