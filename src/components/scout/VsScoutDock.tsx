"use client";

import { useCallback, useEffect, useRef, useState, type PointerEvent as ReactPointerEvent, type ReactNode } from "react";
import { motion, useDragControls } from "motion/react";
import { CaretDown, CaretUp, DotsSixVertical } from "@phosphor-icons/react";
import { cssVars } from "@/lib/champions/palette";
import type { ScoutTeamResult } from "@/lib/champions/vs";
import { motionTokens } from "@/components/motion/tokens";
import { SafeSwitchCallout } from "@/components/scout/SafeSwitchCallout";
import { SpeRaceLegend, VsSpeRace } from "@/components/scout/VsSpeRace";
import { VsSlotCard } from "@/components/scout/VsSlotCard";
import type { CatalogEntry } from "@/types/pokemon";

export type DockCorner = "tr" | "br";

const SIZE_KEY = "ringside-vs-scout-dock-size";
const MIN_W = 320;
const MIN_H = 220;
const DEFAULT_W = 672;

type DockSize = { w: number; h: number };

function clamp(n: number, min: number, max: number) {
  return Math.min(max, Math.max(min, n));
}

function maxWidth() {
  if (typeof window === "undefined") return DEFAULT_W;
  return Math.max(MIN_W, window.innerWidth - 24);
}

function maxHeight() {
  if (typeof window === "undefined") return 560;
  return Math.max(MIN_H, Math.floor(window.innerHeight * 0.85));
}

function defaultSize(): DockSize {
  return {
    w: Math.min(DEFAULT_W, maxWidth()),
    h: Math.min(Math.floor(typeof window !== "undefined" ? window.innerHeight * 0.62 : 480), maxHeight()),
  };
}

function readSize(): DockSize {
  try {
    const raw = sessionStorage.getItem(SIZE_KEY);
    if (!raw) return defaultSize();
    const parsed = JSON.parse(raw) as Partial<DockSize>;
    if (typeof parsed.w !== "number" || typeof parsed.h !== "number") return defaultSize();
    return {
      w: clamp(parsed.w, MIN_W, maxWidth()),
      h: clamp(parsed.h, MIN_H, maxHeight()),
    };
  } catch {
    return defaultSize();
  }
}

function writeSize(size: DockSize) {
  try {
    sessionStorage.setItem(SIZE_KEY, JSON.stringify(size));
  } catch {
    /* ignore */
  }
}

function cornerFromPoint(y: number): DockCorner {
  return y < window.innerHeight / 2 ? "tr" : "br";
}

function dockPlace(corner: DockCorner) {
  return corner === "tr" ? "top-3 md:top-[4.75rem]" : "bottom-[4.5rem] md:bottom-6";
}

