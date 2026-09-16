"use client";

import { AnimatePresence, motion } from "motion/react";
import { easeOut, motionTokens } from "@/components/motion/tokens";
import { PokemonArt } from "@/components/pokemon/PokemonArt";
import { TypeBadge } from "@/components/pokemon/TypeBadge";
import { VsOpponentTray } from "@/components/scout/VsOpponentTray";
import { pokemonFromSearch } from "@/lib/catalog/client-search";
import type { CatalogEntry } from "@/types/pokemon";

export function VsScoutChrome({
  foes,
  focusSlug,
  onFocus,
  onRemove,
  onClear,
  pickerOpen,
  onTogglePicker,
  canAdd,
  docked,
  onToggleDock,
  recent,
  suggested = [],
  onPickRecent,
  q,
  onQuery,
  results,
  opponentSlugs,
  onToggleResult,
}: {
  foes: CatalogEntry[];
  focusSlug: string | null;
  onFocus: (slug: string) => void;
  onRemove: (slug: string) => void;
  onClear: () => void;
  pickerOpen: boolean;
  onTogglePicker: () => void;
  canAdd: boolean;
  docked: boolean;
  onToggleDock: () => void;
  recent: string[];
  suggested?: string[];
  onPickRecent: (slug: string, selected: boolean) => void;
  q: string;
  onQuery: (value: string) => void;
  results: CatalogEntry[];
  opponentSlugs: string[];
  onToggleResult: (slug: string, selected: boolean) => void;
}) {
  const chips = [...suggested, ...recent.filter((s) => !suggested.includes(s))];

  return (
    <>
      <VsOpponentTray
        foes={foes}
        focusSlug={focusSlug}
        onFocus={onFocus}
        onRemove={onRemove}
        onClear={onClear}
        onTogglePicker={onTogglePicker}
        pickerOpen={pickerOpen}
        canAdd={canAdd}
        docked={docked}
        onToggleDock={onToggleDock}
      />
      <AnimatePresence initial={false}>
        {chips.length && !pickerOpen ? (
          <motion.ul
            key="chips"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: motionTokens.state, ease: easeOut }}
            className="flex flex-wrap gap-2 overflow-hidden px-1"
          >
            {chips.map((slug) => {
              const p = pokemonFromSearch(slug);
              if (!p) return null;
              const selected = opponentSlugs.includes(slug);
              const blocked = !selected && !canAdd;
              return (
                <li key={slug}>
                  <button
                    type="button"
                    disabled={blocked}
                    onClick={() => onPickRecent(slug, selected)}
                    className={`rounded-full px-3 py-1 text-sm disabled:opacity-40 ${
                      selected ? "bg-ink text-bg" : "bg-white/6 text-muted hover:bg-white/10"
                    }`}
                  >
                    {p.name}
                  </button>
                </li>
              );
            })}
          </motion.ul>
        ) : null}
      </AnimatePresence>
      <AnimatePresence initial={false}>
        {pickerOpen ? (
          <motion.div
            key="picker"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: motionTokens.state, ease: easeOut }}
            className="rounded-[24px] border border-line bg-bg/95 p-4 backdrop-blur-md"
          >
            <input
              value={q}
              onChange={(e) => onQuery(e.target.value)}
              placeholder={canAdd ? "Search the legal roster" : "Three selected — remove one to add another"}
              disabled={!canAdd}
              className="w-full rounded-2xl border border-line bg-sunken px-4 py-3 text-ink outline-none placeholder:text-muted focus:border-ink/40 disabled:opacity-50"
              autoFocus
            />
            <ul className="mt-2 max-h-56 overflow-auto [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              {results.map((p) => {
                const selected = opponentSlugs.includes(p.slug);
                const blocked = !selected && !canAdd;
                return (
                  <li key={p.slug}>
                    <button
                      type="button"
                      disabled={blocked}
                      onClick={() => onToggleResult(p.slug, selected)}
                      className="flex w-full items-center justify-between gap-3 rounded-xl px-3 py-2 text-left hover:bg-white/5 disabled:opacity-40"
                    >
                      <span className="flex items-center gap-3">
                        <PokemonArt slug={p.slug} src={p.sprite || p.artwork} name={p.name} size={36} />
                        <span>
                          {p.name}
                          {selected ? (
                            <span className="ml-2 text-xs text-muted">· selected · tap to remove</span>
                          ) : null}
                        </span>
                      </span>
                      <span className="flex gap-1">
                        {p.types.map((t) => (
                          <TypeBadge key={t} type={t} size="sm" />
                        ))}
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  );
}
