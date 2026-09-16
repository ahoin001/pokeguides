"use client";

import { useState } from "react";
import Link from "next/link";
import { AnimatePresence, MotionConfig, motion } from "motion/react";
import { CaretDown } from "@phosphor-icons/react";
import { getPokemon } from "@/lib/catalog/load";
import { cssVars } from "@/lib/champions/palette";
import { PokemonArt } from "@/components/pokemon/PokemonArt";
import { SlotMatchups } from "@/components/manuals/SlotMatchups";
import { TeamCoverage } from "@/components/manuals/TeamCoverage";
import { SlotCardBody } from "@/components/manuals/SlotCard";
import { VsScout } from "@/components/scout/VsScout";
import { MANUAL_SCROLL_MT } from "@/components/manuals/ManualToc";
import { easeOut, motionTokens } from "@/components/motion/tokens";
import { ROLE_LABEL } from "@/content/roles";
import type { TeamManual } from "@/content/manuals";
import type { ScoutSide } from "@/lib/champions/vs";
import { rankedFoesFor } from "@/lib/ranked/foes";

export function ManualBriefing({ manual }: { manual: TeamManual }) {
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
          <h2 className="sr-only">The three</h2>
          <ul className="grid items-start gap-3 lg:grid-cols-3">
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
                        <PokemonArt slug={p.slug} src={p.artwork} name={p.name} size={56} />
                      </Link>
                    ) : null}
                    <span className="min-w-0 flex-1">
                      <span className="flex flex-wrap items-baseline gap-2">
                        <span className="truncate font-semibold tracking-tight">
                          {p?.name ?? (slot.title || "Empty")}
                        </span>
                        <span className="rounded-full bg-white/8 px-2 py-0.5 font-mono text-[10px] uppercase tracking-[0.1em] text-muted">
                          {ROLE_LABEL[slot.job] ?? slot.job}
                        </span>
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
          {manual.setsNote?.trim() ? (
            <div className="mt-4 rounded-[24px] border border-line bg-sunken/60 px-4 py-3.5">
              <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.14em] text-muted">
                Stat Points
              </p>
              <p className="mt-1.5 max-w-prose text-sm leading-relaxed text-muted">{manual.setsNote}</p>
            </div>
          ) : null}
          <TeamCoverage
            members={manual.slots.flatMap((slot) => {
              const p = slot.slug ? getPokemon(slot.slug) : undefined;
              if (!p) return [];
              return [
                {
                  name: p.name,
                  types: p.types,
                  moves: slot.moves.map((m) => m.name),
                },
              ];
            })}
          />
        </section>
        {scoutSide.length ? (
          <VsScout
            side={scoutSide}
            lede="Search who they previewed — typing and kit before you lead."
            suggestedFoes={rankedFoesFor([...manual.slugs])}
          />
        ) : null}
      </div>
    </MotionConfig>
  );
}
