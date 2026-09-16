import { alt, train } from "@/content/manual-train";
import type {
  ManualFlow,
  ManualNote,
  ManualPack,
  ManualPackStrategy,
  ManualPhase,
  SlotManual,
  TeamManual,
} from "@/content/manuals";

const BOX = [
  "garchomp",
  "primarina",
  "corviknight",
  "golisopod",
  "gholdengo",
  "hippowdon",
] as const;

const CORE: [string, string, string] = ["garchomp", "primarina", "corviknight"];

function strategy(
  opponentPattern: string,
  bring: [string, string, string],
  purpose: string,
  targets: string[],
  refuses: string[],
  winCondition: string,
): ManualPackStrategy {
  return { opponentPattern, bring, purpose, targets, refuses, winCondition };
}

function garchompSlot(): SlotManual {
  return {
    slug: "garchomp",
    title: "The Breaker",
    job: "breaker",
    literacy: "wallbreaker",
    role: "Break the physical side of their team and force their answers to reveal themselves.",
    ability: "Rough Skin",
    item: "Garchompite",
    itemWhy: "Mega Garchomp gives the team its strongest dedicated breaking mode and lets you turn favorable preview information into immediate pressure.",
    itemAlts: [
      { name: "Life Orb", why: "Use when you want normal Garchomp to remain the primary form and preserve Mega Evolution for another legal Mega option in a revised team." },
      { name: "Rocky Helmet", why: "Use when you want passive contact punishment and are deliberately playing Garchomp as a bulky progress-maker." },
    ],
    nature: "Jolly",
    training: train(
      0,
      32,
      0,
      0,
      2,
      32,
      {
        label: "Fast breaker",
        why: "Max Attack and Speed make Garchomp immediately threatening while the remaining SP gives it a little extra special resilience.",
        spend: [
          "32 Atk — maximize breaking power.",
          "32 Spe — pressure slower offensive and defensive targets.",
          "2 SpD — use the final points for a small special buffer.",
        ],
      },
      [
        alt(
          "Bulky breaker",
          16,
          32,
          0,
          0,
          18,
          0,
          "Use when repeated switching matters more than winning every possible Speed race.",
          [
            "32 Atk — preserve breaking power.",
            "16 HP — increase general durability.",
            "18 SpD — improve special survivability.",
          ],
        ),
      ],
    ),
    moves: [
      {
        name: "Earthquake",
        why: "Primary Ground attack and the safest damage button when you do not need to predict.",
        alts: [
          { name: "Stomping Tantrum", why: "Use if your ruleset-specific damage testing shows it better fits your selected Mega form." },
        ],
      },
      {
        name: "Dragon Claw",
        why: "Reliable Dragon damage without locking yourself into Outrage.",
        alts: [
          { name: "Scale Shot", why: "Use when you want extra Speed pressure and accept less consistency." },
        ],
      },
      {
        name: "Stone Edge",
        why: "Punishes Flying types and prevents them from freely absorbing Ground pressure.",
        alts: [
          { name: "Rock Slide", why: "Use when consistency matters more than maximum power." },
        ],
      },
      {
        name: "Swords Dance",
        why: "Turns a forced switch into a potential three-KO sequence.",
        alts: [
          { name: "Fire Fang", why: "Use when Steel targets are consistently stopping your sweep attempt." },
        ],
      },
    ],
    objective: "Force their physical answer into range for Primarina or Garchomp's late-game cleanup.",
    howToPlay:
      `Bring Garchomp when their six lacks a comfortable Ground answer.
Use its first safe turn to learn what they are willing to sacrifice.
Mega only when the extra power changes a meaningful matchup.
Use Swords Dance when the opponent must switch.
Never sacrifice Garchomp early if it is the only Pokémon that removes their defensive anchor.`,
  };
}

function primarinaSlot(): SlotManual {
  return {
    slug: "primarina",
    title: "The Special Hammer",
    job: "breaker",
    literacy: "wallbreaker",
    role: "Attack from the special side and punish teams that overprepare for Garchomp.",
    ability: "Torrent",
    item: "Choice Specs",
    itemWhy: "Specs turns Primarina into the immediate special pressure that makes physical Garchomp answers unsafe.",
    itemAlts: [
      { name: "Assault Vest", why: "Use when Primarina needs to repeatedly absorb special attacks instead of maximizing damage." },
      { name: "Leftovers", why: "Use for a less explosive but more flexible set with repeated switching." },
    ],
    nature: "Modest",
    training: train(
      32,
      0,
      0,
      32,
      2,
      0,
      {
        label: "Special breaker",
        why: "Max Special Attack and HP make Primarina hit hard while remaining sturdy enough to trade with neutral special attacks.",
        spend: [
          "32 HP — improve overall durability.",
          "32 SpA — maximize special damage.",
          "2 SpD — use the remaining points for special resilience.",
        ],
      },
      [
        alt(
          "Fast Primarina",
          0,
          0,
          0,
          32,
          2,
          32,
          "Use when Speed control is more important than bulk.",
          [
            "32 SpA — maximize damage.",
            "32 Spe — improve offensive matchups.",
            "2 SpD — small special buffer.",
          ],
        ),
      ],
    ),
    moves: [
      {
        name: "Moonblast",
        why: "Primary Fairy attack and the team's main Dragon punishment.",
        alts: [
          { name: "Dazzling Gleam", why: "Use only if your current Champions learnset makes it preferable for your specific coverage needs." },
        ],
      },
      {
        name: "Hydro Pump",
        why: "Maximum Water pressure for breaking targets that expect to survive Surf.",
        alts: [
          { name: "Surf", why: "Use when consistent damage is more valuable than maximum breaking power." },
        ],
      },
      {
        name: "Psychic Noise",
        why: "Punishes targets that rely on recovery and helps turn damage into permanent progress.",
        alts: [
          { name: "Energy Ball", why: "Use when Water-resistant targets are repeatedly forcing Primarina out." },
        ],
      },
      {
        name: "Ice Beam",
        why: "Provides direct coverage into Dragon and Ground targets that try to exploit Primarina.",
        alts: [
          { name: "Flip Turn", why: "Use when maintaining momentum is more valuable than another coverage attack." },
        ],
      },
    ],
    objective: "Destroy the special side of the opponent's defensive plan and prevent them from using Garchomp answers as universal answers.",
    howToPlay:
      `Bring Primarina when their six contains multiple Garchomp answers that dislike strong Water or Fairy attacks.
Click the safest STAB when you need progress.
Use coverage only when you have identified the switch.
Preserve Primarina when their Dragon or Fighting threat is still unrevealed.
Never throw Primarina into an obvious super-effective attack just to gain one hit.`,
  };
}

