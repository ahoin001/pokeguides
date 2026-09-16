"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ARCHETYPES,
  ARCHETYPE_LABEL,
  archetypeHref,
  type ArchetypeEdge,
  type ArchetypeGuide,
} from "@/content/archetypes";
import { getPokemon } from "@/lib/catalog/load";
import { cssVars } from "@/lib/champions/palette";
import { PokemonArt } from "@/components/pokemon/PokemonArt";
import type { ArchetypeId } from "@/types/pokemon";

export function ArchetypeTellBoard() {
  const [selectedId, setSelectedId] = useState<ArchetypeId>("balance");
  const style = ARCHETYPES.find((a) => a.id === selectedId) ?? ARCHETYPES[0];
  const wash = style.tells.map((t) => getPokemon(t.slug)).find(Boolean);

  return (
    <div className="space-y-8" style={wash ? cssVars(wash.palette) : undefined}>
      <div>
        <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.14em] text-muted">
          If you see these
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          {ARCHETYPES.map((a) => {
            const on = a.id === style.id;
            return (
              <button
                key={a.id}
                type="button"
                onClick={() => setSelectedId(a.id)}
                className={`rounded-full px-3.5 py-1.5 text-sm transition ${
                  on ? "bg-ink text-bg" : "bg-white/6 text-muted hover:bg-white/10 hover:text-ink"
                }`}
              >
                {a.name}
              </button>
            );
          })}
        </div>
      </div>

      <TellStrip style={style} />

      <div className="rounded-[28px] border border-line/80 bg-raised/50 px-5 py-5">
        <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.14em] text-muted">
          Likely facing
        </p>
        <h3 className="mt-2 text-2xl font-semibold tracking-tight">{style.name}</h3>
        <p className="mt-2 max-w-[52ch] text-[15px] leading-relaxed text-muted">{style.oneLiner}</p>
        <Link
          href={archetypeHref(style.id)}
          className="mt-4 inline-flex text-sm underline decoration-line underline-offset-4 hover:text-ink"
        >
          Open {style.name} guide →
        </Link>
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        <EdgeColumn
          title="Strong into"
          hint="Matchups this plan usually likes — reach for these names."
          edges={style.favors}
          tone="favor"
        />
        <EdgeColumn
          title="Weak into"
          hint="Matchups that punish this plan — prepare these answers."
          edges={style.struggles}
          tone="struggle"
        />
      </div>
    </div>
  );
}

function TellStrip({ style }: { style: ArchetypeGuide }) {
  return (
    <section>
      <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.14em] text-muted">
        Preview tells
      </p>
      <ul className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {style.tells.map((tell) => {
          const mon = getPokemon(tell.slug);
          if (!mon) return null;
          return (
            <li key={tell.slug}>
              <Link
                href={`/pokemon/${mon.slug}`}
                title={tell.why}
                className="flex items-start gap-3 rounded-2xl border border-line/70 bg-bg/40 p-3 transition hover:border-ink/35 hover:bg-white/[0.04]"
                style={cssVars(mon.palette)}
              >
                <PokemonArt slug={mon.slug} src={mon.artwork} name={mon.name} size={56} className="shrink-0" />
                <span className="min-w-0">
                  <span className="block font-medium tracking-tight">{mon.name}</span>
                  <span className="mt-1 line-clamp-3 text-xs leading-relaxed text-muted">{tell.why}</span>
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
      <p className="mt-3 text-xs text-muted">Hover or focus a tell for the full read. Tap art for the dex.</p>
    </section>
  );
}

function EdgeColumn({
  title,
  hint,
  edges,
  tone,
}: {
  title: string;
  hint: string;
  edges: ArchetypeEdge[];
  tone: "favor" | "struggle";
}) {
  return (
    <section>
      <h3 className="text-lg font-semibold tracking-tight">{title}</h3>
      <p className="mt-1 text-sm text-muted">{hint}</p>
      {edges.length === 0 ? (
        <p className="mt-4 text-sm text-muted">No listed edges for this style yet.</p>
      ) : (
        <ul className="mt-4 space-y-4">
          {edges.map((edge) => (
            <li
              key={`${tone}-${edge.vs}`}
              className="border-t border-line/60 pt-4 first:border-t-0 first:pt-0"
            >
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <Link
                  href={archetypeHref(edge.vs)}
                  className="font-medium tracking-tight underline-offset-4 hover:underline"
                >
                  {ARCHETYPE_LABEL[edge.vs]}
                </Link>
                <span
                  className={`font-mono text-[10px] uppercase tracking-[0.12em] ${
                    tone === "favor" ? "text-[var(--mon-vibrant,#c8b48a)]" : "text-muted"
                  }`}
                >
                  {tone === "favor" ? "Favors you" : "Prepare"}
                </span>
              </div>
              <p className="mt-2 text-sm leading-relaxed text-muted">{edge.why}</p>
              <MonRow label="Reach for" slugs={edge.yourExamples} />
              <MonRow label="Their tells" slugs={edge.theirExamples} />
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

function MonRow({ label, slugs }: { label: string; slugs: string[] }) {
  const mons = slugs.map((s) => getPokemon(s)).filter(Boolean);
  if (!mons.length) return null;
  return (
    <div className="mt-3">
      <p className="font-mono text-[10px] uppercase tracking-[0.12em] text-muted">{label}</p>
      <ul className="mt-1.5 flex flex-wrap gap-2">
        {mons.map((p) =>
          p ? (
            <li key={p.slug}>
              <Link
                href={`/pokemon/${p.slug}`}
                title={p.name}
                className="inline-flex items-center gap-1.5 rounded-full border border-line/70 bg-bg/50 py-1 pl-1 pr-2.5 text-xs transition hover:border-ink/40"
                style={cssVars(p.palette)}
              >
                <PokemonArt slug={p.slug} src={p.artwork} name={p.name} size={28} />
                <span>{p.name}</span>
              </Link>
            </li>
          ) : null,
        )}
      </ul>
    </div>
  );
}
