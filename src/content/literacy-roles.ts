import type { LiteracyRoleId, RoleId } from "@/types/pokemon";

export type LiteracyRole = {
  id: LiteracyRoleId;
  name: string;
  alsoCalled: string[];
  oneLiner: string;
  mapsTo: RoleId[];
  spot: string;
};

export const LITERACY_ROLES: LiteracyRole[] = [
  {
    id: "sweeper",
    name: "Sweeper",
    alsoCalled: ["cleaner", "clean-up sweeper", "offensive carry"],
    oneLiner: "High Speed and high Attack or Special Attack. Late-game it cleans what is left.",
    mapsTo: ["breaker", "speed", "mega"],
    spot: "Look for a fast attacker, a Choice Scarf, or a Mega that snowballs after a KO.",
  },
  {
    id: "wall",
    name: "Wall / tank",
    alsoCalled: ["defensive anchor", "fat"],
    oneLiner: "Massive bulk, recovery, and a typing that shrugs off the format's STABs.",
    mapsTo: ["support"],
    spot: "High HP and defenses, recovery or a pivot move. It takes a hit so the breaker can come in.",
  },
  {
    id: "disruptor",
    name: "Disruptor",
    alsoCalled: ["support", "utility"],
    oneLiner: "Status, Taunt, Encore, Fake Out. It makes the other side's turn worse on purpose.",
    mapsTo: ["support", "speed"],
    spot: "Prankster plus a status move, or Intimidate plus Fake Out. Damage is a side effect.",
  },
  {
    id: "wallbreaker",
    name: "Wallbreaker",
    alsoCalled: ["tankbuster", "wall-breaker"],
    oneLiner: "Astronomical Attack. It does not need to be first. It needs to KO the thing that would stall you.",
    mapsTo: ["breaker"],
    spot: "Kingambit, a Choice attacker, a Life Orb special. If the enemy has a wall, this is who deletes it.",
  },
  {
    id: "pivot",
    name: "Pivot",
    alsoCalled: ["momentum"],
    oneLiner: "Takes a hit, forces a reaction, leaves with U-turn, Volt Switch, or Parting Shot.",
    mapsTo: ["support"],
    spot: "Parting Shot Incineroar and U-turn Rillaboom are the classroom pivots. You keep the right Pokémon in the slot.",
  },
  {
    id: "setter",
    name: "Weather / terrain setter",
    alsoCalled: ["field setter", "speed controller"],
    oneLiner: "Changes the field on entry or on the first turn: rain, sun, Grassy Terrain, Psychic Terrain, Trick Room.",
    mapsTo: ["weather", "speed"],
    spot: "Drizzle, Drought, Grassy Surge, Trick Room, or Tailwind. Other sites call the clock piece a Speed Controller. The rest of the three should cash it.",
  },
];

export function getLiteracyRole(id: string) {
  return LITERACY_ROLES.find((r) => r.id === id);
}
