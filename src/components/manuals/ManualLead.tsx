"use client";

import { useState } from "react";
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
}: {
  thesis?: string;
  rule?: string;
  fail?: string;
  failLabel?: string;
  philosophy?: string;
  meta?: string;
}) {
  const [open, setOpen] = useState(false);
  const theory = [philosophy?.trim(), meta?.trim()].filter((s): s is string => Boolean(s));
  if (!thesis && !rule && !fail && !theory.length) return null;

  return (
    <aside className="mt-6 max-w-3xl rounded-[28px] border border-line bg-raised/40 px-5 py-4">
      {thesis ? <p className="font-semibold tracking-tight">{thesis}</p> : null}
      {rule ? <p className={`${thesis ? "mt-2" : ""} text-sm text-muted`}>{rule}</p> : null}
      {fail ? (
        <p className="mt-2 text-sm text-muted">
          <span className="font-medium text-ink">{failLabel} </span>
          {fail}
        </p>
      ) : null}
      {theory.length ? (
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
        </>
      ) : null}
    </aside>
  );
}
