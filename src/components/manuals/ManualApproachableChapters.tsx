"use client";

import { useMemo, useState } from "react";
import { getPokemon } from "@/lib/catalog/load";
import { cssVars } from "@/lib/champions/palette";
import { PokemonArt } from "@/components/pokemon/PokemonArt";
import { ManualSection } from "@/components/manuals/ManualSection";
import { ManualFlowchart } from "@/components/manuals/ManualFlowchart";
import { ManualLoopStrip } from "@/components/manuals/ManualLoopStrip";
import {
  flexPool,
  resolvePackStrategy,
  type ManualArchitectureLayer,
  type ManualEngine,
  type ManualMatchupScript,
  type ManualMegaPool,
  type ManualPack,
  type SlotManual,
  type TeamManual,
} from "@/content/manuals";
import { flowsFor } from "@/content/classroom-flows";

/** Three value chips under the masthead pull quote. */
export function ManualValueChips({ chips }: { chips: string[] }) {
  const list = chips.filter(Boolean).slice(0, 5);
  if (!list.length) return null;
  return (
    <ul className="mt-5 flex flex-wrap gap-2">
      {list.map((chip) => (
        <li
          key={chip}
          className="rounded-full border border-line/60 bg-raised/40 px-3.5 py-1.5 text-sm font-medium text-ink"
        >
          {chip}
        </li>
      ))}
    </ul>
  );
}

/**
 * The six as three shelves (tempo / converters / fallback).
 * Pack lens dims benched mons.
 */
export function ManualLayerBoard({
  parent,
  packSlugs,
  focusSlug,
  onFocusSlug,
}: {
  parent: TeamManual;
  packSlugs?: string[];
  focusSlug: string | null;
  onFocusSlug: (slug: string) => void;
}) {
  const layers = parent.architecture?.length
    ? parent.architecture
    : defaultLayersFromRoster(parent);
  const bring = new Set((packSlugs ?? parent.core ?? parent.slugs).filter(Boolean));
  const roster = parent.roster ?? parent.slots;
  const bySlug = new Map(roster.map((s) => [s.slug, s]));
  const [peek, setPeek] = useState<string | null>(null);

  if (!layers.length) return null;

  return (
    <ManualSection
      id="six"
      title="The six"
      purpose="Tap a face for its job. Dimmed faces are on the bench for this package."
    >
      <div className="space-y-5">
        {layers.map((layer) => {
          const slugs = (layer.slugs ?? []).filter(Boolean);
          return (
            <div key={layer.title}>
              <div className="mb-2 flex items-baseline justify-between gap-3">
                <h3 className="text-lg font-semibold tracking-tight">{layer.title}</h3>
                {layer.body ? (
                  <p className="hidden max-w-[36ch] text-right text-xs text-muted sm:block">
                    {layer.body}
                  </p>
                ) : null}
              </div>
              <ul className="flex flex-wrap gap-3">
                {slugs.map((slug) => {
                  const mon = getPokemon(slug);
                  if (!mon) return null;
                  const slot = bySlug.get(slug);
                  const inBring = bring.size === 0 || bring.has(slug);
                  const on = focusSlug === slug;
                  const open = peek === slug;
                  return (
                    <li key={slug} className="relative">
                      <button
                        type="button"
                        onClick={() => {
                          onFocusSlug(slug);
                          setPeek((p) => (p === slug ? null : slug));
                        }}
                        className={`flex w-[7.5rem] flex-col items-center rounded-[20px] border px-2 py-3 transition ${
                          on
                            ? "border-ink/50 bg-raised/60"
                            : "border-line/50 bg-raised/20 hover:border-ink/30"
                        } ${inBring ? "" : "opacity-40"}`}
                        style={cssVars(mon.palette)}
                        aria-pressed={on}
                      >
                        <PokemonArt
                          slug={mon.slug}
                          src={mon.sprite || mon.artwork}
                          name={mon.name}
                          size={56}
                        />
                        <p className="mt-2 text-center text-xs font-semibold leading-tight">
                          {mon.name}
                        </p>
                        {slot?.primaryJob ? (
                          <p className="mt-1 line-clamp-2 text-center text-[10px] leading-snug text-muted">
                            {slot.primaryJob}
                          </p>
                        ) : null}
                      </button>
                      {open && slot ? (
                        <JobPeek slot={slot} onClose={() => setPeek(null)} />
                      ) : null}
                    </li>
                  );
                })}
              </ul>
            </div>
          );
        })}
      </div>
    </ManualSection>
  );
}

