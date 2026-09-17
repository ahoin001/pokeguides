"use client";

import { X } from "@phosphor-icons/react";
import { useMemo, useState } from "react";
import { getPokemon } from "@/lib/catalog/lookup";
import { cssVars } from "@/lib/champions/palette";
import { PokemonArt } from "@/components/pokemon/PokemonArt";
import { useLiveMatchStore } from "@/stores/live-match";
import { Popover } from "@/components/ui/Popover";

/** Save / load Live teams (1–6) for the clock. */
export function LiveBringPresets() {
  const bring = useLiveMatchStore((s) => s.bring);
  const bringMoves = useLiveMatchStore((s) => s.bringMoves);
  const presets = useLiveMatchStore((s) => s.bringPresets);
  const saveBringPreset = useLiveMatchStore((s) => s.saveBringPreset);
  const deleteBringPreset = useLiveMatchStore((s) => s.deleteBringPreset);
  const loadBring = useLiveMatchStore((s) => s.loadBring);
  const setBringMoves = useLiveMatchStore((s) => s.setBringMoves);
  const clearBringMoves = useLiveMatchStore((s) => s.clearBringMoves);
  const selectBring = useLiveMatchStore((s) => s.selectBring);

  const party = useMemo(() => bring.filter(Boolean), [bring]);
  const [name, setName] = useState("");
  const [open, setOpen] = useState(false);

  function save() {
    const label =
      name.trim() ||
      party
        .map((s) => getPokemon(s)?.name)
        .filter(Boolean)
        .join(" · ") ||
      "Bring";
    const id = saveBringPreset(label, party, bringMoves);
    if (id) {
      setName("");
      setOpen(true);
    }
  }

  function apply(id: string) {
    const preset = presets.find((p) => p.id === id);
    if (!preset) return;
    loadBring(preset.slugs);
    clearBringMoves();
    for (const slug of preset.slugs) {
      const moves = preset.moves[slug];
      if (moves?.length) setBringMoves(slug, moves);
    }
    if (preset.slugs[0]) selectBring(preset.slugs[0]);
    setOpen(false);
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      <Popover
        open={open}
        onOpenChange={setOpen}
        align="end"
        role="menu"
        trigger={({ open: isOpen, toggle, triggerProps }) => (
          <button
            type="button"
            {...triggerProps}
            onClick={toggle}
            className={`rounded-full border px-3 py-1.5 text-xs transition ${
              isOpen
                ? "border-ink/40 bg-white/8 text-ink"
                : "border-line text-muted hover:border-ink/40 hover:text-ink"
            }`}
          >
            Presets{presets.length ? ` (${presets.length})` : ""}
          </button>
        )}
      >
        {!presets.length ? (
          <p className="px-3 py-4 text-sm text-muted">
            Save any 1–6 on the field (and their moves) to recall later.
          </p>
        ) : (
          <ul className="max-h-72 space-y-1 overflow-y-auto">
            {presets.map((preset) => (
              <li key={preset.id}>
                <div className="flex items-center gap-1 rounded-xl px-1 py-1 hover:bg-white/5">
                  <button
                    type="button"
                    role="menuitem"
                    onClick={() => apply(preset.id)}
                    className="flex min-w-0 flex-1 items-center gap-2 rounded-lg px-2 py-1.5 text-left transition active:scale-[0.99]"
                  >
                    <span className="flex -space-x-2">
                      {preset.slugs.slice(0, 6).map((slug) => {
                        const p = getPokemon(slug);
                        if (!p) return null;
                        return (
                          <span
                            key={slug}
                            className="relative inline-flex rounded-full border border-bg"
                            style={cssVars(p.palette)}
                          >
                            <PokemonArt
                              slug={p.slug}
                              src={p.sprite || p.artwork}
                              name={p.name}
                              size={28}
                            />
                          </span>
                        );
                      })}
                    </span>
                    <span className="min-w-0">
                      <span className="block truncate text-sm font-medium">{preset.name}</span>
                      <span className="block truncate text-[11px] text-muted">
                        {preset.slugs.length} mon
                        {preset.slugs.length === 1 ? "" : "s"} ·{" "}
                        {preset.slugs
                          .map((s) => getPokemon(s)?.name)
                          .filter(Boolean)
                          .join(" · ")}
                      </span>
                    </span>
                  </button>
                  <button
                    type="button"
                    onClick={() => deleteBringPreset(preset.id)}
                    className="shrink-0 rounded-lg p-2 text-muted transition hover:bg-white/10 hover:text-ink active:scale-95"
                    title="Delete preset"
                    aria-label={`Delete ${preset.name}`}
                  >
                    <X size={14} weight="bold" />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </Popover>
      <button
        type="button"
        disabled={!party.length}
        onClick={save}
        className="rounded-full border border-line bg-raised/50 px-3 py-1.5 text-xs font-medium transition hover:border-ink/40 active:scale-[0.98] disabled:opacity-40"
      >
        Save team
      </button>
      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Optional name"
        className="min-w-[8rem] flex-1 rounded-full border border-line bg-bg/40 px-3 py-1.5 text-xs placeholder:text-muted/70 sm:max-w-[12rem]"
      />
    </div>
  );
}
