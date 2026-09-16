import type { CSSProperties, ReactNode } from "react";

export type PageVariant = "reading" | "tool" | "board";
export type StickyStack = "shell" | "local";

const VARIANT_MAX: Record<PageVariant, string> = {
  reading: "max-w-3xl",
  tool: "max-w-5xl",
  board: "max-w-none",
};

const LOCAL_STICKY = "52px";

/** ManualToc / LessonNav — sits under the shell header. */
export const STICKY_LOCAL_BAR =
  "pointer-events-none sticky z-30 top-[var(--sticky-shell)] -mx-4 -mt-6 border-b border-line/70 bg-bg/90 px-4 py-2 backdrop-blur-md md:-mx-6 md:-mt-10 md:px-6";

/** Notes / scout chrome — sits under shell + optional local bar. */
export const STICKY_AFTER_STACK = "sticky z-20 top-[var(--sticky-stack)]";

export const SCROLL_UNDER_STACK = "scroll-mt-[calc(var(--sticky-stack)+0.75rem)]";

export function PageFrame({
  variant = "board",
  sticky = "shell",
  children,
  className = "",
  style,
}: {
  variant?: PageVariant;
  sticky?: StickyStack;
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
}) {
  return (
    <div
      data-page-frame={variant}
      data-sticky={sticky}
      className={`mx-auto w-full ${VARIANT_MAX[variant]} ${className}`}
      style={
        {
          "--sticky-local": sticky === "local" ? LOCAL_STICKY : "0px",
          ...style,
        } as CSSProperties
      }
    >
      {children}
    </div>
  );
}
