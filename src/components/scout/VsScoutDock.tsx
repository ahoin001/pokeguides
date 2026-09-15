"use client";

import { useState, type ReactNode } from "react";
import { motion, useDragControls } from "motion/react";
import { DotsSixVertical } from "@phosphor-icons/react";
import { cssVars } from "@/lib/champions/palette";
import type { ScoutTeamResult } from "@/lib/champions/vs";
import { motionTokens } from "@/components/motion/tokens";
import { SafeSwitchCallout } from "@/components/scout/SafeSwitchCallout";
import { VsSlotCard } from "@/components/scout/VsSlotCard";
import { VsSpeRace } from "@/components/scout/VsSpeRace";
import type { CatalogEntry } from "@/types/pokemon";

export type DockCorner = "tr" | "br";

function cornerFromPoint(y: number): DockCorner {
  return y < window.innerHeight / 2 ? "tr" : "br";
}

function dockClass(corner: DockCorner, dragging: boolean) {
  const place =
    corner === "tr"
      ? "top-3 md:top-[4.75rem]"
      : "bottom-[4.5rem] md:bottom-6";
  const lift = dragging
    ? "shadow-[0_24px_64px_rgba(0,0,0,0.48)]"
    : "shadow-[0_18px_50px_rgba(0,0,0,0.35)]";
  return `fixed inset-x-3 z-50 max-h-[70vh] overflow-auto rounded-[28px] border border-line bg-bg/95 p-3 backdrop-blur-md md:inset-x-auto md:right-6 md:w-[min(42rem,calc(100vw-3rem))] md:p-4 ${place} ${lift}`;
}

export function VsScoutDock({
  corner,
  onCorner,
  dockOpen,
  onToggleOpen,
  chrome,
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
  focusFoe: CatalogEntry | undefined;
  focusReport: ScoutTeamResult | null;
  ourMons: CatalogEntry[];
  hasMoves: boolean;
}) {
  const dragControls = useDragControls();
  const [dragging, setDragging] = useState(false);
  const [hoverCorner, setHoverCorner] = useState<DockCorner>(corner);
  const live = dragging ? hoverCorner : corner;
  const liveLabel = live === "tr" ? "top right" : "bottom right";

  function moveTo(next: DockCorner) {
    onCorner(next);
    setHoverCorner(next);
  }

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
      className={dockClass(corner, dragging)}
    >
      <div className="mb-2 flex items-center gap-1">
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
          onClick={onToggleOpen}
          className="rounded-full px-3 py-1 text-xs text-muted hover:bg-white/8"
        >
          {dockOpen ? "Collapse" : "Expand"}
        </button>
      </div>
      {chrome}
      {dockOpen && focusFoe && focusReport ? (
        <div className="mt-3 space-y-3" style={cssVars(focusFoe.palette)}>
          <SafeSwitchCallout
            slug={focusReport.safeSwitchSlug}
            holes={focusReport.sharedHoles}
            compact
          />
          {ourMons.length ? <VsSpeRace ours={ourMons} foe={focusFoe} compact /> : null}
          <div className="grid gap-2 sm:grid-cols-3">
            {focusReport.slots.map((slot) => (
              <VsSlotCard key={slot.slug} result={slot} hasMoves={hasMoves} compact />
            ))}
          </div>
        </div>
      ) : null}
    </motion.div>
  );
}