function corviknightSlot(): SlotManual {
  return {
    slug: "corviknight",
    title: "The Pivot",
    job: "support",
    literacy: "pivot",
    role: "Provide the safest physical switch and return momentum to the breakers.",
    ability: "Mirror Armor",
    item: "Rocky Helmet",
    itemWhy: "Helmet punishes repeated physical contact and makes Corviknight's defensive turns generate progress.",
    itemAlts: [
      { name: "Leftovers", why: "Use when sustained recovery is more valuable than contact chip." },
      { name: "Heavy-Duty Boots", why: "Use when hazards are consistently limiting Corviknight's ability to switch." },
    ],
    nature: "Impish",
    training: train(
      32,
      0,
      32,
      0,
      2,
      0,
      {
        label: "Physical pivot",
        why: "Max HP and Defense let Corviknight absorb physical pressure while preserving some special resilience.",
        spend: [
          "32 HP — maximize general physical durability.",
          "32 Def — answer physical attackers.",
          "2 SpD — use the remaining points for special resilience.",
        ],
      },
      [
        alt(
          "Special buffer",
          32,
          0,
          2,
          0,
          32,
          0,
          "Use when your matchup list contains more special attackers than physical attackers.",
          [
            "32 HP — general durability.",
            "32 SpD — improve special switching.",
            "2 Def — retain a small physical buffer.",
          ],
        ),
      ],
    ),
    moves: [
      {
        name: "Roost",
        why: "Keeps Corviknight available as the team's emergency physical answer.",
        alts: [
          { name: "Protect", why: "Use when scouting Choice-locked attacks is more valuable than immediate recovery." },
        ],
      },
      {
        name: "U-turn",
        why: "The central momentum tool. Bring Garchomp or Primarina into the favorable matchup.",
        alts: [
          { name: "Body Press", why: "Use when Corviknight needs to punish physical targets directly." },
        ],
      },
      {
        name: "Brave Bird",
        why: "Prevents Corviknight from becoming completely passive.",
        alts: [
          { name: "Body Press", why: "Use when Steel and Fighting coverage is more useful than Flying damage." },
        ],
      },
      {
        name: "Defog",
        why: "Provides emergency hazard control when hazards would invalidate the pivot plan.",
        alts: [
          { name: "Iron Defense", why: "Use when the team can accept hazards and wants a stronger late-game defensive win condition." },
        ],
      },
    ],
    objective: "Buy safe turns for Garchomp and Primarina without losing the game to physical pressure.",
    howToPlay:
      `Use Corviknight as the default physical emergency switch.
U-turn when the opponent gives you a passive turn.
Roost when preserving Corviknight is more valuable than momentum.
Use Helmet damage to make repeated contact increasingly expensive.
Never leave Corviknight in against a clear special attacker unless the alternative loses the game.`,
  };
}

function golisopodSlot(): SlotManual {
  return {
    slug: "golisopod",
    title: "The Emergency Button",
    job: "support",
    role: "Punish fast offense, create forced trades, and give the team priority pressure.",
    ability: "Emergency Exit",
    item: "Heavy-Duty Boots",
    itemWhy: "Boots preserve Golisopod's ability to repeatedly enter the field and threaten priority without being worn down by hazards.",
    itemAlts: [
      { name: "Life Orb", why: "Use when Golisopod is part of an aggressive trade-heavy package." },
      { name: "Sitrus Berry", why: "Use when surviving one critical hit and immediately retaliating matters." },
    ],
    nature: "Adamant",
    training: train(
      32,
      32,
      2,
      0,
      0,
      0,
      {
        label: "Bulky attacker",
        why: "Attack investment makes its priority and Bug/Water attacks meaningful while HP and Defense support emergency switching.",
        spend: [
          "32 HP — maximize emergency durability.",
          "32 Atk — maximize damage and priority.",
          "2 Def — use the remaining points for physical bulk.",
        ],
      },
      [
        alt(
          "Special buffer",
          32,
          32,
          0,
          0,
          2,
          0,
          "Use when Golisopod needs to survive more special hits while retaining strong priority.",
          [
            "32 HP — durability.",
            "32 Atk — offensive pressure.",
            "2 SpD — special buffer.",
          ],
        ),
      ],
    ),
    moves: [
      {
        name: "First Impression",
        why: "The main reason to bring Golisopod into aggressive teams. Use it to punish immediate offensive pressure.",
      },
      {
        name: "Liquidation",
        why: "Reliable Water STAB that remains useful after First Impression is no longer available.",
        alts: [
          { name: "Aqua Jet", why: "Use if priority coverage is more important than raw Water power." },
        ],
      },
      {
        name: "Leech Life",
        why: "Damages Psychic and Dark targets while recovering HP.",
        alts: [
          { name: "X-Scissor", why: "Use when consistent Bug damage is more important than recovery." },
        ],
      },
      {
        name: "Sucker Punch",
        why: "Adds another priority option and punishes weakened offensive Pokémon trying to attack.",
        alts: [
          { name: "Spikes", why: "Use when Golisopod is part of a hazard-pressure package." },
        ],
      },
    ],
    objective: "Stop the opponent from freely snowballing with faster attackers.",
    howToPlay:
      `Bring Golisopod when their six contains several fast attackers that dislike priority.
Use First Impression early when the immediate trade is valuable.
Save Sucker Punch or Aqua Jet for the late game when Speed becomes decisive.
Use Golisopod to force damage before returning to Garchomp or Primarina.
Never treat Emergency Exit as a reason to stay in; use the forced exit to reset positioning.`,
  };
}

