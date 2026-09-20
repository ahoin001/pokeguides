import { KIT_TAGS, type KitTag } from "@/types/pokemon";

/** PokeAPI kebab-case move names that mark a Champions job. Not a learnset dump. */
const MOVES: Record<KitTag, readonly string[]> = {
  pivot: [
    "u-turn",
    "volt-switch",
    "flip-turn",
    "parting-shot",
    "teleport",
    "baton-pass",
    "chilly-reception",
    "shed-tail",
  ],
  priority: [
    "fake-out",
    "sucker-punch",
    "extreme-speed",
    "aqua-jet",
    "bullet-punch",
    "mach-punch",
    "ice-shard",
    "shadow-sneak",
    "vacuum-wave",
    "grassy-glide",
    "first-impression",
    "water-shuriken",
    "jet-punch",
    "upper-hand",
    "accelerock",
    "quick-attack",
  ],
  setup: [
    "swords-dance",
    "nasty-plot",
    "dragon-dance",
    "calm-mind",
    "quiver-dance",
    "bulk-up",
    "coil",
    "shift-gear",
    "shell-smash",
    "agility",
    "rock-polish",
    "growth",
    "work-up",
    "hone-claws",
    "iron-defense",
    "cosmic-power",
  ],
  recovery: [
    "recover",
    "roost",
    "slack-off",
    "soft-boiled",
    "milk-drink",
    "moonlight",
    "morning-sun",
    "synthesis",
    "shore-up",
    "strength-sap",
    "wish",
    "healing-wish",
    "lunar-dance",
    "rest",
  ],
  status: [
    "will-o-wisp",
    "thunder-wave",
    "toxic",
    "spore",
    "sleep-powder",
    "stun-spore",
    "nuzzle",
    "glare",
    "hypnosis",
    "encore",
    "taunt",
    "yawn",
    "dark-void",
  ],
  "trick-room": ["trick-room"],
  tailwind: ["tailwind"],
  hazards: ["stealth-rock", "spikes", "toxic-spikes", "sticky-web", "stone-axe", "ceaseless-edge"],
};

const LOOKUP = new Map<string, KitTag>();
for (const tag of KIT_TAGS) {
  for (const move of MOVES[tag]) LOOKUP.set(move, tag);
}

export function kitTagsFromMoves(moveNames: readonly string[]): KitTag[] {
  const found = new Set<KitTag>();
  for (const name of moveNames) {
    const tag = LOOKUP.get(name);
    if (tag) found.add(tag);
  }
  return KIT_TAGS.filter((tag) => found.has(tag));
}
