"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { Moon, Sun } from "@phosphor-icons/react";
import { easeOut, motionTokens } from "@/components/motion/tokens";
import { useThemeStore } from "@/stores/theme";

/** Top-right sun/moon control — flips light ↔ dark and persists the choice. */
export function ThemeToggle({ className = "" }: { className?: string }) {
  const theme = useThemeStore((s) => s.theme);
  const toggleTheme = useThemeStore((s) => s.toggleTheme);
  const reduce = useReducedMotion();
  const next = theme === "dark" ? "light" : "dark";

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={next === "light" ? "Switch to light mode" : "Switch to dark mode"}
      title={next === "light" ? "Light mode" : "Dark mode"}
      className={`relative grid h-9 w-9 place-items-center rounded-full border border-line bg-raised/60 text-muted transition hover:border-ink/35 hover:bg-overlay hover:text-ink active:scale-[0.96] ${className}`}
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={theme}
          initial={reduce ? false : { opacity: 0, rotate: -20, scale: 0.85 }}
          animate={{ opacity: 1, rotate: 0, scale: 1 }}
          exit={reduce ? undefined : { opacity: 0, rotate: 20, scale: 0.85 }}
          transition={{ duration: motionTokens.feedback, ease: easeOut }}
          className="grid place-items-center"
        >
          {theme === "dark" ? <Sun size={18} weight="bold" /> : <Moon size={18} weight="bold" />}
        </motion.span>
      </AnimatePresence>
    </button>
  );
}
