"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { getPokemon } from "@/lib/catalog/load";
import { PokemonArt } from "@/components/pokemon/PokemonArt";
import { easeOut, motionTokens } from "@/components/motion/tokens";
import { MANUAL_SCROLL_MT } from "@/components/manuals/ManualToc";
import type { ManualPack, SlotManual } from "@/content/manuals";

export function ManualBringSix({
  box,
  core,
  roster,
  activeSlugs,
  onPickSlug,
}: {
  box: string[];
  core: string[];
  roster: SlotManual[];
  activeSlugs: string[];
  onPickSlug: (slug: string) => void;
}) {
  const coreSet = new Set(core);
  const active = new Set(activeSlugs);
  const bySlug = new Map(roster.map((s) => [s.slug, s]));

  return (
    <section id="box" className={`mt-8 max-w-3xl ${MANUAL_SCROLL_MT}`}>
      <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.14em] text-muted">Bring six</p>
      <p className="mt-1.5 max-w-[52ch] text-sm text-muted">
        Registered for the match. After preview, you bring three. Core is the blind identity; flex answers what you saw.
      </p>
      <ul className="mt-5 grid gap-3 sm:grid-cols-2">
        {box.map((slug) => {
          const mon = getPokemon(slug);
          const slot = bySlug.get(slug);
          if (!mon) return null;
          const isCore = coreSet.has(slug);
          const on = active.has(slug);
          return (
            <li key={slug}>
              <button
                type="button"
                onClick={() => onPickSlug(slug)}
                aria-pressed={on}
                className={`flex w-full items-center gap-3 rounded-[22px] border px-3 py-2.5 text-left transition ${
                  on ? "border-line bg-raised/60" : "border-transparent bg-transparent opacity-55 hover:opacity-90"
                }`}
              >
                <PokemonArt slug={mon.slug} src={mon.artwork} name={mon.name} size={48} />
                <span className="min-w-0">
                  <span className="flex flex-wrap items-baseline gap-2">
                    <span className="font-medium tracking-tight text-ink">{mon.name}</span>
                    <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-muted">
                      {isCore ? "Core" : "Flex"}
                    </span>
                  </span>
                  <span className="mt-0.5 block truncate text-sm text-muted">{slot?.title ?? slot?.role}</span>
                </span>
              </button>
            </li>
          );
        })}
      </ul>
    </section>
  );
}

export function ManualPreviewBar({
  packs,
  packId,
  onSelect,
}: {
  packs: ManualPack[];
  packId: string;
  onSelect: (id: string) => void;
}) {
  const reduce = useReducedMotion();
  const active = packs.find((p) => p.id === packId) ?? packs[0];

  return (
    <section id="preview" className={`mt-8 max-w-3xl ${MANUAL_SCROLL_MT}`}>
      <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.14em] text-muted">Preview</p>
      <h2 className="mt-1 text-2xl font-semibold tracking-tight">What you bring</h2>
      <p className="mt-2 max-w-[52ch] text-sm text-muted">
        You saw their six. Pick the three that answer it. Plan, flows, and matchups update with the bring.
      </p>

      <ul className="mt-5 overflow-hidden rounded-[24px] border border-line bg-raised/30">
        {packs.map((pack) => {
          const on = pack.id === active?.id;
          const mons = pack.slugs.map((s) => getPokemon(s)).filter(Boolean);
          return (
            <li key={pack.id} className="border-t border-line/70 first:border-t-0">
              <button
                type="button"
                aria-pressed={on}
                onClick={() => onSelect(pack.id)}
                className={`flex w-full items-center gap-4 px-4 py-3.5 text-left transition ${
                  on ? "bg-white/[0.06]" : "hover:bg-white/[0.03]"
                }`}
              >
                <span className="min-w-0 flex-1">
                  <span className="flex flex-wrap items-baseline gap-2">
                    <span className={`font-medium tracking-tight ${on ? "text-ink" : "text-ink/90"}`}>
                      {pack.label}
                    </span>
                    <span className="text-sm text-muted">{pack.when}</span>
                  </span>
                </span>
                <span className="flex shrink-0 items-end gap-1">
                  {mons.map((p) =>
                    p ? (
                      <span
                        key={p.slug}
                        className={`rounded-xl ${on ? "opacity-100" : "opacity-45"}`}
                      >
                        <PokemonArt slug={p.slug} src={p.artwork} name={p.name} size={36} />
                      </span>
                    ) : null,
                  )}
                </span>
              </button>
            </li>
          );
        })}
      </ul>

      <AnimatePresence mode="wait">
        {active ? (
          <motion.p
            key={active.id}
            initial={reduce ? false : { opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduce ? undefined : { opacity: 0, y: -4 }}
            transition={{ duration: motionTokens.state, ease: easeOut }}
            className="mt-3 max-w-[52ch] text-sm text-muted"
          >
            {active.identity}
          </motion.p>
        ) : null}
      </AnimatePresence>
    </section>
  );
}
