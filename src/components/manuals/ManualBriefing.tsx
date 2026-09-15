"use client";

import { useState } from "react";
import Link from "next/link";
import { AnimatePresence, MotionConfig, motion } from "motion/react";
import { CaretDown } from "@phosphor-icons/react";
import { getPokemon } from "@/lib/catalog/load";
import { cssVars } from "@/lib/champions/palette";
import { PokemonArt } from "@/components/pokemon/PokemonArt";
import { LoadSampleSix } from "@/components/learn/LoadSampleSix";
import { SlotMatchups } from "@/components/manuals/SlotMatchups";
import { SlotCardBody } from "@/components/manuals/SlotCard";
import { VsScout } from "@/components/scout/VsScout";
import { MANUAL_SCROLL_MT } from "@/components/manuals/ManualToc";
import { easeOut, motionTokens } from "@/components/motion/tokens";
import type { TeamManual } from "@/content/manuals";
import type { ScoutSide } from "@/lib/champions/vs";

const SETS_FALLBACK =
  "Each Pokémon spends 66 Stat Points. One point is +1 to that stat at Level 50. You may put at most 32 in a single stat.";

function ChipRow({ label, items }: { label: string; items: string[] }) {
  const chips = items.map((s) => s.trim()).filter(Boolean);
  if (!chips.length) return null;
  return (
    <div>
      <p className="text-xs font-medium uppercase tracking-wide text-muted">{label}</p>
      <ul className="mt-2 flex flex-wrap gap-2">
        {chips.map((chip) => (
          <li key={chip} className="rounded-full bg-white/5 px-3 py-1 text-sm">
            {chip}
          </li>
        ))}
      </ul>
    </div>
  );
}

export function ManualBriefing({ manual }: { manual: TeamManual }) {
  const ready = manual.slugs.every(Boolean);
  const [openSlug, setOpenSlug] = useState<string | null>(null);
  const scoutSide: ScoutSide[] = [];
  for (const slot of manual.slots) {
    const p = slot.slug ? getPokemon(slot.slug) : undefined;
    if (!p) continue;
    scoutSide.push({
      slug: p.slug,
      types: p.types,
      moves: slot.moves.map((m) => m.name),
    });
  }

  return (
    <MotionConfig reducedMotion="user">
      <div className="mt-8 space-y-6">
        <section id="three" className={MANUAL_SCROLL_MT}>
          <h2 className="text-2xl font-semibold tracking-tight">The three</h2>
          <p className="mt-2 max-w-[62ch] text-sm leading-relaxed text-muted">
            {manual.setsNote?.trim() || SETS_FALLBACK} Tap a name for the set.
          </p>
          <ul className="mt-5 grid items-start gap-3 lg:grid-cols-3">
            {manual.slots.map((slot) => {
              const p = slot.slug ? getPokemon(slot.slug) : undefined;
              const key = `${slot.slug}-${slot.title}`;
              const open = openSlug === key;
              return (
                <li
                  key={key}
                  className="overflow-hidden rounded-[28px] border border-line bg-raised/40"
                  style={p ? cssVars(p.palette) : undefined}
                >
                  <button
                    type="button"
                    aria-expanded={open}
                    onClick={() => setOpenSlug((cur) => (cur === key ? null : key))}
                    className="flex w-full items-start gap-3 p-3 text-left transition hover:bg-white/4"
                  >
                    <CaretDown
                      size={14}
                      weight="bold"
                      className={`mt-1 shrink-0 text-muted transition-transform ${open ? "rotate-0" : "-rotate-90"}`}
                    />
                    {p ? (
                      <Link
                        href={`/pokemon/${p.slug}`}
                        className="shrink-0"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <PokemonArt slug={p.slug} src={p.artwork} name={p.name} size={56} share />
                      </Link>
                    ) : null}
                    <span className="min-w-0 flex-1">
                      <span className="block truncate font-semibold tracking-tight">
                        {p?.name ?? (slot.title || "Empty")}
                      </span>
                      <span className="mt-0.5 block truncate text-xs text-muted">{slot.title}</span>
                      {p ? <SlotMatchups types={p.types} /> : null}
                      {slot.role ? <span className="mt-2 block text-sm text-muted">{slot.role}</span> : null}
                    </span>
                  </button>
                  <AnimatePresence initial={false}>
                    {open ? (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: motionTokens.layout, ease: easeOut }}
                        className="overflow-hidden border-t border-line/70"
                      >
                        <SlotCardBody slot={slot} identity={false} />
                      </motion.div>
                    ) : null}
                  </AnimatePresence>
                </li>
              );
            })}
          </ul>
        </section>
        {ready ? <LoadSampleSix slugs={[...manual.slugs]} intent={manual.archetype} /> : null}
        <div className="grid gap-5 sm:grid-cols-2">
          <ChipRow label="Press" items={manual.press ?? []} />
          <ChipRow label="Refuse" items={manual.refuse ?? []} />
        </div>
        {scoutSide.length ? (
          <VsScout
            side={scoutSide}
            lede="Search who they have. Kit clicks and STABs — how your three hit them, and how they hit you."
          />
        ) : null}
      </div>
    </MotionConfig>
  );
}
