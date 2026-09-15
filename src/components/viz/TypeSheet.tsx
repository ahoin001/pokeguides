"use client";

import { AnimatePresence, MotionConfig, motion } from "motion/react";
import {
  Children,
  useCallback,
  useRef,
  useState,
  type PointerEvent,
  type ReactNode,
} from "react";
import { createPortal } from "react-dom";
import { type TypeId } from "@/types/pokemon";
import { TYPE_LABEL, TYPE_SHEET_ROWS, typeSheet } from "@/lib/champions/types";
import { TypeIcon } from "@/components/pokemon/TypeIcon";
import { easeOut, motionTokens } from "@/components/motion/tokens";
import { TypePlayground } from "./TypePlayground";

type Tone = keyof typeof TONE;
type Dir = "in" | "out";

const TONE = {
  onYou: { fill: "color-mix(in srgb, #e23d7a 58%, #fff)", ink: "#c2185b", glow: "#ff6b9a" },
  immune: { fill: "color-mix(in srgb, #5a6478 22%, #fff)", ink: "#4a5366", glow: "#c5cbe0" },
  resist: { fill: "color-mix(in srgb, #d4a017 62%, #fff)", ink: "#8a6a12", glow: "#f0c040" },
  youHit: { fill: "color-mix(in srgb, #2a4a9a 52%, #fff)", ink: "#1c2a66", glow: "#9cbcff" },
  youSoft: { fill: "color-mix(in srgb, #5a6f8c 48%, #fff)", ink: "#3d4f66", glow: "#b7c4d6" },
} as const;

const MATCH = {
  onYou: { mult: "2×", damage: "Double damage", phrase: "Super effective on you", call: "Super effective" },
  youHit: { mult: "2×", damage: "Double damage", phrase: "You are super effective", call: "Super effective" },
  resist: { mult: "½×", damage: "Half damage", phrase: "Not very effective on you", call: "Not very effective" },
  youSoft: { mult: "½×", damage: "Half damage", phrase: "You are not very effective", call: "Not very effective" },
  immune: { mult: "0×", damage: "No damage", phrase: "No effect", call: "No effect" },
} as const;

type Tip = {
  host: TypeId;
  other: TypeId;
  tone: Tone;
  dir: Dir;
  slash?: boolean;
  x: number;
  y: number;
  w: number;
  h: number;
};

export function TypeSheet() {
  const [open, setOpen] = useState<TypeId>("fire");
  const [tip, setTip] = useState<Tip | null>(null);
  const hideTimer = useRef<number | null>(null);

  const showTip = useCallback((next: Tip) => {
    if (hideTimer.current) {
      window.clearTimeout(hideTimer.current);
      hideTimer.current = null;
    }
    setTip(next);
  }, []);

  const hideTip = useCallback((delay = 60) => {
    if (hideTimer.current) window.clearTimeout(hideTimer.current);
    hideTimer.current = window.setTimeout(() => {
      setTip(null);
      hideTimer.current = null;
    }, delay);
  }, []);

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
                onShowTip={showTip}
                onHideTip={hideTip}
              />
              <TypeRow
                type={right}
                selected={open === right}
                onSelect={() => setOpen(right)}
                onShowTip={showTip}
                onHideTip={hideTip}
              />
            </div>
          ))}
        </div>
      </div>
      <MatchupPopover tip={tip} />
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
  onShowTip,
  onHideTip,
}: {
  type: TypeId;
  selected: boolean;
  onSelect: () => void;
  onShowTip: (tip: Tip) => void;
  onHideTip: (delay?: number) => void;
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
      <Lane
        className="col-start-3 row-start-1"
        dir="in"
        color={weak.length ? TONE.onYou.ink : TONE.immune.ink}
      >
        {weak.length ? (
          <MatchupPill tone="onYou" dir="in" types={weak} host={type} onShowTip={onShowTip} onHideTip={onHideTip} />
        ) : null}
        {immuneIn.length ? (
          <MatchupPill
            tone="immune"
            dir="in"
            types={immuneIn}
            host={type}
            slash
            onShowTip={onShowTip}
            onHideTip={onHideTip}
          />
        ) : null}
      </Lane>
      <Lane className="col-start-3 row-start-2" dir="in" color={TONE.resist.ink}>
        {resist.length ? (
          <MatchupPill tone="resist" dir="in" types={resist} host={type} onShowTip={onShowTip} onHideTip={onHideTip} />
        ) : null}
      </Lane>
      <Lane
        className="col-start-3 row-start-3"
        dir="out"
        color={hits.length ? TONE.youHit.ink : TONE.immune.ink}
      >
        {hits.length ? (
          <MatchupPill tone="youHit" dir="out" types={hits} host={type} onShowTip={onShowTip} onHideTip={onHideTip} />
        ) : null}
        {fails.length ? (
          <MatchupPill
            tone="immune"
            dir="out"
            types={fails}
            host={type}
            slash
            onShowTip={onShowTip}
            onHideTip={onHideTip}
          />
        ) : null}
      </Lane>
      <Lane className="col-start-3 row-start-4" dir="out" color={TONE.youSoft.ink}>
        {soft.length ? (
          <MatchupPill tone="youSoft" dir="out" types={soft} host={type} onShowTip={onShowTip} onHideTip={onHideTip} />
        ) : null}
      </Lane>
    </button>
  );
}

