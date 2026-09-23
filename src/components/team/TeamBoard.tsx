"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { LayoutGroup, MotionConfig } from "motion/react";
import { PageFrame } from "@/components/chrome/PageFrame";
import { getPokemon } from "@/lib/catalog/lookup";
import { useTeamStore } from "@/stores/team";
import { PokemonPicker } from "@/components/pokemon/PokemonPicker";
import { Modal } from "@/components/ui/Modal";
import { ManualNotes } from "@/components/manuals/ManualNotes";
import { TEAM_NOTES_ID } from "@/lib/manuals/field-notes";
import { VsScout } from "@/components/scout/VsScout";
import { manualHref } from "@/content/manuals";
import { resolveManualById, useManualsStore } from "@/stores/manuals";
import { rankedFoesFor } from "@/lib/ranked/foes";
import { LEARN_ROLE_IDS } from "@/content/roles";
import { readTeam } from "@/lib/champions/team-readout";
import { suggestForTeam } from "@/lib/champions/suggest";
import { teamChecklist } from "@/lib/champions/team-checklist";
import { teamThreats } from "@/lib/champions/team-threats";
import type { ScoutSide } from "@/lib/champions/vs";
import { BuilderBench } from "@/components/team/BuilderBench";
import {
  BuilderAnalysis,
  type AnalysisTab,
  type CoverageMode,
} from "@/components/team/BuilderAnalysis";
import { FocusRail } from "@/components/team/FocusRail";
import { CoachDrawer } from "@/components/team/CoachDrawer";
import { RegisteredSix } from "@/components/team/RegisteredSix";
import { NextPicks } from "@/components/team/NextPicks";
import { TeamPresetsBar } from "@/components/team/TeamPresetsBar";
import { TeamDamageCalc } from "@/components/team/TeamDamageCalc";
import type { CatalogEntry, TypeId } from "@/types/pokemon";

