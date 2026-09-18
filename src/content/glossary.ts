export type GlossaryTerm = {
  t: string;
  d: string;
  href?: string;
};

export const TERMS: GlossaryTerm[] = [
  { t: "Fake Out", d: "Priority +3 flinch on the first turn the user is out. Ghost is immune. Armor Tail blanks it.", href: "/learn/moves" },
  { t: "Intimidate", d: "Drops the opponent's Attack when you switch in. The reason Incineroar is a job.", href: "/learn/abilities" },
  { t: "Trick Room", d: "Slowest Pokémon move first. Farigiraf can set it. Four turns including the click.", href: "/learn/field-moves" },
  { t: "Protect", d: "Priority +4. A scout and a Sucker Punch stall, not leftover farming.", href: "/learn/defense-moves" },
  {
    t: "Destiny Bond",
    d: "If they KO you while Bond is active, they faint too. Never finish into a known Bond — switch, status, or wait.",
    href: "/learn/defense-moves",
  },
  {
    t: "Perish Song",
    d: "Shared faint countdown. Switch before count three or win the race first.",
    href: "/learn/defense-moves",
  },
  {
    t: "Cursed Body",
    d: "Contact can Disable the move that just hit. Prefer non-contact coverage into Ghosts that carry it.",
    href: "/learn/abilities",
  },
  {
    t: "Armor Tail",
    d: "Priority aimed at the user fails. Why Farigiraf ignores Fake Out on the Trick Room turn.",
    href: "/learn/abilities",
  },
  {
    t: "Flame Body",
    d: "Contact may burn the attacker. Not Flash Fire — the hit lands; the tax is the burn.",
    href: "/learn/abilities",
  },
  {
    t: "Miss",
    d: "Accuracy below 100% can fail even when the matchup is correct. Rain makes Thunder and Hurricane never miss.",
    href: "/learn/blank-turns",
  },
  {
    t: "Levitate",
    d: "Ground moves fail. Mold Breaker ignores it. Air Balloon is the item version — one pop.",
    href: "/learn/blank-turns",
  },
  {
    t: "Flash Fire",
    d: "Immune to Fire; absorbing a Fire hit powers up the user’s Fire attacks. Do not Autopilot STAB into it.",
    href: "/learn/blank-turns",
  },
  {
    t: "Air Balloon",
    d: "One-time Ground immunity until damage pops it. Read Balloon vs Boots on preview.",
    href: "/learn/blank-turns",
  },
  {
    t: "Mold Breaker",
    d: "Your moves ignore the target’s ability — Levitate, Flash Fire, Multiscale, Disguise, and similar soft walls.",
    href: "/learn/abilities",
  },
  {
    t: "Stat Points",
    d: "66 points to spend. Max 32 in one stat. 1 SP is +1 at Level 50.",
    href: "/learn/the-fight",
  },
  {
    t: "Focus Sash",
    d: "Survive any one hit from full HP at 1 HP. Glass after. Chip and rocks deny it.",
    href: "/learn/training",
  },
  {
    t: "Sitrus Berry",
    d: "One burst heal at ≤50% HP. Stay item — not a Sash.",
    href: "/learn/training",
  },
  {
    t: "Choice item",
    d: "Scarf, Band, or Specs. Power or Speed, locked into one move until you switch.",
    href: "/learn/training",
  },
  {
    t: "Life Orb",
    d: "More damage, self-chip, no lock. Flex power for attackers that need coverage.",
    href: "/learn/training",
  },
  {
    t: "Assault Vest",
    d: "Huge SpD. Cannot use status or Protect — damaging moves only.",
    href: "/learn/training",
  },
  { t: "Omni Ring", d: "The device that Mega Evolves. One Mega per battle. The Mega stone fills the item slot.", href: "/learn/training" },
  {
    t: "STAB",
    d: "Same-type attack bonus. 1.5× if the move matches your type. Most kits start here.",
    href: "/learn/types",
  },
  {
    t: "Win condition",
    d: "The Pokémon or mode that actually wins if the rest of the plan works. Your Mega, your Trick Room turns, your rain sweeper.",
    href: "/learn/building",
  },
  {
    t: "Core",
    d: "Two Pokémon that work as a unit: type synergy and checks-and-counters synergy. Build a breaking core first, then the shield.",
    href: "/learn/building",
  },
  {
    t: "Check",
    d: "Wins the 1v1 if both are already in, but can die to a predicted coverage on the switch. Not a free switch-in.",
    href: "/learn/holes",
  },
  {
    t: "Counter",
    d: "Switches in on any of their attacks and still wins. Beginners call every resist a counter. It is not.",
    href: "/learn/holes",
  },
  {
    t: "Never-leave",
    d: "The Pokémon that must survive to execute your wincon. Protect it in preview. Keep it in once it is winning.",
    href: "/learn/preview",
  },
  {
    t: "50/50",
    d: "Stay vs switch, Protect vs attack. Seasoned players do not win the coin. They pick the line that loses less if they are wrong.",
    href: "/learn/turns",
  },
  {
    t: "Revenge",
    d: "A faster or priority Pokémon that KOs whatever just got a KO. Extreme Speed, Sucker Punch, Aqua Jet, a Scarf.",
    href: "/learn/moves",
  },
  {
    t: "Momentum",
    d: "Leaving on your terms with U-turn, Volt Switch, or Parting Shot. A hard switch is a turn they attack for free.",
    href: "/learn/pivot-moves",
  },
  {
    t: "Tempo",
    d: "Who is forcing the next switch. Ahead means they leave. Behind means you leave. Cover two of their options; predict only when you are already behind.",
    href: "/learn/tempo",
  },
  {
    t: "Covering play",
    d: "A click that is still correct if they stay and still correct if they switch. Will-O-Wisp into two physicals. U-turn instead of a Triple Axel they can swap on.",
    href: "/learn/tempo",
  },
  {
    t: "Residual",
    d: "Chip that happens without a KO click: Stealth Rock, burn, weather, Life Orb. It pops Multiscale and Sash.",
    href: "/learn/field-moves",
  },
  {
    t: "Threatlist",
    d: "The five names that wall or sweep your three. If you have no answer, rebuild that slot — do not add a fourth job.",
    href: "/learn/building",
  },
  {
    t: "Mode",
    d: "A game state your three is trying to force: Trick Room, rain, sun, terrain. The rest of the team cashes that state.",
    href: "/learn/field-moves",
  },
  {
    t: "Speed",
    d: "Who moves first: base Spe, Stat Points, Choice Scarf, priority, Trick Room, weather Speed.",
    href: "/learn/speed",
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
    href: "/team/archetypes/hyper-offense",
  },
  {
    t: "Balance",
    d: "A breaker, a cleaner, and a patch. Control first, clean later. The usual first team. Other sites call this Good Stuff.",
    href: "/team/archetypes/balance",
  },
  {
    t: "Good Stuff",
    d: "A pile of individually strong Pokémon that cover each other. In Champions that is Balance, not a separate style.",
    href: "/team/archetypes/balance",
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
    href: "/learn/defense-moves",
  },
  {
    t: "Aurora Veil",
    d: "Both Reflect and Light Screen in one click — only while snow is up. Snow Warning Alolan Ninetales is the usual lead into it.",
    href: "/learn/defense-moves",
  },
  {
    t: "Snow",
    d: "Weather that enables Aurora Veil and buffs Ice Defense. Overwrite it and the Veil package collapses.",
    href: "/learn/field-moves",
  },
  {
    t: "Terrain",
    d: "Grassy, Psychic, Electric, or Misty Terrain. Usually set by an ability on entry. Rillaboom is the M-C one that matters.",
    href: "/team/archetypes/grassy",
  },
  {
    t: "Must-appear",
    d: "The name both of their modes need. Pelipper on rain. Farigiraf on Trick Room. If it is not coming, the plan is a lie. Plan the lead as if it is.",
    href: "/learn/reading-their-six",
  },
  {
    t: "Positioning",
    d: "What the wincon is right now. Pivot, Protect, or sacrifice. Count Tailwind, Trick Room, and weather. Steal the field so Electro Shot has to charge.",
    href: "/learn/positioning",
  },
  {
    t: "Tail Room",
    d: "Trick Room with a Tailwind backup on the same list. If the room gets Taunted they still race. Read both clocks.",
    href: "/learn/archetypes",
  },
];