function Lane({
  dir,
  color,
  children,
  className,
}: {
  dir: Dir;
  color: string;
  children: ReactNode;
  className?: string;
}) {
  const items = Children.toArray(children).filter(Boolean);
  if (!items.length) {
    return <div className={`min-h-8 min-w-0 ${className ?? ""}`} />;
  }
  return (
    <div className={`flex min-h-8 min-w-0 items-start gap-1.5 self-start ${className ?? ""}`}>
      <span className="mt-2.5 shrink-0">
        <RailMark kind={dir} color={color} />
      </span>
      <div className="flex min-w-0 flex-wrap items-center gap-1.5">{items}</div>
    </div>
  );
}

function MatchupPill({
  tone,
  dir,
  types,
  host,
  slash = false,
  onShowTip,
  onHideTip,
}: {
  tone: Tone;
  dir: Dir;
  types: TypeId[];
  host: TypeId;
  slash?: boolean;
  onShowTip: (tip: Tip) => void;
  onHideTip: (delay?: number) => void;
}) {
  const { fill } = TONE[tone];
  return (
    <span className="inline-flex max-w-full items-center gap-1">
      <span
        className="inline-flex max-w-full flex-wrap items-center gap-1 rounded-full px-1.5 py-1"
        style={{ background: fill }}
      >
        {types.map((t) => (
          <MatchupMark
            key={`${tone}-${t}-${slash}`}
            type={t}
            host={host}
            tone={tone}
            dir={dir}
            slash={slash}
            onShowTip={onShowTip}
            onHideTip={onHideTip}
          />
        ))}
      </span>
    </span>
  );
}

function MatchupMark({
  type,
  host,
  tone,
  dir,
  slash,
  onShowTip,
  onHideTip,
}: {
  type: TypeId;
  host: TypeId;
  tone: Tone;
  dir: Dir;
  slash?: boolean;
  onShowTip: (tip: Tip) => void;
  onHideTip: (delay?: number) => void;
}) {
  function fromEvent(e: PointerEvent<HTMLSpanElement>) {
    const r = e.currentTarget.getBoundingClientRect();
    onShowTip({
      host,
      other: type,
      tone,
      dir,
      slash,
      x: r.left + r.width / 2,
      y: r.top,
      w: r.width,
      h: r.height,
    });
  }

  return (
    <span
      className="inline-flex origin-center transition-transform duration-100 ease-out hover:scale-110"
      onPointerEnter={(e) => {
        if (e.pointerType === "touch") return;
        fromEvent(e);
      }}
      onPointerLeave={(e) => {
        if (e.pointerType === "touch") return;
        onHideTip(50);
      }}
      onPointerDown={(e) => {
        if (e.pointerType !== "touch") return;
        fromEvent(e);
      }}
      onPointerUp={(e) => {
        if (e.pointerType !== "touch") return;
        onHideTip(1400);
      }}
    >
      <TypeIcon type={type} size="sheet" slash={slash} title={false} />
    </span>
  );
}

