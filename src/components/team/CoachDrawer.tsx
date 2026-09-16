"use client";

import { AnimatePresence, motion } from "motion/react";
import { CaretDown } from "@phosphor-icons/react";
import Link from "next/link";
import { ARCHETYPES, ARCHETYPE_LABEL, archetypeHref } from "@/content/archetypes";
import { LEARN_ROLE_IDS, ROLE_LABEL, roleHref } from "@/content/roles";
import type { ChecklistItem } from "@/lib/champions/team-checklist";
import type { TeamReadout } from "@/lib/champions/team-readout";
import { TeamChecklist } from "@/components/team/TeamChecklist";
import { easeOut, motionTokens } from "@/components/motion/tokens";
import type { ArchetypeId } from "@/types/pokemon";

export function CoachDrawer({
  open,
  onToggle,
  intent,
  onIntent,
  roles,
  readout,
  checks,
}: {
  open: boolean;
  onToggle: () => void;
  intent: ArchetypeId | null;
  onIntent: (id: ArchetypeId | null) => void;
  roles: { id: (typeof LEARN_ROLE_IDS)[number]; on: boolean }[];
  readout: TeamReadout;
  checks: ChecklistItem[];
}) {
  return (
    <div className="rounded-[24px] border border-line bg-raised/25">
      <button
        type="button"
        onClick={onToggle}
        className="flex w-full items-center justify-between gap-3 px-4 py-3 text-left"
        aria-expanded={open}
      >
        <span>
          <span className="block font-mono text-[10px] uppercase tracking-[0.14em] text-muted">
            Coach
          </span>
          <span className="mt-0.5 block text-sm font-medium">{readout.headline}</span>
        </span>
        <CaretDown
          size={16}
          weight="bold"
          className={`shrink-0 text-muted transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>

      <AnimatePresence initial={false}>
        {open ? (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: motionTokens.layout, ease: easeOut }}
            className="overflow-hidden"
          >
            <div className="space-y-5 border-t border-line px-4 pb-4 pt-3">
              <p className="text-sm text-muted">{readout.detail}</p>
              {readout.archetypeId ? (
                <Link href={archetypeHref(readout.archetypeId)} className="text-sm underline">
                  Read {ARCHETYPE_LABEL[readout.archetypeId]}
                </Link>
              ) : (
                <Link href="/learn/archetypes" className="text-sm underline">
                  Find a style that fits
                </Link>
              )}

              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-muted">Building as</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {ARCHETYPES.map((style) => {
                    const on = intent === style.id;
                    return (
                      <button
                        key={style.id}
                        type="button"
                        onClick={() => onIntent(on ? null : (style.id as ArchetypeId))}
                        className={`rounded-full px-3 py-1 text-sm ${
                          on ? "bg-ink text-bg" : "bg-white/5 text-muted"
                        }`}
                      >
                        {style.name}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="flex flex-wrap gap-2 text-sm">
                {roles.map((r) => (
                  <Link
                    key={r.id}
                    href={roleHref(r.id)}
                    className={`rounded-full px-3 py-1 ${
                      r.on ? "bg-ink text-bg" : "bg-white/5 text-muted"
                    }`}
                  >
                    {ROLE_LABEL[r.id]}
                  </Link>
                ))}
              </div>

              <TeamChecklist items={checks} compact />
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
