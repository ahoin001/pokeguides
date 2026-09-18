"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, MotionConfig, motion } from "motion/react";
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
  resolvePackStrategy,
  type ManualArchitectureLayer,
  type ManualCoverageNote,
  type ManualPack,
  type ManualPackRole,
  type TeamManual,
} from "@/content/manuals";
import type { CoverageMember } from "@/lib/champions/team-coverage";

function layerForSlug(layers: ManualArchitectureLayer[], slug: string) {
  return layers.find((l) => l.slugs?.includes(slug));
}

export function ManualSpotlight({
  parent,
  manual,
  packs,
  activeId,
  onSelectPack,
  coverageMembers,
  coverageNotes = [],
}: {
  parent: TeamManual;
  manual: TeamManual;
  packs: ManualPack[];
  activeId: string;
  onSelectPack: (id: string) => void;
  coverageMembers: CoverageMember[];
  coverageNotes?: ManualCoverageNote[];
}) {
  const pack = packs.find((p) => p.id === activeId) ?? packs[0];
  const strategy = pack ? resolvePackStrategy(pack) : null;
  const roster = parent.roster ?? [];
  const box = parent.box ? [...parent.box] : roster.map((s) => s.slug).filter(Boolean);
  const architecture = parent.architecture ?? [];
  const roles = pack?.roles ?? [];
  const roleBySlug = new Map(roles.map((r) => [r.slug, r]));
  const activeSet = new Set(manual.slugs.filter(Boolean) as string[]);
  const [focusSlug, setFocusSlug] = useState<string | null>(manual.slugs[0] ?? null);
  const [copied, setCopied] = useState<"idle" | "ok" | "fail">("idle");

  useEffect(() => {
    const first = manual.slugs.find(Boolean) as string | undefined;
    setFocusSlug((cur) => (cur && activeSet.has(cur) ? cur : first ?? null));
    // activeSet is derived from manual.slugs; pack change remounts via parent key when needed
  }, [activeId, manual.slugs]);

  const focusSlot =
    manual.slots.find((s) => s.slug === focusSlug) ??
    roster.find((s) => s.slug === focusSlug);
  const focusMon = focusSlug ? getPokemon(focusSlug) : undefined;
  const focusRole = focusSlug ? roleBySlug.get(focusSlug) : undefined;

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
      return;
    }
    const next = packs.find((p) => (p.slugs as string[]).includes(slug));
    if (next) {
      onSelectPack(next.id);
      setFocusSlug(slug);
    }
  }

  return (
    <MotionConfig reducedMotion="user">
      <ManualSection
        id="team"
        title="Team"
        purpose="Pick a package. The bring, builds, and strategy below follow that choice."
        actions={
          <div className="flex flex-wrap items-center gap-2">
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
                label={pack ? `Load ${pack.label}` : "Load bring"}
              />
            ) : null}
          </div>
        }
      >
        <div className="space-y-8">
          <div>
            <ul className="flex flex-wrap gap-2">
              {packs.map((p) => {
                const on = p.id === pack?.id;
                return (
                  <li key={p.id}>
                    <button
                      type="button"
                      aria-pressed={on}
                      onClick={() => onSelectPack(p.id)}
                      className={`rounded-full px-4 py-2 text-left transition ${
                        on
                          ? "bg-ink text-bg shadow-[0_10px_28px_rgba(0,0,0,0.28)]"
                          : "border border-line bg-raised/40 text-muted hover:border-ink/40 hover:text-ink"
                      }`}
                    >
                      <span className="block text-sm font-medium tracking-tight">{p.label}</span>
                      {on ? (
                        <span className="mt-0.5 block max-w-[32ch] text-xs text-bg/70">{p.when}</span>
                      ) : null}
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>

          <AnimatePresence mode="wait">
            {pack && strategy ? (
              <motion.div
                key={pack.id}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ duration: motionTokens.state, ease: easeOut }}
                className="space-y-8"
              >
                <div className="overflow-hidden rounded-[28px] border border-line/70 bg-raised/30">
                  <div className="border-b border-line/60 px-5 py-4">
                    <p className="text-base font-medium tracking-tight">{pack.identity}</p>
                    <p className="mt-2 max-w-[60ch] text-sm leading-relaxed text-muted">
                      {strategy.purpose}
                    </p>
                    {strategy.mantra ? (
                      <p className="mt-3 max-w-[56ch] text-sm font-medium leading-relaxed text-ink/90">
                        {strategy.mantra}
                      </p>
                    ) : null}
                    {strategy.contrast ? (
                      <p className="mt-2 max-w-[60ch] text-[13px] leading-relaxed text-muted">
                        {strategy.contrast}
                      </p>
                    ) : null}
                  </div>
                  <dl className="grid gap-0 sm:grid-cols-2 lg:grid-cols-4">
                    <Fact label="Saw" body={strategy.opponentPattern} />
                    <Fact label="Wins by" body={strategy.winCondition} />
                    <Fact
                      label="Targets"
                      body={strategy.targets.join(" · ") || "—"}
                    />
                    <Fact
                      label="Refuse"
                      body={strategy.refuses.join(" · ") || "—"}
                      muted
                    />
                  </dl>
                  {strategy.gamePlan ? (
                    <p className="border-t border-line/60 px-5 py-3 text-sm text-muted">
                      <span className="font-medium text-ink">Plan: </span>
                      {strategy.gamePlan}
                    </p>
                  ) : null}
                  {strategy.defaultLead ? (
                    <p className="border-t border-line/60 px-5 py-3 text-sm text-muted">
                      <span className="font-medium text-ink">Default lead: </span>
                      {getPokemon(strategy.defaultLead)?.name ?? strategy.defaultLead}
                      {strategy.defaultLeadWhy ? ` — ${strategy.defaultLeadWhy}` : null}
                    </p>
                  ) : null}
                  {strategy.preserveRule ? (
                    <p className="border-t border-line/60 px-5 py-3 text-sm text-muted">
                      <span className="font-medium text-ink">Preserve: </span>
                      {strategy.preserveRule}
                    </p>
                  ) : null}
                </div>

                {(strategy.previewQuestions?.length || strategy.turnChecklist?.length) ? (
                  <div className="grid gap-3 md:grid-cols-2">
                    {strategy.previewQuestions?.length ? (
                      <PilotList
                        title="Preview questions"
                        items={strategy.previewQuestions}
                      />
                    ) : null}
                    {strategy.turnChecklist?.length ? (
                      <PilotList
                        title="5-second turn checklist"
                        items={strategy.turnChecklist}
                      />
                    ) : null}
                  </div>
                ) : null}

                {strategy.healthPriority?.length ? (
                  <div>
                    <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.14em] text-muted">
                      Health priorities
                    </p>
                    <ul className="mt-3 grid gap-2 sm:grid-cols-3">
                      {strategy.healthPriority.map((h) => {
                        const mon = getPokemon(h.slug);
                        return (
                          <li
                            key={h.slug}
                            className="rounded-2xl border border-line/60 bg-raised/25 px-3 py-3"
                          >
                            <p className="text-sm font-semibold tracking-tight">
                              {mon?.name ?? h.slug}
                            </p>
                            <p className="mt-1 text-[12px] leading-relaxed text-muted">{h.why}</p>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                ) : null}

                <div>
                  <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.14em] text-muted">
                    This bring
                  </p>
                  <ul className="mt-3 grid gap-3 sm:grid-cols-3">
                    {manual.slots.map((slot) => {
                      const mon = slot.slug ? getPokemon(slot.slug) : undefined;
                      if (!mon || !slot.slug) return null;
                      const role = roleBySlug.get(slot.slug);
                      const on = focusSlug === slot.slug;
                      return (
                        <li key={slot.slug}>
                          <button
                            type="button"
                            aria-pressed={on}
                            onClick={() => setFocusSlug(slot.slug)}
                            className={`flex w-full items-center gap-3 rounded-[24px] border px-3 py-3 text-left transition ${
                              on
                                ? "border-ink/35 bg-white/10 shadow-[0_12px_28px_rgba(0,0,0,0.28)]"
                                : "border-line/70 bg-raised/25 hover:border-ink/25"
                            }`}
                            style={cssVars(mon.palette)}
                          >
                            <PokemonArt
                              slug={mon.slug}
                              src={mon.artwork}
                              name={mon.name}
                              size={64}
                            />
                            <span className="min-w-0">
                              <span className="block truncate font-semibold tracking-tight">
                                {mon.name}
                              </span>
                              <span className="mt-0.5 block font-mono text-[10px] uppercase tracking-[0.12em] text-muted">
                                {role?.primary ?? role?.macro ?? slot.primaryJob ?? slot.role}
                              </span>
                              {role?.micro ? (
                                <span className="mt-1.5 line-clamp-2 block text-[12px] text-muted">
                                  {role.micro}
                                </span>
                              ) : null}
                            </span>
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                </div>

                {focusSlot && focusMon ? (
                  <div
                    className="overflow-hidden rounded-[28px] border border-line/70 bg-sunken/50"
                    style={cssVars(focusMon.palette)}
                  >
                    <div className="flex flex-wrap items-end justify-between gap-3 border-b border-line/60 px-5 py-4">
                      <div>
                        <p className="text-xl font-semibold tracking-tight">{focusMon.name}</p>
                        <p className="mt-1 text-sm text-muted">
                          {focusRole?.primary ?? focusRole?.micro ?? focusSlot.role}
                          {focusRole?.secondary ? (
                            <span className="text-muted"> · {focusRole.secondary}</span>
                          ) : null}
                        </p>
                      </div>
                      {focusRole?.threatens?.length ? (
                        <ul className="flex flex-wrap gap-1.5">
                          {focusRole.threatens.map((t) => (
                            <li
                              key={t}
                              className="rounded-full border border-line/50 bg-raised/40 px-2.5 py-0.5 text-[11px] text-muted"
                            >
                              {t}
                            </li>
                          ))}
                        </ul>
                      ) : null}
                    </div>
                    {focusRole?.watch?.length ? (
                      <ul className="border-b border-line/60 px-5 py-3">
                        {focusRole.watch.map((w) => (
                          <li key={w} className="text-sm leading-relaxed text-muted">
                            <span className="font-medium text-ink/85">Watch: </span>
                            {w}
                          </li>
                        ))}
                      </ul>
                    ) : null}
                    {focusRole?.states?.length ? (
                      <ul className="grid gap-0 border-b border-line/60 sm:grid-cols-3">
                        {focusRole.states.map((st) => (
                          <li
                            key={st.id}
                            className="border-t border-line/50 px-4 py-3 sm:border-t-0 sm:border-l sm:first:border-l-0"
                          >
                            <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-muted">
                              {st.label}
                            </p>
                            <p className="mt-1 text-[12px] text-muted">{st.when}</p>
                            <p className="mt-1.5 text-sm font-medium leading-snug">{st.play}</p>
                          </li>
                        ))}
                      </ul>
                    ) : null}
                    <SlotCardBody slot={focusSlot} identity={false} />
                  </div>
                ) : null}

                {box.length ? (
                  <div>
                    <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.14em] text-muted">
                      Full six
                    </p>
                    <p className="mt-1 max-w-[52ch] text-sm text-muted">
                      Dimmed seats sit on the registered box. Tap one outside this bring to jump to a
                      package that uses it.
                    </p>
                    <ul className="mt-3 grid grid-cols-3 gap-2 sm:grid-cols-6">
                      {box.map((slug) => {
                        const mon = getPokemon(slug);
                        const slot = roster.find((s) => s.slug === slug);
                        if (!mon) return null;
                        const on = activeSet.has(slug);
                        const focused = focusSlug === slug;
                        const layer = layerForSlug(architecture, slug);
                        return (
                          <li key={slug}>
                            <button
                              type="button"
                              onClick={() => pickFromSix(slug)}
                              aria-pressed={on}
                              className={`flex w-full flex-col items-center rounded-[20px] border px-2 py-2.5 text-center transition ${
                                focused
                                  ? "border-ink/40 bg-white/10"
                                  : on
                                    ? "border-line/80 bg-raised/35"
                                    : "border-transparent opacity-40 hover:opacity-80"
                              }`}
                              style={cssVars(mon.palette)}
                            >
                              <PokemonArt
                                slug={mon.slug}
                                src={mon.sprite || mon.artwork}
                                name={mon.name}
                                size={48}
                              />
                              <span className="mt-1.5 block max-w-full truncate text-xs font-medium">
                                {mon.name}
                              </span>
                              <span className="mt-0.5 block max-w-full truncate text-[10px] text-muted">
                                {layer?.title ?? slot?.primaryJob ?? slot?.role ?? ""}
                              </span>
                            </button>
                          </li>
                        );
                      })}
                    </ul>
                    {architecture.length ? (
                      <ul className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
                        {architecture.map((layer) => (
                          <li
                            key={layer.title}
                            className="rounded-2xl border border-line/50 bg-raised/20 px-3 py-2.5"
                          >
                            <p className="text-sm font-semibold tracking-tight">{layer.title}</p>
                            <p className="mt-1 text-[12px] leading-relaxed text-muted">{layer.body}</p>
                          </li>
                        ))}
                      </ul>
                    ) : null}
                  </div>
                ) : null}

                {roles.length ? <RoleChain roles={roles} /> : null}

                {pack.decisionRules?.length ? (
                  <div>
                    <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.14em] text-muted">
                      Signature buttons
                    </p>
                    <ul className="mt-3 grid gap-3 md:grid-cols-3">
                      {pack.decisionRules.map((rule) => (
                        <li
                          key={rule.id}
                          className="rounded-[24px] border border-line/70 bg-raised/25 px-4 py-4"
                        >
                          <p className="text-sm font-semibold tracking-tight">{rule.title}</p>
                          <p className="mt-2 text-[12px] leading-relaxed text-muted">
                            <span className="font-medium text-ink/85">Ask: </span>
                            {rule.ask}
                          </p>
                          <p className="mt-3 text-[12px] leading-relaxed text-ink/85">
                            <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-muted">
                              Good{" "}
                            </span>
                            {rule.good}
                          </p>
                          <p className="mt-2 text-[12px] leading-relaxed text-muted">
                            <span className="font-mono text-[10px] uppercase tracking-[0.12em]">
                              Bad{" "}
                            </span>
                            {rule.bad}
                          </p>
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : null}

                <TeamCoverage
                  members={coverageMembers}
                  notes={coverageNotes}
                  defaultOpen={false}
                  title="Kit coverage"
                />

                {manual.setsNote?.trim() ? (
                  <div className="rounded-[24px] border border-line/70 bg-sunken/60 px-4 py-3.5">
                    <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.14em] text-muted">
                      Stat Points
                    </p>
                    <p className="mt-1.5 max-w-prose text-sm leading-relaxed text-muted">
                      {manual.setsNote}
                    </p>
                  </div>
                ) : null}
              </motion.div>
            ) : null}
          </AnimatePresence>
        </div>
      </ManualSection>
    </MotionConfig>
  );
}

function PilotList({ title, items }: { title: string; items: string[] }) {
  return (
    <div className="rounded-[24px] border border-line/70 bg-raised/25 px-4 py-4">
      <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.14em] text-muted">
        {title}
      </p>
      <ol className="mt-3 space-y-2">
        {items.map((item, i) => (
          <li key={item} className="flex gap-3 text-sm leading-relaxed">
            <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-white/8 font-mono text-[10px] text-muted">
              {i + 1}
            </span>
            <span className="text-ink/90">{item}</span>
          </li>
        ))}
      </ol>
    </div>
  );
}

function Fact({
  label,
  body,
  muted,
}: {
  label: string;
  body: string;
  muted?: boolean;
}) {
  return (
    <div className="border-t border-line/50 px-5 py-3 sm:border-t-0 sm:border-l sm:first:border-l-0">
      <dt className="font-mono text-[10px] font-semibold uppercase tracking-[0.14em] text-muted">
        {label}
      </dt>
      <dd className={`mt-1.5 text-sm leading-relaxed ${muted ? "text-muted" : "text-ink/90"}`}>
        {body}
      </dd>
    </div>
  );
}

function RoleChain({ roles }: { roles: ManualPackRole[] }) {
  return (
    <ol className="flex flex-col gap-2 md:flex-row md:items-stretch md:gap-0">
      {roles.map((role, i) => {
        const mon = getPokemon(role.slug);
        return (
          <li key={role.slug} className="flex min-w-0 flex-1 items-stretch md:items-center">
            <div className="flex min-w-0 flex-1 flex-col justify-center rounded-2xl border border-line/60 bg-raised/25 px-3 py-3">
              <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-muted">
                {role.macro}
              </p>
              <p className="mt-1 truncate text-sm font-semibold">{mon?.name ?? role.slug}</p>
              {role.gives ? (
                <p className="mt-1 line-clamp-2 text-[11px] text-muted">{role.gives}</p>
              ) : null}
            </div>
            {i < roles.length - 1 ? (
              <span aria-hidden className="hidden px-2 text-muted md:flex md:items-center">
                →
              </span>
            ) : null}
          </li>
        );
      })}
    </ol>
  );
}
