"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { CaretDown } from "@phosphor-icons/react";
import { TypeBadge } from "@/components/pokemon/TypeBadge";
import {
  summarizeTeamCoverage,
  threatLine,
  type CoverageMember,
} from "@/lib/champions/team-coverage";
import { easeOut, motionTokens } from "@/components/motion/tokens";
import type { ManualCoverageNote } from "@/content/manuals";

export function TeamCoverage({
  members,
  notes = [],
  defaultOpen = true,
  title = "Coverage",
}: {
  members: CoverageMember[];
  notes?: ManualCoverageNote[];
  defaultOpen?: boolean;
  title?: string;
}) {
  const { clicks, threats } = summarizeTeamCoverage(members);
  const [openHoles, setOpenHoles] = useState(false);
  const [openSources, setOpenSources] = useState(defaultOpen);
  if (!clicks.length && !threats.length && !notes.length) return null;

  const stab = clicks.filter((c) => !c.extra);
  const extra = clicks.filter((c) => c.extra);
  const holes = threats.map(threatLine).join(" ");

  return (
    <div className="rounded-[28px] border border-line/70 bg-raised/30 px-4 py-4 md:px-5">
      <div className="flex flex-wrap items-end justify-between gap-2">
        <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.14em] text-muted">
          {title}
        </p>
        <button
          type="button"
          aria-expanded={openSources}
          onClick={() => setOpenSources((v) => !v)}
          className="inline-flex items-center gap-1 text-xs text-muted hover:text-ink"
        >
          <CaretDown
            size={12}
            weight="bold"
            className={`transition-transform ${openSources ? "rotate-0" : "-rotate-90"}`}
          />
          {openSources ? "Compact" : "Who covers"}
        </button>
      </div>

      <div className="mt-3 grid gap-4 md:grid-cols-2">
        <div>
          <p className="text-[11px] font-medium text-muted">We hit</p>
          <div className="mt-2 flex flex-wrap gap-1">
            {stab.map((click) => (
              <TypeBadge key={click.type} type={click.type} size="sm" />
            ))}
            {extra.map((click) => (
              <TypeBadge key={click.type} type={click.type} size="sm" mark="+" />
            ))}
          </div>
          {extra.length ? (
            <p className="mt-2 text-[11px] text-muted">+ = coverage move, not STAB on the bring</p>
          ) : null}
        </div>
        <div>
          <p className="text-[11px] font-medium text-muted">We fear</p>
          {threats.length ? (
            <div className="mt-2 flex flex-wrap gap-1">
              {threats.map((threat) => (
                <TypeBadge
                  key={threat.type}
                  type={threat.type}
                  size="sm"
                  mark={threat.worst >= 4 ? "4×" : `${threat.count}`}
                />
              ))}
            </div>
          ) : (
            <p className="mt-2 text-sm text-muted">No shared 2× / 4× hole on this group.</p>
          )}
        </div>
      </div>

      <AnimatePresence initial={false}>
        {openSources ? (
          <motion.ul
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: motionTokens.layout, ease: easeOut }}
            className="mt-4 space-y-2 overflow-hidden border-t border-line/50 pt-4"
          >
            {clicks.map((click) => (
              <li key={click.type} className="flex flex-wrap items-baseline gap-x-2 gap-y-1 text-sm">
                <TypeBadge type={click.type} size="sm" mark={click.extra ? "+" : undefined} />
                <span className="text-muted">
                  {click.sources
                    .map((s) =>
                      s.move === "STAB"
                        ? `${s.name} STAB`
                        : `${s.name} · ${s.move}${s.stab ? "" : " (cov)"}`,
                    )
                    .join(" · ")}
                </span>
              </li>
            ))}
          </motion.ul>
        ) : null}
      </AnimatePresence>

      {threats.length ? (
        <>
          <button
            type="button"
            aria-expanded={openHoles}
            onClick={() => setOpenHoles((v) => !v)}
            className="mt-4 flex items-center gap-2 text-sm text-muted hover:text-ink"
          >
            <CaretDown
              size={14}
              weight="bold"
              className={`transition-transform ${openHoles ? "rotate-0" : "-rotate-90"}`}
            />
            {openHoles ? "Hide holes" : "Holes detail"}
          </button>
          <AnimatePresence initial={false}>
            {openHoles ? (
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

      {notes.length ? (
        <ul className="mt-4 space-y-2 border-t border-line/50 pt-4">
          {notes.map((n) => (
            <li key={n.title} className="text-sm">
              <p className="font-medium tracking-tight">{n.title}</p>
              <p className="mt-0.5 text-muted">{n.body}</p>
              {n.watch ? <p className="mt-1 text-[12px] text-muted">Watch: {n.watch}</p> : null}
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
