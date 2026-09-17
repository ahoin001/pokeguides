"use client";

import { getPokemon } from "@/lib/catalog/lookup";
import { cssVars } from "@/lib/champions/palette";
import { PokemonArt } from "@/components/pokemon/PokemonArt";

/** Calm sprite strip for recent / frequent Live picks. */
export function LiveRecentStrip({
  slugs,
  exclude = [],
  onPick,
  label = "Recent",
  emptyHint,
}: {
  slugs: string[];
  exclude?: string[];
  onPick: (slug: string) => void;
  label?: string;
  emptyHint?: string;
}) {
  const blocked = new Set(exclude);
  const visible = slugs.filter((s) => s && !blocked.has(s)).slice(0, 10);

  if (!visible.length) {
    return (
      <p className="truncate text-[11px] text-muted/70">
        {emptyHint ?? "Picks you log land here for one-tap recall."}
      </p>
    );
  }

  return (
    <div className="flex min-w-0 items-center gap-2">
      <span className="shrink-0 font-mono text-[9px] font-semibold uppercase tracking-[0.14em] text-muted">
        {label}
      </span>
      <ul className="flex min-w-0 items-center gap-1 overflow-x-auto [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {visible.map((slug) => {
          const p = getPokemon(slug);
          if (!p) return null;
          return (
            <li key={slug} className="shrink-0">
              <button
                type="button"
                title={p.name}
                aria-label={`Add ${p.name}`}
                onClick={() => onPick(slug)}
                className="rounded-full border border-line/60 bg-bg/40 p-0.5 transition hover:border-ink/40 hover:bg-white/8"
                style={cssVars(p.palette)}
              >
                <PokemonArt slug={p.slug} src={p.sprite || p.artwork} name={p.name} size={28} />
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
