"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, MotionConfig, motion, useReducedMotion } from "motion/react";
import { getPokemon } from "@/lib/catalog/load";
import { cssVars } from "@/lib/champions/palette";
import { PokemonArt } from "@/components/pokemon/PokemonArt";
import { Button } from "@/components/ui/Button";
import { LoadSampleSix } from "@/components/learn/LoadSampleSix";
import { SlotCardBody } from "@/components/manuals/SlotCard";
import { TeamCoverage } from "@/components/manuals/TeamCoverage";
import { ManualSection } from "@/components/manuals/ManualSection";
import { easeOut, motionTokens } from "@/components/motion/tokens";
import { formatManualSets } from "@/lib/manuals/sets-text";
import {
  manualFormat,
  resolvePackStrategy,
  type ManualCoverageNote,
  type ManualPack,
  type TeamManual,
} from "@/content/manuals";
import type { CoverageMember } from "@/lib/champions/team-coverage";
import { formatBringLabel } from "@/lib/format";

export type PackageViewMode = "carousel" | "menu";

function packsForSlug(packs: ManualPack[], slug: string) {
  return packs.filter((p) => (p.slugs as string[]).includes(slug));
}

function PackThreeArts({
  slugs,
  size = 56,
}: {
  slugs: [string, string, string] | string[];
  size?: number;
}) {
  return (
    <div className="flex items-end justify-center gap-1">
      {slugs.map((slug) => {
        const mon = getPokemon(slug);
        if (!mon) return null;
        return (
          <span key={slug} className="block" style={cssVars(mon.palette)} title={mon.name}>
            <PokemonArt slug={mon.slug} src={mon.sprite || mon.artwork} name={mon.name} size={size} />
          </span>
        );
      })}
    </div>
  );
}

