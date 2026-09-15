"use client";

import { useState } from "react";
import { AnimatePresence, MotionConfig, motion } from "motion/react";
import { CaretDown } from "@phosphor-icons/react";
import { MANUAL_SCROLL_MT } from "@/components/manuals/ManualToc";
import { easeOut, motionTokens } from "@/components/motion/tokens";
import type { ManualMatchup, ManualNote } from "@/content/manuals";

type InsightItem = { title: string; body: string };

function Group({
  id,
  title,
  items,
  wash,
}: {
  id: string;
  title: string;
  items: InsightItem[];
  wash: string;
}) {
  const [open, setOpen] = useState<string | null>(null);
  if (!items.length) return null;

  return (
    <section
      id={id}
      className={`${MANUAL_SCROLL_MT} overflow-hidden rounded-[24px] border border-line`}
      style={{ background: `linear-gradient(165deg, ${wash}, transparent 58%), var(--bg-raised)` }}
    >
      <h3 className="border-b border-line/70 px-4 py-3 text-lg font-semibold tracking-tight">{title}</h3>
      <ul>
        {items.map((item) => {
          const expanded = open === item.title;
          return (
            <li key={item.title} className="border-t border-line/50 first:border-t-0">
              <button
                type="button"
                aria-expanded={expanded}
                onClick={() => setOpen((cur) => (cur === item.title ? null : item.title))}
                className="flex w-full items-start gap-3 px-4 py-3 text-left"
              >
                <CaretDown
                  size={14}
                  weight="bold"
                  className={`mt-1 shrink-0 text-muted transition-transform ${expanded ? "rotate-0" : "-rotate-90"}`}
                />
                <span className="min-w-0 flex-1">
                  <span className="block font-medium tracking-tight">{item.title}</span>
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
                    <p className="px-4 pb-3 pl-11 text-sm leading-relaxed text-muted">{item.body}</p>
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
  const hasAny = victims.length || counters.length || advantages.length || hazards.length;
  if (!hasAny) return null;

  return (
    <MotionConfig reducedMotion="user">
      <section id="insights" className={`mt-10 ${MANUAL_SCROLL_MT}`}>
        <h2 className="text-2xl font-semibold tracking-tight">Insights</h2>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <Group
            id="victims"
            title="Notable victims"
            items={victims.map((v) => ({ title: v.name, body: v.why }))}
            wash="color-mix(in srgb, #2a4a9a 16%, transparent)"
          />
          <Group
            id="counters"
            title="Notable counters"
            items={counters.map((c) => ({ title: c.name, body: c.why }))}
            wash="color-mix(in srgb, #e23d7a 16%, transparent)"
          />
          <Group
            id="advantages"
            title="Advantages"
            items={advantages.map((a) => ({ title: a.title, body: a.body }))}
            wash="color-mix(in srgb, var(--type-electric) 14%, transparent)"
          />
          <Group
            id="hazards"
            title="Hazards"
            items={hazards.map((h) => ({ title: h.title, body: h.body }))}
            wash="color-mix(in srgb, var(--type-steel) 18%, transparent)"
          />
        </div>
      </section>
    </MotionConfig>
  );
}
