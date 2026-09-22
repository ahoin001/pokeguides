"use client";

import { useMemo, useState } from "react";
import { getPokemon } from "@/lib/catalog/load";
import { cssVars } from "@/lib/champions/palette";
import { PokemonArt } from "@/components/pokemon/PokemonArt";
import { ManualFlowchart } from "@/components/manuals/ManualFlowchart";
import { ManualLoopStrip } from "@/components/manuals/ManualLoopStrip";
import { MANUAL_SCROLL_MT } from "@/components/manuals/ManualToc";
import { flowsFor } from "@/content/classroom-flows";
import {
  flexPool,
  manualFormat,
  packRequiresSwap,
  packsForSlug,
  resolveActiveBox,
  resolvePackStrategy,
  resolveRosterSlot,
  type ManualPack,
  type SlotManual,
  type TeamManual,
} from "@/content/manuals";

/**
 * Compact hero: pick package → skim the six → tap a mon for kit (item / nature / moves).
 * Depth on click; surface stays short.
 */
export function ManualTeamPackageHero({
  parent,
  packs,
  activeId,
  onSelectPack,
  focusSlug,
  onFocusSlug,
}: {
  parent: TeamManual;
  packs: ManualPack[];
  activeId: string;
  onSelectPack: (id: string) => void;
  focusSlug: string | null;
  onFocusSlug: (slug: string) => void;
  layered?: boolean;
}) {
  const pack = packs.find((p) => p.id === activeId) ?? packs[0];
  const box = resolveActiveBox(parent, activeId || undefined);
  const bring = new Set((pack?.slugs ?? parent.slugs).filter(Boolean));
  const swap = pack && packRequiresSwap(pack) ? pack.requiresSwap : null;
  const alts = flexPool(parent);
  const doubles = manualFormat(parent) === "doubles";
  const bringN = doubles ? 4 : 3;

  const [packAsk, setPackAsk] = useState<{ slug: string; packIds: string[] } | null>(null);
  const [kitOpen, setKitOpen] = useState(true);
  const [playbookOpen, setPlaybookOpen] = useState(false);
  const [moveWhy, setMoveWhy] = useState<string | null>(null);

  const strategy = pack ? resolvePackStrategy(pack) : null;
  const scripts = (parent.matchupScripts ?? []).filter((s) => s.foe);
  const resolved = pack
    ? { ...parent, ...pack, loops: pack.loops?.length ? pack.loops : parent.loops }
    : parent;
  const flows = pack ? flowsFor(resolved as TeamManual) : [];
  const loops = (pack?.loops ?? []).filter((l) => l.title || l.body);

  const focus = focusSlug && (box.includes(focusSlug) || alts.some((a) => a.slug === focusSlug))
    ? focusSlug
    : (pack?.slugs[0] ?? box[0] ?? null);

  const kitSlot = useMemo(() => {
    if (!focus) return null;
    const wincon = strategy?.winconMode ?? pack?.winconMode ?? null;
    return resolveRosterSlot(parent, focus, wincon);
  }, [focus, parent, pack, strategy]);

  function selectMon(slug: string) {
    const same = focusSlug === slug;
    onFocusSlug(slug);
    setKitOpen(true);
    setMoveWhy(null);

    if (bring.has(slug)) {
      setPackAsk(null);
      return;
    }
    if (same) return;

    const hits = packsForSlug(packs, slug);
    if (hits.length === 1) {
      onSelectPack(hits[0].id);
      setPackAsk(null);
    } else if (hits.length > 1) {
      setPackAsk({ slug, packIds: hits.map((h) => h.id) });
    } else {
      setPackAsk(null);
    }
  }

  function pickAlt(slug: string) {
    onFocusSlug(slug);
    setKitOpen(true);
    setMoveWhy(null);
    const unlocked = packs.filter((p) => packRequiresSwap(p) && p.requiresSwap.in === slug);
    if (unlocked.length === 1) {
      onSelectPack(unlocked[0].id);
      setPackAsk(null);
    } else if (unlocked.length > 1) {
      setPackAsk({ slug, packIds: unlocked.map((p) => p.id) });
    } else {
      setPackAsk(null);
    }
  }

  if (!box.length || !packs.length) return null;

  const archLabel = parent.coreArchitecture?.identity;

  return (
    <section
      id="team"
      className={`${MANUAL_SCROLL_MT} relative mt-6 overflow-hidden rounded-[24px] border border-line/70 bg-[linear-gradient(165deg,color-mix(in_srgb,var(--mon-wash,transparent)_14%,transparent),transparent_48%),var(--bg)] md:mt-8`}
    >
      {/* Pack rail */}
      <div className="border-b border-line/50 px-4 py-3 md:px-5">
        <div className="flex items-center justify-between gap-3">
          <p className="shrink-0 font-mono text-[10px] font-semibold uppercase tracking-[0.14em] text-muted">
            Package
          </p>
          {archLabel ? (
            <p className="truncate text-[11px] text-muted">{archLabel}</p>
          ) : null}
        </div>
        <ul className="mt-2 flex gap-1.5 overflow-x-auto pb-0.5 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {packs.map((p) => {
            const on = p.id === pack?.id;
            const swapReq = packRequiresSwap(p);
            return (
              <li key={p.id} className="shrink-0">
                <button
                  type="button"
                  onClick={() => onSelectPack(p.id)}
                  className={`inline-flex items-center gap-2 rounded-full border py-1.5 pl-1.5 pr-3 text-left transition ${
                    on
                      ? "border-ink/40 bg-ink text-bg"
                      : "border-line/60 bg-raised/30 text-ink hover:border-ink/30"
                  }`}
                  aria-pressed={on}
                >
                  <span className="flex -space-x-1.5">
                    {p.slugs.slice(0, bringN).map((slug) => {
                      const mon = getPokemon(slug);
                      if (!mon) return null;
                      return (
                        <span
                          key={slug}
                          className="relative rounded-full ring-1 ring-bg"
                          style={cssVars(mon.palette)}
                        >
                          <PokemonArt
                            slug={mon.slug}
                            src={mon.sprite || mon.artwork}
                            name={mon.name}
                            size={22}
                          />
                        </span>
                      );
                    })}
                  </span>
                  <span className="text-xs font-semibold">{p.label}</span>
                  {swapReq ? (
                    <span
                      className={`rounded-full px-1.5 py-0.5 font-mono text-[8px] uppercase tracking-wide ${
                        on ? "bg-bg/20 text-bg" : "bg-amber-500/15 text-amber-200/90"
                      }`}
                    >
                      Swap
                    </span>
                  ) : null}
                </button>
              </li>
            );
          })}
        </ul>
        {scripts.length ? (
          <div className="mt-2 flex flex-wrap gap-1">
            {scripts.map((s) => (
              <button
                key={s.id}
                type="button"
                onClick={() => onSelectPack(s.packId)}
                className={`rounded-full px-2 py-0.5 text-[10px] font-medium transition ${
                  s.packId === pack?.id
                    ? "bg-white/12 text-ink"
                    : "text-muted hover:text-ink"
                }`}
              >
                vs {s.foe}
              </button>
            ))}
          </div>
        ) : null}
      </div>

      {/* Six + bring strip */}
      <div className="px-4 py-3 md:px-5">
        {swap ? (
          <p className="mb-2 text-[11px] text-muted">
            Swap{" "}
            <span className="font-medium text-ink">{getPokemon(swap.out)?.name ?? swap.out}</span>
            {" → "}
            <span className="font-medium text-ink">{getPokemon(swap.in)?.name ?? swap.in}</span>
          </p>
        ) : null}

        <ul className="grid grid-cols-6 gap-1.5 sm:gap-2">
          {box.map((slug) => {
            const mon = getPokemon(slug);
            if (!mon) return null;
            const on = focus === slug;
            const inBring = bring.has(slug);
            return (
              <li key={slug}>
                <button
                  type="button"
                  onClick={() => selectMon(slug)}
                  className={`flex w-full flex-col items-center rounded-2xl border px-0.5 py-1.5 transition ${
                    on
                      ? "border-ink/45 bg-raised/60"
                      : inBring
                        ? "border-ink/20 bg-raised/35"
                        : "border-transparent opacity-40 hover:opacity-70"
                  }`}
                  style={cssVars(mon.palette)}
                  aria-pressed={on}
                >
                  <PokemonArt
                    slug={mon.slug}
                    src={mon.sprite || mon.artwork}
                    name={mon.name}
                    size={44}
                  />
                  <span className="mt-0.5 line-clamp-1 text-center text-[9px] font-medium leading-tight sm:text-[10px]">
                    {mon.name}
                  </span>
                </button>
              </li>
            );
          })}
        </ul>

        {alts.length ? (
          <ul className="mt-2 flex flex-wrap gap-1.5">
            {alts.map((alt) => {
              const mon = getPokemon(alt.slug);
              if (!mon) return null;
              const active = swap?.in === alt.slug;
              const on = focus === alt.slug;
              return (
                <li key={alt.slug}>
                  <button
                    type="button"
                    onClick={() => pickAlt(alt.slug)}
                    className={`inline-flex items-center gap-1.5 rounded-full border py-1 pl-1 pr-2.5 text-[11px] transition ${
                      on || active
                        ? "border-amber-400/40 bg-amber-500/10"
                        : "border-line/50 bg-raised/20 hover:border-ink/25"
                    }`}
                    style={cssVars(mon.palette)}
                  >
                    <PokemonArt
                      slug={mon.slug}
                      src={mon.sprite || mon.artwork}
                      name={mon.name}
                      size={22}
                    />
                    <span className="font-medium">{mon.name}</span>
                    {alt.module?.identity ? (
                      <span className="hidden text-muted sm:inline">· {alt.module.identity}</span>
                    ) : null}
                  </button>
                </li>
              );
            })}
          </ul>
        ) : null}

        {packAsk ? (
          <div className="mt-2 rounded-xl border border-line/70 bg-bg/50 px-3 py-2">
            <p className="text-[11px] text-muted">
              {getPokemon(packAsk.slug)?.name} is in multiple packages:
            </p>
            <ul className="mt-1.5 flex flex-wrap gap-1.5">
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
                      className="rounded-full border border-line px-2.5 py-1 text-xs hover:border-ink/35"
                    >
                      {p.label}
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        ) : null}

        {pack && strategy ? (
          <p className="mt-3 text-sm font-medium leading-snug tracking-tight text-ink">
            {strategy.mantra || strategy.purpose || strategy.winCondition}
            {pack.when ? (
              <span className="mt-0.5 block text-[11px] font-normal text-muted">{pack.when}</span>
            ) : null}
          </p>
        ) : null}
      </div>

      {/* Kit reveal */}
      {kitSlot && focus ? (
        <KitSheet
          slot={kitSlot}
          open={kitOpen}
          onToggle={() => setKitOpen((o) => !o)}
          moveWhy={moveWhy}
          onMoveWhy={setMoveWhy}
        />
      ) : null}

      {/* Playbook — collapsed by default */}
      {(loops.length > 0 || flows.length > 0) && pack ? (
        <div className="border-t border-line/50">
          <button
            type="button"
            onClick={() => setPlaybookOpen((o) => !o)}
            className="flex w-full items-center justify-between px-4 py-2.5 text-left md:px-5"
          >
            <span className="font-mono text-[10px] font-semibold uppercase tracking-[0.14em] text-muted">
              Playbook · {pack.label}
            </span>
            <span className="text-xs text-muted">{playbookOpen ? "Hide" : "Show"}</span>
          </button>
          {playbookOpen ? (
            <div className="space-y-5 border-t border-line/40 px-4 pb-4 pt-3 md:px-5">
              {loops.length ? <ManualLoopStrip loops={loops} /> : null}
              {flows.length
                ? flows.map((flow) => <ManualFlowchart key={flow.id} flow={flow} />)
                : null}
            </div>
          ) : null}
        </div>
      ) : null}
    </section>
  );
}

