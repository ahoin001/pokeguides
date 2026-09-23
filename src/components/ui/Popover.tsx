"use client";

import {
  useEffect,
  useId,
  useLayoutEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { panelIn } from "@/components/motion/tokens";

export type PopoverAlign = "start" | "center" | "end";
export type PopoverVariant = "default" | "battle";

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
  /** `battle` uses transparent shell — child supplies MoveDetailPanel glass. */
  variant?: PopoverVariant;
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
 * Keeps the panel inside the viewport (shifts horizontally when near edges).
 */
export function Popover({
  open,
  onOpenChange,
  trigger,
  children,
  align = "end",
  role = "menu",
  variant = "default",
  className = "",
  panelClassName = "",
  widthClassName = "w-[min(100vw-2rem,22rem)]",
}: PopoverProps) {
  const root = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const panelId = useId();
  const reduce = useReducedMotion();
  const battle = variant === "battle";
  const [shiftX, setShiftX] = useState(0);

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

  useLayoutEffect(() => {
    if (!open) {
      setShiftX(0);
      return;
    }
    const panel = panelRef.current;
    if (!panel) return;

    function clamp() {
      const el = panelRef.current;
      if (!el) return;
      // Reset before measuring so we don't compound previous shifts.
      el.style.marginLeft = "0px";
      const rect = el.getBoundingClientRect();
      const margin = 12;
      const vw = window.innerWidth;
      let dx = 0;
      if (rect.left < margin) dx = margin - rect.left;
      else if (rect.right > vw - margin) dx = vw - margin - rect.right;
      setShiftX(dx);
      el.style.marginLeft = dx ? `${dx}px` : "0px";
    }

    clamp();
    window.addEventListener("resize", clamp);
    return () => window.removeEventListener("resize", clamp);
  }, [open, children, align, widthClassName]);

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
            ref={panelRef}
            id={panelId}
            role={role}
            initial={reduce ? false : panelIn.initial}
            animate={panelIn.animate}
            exit={reduce ? undefined : panelIn.exit}
            transition={panelIn.transition}
            style={shiftX ? { marginLeft: shiftX } : undefined}
            className={`absolute top-[calc(100%+0.5rem)] z-40 max-w-[calc(100vw-1.5rem)] ${ALIGN[align]} ${widthClassName}`}
          >
            <div
              className={
                battle
                  ? `p-0 ${panelClassName}`
                  : `rounded-2xl border border-line bg-bg p-2 shadow-[var(--shadow)] ${panelClassName}`
              }
            >
              {children}
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