function gholdengoSlot(): SlotManual {
  return {
    slug: "gholdengo",
    title: "The Punisher",
    job: "breaker",
    literacy: "sweeper",
    role: "Punish passive defensive structures and convert forced switches into a special sweep.",
    ability: "Good as Gold",
    item: "Air Balloon",
    itemWhy: "Air Balloon temporarily denies Ground attacks and can create the exact free turn Gholdengo needs to punish a switch.",
    itemAlts: [
      { name: "Leftovers", why: "Use when sustained positioning matters more than a surprise Ground immunity." },
      { name: "Choice Scarf", why: "Use when the three-mon package needs immediate Speed control." },
    ],
    nature: "Timid",
    training: train(
      0,
      0,
      0,
      32,
      2,
      32,
      {
        label: "Fast special attacker",
        why: "Max Special Attack and Speed make Gholdengo an immediate threat rather than a passive defensive Steel.",
        spend: [
          "32 SpA — maximize special pressure.",
          "32 Spe — maximize offensive Speed.",
          "2 SpD — use the remaining points for special resilience.",
        ],
      },
      [
        alt(
          "Bulky special",
          32,
          0,
          0,
          32,
          2,
          0,
          "Use when Gholdengo must repeatedly absorb status or neutral special attacks.",
          [
            "32 HP — improve general durability.",
            "32 SpA — preserve damage.",
            "2 SpD — special buffer.",
          ],
        ),
      ],
    ),
    moves: [
      {
        name: "Make It Rain",
        why: "Primary Steel nuke and the strongest way to punish targets that cannot resist it.",
        alts: [
          { name: "Flash Cannon", why: "Use when consistent power is preferable to the Special Attack drop." },
        ],
      },
      {
        name: "Shadow Ball",
        why: "Reliable Ghost STAB for targets that resist Steel.",
        alts: [
          { name: "Hex", why: "Use only when the team is specifically built around status." },
        ],
      },
      {
        name: "Nasty Plot",
        why: "Turns a forced switch into a potential sweep.",
        alts: [
          { name: "Focus Blast", why: "Use when immediate coverage against Steel and Dark targets matters more than setup." },
        ],
      },
      {
        name: "Recover",
        why: "Preserves Gholdengo when it is needed across multiple turns.",
        alts: [
          { name: "Focus Blast", why: "Use when the matchup requires immediate coverage instead of longevity." },
        ],
      },
    ],
    objective: "Exploit teams that overprepare for Garchomp or rely on passive defensive turns.",
    howToPlay:
      `Bring Gholdengo when their six contains passive targets or status-based answers.
Use its immunities to manufacture a free turn.
Nasty Plot only when their remaining three cannot immediately punish you.
Use Make It Rain when you need guaranteed progress.
Never reveal Gholdengo early if its ability to surprise a passive answer is your main advantage.`,
  };
}

function hippowdonSlot(): SlotManual {
  return {
    slug: "hippowdon",
    title: "The Anchor",
    job: "support",
    literacy: "wall",
    role: "Absorb physical pressure, create chip, and stabilize games where Garchomp cannot safely pivot.",
    ability: "Sand Stream",
    item: "Leftovers",
    itemWhy: "Leftovers gives Hippowdon the longevity required to repeatedly switch into physical attackers and maintain its defensive role.",
    itemAlts: [
      { name: "Rocky Helmet", why: "Use when contact-heavy attackers are a major target." },
      { name: "Smooth Rock", why: "Use when extending Sand turns is specifically important to your revised weather package." },
    ],
    nature: "Impish",
    training: train(
      32,
      0,
      32,
      0,
      2,
      0,
      {
        label: "Physical anchor",
        why: "HP and Defense investment lets Hippowdon function as the team's second physical safety net.",
        spend: [
          "32 HP — maximize general durability.",
          "32 Def — maximize physical resilience.",
          "2 SpD — use the final points for a small special buffer.",
        ],
      },
      [
        alt(
          "Mixed anchor",
          32,
          0,
          18,
          0,
          16,
          0,
          "Use when special attacks are consistently forcing Hippowdon out.",
          [
            "32 HP — general durability.",
            "18 Def — preserve physical utility.",
            "16 SpD — improve special switching.",
          ],
        ),
      ],
    ),
    moves: [
      {
        name: "Earthquake",
        why: "Reliable Ground STAB and the main way Hippowdon avoids becoming passive.",
        alts: [
          { name: "Earth Power", why: "Not preferred on this physical build; only consider it after rebuilding the spread." },
        ],
      },
      {
        name: "Slack Off",
        why: "Keeps Hippowdon healthy enough to perform its defensive job repeatedly.",
        alts: [
          { name: "Protect", why: "Use for scouting when recovery is less important." },
        ],
      },
      {
        name: "Stealth Rock",
        why: "Turns repeated switching into permanent progress and helps Garchomp and Primarina secure KOs.",
        alts: [
          { name: "Whirlwind", why: "Use when setup sweepers are a bigger concern than hazard stacking." },
        ],
      },
      {
        name: "Stone Edge",
        why: "Stops Flying targets from treating Hippowdon as free setup or switch fodder.",
        alts: [
          { name: "Ice Fang", why: "Use when Dragon and Ground targets are the specific preview problem." },
        ],
      },
    ],
    objective: "Give the team a second physical backbone and make hazard chip meaningful.",
    howToPlay:
      `Bring Hippowdon when their six is heavily physical or depends on repeated switching.
Set Stealth Rock when you expect multiple switches.
Slack Off before Hippowdon reaches critical health.
Use Earthquake when the opponent tries to exploit your passive turn.
Never use Hippowdon as your special-defense answer just because it is bulky.`,
  };
}

const ROSTER: SlotManual[] = [
  garchompSlot(),
  primarinaSlot(),
  corviknightSlot(),
  golisopodSlot(),
  gholdengoSlot(),
  hippowdonSlot(),
];

