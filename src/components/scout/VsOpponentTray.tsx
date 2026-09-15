"use client";

import { AnimatePresence, LayoutGroup, motion } from "motion/react";
import type { CatalogEntry } from "@/types/pokemon";
import { cssVars } from "@/lib/champions/palette";
import { easeOut, motionTokens } from "@/components/motion/tokens";
import { PokemonArt } from "@/components/pokemon/PokemonArt";
import { TypeBadge } from "@/components/pokemon/TypeBadge";
import { TypeIcon } from "@/components/pokemon/TypeIcon";

const MAX_FOES = 3;

export function VsOpponentTray({
  foes,
  focusSlug,
  onFocus,
  onRemove,
  onClear,
  onTogglePicker,
  pickerOpen,
  canAdd,
  docked = false,
  onToggleDock,
}: {
  foes: CatalogEntry[];
  focusSlug: string | null;
  onFocus: (slug: string) => void;
  onRemove: (slug: string) => void;
  onClear: () => void;
  onTogglePicker: () => void;
  pickerOpen: boolean;
  canAdd: boolean;
  docked?: boolean;
  onToggleDock?: () => void;
}) {
  const wash = focusSlug
    ? foes.find((f) => f.slug === focusSlug)
    : foes.length === 1
      ? foes[0]
      : undefined;

  return (
    <motion.div
      layoutId="vs-scout-shell"
      transition={{ type: "spring", stiffness: 380, damping: 34 }}
      className="rounded-[28px] border border-line bg-bg/95 p-4 backdrop-blur-md"
      style={wash ? cssVars(wash.palette) : undefined}
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0 flex-1">
          {foes.length === 0 ? (
            <p className="text-sm text-muted">
              No opponent yet. Ranked names below, or search the roster — up to three.
            </p>
          ) : (
            <>
              <p className="text-xs font-medium uppercase tracking-wide text-muted">
                They have {foes.length}/{MAX_FOES}
              </p>
              <LayoutGroup>
                <ul className="mt-3 flex flex-wrap gap-3">
                  <AnimatePresence initial={false} mode="popLayout">
                    {foes.map((f) => {
                      const active = f.slug === focusSlug || foes.length === 1;
                      return (
                        <motion.li
                          key={f.slug}
                          layout
                          initial={{ opacity: 0, scale: 0.92 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.92 }}
                          transition={{ duration: motionTokens.state, ease: easeOut }}
                          className={`flex min-w-0 items-center gap-3 rounded-2xl border px-3 py-2 ${
                            active ? "border-ink/30 bg-[var(--mon-wash)]" : "border-line bg-raised/40"
                          }`}
                          style={cssVars(f.palette)}
                        >
                          <button
                            type="button"
                            onClick={() => onFocus(f.slug)}
                            className="flex min-w-0 items-center gap-3 text-left"
                          >
                            <PokemonArt
                              slug={f.slug}
                              src={f.artwork}
                              name={f.name}
                              size={56}
                              share
                            />
                            <span className="min-w-0">
                              <span className="block truncate text-base font-semibold tracking-tight">
                                {f.name}
                              </span>
                              <span className="mt-1 flex flex-wrap items-center gap-1.5">
                                {f.types.map((t) => (
                                  <span key={t} className="inline-flex items-center gap-1">
                                    <TypeIcon type={t} size="sm" />
                                    <TypeBadge type={t} size="sm" />
                                  </span>
                                ))}
                              </span>
                            </span>
                          </button>
                          <button
                            type="button"
                            aria-label={`Remove ${f.name}`}
                            onClick={() => onRemove(f.slug)}
                            className="shrink-0 rounded-full px-2 py-1 text-xs text-muted hover:bg-white/10 hover:text-ink"
                          >
                            ×
                          </button>
                        </motion.li>
                      );
                    })}
                  </AnimatePresence>
                </ul>
              </LayoutGroup>
            </>
          )}
        </div>

        <div className="flex shrink-0 flex-wrap gap-2">
          <button
            type="button"
            onClick={onTogglePicker}
            disabled={!canAdd && !pickerOpen}
            className="rounded-full bg-ink px-4 py-2 text-sm font-medium text-bg disabled:opacity-40"
          >
            {pickerOpen ? "Close" : foes.length ? (canAdd ? "Add opponent" : "Full (3)") : "Search opponent"}
          </button>
          {onToggleDock ? (
            <button
              type="button"
              onClick={onToggleDock}
              className="rounded-full border border-line px-4 py-2 text-sm text-muted"
            >
              {docked ? "Unpin" : "Pin scout"}
            </button>
          ) : null}
          {foes.length ? (
            <button
              type="button"
              onClick={onClear}
              className="rounded-full border border-line px-4 py-2 text-sm text-muted"
            >
              Clear
            </button>
          ) : null}
        </div>
      </div>
    </motion.div>
  );
}

export { MAX_FOES };
