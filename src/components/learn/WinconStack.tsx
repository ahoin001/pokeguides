"use client";

import { useState } from "react";
import { AnimatePresence, MotionConfig, motion } from "motion/react";
import { CaretDown } from "@phosphor-icons/react";
import type { ManualPlanBeat } from "@/content/manuals";
import { MANUAL_SCROLL_MT } from "@/components/manuals/ManualToc";
import { easeOut, motionTokens } from "@/components/motion/tokens";

type Stance = {
  id: "set" | "defend" | "push" | "play";
  label: string;
  doLabel: string;
  wash: string;
};

function stanceFor(title: string): Stance {
  const t = title.toLowerCase();
  if (t.includes("clock") || t.includes("preview") || t.includes("lead")) {
    return {
      id: "set",
      label: "Set",
      doLabel: "Open",
      wash: "color-mix(in srgb, var(--type-electric) 18%, transparent)",
    };
  }
  if (t.includes("shield") || t.includes("mid") || t.includes("pivot")) {
    return {
      id: "defend",
      label: "Defend",
      doLabel: "Switch / sit",
      wash: "color-mix(in srgb, var(--type-steel) 22%, transparent)",
    };
  }
  if (t.includes("clean") || t.includes("late") || t.includes("sweep")) {
    return {
      id: "push",
      label: "Push",
      doLabel: "Press",
      wash: "color-mix(in srgb, var(--type-fighting) 18%, transparent)",
    };
  }
  return {
    id: "play",
    label: "Play",
    doLabel: "Do",
    wash: "color-mix(in srgb, var(--mon-wash, #3f8f5b) 16%, transparent)",
  };
}

export function WinconStack({
  plan,
  heading = "Clock, shield, clean",
  lede = "",
  id = "plan",
}: {
  plan: ManualPlanBeat[];
  heading?: string;
  lede?: string;
  id?: string;
}) {
  const beats = plan.filter((b) => b.title || b.play || b.goal);
  const [openId, setOpenId] = useState<string | null>(null);

  if (!beats.length) return null;

  return (
    <MotionConfig reducedMotion="user">
      <section id={id} className={`mt-10 ${MANUAL_SCROLL_MT}`}>
        {heading ? <h2 className="text-2xl font-semibold tracking-tight">{heading}</h2> : null}
        {lede ? <p className="mt-2 max-w-prose text-sm text-muted">{lede}</p> : null}

        <ol className={`${heading || lede ? "mt-5" : "mt-6"} max-w-2xl list-none space-y-0`}>
          {beats.map((beat, i) => {
            const stance = stanceFor(beat.title || "");
            const last = i === beats.length - 1;
            const key = beat.title || `beat-${i}`;
            const open = openId === key;

            return (
              <li key={key} className="relative">
                <div
                  className="overflow-hidden rounded-[28px] border border-line"
                  style={{
                    background: `linear-gradient(165deg, ${stance.wash}, transparent 55%), var(--bg-raised)`,
                  }}
                >
                  <button
                    type="button"
                    aria-expanded={open}
                    onClick={() => setOpenId((cur) => (cur === key ? null : key))}
                    className="flex w-full items-start gap-3 px-5 py-3 text-left transition hover:bg-white/4"
                  >
                    <CaretDown
                      size={14}
                      weight="bold"
                      className={`mt-1.5 shrink-0 text-muted transition-transform ${
                        open ? "rotate-0" : "-rotate-90"
                      }`}
                    />
                    <span className="min-w-0 flex-1">
                      <span className="flex flex-wrap items-baseline justify-between gap-2">
                        <h3 className="text-lg font-semibold tracking-tight">{beat.title || "Beat"}</h3>
                        <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-muted">
                          {stance.label}
                        </span>
                      </span>
                      {!open && beat.goal ? (
                        <span className="mt-1 block truncate text-sm text-muted">{beat.goal}</span>
                      ) : null}
                    </span>
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
                        {beat.goal ? (
                          <div className="border-t border-line/60 bg-[color-mix(in_srgb,#6b8cff_10%,transparent)] px-5 py-4">
                            <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.16em] text-[#9cbcff]">
                              Goal
                            </p>
                            <p className="mt-1.5 text-[17px] font-semibold leading-snug tracking-tight">
                              {beat.goal}
                            </p>
                          </div>
                        ) : null}

                        {beat.play ? (
                          <div className="border-t border-line/60 px-5 py-4">
                            <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.16em] text-muted">
                              Play
                            </p>
                            <p className="mt-1.5 text-[15px] leading-relaxed text-ink/90">{beat.play}</p>
                          </div>
                        ) : null}

                        {beat.next ? (
                          <div className="border-t border-line/60 bg-white/[0.03] px-5 py-4">
                            <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.16em] text-muted">
                              {last ? "End" : "Next"}
                            </p>
                            <p className="mt-1.5 text-[15px] leading-relaxed text-muted">{beat.next}</p>
                          </div>
                        ) : null}
                      </motion.div>
                    ) : null}
                  </AnimatePresence>
                </div>

                {!last ? (
                  <div className="relative flex flex-col items-center py-1" aria-hidden>
                    <span className="block h-3 w-px bg-line" />
                    <FlowArrow />
                    <span className="block h-3 w-px bg-line" />
                  </div>
                ) : null}
              </li>
            );
          })}
        </ol>
      </section>
    </MotionConfig>
  );
}

function FlowArrow() {
  return (
    <svg viewBox="0 0 16 12" className="h-3 w-4 shrink-0 text-muted" aria-hidden>
      <path d="M8 11 1.5 2.5h13Z" fill="currentColor" />
    </svg>
  );
}