function packCore(): ManualPack {
  return {
    id: "core",
    label: "Core",
    when: "Blind / balanced opponent six",
    identity: "Pressure balance: Corviknight pivots while Garchomp and Primarina attack opposite defensive axes.",
    slugs: ["garchomp", "primarina", "corviknight"],
    strategy: strategy(
      "Blind or balanced six with no overwhelming speed core",
      ["garchomp", "primarina", "corviknight"],
      "Corviknight pivots while Garchomp and Primarina attack opposite defensive axes",
      ["balanced teams", "physical-heavy teams", "teams with only one strong Garchomp answer", "teams with Dragon weaknesses"],
      ["dedicated hyper offense with multiple faster threats", "teams that clearly punish Corviknight's passive turns", "teams where Primarina is their obvious target"],
      "Make their first defensive response reveal physical vs special comfort, then attack the weaker side",
    ),
    pilot: {
      thesis: "Make their first defensive response reveal whether their team is built more comfortably against physical or special pressure, then attack the weaker side.",
      rule: "Lead Corviknight when you need information; lead Garchomp when their Ground answer is weak; lead Primarina when their six is visibly Ground- and Dragon-heavy.",
      fail: "Never sacrifice the breaker that their six cannot replace.",
    },
    meta: "This is the default package. It is deliberately simple so a newer player has a reliable starting point before learning the matchup packs.",
    philosophy: "Use Corviknight to reduce guessing. U-turn into whichever breaker their current Pokémon cannot comfortably answer.",
    press: ["balanced teams", "physical-heavy teams", "teams with only one strong Garchomp answer", "teams with Dragon weaknesses"],
    refuse: ["dedicated hyper offense with multiple faster threats", "teams that clearly punish Corviknight's passive turns", "teams where Primarina is their obvious target"],
    switches: [
      {
        into: "Ice",
        send: "Corviknight. Never Garchomp into an obvious Ice attack.",
      },
      {
        into: "Dragon",
        send: "Primarina. Preserve Garchomp rather than trading it into a Dragon.",
      },
      {
        into: "Physical contact",
        send: "Corviknight. Rocky Helmet turns their attack into chip.",
      },
      {
        into: "Ground",
        send: "Corviknight when safe, or Primarina when the Ground attacker threatens Garchomp.",
      },
      {
        into: "Fire",
        send: "Primarina when the Fire attacker cannot immediately threaten it.",
      },
      {
        into: "Fighting",
        send: "Primarina or Corviknight depending on whether the attack is physical or special.",
      },
      {
        into: "Passive wall",
        send: "Garchomp. Use the free turn to attack or set up.",
      },
      {
        into: "Special attacker",
        send: "Primarina when it resists the attack; do not default to Corviknight.",
      },
    ],
    plan: [
      {
        title: "Clock",
        goal: "Reveal their preferred answer without losing a key Pokémon.",
        play: "Use Corviknight and U-turn to see what they send into your pivot.",
        next: "Bring the breaker that punishes that answer.",
      },
      {
        title: "Shield",
        goal: "Keep the opponent's strongest threat from gaining a free sweep.",
        play: "Preserve the Pokémon that directly answers their remaining win condition.",
        next: "Trade expendable HP for positioning, not random damage.",
      },
      {
        title: "Clean",
        goal: "Finish after their defensive core has been weakened.",
        play: "Use Garchomp or Primarina as the final attacker instead of continuing to pivot.",
        next: "Stop switching when the winning attack is already available.",
      },
    ],
    loops: [
      {
        title: "Corviknight loop",
        body: "Bring Corviknight into physical pressure. Use U-turn when they respect it. Send Garchomp or Primarina based on the revealed switch. Repeat until one answer is too weak to switch anymore.",
      },
      {
        title: "Breaker loop",
        body: "Identify their Garchomp answer. Attack it with Garchomp or Primarina. If it survives, switch back to Corviknight instead of forcing the second hit. Repeat until the answer is in KO range.",
      },
    ],
    victims: [
      {
        name: "Balanced physical teams",
        why: "Corviknight absorbs their contact pressure while Garchomp attacks their defensive backbone.",
      },
      {
        name: "Single-answer teams",
        why: "If one Pokémon is doing all the work against Garchomp, Primarina can punish the switch pattern.",
      },
    ],
    counters: [
      {
        name: "Fast hyper offense",
        why: "The core lacks the emergency priority of Golisopod. Bring the Anti-Offense pack instead.",
      },
      {
        name: "Passive special balance",
        why: "Corviknight can become low-value. Bring Gholdengo to punish passive turns.",
      },
    ],
    advantages: [
      {
        title: "Two-sided pressure",
        body: "Garchomp attacks physically while Primarina attacks specially.",
        watch: "Which of those two is the opponent protecting against more aggressively?",
        play: "Attack the side they are protecting less.",
        rule: "Never repeatedly attack into the same protected answer.",
      },
      {
        title: "Safe pivot",
        body: "Corviknight converts uncertain turns into information.",
        watch: "Whether the opponent immediately brings their designated Corviknight answer.",
        play: "U-turn and punish the revealed answer.",
        rule: "Never U-turn automatically when the current Pokémon can simply attack for a winning trade.",
      },
    ],
    hazards: [
      {
        title: "Ice into Garchomp",
        body: "Garchomp's 4x Ice weakness makes blind switching dangerous.",
        watch: "Ice coverage on their preview.",
        play: "Keep Corviknight healthy as the emergency switch.",
        rule: "Never send Garchomp into a known Ice attack.",
      },
      {
        title: "Corviknight becomes passive",
        body: "Some teams use Corviknight as a free setup or special-attacking opportunity.",
        watch: "A Pokémon repeatedly entering Corviknight without fearing Brave Bird.",
        play: "U-turn immediately and bring the correct breaker.",
        rule: "Never let Corviknight become a free turn.",
      },
    ],
    phases: [
      {
        id: "preview",
        title: "Preview",
        lede: "Look for their main physical attacker, their Garchomp answer, their Dragon answer, and anything that punishes Corviknight.",
        branches: [
          {
            when: "Balanced six with no overwhelming speed core",
            then: "Bring Core: Garchomp + Primarina + Corviknight.",
          },
          {
            when: "Saw multiple fast attackers",
            then: "Bring Anti-Offense: Golisopod + Garchomp + Primarina.",
          },
          {
            when: "Saw passive walls or status-heavy support",
            then: "Bring Bully: Garchomp + Gholdengo + Primarina.",
          },
          {
            when: "Saw several physical attackers and setup pressure",
            then: "Bring Anchor: Hippowdon + Corviknight + Primarina.",
          },
        ],
      },
      {
        id: "lead",
        title: "Lead",
        lede: "Lead the Pokémon that forces the least damaging first prediction.",
        branches: [
          {
            out: "corviknight",
            when: "Physical or blind lead",
            then: "Stay and scout with the appropriate defensive move or U-turn.",
            why: "Corviknight's job is to buy information.",
          },
          {
            out: "garchomp",
            when: "Their lead has no safe Ground answer",
            then: "Attack immediately.",
            why: "Do not give a favorable matchup extra turns.",
          },
          {
            out: "primarina",
            when: "Their lead is weak to Water or Fairy",
            then: "Apply immediate special pressure.",
            why: "The opponent should not get a free setup turn.",
          },
        ],
      },
      {
        id: "mid",
        title: "Mid",
        lede: "Identify the one Pokémon they cannot afford to lose.",
        branches: [
          {
            when: "Their Garchomp answer is exposed",
            then: "Attack that answer with the appropriate breaker.",
          },
          {
            when: "They are preserving one defensive pivot",
            then: "Use the opposite offensive axis.",
            why: "Do not attack the protected target repeatedly.",
          },
        ],
      },
      {
        id: "late",
        title: "Late",
        lede: "Stop preserving all three. Preserve only the Pokémon that wins the remaining matchup.",
        branches: [
          {
            when: "Garchomp has a clean Ground attack",
            then: "Stop pivoting and attack.",
          },
          {
            when: "Primarina outspeeds the remaining threats",
            then: "Use Primarina to clean.",
          },
        ],
      },
    ],
    flows: [
      {
        id: "lead",
        title: "Lead",
        lede: "Use preview to choose whether information or immediate pressure has more value.",
        forks: [
          {
            id: "lead-physical",
            when: "Physical or blind",
            then: "Lead Corviknight.",
            send: "corviknight",
            why: "It gives you the safest information turn.",
            forks: [
              {
                id: "lead-physical-pivot",
                when: "They switch to a Corviknight answer",
                then: "U-turn immediately.",
                move: "U-turn",
                send: "garchomp",
                why: "Punish the revealed answer.",
              },
            ],
          },
          {
            id: "lead-ground",
            when: "Their lead cannot safely answer Ground",
            then: "Lead Garchomp.",
            send: "garchomp",
            why: "Make them react instead of giving them the first setup turn.",
            forks: [
              {
                id: "lead-ground-switch",
                when: "They bring their Ground answer",
                then: "Switch to Primarina.",
                send: "primarina",
                why: "Attack the answer instead of forcing Garchomp through it.",
              },
            ],
          },
        ],
      },
      {
        id: "mid",
        title: "Mid",
        lede: "Convert revealed answers into permanent damage.",
        forks: [
          {
            id: "mid-garchomp-answer",
            when: "Their dedicated Garchomp answer is below healthy range",
            then: "Stop switching and pressure the answer.",
            send: "garchomp",
            why: "Once the answer is weakened, Garchomp becomes the win condition.",
            forks: [
              {
                id: "mid-garchomp-answer-primarina",
                when: "They preserve the answer instead of attacking",
                then: "Double to Primarina.",
                send: "primarina",
                why: "Punish predictable preservation.",
              },
            ],
          },
        ],
      },
      {
        id: "late",
        title: "Late",
        lede: "Choose one win condition and stop trading it unnecessarily.",
        forks: [
          {
            id: "late-garchomp",
            when: "Garchomp outspeeds and has a clean attack",
            then: "Attack.",
            send: "garchomp",
            why: "Do not create a losing prediction when the position already wins.",
          },
          {
            id: "late-primarina",
            when: "Remaining Pokémon are weak to Water or Fairy",
            then: "Clean with Primarina.",
            send: "primarina",
            why: "Preserve the simple winning line.",
          },
        ],
      },
    ],
  };
}

