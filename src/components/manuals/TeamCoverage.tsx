"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { CaretDown } from "@phosphor-icons/react";
import { TypeBadge } from "@/components/pokemon/TypeBadge";
import { SlotField } from "@/components/manuals/SlotField";
import {
  summarizeTeamCoverage,
  threatLine,
  type CoverageMember,
} from "@/lib/champions/team-coverage";
import { easeOut, motionTokens } from "@/components/motion/tokens";

export function TeamCoverage({ members }: { members: CoverageMember[] }) {
  const { clicks, threats } = summarizeTeamCoverage(members);
  const [open, setOpen] = useState(false);
  if (!clicks.length && !threats.length) return null;

  const holes = threats.map(threatLine).join(" ");

  return (
    <div className="mt-4 rounded-[28px] border border-line bg-raised/40 px-4 py-4">
      <div className="space-y-2">
        {clicks.length ? (
          <SlotField label="Coverage">
            <div className="flex flex-wrap gap-1">
              {clicks.map((click) => (
                <TypeBadge
                  key={click.type}
                  type={click.type}
                  size="sm"
                  mark={click.extra ? "+" : undefined}
                />
              ))}
            </div>
          </SlotField>
        ) : null}
        {threats.length ? (
          <SlotField label="Threat">
            <div className="flex flex-wrap gap-1">
              {threats.map((threat) => (
                <TypeBadge
                  key={threat.type}
                  type={threat.type}
                  size="sm"
                  mark={threat.worst >= 4 ? "4×" : `${threat.count}`}
                />
              ))}
            </div>
          </SlotField>
        ) : null}
      </div>
      {holes ? (
        <>
          <button
            type="button"
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
            className="mt-3 flex items-center gap-2 text-sm text-muted hover:text-ink"
          >
            <CaretDown
              size={14}
              weight="bold"
              className={`transition-transform ${open ? "rotate-0" : "-rotate-90"}`}
            />
            {open ? "Hide holes" : "Holes on this three"}
          </button>
          <AnimatePresence initial={false}>
            {open ? (
              <motion.p
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: motionTokens.layout, ease: easeOut }}
                className="overflow-hidden pt-2 text-sm leading-relaxed text-muted"
              >
                {holes}
              </motion.p>
            ) : null}
          </AnimatePresence>
        </>
      ) : null}
    </div>
  );
}