function JobPeek({ slot, onClose }: { slot: SlotManual; onClose: () => void }) {
  const jobs = slot.networkJobs;
  return (
    <div className="absolute left-0 top-full z-20 mt-2 w-64 rounded-2xl border border-line bg-bg p-3 shadow-lg">
      <p className="text-sm font-semibold">{slot.role || slot.primaryJob}</p>
      {jobs ? (
        <ul className="mt-2 space-y-1 text-xs text-muted">
          {jobs.creates ? <li>Creates · {jobs.creates}</li> : null}
          {jobs.converts ? <li>Converts · {jobs.converts}</li> : null}
          {jobs.protects ? <li>Protects · {jobs.protects}</li> : null}
          {jobs.scales ? <li>Scales · {jobs.scales}</li> : null}
          {jobs.repositions ? <li>Repositions · {jobs.repositions}</li> : null}
        </ul>
      ) : null}
      {slot.gives?.length ? (
        <p className="mt-2 text-xs text-muted">
          If fainted, you still have: {slot.gives.join(", ")}
        </p>
      ) : null}
      <button
        type="button"
        onClick={onClose}
        className="mt-2 text-xs font-medium text-ink underline-offset-2 hover:underline"
      >
        Close
      </button>
    </div>
  );
}

function defaultLayersFromRoster(parent: TeamManual): ManualArchitectureLayer[] {
  const box = (parent.box ?? []).filter(Boolean);
  if (box.length < 3) return [];
  return [
    { title: "Infrastructure", body: "", slugs: box.slice(0, 3) },
    { title: "Converters", body: "", slugs: box.slice(3, 5) },
    { title: "Fallback", body: "", slugs: box.slice(5, 6) },
  ];
}

/** SP as six budget bars — game stat screen feel. */
export function SpBudgetBars({
  sp,
  why,
}: {
  sp: { hp: number; atk: number; def: number; spa: number; spd: number; spe: number };
  why?: string;
}) {
  const stats: { key: keyof typeof sp; label: string }[] = [
    { key: "hp", label: "HP" },
    { key: "atk", label: "Atk" },
    { key: "def", label: "Def" },
    { key: "spa", label: "SpA" },
    { key: "spd", label: "SpD" },
    { key: "spe", label: "Spe" },
  ];
  const used = stats.reduce((a, s) => a + sp[s.key], 0);
  return (
    <div>
      <div className="mb-2 flex items-baseline justify-between">
        <p className="text-sm font-medium">Stat Points</p>
        <p className="font-mono text-xs tabular-nums text-muted">{used} / 66</p>
      </div>
      <ul className="space-y-2">
        {stats.map((s) => {
          const n = sp[s.key];
          const pct = Math.min(100, (n / 32) * 100);
          return (
            <li key={s.key} className="flex items-center gap-3">
              <span className="w-8 shrink-0 font-mono text-[10px] uppercase tracking-wider text-muted">
                {s.label}
              </span>
              <div className="h-2 flex-1 overflow-hidden rounded-full bg-white/8">
                <div
                  className="h-full rounded-full bg-ink/70 transition-[width]"
                  style={{ width: `${pct}%` }}
                />
              </div>
              <span
                className={`w-6 shrink-0 text-right font-mono text-xs tabular-nums ${
                  n ? "font-semibold" : "text-muted/50"
                }`}
              >
                {n || "–"}
              </span>
            </li>
          );
        })}
      </ul>
      {why ? <p className="mt-3 text-sm leading-relaxed text-muted">{why}</p> : null}
    </div>
  );
}

/** Opening asks — one at a time, coach tone. */
export function ManualOpeningCoach({
  asks,
}: {
  asks: { ask: string; then: string }[];
}) {
  const list = asks.filter((a) => a.ask);
  const [i, setI] = useState(0);
  if (!list.length) return null;
  const cur = list[Math.min(i, list.length - 1)]!;
  return (
    <div className="rounded-[20px] border border-line/60 bg-raised/25 p-4">
      <p className="text-sm font-semibold">Ask yourself</p>
      <p className="mt-2 text-base leading-snug">{cur.ask}</p>
      <p className="mt-2 text-sm text-muted">{cur.then}</p>
      {list.length > 1 ? (
        <div className="mt-3 flex items-center gap-2">
          <button
            type="button"
            disabled={i <= 0}
            onClick={() => setI((n) => Math.max(0, n - 1))}
            className="rounded-full border border-line px-3 py-1 text-xs disabled:opacity-40"
          >
            Prev
          </button>
          <span className="font-mono text-[10px] text-muted">
            {i + 1} / {list.length}
          </span>
          <button
            type="button"
            disabled={i >= list.length - 1}
            onClick={() => setI((n) => Math.min(list.length - 1, n + 1))}
            className="rounded-full border border-line px-3 py-1 text-xs disabled:opacity-40"
          >
            Next
          </button>
        </div>
      ) : null}
    </div>
  );
}

