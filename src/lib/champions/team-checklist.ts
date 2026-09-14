import type { ArchetypeId, CatalogEntry } from "@/types/pokemon";
import { TYPE_LABEL, sharedWeaknesses } from "@/lib/champions/types";
import { hasSpeedPlan } from "@/lib/champions/role-score";
import { ARCHETYPE_LABEL } from "@/content/archetypes";
import { teamOffenseBias } from "@/lib/champions/suggest";

export type ChecklistItem = {
  id: "wincon" | "speed" | "spectrum" | "hole";
  ok: boolean;
  label: string;
  detail: string;
  href: string;
};

export function teamChecklist(
  mons: CatalogEntry[],
  intent: ArchetypeId | null,
  guessedStyle: ArchetypeId | null,
): ChecklistItem[] {
  const style = intent ?? guessedStyle;
  const holes = mons.length ? sharedWeaknesses(mons.map((m) => m.types)) : [];
  const bias = teamOffenseBias(mons);
  const speed = mons.some(hasSpeedPlan);
  const mixed = bias === "mixed" || bias === "empty" || mons.length < 2;

  return [
    {
      id: "wincon",
      ok: Boolean(style),
      label: "Win condition",
      detail: style
        ? `This three is playing ${ARCHETYPE_LABEL[style]}. Protect the piece that actually ends the match.`
        : "Name the plan first. Balance, Hyper Offense, a weather, or Trick Room — then pick Pokémon that cash it.",
      href: style ? `/learn/archetypes/${style}` : "/learn/building",
    },
    {
      id: "speed",
      ok: mons.length === 0 || speed,
      label: "Speed plan",
      detail: speed
        ? "Priority, Tailwind, Trick Room, a weather racer, or a wall that does not care who moves first."
        : "Pack Tailwind, Trick Room, priority, or a wall that sits the race. A three that is kind of fast loses.",
      href: "/learn/speed",
    },
    {
      id: "spectrum",
      ok: mixed,
      label: "Offensive spectrum",
      detail:
        bias === "physical"
          ? "All physical. A Defense wall sits here. Add a special attacker."
          : bias === "special"
            ? "All special. A SpD tank sits here. Add a physical attacker."
            : "Not all punching the same side. Keep one Pokémon that hits the other.",
      href: "/learn/building",
    },
    {
      id: "hole",
      ok: holes.length === 0,
      label: "Shared hole",
      detail: holes.length
        ? `${holes.map((t) => TYPE_LABEL[t]).join(", ")} hits two of yours. The third slot has to take that hit.`
        : mons.length
          ? "No type super-effectives two names. Keep it that way."
          : "Once two names share a weakness, they will send that STAB.",
      href: "/learn/holes",
    },
  ];
}
