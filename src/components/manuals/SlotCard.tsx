import type { ReactNode } from "react";
import Link from "next/link";
import { getPokemon } from "@/lib/catalog/load";
import { cssVars } from "@/lib/champions/palette";
import { PokemonArt } from "@/components/pokemon/PokemonArt";
import { ROLE_LABEL, roleHref } from "@/content/roles";
import { getLiteracyRole } from "@/content/literacy-roles";
import { playLines, type SlotManual } from "@/content/manuals";
import { SlotField, SLOT_GRID } from "./SlotField";
import { SlotMatchups } from "./SlotMatchups";
import { SlotItemBlock } from "./SlotItem";
import { SlotTrainingBlock } from "./SlotTraining";

function Band({
  title,
  tone,
  children,
}: {
  title?: string;
  tone: "identity" | "build" | "kit" | "play";
  children: ReactNode;
}) {
  const bg = {
    identity: "bg-[color-mix(in_srgb,var(--mon-wash)_26%,transparent)]",
    build: "bg-sunken/80",
    kit: "bg-white/[0.05]",
    play: "bg-raised/90",
  }[tone];

  return (
    <div className={`${bg} px-5 py-5 md:px-6 md:py-6`}>
      {title ? (
        <h3 className="mb-3.5 font-mono text-[11px] font-semibold uppercase tracking-[0.16em] text-muted">{title}</h3>
      ) : null}
      {children}
    </div>
  );
}

export function SlotCard({ slot }: { slot: SlotManual }) {
  const p = slot.slug ? getPokemon(slot.slug) : undefined;
  const lit = slot.literacy ? getLiteracyRole(slot.literacy) : undefined;
  const lines = playLines(slot.howToPlay);
  const moves = slot.moves.filter((m) => m.name);

  return (
    <li
      className="flex flex-col overflow-hidden rounded-[28px] border border-line/80 shadow-[0_12px_40px_rgba(0,0,0,0.22)]"
      style={p ? cssVars(p.palette) : undefined}
    >
      <Band tone="identity">
        <div className="flex items-start gap-4">
          {p ? (
            <Link href={`/pokemon/${p.slug}`} className="shrink-0">
              <PokemonArt slug={p.slug} src={p.artwork} name={p.name} size={88} />
            </Link>
          ) : null}
          <div className="min-w-0 pt-0.5">
            <p className="text-[13px] text-muted">
              <Link href={roleHref(slot.job)} className="underline">
                {ROLE_LABEL[slot.job]}
              </Link>
              {lit ? ` · ${lit.name}` : null}
            </p>
            {p ? (
              <Link href={`/pokemon/${p.slug}`} className="mt-1 block text-2xl font-semibold tracking-tight">
                {p.name}
              </Link>
            ) : (
              <p className="mt-1 text-2xl font-semibold">{slot.title || "Empty slot"}</p>
            )}
            <p className="mt-1 text-base font-medium">{slot.title}</p>
          </div>
        </div>

        <div className="mt-5 space-y-2">
          {p ? <SlotMatchups types={p.types} /> : null}
          {slot.ability ? (
            <SlotField label="Ability">
              <p className="pt-0.5 text-[15px] font-medium leading-snug">{slot.ability}</p>
            </SlotField>
          ) : null}
          {slot.nature ? (
            <SlotField label="Nature">
              <p className="pt-0.5 text-[15px] font-medium leading-snug">{slot.nature}</p>
            </SlotField>
          ) : null}
        </div>

        {slot.objective ? (
          <p className="mt-5 text-[15px] leading-relaxed text-pretty">{slot.objective}</p>
        ) : null}
      </Band>

      {slot.item || slot.training ? (
        <Band tone="build" title="Hold & training">
          <div className="space-y-4">
            {slot.item ? <SlotItemBlock item={slot.item} why={slot.itemWhy} alts={slot.itemAlts} /> : null}
            {slot.training ? <SlotTrainingBlock training={slot.training} /> : null}
          </div>
        </Band>
      ) : null}

      {moves.length ? (
        <Band tone="kit" title="Kit">
          <ul>
            {moves.map((move) => (
              <li key={move.name} className="border-t border-white/8 py-3 first:border-t-0 first:pt-0 last:pb-0">
                <SlotField label="">
                  <p className="text-[15px] font-medium leading-snug">{move.name}</p>
                  <p className="mt-1 text-sm leading-relaxed text-muted">{move.why}</p>
                </SlotField>
                {move.alts
                  ?.filter((a) => a.name)
                  .map((alt) => (
                    <div key={alt.name} className="mt-2.5">
                      <SlotField label="Swap">
                        <p className="font-medium leading-snug">{alt.name}</p>
                        <p className="mt-1 text-sm leading-relaxed text-muted">{alt.why}</p>
                      </SlotField>
                    </div>
                  ))}
              </li>
            ))}
          </ul>
        </Band>
      ) : null}

      {lines.length ? (
        <Band tone="play" title="Play">
          <ul className="space-y-2.5">
            {lines.map((line) => (
              <li key={line} className={SLOT_GRID}>
                <span className="mt-[0.75rem] block h-px w-2.5 justify-self-end bg-muted/70" aria-hidden />
                <p className="text-[15px] leading-relaxed text-muted">{line}</p>
              </li>
            ))}
          </ul>
        </Band>
      ) : null}
    </li>
  );
}
