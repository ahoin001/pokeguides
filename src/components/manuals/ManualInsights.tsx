"use client";

import { useState } from "react";
import { AnimatePresence, MotionConfig, motion } from "motion/react";
import { CaretDown } from "@phosphor-icons/react";
import { MANUAL_SCROLL_MT } from "@/components/manuals/ManualToc";
import { easeOut, motionTokens } from "@/components/motion/tokens";
import type { ManualMatchup, ManualNote } from "@/content/manuals";

type PressItem = {
  key: string;
  title: string;
  how?: string;
  watch?: string;
  play?: string;
  rule?: string;
};

const LANE = {
  watch: "text-[#ff8aad] bg-[color-mix(in_srgb,#e23d7a_14%,transparent)]",
  play: "text-[#9cbcff] bg-[color-mix(in_srgb,#6b8cff_12%,transparent)]",
  rule: "text-[#f0c040] bg-[color-mix(in_srgb,#d4a017_14%,transparent)]",
  how: "text-muted bg-white/[0.03]",
} as const;

function Board({
  id,
  title,
  tone,
  items,
}: {
  id: string;
  title: string;
  tone: "good" | "bad";
  items: PressItem[];
}) {
  const [open, setOpen] = useState<string | null>(null);
  if (!items.length) return null;
  const wash =
    tone === "good"
      ? "color-mix(in srgb, #2a4a9a 16%, transparent)"
      : "color-mix(in srgb, #e23d7a 14%, transparent)";

  return (
    <section
      id={id}
      className={`${MANUAL_SCROLL_MT} overflow-hidden rounded-[24px] border border-line`}
      style={{ background: `linear-gradient(165deg, ${wash}, transparent 58%), var(--bg-raised)` }}
    >
      <div className="flex items-center justify-between gap-3 border-b border-line/70 px-4 py-3">
        <h3 className="text-lg font-semibold tracking-tight">{title}</h3>
        <span
          className={`rounded-full px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-[0.12em] ${
            tone === "good" ? "bg-[#2a4a9a]/35 text-[#9cbcff]" : "bg-[#e23d7a]/25 text-[#ff8aad]"
          }`}
        >
          {tone === "good" ? "Favored" : "Trap"}
        </span>
      </div>
      <ul>
        {items.map((item) => {
          const expanded = open === item.key;
          const lanes = [
            item.watch ? ({ label: "Watch", text: item.watch, tone: "watch" as const }) : null,
            item.play ? ({ label: "Do", text: item.play, tone: "play" as const }) : null,
            item.rule ? ({ label: "Never", text: item.rule, tone: "rule" as const }) : null,
            !item.watch && !item.play && !item.rule && item.how
              ? ({ label: tone === "good" ? "How you win" : "What happens", text: item.how, tone: "how" as const })
              : null,
          ].filter(Boolean) as { label: string; text: string; tone: keyof typeof LANE }[];

          return (
            <li key={item.key} className="border-t border-line/50 first:border-t-0">
              <button
                type="button"
                aria-expanded={expanded}
                onClick={() => setOpen((cur) => (cur === item.key ? null : item.key))}
                className="flex w-full items-start gap-3 px-4 py-3 text-left"
              >
                <CaretDown
                  size={14}
                  weight="bold"
                  className={`mt-1 shrink-0 text-muted transition-transform ${expanded ? "rotate-0" : "-rotate-90"}`}
                />
                <span className="min-w-0 flex-1">
                  <span className="block font-medium tracking-tight">{item.title}</span>
                  {!expanded && item.how ? (
                    <span className="mt-1 block line-clamp-1 text-sm text-muted">{item.how}</span>
                  ) : null}
                  {!expanded && !item.how && item.watch ? (
                    <span className="mt-1 block line-clamp-1 text-sm text-muted">{item.watch}</span>
                  ) : null}
                </span>
              </button>
              <AnimatePresence initial={false}>
                {expanded ? (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: motionTokens.layout, ease: easeOut }}
                    className="overflow-hidden"
                  >
                    <div className="space-y-0 border-t border-line/40">
                      {lanes.map((lane) => (
                        <div key={lane.label} className={`px-4 py-3 pl-11 ${LANE[lane.tone]}`}>
                          <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.14em]">
                            {lane.label}
                          </p>
                          <p className="mt-1.5 text-sm leading-relaxed text-ink/90">{lane.text}</p>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                ) : null}
              </AnimatePresence>
            </li>
          );
        })}
      </ul>
    </section>
  );
}

function mergeGood(victims: ManualMatchup[], advantages: ManualNote[]): PressItem[] {
  const out: PressItem[] = [];
  const seen = new Set<string>();
  for (const v of victims) {
    const key = v.name.trim().toLowerCase();
    if (!key || seen.has(key)) continue;
    seen.add(key);
    out.push({ key: `v-${v.name}`, title: v.name, how: v.why, play: v.play });
  }
  for (const a of advantages) {
    const key = a.title.trim().toLowerCase();
    if (!key || seen.has(key)) continue;
    seen.add(key);
    out.push({ key: `a-${a.title}`, title: a.title, how: a.body });
  }
  return out;
}

function mergeBad(counters: ManualMatchup[], hazards: ManualNote[]): PressItem[] {
  const out: PressItem[] = [];
  const seen = new Set<string>();
  for (const h of hazards) {
    const key = h.title.trim().toLowerCase();
    if (!key || seen.has(key)) continue;
    seen.add(key);
    out.push({
      key: `h-${h.title}`,
      title: h.title,
      how: h.body,
      watch: h.watch,
      play: h.play,
      rule: h.rule,
    });
  }
  for (const c of counters) {
    const key = c.name.trim().toLowerCase();
    if (!key || seen.has(key)) continue;
    seen.add(key);
    out.push({
      key: `c-${c.name}`,
      title: c.name,
      how: c.why,
      play: c.play,
      watch: c.trap,
    });
  }
  return out;
}

export function ManualInsights({
  victims,
  counters,
  advantages,
  hazards,
}: {
  victims: ManualMatchup[];
  counters: ManualMatchup[];
  advantages: ManualNote[];
  hazards: ManualNote[];
}) {
  const good = mergeGood(victims, advantages);
  const bad = mergeBad(counters, hazards);
  if (!good.length && !bad.length) return null;

  return (
    <MotionConfig reducedMotion="user">
      <div className="grid gap-4 md:grid-cols-2">
        <Board id="you-press" title="You press" tone="good" items={good} />
        <Board id="they-press" title="They press you" tone="bad" items={bad} />
      </div>
    </MotionConfig>
  );
}
