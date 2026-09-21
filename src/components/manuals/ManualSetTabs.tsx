"use client";

import { useEffect, useMemo, useState } from "react";
import { getPokemon } from "@/lib/catalog/load";
import { cssVars } from "@/lib/champions/palette";
import { PokemonArt } from "@/components/pokemon/PokemonArt";
import { Button } from "@/components/ui/Button";
import { LoadSampleSix } from "@/components/learn/LoadSampleSix";
import { ManualSection } from "@/components/manuals/ManualSection";
import { ROLE_LABEL } from "@/content/roles";
import { getLiteracyRole } from "@/content/literacy-roles";
import {
  flexPool,
  manualFormat,
  packRequiresSwap,
  resolveActiveBox,
  resolvePackStrategy,
  resolveRosterSlot,
  slotWithMode,
  type ManualPack,
  type SlotManual,
  type TeamManual,
} from "@/content/manuals";
import { formatBoxSets, formatSlotSet } from "@/lib/manuals/sets-text";
import { formatBringLabel } from "@/lib/format";
import { SequenceBeats } from "@/components/manuals/ManualDoublesChapters";
import {
  ManualOpeningCoach,
  SpBudgetBars,
} from "@/components/manuals/ManualApproachableChapters";

function SpGrid({ slot }: { slot: SlotManual }) {
  const sp = slot.training?.sp;
  if (!sp) {
    return slot.training?.why ? (
      <p className="text-sm text-muted">{slot.training.why}</p>
    ) : (
      <p className="text-sm text-muted">SP TODO</p>
    );
  }
  return <SpBudgetBars sp={sp} why={slot.training?.why} />;
}

