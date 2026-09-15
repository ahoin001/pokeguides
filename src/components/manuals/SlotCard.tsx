import Link from "next/link";
import { getPokemon } from "@/lib/catalog/load";
import { cssVars } from "@/lib/champions/palette";
import { PokemonArt } from "@/components/pokemon/PokemonArt";
import { ROLE_LABEL, roleHref } from "@/content/roles";
import { getLiteracyRole } from "@/content/literacy-roles";
import { playLines, type SlotManual } from "@/content/manuals";
import { SlotField, SlotSection, SLOT_GRID } from "./SlotField";
import { SlotMatchups } from "./SlotMatchups";
import { SlotItemBlock } from "./SlotItem";
import { SlotTrainingBlock } from "./SlotTraining";

export function SlotCard({ slot }: { slot: SlotManual }) {
  const p = slot.slug ? getPokemon(slot.slug) : undefined;
  const lit = slot.literacy ? getLiteracyRole(slot.literacy) : undefined;
  const lines = playLines(slot.howToPlay);
  const moves = slot.moves.filter((m) => m.name);

  return (
    <li
      className="flex flex-col rounded-[28px] border border-line bg-raised/40 p-5"
      style={p ? cssVars(p.palette) : undefined}
    >
      <div className="flex items-start gap-3.5">
        {p ? (
          <Link href={`/pokemon/${p.slug}`} className="shrink-0">
            <PokemonArt slug={p.slug} src={p.artwork} name={p.name} size={72} />
          </Link>
        ) : null}
        <div className="min-w-0 pt-0.5">
          <p className="text-xs text-muted">
            <Link href={roleHref(slot.job)} className="underline">
              {ROLE_LABEL[slot.job]}
            </Link>
            {lit ? ` · ${lit.name}` : null}
          </p>
          {p ? (
            <Link href={`/pokemon/${p.slug}`} className="mt-0.5 block text-xl font-semibold tracking-tight">
              {p.name}
            </Link>
          ) : (
            <p className="mt-0.5 text-xl font-semibold">{slot.title || "Empty slot"}</p>
          )}
          <p className="mt-0.5 text-sm font-medium">{slot.title}</p>
        </div>
      </div>

      <div className="mt-4 space-y-1.5">
        {p ? <SlotMatchups types={p.types} /> : null}
        {slot.ability ? (
          <SlotField label="Ability">
            <p className="pt-0.5 text-sm font-medium leading-snug">{slot.ability}</p>
          </SlotField>
        ) : null}
        {slot.nature ? (
          <SlotField label="Nature">
            <p className="pt-0.5 text-sm font-medium leading-snug">{slot.nature}</p>
          </SlotField>
        ) : null}
      </div>

      {slot.objective ? (
        <p className="mt-4 text-sm leading-relaxed text-pretty">{slot.objective}</p>
      ) : null}

      {slot.item || slot.training ? (
        <div className="mt-4 space-y-2.5 border-t border-line/70 pt-4">
          {slot.item ? <SlotItemBlock item={slot.item} why={slot.itemWhy} alts={slot.itemAlts} /> : null}
          {slot.training ? <SlotTrainingBlock training={slot.training} /> : null}
        </div>
      ) : null}

      {moves.length ? (
        <SlotSection title="Kit">
          <ul className="-mt-1">
            {moves.map((move) => (
              <li key={move.name} className="border-t border-line/60 py-2.5 first:border-t-0 first:pt-0 last:pb-0">
                <SlotField label="">
                  <p className="font-medium leading-snug">{move.name}</p>
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
        </SlotSection>
      ) : null}

      {lines.length ? (
        <SlotSection title="Play">
          <ul className="space-y-2">
            {lines.map((line) => (
              <li key={line} className={`${SLOT_GRID}`}>
                <span className="mt-[0.7rem] block h-px w-2.5 justify-self-end bg-muted/70" aria-hidden />
                <p className="text-sm leading-relaxed text-muted">{line}</p>
              </li>
            ))}
          </ul>
        </SlotSection>
      ) : null}
    </li>
  );
}
