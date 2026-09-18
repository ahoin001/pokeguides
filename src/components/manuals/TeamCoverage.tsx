"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { CaretDown } from "@phosphor-icons/react";
import { TypeBadge } from "@/components/pokemon/TypeBadge";
import { TypeIcon } from "@/components/pokemon/TypeIcon";
import { PokemonArt } from "@/components/pokemon/PokemonArt";
import { getPokemon } from "@/lib/catalog/load";
import { TYPE_LABEL } from "@/lib/champions/types";
import {
  summarizeTeamCoverage,
  threatLine,
  type CoverageMember,
  type CoverageSource,
  type CoverageThreat,
} from "@/lib/champions/team-coverage";
import { easeOut, motionTokens } from "@/components/motion/tokens";
import type { ManualCoverageNote } from "@/content/manuals";
import type { TypeId } from "@/types/pokemon";

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

  return (
    <div
      id="coverage"
      className="scroll-mt-[calc(var(--sticky-shell)+var(--sticky-local)+0.5rem)] rounded-[28px] border border-line/70 bg-raised/30 px-4 py-4 md:px-5"
    >
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
          <div className="mt-2 flex flex-wrap gap-2">
            {stab.map((click) => (
              <HitChip key={click.type} type={click.type} />
            ))}
            {extra.map((click) => (
              <HitChip key={click.type} type={click.type} mark="+" />
            ))}
          </div>
          {extra.length ? (
            <p className="mt-2 text-[11px] text-muted">+ = coverage move, not STAB on the bring</p>
          ) : null}
        </div>
        <div>
          <p className="text-[11px] font-medium text-muted">We fear</p>
          {threats.length ? (
            <div className="mt-2 flex flex-wrap gap-2">
              {threats.map((threat) => (
                <FearChip key={threat.type} threat={threat} />
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
            className="mt-4 space-y-2.5 overflow-hidden border-t border-line/50 pt-4"
          >
            {clicks.map((click) => (
              <li
                key={click.type}
                className="flex flex-wrap items-center gap-x-3 gap-y-2 rounded-2xl bg-canvas/40 px-2.5 py-2"
              >
                <div className="flex min-w-[5.5rem] items-center gap-2">
                  <TypeIcon type={click.type} size="md" />
                  <span className="text-sm font-medium tracking-tight">
                    {TYPE_LABEL[click.type]}
                    {click.extra ? (
                      <span className="ml-1 font-mono text-[10px] text-muted">+</span>
                    ) : null}
                  </span>
                </div>
                <div className="flex min-w-0 flex-1 flex-wrap gap-1.5">
                  {click.sources.map((source) => (
                    <SourcePill key={`${source.name}-${source.move}`} source={source} />
                  ))}
                </div>
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
              <motion.ul
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: motionTokens.layout, ease: easeOut }}
                className="mt-2 space-y-3 overflow-hidden"
              >
                {threats.map((threat) => (
                  <li
                    key={threat.type}
                    className="rounded-2xl border border-line/40 bg-canvas/30 px-3 py-2.5"
                  >
                    <HoleRow threat={threat} />
                    <p className="mt-2 text-sm leading-relaxed text-muted">{threatLine(threat)}</p>
                  </li>
                ))}
              </motion.ul>
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

function HitChip({ type, mark }: { type: TypeId; mark?: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-line/50 bg-canvas/50 py-1 pr-2.5 pl-1">
      <TypeIcon type={type} size="sm" title={false} />
      <span className="text-xs font-semibold tracking-tight">{TYPE_LABEL[type]}</span>
      {mark ? (
        <span className="font-mono text-[9px] font-bold leading-none text-muted">{mark}</span>
      ) : null}
    </span>
  );
}

function FearChip({ threat }: { threat: CoverageThreat }) {
  const mark = threat.worst >= 4 ? "4×" : `${threat.count}`;
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-line/50 bg-canvas/50 py-1 pr-2 pl-1">
      <TypeIcon type={threat.type} size="sm" title={false} />
      <span className="text-xs font-semibold tracking-tight">{TYPE_LABEL[threat.type]}</span>
      <span className="font-mono text-[9px] font-bold leading-none text-muted">{mark}</span>
      <span className="ml-0.5 flex -space-x-2">
        {threat.weak.slice(0, 3).map((w) => (
          <MonThumb key={w.name} slug={w.slug} name={w.name} size={22} ring />
        ))}
      </span>
    </span>
  );
}

function SourcePill({ source }: { source: CoverageSource }) {
  const moveLabel =
    source.move === "STAB" ? "STAB" : source.stab ? source.move : `${source.move} (cov)`;
  return (
    <span className="inline-flex max-w-full items-center gap-1.5 rounded-full border border-line/60 bg-raised/50 py-0.5 pr-2.5 pl-0.5 text-xs">
      <MonThumb slug={source.slug} name={source.name} size={26} />
      <span className="min-w-0 truncate">
        <span className="font-medium text-ink">{source.name}</span>
        <span className="text-muted"> · {moveLabel}</span>
      </span>
    </span>
  );
}

function HoleRow({ threat }: { threat: CoverageThreat }) {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <div className="flex items-center gap-2">
        <TypeIcon type={threat.type} size="md" />
        <TypeBadge
          type={threat.type}
          size="sm"
          mark={threat.worst >= 4 ? "4×" : `${threat.count}`}
        />
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-[10px] font-medium uppercase tracking-wider text-muted">Weak</span>
        <span className="flex -space-x-1.5">
          {threat.weak.map((w) => (
            <MonThumb key={w.name} slug={w.slug} name={w.name} size={28} ring />
          ))}
        </span>
      </div>
      {threat.sits.length ? (
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-[10px] font-medium uppercase tracking-wider text-muted">Sits</span>
          <span className="flex flex-wrap gap-1">
            {threat.sits.map((s) => (
              <span
                key={s.name}
                className="inline-flex items-center gap-1 rounded-full border border-line/50 bg-raised/40 py-0.5 pr-2 pl-0.5 text-[11px] text-muted"
              >
                <MonThumb slug={s.slug} name={s.name} size={22} />
                {s.how}
              </span>
            ))}
          </span>
        </div>
      ) : null}
    </div>
  );
}

function MonThumb({
  slug,
  name,
  size,
  ring,
}: {
  slug?: string;
  name: string;
  size: number;
  ring?: boolean;
}) {
  const mon = slug ? getPokemon(slug) : undefined;
  if (!mon) {
    return (
      <span
        title={name}
        className={`inline-flex shrink-0 items-center justify-center rounded-full bg-white/8 text-[9px] font-semibold text-muted ${
          ring ? "ring-2 ring-canvas" : ""
        }`}
        style={{ width: size, height: size }}
      >
        {name.slice(0, 1)}
      </span>
    );
  }
  return (
    <span
      title={name}
      className={`relative inline-flex shrink-0 overflow-hidden rounded-full bg-white/5 ${
        ring ? "ring-2 ring-canvas" : ""
      }`}
      style={{ width: size, height: size }}
    >
      <PokemonArt slug={mon.slug} src={mon.sprite || mon.artwork} name={mon.name} size={size} />
    </span>
  );
}