/**
 * How it wins — horizontal recipe cards. One open at a time.
 */
export function ManualWinRecipes({
  engines,
  commandments,
  highlightIds,
  expandId,
  onExpand,
}: {
  engines: ManualEngine[];
  commandments?: string[];
  highlightIds?: string[];
  expandId?: string | null;
  onExpand?: (id: string | null) => void;
}) {
  const [localOpen, setLocalOpen] = useState<string | null>(engines[0]?.id ?? null);
  const open = expandId !== undefined ? expandId : localOpen;
  const setOpen = (id: string | null) => {
    if (onExpand) onExpand(id);
    else setLocalOpen(id);
  };
  const hi = new Set(highlightIds ?? []);

  if (!engines.length) return null;

  return (
    <ManualSection
      id="wins"
      title="How it wins"
      purpose="One recipe open at a time. Tapping a network edge lands here."
    >
      <ul className="flex snap-x snap-mandatory gap-3 overflow-x-auto pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {engines.map((engine, i) => {
          const isOpen = open === engine.id;
          const dim = hi.size > 0 && !hi.has(engine.id);
          return (
            <li
              key={engine.id}
              className={`snap-start shrink-0 ${isOpen ? "w-[min(100%,22rem)]" : "w-52"}`}
            >
              <button
                type="button"
                onClick={() => setOpen(isOpen ? null : engine.id)}
                className={`h-full w-full rounded-[22px] border px-4 py-4 text-left transition ${
                  isOpen
                    ? "border-ink/40 bg-raised/50"
                    : "border-line/60 bg-raised/20 hover:border-ink/25"
                } ${dim ? "opacity-40" : ""}`}
              >
                <p className="font-mono text-[11px] tabular-nums text-muted">
                  {String(i + 1).padStart(2, "0")}
                </p>
                <p className="mt-1 text-base font-semibold tracking-tight">{engine.label}</p>
                <p className="mt-2 text-xs leading-snug text-muted">
                  {engine.path.join(" → ")}
                </p>
                {isOpen ? (
                  <div className="mt-3 space-y-2 border-t border-line/50 pt-3">
                    <p className="text-sm leading-relaxed">{engine.how}</p>
                    {engine.dependsOn ? (
                      <p className="text-xs text-muted">Needs · {engine.dependsOn}</p>
                    ) : null}
                    {engine.fallback ? (
                      <p className="text-xs text-muted">If denied · {engine.fallback}</p>
                    ) : null}
                  </div>
                ) : null}
              </button>
            </li>
          );
        })}
      </ul>
      {commandments?.filter(Boolean).length ? (
        <ul className="mt-6 space-y-2 rounded-[20px] border border-dashed border-line/70 bg-raised/15 px-4 py-4">
          <li className="text-sm font-semibold">House rules</li>
          {commandments.filter(Boolean).map((line) => (
            <li key={line} className="text-sm leading-snug text-muted">
              · {line}
            </li>
          ))}
        </ul>
      ) : null}
    </ManualSection>
  );
}

export { ManualNetworkGraph } from "@/components/manuals/ManualNetworkGraph";

/**
 * Packages stage — mantra goal, chevron loops, fork flowchart.
 * Matchup pills switch the pack.
 */
