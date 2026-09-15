"use client";

import { useState } from "react";
import { AnimatePresence, MotionConfig, motion } from "motion/react";
import { CaretDown } from "@phosphor-icons/react";
import { MANUAL_SCROLL_MT } from "@/components/manuals/ManualToc";
import { easeOut, motionTokens } from "@/components/motion/tokens";

export function ManualLoopStrip({ loops }: { loops: { title: string; body: string }[] }) {
  const [open, setOpen] = useState<number | null>(null);
  if (!loops.length) return null;

  return (
    <MotionConfig reducedMotion="user">
      <section id="loops" className={`mt-6 ${MANUAL_SCROLL_MT}`}>
        <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-muted">Loops</p>
        <ol className="mt-3 space-y-2">
          {loops.map((loop, i) => {
            const expanded = open === i;
            return (
              <li key={loop.title || i} className="overflow-hidden rounded-2xl border border-line bg-raised/40">
                <button
                  type="button"
                  aria-expanded={expanded}
                  onClick={() => setOpen((cur) => (cur === i ? null : i))}
                  className="flex w-full items-start gap-3 px-4 py-3 text-left"
                >
                  <CaretDown
                    size={14}
                    weight="bold"
                    className={`mt-1 shrink-0 text-muted transition-transform ${expanded ? "rotate-0" : "-rotate-90"}`}
                  />
                  <span className="min-w-0 flex-1">
                    <span className="font-semibold tracking-tight">{loop.title}</span>
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
                      <p className="border-t border-line/70 px-4 py-3 text-sm leading-relaxed text-muted">
                        {loop.body}
                      </p>
                    </motion.div>
                  ) : null}
                </AnimatePresence>
              </li>
            );
          })}
        </ol>
      </section>
    </MotionConfig>
  );
}
