"use client";

import { useMemo, useState } from "react";
import { getPokemon } from "@/lib/catalog/load";
import { cssVars } from "@/lib/champions/palette";
import { PokemonArt } from "@/components/pokemon/PokemonArt";
import { ManualFlowchart } from "@/components/manuals/ManualFlowchart";
import { ManualLoopStrip } from "@/components/manuals/ManualLoopStrip";
import { PackFourArts, PackThreeArts } from "@/components/manuals/ManualPackagePicker";
import { MANUAL_SCROLL_MT } from "@/components/manuals/ManualToc";
import { flowsFor } from "@/content/classroom-flows";
import {
  defaultPackId,
  flexPool,
  manualFormat,
  packRequiresSwap,
  resolveActiveBox,
  resolvePackStrategy,
  resolveRosterSlot,
  type ManualAltSlot,
  type ManualPack,
  type SlotManual,
  type TeamManual,
} from "@/content/manuals";
import { formatBringLabel } from "@/lib/format";

/**
 * Hero for tournament reality:
 * 1. Registered six (what you submit)
 * 2. Packages of 4/3 from THAT six (when to bring)
 * 3. Bench swap cards (why change registration) → then packages for the swapped six
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
}) {
  const pack = packs.find((p) => p.id === activeId) ?? packs[0];
  const swap = pack && packRequiresSwap(pack) ? pack.requiresSwap : null;
  const box = resolveActiveBox(parent, activeId || undefined);
  const registeredBox = (parent.box ?? []).filter(Boolean);
  const bring = new Set((pack?.slugs ?? parent.slugs).filter(Boolean));
  const alts = flexPool(parent);
  const doubles = manualFormat(parent) === "doubles";
  const bringN = doubles ? 4 : 3;

  const corePacks = useMemo(() => packs.filter((p) => !packRequiresSwap(p)), [packs]);
  const visiblePacks = useMemo(() => {
    if (!swap) return corePacks;
    return packs.filter(
      (p) => packRequiresSwap(p) && p.requiresSwap.out === swap.out && p.requiresSwap.in === swap.in,
    );
  }, [packs, corePacks, swap]);

  const [kitOpen, setKitOpen] = useState(true);
  const [playbookOpen, setPlaybookOpen] = useState(false);

  const strategy = pack ? resolvePackStrategy(pack) : null;
  const scripts = (parent.matchupScripts ?? []).filter(
    (s) => s.foe && visiblePacks.some((p) => p.id === s.packId),
  );
  const resolved = pack
    ? { ...parent, ...pack, loops: pack.loops?.length ? pack.loops : parent.loops }
    : parent;
  const flows = pack ? flowsFor(resolved as TeamManual) : [];
  const loops = (pack?.loops ?? []).filter((l) => l.title || l.body);

  const focus =
    focusSlug && (box.includes(focusSlug) || alts.some((a) => a.slug === focusSlug))
      ? focusSlug
      : (pack?.slugs[0] ?? box[0] ?? null);

  const kitSlot = useMemo(() => {
    if (!focus) return null;
    const wincon = strategy?.winconMode ?? pack?.winconMode ?? null;
    return resolveRosterSlot(parent, focus, wincon);
  }, [focus, parent, pack, strategy]);

  function selectMon(slug: string) {
    onFocusSlug(slug);
    setKitOpen(true);
  }

  function activateSwap(alt: ManualAltSlot) {
    onFocusSlug(alt.slug);
    setKitOpen(true);
    const unlocked = packs.filter(
      (p) => packRequiresSwap(p) && p.requiresSwap.in === alt.slug && p.requiresSwap.out === alt.insteadOf,
    );
    const first = unlocked[0];
    if (first) onSelectPack(first.id);
  }

  function backToRegistered() {
    const home = defaultPackId(parent) ?? corePacks[0]?.id;
    if (home) onSelectPack(home);
    const first = registeredBox[0];
    if (first) onFocusSlug(first);
  }

  if (!registeredBox.length || !packs.length) return null;

  const archLabel = parent.coreArchitecture?.identity;

  return (
    <section
      id="team"
      className={`${MANUAL_SCROLL_MT} relative mt-6 overflow-hidden rounded-[24px] border border-line/70 bg-[linear-gradient(165deg,color-mix(in_srgb,var(--mon-wash,transparent)_14%,transparent),transparent_48%),var(--bg)] md:mt-8`}
    >
      {/* Registered / active six */}
      <div className="border-b border-line/50 px-4 py-4 md:px-5">
        <div className="flex flex-wrap items-end justify-between gap-2">
          <div>
            <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.14em] text-muted">
              {swap ? "Active six (swapped)" : "Registered six"}
            </p>
            <h2 className="mt-0.5 text-lg font-semibold tracking-tight md:text-xl">
              {swap
                ? `${getPokemon(swap.in)?.name ?? swap.in} in for ${getPokemon(swap.out)?.name ?? swap.out}`
                : archLabel || "Tournament / matchmaking box"}
            </h2>
          </div>
          <p className="text-[11px] text-muted">{formatBringLabel(manualFormat(parent))}</p>
        </div>

        {swap ? (
          <button
            type="button"
            onClick={backToRegistered}
            className="mt-2 text-xs font-medium text-ink underline-offset-2 hover:underline"
          >
            ← Back to registered six
          </button>
        ) : null}

        <ul className="mt-3 grid grid-cols-6 gap-1.5 sm:gap-2">
          {box.map((slug) => {
            const mon = getPokemon(slug);
            if (!mon) return null;
            const on = focus === slug;
            const inBring = bring.has(slug);
            const isFlex = swap?.in === slug;
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
                        : "border-transparent opacity-45 hover:opacity-75"
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
                  {isFlex ? (
                    <span className="font-mono text-[8px] uppercase tracking-wide text-amber-200/90">
                      Flex
                    </span>
                  ) : inBring ? (
                    <span className="font-mono text-[8px] uppercase tracking-wide text-muted">
                      Bring
                    </span>
                  ) : (
                    <span className="font-mono text-[8px] uppercase tracking-wide text-muted">
                      Box
                    </span>
                  )}
                </button>
              </li>
            );
          })}
        </ul>
      </div>

      {/* Packages for the active six only */}
      <div className="border-b border-line/50 px-4 py-4 md:px-5">
        <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.14em] text-muted">
          {swap ? "Packages from this six" : "Packages from the six"}
        </p>
        <p className="mt-1 max-w-[52ch] text-[11px] text-muted">
          {swap
            ? "Bring options after the swap. These are not available on the registered six."
            : "What you can bring once the six is locked for the tournament or queue."}
        </p>

        {scripts.length ? (
          <div className="mt-2 flex flex-wrap gap-1">
            {scripts.map((s) => (
              <button
                key={s.id}
                type="button"
                onClick={() => onSelectPack(s.packId)}
                className={`rounded-full px-2 py-0.5 text-[10px] font-medium transition ${
                  s.packId === pack?.id ? "bg-ink text-bg" : "border border-line/60 text-muted hover:text-ink"
                }`}
              >
                vs {s.foe}
              </button>
            ))}
          </div>
        ) : null}

        <ul className="mt-3 grid gap-2 sm:grid-cols-2">
          {visiblePacks.map((p) => {
            const on = p.id === pack?.id;
            const st = resolvePackStrategy(p);
            const lead = getPokemon(p.slugs[0]);
            return (
              <li key={p.id}>
                <button
                  type="button"
                  onClick={() => onSelectPack(p.id)}
                  className={`flex h-full w-full flex-col rounded-2xl border px-3 py-3 text-left transition ${
                    on
                      ? "border-ink/40 bg-[color-mix(in_srgb,var(--mon-wash)_22%,transparent)] shadow-sm"
                      : "border-line/60 bg-raised/20 hover:border-ink/25"
                  }`}
                  style={lead ? cssVars(lead.palette) : undefined}
                  aria-pressed={on}
                >
                  <div className="flex items-start gap-3">
                    <span className="shrink-0">
                      {doubles ? (
                        <PackFourArts slugs={p.slugs} size={on ? 40 : 34} />
                      ) : (
                        <PackThreeArts slugs={p.slugs} size={on ? 44 : 36} />
                      )}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="flex items-center gap-2">
                        <span className="text-sm font-semibold tracking-tight">{p.label}</span>
                        {on ? (
                          <span className="rounded-full bg-ink px-1.5 py-0.5 text-[9px] font-medium text-bg">
                            Active
                          </span>
                        ) : null}
                      </span>
                      {p.when ? (
                        <span className="mt-1 block text-[11px] leading-snug text-muted">{p.when}</span>
                      ) : null}
                      {st.mantra || p.identity ? (
                        <span className="mt-1.5 block text-xs font-medium leading-snug text-ink">
                          {st.mantra || p.identity}
                        </span>
                      ) : null}
                    </span>
                  </div>
                </button>
              </li>
            );
          })}
        </ul>

        {!visiblePacks.length ? (
          <p className="mt-3 text-sm text-muted">No packages authored for this six yet.</p>
        ) : null}

        {pack && strategy ? (
          <p className="mt-3 text-[11px] text-muted">
            Active bring · {pack.slugs.map((s) => getPokemon(s)?.name ?? s).join(" · ")}
            {pack.pilotDecision?.previewQuestion ? (
              <span className="mt-1 block text-ink">{pack.pilotDecision.previewQuestion}</span>
            ) : null}
          </p>
        ) : null}
      </div>

      {/* Bench swaps — only on registered six view */}
      {!swap && alts.length ? (
        <div className="border-b border-line/50 px-4 py-4 md:px-5">
          <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.14em] text-muted">
            Bench swaps
          </p>
          <p className="mt-1 max-w-[52ch] text-[11px] text-muted">
            Not on the registered six. Tap a card when the ladder problem needs a different
            architecture — then you&apos;ll see packages for that swapped six.
          </p>
          <ul className="mt-3 grid gap-2 sm:grid-cols-2">
            {alts.map((alt) => {
              const mon = getPokemon(alt.slug);
              const instead = alt.insteadOf ? getPokemon(alt.insteadOf) : undefined;
              if (!mon) return null;
              const unlocked = packs.filter(
                (p) =>
                  packRequiresSwap(p) &&
                  p.requiresSwap.in === alt.slug &&
                  (!alt.insteadOf || p.requiresSwap.out === alt.insteadOf),
              );
              return (
                <li key={alt.slug}>
                  <button
                    type="button"
                    onClick={() => activateSwap(alt)}
                    className="flex h-full w-full flex-col rounded-2xl border border-line/60 bg-raised/15 px-3 py-3 text-left transition hover:border-amber-400/35 hover:bg-amber-500/5"
                    style={cssVars(mon.palette)}
                  >
                    <span className="flex items-start gap-2.5">
                      <PokemonArt
                        slug={mon.slug}
                        src={mon.sprite || mon.artwork}
                        name={mon.name}
                        size={40}
                      />
                      <span className="min-w-0">
                        <span className="block text-sm font-semibold tracking-tight">{mon.name}</span>
                        {instead ? (
                          <span className="text-[11px] text-muted">replaces {instead.name}</span>
                        ) : null}
                        {alt.module?.identity ? (
                          <span className="mt-0.5 block text-[10px] font-medium text-amber-200/90">
                            {alt.module.identity}
                          </span>
                        ) : null}
                      </span>
                    </span>
                    {alt.architectureChange ? (
                      <span className="mt-2 text-[11px] leading-snug text-muted">
                        {alt.architectureChange.from} →{" "}
                        <span className="text-ink">{alt.architectureChange.to}</span>
                      </span>
                    ) : null}
                    <span className="mt-2 text-[11px] leading-snug text-ink">
                      {alt.why || alt.answers || "Open this swap to see its packages."}
                    </span>
                    {(alt.useWhen?.length || alt.avoidWhen?.length) && (
                      <span className="mt-2 space-y-0.5 text-[10px] text-muted">
                        {alt.useWhen?.slice(0, 2).map((line) => (
                          <span key={line} className="block">
                            Use when · {line}
                          </span>
                        ))}
                        {alt.avoidWhen?.slice(0, 1).map((line) => (
                          <span key={line} className="block">
                            Avoid when · {line}
                          </span>
                        ))}
                      </span>
                    )}
                    {unlocked.length ? (
                      <span className="mt-2 font-mono text-[9px] uppercase tracking-wide text-muted">
                        Unlocks {unlocked.length} package{unlocked.length === 1 ? "" : "s"}
                      </span>
                    ) : null}
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      ) : null}

      {/* Kit */}
      {kitSlot && focus ? (
        <KitSheet slot={kitSlot} open={kitOpen} onToggle={() => setKitOpen((o) => !o)} />
      ) : null}

      {(loops.length > 0 || flows.length > 0) && pack ? (
        <div>
          <button
            type="button"
            onClick={() => setPlaybookOpen((o) => !o)}
            className="flex w-full items-center justify-between border-t border-line/50 px-4 py-2.5 text-left md:px-5"
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
}: {
  slot: SlotManual;
  open: boolean;
  onToggle: () => void;
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
            {[slot.ability, slot.nature].filter(Boolean).join(" · ") || "Kit"}
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

          <ul className="mt-3 grid gap-1.5 sm:grid-cols-2">
            {moves.map((move) => (
              <li
                key={move.name}
                className="rounded-xl border border-line/50 bg-raised/20 px-2.5 py-2"
              >
                <p className="text-xs font-semibold">{move.name}</p>
                {move.why ? (
                  <p className="mt-1 text-[11px] leading-snug text-muted">{move.why}</p>
                ) : null}
              </li>
            ))}
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
  return (
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
    .map(([k, n]) => `${n} ${k}`)
    .slice(0, 3)
    .join(" / ");
}
