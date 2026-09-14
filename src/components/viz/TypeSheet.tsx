"use client";

import { useState, type ReactNode } from "react";
import { type TypeId } from "@/types/pokemon";
import { TYPE_LABEL, TYPE_SHEET_ROWS, typeSheet } from "@/lib/champions/types";
import { TypeIcon } from "@/components/pokemon/TypeIcon";
import { TypePlayground } from "./TypePlayground";

const TONE = {
  onYou: { fill: "color-mix(in srgb, #e23d7a 58%, #fff)", ink: "#c2185b" },
  immune: { fill: "color-mix(in srgb, #5a6478 22%, #fff)", ink: "#4a5366" },
  resist: { fill: "color-mix(in srgb, #d4a017 62%, #fff)", ink: "#8a6a12" },
  youHit: { fill: "color-mix(in srgb, #2a4a9a 52%, #fff)", ink: "#1c2a66" },
  youSoft: { fill: "color-mix(in srgb, #5a6f8c 48%, #fff)", ink: "#3d4f66" },
} as const;

export function TypeSheet() {
  const [open, setOpen] = useState<TypeId>("fire");
  return (
    <div>
      <div className="type-sheet overflow-hidden rounded-[28px] shadow-[0_18px_50px_rgba(0,0,0,0.35)]">
        <Legend />
        <div className="grid md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
          {TYPE_SHEET_ROWS.map(([left, right]) => (
            <div key={left} className="contents">
              <TypeRow
                type={left}
                selected={open === left}
                onSelect={() => setOpen(left)}
              />
              <TypeRow
                type={right}
                selected={open === right}
                onSelect={() => setOpen(right)}
              />
            </div>
          ))}
        </div>
      </div>
      <section className="mt-16">
        <h2 className="text-2xl font-semibold tracking-tight">Mix two types</h2>
        <p className="mt-2 max-w-[50ch] text-sm text-muted">
          Preview is often a pair. The sheet above is one type at a time. Mix here after you can read a row.
        </p>
        <div className="mt-8">
          <TypePlayground seed={open} />
        </div>
      </section>
    </div>
  );
}

function TypeRow({
  type,
  selected,
  onSelect,
}: {
  type: TypeId;
  selected: boolean;
  onSelect: () => void;
}) {
  const { weak, resist, immuneIn, hits, soft, fails } = typeSheet(type);
  return (
    <button
      type="button"
      onClick={onSelect}
      aria-pressed={selected}
      className="type-sheet-row row-span-4 grid min-w-0 w-full grid-cols-[7.5ch_auto_minmax(0,1fr)] grid-rows-subgrid gap-x-2.5 gap-y-1.5 border-b border-black/[0.06] px-3 py-3 text-left transition focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-[#1c1e24] md:gap-x-3 md:px-4 md:py-3.5 md:odd:border-r"
      style={{
        background: `color-mix(in srgb, var(--type-${type}) ${selected ? 34 : 22}%, #f4f1ea)`,
      }}
    >
      <p className="col-start-1 row-span-4 self-start pt-4 font-mono text-[11px] font-medium uppercase tracking-[0.12em] text-[#1c1e24] md:text-xs">
        {TYPE_LABEL[type]}
      </p>
      <span className="col-start-2 row-span-4 self-start pt-0.5">
        <TypeIcon type={type} size="hero" />
      </span>
      <Lane className="col-start-3 row-start-1">
        {weak.length ? <MatchupPill tone="onYou" dir="in" types={weak} /> : null}
        {immuneIn.length ? <MatchupPill tone="immune" dir="in" types={immuneIn} slash /> : null}
      </Lane>
      <Lane className="col-start-3 row-start-2">
        {resist.length ? <MatchupPill tone="resist" dir="flat" types={resist} /> : null}
      </Lane>
      <Lane className="col-start-3 row-start-3">
        {hits.length ? <MatchupPill tone="youHit" dir="out" types={hits} /> : null}
        {fails.length ? <MatchupPill tone="immune" dir="out" types={fails} slash /> : null}
      </Lane>
      <Lane className="col-start-3 row-start-4">
        {soft.length ? <MatchupPill tone="youSoft" dir="flat" types={soft} /> : null}
      </Lane>
    </button>
  );
}

function Lane({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div className={`flex min-h-8 min-w-0 flex-wrap items-center gap-1.5 self-start ${className ?? ""}`}>
      {children}
    </div>
  );
}

