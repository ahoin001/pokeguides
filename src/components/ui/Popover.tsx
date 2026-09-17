"use client";

import {
  useEffect,
  useId,
  useRef,
  type ReactNode,
} from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { easeOut, motionTokens } from "@/components/motion/tokens";

export type PopoverAlign = "start" | "center" | "end";

type PopoverProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** Trigger control — receives open state + toggle. */
  trigger: (opts: {
    open: boolean;
    toggle: () => void;
    triggerProps: {
      "aria-expanded": boolean;
      "aria-controls": string;
      "aria-haspopup": "menu" | "dialog" | "true";
    };
  }) => ReactNode;
  children: ReactNode;
  align?: PopoverAlign;
  /** Panel role — menus use menu; lists/forms use dialog. */
  role?: "menu" | "dialog";
  className?: string;
  panelClassName?: string;
  /** Extra classes on the animated panel shell. */
  widthClassName?: string;
};

const ALIGN: Record<PopoverAlign, string> = {
  start: "left-0 origin-top-left",
  center: "left-1/2 -translate-x-1/2 origin-top",
  end: "right-0 origin-top-right",
};

/**
 * Lightweight popover: outside press + Escape dismiss, enter/exit motion.
 * Scale from the trigger corner — never from nothing.
 */
export function Popover({
  open,
  onOpenChange,
  trigger,
  children,
  align = "end",
  role = "menu",
  className = "",
  panelClassName = "",
  widthClassName = "w-[min(100vw-2rem,22rem)]",
}: PopoverProps) {
  const root = useRef<HTMLDivElement>(null);
  const panelId = useId();
  const reduce = useReducedMotion();

  useEffect(() => {
    if (!open) return;
    function onPointerDown(e: PointerEvent) {
      if (!root.current?.contains(e.target as Node)) onOpenChange(false);
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") {
        e.stopPropagation();
        onOpenChange(false);
      }
    }
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open, onOpenChange]);

  function toggle() {
    onOpenChange(!open);
  }

  return (
    <div ref={root} className={`relative ${className}`}>
      {trigger({
        open,
        toggle,
        triggerProps: {
          "aria-expanded": open,
          "aria-controls": panelId,
          "aria-haspopup": role === "menu" ? "menu" : "dialog",
        },
      })}
      <AnimatePresence>
        {open ? (
          <motion.div
            id={panelId}
            role={role}
            initial={reduce ? false : { opacity: 0, y: -4, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={reduce ? undefined : { opacity: 0, y: -4, scale: 0.96 }}
            transition={{ duration: motionTokens.state, ease: easeOut }}
            className={`absolute top-[calc(100%+0.5rem)] z-30 ${ALIGN[align]} ${widthClassName}`}
          >
            <div
              className={`rounded-2xl border border-line bg-bg p-2 shadow-[var(--shadow)] ${panelClassName}`}
            >
              {children}
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
