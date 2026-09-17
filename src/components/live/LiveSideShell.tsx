import type { ReactNode } from "react";

/**
 * Shared Live side-panel chrome so Your six / Their six keep header, tools,
 * search, recents, and slot grids aligned whether empty or filled.
 */
export function LiveSideShell({
  eyebrow,
  title,
  lede,
  action,
  tools,
  search,
  recents,
  slots,
  footer,
}: {
  eyebrow: string;
  title: string;
  lede: string;
  action?: ReactNode;
  tools?: ReactNode;
  search: ReactNode;
  recents?: ReactNode;
  slots: ReactNode;
  footer?: ReactNode;
}) {
  return (
    <div className="flex h-full min-h-0 flex-col gap-3">
      <header className="min-h-[5.25rem]">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.14em] text-muted">
              {eyebrow}
            </p>
            <h2 className="mt-1 text-lg font-semibold tracking-tight">{title}</h2>
          </div>
          <div className="flex min-h-8 shrink-0 items-center justify-end">{action}</div>
        </div>
        <p className="mt-1 line-clamp-2 min-h-[2.5rem] max-w-[42ch] text-sm text-muted">{lede}</p>
      </header>

      <div className="flex min-h-10 items-center">{tools ?? <span className="text-xs text-muted/50">—</span>}</div>

      <div className="relative z-10">{search}</div>

      <div className="flex min-h-9 items-center">{recents}</div>

      <div className="min-h-[7.5rem]">{slots}</div>

      <div className="mt-auto min-h-[4.5rem] pt-1">{footer}</div>
    </div>
  );
}