export function VsScoutDock({
  corner,
  onCorner,
  dockOpen,
  onToggleOpen,
  chrome,
  chromeCollapsed,
  onToggleChrome,
  onCloseSearch,
  pickerOpen,
  focusFoe,
  focusReport,
  ourMons,
  hasMoves,
}: {
  corner: DockCorner;
  onCorner: (corner: DockCorner) => void;
  dockOpen: boolean;
  onToggleOpen: () => void;
  chrome: ReactNode;
  chromeCollapsed: boolean;
  onToggleChrome: () => void;
  onCloseSearch: () => void;
  pickerOpen: boolean;
  focusFoe: CatalogEntry | undefined;
  focusReport: ScoutTeamResult | null;
  ourMons: CatalogEntry[];
  hasMoves: boolean;
}) {
  const dragControls = useDragControls();
  const [dragging, setDragging] = useState(false);
  const [hoverCorner, setHoverCorner] = useState<DockCorner>(corner);
  const [size, setSize] = useState<DockSize>(defaultSize);
  const [hydrated, setHydrated] = useState(false);
  const resizeRef = useRef<{
    pointerId: number;
    startX: number;
    startY: number;
    startW: number;
    startH: number;
    corner: DockCorner;
  } | null>(null);

  const live = dragging ? hoverCorner : corner;
  const liveLabel = live === "tr" ? "top right" : "bottom right";

  useEffect(() => {
    setSize(readSize());
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    writeSize(size);
  }, [size, hydrated]);

  useEffect(() => {
    function onResize() {
      setSize((s) => ({
        w: clamp(s.w, MIN_W, maxWidth()),
        h: clamp(s.h, MIN_H, maxHeight()),
      }));
    }
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  function moveTo(next: DockCorner) {
    onCorner(next);
    setHoverCorner(next);
  }

  const onResizeMove = useCallback((e: PointerEvent) => {
    const job = resizeRef.current;
    if (!job || e.pointerId !== job.pointerId) return;
    const dx = job.startX - e.clientX; // drag left → wider (right-docked)
    const dy =
      job.corner === "tr" ? e.clientY - job.startY : job.startY - e.clientY;
    setSize({
      w: clamp(job.startW + dx, MIN_W, maxWidth()),
      h: clamp(job.startH + dy, MIN_H, maxHeight()),
    });
  }, []);

  const onResizeUp = useCallback(
    (e: PointerEvent) => {
      const job = resizeRef.current;
      if (!job || e.pointerId !== job.pointerId) return;
      resizeRef.current = null;
      window.removeEventListener("pointermove", onResizeMove);
      window.removeEventListener("pointerup", onResizeUp);
      window.removeEventListener("pointercancel", onResizeUp);
    },
    [onResizeMove],
  );

  function startResize(e: ReactPointerEvent<HTMLButtonElement>) {
    e.preventDefault();
    e.stopPropagation();
    resizeRef.current = {
      pointerId: e.pointerId,
      startX: e.clientX,
      startY: e.clientY,
      startW: size.w,
      startH: size.h,
      corner,
    };
    window.addEventListener("pointermove", onResizeMove);
    window.addEventListener("pointerup", onResizeUp);
    window.addEventListener("pointercancel", onResizeUp);
  }

  const lift = dragging
    ? "shadow-[0_24px_64px_rgba(0,0,0,0.48)]"
    : "shadow-[0_18px_50px_rgba(0,0,0,0.35)]";

  return (
    <motion.div
      layout={!dragging}
      drag="y"
      dragControls={dragControls}
      dragListener={false}
      dragMomentum={false}
      onDragStart={() => {
        setDragging(true);
        setHoverCorner(corner);
      }}
      onDrag={(_, info) => setHoverCorner(cornerFromPoint(info.point.y))}
      onDragEnd={(_, info) => {
        moveTo(cornerFromPoint(info.point.y));
        setDragging(false);
      }}
      animate={dragging ? undefined : { y: 0 }}
      transition={{ type: "spring", stiffness: motionTokens.spring.stiffness, damping: motionTokens.spring.damping }}
      style={{
        width: hydrated ? size.w : undefined,
        height: dockOpen ? (hydrated ? size.h : undefined) : undefined,
        maxWidth: "calc(100vw - 1.5rem)",
        maxHeight: "85vh",
      }}
      className={`fixed inset-x-3 z-50 flex flex-col overflow-hidden rounded-[28px] border border-line bg-bg/95 p-3 backdrop-blur-md md:inset-x-auto md:right-6 md:p-4 ${dockPlace(corner)} ${lift}`}
    >
      <div className="mb-2 flex shrink-0 items-center gap-1">
        <button
          type="button"
          aria-label={`Move pinned scout. Currently ${liveLabel}. Drag, or press Arrow Up or Arrow Down.`}
          onPointerDown={(e) => {
            e.preventDefault();
            dragControls.start(e);
          }}
          onKeyDown={(e) => {
            if (e.key === "ArrowUp") {
              e.preventDefault();
              moveTo("tr");
            } else if (e.key === "ArrowDown") {
              e.preventDefault();
              moveTo("br");
            }
          }}
          className={`touch-none rounded-full p-1.5 text-muted hover:bg-white/8 hover:text-ink ${
            dragging ? "cursor-grabbing" : "cursor-grab"
          }`}
        >
          <DotsSixVertical size={18} weight="bold" />
        </button>
        <p className="min-w-0 flex-1 font-mono text-[10px] uppercase tracking-[0.14em] text-muted">
          {dragging ? `Pin ${liveLabel}` : "Pinned scout"}
        </p>
        <span className="sr-only" aria-live="polite">
          Scout pinned to {liveLabel}
        </span>
        <button
          type="button"
          onClick={() => {
            if (!chromeCollapsed && pickerOpen) onCloseSearch();
            onToggleChrome();
          }}
          className="inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs text-muted hover:bg-white/8"
        >
          {chromeCollapsed ? (
            <>
              Show search <CaretDown size={12} weight="bold" />
            </>
          ) : (
            <>
              Hide search <CaretUp size={12} weight="bold" />
            </>
          )}
        </button>
        <button
          type="button"
          onClick={onToggleOpen}
          className="rounded-full px-3 py-1 text-xs text-muted hover:bg-white/8"
        >
          {dockOpen ? "Collapse" : "Expand"}
        </button>
      </div>

      <div className="min-h-0 flex-1 space-y-3 overflow-auto [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {!chromeCollapsed ? <div className="space-y-3">{chrome}</div> : null}

        {dockOpen ? (
          <>
            <div>
              <p className="mb-1.5 font-mono text-[10px] uppercase tracking-[0.14em] text-muted">
                Speed legend
              </p>
              <SpeRaceLegend compact />
            </div>

            {focusFoe && focusReport ? (
              <div className="space-y-3" style={cssVars(focusFoe.palette)}>
                <SafeSwitchCallout
                  slug={focusReport.safeSwitchSlug}
                  holes={focusReport.sharedHoles}
                  compact
                />
                {ourMons.length ? (
                  <VsSpeRace ours={ourMons} foe={focusFoe} compact showLegend={false} />
                ) : null}
                <div className="grid gap-2 sm:grid-cols-3">
                  {focusReport.slots.map((slot) => (
                    <VsSlotCard key={slot.slug} result={slot} hasMoves={hasMoves} compact />
                  ))}
                </div>
              </div>
            ) : (
              <p className="text-sm text-muted">
                {chromeCollapsed
                  ? "Show search to pick an opponent, then expand for the full read."
                  : "Search an opponent to see speed races and matchups."}
              </p>
            )}
          </>
        ) : null}
      </div>

      {dockOpen ? (
        <button
          type="button"
          aria-label="Resize pinned scout"
          onPointerDown={startResize}
          className={`absolute z-10 flex h-5 w-5 touch-none items-center justify-center rounded-sm text-muted hover:bg-white/10 hover:text-ink ${
            corner === "tr" ? "bottom-1.5 left-1.5 cursor-nesw-resize" : "left-1.5 top-1.5 cursor-nwse-resize"
          }`}
        >
          <span
            aria-hidden
            className="block h-2.5 w-2.5 border-b-2 border-l-2 border-current opacity-70"
          />
        </button>
      ) : null}
    </motion.div>
  );
}
