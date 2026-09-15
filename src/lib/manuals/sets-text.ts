import { getPokemon } from "@/lib/catalog/load";
import type { SlotManual, TeamManual } from "@/content/manuals";
import type { SampleSp } from "@/types/pokemon";

const STAT_ORDER: { key: keyof SampleSp; label: string }[] = [
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