function packAntiOffense(): ManualPack {
  return {
    id: "anti-offense",
    label: "Anti-Offense",
    when: "Saw three or more fast offensive threats on their six",
    identity: "Force trades with Golisopod, then let Garchomp and Primarina clean.",
    slugs: ["golisopod", "garchomp", "primarina"],
    strategy: strategy(
      "Three or more fast offensive threats on their six",
      ["golisopod", "garchomp", "primarina"],
      "Force trades with Golisopod, then let breakers clean",
      ["hyper offense", "fast attackers", "fragile setup sweepers", "teams that depend on Speed control"],
      ["slow defensive teams", "teams with multiple strong priority answers", "teams that punish Golisopod's Bug/Water profile"],
      "Remove Speed advantage with priority and bulky trades, then finish",
    ),
    pilot: {
      thesis: "Their advantage is Speed. Remove that advantage with priority and bulky trades, then let the breakers finish.",
      rule: "Do not chase perfect switches. Trade Golisopod's HP for the most dangerous fast attacker.",
      fail: "Never sacrifice Golisopod before identifying which fast attacker must be stopped.",
    },
    meta: "M-C newly allows Mega Golisopod, making the species especially relevant to the current regulation.",
    philosophy: "This package accepts damage. Its goal is not to preserve every Pokémon at high HP; it is to deny the opponent a clean sweep.",
    press: ["hyper offense", "fast attackers", "fragile setup sweepers", "teams that depend on Speed control"],
    refuse: ["slow defensive teams", "teams with multiple strong priority answers", "teams that punish Golisopod's Bug/Water profile"],
    switches: [
      {
        into: "Fast physical attacker",
        send: "Golisopod.",
      },
      {
        into: "Dragon",
        send: "Primarina.",
      },
      {
        into: "Ice",
        send: "Primarina or Golisopod depending on the attacker.",
      },
      {
        into: "Ground",
        send: "Primarina when it can safely absorb the attack.",
      },
      {
        into: "Rock",
        send: "Garchomp or Primarina based on the specific move.",
      },
      {
        into: "Fighting",
        send: "Primarina.",
      },
      {
        into: "Low-health attacker",
        send: "Golisopod and use priority.",
      },
      {
        into: "Passive wall",
        send: "Garchomp.",
      },
    ],
    plan: [
      {
        title: "Clock",
        goal: "Stop their fastest threat from taking multiple free turns.",
        play: "Use Golisopod to force immediate respect.",
        next: "Bring Garchomp or Primarina after the forced trade.",
      },
      {
        title: "Shield",
        goal: "Keep the priority user alive until the endgame.",
        play: "Do not spend First Impression casually if their fastest threat is still healthy.",
        next: "Use other Pokémon to soften targets first.",
      },
      {
        title: "Clean",
        goal: "Use priority or raw Speed to close.",
        play: "Preserve Garchomp if it outspeeds their remaining attackers; preserve Primarina if Fairy/Water closes the matchup.",
        next: "Use Golisopod's priority when the speed race becomes dangerous.",
      },
    ],
    loops: [
      {
        title: "Priority loop",
        body: "Let Golisopod absorb or threaten the fast attacker. Use First Impression when the trade is valuable. Bring the appropriate breaker after the forced damage.",
      },
      {
        title: "Breaker race",
        body: "Use Garchomp to remove their defensive stop. Use Primarina to punish the response. Return to priority only when their remaining attacker can outrun both.",
      },
    ],
    victims: [
      {
        name: "Hyper offense",
        why: "Priority and bulky Golisopod trades prevent the opponent from winning purely through Speed.",
      },
      {
        name: "Fast fragile sweepers",
        why: "Golisopod can threaten them without needing to win a Speed race.",
      },
    ],
    counters: [
      {
        name: "Bulky balance",
        why: "Golisopod can lose value after its first priority attack. Bring Bully instead.",
      },
      {
        name: "Strong Electric pressure",
        why: "Golisopod's Water typing can become exploitable. Use Core or Anchor instead.",
      },
    ],
    advantages: [
      {
        title: "Speed denial",
        body: "Golisopod changes the value of Speed by threatening priority.",
        watch: "Whether their fastest attacker can survive First Impression.",
        play: "Keep Golisopod healthy until that attacker is weakened.",
        rule: "Never spend First Impression on a low-value target if their real cleaner is still healthy.",
      },
      {
        title: "Two breakers",
        body: "Garchomp and Primarina prevent the opponent from simply walling Golisopod.",
        watch: "Which breaker they answer more aggressively.",
        play: "Use the opposite breaker.",
        rule: "Never let their defensive answer dictate all three of your switches.",
      },
    ],
    hazards: [
      {
        title: "Priority denial",
        body: "Some opponents can survive or punish Golisopod's priority.",
        watch: "Resistances and bulky priority answers.",
        play: "Use Garchomp or Primarina to weaken them first.",
        rule: "Never assume First Impression equals a guaranteed KO.",
      },
      {
        title: "Golisopod forced low",
        body: "Emergency Exit can activate at an inconvenient time.",
        watch: "Damage ranges before attacking.",
        play: "Use the forced switch as a momentum opportunity.",
        rule: "Never treat Emergency Exit as a substitute for correct switching.",
      },
    ],
    phases: [
      {
        id: "preview",
        title: "Preview",
        lede: "Count their fast attackers and identify which one actually wins if Golisopod disappears.",
        branches: [
          {
            when: "Saw three or more fast offensive threats",
            then: "Bring Anti-Offense: Golisopod + Garchomp + Primarina.",
          },
          {
            when: "Saw mostly slow walls",
            then: "Do not bring this pack; bring Bully.",
          },
        ],
      },
      {
        id: "lead",
        title: "Lead",
        lede: "Lead Golisopod when immediate priority pressure prevents their lead from freely attacking.",
        branches: [
          {
            out: "golisopod",
            when: "Fast physical attacker",
            then: "Stay and threaten First Impression.",
            why: "Force them to respect the priority.",
          },
        ],
      },
      {
        id: "mid",
        title: "Mid",
        lede: "Use Garchomp and Primarina to remove the Pokémon that survives Golisopod.",
        branches: [
          {
            when: "Their physical wall is exposed",
            then: "Send Garchomp.",
          },
          {
            when: "Their Dragon or Fighting answer is exposed",
            then: "Send Primarina.",
          },
        ],
      },
      {
        id: "late",
        title: "Late",
        lede: "Let priority decide the final Speed race.",
        branches: [
          {
            when: "Opponent has a faster low-health attacker",
            then: "Preserve Golisopod and use priority.",
          },
        ],
      },
    ],
    flows: [
      {
        id: "lead",
        title: "Lead",
        lede: "Start with the Pokémon that denies their fastest immediate line.",
        forks: [
          {
            id: "offense-lead",
            when: "Fast physical attacker",
            then: "Lead Golisopod.",
            send: "golisopod",
            why: "Force them to respect First Impression.",
            forks: [
              {
                id: "offense-lead-switch",
                when: "They switch to resist Bug",
                then: "Switch to Primarina if the target is Water/Fairy vulnerable.",
                send: "primarina",
                why: "Punish the defensive response.",
              },
            ],
          },
        ],
      },
      {
        id: "mid",
        title: "Mid",
        lede: "Trade Golisopod for the threat that matters most.",
        forks: [
          {
            id: "mid-threat",
            when: "Their fastest cleaner is within priority range",
            then: "Preserve Golisopod.",
            send: "golisopod",
            why: "Its remaining HP is now more valuable than another switch.",
          },
        ],
      },
      {
        id: "late",
        title: "Late",
        lede: "End the game with priority or the surviving breaker.",
        forks: [
          {
            id: "late-priority",
            when: "Opponent is faster but weakened",
            then: "Use First Impression or Sucker Punch.",
            send: "golisopod",
            why: "Do not enter a Speed race you can avoid.",
          },
        ],
      },
    ],
  };
}

