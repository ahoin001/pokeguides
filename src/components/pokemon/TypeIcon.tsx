import { TYPE_LABEL } from "@/lib/champions/types";
import type { TypeId } from "@/types/pokemon";
import { TypeGlyph } from "./TypeGlyph";

const SIZE = {
  xs: "h-[18px] w-[18px]",
  sm: "h-6 w-6",
  sheet: "h-[26px] w-[26px] md:h-7 md:w-7",
  md: "h-8 w-8",
  lg: "h-11 w-11",
  hero: "h-[52px] w-[52px] md:h-14 md:w-14",
} as const;

export function TypeIcon({
  type,
  size = "md",
  slash = false,
  title,
}: {
  type: TypeId;
  size?: keyof typeof SIZE;
  slash?: boolean;
  /** Native tooltip. Pass `false` when a custom hover already explains the mark. */
  title?: string | false;
}) {
  const label = typeof title === "string" ? title : TYPE_LABEL[type];
  const compact = size === "xs" || size === "sm" || size === "sheet";
  return (
    <span
      title={title === false ? undefined : label}
      className={`relative inline-flex shrink-0 items-center justify-center rounded-full text-white ${SIZE[size]}`}
      style={{
        background: `var(--type-${type})`,
        boxShadow: "inset 0 1px 0 rgba(255,255,255,0.28), inset 0 -1px 0 rgba(0,0,0,0.22)",
      }}
    >
      <TypeGlyph
        type={type}
        className={`${compact ? "h-[70%] w-[70%]" : "h-[66%] w-[66%]"} ${compact ? "[filter:drop-shadow(0_0.5px_0_rgba(0,0,0,0.35))]" : ""}`}
      />
      {slash ? (
        <span className="pointer-events-none absolute inset-0 overflow-hidden rounded-full" aria-hidden>
          <span className="absolute top-1/2 left-[-18%] h-[2.4px] w-[136%] -translate-y-1/2 rotate-[-32deg] bg-[#141414]" />
        </span>
      ) : null}
      <span className="sr-only">{slash ? `${label}, no effect` : label}</span>
    </span>
  );
}