export function ManualPackStage({
  parent,
  packs,
  activeId,
  onSelectPack,
}: {
  parent: TeamManual;
  packs: ManualPack[];
  activeId: string;
  onSelectPack: (id: string) => void;
}) {
  const pack = packs.find((p) => p.id === activeId) ?? packs[0];
  if (!pack) return null;
  const strategy = resolvePackStrategy(pack);
  const scripts = (parent.matchupScripts ?? []).filter((s) => s.foe);
  const alts = flexPool(parent);
  const mega = parent.megaPool;
  const resolved = { ...parent, ...pack, loops: pack.loops?.length ? pack.loops : parent.loops };
  const flows = flowsFor(resolved as TeamManual);
  const loops = (pack.loops ?? []).filter((l) => l.title || l.body);

  return (
    <ManualSection
      id="packages"
      title="Packages"
      purpose="Pick four. The rest of the page dims the bench."
    >
      <ul className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-6">
        {packs.map((p) => {
          const on = p.id === pack.id;
          return (
            <li key={p.id}>
              <button
                type="button"
                onClick={() => onSelectPack(p.id)}
                className={`flex w-full flex-col items-center rounded-[18px] border px-2 py-3 transition ${
                  on
                    ? "border-ink/45 bg-raised/50"
                    : "border-line/50 bg-raised/15 hover:border-ink/25"
                }`}
              >
                <div className="grid grid-cols-2 gap-0.5">
                  {p.slugs.slice(0, 4).map((slug) => {
                    const mon = getPokemon(slug);
                    if (!mon) return <span key={slug} className="h-8 w-8" />;
                    return (
                      <PokemonArt
                        key={slug}
                        slug={mon.slug}
                        src={mon.sprite || mon.artwork}
                        name={mon.name}
                        size={32}
                      />
                    );
                  })}
                </div>
                <p className="mt-2 line-clamp-1 text-center text-[11px] font-semibold">
                  {p.label}
                </p>
              </button>
            </li>
          );
        })}
      </ul>

      {scripts.length ? (
        <div className="mt-4 flex flex-wrap gap-2">
          <span className="self-center text-xs text-muted">Bring this when</span>
          {scripts.map((s: ManualMatchupScript) => (
            <button
              key={s.id}
              type="button"
              onClick={() => onSelectPack(s.packId)}
              className={`rounded-full px-3 py-1.5 text-xs font-medium transition ${
                s.packId === pack.id
                  ? "bg-ink text-bg"
                  : "border border-line text-muted hover:text-ink"
              }`}
            >
              {s.foe}
            </button>
          ))}
        </div>
      ) : null}

      <div className="mt-8 space-y-8">
        <div>
          <p className="text-sm text-muted">{pack.when || strategy.opponentPattern}</p>
          <p className="mt-2 max-w-[40ch] text-2xl font-semibold tracking-tight leading-snug md:text-3xl">
            {strategy.mantra || strategy.purpose || strategy.winCondition}
          </p>
          {strategy.purpose && strategy.mantra ? (
            <p className="mt-2 max-w-[52ch] text-sm text-muted">{strategy.purpose}</p>
          ) : null}
        </div>

        {loops.length ? (
          <div>
            <h3 className="text-lg font-semibold tracking-tight">Loops</h3>
            <div className="mt-3">
              <ManualLoopStrip loops={loops} />
            </div>
          </div>
        ) : null}

        {flows.length ? (
          <div>
            <h3 className="text-lg font-semibold tracking-tight">Flowchart</h3>
            <div className="mt-3 space-y-4">
              {flows.map((flow) => (
                <ManualFlowchart key={flow.id} flow={flow} />
              ))}
            </div>
          </div>
        ) : null}

        {(alts.length > 0 || mega) && (
          <ManualSideboardTray alts={alts} mega={mega} later={parent.ledger?.laterTests} />
        )}
      </div>
    </ManualSection>
  );
}

export function ManualSideboardTray({
  alts,
  mega,
  later,
}: {
  alts: { slug: string; why: string; insteadOf?: string }[];
  mega?: ManualMegaPool;
  later?: { slug: string; change: string; whenToTest: string }[];
}) {
  return (
    <div className="rounded-[20px] border border-dashed border-line/70 px-4 py-4">
      <p className="text-sm font-semibold">Sideboard</p>
      {alts.length ? (
        <ul className="mt-3 flex flex-wrap gap-3">
          {alts.map((alt) => {
            const mon = getPokemon(alt.slug);
            if (!mon) return null;
            return (
              <li key={alt.slug} className="flex max-w-[14rem] items-start gap-2">
                <PokemonArt
                  slug={mon.slug}
                  src={mon.sprite || mon.artwork}
                  name={mon.name}
                  size={36}
                />
                <div>
                  <p className="text-xs font-semibold">{mon.name}</p>
                  <p className="text-[11px] leading-snug text-muted">{alt.why}</p>
                </div>
              </li>
            );
          })}
        </ul>
      ) : null}
      {mega ? (
        <div className="mt-3 text-xs text-muted">
          <p className="font-medium text-ink">Mega ambiguity</p>
          <p className="mt-1">{mega.previewPressure}</p>
          <ul className="mt-1 flex flex-wrap gap-2">
            {mega.candidates.map((c) => (
              <li key={c.slug} className="rounded-full border border-line px-2 py-0.5">
                {getPokemon(c.slug)?.name ?? c.slug} · {c.stone}
              </li>
            ))}
          </ul>
        </div>
      ) : null}
      {later?.length ? (
        <ul className="mt-3 space-y-1 text-[11px] text-muted">
          {later.map((t) => (
            <li key={t.slug}>
              Later · {getPokemon(t.slug)?.name ?? t.slug}: {t.change}
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