function MatchupPopover({ tip }: { tip: Tip | null }) {
  if (typeof document === "undefined") return null;

  const incoming = Boolean(
    tip && (tip.tone === "onYou" || tip.tone === "resist" || (tip.tone === "immune" && tip.dir === "in")),
  );
  const from = tip ? (incoming ? tip.other : tip.host) : "normal";
  const into = tip ? (incoming ? tip.host : tip.other) : "normal";
  const match = tip ? MATCH[tip.tone] : MATCH.onYou;
  const glow = tip ? TONE[tip.tone].glow : TONE.onYou.glow;
  const placeBelow = tip ? tip.y < 108 : false;
  const left = tip ? Math.min(Math.max(tip.x, 124), window.innerWidth - 124) : 0;
  const top = tip ? (placeBelow ? tip.y + tip.h + 10 : tip.y - 10) : 0;

  return createPortal(
    <MotionConfig reducedMotion="user">
      <AnimatePresence>
        {tip ? (
          <motion.div
            key="sheet-tip"
            role="tooltip"
            initial={{ opacity: 0, y: placeBelow ? -6 : 6, filter: "blur(5px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            exit={{ opacity: 0, y: placeBelow ? -4 : 4, filter: "blur(4px)" }}
            transition={{ duration: motionTokens.feedback, ease: easeOut }}
            className="pointer-events-none fixed z-[60]"
            style={{
              left,
              top,
              transform: placeBelow ? "translate(-50%, 0)" : "translate(-50%, -100%)",
            }}
          >
            <div
              className="w-[13.5rem] rounded-2xl px-3.5 py-3 shadow-[0_12px_32px_rgba(0,0,0,0.45)]"
              style={{ background: "#1c243c" }}
            >
              <div className="flex items-center gap-2">
                <TypeIcon type={from} size="sm" slash={Boolean(tip.slash && incoming)} title={false} />
                <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-[#9aa3bc]">into</span>
                <TypeIcon type={into} size="sm" slash={Boolean(tip.slash && !incoming)} title={false} />
              </div>
              <p
                className="mt-2.5 font-mono text-[28px] font-semibold leading-none tracking-tight"
                style={{ color: glow }}
              >
                {match.mult}
              </p>
              <p className="mt-1.5 text-[13px] font-medium leading-snug" style={{ color: glow }}>
                {match.call}
              </p>
              <p className="mt-0.5 font-mono text-[11px] uppercase tracking-[0.1em] text-[#c5cbe0]">{match.damage}</p>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </MotionConfig>,
    document.body,
  );
}

function RailMark({ kind, color }: { kind: Dir; color: string }) {
  return (
    <svg viewBox="0 0 22 12" className="h-3 w-[22px] shrink-0" aria-hidden>
      {kind === "in" ? (
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
    <ul className="grid grid-cols-2 gap-x-4 gap-y-3 border-b border-black/25 bg-[#243056] px-4 py-3.5 sm:px-5">
      <LegendItem tone="onYou" dir="in" sample="fighting" {...MATCH.onYou} />
      <LegendItem tone="youHit" dir="out" sample="fire" {...MATCH.youHit} />
      <LegendItem tone="resist" dir="in" sample="steel" {...MATCH.resist} />
      <LegendItem tone="youSoft" dir="out" sample="rock" {...MATCH.youSoft} />
      <LegendItem tone="immune" sample="ghost" slash className="col-span-2" {...MATCH.immune} phrase="No effect (← into you, → you into them)" />
    </ul>
  );
}

function LegendItem({
  tone,
  dir,
  sample,
  slash,
  mult,
  damage,
  phrase,
  className,
}: {
  tone: Tone;
  dir?: Dir;
  sample: TypeId;
  slash?: boolean;
  mult: string;
  damage: string;
  phrase: string;
  className?: string;
}) {
  const { fill, glow } = TONE[tone];
  return (
    <li className={`flex min-w-0 items-center gap-2 ${className ?? ""}`}>
      {dir ? <RailMark kind={dir} color={glow} /> : null}
      <span className="inline-flex items-center rounded-full px-1.5 py-1" style={{ background: fill }}>
        <TypeIcon type={sample} size="sheet" slash={slash} title={false} />
      </span>
      <span className="min-w-0">
        <span className="flex flex-wrap items-baseline gap-x-1.5">
          <span className="font-mono text-[15px] font-semibold leading-none tracking-tight" style={{ color: glow }}>
            {mult}
          </span>
          <span className="font-mono text-[10px] font-medium uppercase tracking-[0.1em] text-[#f4f1ea]">{damage}</span>
        </span>
        <span className="mt-0.5 block font-mono text-[10px] leading-tight uppercase tracking-[0.08em] text-[#c5cbe0] sm:text-[11px]">
          {phrase}
        </span>
      </span>
    </li>
  );
}
