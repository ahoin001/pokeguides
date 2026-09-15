"use client";

import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, LayoutGroup, MotionConfig, motion } from "motion/react";
import { VsScoutDock, type DockCorner } from "@/components/scout/VsScoutDock";
import { catalog, getPokemon } from "@/lib/catalog/load";
import { searchCatalog } from "@/lib/catalog/search";
import { cssVars } from "@/lib/champions/palette";
import { speBand } from "@/lib/champions/vs-stats";
import { scoutField, type ScoutFoe, type ScoutSide, type ScoutTeamResult } from "@/lib/champions/vs";
import { easeOut, motionTokens } from "@/components/motion/tokens";
import { PokemonArt } from "@/components/pokemon/PokemonArt";
import { TypeBadge } from "@/components/pokemon/TypeBadge";
import { MANUAL_SCROLL_MT } from "@/components/manuals/ManualToc";
import { MAX_FOES, VsOpponentTray } from "@/components/scout/VsOpponentTray";
import { VsStatStrip } from "@/components/scout/VsStatStrip";
import { VsSpeRace } from "@/components/scout/VsSpeRace";
import { VsMatchMatrix } from "@/components/scout/VsMatchMatrix";
import { VsSlotCard } from "@/components/scout/VsSlotCard";
import { SafeSwitchCallout } from "@/components/scout/SafeSwitchCallout";
import type { CatalogEntry } from "@/types/pokemon";

const RECENT_KEY = "ringside-vs-scout-recent";
const FOES_KEY = "ringside-vs-scout-foes";
const DOCK_KEY = "ringside-vs-scout-dock";
const CORNER_KEY = "ringside-vs-scout-dock-corner";
const RECENT_MAX = 5;

function readSlugs(key: string): string[] {
  try {
    const raw = sessionStorage.getItem(key);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as unknown;
    return Array.isArray(parsed) ? parsed.filter((s): s is string => typeof s === "string") : [];
  } catch {
    return [];
  }
}

function writeSlugs(key: string, slugs: string[], max: number) {
  try {
    sessionStorage.setItem(key, JSON.stringify(slugs.slice(0, max)));
  } catch {
    /* ignore quota */
  }
}

function readDock(): boolean {
  try {
    return sessionStorage.getItem(DOCK_KEY) === "1";
  } catch {
    return false;
  }
}

function readCorner(): DockCorner {
  try {
    return sessionStorage.getItem(CORNER_KEY) === "tr" ? "tr" : "br";
  } catch {
    return "br";
  }
}