function packBully(): ManualPack {
  return {
    id: "bully",
    label: "Bully",
    when: "Saw passive walls, recovery-heavy teams, or teams with one obvious physical answer",
    identity: "Garchomp + Gholdengo + Primarina attack different defensive answers until the opponent runs out of safe switches.",
    slugs: ["garchomp", "gholdengo", "primarina"],
    strategy: strategy(
      "Passive walls, recovery-heavy teams, or one obvious physical answer",
      ["garchomp", "gholdengo", "primarina"],
      "Attack different defensive answers until safe switches run out",
      ["balance", "stall-like structures", "passive pivots", "teams with one physical wall"],
      ["extreme hyper offense", "strong priority-heavy teams", "teams that naturally outspeed and threaten all three"],
      "Force defensive six to answer different damage types every turn",
    ),
    pilot: {
      thesis: "Do not let a defensive six dictate the pace. Force it to answer different damage types every turn.",
      rule: "If they preserve one answer, attack the other side of their team.",
      fail: "Never spend turns repeatedly attacking the same protected wall.",
    },
    meta: "This pack turns the six into a direct anti-balance tool rather than relying on the default pivot structure.",
    philosophy: "Garchomp breaks physically, Gholdengo punishes passive turns, and Primarina makes the special side impossible to ignore.",
    press: ["balance", "stall-like structures", "passive pivots", "teams with one physical wall"],
    refuse: ["extreme hyper offense", "strong priority-heavy teams", "teams that naturally outspeed and threaten all three"],
    switches: [
      {
        into: "Physical wall",
        send: "Primarina.",
      },
      {
        into: "Special wall",
        send: "Garchomp.",
      },
      {
        into: "Passive support",
        send: "Gholdengo.",
      },
      {
        into: "Dragon",
        send: "Primarina.",
      },
      {
        into: "Steel",
        send: "Garchomp.",
      },
      {
        into: "Fairy",
        send: "Gholdengo.",
      },
      {
        into: "Ground",
        send: "Primarina.",
      },
      {
        into: "Status attempt",
        send: "Gholdengo when its ability blocks the relevant move.",
      },
    ],
    plan: [
      {
        title: "Clock",
        goal: "Force the defensive team to reveal its actual Garchomp answer.",
        play: "Use Garchomp's threat to create the first defensive reaction.",
        next: "Attack the revealed answer with Primarina or Gholdengo.",
      },
      {
        title: "Shield",
        goal: "Preserve whichever breaker the opponent cannot comfortably answer.",
        play: "Do not trade both breakers for chip.",
        next: "Keep one breaker healthy for the endgame.",
      },
      {
        title: "Clean",
        goal: "Exploit the point where their defensive core has one missing piece.",
        play: "Set up with Gholdengo or Garchomp when the remaining answers cannot punish the setup.",
        next: "Stop switching and convert the advantage.",
      },
    ],
    loops: [
      {
        title: "Wall bullying",
        body: "Send Garchomp into a passive target. When they bring the physical answer, go Primarina. When they bring the special answer, go Garchomp. Use Gholdengo when the opponent relies on passive support.",
      },
      {
        title: "Gholdengo trap",
        body: "Bring Gholdengo into a move it can exploit. Use the forced switch to attack or set up. Preserve it if the opponent still has a key Fairy or Steel target.",
      },
    ],
    victims: [
      {
        name: "Passive balance",
        why: "The package attacks both physical and special defensive axes.",
      },
      {
        name: "Status-heavy support",
        why: "Gholdengo can punish predictable status-based turns.",
      },
    ],
    counters: [
      {
        name: "Hyper offense",
        why: "The package lacks Golisopod's emergency priority. Bring Anti-Offense.",
      },
      {
        name: "Fast Dragon offense",
        why: "Primarina can become overloaded. Bring Core or Anti-Offense depending on Speed.",
      },
    ],
    advantages: [
      {
        title: "Defensive overload",
        body: "Their answers cannot all be correct against three different offensive axes.",
        watch: "Which Pokémon they send repeatedly to answer Garchomp.",
        play: "Target that answer with Primarina.",
        rule: "Never let one defensive Pokémon absorb all your attacks for free.",
      },
    ],
    hazards: [
      {
        title: "Overprediction",
        body: "Trying to predict every defensive switch can throw away easy damage.",
        watch: "Whether your current attack already has a favorable damage outcome.",
        play: "Use the strongest safe move when the reward is sufficient.",
        rule: "Never make a five-step prediction when a two-step line wins.",
      },
    ],
    phases: [
      {
        id: "preview",
        title: "Preview",
        lede: "Find their physical wall, special wall, and safest recovery loop.",
        branches: [
          {
            when: "Saw passive walls or recovery-heavy Pokémon",
            then: "Bring Bully: Garchomp + Gholdengo + Primarina.",
          },
        ],
      },
      {
        id: "lead",
        title: "Lead",
        lede: "Lead the attacker that immediately pressures the most likely wall.",
        branches: [
          {
            out: "garchomp",
            when: "Their lead cannot threaten Garchomp",
            then: "Attack or use Swords Dance.",
            why: "Do not let a passive team establish its loop.",
          },
        ],
      },
      {
        id: "mid",
        title: "Mid",
        lede: "Alternate physical and special pressure.",
        branches: [
          {
            when: "They repeatedly answer Garchomp with the same wall",
            then: "Send Primarina.",
          },
          {
            when: "They rely on passive support",
            then: "Send Gholdengo.",
          },
        ],
      },
      {
        id: "late",
        title: "Late",
        lede: "Use the surviving breaker to finish once their answer is weakened.",
        branches: [
          {
            when: "Gholdengo has a free setup turn",
            then: "Use Nasty Plot.",
          },
        ],
      },
    ],
    flows: [
      {
        id: "lead",
        title: "Lead",
        lede: "Start with the breaker that forces the clearest defensive reaction.",
        forks: [
          {
            id: "bully-lead",
            when: "Passive or defensive lead",
            then: "Lead Garchomp.",
            send: "garchomp",
            why: "Make their physical answer appear.",
            forks: [
              {
                id: "bully-switch",
                when: "They bring a physical wall",
                then: "Switch to Primarina.",
                send: "primarina",
                why: "Attack the answer rather than the target.",
              },
            ],
          },
        ],
      },
      {
        id: "mid",
        title: "Mid",
        lede: "Make each switch cost something.",
        forks: [
          {
            id: "bully-mid",
            when: "They have one answer to Garchomp and one answer to Primarina",
            then: "Use Gholdengo to punish the passive pivot.",
            send: "gholdengo",
            why: "Force them to reveal the third layer of their defense.",
          },
        ],
      },
      {
        id: "late",
        title: "Late",
        lede: "Exploit the first defensive collapse.",
        forks: [
          {
            id: "bully-clean",
            when: "Their main Ground or Fairy answer is gone",
            then: "Commit to the corresponding cleaner.",
            send: "garchomp",
            why: "Do not keep rotating once the defensive structure has broken.",
          },
        ],
      },
    ],
  };
}

