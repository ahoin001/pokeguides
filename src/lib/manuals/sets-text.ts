import { getPokemon } from "@/lib/catalog/load";
import {
  packList,
  resolveActiveBox,
  resolvePackStrategy,
  resolveRosterSlot,
  type SlotManual,
  type TeamManual,
} from "@/content/manuals";
import type { SampleSp } from "@/types/pokemon";

export const STAT_ORDER: { key: keyof SampleSp; label: string }[] = [
  { key: "hp", label: "HP" },
  { key: "atk", label: "Atk" },
  { key: "def", label: "Def" },
  { key: "spa", label: "SpA" },
  { key: "spd", label: "SpD" },
  { key: "spe", label: "Spe" },
];

function moveName(name: string) {
  return name.split(/\s+or\s+/)[0]?.trim() ?? name;
}

export function formatSlotSet(slot: SlotManual) {
  const p = slot.slug ? getPokemon(slot.slug) : undefined;
  const name = p?.name ?? (slot.title || slot.slug);
  const lines: string[] = [slot.item ? `${name} @ ${slot.item}` : name];
  if (slot.ability) lines.push(`Ability: ${slot.ability}`);
  if (slot.nature) lines.push(`Nature: ${slot.nature}`);
  const sp = slot.training?.sp;
  if (sp) {
    lines.push(`SP: ${STAT_ORDER.map((s) => `${s.label} ${sp[s.key]}`).join(" / ")}`);
  }
  for (const move of slot.moves) {
    if (!move.name.trim()) continue;
    lines.push(`- ${moveName(move.name)}`);
  }
  return lines.join("\n");
}

export function formatManualSets(manual: TeamManual) {
  return manual.slots.map(formatSlotSet).filter(Boolean).join("\n\n");
}

/** Paste for the active six (core box, or box after a flex swap). */
export function formatBoxSets(manual: TeamManual, packId?: string | null) {
  const box = resolveActiveBox(manual, packId);
  const packs = packList(manual);
  const pack = (packId ? packs.find((p) => p.id === packId) : undefined) ?? packs[0];
  const wincon = pack ? resolvePackStrategy(pack).winconMode ?? pack.winconMode : undefined;
  const slugs = box.length ? box : (manual.slugs.filter(Boolean) as string[]);
  return slugs
    .map((slug) => formatSlotSet(resolveRosterSlot(manual, slug, wincon)))
    .filter(Boolean)
    .join("\n\n");
}

export function formatSpLine(sp: SampleSp) {
  return STAT_ORDER.map((s) => `${s.label} ${sp[s.key] || "–"}`).join(" / ");
}
