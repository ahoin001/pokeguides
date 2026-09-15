"use client";

import { motion } from "motion/react";
import { formatMult } from "@/lib/champions/vs";
import { easeOut, motionTokens } from "@/components/motion/tokens";

const TONE = {
  se: { fill: "color-mix(in srgb, #e23d7a 58%, #fff)", ink: "#c2185b" },
  hit: { fill: "color-mix(in srgb, #2a4a9a 52%, #fff)", ink: "#1c2a66" },
  soft: { fill: "color-mix(in srgb, #d4a017 62%, #fff)", ink: "#8a6a12" },
  immune: { fill: "color-mix(in srgb, #5a6478 28%, #fff)", ink: "#3d4556" },
  neutral: { fill: "color-mix(in srgb, #9aa0ad 22%, #fff)", ink: "#4a5366" },
} as const;

function toneFor(mult: number, lane: "out" | "in") {
  if (mult === 0) return TONE.immune;
  if (mult >= 4) return lane === "in" ? TONE.se : TONE.hit;
  if (mult > 1) return lane === "in" ? TONE.se : TONE.hit;
  if (mult < 1) return TONE.soft;
  return TONE.neutral;
}

export function MultChip({
  mult,
  lane,
  label,
  large = false,
}: {
  mult: number;
  lane: "out" | "in";
  label?: string;
  large?: boolean;
}) {
  const tone = toneFor(mult, lane);
  const loud = mult >= 4 || mult === 0;
  return (
    <motion.span
      initial={loud ? { scale: 0.86, opacity: 0.6 } : false}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: motionTokens.feedback, ease: easeOut }}
      className={`inline-flex items-center gap-1 rounded-full font-mono font-semibold tracking-tight ${
        large ? "px-2.5 py-1 text-sm" : "px-2 py-0.5 text-[11px]"
      } ${loud ? "ring-1 ring-ink/25" : ""}`}
      style={{ background: tone.fill, color: tone.ink }}
    >
      {label ? (
        <span className={`max-w-[10ch] truncate font-sans font-medium ${large ? "text-xs" : "text-[10px]"}`}>
          {label}
        </span>
      ) : null}
      {formatMult(mult)}
    </motion.span>
  );
}