export function TeamBoard() {
  const slugs = useTeamStore((s) => s.slugs);
  const box = useTeamStore((s) => s.box);
  const intent = useTeamStore((s) => s.intent);
  const manualId = useTeamStore((s) => s.manualId);
  const slotMoves = useTeamStore((s) => s.slotMoves);
  const setSlot = useTeamStore((s) => s.setSlot);
  const setIntent = useTeamStore((s) => s.setIntent);
  const setSlotMoves = useTeamStore((s) => s.setSlotMoves);
  const loadThree = useTeamStore((s) => s.loadThree);
  const localManuals = useManualsStore((s) => s.local);

  const [pick, setPick] = useState<number | null>(null);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(0);
  const [tab, setTab] = useState<AnalysisTab>("weaknesses");
  const [coverageMode, setCoverageMode] = useState<CoverageMode>("stab");
  const [calcOpen, setCalcOpen] = useState(false);
  const [weakType, setWeakType] = useState<TypeId | null>(null);
  const [coachOpen, setCoachOpen] = useState(false);
  const [scoutRequest, setScoutRequest] = useState<{
    slug: string;
    key: number;
    openOnly?: boolean;
  } | null>(null);

  const playbook = useMemo(() => {
    if (!manualId) return undefined;
    return resolveManualById(manualId, localManuals);
  }, [manualId, localManuals]);

  const mons: (CatalogEntry | null)[] = slugs.map((s) => (s ? getPokemon(s) ?? null : null));
  const filled = mons.filter((p): p is CatalogEntry => Boolean(p));
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
  const boardSuggested = useMemo(
    () => suggestForTeam(filled, activeIntent, slugs.filter(Boolean) as string[]),
    [filled, activeIntent, slugs],
  );

  const threats = useMemo(() => teamThreats(filled), [filled]);

  const coverageMembers = useMemo(
    () =>
      filled.map((p) => {
        const kit = slotMoves[p.slug];
        const fromManual = playbook?.slots.find((s) => s.slug === p.slug)?.moves.map((m) => m.name);
        return {
          name: p.name,
          slug: p.slug,
          types: p.types,
          moves: kit?.length ? kit : fromManual,
        };
      }),
    [filled, slotMoves, playbook],
  );

  const scoutSide: ScoutSide[] = useMemo(
    () =>
      filled.map((p) => {
        const kit = slotMoves[p.slug];
        const slot = playbook?.slots.find((s) => s.slug === p.slug);
        return {
          slug: p.slug,
          types: p.types,
          moves: kit?.length ? kit : slot?.moves.map((m) => m.name),
        };
      }),
    [filled, playbook, slotMoves],
  );

  const focusMon =
    selectedIndex !== null && mons[selectedIndex] ? mons[selectedIndex] : filled[0] ?? null;

  const partySlugs = useMemo(() => {
    const six = box.filter(Boolean) as string[];
    if (six.length) return six;
    return slugs.filter(Boolean) as string[];
  }, [box, slugs]);

  function requestScout(slug: string) {
    setScoutRequest({ slug, key: Date.now() });
  }

  function openScoutDock() {
    setScoutRequest({ slug: "", key: Date.now(), openOnly: true });
  }

  function selectSlot(index: number) {
    setSelectedIndex(index);
  }

  function selectBySlug(slug: string) {
    const idx = slugs.indexOf(slug);
    if (idx >= 0) setSelectedIndex(idx);
  }

  return (
    <MotionConfig reducedMotion="user">
      <LayoutGroup>
        <PageFrame variant="board" sticky="shell">
          <div className="pb-8">
            <header className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <h1 className="text-4xl font-semibold tracking-tight">Team</h1>
                {playbook ? (
                  <p className="mt-2 max-w-[52ch] text-muted">
                    Playing {playbook.title}. The three is the board — the manual is still the coach.{" "}
                    <Link href={manualHref(playbook.id)} className="underline">
                      Open the manual
                    </Link>
                    .
                  </p>
                ) : (
                  <p className="mt-2 max-w-[52ch] text-muted">
                    Three you bring. Edit moves on the focus rail for move coverage. Presets sync with
                    Live Match.{" "}
                    <Link href="/manuals" className="underline">
                      Read a field manual
                    </Link>
                    .
                  </p>
                )}
              </div>
              <div className="flex flex-wrap gap-2">
                <Link
                  href="/live"
                  className="rounded-full bg-ink px-4 py-2 text-sm font-medium text-bg transition hover:opacity-90"
                >
                  Open Live Match
                </Link>
                <Link
                  href="/team/box"
                  className="rounded-full border border-line px-4 py-2 text-sm transition hover:border-ink/40"
                >
                  My box
                </Link>
                <Link
                  href="/team/archetypes"
                  className="rounded-full border border-line px-4 py-2 text-sm transition hover:border-ink/40"
                >
                  Archetypes
                </Link>
              </div>
            </header>

            <div className="mt-5">
              <TeamPresetsBar
                party={partySlugs}
                moves={slotMoves}
                hint="Saved here and on Live Match — same list."
                onApply={(preset) => {
                  const bring = preset.slugs.slice(0, 3);
                  loadThree(
                    bring,
                    undefined,
                    null,
                    preset.slugs.length >= 4 ? preset.slugs : undefined,
                    preset.moves,
                  );
                  setSelectedIndex(0);
                  if (Object.keys(preset.moves).length) setCoverageMode("moves");
                }}
              />
            </div>

            {megas > 1 ? (
              <p className="mt-4 text-sm text-amber-200">Two Megas on the three. Only one can go off.</p>
            ) : null}

            <RegisteredSix
              box={box}
              bring={slugs}
              onBring={(slug) => {
                if (slugs.includes(slug)) {
                  selectBySlug(slug);
                  return;
                }
                const empty = slugs.findIndex((s) => !s);
                const target = empty >= 0 ? empty : (selectedIndex ?? 0);
                setSlot(target, slug);
                setSelectedIndex(target);
              }}
            />

            <div className="mt-6">
              <CoachDrawer
                open={coachOpen}
                onToggle={() => setCoachOpen((v) => !v)}
                intent={intent}
                onIntent={setIntent}
                roles={roles}
                readout={readout}
                checks={checks}
              />
            </div>

            <NextPicks
              suggestions={boardSuggested}
              filledCount={filled.length}
              onPick={(slug) => {
                const empty = slugs.findIndex((s) => !s);
                const target = empty >= 0 ? empty : (selectedIndex ?? 0);
                if (slugs[target] === slug) {
                  selectBySlug(slug);
                  return;
                }
                if (slugs.includes(slug)) {
                  selectBySlug(slug);
                  return;
                }
                setSlot(target, slug);
                setSelectedIndex(target);
              }}
            />

            <div className="mt-8 grid gap-6 lg:gap-8 xl:grid-cols-[minmax(15rem,18rem)_minmax(0,1fr)_minmax(16rem,19rem)]">
              <div className="order-1">
                <BuilderBench
                  mons={mons}
                  selectedIndex={selectedIndex}
                  intent={activeIntent}
                  onSelect={selectSlot}
                  onPickSlot={(i) => {
                    setSelectedIndex(i);
                    setPick(i);
                  }}
                  onClear={(i) => {
                    setSlot(i, null);
                    if (selectedIndex === i) setSelectedIndex(i);
                  }}
                />
              </div>

              <div className="order-3 xl:order-2">
                <BuilderAnalysis
                  tab={tab}
                  onTab={(next) => {
                    setTab(next);
                    setWeakType(null);
                  }}
                  team={filled}
                  threats={threats}
                  selectedType={weakType}
                  onSelectType={setWeakType}
                  selectedSlug={focusMon?.slug ?? null}
                  onSelectSlug={selectBySlug}
                  onScout={requestScout}
                  coverageMode={coverageMode}
                  onCoverageMode={setCoverageMode}
                  coverageMembers={coverageMembers}
                />
              </div>

              <div className="order-2 xl:order-3">
                <FocusRail
                  mon={focusMon}
                  intent={activeIntent}
                  moves={focusMon ? slotMoves[focusMon.slug] ?? [] : []}
                  onMovesChange={
                    focusMon
                      ? (moves) => {
                          setSlotMoves(focusMon.slug, moves);
                          if (moves.length) setCoverageMode("moves");
                        }
                      : undefined
                  }
                  onOpenScout={openScoutDock}
                  onChangeSlot={() => {
                    const idx = selectedIndex !== null ? selectedIndex : mons.findIndex((m) => !m);
                    const target = idx >= 0 ? idx : 0;
                    setSelectedIndex(target);
                    setPick(target);
                  }}
                  onSuggestPick={(slug) => {
                    if (slugs.includes(slug)) {
                      selectBySlug(slug);
                      return;
                    }
                    const empty = slugs.findIndex((s) => !s);
                    if (empty < 0) return;
                    setSlot(empty, slug);
                    setSelectedIndex(empty);
                  }}
                />
              </div>
            </div>

            {filled.length >= 2 ? (
              <div className="mt-8">
                <button
                  type="button"
                  onClick={() => setCalcOpen((v) => !v)}
                  className="rounded-full border border-line px-4 py-2 text-sm text-muted transition hover:border-ink/40 hover:text-ink"
                >
                  {calcOpen ? "Hide damage check" : "Show damage check"}
                </button>
                {calcOpen ? (
                  <div className="mt-4">
                    <TeamDamageCalc team={filled} slotMoves={slotMoves} />
                  </div>
                ) : null}
              </div>
            ) : null}

            {scoutSide.length ? (
              <div className="mt-10">
                <VsScout
                  side={scoutSide}
                  ourMons={filled}
                  defaultDocked
                  scoutRequest={scoutRequest}
                  heading="Vs scout"
                  lede={
                    Object.keys(slotMoves).length
                      ? "Tap a Threat to pin matchups. Kit clicks use your edited moves."
                      : playbook
                        ? "Tap a Threat to pin matchups here. Kit clicks come from the manual until you edit moves."
                        : "Tap a Threat to pin matchups here. Add moves on the focus rail for kit-aware scout."
                  }
                  suggestedFoes={rankedFoesFor(filled.map((p) => p.slug))}
                />
              </div>
            ) : null}

            <div className="mt-12">
              <ManualNotes id={TEAM_NOTES_ID} exclude={slugs.filter((s): s is string => Boolean(s))} />
            </div>
          </div>
        </PageFrame>

        <Modal open={pick !== null} onClose={() => setPick(null)} label="Add Pokémon">
          <div className="mb-3 flex justify-between text-sm">
            <button type="button" onClick={() => setPick(null)} className="text-muted">
              Close
            </button>
            {pick !== null && slugs[pick] ? (
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
          {pick !== null ? (
            <PokemonPicker
              exclude={slugs.filter(Boolean) as string[]}
              suggested={suggested}
              onPick={(slug) => {
                setSlot(pick, slug);
                setSelectedIndex(pick);
                setPick(null);
              }}
            />
          ) : null}
        </Modal>
      </LayoutGroup>
    </MotionConfig>
  );
}