export function ManualPackageHero({
  parent,
  manual,
  packs,
  activeId,
  onSelectPack,
  viewMode,
  onViewMode,
  coverageMembers,
  coverageNotes = [],
}: {
  parent: TeamManual;
  manual: TeamManual;
  packs: ManualPack[];
  activeId: string;
  onSelectPack: (id: string) => void;
  viewMode: PackageViewMode;
  onViewMode: (mode: PackageViewMode) => void;
  coverageMembers: CoverageMember[];
  coverageNotes?: ManualCoverageNote[];
}) {
  const pack = packs.find((p) => p.id === activeId) ?? packs[0];
  const strategy = pack ? resolvePackStrategy(pack) : null;
  const format = manualFormat(parent);
  const doubles = format === "doubles";
  const roster = parent.roster ?? [];
  const box = parent.box ? [...parent.box] : roster.map((s) => s.slug).filter(Boolean);
  const roles = pack?.roles ?? [];
  const roleBySlug = new Map(roles.map((r) => [r.slug, r]));
  const activeSet = new Set(manual.slugs.filter(Boolean) as string[]);
  const [focusSlug, setFocusSlug] = useState<string | null>(manual.slugs[0] ?? null);
  const [copied, setCopied] = useState<"idle" | "ok" | "fail">("idle");
  const [rosterPick, setRosterPick] = useState<{ slug: string; packIds: string[] } | null>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();

  useEffect(() => {
    const first = manual.slugs.find(Boolean) as string | undefined;
    setFocusSlug((cur) => (cur && activeSet.has(cur) ? cur : first ?? null));
    setRosterPick(null);
  }, [activeId, manual.slugs]);

  useEffect(() => {
    if (viewMode !== "carousel") return;
    const el = trackRef.current?.querySelector<HTMLElement>(`[data-pack="${activeId}"]`);
    el?.scrollIntoView({ behavior: reduce ? "auto" : "smooth", inline: "center", block: "nearest" });
  }, [activeId, viewMode, reduce]);

  const focusSlot =
    manual.slots.find((s) => s.slug === focusSlug) ??
    roster.find((s) => s.slug === focusSlug);
  const focusMon = focusSlug ? getPokemon(focusSlug) : undefined;
  const focusRole = focusSlug ? roleBySlug.get(focusSlug) : undefined;

  const washMon = useMemo(() => {
    const lead = strategy?.defaultLead ?? pack?.slugs[0];
    return lead ? getPokemon(lead) : undefined;
  }, [strategy?.defaultLead, pack?.slugs]);

  async function copySets() {
    try {
      await navigator.clipboard.writeText(formatManualSets(manual));
      setCopied("ok");
    } catch {
      setCopied("fail");
    }
    window.setTimeout(() => setCopied("idle"), 1800);
  }

  function pickFromSix(slug: string) {
    if (activeSet.has(slug)) {
      setFocusSlug(slug);
      setRosterPick(null);
      return;
    }
    const hits = packsForSlug(packs, slug);
    if (hits.length === 1) {
      onSelectPack(hits[0].id);
      setFocusSlug(slug);
      setRosterPick(null);
      return;
    }
    if (hits.length > 1) {
      setRosterPick({ slug, packIds: hits.map((h) => h.id) });
      setFocusSlug(slug);
    }
  }

  return (
    <MotionConfig reducedMotion="user">
      <ManualSection
        id="team"
        title="Package"
        purpose={
          doubles
            ? `Pick the package you study (${formatBringLabel(format)}). Team load is Singles-only today.`
            : "Pick the three you bring. Everything below teaches that package."
        }
        actions={
          <div className="flex flex-wrap items-center gap-2">
            <div className="inline-flex rounded-full border border-line p-0.5 text-xs">
              <button
                type="button"
                onClick={() => onViewMode("carousel")}
                className={`rounded-full px-3 py-1.5 transition ${
                  viewMode === "carousel" ? "bg-ink text-bg" : "text-muted hover:text-ink"
                }`}
              >
                Carousel
              </button>
              <button
                type="button"
                onClick={() => onViewMode("menu")}
                className={`rounded-full px-3 py-1.5 transition ${
                  viewMode === "menu" ? "bg-ink text-bg" : "text-muted hover:text-ink"
                }`}
              >
                Menu
              </button>
            </div>
            <Button type="button" variant="line" onClick={() => void copySets()}>
              {copied === "ok" ? "Copied" : copied === "fail" ? "Copy failed" : "Copy sets"}
            </Button>
            {manual.slugs.every(Boolean) ? (
              <LoadSampleSix
                slugs={[...manual.slugs]}
                box={parent.box ? [...parent.box] : undefined}
                intent={manual.archetype}
                stay
                manualId={parent.id}
                label={
                  pack
                    ? doubles
                      ? `Load ${pack.label} (Singles Team)`
                      : `Load ${pack.label}`
                    : doubles
                      ? "Load onto Singles Team"
                      : "Load bring"
                }
              />
            ) : null}
          </div>
        }
      >
        <div className="space-y-10" style={washMon ? cssVars(washMon.palette) : undefined}>
          {viewMode === "carousel" ? (
            <div className="-mx-1">
              <div
                ref={trackRef}
                className="flex snap-x snap-mandatory gap-4 overflow-x-auto px-1 pb-3 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
              >
                {packs.map((p) => {
                  const on = p.id === activeId;
                  const lead = getPokemon(p.strategy?.defaultLead ?? p.slugs[0]);
                  return (
                    <button
                      key={p.id}
                      type="button"
                      data-pack={p.id}
                      onClick={() => onSelectPack(p.id)}
                      className={`relative w-[min(18rem,78vw)] shrink-0 snap-center rounded-[28px] border px-4 py-5 text-left transition ${
                        on
                          ? "border-ink/40 bg-[color-mix(in_srgb,var(--mon-wash)_22%,transparent)] shadow-[var(--shadow)]"
                          : "border-line/70 bg-raised/30 opacity-80 hover:opacity-100"
                      }`}
                      style={lead ? cssVars(lead.palette) : undefined}
                      aria-pressed={on}
                    >
                      <PackThreeArts slugs={p.slugs} size={on ? 64 : 48} />
                      <p className="mt-4 text-lg font-semibold tracking-tight">{p.label}</p>
                      <p className="mt-1 text-sm leading-snug text-muted">{p.when}</p>
                      {p.identity ? (
                        <p className="mt-3 line-clamp-2 font-mono text-[10px] uppercase tracking-[0.1em] text-muted">
                          {p.identity}
                        </p>
                      ) : null}
                      {on ? (
                        <span className="absolute right-3 top-3 rounded-full bg-ink px-2 py-0.5 text-[10px] font-medium text-bg">
                          Active
                        </span>
                      ) : null}
                    </button>
                  );
                })}
              </div>
              <p className="mt-1 text-center text-xs text-muted">Swipe or click a package of three</p>
            </div>
          ) : (
            <div className="grid gap-6 lg:grid-cols-[minmax(14rem,0.9fr)_minmax(0,1.4fr)] lg:items-start">
              <ul className="sticky top-24 space-y-2">
                {packs.map((p) => {
                  const on = p.id === activeId;
                  return (
                    <li key={p.id}>
                      <button
                        type="button"
                        onClick={() => onSelectPack(p.id)}
                        className={`flex w-full items-center gap-3 rounded-2xl border px-3 py-2.5 text-left transition ${
                          on
                            ? "border-ink/40 bg-raised"
                            : "border-line/70 bg-raised/30 hover:border-ink/25"
                        }`}
                        aria-pressed={on}
                      >
                        <PackThreeArts slugs={p.slugs} size={36} />
                        <span className="min-w-0">
                          <span className="block truncate font-medium tracking-tight">{p.label}</span>
                          <span className="mt-0.5 block truncate text-xs text-muted">{p.when}</span>
                        </span>
                      </button>
                    </li>
                  );
                })}
              </ul>
              <AnimatePresence mode="wait">
                {pack ? (
                  <motion.div
                    key={pack.id}
                    initial={reduce ? false : { opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={reduce ? undefined : { opacity: 0, y: -8 }}
                    transition={{ duration: motionTokens.layout, ease: easeOut }}
                    className="rounded-[32px] border border-line bg-raised/40 px-5 py-8 sm:px-8"
                    style={washMon ? cssVars(washMon.palette) : undefined}
                  >
                    <PackThreeArts slugs={pack.slugs} size={96} />
                    <h3 className="mt-6 text-center text-2xl font-semibold tracking-tight">{pack.label}</h3>
                    <p className="mx-auto mt-2 max-w-[42ch] text-center text-muted">{pack.when}</p>
                    {roles.length ? (
                      <ul className="mt-6 flex flex-wrap justify-center gap-2">
                        {roles.map((r) => {
                          const mon = getPokemon(r.slug);
                          return (
                            <li
                              key={r.slug}
                              className="rounded-full border border-line/70 bg-bg/40 px-3 py-1 text-xs"
                            >
                              <span className="font-medium">{mon?.name ?? r.slug}</span>
                              <span className="text-muted"> · {r.macro}</span>
                            </li>
                          );
                        })}
                      </ul>
                    ) : null}
                  </motion.div>
                ) : null}
              </AnimatePresence>
            </div>
          )}

          <AnimatePresence mode="wait">
            {pack && strategy ? (
              <motion.div
                key={`detail-${pack.id}`}
                initial={reduce ? false : { opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={reduce ? undefined : { opacity: 0 }}
                transition={{ duration: motionTokens.state, ease: easeOut }}
                className="space-y-8"
              >
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                  <div className="rounded-2xl border border-line bg-raised/40 p-4">
                    <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.14em] text-muted">
                      Saw
                    </p>
                    <p className="mt-2 text-sm leading-snug">{strategy.opponentPattern}</p>
                  </div>
                  <div className="rounded-2xl border border-line bg-raised/40 p-4">
                    <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.14em] text-muted">
                      Wins by
                    </p>
                    <p className="mt-2 text-sm leading-snug">{strategy.winCondition}</p>
                  </div>
                  <div className="rounded-2xl border border-line bg-raised/40 p-4">
                    <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.14em] text-muted">
                      Targets
                    </p>
                    <p className="mt-2 text-sm leading-snug">{strategy.targets.join(" · ") || "—"}</p>
                  </div>
                  <div className="rounded-2xl border border-line bg-raised/40 p-4">
                    <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.14em] text-muted">
                      Refuse
                    </p>
                    <p className="mt-2 text-sm leading-snug">{strategy.refuses.join(" · ") || "—"}</p>
                  </div>
                </div>

                <div>
                  <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.14em] text-muted">
                    This bring
                  </p>
                  <ul className="mt-3 grid gap-3 sm:grid-cols-3">
                    {pack.slugs.map((slug) => {
                      const mon = getPokemon(slug);
                      const role = roleBySlug.get(slug);
                      const on = focusSlug === slug;
                      if (!mon) return null;
                      return (
                        <li key={slug}>
                          <button
                            type="button"
                            onClick={() => setFocusSlug(slug)}
                            className={`flex w-full flex-col items-center rounded-2xl border px-3 py-4 transition ${
                              on ? "border-ink/40 bg-raised" : "border-line/70 bg-raised/30 hover:bg-raised/50"
                            }`}
                            style={cssVars(mon.palette)}
                          >
                            <PokemonArt
                              slug={mon.slug}
                              src={mon.sprite || mon.artwork}
                              name={mon.name}
                              size={72}
                            />
                            <span className="mt-2 font-medium tracking-tight">{mon.name}</span>
                            {role ? (
                              <span className="mt-0.5 text-xs text-muted">
                                {role.macro} · {role.micro}
                              </span>
                            ) : null}
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                </div>

                {focusSlot && focusMon ? (
                  <div
                    className="rounded-[28px] border border-line bg-raised/40 p-5 sm:p-6"
                    style={cssVars(focusMon.palette)}
                  >
                    <div className="flex flex-wrap items-center gap-4">
                      <PokemonArt
                        slug={focusMon.slug}
                        src={focusMon.artwork}
                        name={focusMon.name}
                        size={88}
                      />
                      <div>
                        <h3 className="text-xl font-semibold tracking-tight">{focusMon.name}</h3>
                        {focusRole ? (
                          <p className="mt-1 text-sm text-muted">
                            {focusRole.macro} — {focusRole.micro}
                          </p>
                        ) : null}
                      </div>
                    </div>
                    <div className="mt-5">
                      <SlotCardBody slot={focusSlot} />
                    </div>
                  </div>
                ) : null}

                <div>
                  <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.14em] text-muted">
                    Registered six
                  </p>
                  <p className="mt-1 text-xs text-muted">
                    Tap a mon not in the bring to jump packages. Shared mons ask which package.
                  </p>
                  <ul className="mt-3 flex flex-wrap gap-2">
                    {box.map((slug) => {
                      const mon = getPokemon(slug);
                      if (!mon) return null;
                      const inBring = activeSet.has(slug);
                      return (
                        <li key={slug}>
                          <button
                            type="button"
                            onClick={() => pickFromSix(slug)}
                            className={`inline-flex items-center gap-2 rounded-full border py-1 pl-1 pr-3 text-sm transition ${
                              inBring
                                ? "border-ink/35 bg-white/10"
                                : "border-line/60 bg-raised/30 opacity-70 hover:opacity-100"
                            }`}
                            style={cssVars(mon.palette)}
                          >
                            <PokemonArt
                              slug={mon.slug}
                              src={mon.sprite || mon.artwork}
                              name={mon.name}
                              size={32}
                            />
                            {mon.name}
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                  {rosterPick ? (
                    <div className="mt-3 rounded-2xl border border-line bg-bg/50 p-3">
                      <p className="text-sm text-muted">
                        {getPokemon(rosterPick.slug)?.name} appears in multiple packages — pick one:
                      </p>
                      <ul className="mt-2 flex flex-wrap gap-2">
                        {rosterPick.packIds.map((id) => {
                          const p = packs.find((x) => x.id === id);
                          if (!p) return null;
                          return (
                            <li key={id}>
                              <button
                                type="button"
                                onClick={() => {
                                  onSelectPack(id);
                                  setRosterPick(null);
                                }}
                                className="rounded-full border border-line bg-raised/50 px-3 py-1.5 text-sm hover:border-ink/35"
                              >
                                {p.label}
                              </button>
                            </li>
                          );
                        })}
                      </ul>
                    </div>
                  ) : null}
                </div>

                <TeamCoverage
                  members={coverageMembers}
                  notes={coverageNotes}
                  defaultOpen
                />
              </motion.div>
            ) : null}
          </AnimatePresence>
        </div>
      </ManualSection>
    </MotionConfig>
  );
}