function packAnchor(): ManualPack {
  return {
    id: "anchor",
    label: "Anchor",
    when: "Saw a physical-heavy six, setup attackers, or repeated contact attackers",
    identity: "Hippowdon + Corviknight absorb physical pressure while Primarina handles the special and Dragon side.",
    slugs: ["hippowdon", "corviknight", "primarina"],
    strategy: strategy(
      "Physical-heavy six, setup attackers, or repeated contact",
      ["hippowdon", "corviknight", "primarina"],
      "Hippowdon and Corviknight absorb physical; Primarina covers special and Dragon",
      ["physical offense", "contact attackers", "setup attackers without immediate special pressure", "slow balance"],
      ["special offense", "strong Grass/Water cores", "teams that exploit passive defensive turns"],
      "Make them prove they can break the shell before committing offense",
    ),
    pilot: {
      thesis: "Make the opponent prove they can break the defensive shell before committing to their offense.",
      rule: "Preserve Hippowdon and Corviknight until you know which physical threat is their real win condition.",
      fail: "Never let both physical answers become low at the same time.",
    },
    meta: "This is the safest defensive package in the six and gives the team a way to answer physical-heavy previews without forcing Garchomp into every matchup.",
    philosophy: "Hippowdon handles direct physical pressure, Corviknight handles contact and pivoting, and Primarina prevents the package from becoming helpless against special or Dragon attackers.",
    press: ["physical offense", "contact attackers", "setup attackers without immediate special pressure", "slow balance"],
    refuse: ["special offense", "strong Grass/Water cores", "teams that exploit passive defensive turns"],
    switches: [
      {
        into: "Physical contact",
        send: "Corviknight.",
      },
      {
        into: "Strong physical Ground",
        send: "Corviknight.",
      },
      {
        into: "Electric attack",
        send: "Hippowdon.",
      },
      {
        into: "Dragon",
        send: "Primarina.",
      },
      {
        into: "Fighting",
        send: "Primarina or Corviknight depending on attack.",
      },
      {
        into: "Fire",
        send: "Primarina.",
      },
      {
        into: "Passive physical wall",
        send: "Primarina.",
      },
      {
        into: "Setup attacker",
        send: "Hippowdon and use the appropriate anti-setup line.",
      },
    ],
    plan: [
      {
        title: "Clock",
        goal: "Force physical attackers to spend HP entering your shell.",
        play: "Use Hippowdon and Corviknight to alternate defensive checks.",
        next: "Use Stealth Rock once their switch pattern is clear.",
      },
      {
        title: "Shield",
        goal: "Keep the two physical answers alive.",
        play: "Do not let both Hippowdon and Corviknight fall into KO range.",
        next: "Use Primarina to absorb attacks that do not belong to the physical shell.",
      },
      {
        title: "Clean",
        goal: "Let Primarina finish once physical pressure is exhausted.",
        play: "Use the accumulated chip to make Primarina's attacks decisive.",
        next: "Stop playing defensively once the opponent's breakers are weakened.",
      },
    ],
    loops: [
      {
        title: "Physical shell",
        body: "Use Hippowdon for Ground and Electric pressure. Use Corviknight for physical contact. Rotate until the opponent reveals the move that breaks the shell.",
      },
    ],
    victims: [
      {
        name: "Physical offense",
        why: "Two physical anchors make it difficult to win purely through contact damage.",
      },
      {
        name: "Electric pressure",
        why: "Hippowdon gives the package a Ground immunity to Electric attacks.",
      },
    ],
    counters: [
      {
        name: "Special offense",
        why: "The package can be overloaded by strong special attackers. Bring Core or Anti-Offense.",
      },
      {
        name: "Passive status teams",
        why: "The package can lose momentum. Bring Bully.",
      },
    ],
    advantages: [
      {
        title: "Two physical answers",
        body: "Hippowdon and Corviknight prevent one physical matchup from deciding the game immediately.",
        watch: "Which of the two they are targeting.",
        play: "Preserve the targeted answer and use the other to absorb the pressure.",
        rule: "Never allow both physical checks to become simultaneously expendable.",
      },
    ],
    hazards: [
      {
        title: "Passive spiral",
        body: "Defending without creating progress can give the opponent free setup turns.",
        watch: "Repeated switches without damage or hazard progress.",
        play: "Set Stealth Rock or pivot to Primarina.",
        rule: "Never defend forever when the opponent is gaining information for free.",
      },
    ],
    phases: [
      {
        id: "preview",
        title: "Preview",
        lede: "Count physical attackers and identify whether their special side can overwhelm the shell.",
        branches: [
          {
            when: "Saw three or more physical attackers",
            then: "Bring Anchor: Hippowdon + Corviknight + Primarina.",
          },
        ],
      },
      {
        id: "lead",
        title: "Lead",
        lede: "Lead the defensive answer to their most likely physical opener.",
        branches: [
          {
            out: "corviknight",
            when: "Their lead is contact-heavy",
            then: "Stay and scout.",
            why: "Helmet and bulk punish the expected line.",
          },
          {
            out: "hippowdon",
            when: "Their lead threatens Electric or Ground pressure",
            then: "Lead Hippowdon.",
            why: "Establish the physical anchor immediately.",
          },
        ],
      },
      {
        id: "mid",
        title: "Mid",
        lede: "Rotate without allowing both walls to be weakened.",
        branches: [
          {
            when: "Corviknight falls below safe health",
            then: "Use Hippowdon for the next physical attack.",
          },
        ],
      },
      {
        id: "late",
        title: "Late",
        lede: "Turn accumulated chip into a Primarina cleanup.",
        branches: [
          {
            when: "Their physical attackers are weakened",
            then: "Preserve Primarina and begin attacking.",
          },
        ],
      },
    ],
    flows: [
      {
        id: "lead",
        title: "Lead",
        lede: "Match your defensive lead to their obvious physical opener.",
        forks: [
          {
            id: "anchor-contact",
            when: "Physical contact",
            then: "Lead Corviknight.",
            send: "corviknight",
            why: "Helmet and bulk make contact expensive.",
            forks: [
              {
                id: "anchor-contact-switch",
                when: "They reveal a special attacker",
                then: "Switch to Primarina.",
                send: "primarina",
                why: "Do not leave Corviknight exposed.",
              },
            ],
          },
          {
            id: "anchor-ground",
            when: "Ground or Electric pressure",
            then: "Lead Hippowdon.",
            send: "hippowdon",
            why: "Establish the correct defensive immunity.",
          },
        ],
      },
      {
        id: "mid",
        title: "Mid",
        lede: "Rotate between the two physical checks.",
        forks: [
          {
            id: "anchor-rotate",
            when: "Their attacker threatens Corviknight but not Hippowdon",
            then: "Switch to Hippowdon.",
            send: "hippowdon",
            why: "Preserve Corviknight for contact attackers.",
          },
        ],
      },
      {
        id: "late",
        title: "Late",
        lede: "Stop defending once the physical threats are sufficiently weakened.",
        forks: [
          {
            id: "anchor-clean",
            when: "Primarina has favorable targets remaining",
            then: "Attack with Primarina.",
            send: "primarina",
            why: "The defensive phase has done its job.",
          },
        ],
      },
    ],
  };
}