function MatchupPill({
  tone,
  dir,
  types,
  slash = false,
}: {
  tone: keyof typeof TONE;
  dir?: "in" | "out" | "flat";
  types: TypeId[];
  slash?: boolean;
}) {
  const { fill, ink } = TONE[tone];
  return (
    <span className="inline-flex max-w-full items-center gap-1">
      {dir ? <RailMark kind={dir} color={ink} /> : null}
      <span
        className="inline-flex max-w-full flex-wrap items-center gap-1 rounded-full px-1.5 py-1"
        style={{ background: fill }}
      >
        {types.map((t) => (
          <TypeIcon key={`${tone}-${t}-${slash}`} type={t} size="sheet" slash={slash} />
        ))}
      </span>
    </span>
  );
}

function RailMark({ kind, color }: { kind: "in" | "out" | "flat"; color: string }) {
  return (
    <svg viewBox="0 0 22 12" className="h-3 w-[22px] shrink-0" aria-hidden>
      {kind === "flat" ? (
        <path d="M1 6h20" fill="none" stroke={color} strokeWidth="1.85" strokeLinecap="round" />
      ) : kind === "in" ? (
        <>
          <path d="M21 6H8" fill="none" stroke={color} strokeWidth="1.85" strokeLinecap="round" />
          <path d="M8.2 1.15 1.1 6l7.1 4.85Z" fill={color} />
        </>
      ) : (
        <>
          <path d="M1 6h13" fill="none" stroke={color} strokeWidth="1.85" strokeLinecap="round" />
          <path d="M13.8 1.15 20.9 6l-7.1 4.85Z" fill={color} />
        </>
      )}
    </svg>
  );
}

function Legend() {
  return (
    <ul className="grid grid-cols-2 gap-x-4 gap-y-2.5 border-b border-black/25 bg-[#243056] px-4 py-3 sm:px-5">
      <LegendItem>
        <RailMark kind="in" color="#e23d7a" />
        <span
          className="inline-flex items-center rounded-full px-1.5 py-1"
          style={{ background: TONE.onYou.fill }}
        >
          <TypeIcon type="fighting" size="sheet" />
        </span>
        <span className="min-w-0 font-mono text-[11px] leading-tight uppercase tracking-[0.08em] text-[#f4f1ea] sm:text-xs">
          Super effective on you
        </span>
      </LegendItem>
      <LegendItem>
        <RailMark kind="out" color="#f4f1ea" />
        <span
          className="inline-flex items-center rounded-full px-1.5 py-1"
          style={{ background: TONE.youHit.fill }}
        >
          <TypeIcon type="fire" size="sheet" />
        </span>
        <span className="min-w-0 font-mono text-[11px] leading-tight uppercase tracking-[0.08em] text-[#f4f1ea] sm:text-xs">
          You are super effective
        </span>
      </LegendItem>
      <LegendItem>
        <RailMark kind="flat" color={TONE.resist.ink} />
        <span
          className="inline-flex items-center rounded-full px-1.5 py-1"
          style={{ background: TONE.resist.fill }}
        >
          <TypeIcon type="steel" size="sheet" />
        </span>
        <span className="min-w-0 font-mono text-[11px] leading-tight uppercase tracking-[0.08em] text-[#f4f1ea] sm:text-xs">
          Not very effective on you
        </span>
      </LegendItem>
      <LegendItem>
        <RailMark kind="flat" color={TONE.youSoft.ink} />
        <span
          className="inline-flex items-center rounded-full px-1.5 py-1"
          style={{ background: TONE.youSoft.fill }}
        >
          <TypeIcon type="rock" size="sheet" />
        </span>
        <span className="min-w-0 font-mono text-[11px] leading-tight uppercase tracking-[0.08em] text-[#f4f1ea] sm:text-xs">
          You are not very effective
        </span>
      </LegendItem>
      <LegendItem className="col-span-2">
        <span
          className="inline-flex items-center rounded-full px-1.5 py-1"
          style={{ background: TONE.immune.fill }}
        >
          <TypeIcon type="ghost" size="sheet" slash title="No effect" />
        </span>
        <span className="min-w-0 font-mono text-[11px] leading-tight uppercase tracking-[0.08em] text-[#f4f1ea] sm:text-xs">
          No effect (← into you, → you into them)
        </span>
      </LegendItem>
    </ul>
  );
}

function LegendItem({ children, className }: { children: ReactNode; className?: string }) {
  return <li className={`flex min-w-0 items-center gap-2 ${className ?? ""}`}>{children}</li>;
}