export function VsScout({
  side,
  id = "scout",
  heading = "Vs scout",
  lede = "Search who they have. We show how your three hit them and how they hit you.",
}: {
  side: ScoutSide[];
  id?: string;
  heading?: string;
  lede?: string;
}) {
  const exclude = useMemo(() => side.map((s) => s.slug), [side]);
  const excludeKey = exclude.join("|");
  const hasMoves = side.some((s) => (s.moves?.length ?? 0) > 0);
  const ourMons = useMemo(
    () => side.map((s) => getPokemon(s.slug)).filter((p): p is NonNullable<typeof p> => Boolean(p)),
    [side],
  );
  const ourSpe = useMemo(() => ourMons.map((m) => speBand(m)), [ourMons]);

  const [q, setQ] = useState("");
  const [opponentSlugs, setOpponentSlugs] = useState<string[]>([]);
  const [focusSlug, setFocusSlug] = useState<string | null>(null);
  const [recent, setRecent] = useState<string[]>([]);
  const [pickerOpen, setPickerOpen] = useState(false);
  const [hydrated, setHydrated] = useState(false);
  const [docked, setDocked] = useState(false);
  const [dockOpen, setDockOpen] = useState(true);
  const [corner, setCorner] = useState<DockCorner>("br");

  useEffect(() => {
    const foes = readSlugs(FOES_KEY).filter((s) => !exclude.includes(s)).slice(0, MAX_FOES);
    const rec = readSlugs(RECENT_KEY).filter((s) => !exclude.includes(s));
    setOpponentSlugs(foes);
    setFocusSlug(foes[0] ?? null);
    setRecent(rec);
    setDocked(readDock());
    setCorner(readCorner());
    setHydrated(true);
    // excludeKey is the stable membership signal; exclude array identity is not.
    // eslint-disable-next-line react-hooks/exhaustive-deps -- excludeKey tracks slug membership
  }, [excludeKey]);

  useEffect(() => {
    if (!hydrated) return;
    writeSlugs(FOES_KEY, opponentSlugs, MAX_FOES);
  }, [opponentSlugs, hydrated]);

  useEffect(() => {
    if (!hydrated) return;
    try {
      sessionStorage.setItem(DOCK_KEY, docked ? "1" : "0");
    } catch {
      /* ignore */
    }
  }, [docked, hydrated]);

  useEffect(() => {
    if (!hydrated) return;
    try {
      sessionStorage.setItem(CORNER_KEY, corner);
    } catch {
      /* ignore */
    }
  }, [corner, hydrated]);

  useEffect(() => {
    if (!opponentSlugs.length) {
      setFocusSlug(null);
      return;
    }
    if (!focusSlug || !opponentSlugs.includes(focusSlug)) {
      setFocusSlug(opponentSlugs[0] ?? null);
    }
  }, [opponentSlugs, focusSlug]);

  const results = useMemo(() => {
    return searchCatalog(catalog, q)
      .filter((p) => !exclude.includes(p.slug))
      .slice(0, 10);
  }, [q, exclude]);

  const foes = useMemo(
    () =>
      opponentSlugs
        .map((s) => getPokemon(s))
        .filter((p): p is NonNullable<typeof p> => Boolean(p)),
    [opponentSlugs],
  );

  const scoutFoes: ScoutFoe[] = useMemo(
    () =>
      foes.map((f) => ({
        slug: f.slug,
        types: f.types,
        speedAt0: f.speedAt0,
        speedAt32: f.speedAt32,
      })),
    [foes],
  );

  const field = useMemo(() => {
    if (!scoutFoes.length) return null;
    return scoutField(side, scoutFoes, ourSpe);
  }, [side, scoutFoes, ourSpe]);

  const focusFoe = focusSlug ? getPokemon(focusSlug) : undefined;
  const focusIndex = focusSlug ? opponentSlugs.indexOf(focusSlug) : -1;
  const focusReport = field && focusIndex >= 0 ? field.byFoe[focusIndex] : null;

  const canAdd = opponentSlugs.length < MAX_FOES;
  const showDock = docked && hydrated;

  function pushRecent(slug: string) {
    setRecent((prev) => {
      const next = [slug, ...prev.filter((s) => s !== slug && !exclude.includes(s))].slice(0, RECENT_MAX);
      writeSlugs(RECENT_KEY, next, RECENT_MAX);
      return next;
    });
  }

  function addOpponent(slug: string) {
    if (exclude.includes(slug)) return;
    setOpponentSlugs((prev) => {
      if (prev.includes(slug)) {
        setFocusSlug(slug);
        return prev;
      }
      if (prev.length >= MAX_FOES) return prev;
      const next = [...prev, slug];
      setFocusSlug(slug);
      if (next.length >= MAX_FOES) setPickerOpen(false);
      return next;
    });
    pushRecent(slug);
    setQ("");
    setDockOpen(true);
  }

  function removeOpponent(slug: string) {
    setOpponentSlugs((prev) => prev.filter((s) => s !== slug));
  }

  function clearOpponents() {
    setOpponentSlugs([]);
    setFocusSlug(null);
    setPickerOpen(false);
  }

  function toggleDock() {
    setDocked((v) => !v);
    setDockOpen(true);
  }

  if (!side.length) return null;

  const chrome = (
    <>
      <VsOpponentTray
        foes={foes}
        focusSlug={focusSlug}
        onFocus={setFocusSlug}
        onRemove={removeOpponent}
        onClear={clearOpponents}
        onTogglePicker={() => setPickerOpen((v) => !v)}
        pickerOpen={pickerOpen}
        canAdd={canAdd}
        docked={docked}
        onToggleDock={toggleDock}
      />
      <AnimatePresence initial={false}>
        {recent.length && !pickerOpen ? (
          <motion.ul
            key="recent"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: motionTokens.state, ease: easeOut }}
            className="flex flex-wrap gap-2 overflow-hidden px-1"
          >
            {recent.map((slug) => {
              const p = getPokemon(slug);
              if (!p) return null;
              const selected = opponentSlugs.includes(slug);
              const blocked = !selected && !canAdd;
              return (
                <li key={slug}>
                  <button
                    type="button"
                    disabled={blocked}
                    onClick={() => (selected ? setFocusSlug(slug) : addOpponent(slug))}
                    className={`rounded-full px-3 py-1 text-sm disabled:opacity-40 ${
                      selected ? "bg-ink text-bg" : "bg-white/6 text-muted hover:bg-white/10"
                    }`}
                  >
                    {p.name}
                  </button>
                </li>
              );
            })}
          </motion.ul>
        ) : null}
      </AnimatePresence>
      <AnimatePresence initial={false}>
        {pickerOpen ? (
          <motion.div
            key="picker"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: motionTokens.state, ease: easeOut }}
            className="rounded-[24px] border border-line bg-bg/95 p-4 backdrop-blur-md"
          >
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder={canAdd ? "Search the legal roster" : "Three selected — remove one to add another"}
              disabled={!canAdd}
              className="w-full rounded-2xl border border-line bg-sunken px-4 py-3 text-ink outline-none placeholder:text-muted focus:border-ink/40 disabled:opacity-50"
              autoFocus
            />
            <ul className="mt-2 max-h-56 overflow-auto">
              {results.map((p) => {
                const selected = opponentSlugs.includes(p.slug);
                const blocked = !selected && !canAdd;
                return (
                  <li key={p.slug}>
                    <button
                      type="button"
                      disabled={blocked}
                      onClick={() => {
                        if (selected) removeOpponent(p.slug);
                        else addOpponent(p.slug);
                      }}
                      className="flex w-full items-center justify-between gap-3 rounded-xl px-3 py-2 text-left hover:bg-white/5 disabled:opacity-40"
                    >
                      <span className="flex items-center gap-3">
                        <PokemonArt slug={p.slug} src={p.sprite || p.artwork} name={p.name} size={36} />
                        <span>
                          {p.name}
                          {selected ? (
                            <span className="ml-2 text-xs text-muted">· selected · tap to remove</span>
                          ) : null}
                        </span>
                      </span>
                      <span className="flex gap-1">
                        {p.types.map((t) => (
                          <TypeBadge key={t} type={t} size="sm" />
                        ))}
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  );

  return (
    <MotionConfig reducedMotion="user">
      <LayoutGroup>
        <section id={id} className={`mt-10 ${MANUAL_SCROLL_MT}`}>
          <h2 className="text-2xl font-semibold tracking-tight">{heading}</h2>
          {lede ? <p className="mt-2 max-w-[52ch] text-sm text-muted">{lede}</p> : null}

          {showDock ? (
            <p className="mt-5 rounded-[22px] border border-line bg-raised/40 px-4 py-3 text-sm text-muted">
              Scout pinned.{" "}
              <button type="button" className="font-medium text-ink underline" onClick={() => setDockOpen(true)}>
                Open dock
              </button>
              {" · "}
              <button type="button" className="font-medium text-ink underline" onClick={toggleDock}>
                Unpin
              </button>
            </p>
          ) : (
            <div className="sticky top-[3.75rem] z-20 mt-5 space-y-3 md:top-[8rem]">{chrome}</div>
          )}

          <AnimatePresence mode="wait" initial={false}>
            {foes.length && !showDock ? (
              <ScoutReport
                multi={foes.length > 1}
                field={field}
                opponentSlugs={opponentSlugs}
                focusSlug={focusSlug}
                onFocus={setFocusSlug}
                focusFoe={focusFoe}
                focusReport={focusReport}
                ourMons={ourMons}
                hasMoves={hasMoves}
              />
            ) : null}
          </AnimatePresence>
        </section>

        {showDock ? (
          <VsScoutDock
            corner={corner}
            onCorner={setCorner}
            dockOpen={dockOpen}
            onToggleOpen={() => setDockOpen((v) => !v)}
            chrome={chrome}
            focusFoe={focusFoe}
            focusReport={focusReport}
            ourMons={ourMons}
            hasMoves={hasMoves}
          />
        ) : null}
      </LayoutGroup>
    </MotionConfig>
  );
}

function ScoutReport({
  multi,
  field,
  opponentSlugs,
  focusSlug,
  onFocus,
  focusFoe,
  focusReport,
  ourMons,
  hasMoves,
}: {
  multi: boolean;
  field: ReturnType<typeof scoutField> | null;
  opponentSlugs: string[];
  focusSlug: string | null;
  onFocus: (slug: string) => void;
  focusFoe: CatalogEntry | undefined;
  focusReport: ScoutTeamResult | null;
  ourMons: CatalogEntry[];
  hasMoves: boolean;
}) {
  return (
    <motion.div
      key="report"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 8 }}
      transition={{ duration: motionTokens.layout, ease: easeOut }}
      className="mt-5 space-y-5"
    >
      {multi && field ? (
        <VsMatchMatrix field={field} foeSlugs={opponentSlugs} focusSlug={focusSlug} onFocus={onFocus} />
      ) : null}

      {focusFoe && focusReport ? (
        <motion.div
          key={`detail-${focusFoe.slug}`}
          layout
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: motionTokens.layout, ease: easeOut }}
          className="space-y-4"
          style={cssVars(focusFoe.palette)}
        >
          {multi ? (
            <p className="text-sm">
              <span className="font-medium">Focused. </span>
              <span className="text-muted">{focusFoe.name}</span>
            </p>
          ) : null}

          <SafeSwitchCallout slug={focusReport.safeSwitchSlug} holes={focusReport.sharedHoles} />
          <VsStatStrip foe={focusFoe} />
          {ourMons.length ? <VsSpeRace ours={ourMons} foe={focusFoe} /> : null}

          <div className="grid gap-3 md:grid-cols-3">
            {focusReport.slots.map((slot) => (
              <VsSlotCard key={slot.slug} result={slot} hasMoves={hasMoves} />
            ))}
          </div>
        </motion.div>
      ) : null}
    </motion.div>
  );
}
