"use client";

import { useMemo, type ButtonHTMLAttributes } from "react";
import Link from "next/link";
import { parseAsString, parseAsStringLiteral, useQueryState } from "nuqs";
import { PageFrame } from "@/components/chrome/PageFrame";
import { FormatSwitch } from "@/components/chrome/FormatSwitch";
import {
  CANONICAL_MANUALS,
  MANUAL_FAMILY_BLURB,
  MANUAL_FAMILY_IDS,
  MANUAL_FAMILY_LABEL,
  manualFamily,
  manualFormat,
  manualsForFormat,
  type ManualFamilyId,
} from "@/content/manuals";
import { ARCHETYPE_LABEL } from "@/content/archetypes";
import { ARCHETYPE_IDS, type ArchetypeId } from "@/types/pokemon";
import { useManualsStore, pureLocalManuals, withDeviceOverrides } from "@/stores/manuals";
import { ManualCard } from "@/components/manuals/ManualCard";
import {
  filterManuals,
  MANUAL_SORTS,
  sortManuals,
  type ManualSort,
} from "@/lib/champions/manual-search";
import {
  FORMAT_BLURB,
  formatBringLabel,
  type BattleFormat,
} from "@/lib/format";

const FORMAT_VALUES = ["singles", "doubles"] as const;

