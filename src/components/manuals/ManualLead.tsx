"use client";

import { useState, type ReactNode } from "react";
import { AnimatePresence, motion } from "motion/react";
import { CaretDown } from "@phosphor-icons/react";
import { easeOut, motionTokens } from "@/components/motion/tokens";

export function ManualLead({
  thesis,
  rule,
  fail,
  failLabel = "Never.",
  philosophy,
  meta,
  lessons,
}: {
  thesis?: string;
  rule?: string;
  fail?: string;
  failLabel?: string;
  philosophy?: string;
  meta?: string;
  lessons?: ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const theory = [philosophy?.trim(), meta?.trim()].filter((s): s is string => Boolean(s));
  if (!thesis && !rule && !fail && !theory.length) return null;

  return (
    <aside className="max-w-3xl overflow-hidden rounded-[28px] border border-line bg-raised/40">
      <div className="px-5 py-4">
        {thesis ? <p className="text-xl font-semibold tracking-tight md:text-2xl">{thesis}</p> : null}
        {lessons ? <div className="mt-3">{lessons}</div> : null}
      </div>
      {rule ? (
        <div className="border-t border-line/70 bg-ink/[0.04] px-5 py-3.5">
          <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.16em] text-[#9cbcff]">Rule</p>
          <p className="mt-1.5 text-[15px] leading-relaxed text-ink">{rule}</p>
        </div>
      ) : null}
      {fail ? (
        <div className="border-t border-[#d4a017]/30 bg-[color-mix(in_srgb,#d4a017_14%,transparent)] px-5 py-3.5">
          <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.16em] text-[#f0c040]">
            {failLabel.replace(/\.$/, "")}
          </p>
          <p className="mt-1.5 text-[15px] leading-relaxed text-ink">{fail}</p>
        </div>
      ) : null}
      {theory.length ? (
        <div className="border-t border-line/70 px-5 py-3">
          <button
            type="button"
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
            className="flex items-center gap-2 text-sm text-muted hover:text-ink"
          >
            <CaretDown
              size={14}
              weight="bold"
              className={`transition-transform ${open ? "rotate-0" : "-rotate-90"}`}
            />
            {open ? "Hide the theory" : "Why this three"}
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
                {philosophy?.trim() ? (
                  <p className="mt-3 max-w-prose text-[15px] leading-relaxed text-muted">{philosophy}</p>
                ) : null}
                {meta?.trim() ? <p className="mt-2 max-w-prose text-sm text-muted">{meta}</p> : null}
              </motion.div>
            ) : null}
          </AnimatePresence>
        </div>
      ) : null}
    </aside>
  );
}