export function ManualSetTabs({
  parent,
  pack,
  focusSlug,
  onFocusSlug,
}: {
  parent: TeamManual;
  pack?: ManualPack;
  focusSlug: string | null;
  onFocusSlug: (slug: string) => void;
}) {
  const box = resolveActiveBox(parent, pack?.id);
  const alts = flexPool(parent);
  const tabSlugs = useMemo(() => {
    const core = box.length ? box : (parent.slugs.filter(Boolean) as string[]);
    if (focusSlug && !core.includes(focusSlug)) return [...core, focusSlug];
    return core;
  }, [box, parent.slugs, focusSlug]);

  const activeSlug = focusSlug && tabSlugs.includes(focusSlug) ? focusSlug : tabSlugs[0] ?? null;
  const strategy = pack ? resolvePackStrategy(pack) : null;
  const packWincon = strategy?.winconMode ?? pack?.winconMode ?? null;
  const base = activeSlug ? resolveRosterSlot(parent, activeSlug, null) : null;
  const packModeOnThis = base?.modes?.some((m) => m.id === packWincon) ? packWincon : null;

  const [modeId, setModeId] = useState<string | null>(packModeOnThis);
  const [copied, setCopied] = useState<"idle" | "one" | "six" | "fail">("idle");

  useEffect(() => {
    setModeId(packModeOnThis);
  }, [activeSlug, packModeOnThis]);

  const displayed = base ? slotWithMode(base, modeId) : null;
  const mon = displayed?.slug ? getPokemon(displayed.slug) : undefined;
  const lit = displayed?.literacy ? getLiteracyRole(displayed.literacy) : undefined;
  const format = manualFormat(parent);
  const doubles = format === "doubles";
  const swap = pack && packRequiresSwap(pack) ? pack.requiresSwap : null;
  const loadBox = box.length ? box : undefined;
  const loadSlugs = (pack?.slugs ?? parent.slugs).filter(Boolean) as string[];

  async function copy(kind: "one" | "six") {
    const text =
      kind === "one" && displayed
        ? formatSlotSet(displayed)
        : formatBoxSets(parent, pack?.id);
    if (!text.trim()) return;
    try {
      await navigator.clipboard.writeText(text);
      setCopied(kind);
    } catch {
      setCopied("fail");
    }
    window.setTimeout(() => setCopied("idle"), 1800);
  }

  if (!tabSlugs.length) return null;

  return (
    <ManualSection
      id="sets"
      title="Sets"
      purpose="Item, ability, nature, SP, and four moves. Copy a paste or load the six onto Team."
      actions={
        <div className="flex flex-wrap items-center gap-2">
          <Button type="button" variant="line" onClick={() => void copy("one")}>
            {copied === "one" ? "Copied set" : copied === "fail" ? "Copy failed" : "Copy set"}
          </Button>
          <Button type="button" variant="line" onClick={() => void copy("six")}>
            {copied === "six" ? "Copied six" : "Copy six"}
          </Button>
          {loadSlugs.length === 3 ? (
            <LoadSampleSix
              slugs={loadSlugs}
              box={loadBox}
              intent={parent.archetype}
              stay
              manualId={parent.id}
              label={
                pack
                  ? doubles
                    ? `Load ${pack.label} (Singles Team)`
                    : swap
                      ? `Load ${pack.label} (swapped six)`
                      : `Load ${pack.label}`
                  : doubles
                    ? "Load onto Singles Team"
                    : `Load ${formatBringLabel(format)}`
              }
            />
          ) : null}
        </div>
      }
    >
      <div className="flex gap-1.5 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {tabSlugs.map((slug) => {
          const p = getPokemon(slug);
          if (!p) return null;
          const on = slug === activeSlug;
          const isAlt = alts.some((a) => a.slug === slug) && !box.includes(slug);
          const bring = new Set((pack?.slugs ?? parent.slugs).filter(Boolean));
          const benched = bring.size > 0 && !bring.has(slug) && !isAlt;
          return (
            <button
              key={slug}
              type="button"
              onClick={() => onFocusSlug(slug)}
              className={`inline-flex shrink-0 items-center gap-2 rounded-full border py-1 pl-1 pr-3 text-sm transition ${
                on ? "border-ink/40 bg-raised" : "border-line/70 bg-raised/30 hover:border-ink/25"
              } ${benched ? "opacity-40" : ""}`}
              style={cssVars(p.palette)}
              aria-pressed={on}
            >
              <PokemonArt slug={p.slug} src={p.sprite || p.artwork} name={p.name} size={28} />
              {p.name}
              {isAlt ? (
                <span className="font-mono text-[10px] uppercase tracking-[0.08em] text-amber-200/80">
                  Alt
                </span>
              ) : null}
            </button>
          );
        })}
      </div>

      {displayed && mon ? (
        <div
          className="mt-5 overflow-hidden rounded-[28px] border border-line bg-raised/40"
          style={cssVars(mon.palette)}
        >
          <div className="flex flex-wrap items-start gap-4 border-b border-line/60 px-5 py-4 sm:px-6">
            <PokemonArt slug={mon.slug} src={mon.artwork || mon.sprite} name={mon.name} size={80} />
            <div className="min-w-0 pt-1">
              <p className="text-xs text-muted">
                {ROLE_LABEL[displayed.job]}
                {lit ? ` · ${lit.name}` : null}
                {displayed.role ? ` · ${displayed.role}` : null}
              </p>
              <h3 className="mt-1 text-2xl font-semibold tracking-tight">
                {mon.name}
                {displayed.item ? (
                  <span className="font-medium text-muted"> @ {displayed.item}</span>
                ) : null}
              </h3>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {displayed.lock === "do-not-change" ? (
                  <span className="rounded-full bg-ink px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-[0.08em] text-bg">
                    Do not change
                  </span>
                ) : null}
                {displayed.lock === "later-test" ? (
                  <span className="rounded-full border border-line px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-[0.08em] text-muted">
                    Later test
                  </span>
                ) : null}
                {displayed.contrast ? (
                  <span className="rounded-full border border-line px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-[0.08em] text-muted">
                    vs {displayed.contrast.vs}
                  </span>
                ) : null}
              </div>
              {displayed.lockWhy ? (
                <p className="mt-2 max-w-[52ch] text-xs text-muted">{displayed.lockWhy}</p>
              ) : null}
              {displayed.objective ? (
                <p className="mt-1 max-w-[52ch] text-sm text-muted">{displayed.objective}</p>
              ) : null}
            </div>
          </div>

          {base?.modes?.length ? (
            <div className="flex flex-wrap gap-1.5 border-b border-line/60 px-5 py-3 sm:px-6">
              <button
                type="button"
                onClick={() => setModeId(null)}
                className={`rounded-full border px-3 py-1.5 text-xs font-medium transition ${
                  !modeId ? "border-ink/40 bg-ink text-bg" : "border-line/70 text-muted hover:text-ink"
                }`}
              >
                Default
                {base.item ? ` · ${base.item}` : ""}
              </button>
              {base.modes.map((mode) => (
                <button
                  key={mode.id}
                  type="button"
                  onClick={() => setModeId(mode.id)}
                  className={`rounded-full border px-3 py-1.5 text-xs font-medium transition ${
                    modeId === mode.id
                      ? "border-ink/40 bg-ink text-bg"
                      : "border-line/70 text-muted hover:text-ink"
                  }`}
                >
                  {mode.label}
                  {mode.item ? ` · ${mode.item}` : ""}
                </button>
              ))}
            </div>
          ) : null}

          <dl className="grid gap-px bg-line/60 sm:grid-cols-3">
            <div className="bg-raised/60 px-5 py-4 sm:px-6">
              <dt className="font-mono text-[10px] font-semibold uppercase tracking-[0.14em] text-muted">
                Ability
              </dt>
              <dd className="mt-1.5 text-sm font-medium">{displayed.ability || "TODO"}</dd>
              {displayed.abilityStages ? (
                <p className="mt-1 text-xs text-muted">
                  {displayed.abilityStages.before} → {displayed.abilityStages.after}{" "}
                  ({displayed.abilityStages.when})
                </p>
              ) : null}
            </div>
            <div className="bg-raised/60 px-5 py-4 sm:px-6">
              <dt className="font-mono text-[10px] font-semibold uppercase tracking-[0.14em] text-muted">
                Nature
              </dt>
              <dd className="mt-1.5 text-sm font-medium">{displayed.nature || "TODO"}</dd>
            </div>
            <div className="bg-raised/60 px-5 py-4 sm:px-6">
              <dt className="font-mono text-[10px] font-semibold uppercase tracking-[0.14em] text-muted">
                Item
              </dt>
              <dd className="mt-1.5 text-sm font-medium">{displayed.item || "TODO"}</dd>
              {displayed.itemWhy ? (
                <p className="mt-1 text-xs leading-snug text-muted">{displayed.itemWhy}</p>
              ) : null}
            </div>
          </dl>

          <div className="border-t border-line/60 px-5 py-4 sm:px-6">
            <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.14em] text-muted">
              SP
            </p>
            <div className="mt-3">
              <SpGrid slot={displayed} />
            </div>
            {displayed.training?.exportEvs ? (
              <p className="mt-2 font-mono text-[11px] text-muted">
                Source EVs: {displayed.training.exportEvs}
                {displayed.training.ivsNote ? ` · IVs ${displayed.training.ivsNote}` : ""}
              </p>
            ) : null}
            {displayed.training?.rule ? (
              <p className="mt-1 text-xs text-muted">{displayed.training.rule}</p>
            ) : null}
          </div>

          <div className="border-t border-line/60 px-5 py-4 sm:px-6">
            <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.14em] text-muted">
              Moves
            </p>
            <ul className="mt-3">
              {displayed.moves.filter((m) => m.name).map((move) => (
                <li
                  key={move.name}
                  className="border-t border-white/8 py-2.5 first:border-t-0 first:pt-0"
                >
                  <p className="text-[15px] font-medium leading-snug">{move.name}</p>
                  {move.why ? (
                    <p className="mt-1 text-sm leading-snug text-muted">{move.why}</p>
                  ) : null}
                  {move.alts
                    ?.filter((a) => a.name)
                    .map((alt) => (
                      <p key={alt.name} className="mt-2 text-sm leading-snug">
                        <span className="font-mono text-[10px] font-semibold uppercase tracking-[0.08em] text-muted">
                          Swap{" "}
                        </span>
                        <span className="font-medium">{alt.name}</span>
                        {alt.why ? <span className="text-muted"> — {alt.why}</span> : null}
                      </p>
                    ))}
                </li>
              ))}
            </ul>
          </div>

          {displayed.contrast ? (
            <div className="border-t border-line/60 px-5 py-4 sm:px-6">
              <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.14em] text-muted">
                vs {displayed.contrast.vs}
              </p>
              <p className="mt-2 text-sm text-muted">They used {displayed.contrast.theyUsed}.</p>
              <p className="mt-1 text-sm">We use {displayed.contrast.weUse}.</p>
              <p className="mt-2 text-sm text-muted">{displayed.contrast.why}</p>
            </div>
          ) : null}

          {displayed.ampTargets?.length ? (
            <div className="border-t border-line/60 px-5 py-4 sm:px-6">
              <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.14em] text-muted">
                Coaching targets
              </p>
              <ul className="mt-3 space-y-2">
                {displayed.ampTargets.map((t) => {
                  const target = getPokemon(t.slug);
                  return (
                    <li key={t.slug} className="flex items-center gap-2 text-sm">
                      {target ? (
                        <span style={cssVars(target.palette)}>
                          <PokemonArt
                            slug={target.slug}
                            src={target.sprite || target.artwork}
                            name={target.name}
                            size={28}
                          />
                        </span>
                      ) : null}
                      <span>
                        <span className="font-medium">{target?.name ?? t.slug}</span>
                        <span className="text-muted"> — {t.becomes}</span>
                      </span>
                    </li>
                  );
                })}
              </ul>
            </div>
          ) : null}

          {displayed.itemLoop ? (
            <div className="border-t border-line/60 px-5 py-4 sm:px-6">
              <SequenceBeats sequence={displayed.itemLoop} />
            </div>
          ) : null}

          {displayed.opening?.length ? (
            <div className="border-t border-line/60 px-5 py-4 sm:px-6">
              <ManualOpeningCoach asks={displayed.opening} />
            </div>
          ) : null}
        </div>
      ) : null}
    </ManualSection>
  );
}
