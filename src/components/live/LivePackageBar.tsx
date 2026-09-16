"use client";

import Link from "next/link";
import { getPokemon } from "@/lib/catalog/lookup";
import { cssVars } from "@/lib/champions/palette";
import { PokemonArt } from "@/components/pokemon/PokemonArt";
import { useTeamStore } from "@/stores/team";
import { useLiveMatchStore } from "@/stores/live-match";
import { LiveBringPresets } from "@/components/live/LiveBringPresets";

/** Registered six → tap to toggle into the bring three. */
export function LivePackageBar() {
  const box = useTeamStore((s) => s.box);
  const slugs = useTeamStore((s) => s.slugs);
  const add = useTeamStore((s) => s.add);
  const remove = useTeamStore((s) => s.remove);
  const setFocus = useLiveMatchStore((s) => s.setFocus);
  const focusSlug = useLiveMatchStore((s) => s.focusSlug);

  const boxFilled = box.filter(Boolean) as string[];
  const bringFilled = slugs.filter(Boolean) as string[];
  const roster = boxFilled.length ? boxFilled : bringFilled;

  function toggle(slug: string) {
    setFocus(slug);
    if (slugs.includes(slug)) {
      remove(slug);
      return;
    }
    if (!add(slug)) {
      const first = slugs.find(Boolean);
      if (first) remove(first);
      add(slug);
    }
  }

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.14em] text-muted">
            Your package
          </p>
          <h2 className="mt-1 text-lg font-semibold tracking-tight">
            Bring {bringFilled.length}/3
          </h2>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <LiveBringPresets />
          <Link href="/team" className="text-xs text-muted underline hover:text-ink">
            Edit on Team
          </Link>
        </div>
      </div>

      {!roster.length ? (
        <p className="rounded-2xl border border-dashed border-line/80 px-4 py-5 text-sm text-muted">
          No registered six yet.{" "}
          <Link href="/team" className="underline hover:text-ink">
            Build on Team
          </Link>{" "}
          or load a field manual — Live reads the same store.
        </p>
      ) : (
        <ul className="grid grid-cols-3 gap-2 sm:grid-cols-6">
          {roster.map((slug) => {
            const p = getPokemon(slug);
            if (!p) return null;
            const on = slugs.includes(slug);
            const focused = focusSlug === slug;
            return (
              <li key={slug}>
                <button
                  type="button"
                  onClick={() => toggle(slug)}
                  title={on ? `Drop ${p.name} from bring` : `Bring ${p.name}`}
                  className={`flex w-full flex-col items-center gap-1.5 rounded-2xl border px-1.5 py-2.5 transition ${
                    on
                      ? "border-[color-mix(in_srgb,var(--mon-vibrant)_55%,transparent)] bg-[color-mix(in_srgb,var(--mon-wash)_22%,transparent)]"
                      : "border-line/70 bg-bg/30 opacity-70 hover:opacity-100"
                  } ${focused ? "ring-1 ring-ink/35" : ""}`}
                  style={cssVars(p.palette)}
                >
                  <PokemonArt slug={p.slug} src={p.sprite || p.artwork} name={p.name} size={48} />
                  <span className="max-w-full truncate text-[11px] font-medium">{p.name}</span>
                  <span className="font-mono text-[9px] uppercase tracking-[0.1em] text-muted">
                    {on ? "Bring" : "Bench"}
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
