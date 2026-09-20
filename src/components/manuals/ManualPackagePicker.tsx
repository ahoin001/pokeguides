"use client";

import { getPokemon } from "@/lib/catalog/load";
import { cssVars } from "@/lib/champions/palette";
import { PokemonArt } from "@/components/pokemon/PokemonArt";
import { ManualSection } from "@/components/manuals/ManualSection";
import { packRequiresSwap, type ManualPack } from "@/content/manuals";

export function PackThreeArts({
  slugs,
  size = 56,
}: {
  slugs: [string, string, string] | string[];
  size?: number;
}) {
  return (
    <div className="flex items-end justify-center gap-1">
      {slugs.map((slug) => {
        const mon = getPokemon(slug);
        if (!mon) return null;
        return (
          <span key={slug} className="block" style={cssVars(mon.palette)} title={mon.name}>
            <PokemonArt slug={mon.slug} src={mon.sprite || mon.artwork} name={mon.name} size={size} />
          </span>
        );
      })}
    </div>
  );
}

export function ManualPackagePicker({
  packs,
  activeId,
  onSelectPack,
}: {
  packs: ManualPack[];
  activeId: string;
  onSelectPack: (id: string) => void;
}) {
  if (!packs.length) return null;

  return (
    <ManualSection
      id="packages"
      title="Packages"
      purpose="Each package is a bring of three from the six above. Selecting one updates the guide below."
    >
      <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {packs.map((p) => {
          const on = p.id === activeId;
          const lead = getPokemon(p.strategy?.defaultLead ?? p.slugs[0]);
          const swapReq = packRequiresSwap(p) ? p.requiresSwap : null;
          return (
            <li key={p.id}>
              <button
                type="button"
                onClick={() => onSelectPack(p.id)}
                className={`relative flex h-full w-full flex-col rounded-[28px] border px-4 py-5 text-left transition ${
                  on
                    ? "border-ink/40 bg-[color-mix(in_srgb,var(--mon-wash)_22%,transparent)] shadow-[var(--shadow)]"
                    : "border-line/70 bg-raised/30 opacity-85 hover:opacity-100"
                }`}
                style={lead ? cssVars(lead.palette) : undefined}
                aria-pressed={on}
              >
                <PackThreeArts slugs={p.slugs} size={on ? 64 : 48} />
                <p className="mt-4 text-lg font-semibold tracking-tight">{p.label}</p>
                {p.when ? (
                  <p className="mt-1 text-sm leading-snug text-muted">{p.when}</p>
                ) : null}
                {swapReq ? (
                  <p className="mt-2 w-fit rounded-full bg-amber-500/15 px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.08em] text-amber-200/90">
                    Needs {getPokemon(swapReq.out)?.name ?? swapReq.out} →{" "}
                    {getPokemon(swapReq.in)?.name ?? swapReq.in}
                  </p>
                ) : null}
                {on ? (
                  <span className="absolute right-3 top-3 rounded-full bg-ink px-2 py-0.5 text-[10px] font-medium text-bg">
                    Active
                  </span>
                ) : null}
              </button>
            </li>
          );
        })}
      </ul>
    </ManualSection>
  );
}
