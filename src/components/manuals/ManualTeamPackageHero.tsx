"use client";

import { useMemo, useState } from "react";
import { getPokemon } from "@/lib/catalog/load";
import { cssVars } from "@/lib/champions/palette";
import { PokemonArt } from "@/components/pokemon/PokemonArt";
import { ManualFlowchart } from "@/components/manuals/ManualFlowchart";
import { ManualLoopStrip } from "@/components/manuals/ManualLoopStrip";
import { ManualSideboardTray } from "@/components/manuals/ManualApproachableChapters";
import { PackFourArts, PackThreeArts } from "@/components/manuals/ManualPackagePicker";
import { MANUAL_SCROLL_MT } from "@/components/manuals/ManualToc";
import { flowsFor } from "@/content/classroom-flows";
import {
  flexPool,
  manualFormat,
  packRequiresSwap,
  packsForSlug,
  resolveActiveBox,
  resolvePackStrategy,
  type ManualArchitectureLayer,
  type ManualMatchupScript,
  type ManualPack,
  type SlotManual,
  type TeamManual,
} from "@/content/manuals";
import { formatBringLabel } from "@/lib/format";

function defaultLayersFromRoster(parent: TeamManual): ManualArchitectureLayer[] {
  const box = (parent.box ?? []).filter(Boolean);
  if (box.length < 3) return [];
  return [
    { title: "Infrastructure", body: "", slugs: box.slice(0, 3) },
    { title: "Converters", body: "", slugs: box.slice(3, 5) },
    { title: "Fallback", body: "", slugs: box.slice(5, 6) },
  ];
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

/**
 * Hero: registered six + package picker + active bring in one surface.
 */
export function ManualTeamPackageHero({
  parent,
  packs,
  activeId,
  onSelectPack,
  focusSlug,
  onFocusSlug,
  layered = false,
}: {
  parent: TeamManual;
  packs: ManualPack[];
  activeId: string;
  onSelectPack: (id: string) => void;
  focusSlug: string | null;
  onFocusSlug: (slug: string) => void;
  /** Use architecture shelves instead of a flat six grid. */
  layered?: boolean;
}) {
  const pack = packs.find((p) => p.id === activeId) ?? packs[0];
  const box = resolveActiveBox(parent, activeId || undefined);
  const bring = new Set((pack?.slugs ?? parent.slugs).filter(Boolean));
  const swap = pack && packRequiresSwap(pack) ? pack.requiresSwap : null;
  const alts = flexPool(parent);
  const format = manualFormat(parent);
  const doubles = format === "doubles";
  const bringN = doubles ? 4 : 3;

  const [packAsk, setPackAsk] = useState<{ slug: string; packIds: string[] } | null>(null);
  const [peek, setPeek] = useState<string | null>(null);

  const roster = parent.roster ?? parent.slots;
  const bySlug = useMemo(() => new Map(roster.map((s) => [s.slug, s])), [roster]);
  const layers = parent.architecture?.length
    ? parent.architecture
    : layered
      ? defaultLayersFromRoster(parent)
      : [];

  const strategy = pack ? resolvePackStrategy(pack) : null;
  const scripts = (parent.matchupScripts ?? []).filter((s) => s.foe);
  const resolved = pack
    ? { ...parent, ...pack, loops: pack.loops?.length ? pack.loops : parent.loops }
    : parent;
  const flows = pack ? flowsFor(resolved as TeamManual) : [];
  const loops = (pack?.loops ?? []).filter((l) => l.title || l.body);

  function pickMon(slug: string) {
    onFocusSlug(slug);
    if (bring.has(slug)) {
      setPackAsk(null);
      document.getElementById("sets")?.scrollIntoView({ behavior: "smooth" });
      return;
    }
    const hits = packsForSlug(packs, slug);
    if (hits.length === 1) {
      onSelectPack(hits[0].id);
      setPackAsk(null);
      return;
    }
    if (hits.length > 1) setPackAsk({ slug, packIds: hits.map((h) => h.id) });
    else setPackAsk(null);
  }

  function pickAlt(slug: string) {
    onFocusSlug(slug);
    const unlocked = packs.filter((p) => packRequiresSwap(p) && p.requiresSwap.in === slug);
    if (unlocked.length === 1) {
      onSelectPack(unlocked[0].id);
      setPackAsk(null);
      return;
    }
    if (unlocked.length > 1) setPackAsk({ slug, packIds: unlocked.map((p) => p.id) });
    else setPackAsk(null);
  }

  if (!box.length || !packs.length) return null;

  return (
    <section
      id="team"
      className={`${MANUAL_SCROLL_MT} relative mt-8 overflow-hidden rounded-[28px] border border-line/70 bg-[linear-gradient(165deg,color-mix(in_srgb,var(--mon-wash,transparent)_18%,transparent),transparent_42%),var(--bg)] shadow-[var(--shadow)] md:mt-10 md:rounded-[32px]`}
    >
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />

      <div className="border-b border-line/50 px-5 py-5 md:px-8 md:py-6">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.16em] text-muted">
              {formatBringLabel(format)}
            </p>
            <h2 className="mt-1 text-2xl font-semibold tracking-tight md:text-3xl">
              Team &amp; packages
            </h2>
            <p className="mt-2 max-w-[48ch] text-sm text-muted">
              Pick a package to set your bring. Tap any Pokémon to jump to its set — bench faces
              dim until they&apos;re part of the active four.
            </p>
          </div>
          {parent.coreArchitecture?.identity ? (
            <p className="max-w-[20ch] text-right text-xs font-medium leading-snug text-muted md:text-sm">
              <span className="text-ink">{parent.coreArchitecture.identity}</span>
            </p>
          ) : null}
        </div>
      </div>

      <div className="grid gap-0 lg:grid-cols-[minmax(0,1.15fr)_minmax(16rem,0.85fr)] lg:divide-x lg:divide-line/50">
        {/* Registered six */}
        <div className="px-5 py-6 md:px-8">
          {swap ? (
            <p className="mb-4 text-sm text-muted">
              Active swap{" "}
              <span className="font-medium text-ink">
                {getPokemon(swap.out)?.name ?? swap.out}
              </span>
              {" → "}
              <span className="font-medium text-ink">{getPokemon(swap.in)?.name ?? swap.in}</span>
            </p>
          ) : null}

          {layered && layers.length ? (
            <div className="space-y-5">
              {layers.map((layer) => {
                const slugs = (layer.slugs ?? []).filter(Boolean);
                return (
                  <div key={layer.title}>
                    <div className="mb-2 flex items-baseline justify-between gap-3">
                      <h3 className="text-sm font-semibold tracking-tight">{layer.title}</h3>
                      {layer.body ? (
                        <p className="hidden max-w-[32ch] text-right text-[11px] text-muted sm:block">
                          {layer.body}
                        </p>
                      ) : null}
                    </div>
                    <ul className="flex flex-wrap gap-2.5">
                      {slugs.map((slug) => (
                        <SixTile
                          key={slug}
                          slug={slug}
                          slot={bySlug.get(slug)}
                          inBring={bring.has(slug)}
                          focused={focusSlug === slug}
                          peek={peek === slug}
                          onToggle={() => {
                            pickMon(slug);
                            setPeek((p) => (p === slug ? null : slug));
                          }}
                          onClosePeek={() => setPeek(null)}
                          compact
                        />
                      ))}
                    </ul>
                  </div>
                );
              })}
            </div>
          ) : (
            <ul className="grid grid-cols-3 gap-2 sm:grid-cols-6 sm:gap-3">
              {box.map((slug) => (
                <SixTile
                  key={slug}
                  slug={slug}
                  slot={bySlug.get(slug)}
                  inBring={bring.has(slug)}
                  focused={focusSlug === slug}
                  isFlexIn={swap?.in === slug}
                  onToggle={() => pickMon(slug)}
                />
              ))}
            </ul>
          )}

          {alts.length ? (
            <div className="mt-6 border-t border-line/40 pt-5">
              <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.14em] text-muted">
                Bench modules
              </p>
              <ul className="mt-3 grid gap-2 sm:grid-cols-2">
                {alts.map((alt) => {
                  const mon = getPokemon(alt.slug);
                  const instead = alt.insteadOf ? getPokemon(alt.insteadOf) : undefined;
                  const active = swap?.in === alt.slug;
                  if (!mon) return null;
                  return (
                    <li key={alt.slug}>
                      <button
                        type="button"
                        onClick={() => pickAlt(alt.slug)}
                        className={`flex w-full items-start gap-3 rounded-2xl border px-3 py-2.5 text-left transition ${
                          active || focusSlug === alt.slug
                            ? "border-amber-400/45 bg-amber-500/10"
                            : "border-line/60 bg-raised/25 hover:border-ink/25"
                        }`}
                        style={cssVars(mon.palette)}
                      >
                        <PokemonArt
                          slug={mon.slug}
                          src={mon.sprite || mon.artwork}
                          name={mon.name}
                          size={40}
                        />
                        <span className="min-w-0">
                          <span className="block text-sm font-medium">{mon.name}</span>
                          {instead ? (
                            <span className="text-[11px] text-muted">↔ {instead.name}</span>
                          ) : null}
                          {alt.module?.identity ? (
                            <span className="mt-0.5 block text-[10px] text-muted">
                              {alt.module.identity}
                            </span>
                          ) : null}
                        </span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
          ) : null}

          {packAsk ? (
            <div className="mt-4 rounded-2xl border border-line bg-bg/60 p-3">
              <p className="text-sm text-muted">
                {getPokemon(packAsk.slug)?.name} appears in multiple packages — pick one:
              </p>
              <ul className="mt-2 flex flex-wrap gap-2">
                {packAsk.packIds.map((id) => {
                  const p = packs.find((x) => x.id === id);
                  if (!p) return null;
                  return (
                    <li key={id}>
                      <button
                        type="button"
                        onClick={() => {
                          onSelectPack(id);
                          setPackAsk(null);
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

        {/* Package rail + active bring */}
        <div className="bg-raised/20 px-5 py-6 md:px-6 lg:min-h-[20rem]">
          <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.14em] text-muted">
            Packages
          </p>
          <ul className="mt-3 max-h-[14rem] space-y-1.5 overflow-y-auto pr-1 [-ms-overflow-style:none] [scrollbar-width:thin] lg:max-h-[18rem]">
            {packs.map((p) => {
              const on = p.id === pack?.id;
              const swapReq = packRequiresSwap(p) ? p.requiresSwap : null;
              return (
                <li key={p.id}>
                  <button
                    type="button"
                    onClick={() => onSelectPack(p.id)}
                    className={`flex w-full items-center gap-3 rounded-2xl border px-3 py-2.5 text-left transition ${
                      on
                        ? "border-ink/40 bg-[color-mix(in_srgb,var(--mon-wash)_25%,transparent)] shadow-sm"
                        : "border-transparent hover:border-line/70 hover:bg-raised/40"
                    }`}
                    aria-pressed={on}
                  >
                    <span className="shrink-0 opacity-90">
                      {doubles ? (
                        <PackFourArts slugs={p.slugs} size={36} />
                      ) : (
                        <PackThreeArts slugs={p.slugs} size={36} />
                      )}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block text-sm font-semibold leading-tight">{p.label}</span>
                      {p.when ? (
                        <span className="mt-0.5 line-clamp-2 text-[11px] leading-snug text-muted">
                          {p.when}
                        </span>
                      ) : null}
                      {swapReq ? (
                        <span className="mt-1 inline-block rounded-full bg-amber-500/15 px-2 py-0.5 font-mono text-[9px] uppercase tracking-wide text-amber-200/90">
                          Swap
                        </span>
                      ) : null}
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>

          {pack && strategy ? (
            <div className="mt-6 border-t border-line/50 pt-5">
              <p className="text-[11px] font-medium uppercase tracking-wide text-muted">
                Active bring
              </p>
              <ul className="mt-3 flex justify-between gap-1 sm:gap-2">
                {pack.slugs.slice(0, bringN).map((slug) => {
                  const mon = getPokemon(slug);
                  if (!mon) return null;
                  const on = focusSlug === slug;
                  return (
                    <li key={slug} className="flex-1">
                      <button
                        type="button"
                        onClick={() => pickMon(slug)}
                        className={`flex w-full flex-col items-center rounded-2xl border px-1 py-2 transition ${
                          on
                            ? "border-[var(--format-doubles-accent,var(--ink))]/50 bg-raised/50 ring-2 ring-[var(--format-doubles-accent,var(--ink))]/25"
                            : "border-line/50 bg-bg/40 hover:border-ink/30"
                        }`}
                        style={cssVars(mon.palette)}
                      >
                        <PokemonArt
                          slug={mon.slug}
                          src={mon.artwork || mon.sprite}
                          name={mon.name}
                          size={doubles ? 64 : 72}
                        />
                        <span className="mt-1 line-clamp-1 text-center text-[10px] font-medium sm:text-xs">
                          {mon.name}
                        </span>
                      </button>
                    </li>
                  );
                })}
              </ul>

              {scripts.length ? (
                <div className="mt-4 flex flex-wrap gap-1.5">
                  {scripts.map((s: ManualMatchupScript) => (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => onSelectPack(s.packId)}
                      className={`rounded-full px-2.5 py-1 text-[10px] font-medium transition ${
                        s.packId === pack.id
                          ? "bg-ink text-bg"
                          : "border border-line/70 text-muted hover:text-ink"
                      }`}
                    >
                      vs {s.foe}
                    </button>
                  ))}
                </div>
              ) : null}

              <p className="mt-4 text-xs text-muted">{pack.when || strategy.opponentPattern}</p>
              <p className="mt-2 text-lg font-semibold leading-snug tracking-tight md:text-xl">
                {strategy.mantra || strategy.purpose || strategy.winCondition}
              </p>
              {strategy.purpose && strategy.mantra ? (
                <p className="mt-2 text-xs leading-relaxed text-muted">{strategy.purpose}</p>
              ) : null}
              {pack.pilotDecision?.previewQuestion ? (
                <p className="mt-3 rounded-xl border border-line/60 bg-bg/50 px-3 py-2 text-xs text-ink">
                  {pack.pilotDecision.previewQuestion}
                </p>
              ) : null}
            </div>
          ) : null}
        </div>
      </div>

      {(loops.length > 0 || flows.length > 0 || alts.length > 0 || parent.megaPool) && pack ? (
        <div id="playbook" className="border-t border-line/50 px-5 py-6 md:px-8 md:py-8">
          <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.14em] text-muted">
            Playbook · {pack.label}
          </p>
          <div className="mt-5 space-y-8">
            {loops.length ? (
              <div>
                <h3 className="text-base font-semibold tracking-tight">Recipes you repeat</h3>
                <div className="mt-3">
                  <ManualLoopStrip loops={loops} />
                </div>
              </div>
            ) : null}
            {flows.length ? (
              <div>
                <h3 className="text-base font-semibold tracking-tight">Decision forks</h3>
                <div className="mt-3 space-y-4">
                  {flows.map((flow) => (
                    <ManualFlowchart key={flow.id} flow={flow} />
                  ))}
                </div>
              </div>
            ) : null}
            {(alts.length > 0 || parent.megaPool) && (
              <ManualSideboardTray
                alts={alts}
                mega={parent.megaPool}
                later={parent.ledger?.laterTests}
              />
            )}
          </div>
        </div>
      ) : null}
    </section>
  );
}

function SixTile({
  slug,
  slot,
  inBring,
  focused,
  peek,
  onToggle,
  onClosePeek,
  compact,
  isFlexIn,
}: {
  slug: string;
  slot?: SlotManual;
  inBring: boolean;
  focused: boolean;
  peek?: boolean;
  onToggle: () => void;
  onClosePeek?: () => void;
  compact?: boolean;
  isFlexIn?: boolean;
}) {
  const mon = getPokemon(slug);
  if (!mon) return null;
  const size = compact ? 52 : 80;
  return (
    <li className="relative list-none">
      <button
        type="button"
        onClick={onToggle}
        className={`flex flex-col items-center rounded-[20px] border px-2 py-2.5 transition sm:px-3 sm:py-3 ${
          focused
            ? "border-ink/45 bg-raised/60"
            : inBring
              ? "border-ink/20 bg-raised/40"
              : "border-line/50 bg-raised/15 opacity-45 hover:opacity-70"
        } ${compact ? "w-[6.75rem]" : "w-full"}`}
        style={cssVars(mon.palette)}
        aria-pressed={focused}
      >
        <PokemonArt slug={mon.slug} src={mon.artwork || mon.sprite} name={mon.name} size={size} />
        <p className="mt-1.5 text-center text-xs font-medium leading-tight">{mon.name}</p>
        {!compact ? (
          <span className="mt-1 font-mono text-[9px] uppercase tracking-wider text-muted">
            {isFlexIn ? "Flex in" : inBring ? "Bring" : "Box"}
          </span>
        ) : slot?.primaryJob ? (
          <p className="mt-1 line-clamp-2 text-center text-[9px] leading-snug text-muted">
            {slot.primaryJob}
          </p>
        ) : null}
      </button>
      {peek && slot && onClosePeek ? <JobPeek slot={slot} onClose={onClosePeek} /> : null}
    </li>
  );
}
