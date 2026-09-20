"use client";

import type { ButtonHTMLAttributes } from "react";
import { TypeGlyph } from "@/components/pokemon/TypeGlyph";
import { typeFillInkClass } from "@/components/moves/typeInk";
import type { TypeId } from "@/types/pokemon";

export type MoveChipSize = "sm" | "md";

type MoveChipProps = {
  name: string;
  type?: TypeId | null;
  /** Ladder share or other right-side meta (plays the “PP” slot). */
  meta?: string | null;
  selected?: boolean;
  size?: MoveChipSize;
  className?: string;
  title?: string;
  as?: "button" | "span";
} & Omit<ButtonHTMLAttributes<HTMLButtonElement>, "type" | "name" | "title">;

const SIZE: Record<MoveChipSize, { pad: string; text: string; glyph: string; meta: string }> = {
  sm: {
    pad: "gap-1 px-2 py-1",
    text: "text-[11px]",
    glyph: "h-3 w-3",
    meta: "text-[9px]",
  },
  md: {
    pad: "gap-1.5 px-2.5 py-1.5",
    text: "text-xs",
    glyph: "h-3.5 w-3.5",
    meta: "text-[10px]",
  },
};

/**
 * Champions-inspired type capsule: disc + name + optional meta strip.
 * Theme via `--type-*` and `--battle-select` / `--battle-meta-*`.
 */
export function MoveChip({
  name,
  type,
  meta,
  selected = false,
  size = "sm",
  className = "",
  title,
  as = "button",
  ...rest
}: MoveChipProps) {
  const s = SIZE[size];
  const typed = Boolean(type);
  const ink = type ? typeFillInkClass(type) : "text-ink";

  const shell = typed
    ? `inline-flex max-w-full items-center ${s.pad} rounded-full font-semibold tracking-tight ${s.text} ${ink} transition-[box-shadow,filter,transform] hover:brightness-110 active:scale-[0.98]`
    : `inline-flex max-w-full items-center ${s.pad} rounded-full border border-line/70 bg-raised/50 font-medium ${s.text} text-ink transition hover:border-ink/35 active:scale-[0.98]`;

  const selectedRing = selected
    ? "ring-2 ring-[var(--battle-select)] ring-offset-1 ring-offset-bg shadow-[0_0_0_1px_var(--battle-select)]"
    : "";

  const style = typed
    ? {
        background: `var(--type-${type})`,
        boxShadow: selected ? undefined : "inset 0 1px 0 rgba(255,255,255,0.22)",
      }
    : undefined;

  const body = (
    <>
      {type ? (
        <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-black/20">
          <TypeGlyph type={type} className={`${s.glyph} opacity-95`} />
        </span>
      ) : null}
      <span className="min-w-0 truncate">{name}</span>
      {meta ? (
        <span
          className={`shrink-0 font-mono tabular-nums ${s.meta} ${
            typed
              ? "-mr-0.5 ml-0.5 skew-x-[-8deg] rounded-sm bg-[var(--battle-meta-bg)] px-1.5 py-0.5 text-[var(--battle-meta-ink)]"
              : "text-muted"
          }`}
        >
          <span className="inline-block skew-x-[8deg]">{meta}</span>
        </span>
      ) : null}
    </>
  );

  if (as === "span") {
    return (
      <span className={`${shell} ${selectedRing} ${className}`} style={style} title={title}>
        {body}
      </span>
    );
  }

  return (
    <button
      type="button"
      title={title}
      className={`${shell} ${selectedRing} ${className}`}
      style={style}
      {...rest}
    >
      {body}
    </button>
  );
}
