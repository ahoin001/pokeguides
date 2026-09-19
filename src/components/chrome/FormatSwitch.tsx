"use client";

import Link from "next/link";
import {
  FORMAT_BLURB,
  FORMAT_LABEL,
  learnHref,
  manualsHref,
  type BattleFormat,
} from "@/lib/format";

type FormatSwitchProps = {
  active: BattleFormat;
  /** Which dual surface this switch navigates — resolved client-side (no function props). */
  surface: "learn" | "manuals";
  /** Optional short context line under the switch. */
  hint?: string;
  className?: string;
  size?: "sm" | "md";
};

function hrefForSurface(surface: "learn" | "manuals", format: BattleFormat) {
  return surface === "manuals" ? manualsHref(format) : learnHref(format);
}

/**
 * Singles | Doubles classroom / shelf switch.
 * Not a global app format — only surfaces that own both tracks.
 */
export function FormatSwitch({
  active,
  surface,
  hint,
  className = "",
  size = "md",
}: FormatSwitchProps) {
  const pad = size === "sm" ? "px-3 py-1.5 text-xs" : "px-3.5 py-2 text-sm";
  return (
    <div className={className}>
      <div
        role="tablist"
        aria-label="Battle format"
        className="inline-flex rounded-full border border-line/80 bg-raised/50 p-1"
      >
        {(["singles", "doubles"] as const).map((format) => {
          const on = active === format;
          return (
            <Link
              key={format}
              href={hrefForSurface(surface, format)}
              role="tab"
              aria-selected={on}
              className={`rounded-full font-medium tracking-tight transition ${pad} ${
                on
                  ? format === "doubles"
                    ? "bg-teal-700 text-white shadow-sm dark:bg-teal-600"
                    : "bg-ink text-bg shadow-sm"
                  : "text-muted hover:text-ink"
              }`}
            >
              {FORMAT_LABEL[format]}
            </Link>
          );
        })}
      </div>
      {hint ? (
        <p className="mt-2 text-xs text-muted">{hint}</p>
      ) : (
        <p className="mt-2 text-xs text-muted">{FORMAT_BLURB[active]}</p>
      )}
    </div>
  );
}
