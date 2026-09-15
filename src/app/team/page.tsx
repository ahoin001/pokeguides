"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { getPokemon } from "@/lib/catalog/load";
import { cssVars } from "@/lib/champions/palette";
import { useTeamStore } from "@/stores/team";
import { PokemonArt } from "@/components/pokemon/PokemonArt";
import { TypeBadge } from "@/components/pokemon/TypeBadge";
import { CoverageFlower } from "@/components/viz/CoverageFlower";
import { SpeedTape } from "@/components/viz/SpeedTape";
import { PokemonPicker } from "@/components/pokemon/PokemonPicker";
import { TeamChecklist } from "@/components/team/TeamChecklist";
import { ManualNotes } from "@/components/manuals/ManualNotes";
import { TEAM_NOTES_ID } from "@/lib/manuals/field-notes";
import { VsScout } from "@/components/scout/VsScout";
import type { ArchetypeId, CatalogEntry } from "@/types/pokemon";
import { LEARN_ROLE_IDS, ROLE_LABEL, roleHref } from "@/content/roles";
import { ARCHETYPES, ARCHETYPE_LABEL, archetypeHref } from "@/content/archetypes";
import { readTeam, slotJob } from "@/lib/champions/team-readout";
import { suggestForTeam } from "@/lib/champions/suggest";
import { teamChecklist } from "@/lib/champions/team-checklist";
import type { ScoutSide } from "@/lib/champions/vs";

export default function TeamPage() {
  const slugs = useTeamStore((s) => s.slugs);
  const intent = useTeamStore((s) => s.intent);
  const setSlot = useTeamStore((s) => s.setSlot);
  const setIntent = useTeamStore((s) => s.setIntent);
  const [pick, setPick] = useState<number | null>(null);
  const mons = slugs.map((s) => (s ? getPokemon(s) : null));
  const filled = mons.filter(Boolean) as CatalogEntry[];
  const megas = filled.filter((m) => m.form === "mega" || m.form === "mega-z").length;
  const readout = useMemo(() => readTeam(filled, intent), [filled, intent]);
  const activeIntent = intent ?? readout.archetypeId;
  const checks = useMemo(
    () => teamChecklist(filled, intent, readout.archetypeId),
    [filled, intent, readout.archetypeId],
  );

  const roles = useMemo(() => {
    const have = new Set(readout.jobs);
    return LEARN_ROLE_IDS.map((id) => ({
      id,
      on: id === "mega" ? megas > 0 || have.has("mega") : have.has(id),
    }));
  }, [readout.jobs, megas]);

  const considering = useMemo(
    () => mons.filter((p, i) => p && i !== pick) as CatalogEntry[],
    [mons, pick],
  );
  const suggested = useMemo(
    () => suggestForTeam(considering, activeIntent, slugs.filter(Boolean) as string[]),
    [considering, activeIntent, slugs],
  );
  const scoutSide: ScoutSide[] = useMemo(
    () => filled.map((p) => ({ slug: p.slug, types: p.types })),
    [filled],
  );

  return (
    <div>
      <h1 className="text-4xl font-semibold tracking-tight">Team</h1>
      <p className="mt-2 text-muted">
        Three slots. Species clause. One Mega in battle. They see the list.{" "}
        <Link href="/manuals" className="underline">
          Read a field manual
        </Link>
        .
      </p>
      {megas > 1 ? <p className="mt-3 text-sm text-amber-200">Two Megas on the three. Only one can go off.</p> : null}

      <div className="mt-6">
        <p className="text-xs font-medium uppercase tracking-wide text-muted">Building as</p>
        <div className="mt-2 flex flex-wrap gap-2">
          {ARCHETYPES.map((style) => {
            const on = intent === style.id;
            return (
              <button
                key={style.id}
                type="button"
                onClick={() => setIntent(on ? null : (style.id as ArchetypeId))}
                className={`rounded-full px-3 py-1 text-sm ${on ? "bg-ink text-bg" : "bg-white/5 text-muted"}`}
              >
                {style.name}
              </button>
            );
          })}
        </div>
      </div>

      <div className="mt-8 grid gap-3 md:grid-cols-3">
        {mons.map((p, i) => (
          <button
            key={i}
            type="button"
            onClick={() => setPick(i)}
            className="min-h-36 rounded-3xl border border-line p-4 text-left"
            style={p ? cssVars(p.palette) : undefined}
          >
            {p ? (
              <>
                <PokemonArt slug={p.slug} src={p.artwork} name={p.name} share size={96} />
                <p className="mt-2 font-semibold">{p.name}</p>
                <div className="mt-1 flex gap-1">
                  {p.types.map((t) => (
                    <TypeBadge key={t} type={t} size="sm" />
                  ))}
                </div>
                <p className="mt-2 text-xs text-muted">{ROLE_LABEL[slotJob(p, activeIntent)]}</p>
              </>
            ) : (
              <span className="text-muted">Slot {i + 1}</span>
            )}
          </button>
        ))}
      </div>
      <div className="mt-4 flex flex-wrap gap-2 text-sm">
        {roles.map((r) => (
          <Link
            key={r.id}
            href={roleHref(r.id)}
            className={`rounded-full px-3 py-1 ${r.on ? "bg-ink text-bg" : "bg-white/5 text-muted"}`}
          >
            {ROLE_LABEL[r.id]}
          </Link>
        ))}
      </div>
      <div className="mt-6 max-w-2xl rounded-3xl border border-line bg-raised/40 p-4">
        <p className="font-medium">{readout.headline}</p>
        <p className="mt-1 text-sm text-muted">{readout.detail}</p>
        {readout.archetypeId ? (
          <Link href={archetypeHref(readout.archetypeId)} className="mt-3 inline-block text-sm underline">
            Read {ARCHETYPE_LABEL[readout.archetypeId]}
          </Link>
        ) : (
          <Link href="/learn/archetypes" className="mt-3 inline-block text-sm underline">
            Find a style that fits
          </Link>
        )}
      </div>
      {scoutSide.length ? (
        <VsScout
          side={scoutSide}
          lede="Search who they have. STABs only here — open a field manual for kit clicks."
        />
      ) : null}
      <div className="mt-12">
        <TeamChecklist items={checks} />
      </div>
      {filled.length ? (
        <div className="mt-12 space-y-10">
          <CoverageFlower teamTypes={filled.map((m) => m.types)} />
          <SpeedTape mons={filled} />
        </div>
      ) : null}
      <ManualNotes id={TEAM_NOTES_ID} exclude={slugs.filter((s): s is string => Boolean(s))} />
      {pick !== null ? (
        <div className="fixed inset-0 z-50 flex items-end bg-black/50 p-4 md:items-center md:justify-center">
          <div className="w-full max-w-lg rounded-t-3xl bg-raised p-5 md:rounded-3xl">
            <div className="mb-3 flex justify-between text-sm">
              <button type="button" onClick={() => setPick(null)} className="text-muted">
                Close
              </button>
              {slugs[pick] ? (
                <button
                  type="button"
                  onClick={() => {
                    setSlot(pick, null);
                    setPick(null);
                  }}
                >
                  Clear slot
                </button>
              ) : null}
            </div>
            <PokemonPicker
              exclude={slugs.filter(Boolean) as string[]}
              suggested={suggested}
              onPick={(slug) => {
                setSlot(pick, slug);
                setPick(null);
              }}
            />
          </div>
        </div>
      ) : null}
    </div>
  );
}
