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

export function SlotCardBody({ slot, identity = true }: { slot: SlotManual; identity?: boolean }) {
  const p = slot.slug ? getPokemon(slot.slug) : undefined;
  const lit = slot.literacy ? getLiteracyRole(slot.literacy) : undefined;
  const lines = playLines(slot.howToPlay);
  const moves = slot.moves.filter((m) => m.name);

  return (
    <>
      {identity ? (
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
          {slot.gives?.length || slot.answers?.length ? (
            <div className="mt-4 flex flex-wrap gap-x-6 gap-y-3">
              {slot.gives?.length ? (
                <div>
                  <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.14em] text-muted">
                    Gives the six
                  </p>
                  <ul className="mt-1.5 flex flex-wrap gap-1.5">
                    {slot.gives.map((g) => (
                      <li
                        key={g}
                        className="rounded-full border border-line/70 bg-bg/40 px-2.5 py-0.5 text-xs text-ink/85"
                      >
                        {g}
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}
              {slot.answers?.length ? (
                <div>
                  <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.14em] text-muted">
                    Answers
                  </p>
                  <ul className="mt-1.5 flex flex-wrap gap-1.5">
                    {slot.answers.map((a) => (
                      <li
                        key={a}
                        className="rounded-full border border-line/50 px-2.5 py-0.5 text-xs text-muted"
                      >
                        {a}
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}
            </div>
          ) : null}
        </Band>
      ) : (
        <>
          {slot.ability || slot.nature || slot.objective ? (
            <Band tone="identity">
              <div className="space-y-2">
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
          ) : null}
        </>
      )}

      {slot.item || slot.training ? (
        <Band tone="build" title="Hold & training">
          <div className="space-y-4">
            {slot.item ? <SlotItemBlock item={slot.item} why={slot.itemWhy} alts={slot.itemAlts} /> : null}
            {slot.training ? <SlotTrainingBlock training={slot.training} /> : null}
          </div>
        </Band>
      ) : null}

      {slot.modes?.length ? (
        <Band tone="build" title="Preview modes">
          <p className="mb-4 text-sm leading-relaxed text-muted">
            Same species, different jobs. Pick the mode from their six — then pick the other two around it.
          </p>
          <ul className="space-y-4">
            {slot.modes.map((mode) => (
              <li
                key={mode.id}
                className="rounded-2xl border border-white/10 bg-bg/35 px-4 py-3.5"
              >
                <div className="flex flex-wrap items-baseline gap-2">
                  <p className="font-semibold tracking-tight">{mode.label}</p>
                  <span className="rounded-full bg-white/8 px-2 py-0.5 font-mono text-[10px] uppercase tracking-[0.1em] text-muted">
                    {mode.job}
                  </span>
                </div>
                <p className="mt-1.5 text-sm text-muted">{mode.when}</p>
                <div className="mt-3 space-y-2">
                  <SlotField label="Item">
                    <p className="font-medium leading-snug">{mode.item}</p>
                    {mode.itemWhy ? (
                      <p className="mt-1 text-sm leading-relaxed text-muted">{mode.itemWhy}</p>
                    ) : null}
                  </SlotField>
                  {mode.nature ? (
                    <SlotField label="Nature">
                      <p className="pt-0.5 text-[15px] font-medium leading-snug">{mode.nature}</p>
                    </SlotField>
                  ) : null}
                </div>
                {mode.training ? (
                  <div className="mt-3">
                    <SlotTrainingBlock training={mode.training} />
                  </div>
                ) : null}
                {mode.moves.length ? (
                  <ul className="mt-3 border-t border-white/8 pt-3">
                    {mode.moves.map((move) => (
                      <li key={move.name} className="border-t border-white/6 py-2 first:border-t-0 first:pt-0">
                        <p className="text-[15px] font-medium leading-snug">{move.name}</p>
                        <p className="mt-1 text-sm leading-relaxed text-muted">{move.why}</p>
                      </li>
                    ))}
                  </ul>
                ) : null}
                {mode.objective ? (
                  <p className="mt-3 text-sm leading-relaxed text-ink/90">{mode.objective}</p>
                ) : null}
                {mode.howToPlay
                  ? playLines(mode.howToPlay).map((line) => (
                      <p key={line} className="mt-1.5 text-sm leading-relaxed text-muted">
                        {line}
                      </p>
                    ))
                  : null}
              </li>
            ))}
          </ul>
        </Band>
      ) : null}

      {moves.length ? (
        <Band tone="kit" title={slot.modes?.length ? "Default kit" : "Kit"}>
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
    </>
  );
}

export function SlotCard({ slot }: { slot: SlotManual }) {
  const p = slot.slug ? getPokemon(slot.slug) : undefined;
  return (
    <li
      className="flex flex-col overflow-hidden rounded-[28px] border border-line/80 shadow-[0_12px_40px_rgba(0,0,0,0.22)]"
      style={p ? cssVars(p.palette) : undefined}
    >
      <SlotCardBody slot={slot} />
    </li>
  );
}
