"use client";

import { X } from "@phosphor-icons/react";
import { useMemo, useState } from "react";
import { getPokemon } from "@/lib/catalog/lookup";
import { cssVars } from "@/lib/champions/palette";
import { PokemonArt } from "@/components/pokemon/PokemonArt";
import { useTeamStore } from "@/stores/team";
import { useLiveMatchStore } from "@/stores/live-match";

/** Save / load bring threes for the Live clock. */
export function LiveBringPresets() {
  const slugs = useTeamStore((s) => s.slugs);
  const box = useTeamStore((s) => s.box);
  const loadThree = useTeamStore((s) => s.loadThree);
  const bringMoves = useLiveMatchStore((s) => s.bringMoves);
  const presets = useLiveMatchStore((s) => s.bringPresets);
  const saveBringPreset = useLiveMatchStore((s) => s.saveBringPreset);
  const deleteBringPreset = useLiveMatchStore((s) => s.deleteBringPreset);
  const setBringMoves = useLiveMatchStore((s) => s.setBringMoves);
  const clearBringMoves = useLiveMatchStore((s) => s.clearBringMoves);
  const selectBring = useLiveMatchStore((s) => s.selectBring);

  const bring = useMemo(() => slugs.filter(Boolean) as string[], [slugs]);
  const [name, setName] = useState("");
  const [open, setOpen] = useState(false);

  function save() {
    const label =
      name.trim() ||
      bring
        .map((s) => getPokemon(s)?.name)
        .filter(Boolean)
        .join(" · ") ||
      "Bring";
    const id = saveBringPreset(label, bring, bringMoves);
    if (id) {
      setName("");
      setOpen(true);
    }
  }

  function apply(id: string) {
    const preset = presets.find((p) => p.id === id);
    if (!preset) return;
    const boxFilled = box.filter(Boolean) as string[];
    loadThree(
      preset.slugs,
      undefined,
      null,
      boxFilled.length ? boxFilled : preset.slugs,
    );
    clearBringMoves();
    for (const slug of preset.slugs) {
      const moves = preset.moves[slug];
      if (moves?.length) setBringMoves(slug, moves);
    }
    if (preset.slugs[0]) selectBring(preset.slugs[0]);
    setOpen(false);
  }

  return (
    <div className="relative">
      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="rounded-full border border-line px-3 py-1.5 text-xs text-muted transition hover:border-ink/40 hover:text-ink"
        >
          Presets{presets.length ? ` (${presets.length})` : ""}
        </button>
        <button
          type="button"
          disabled={!bring.length}
          onClick={save}
          className="rounded-full border border-line bg-raised/50 px-3 py-1.5 text-xs font-medium transition hover:border-ink/40 disabled:opacity-40"
        >
          Save bring
        </button>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Optional name"
          className="min-w-[8rem] flex-1 rounded-full border border-line bg-bg/40 px-3 py-1.5 text-xs placeholder:text-muted/70 sm:max-w-[12rem]"
        />
      </div>

      {open ? (
        <div className="absolute right-0 z-20 mt-2 w-[min(100vw-2rem,22rem)] rounded-2xl border border-line bg-bg p-2 shadow-[0_16px_40px_rgba(0,0,0,0.45)]">
          {!presets.length ? (
            <p className="px-3 py-4 text-sm text-muted">
              Save a bring of three (and their moves) to recall it on the clock.
            </p>
          ) : (
            <ul className="max-h-72 space-y-1 overflow-y-auto">
              {presets.map((preset) => (
                <li key={preset.id}>
                  <div className="flex items-center gap-1 rounded-xl px-1 py-1 hover:bg-white/5">
                    <button
                      type="button"
                      onClick={() => apply(preset.id)}
                      className="flex min-w-0 flex-1 items-center gap-2 rounded-lg px-2 py-1.5 text-left"
                    >
                      <span className="flex -space-x-2">
                        {preset.slugs.slice(0, 3).map((slug) => {
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
                      className="shrink-0 rounded-lg p-2 text-muted hover:bg-white/10 hover:text-ink"
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
        </div>
      ) : null}
    </div>
  );
}