function KitSheet({
  slot,
  open,
  onToggle,
  moveWhy,
  onMoveWhy,
}: {
  slot: SlotManual;
  open: boolean;
  onToggle: () => void;
  moveWhy: string | null;
  onMoveWhy: (name: string | null) => void;
}) {
  const mon = slot.slug ? getPokemon(slot.slug) : undefined;
  if (!mon) return null;
  const sp = slot.training?.sp;
  const moves = slot.moves.filter((m) => m.name);

  return (
    <div className="border-t border-line/50" style={cssVars(mon.palette)}>
      <button
        type="button"
        onClick={onToggle}
        className="flex w-full items-center gap-3 px-4 py-2.5 text-left md:px-5"
      >
        <PokemonArt slug={mon.slug} src={mon.sprite || mon.artwork} name={mon.name} size={36} />
        <span className="min-w-0 flex-1">
          <span className="block text-sm font-semibold tracking-tight">
            {mon.name}
            {slot.item ? <span className="font-normal text-muted"> @ {slot.item}</span> : null}
          </span>
          <span className="mt-0.5 block text-[11px] text-muted">
            {[slot.ability, slot.nature].filter(Boolean).join(" · ") || "Tap for kit"}
            {sp ? ` · ${spSpend(sp)}` : ""}
          </span>
        </span>
        <span className="shrink-0 text-xs text-muted">{open ? "Less" : "Kit"}</span>
      </button>

      {open ? (
        <div className="border-t border-line/40 px-4 pb-4 pt-3 md:px-5">
          <dl className="grid grid-cols-3 gap-2 text-center sm:text-left">
            <KitMeta label="Item" value={slot.item} />
            <KitMeta label="Ability" value={slot.ability} />
            <KitMeta label="Nature" value={slot.nature} />
          </dl>

          {sp ? (
            <div className="mt-3 flex flex-wrap gap-1">
              {(
                [
                  ["HP", sp.hp],
                  ["Atk", sp.atk],
                  ["Def", sp.def],
                  ["SpA", sp.spa],
                  ["SpD", sp.spd],
                  ["Spe", sp.spe],
                ] as const
              )
                .filter(([, n]) => n > 0)
                .map(([label, n]) => (
                  <span
                    key={label}
                    className="rounded-md border border-line/60 bg-raised/40 px-2 py-0.5 font-mono text-[10px] tabular-nums text-ink"
                  >
                    {label} {n}
                  </span>
                ))}
            </div>
          ) : null}

          {slot.primaryJob || slot.role ? (
            <p className="mt-2 text-[11px] leading-snug text-muted">
              {slot.primaryJob || slot.role}
            </p>
          ) : null}

          <ul className="mt-3 grid gap-1 sm:grid-cols-2">
            {moves.map((move) => {
              const whyOn = moveWhy === move.name;
              return (
                <li key={move.name}>
                  <button
                    type="button"
                    onClick={() => onMoveWhy(whyOn ? null : move.name)}
                    className={`flex w-full flex-col rounded-xl border px-2.5 py-2 text-left transition ${
                      whyOn
                        ? "border-ink/35 bg-raised/50"
                        : "border-line/50 bg-raised/20 hover:border-ink/25"
                    }`}
                  >
                    <span className="text-xs font-semibold">{move.name}</span>
                    {whyOn && move.why ? (
                      <span className="mt-1 text-[11px] leading-snug text-muted">{move.why}</span>
                    ) : move.why ? (
                      <span className="mt-0.5 text-[10px] text-muted">Why?</span>
                    ) : null}
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      ) : null}
    </div>
  );
}

function KitMeta({ label, value }: { label: string; value?: string }) {
  return (
    <div className="rounded-xl border border-line/50 bg-raised/25 px-2 py-2">
      <dt className="font-mono text-[9px] uppercase tracking-wider text-muted">{label}</dt>
      <dd className="mt-0.5 truncate text-xs font-medium">{value || "—"}</dd>
    </div>
  );
}

function spSpend(sp: {
  hp: number;
  atk: number;
  def: number;
  spa: number;
  spd: number;
  spe: number;
}) {
  const bits = (
    [
      ["HP", sp.hp],
      ["Atk", sp.atk],
      ["Def", sp.def],
      ["SpA", sp.spa],
      ["SpD", sp.spd],
      ["Spe", sp.spe],
    ] as const
  )
    .filter(([, n]) => n > 0)
    .map(([k, n]) => `${n} ${k}`);
  return bits.slice(0, 3).join(" / ");
}