function Chip({
  on,
  children,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { on: boolean }) {
  return (
    <button
      type="button"
      aria-pressed={on}
      className={`rounded-full border px-3 py-1.5 text-sm transition ${
        on ? "border-ink bg-ink text-bg" : "border-line bg-raised text-muted hover:border-ink/40"
      }`}
      {...props}
    >
      {children}
    </button>
  );
}

function ManualGrid({
  manuals,
  sourced,
}: {
  manuals: ReturnType<typeof sortManuals>;
  sourced: "canonical" | "local";
}) {
  if (!manuals.length) return null;
  return (
    <ul className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {manuals.map((manual) => (
        <li key={manual.id} className="min-w-0">
          <ManualCard manual={manual} sourced={sourced} />
        </li>
      ))}
    </ul>
  );
}

export default function ManualsIndex() {
  const local = useManualsStore((s) => s.local);
  const [q, setQ] = useQueryState("q", parseAsString.withDefault(""));
  const [family, setFamily] = useQueryState("family", parseAsString.withDefault(""));
  const [archetype, setArchetype] = useQueryState("archetype", parseAsString.withDefault(""));
  const [sort, setSort] = useQueryState(
    "sort",
    parseAsStringLiteral(MANUAL_SORTS).withDefault("shelf"),
  );
  const [formatParam] = useQueryState(
    "format",
    parseAsStringLiteral(FORMAT_VALUES).withDefault("singles"),
  );
  const format = formatParam as BattleFormat;
  const doubles = format === "doubles";

  const familyFilter = (MANUAL_FAMILY_IDS as readonly string[]).includes(family)
    ? (family as ManualFamilyId)
    : "";
  const archetypeFilter = (ARCHETYPE_IDS as readonly string[]).includes(archetype)
    ? (archetype as ArchetypeId)
    : "";
  const sortKey = sort as ManualSort;
  const filtering = Boolean(q.trim() || familyFilter || archetypeFilter);

  const shelfCanonical = useMemo(
    () => manualsForFormat(format, withDeviceOverrides(CANONICAL_MANUALS, local)),
    [format, local],
  );
  const shelfLocal = useMemo(
    () => manualsForFormat(format, pureLocalManuals(local)),
    [format, local],
  );

  const classroom = useMemo(() => {
    const found = filterManuals(shelfCanonical, {
      q,
      family: familyFilter,
      archetype: archetypeFilter,
    });
    return sortManuals(found, sortKey);
  }, [shelfCanonical, q, familyFilter, archetypeFilter, sortKey]);

  const yours = useMemo(() => {
    const found = filterManuals(shelfLocal, {
      q,
      family: familyFilter,
      archetype: archetypeFilter,
    });
    return sortManuals(found, sortKey);
  }, [shelfLocal, q, familyFilter, archetypeFilter, sortKey]);

  const grouped = useMemo(() => {
    if (sortKey !== "shelf") return null;
    return MANUAL_FAMILY_IDS.map((id) => ({
      id,
      manuals: classroom.filter((manual) => manualFamily(manual) === id),
    })).filter((group) => group.manuals.length);
  }, [classroom, sortKey]);

  function clearFilters() {
    void setQ("");
    void setFamily("");
    void setArchetype("");
  }

  return (
    <PageFrame variant="board">
      <header className="flex flex-wrap items-start justify-between gap-6">
        <div className="max-w-3xl">
          <p
            className={`font-mono text-[10px] font-semibold uppercase tracking-[0.14em] ${
              doubles ? "text-[var(--format-doubles-accent)]" : "text-muted"
            }`}
          >
            {doubles ? "Doubles shelf" : "Singles shelf"}
          </p>
          <h1 className="mt-2 text-4xl font-semibold tracking-tight lg:text-5xl">Field manuals</h1>
          <p className="mt-4 text-lg text-muted">
            {doubles
              ? "6-to-4 field manuals for Champions doubles — engines, speed planes, preview trees, and complete kits."
              : "Boxed sixes for Champions singles — register six, preview, bring three. Load a bring onto Team when you want to try it."}
          </p>
          <div className="mt-6">
            <Link
              href="/manuals/new"
              className="inline-flex min-h-11 items-center justify-center rounded-full bg-ink px-4 py-2 text-sm font-medium text-bg transition hover:bg-white"
            >
              Write your own
            </Link>
          </div>
        </div>
        <FormatSwitch
          active={format}
          surface="manuals"
          hint={`${FORMAT_BLURB[format]} · ${formatBringLabel(format)}`}
          className="shrink-0"
        />
      </header>

      {doubles ? (
        <div className="mt-8 rounded-[28px] border border-[color-mix(in_srgb,var(--format-doubles-accent)_45%,var(--line))] bg-[var(--format-doubles-wash)] px-5 py-4 text-sm text-muted">
          Doubles field manuals are 6-to-4. Team / Live still assume a Singles bring — study here, load sets by hand.
        </div>
      ) : null}

      <div className="mt-10 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <label className="block w-full lg:max-w-md">
          <span className="sr-only">Filter manuals by Pokémon</span>
          <input
            value={q}
            onChange={(e) => void setQ(e.target.value)}
            placeholder="Filter by Pokémon — Mimikyu, Garchomp…"
            className="w-full rounded-2xl border border-line bg-sunken px-4 py-3"
          />
        </label>
        <select
          value={sortKey}
          onChange={(e) => void setSort(e.target.value as ManualSort)}
          className="w-full rounded-full border border-line bg-raised px-3 py-2 text-sm lg:w-auto"
          aria-label="Sort manuals"
        >
          <option value="shelf">Shelf</option>
          <option value="title">Title A–Z</option>
          <option value="archetype">Archetype</option>
        </select>
      </div>

      <div className="mt-5 flex flex-wrap items-center gap-2">
        {MANUAL_FAMILY_IDS.map((id) => (
          <Chip
            key={id}
            on={familyFilter === id}
            onClick={() => void setFamily(familyFilter === id ? "" : id)}
          >
            {MANUAL_FAMILY_LABEL[id]}
          </Chip>
        ))}
        <span className="mx-1 hidden h-4 w-px bg-line sm:block" aria-hidden />
        {ARCHETYPE_IDS.filter(
          (id) =>
            shelfCanonical.some((m) => m.archetype === id) ||
            shelfLocal.some((m) => m.archetype === id),
        ).map((id) => (
          <Chip
            key={id}
            on={archetypeFilter === id}
            onClick={() => void setArchetype(archetypeFilter === id ? "" : id)}
          >
            {ARCHETYPE_LABEL[id]}
          </Chip>
        ))}
        {filtering ? (
          <button
            type="button"
            onClick={clearFilters}
            className="rounded-full px-3 py-1.5 text-sm text-muted underline-offset-4 hover:underline"
          >
            Clear
          </button>
        ) : null}
      </div>

      <section className="mt-12" data-format={format}>
        <div className="flex items-end justify-between gap-4">
          <h2 className="text-2xl font-semibold tracking-tight">
            {doubles ? "Doubles classroom" : "Classroom"}
          </h2>
          <p className="text-sm text-muted">
            {classroom.length} of {shelfCanonical.length}
          </p>
        </div>

        {classroom.length === 0 ? (
          <p className="mt-5 max-w-xl text-sm text-muted">
            {doubles
              ? filtering
                ? "No Doubles manual matches that filter. Clear it, or write your own with format Doubles."
                : "No Doubles classroom pack matches that Pokémon. Clear the filter."
              : "No classroom three matches that Pokémon or shelf. Clear the filter, or write your own."}
          </p>
        ) : grouped ? (
          <div className="mt-8 space-y-12">
            {grouped.map((group) => (
              <section key={group.id}>
                <h3 className="text-lg font-semibold tracking-tight">
                  {MANUAL_FAMILY_LABEL[group.id]}
                </h3>
                <p className="mt-1 max-w-2xl text-sm text-muted">{MANUAL_FAMILY_BLURB[group.id]}</p>
                <ManualGrid manuals={group.manuals} sourced="canonical" />
              </section>
            ))}
          </div>
        ) : (
          <ManualGrid manuals={classroom} sourced="canonical" />
        )}
      </section>

      {local.length ? (
        <section className="mt-16">
          <div className="flex items-end justify-between gap-4">
            <h2 className="text-2xl font-semibold tracking-tight">Yours</h2>
            <p className="text-sm text-muted">
              {yours.length} of {shelfLocal.length}
              {shelfLocal.length !== local.length
                ? ` · ${local.length - shelfLocal.length} on the other shelf`
                : ""}
            </p>
          </div>
          {yours.length ? (
            <ManualGrid manuals={yours} sourced="local" />
          ) : (
            <p className="mt-5 max-w-xl text-sm text-muted">
              None of yours on the {format} shelf match that filter.
            </p>
          )}
        </section>
      ) : (
        <p className="mt-12 max-w-3xl text-sm text-muted">
          Your own manuals live on this device. They are not the classroom files — those get added in the repo when you
          ask.
        </p>
      )}
    </PageFrame>
  );
}
