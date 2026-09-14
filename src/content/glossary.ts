export type GlossaryTerm = {
  t: string;
  d: string;
  href?: string;
};

export const TERMS: GlossaryTerm[] = [
  { t: "Fake Out", d: "Priority flinch on the first turn the user is out. A lead tool. Common on Incineroar and Rillaboom." },
  { t: "Intimidate", d: "Drops the opponent's Attack when you switch in. The reason Incineroar is a job." },
  { t: "Trick Room", d: "Slowest Pokémon move first. Farigiraf can set it.", href: "/learn/archetypes/trick-room" },
  { t: "Protect", d: "You skip taking a hit this turn. A tempo tool, not a stall plan." },
  { t: "Stat Points", d: "66 points to spend. Max 32 in one stat. 1 SP is +1 at Level 50." },
  { t: "Omni Ring", d: "The device that Mega Evolves. One Mega per battle.", href: "/learn/roles/mega" },
  {
    t: "Win condition",
    d: "The Pokémon or mode that actually wins if the rest of the plan works. Your Mega, your Trick Room turns, your rain sweeper.",
  },
  {
    t: "Core",
    d: "Two Pokémon that are built to cover each other. Garchomp plus Kingambit is a core. Pelipper plus Basculegion is a core.",
  },
  {
    t: "Mode",
    d: "A game state your three is trying to force: Trick Room, rain, sun, terrain. The rest of the team cashes that state.",
  },
  {
    t: "Speed",
    d: "Who moves first: base Spe, Stat Points, Choice Scarf, priority, Trick Room, weather Speed.",
    href: "/learn/roles/speed",
  },
  {
    t: "Sweeper",
    d: "Fast attacker that cleans leftover Pokémon. In Champions this is usually a breaker, a Scarf, or a Mega.",
    href: "/learn/roles/breaker",
  },
  {
    t: "Wall",
    d: "A bulky Pokémon that soaks hits so you can switch to the Pokémon that wins.",
    href: "/learn/roles/support",
  },
  {
    t: "Wallbreaker",
    d: "A Pokémon whose job is to KO defensive walls so a sweeper can finish. Kingambit is the classroom example.",
    href: "/learn/roles/breaker",
  },
  {
    t: "Pivot",
    d: "Takes a hit, forces a reaction, leaves with U-turn, Volt Switch, or Parting Shot so the right Pokémon comes in.",
    href: "/learn/roles/support",
  },
  {
    t: "Disruptor",
    d: "Utility first: Taunt, Thunder Wave, Will-O-Wisp. Damage is optional.",
    href: "/learn/roles/support",
  },
  {
    t: "Hyper Offense",
    d: "A sprint three. Almost no defensive pivot. Win by turn 4 or the glass shatters.",
    href: "/learn/archetypes/hyper-offense",
  },
  {
    t: "Balance",
    d: "A breaker, a cleaner, and a patch. Control first, clean later. The usual first team. Other sites call this Good Stuff.",
    href: "/learn/archetypes/balance",
  },
  {
    t: "Good Stuff",
    d: "A pile of individually strong Pokémon that cover each other. In Champions that is Balance, not a separate style.",
    href: "/learn/archetypes/balance",
  },
  {
    t: "Stall",
    d: "Win by residual damage, recovery, and PP. Hard on a three: you only have three KOs to give, and the game cap is still a clock. Fat Balance is not stall.",
    href: "/learn/archetypes",
  },
  {
    t: "Speed control",
    d: "The plan for who moves first: Tailwind, Trick Room, priority, a Scarf, or a wall that does not care. Other sites call the piece a Speed Controller.",
    href: "/learn/speed",
  },
  {
    t: "Screens",
    d: "Light Screen, Reflect, or Aurora Veil. Cut damage for a few turns so an attacker can set up. Not a stall plan.",
  },
  {
    t: "Terrain",
    d: "Grassy, Psychic, Electric, or Misty Terrain. Usually set by an ability on entry. Rillaboom is the M-C one that matters.",
    href: "/learn/archetypes/grassy",
  },
];