export const PRESSURE_BALANCE_MANUAL: TeamManual = (() => {
  const core = packCore();
  const packs = [core, packAntiOffense(), packBully(), packAnchor()];
  return {
    id: "aggressive-balance-garchomp-primarina-corviknight",
    title: "Pressure Balance",
    lede: "Register six → read their six → bring the three that attack their structure, using Garchomp and Primarina to break while Corviknight, Golisopod, Gholdengo, and Hippowdon change which answers the opponent must respect.",
    philosophy: "Preview-driven balance. Garchomp and Primarina are the main pressure pair; the other four form different three-mon packages. Do not bring the same three automatically; identify what their six wants to bully, then choose the package that makes that plan uncomfortable.",
    archetype: "balance",
    family: "clock",
    pilot: core.pilot,
    slugs: CORE,
    meta: "Regulation M-C ranked ruleset (Sep 9–Dec 2, 2026): Level 50 Singles, six registered, 90-second preview, three for battle. Mega Evolution once per battle. M-C newly permits Mega Garchomp and Mega Golisopod.",
    press: core.press,
    refuse: core.refuse,
    switches: core.switches,
    plan: core.plan,
    skills: ["U-turn", "Sucker Punch", "Stealth Rock", "Protect", "priority management", "preview reading", "double switching"],
    relatedLessons: ["preview", "types", "turns", "switching", "win conditions"],
    setsNote: "All 66 SP on every Pokémon. Mix of fast offensive, bulky pivot, and mixed bulk so six can form different packages. Mega is preview-dependent, not automatic turn one.",
    victims: core.victims,
    counters: core.counters,
    advantages: core.advantages,
    slots: ROSTER.filter((s) => (CORE as string[]).includes(s.slug)).sort(
      (a, b) => CORE.indexOf(a.slug) - CORE.indexOf(b.slug),
    ),
    phases: core.phases!,
    flows: core.flows,
    loops: core.loops,
    hazards: core.hazards,
    box: [...BOX],
    roster: ROSTER,
    core: CORE,
    packs,
  };
})();
