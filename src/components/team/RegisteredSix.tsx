"use client";

import { getPokemon } from "@/lib/catalog/load";
import { cssVars } from "@/lib/champions/palette";
import { PokemonArt } from "@/components/pokemon/PokemonArt";

export function RegisteredSix({
  box,
  bring,
  onBring,
}: {
  box: (string | null)[];
  bring: (string | null)[];
  onBring: (slug: string) => void;
}) {
  const filled = box.filter((s): s is string => Boolean(s));
  if (filled.length < 4) return null;

  return (
    <section className="mt-6">
      <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-muted">Registered six</p>
      <p className="mt-1 max-w-[52ch] text-sm text-muted">
        Champions preview. The bench below is the three you bring.
      </p>
      <ul className="mt-3 flex flex-wrap gap-2">
        {box.map((slug, i) => {
          const p = slug ? getPokemon(slug) : undefined;
          if (!p) {
            return (
              <li
                key={`empty-${i}`}
                className="grid h-14 w-14 place-items-center rounded-2xl border border-dashed border-line text-xs text-muted"
              >
                —
              </li>
            );
          }
          const on = bring.includes(p.slug);
          return (
            <li key={p.slug}>
              <button
                type="button"
                onClick={() => onBring(p.slug)}
                className={`rounded-2xl border p-1.5 transition ${
                  on ? "border-ink/40 bg-white/10" : "border-line bg-raised/40 hover:border-ink/25"
                }`}
                style={cssVars(p.palette)}
                title={on ? `${p.name} is on the three` : `Bring ${p.name}`}
              >
                <PokemonArt slug={p.slug} src={p.artwork} name={p.name} size={48} />
              </button>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
