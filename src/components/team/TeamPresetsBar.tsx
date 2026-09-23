"use client";

import { useMemo, useState, type ReactNode } from "react";
import Link from "next/link";
import { X } from "@phosphor-icons/react";
import { getPokemon } from "@/lib/catalog/lookup";
import { cssVars } from "@/lib/champions/palette";
import { PokemonArt } from "@/components/pokemon/PokemonArt";
import { Popover } from "@/components/ui/Popover";
import { resolveManualById, useManualsStore } from "@/stores/manuals";
import { teamPresetFromManual } from "@/lib/team/manual-preset";
import {
  useTeamPresetsStore,
  type TeamPreset,
} from "@/stores/team-presets";

type TeamPresetsBarProps = {
  /** Species currently on the board (Team bring or Live package). */
  party: string[];
  /** Moves keyed by slug for the party. */
  moves: Record<string, string[]>;
  /** Apply a preset to this surface. */
  onApply: (preset: TeamPreset) => void;
  /** Optional hint under the save controls. */
  hint?: string;
  className?: string;
};

/** Save / load shared team presets — used by Team builder and Live Match. */
export function TeamPresetsBar({
  party,
  moves,
  onApply,
  hint,
  className = "",
}: TeamPresetsBarProps) {
  const presets = useTeamPresetsStore((s) => s.presets);
  const pinnedManualIds = useTeamPresetsStore((s) => s.pinnedManualIds);
  const savePreset = useTeamPresetsStore((s) => s.savePreset);
  const deletePreset = useTeamPresetsStore((s) => s.deletePreset);
  const unpinManual = useTeamPresetsStore((s) => s.unpinManual);
  const local = useManualsStore((s) => s.local);

  const cleanParty = useMemo(() => party.filter(Boolean), [party]);
  const [name, setName] = useState("");
  const [open, setOpen] = useState(false);

  const manualEntries = useMemo(() => {
    const out: { id: string; preset: TeamPreset }[] = [];
    for (const id of pinnedManualIds) {
      const manual = resolveManualById(id, local);
      if (!manual) continue;
      const preset = teamPresetFromManual(manual);
      if (!preset) continue;
      out.push({ id, preset });
    }
    return out;
  }, [pinnedManualIds, local]);

  const totalCount = presets.length + manualEntries.length;

  function save() {
    const label =
      name.trim() ||
      cleanParty
        .map((s) => getPokemon(s)?.name)
        .filter(Boolean)
        .join(" · ") ||
      "Team";
    const id = savePreset(label, cleanParty, moves);
    if (id) {
      setName("");
      setOpen(true);
    }
  }

  function apply(preset: TeamPreset) {
    onApply(preset);
    setOpen(false);
  }

  return (
    <div className={`flex flex-wrap items-center gap-2 ${className}`}>
      <Popover
        open={open}
        onOpenChange={setOpen}
        align="start"
        role="menu"
        widthClassName="w-[min(100vw-1.5rem,24rem)]"
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
            Presets{totalCount ? ` (${totalCount})` : ""}
          </button>
        )}
      >
        {!totalCount ? (
          <div className="space-y-2 px-3 py-4 text-sm text-muted">
            <p>
              {hint ??
                "Save a team here, or pin a field manual from its detail page."}
            </p>
            <Link
              href="/manuals"
              className="inline-block text-xs font-medium text-ink underline-offset-2 hover:underline"
              onClick={() => setOpen(false)}
            >
              Browse manuals
            </Link>
          </div>
        ) : (
          <div className="max-h-80 space-y-3 overflow-y-auto overscroll-contain">
            <PresetGroup
              label="Saved teams"
              count={presets.length}
              empty="None yet — use Save team on Live or Team."
            >
              {presets.map((preset) => (
                <PresetRow
                  key={preset.id}
                  preset={preset}
                  meta={`${preset.slugs.length} mon${preset.slugs.length === 1 ? "" : "s"}${
                    Object.keys(preset.moves).length
                      ? ` · ${Object.keys(preset.moves).length} with kits`
                      : ""
                  }`}
                  onApply={() => apply(preset)}
                  onRemove={() => deletePreset(preset.id)}
                  removeLabel={`Delete ${preset.name}`}
                />
              ))}
            </PresetGroup>

            <PresetGroup
              label="Manuals"
              count={manualEntries.length}
              empty="Pin a six from any manual detail page."
              footer={
                <Link
                  href="/manuals"
                  className="block px-3 py-1.5 text-[11px] text-muted underline-offset-2 hover:text-ink hover:underline"
                  onClick={() => setOpen(false)}
                >
                  Open field manuals
                </Link>
              }
            >
              {manualEntries.map(({ id, preset }) => (
                <PresetRow
                  key={id}
                  preset={preset}
                  meta="Field manual · registered six"
                  href={`/manuals/${encodeURIComponent(id)}`}
                  onApply={() => apply(preset)}
                  onRemove={() => unpinManual(id)}
                  removeLabel={`Hide ${preset.name} from presets`}
                />
              ))}
            </PresetGroup>
          </div>
        )}
      </Popover>
      <button
        type="button"
        disabled={!cleanParty.length}
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

function PresetGroup({
  label,
  count,
  empty,
  children,
  footer,
}: {
  label: string;
  count: number;
  empty: string;
  children: ReactNode;
  footer?: ReactNode;
}) {
  return (
    <section>
      <p className="px-2 pb-1 font-mono text-[9px] font-semibold uppercase tracking-[0.14em] text-muted">
        {label}
        {count ? ` · ${count}` : ""}
      </p>
      {count ? (
        <ul className="space-y-1">{children}</ul>
      ) : (
        <p className="px-3 py-2 text-[11px] text-muted">{empty}</p>
      )}
      {footer}
    </section>
  );
}

function PresetRow({
  preset,
  meta,
  href,
  onApply,
  onRemove,
  removeLabel,
}: {
  preset: TeamPreset;
  meta: string;
  href?: string;
  onApply: () => void;
  onRemove: () => void;
  removeLabel: string;
}) {
  return (
    <li>
      <div className="flex items-center gap-1 rounded-xl px-1 py-1 hover:bg-white/5">
        <button
          type="button"
          role="menuitem"
          onClick={onApply}
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
            <span className="block truncate text-[11px] text-muted">{meta}</span>
          </span>
        </button>
        {href ? (
          <Link
            href={href}
            className="shrink-0 rounded-lg px-2 py-2 text-[10px] font-medium text-muted transition hover:bg-white/10 hover:text-ink"
            title="Open manual"
            onClick={(e) => e.stopPropagation()}
          >
            Open
          </Link>
        ) : null}
        <button
          type="button"
          onClick={onRemove}
          className="shrink-0 rounded-lg p-2 text-muted transition hover:bg-white/10 hover:text-ink active:scale-95"
          title={removeLabel}
          aria-label={removeLabel}
        >
          <X size={14} weight="bold" />
        </button>
      </div>
    </li>
  );
}
