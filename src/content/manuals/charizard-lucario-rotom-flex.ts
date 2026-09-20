import type { TeamManual } from "@/content/manuals";

export const CHARIZARD_LUCARIO_ROTOM_FLEX_MANUAL = {
  "id": "charizard-lucario-rotom-flex-manual",
  "title": "Charizard / Lucario Dual-Mega Tempo — Rotom-W Core",
  "lede": "A 6-to-3 Singles team built around two distinct Mega branches: Charizard Y for immediate special pressure and Lucario Z for Veil-enabled setup. Rotom-W is the default sixth because it adds the team's missing conventional pivot, Water/Electric pressure, Ground immunity, and a safe bridge between offensive pieces. Skeledirge, Ceruledge, and non-Mega Metagross are flex swaps that replace Rotom-W and deliberately change the team's package architecture rather than merely patching one matchup.",
  "format": "singles",
  "philosophy": "Do not treat the six as one fixed team. Treat it as a menu of 3-Pokémon packages. At preview, first identify which opponent Pokémon must be controlled, then choose the package that makes that control easiest. Preserve the Mega option until the opponent's structure tells you whether Charizard Y or Lucario Z is the better win condition.",
  "archetype": "balance",
  "family": "kite",
  "meta": "Regulation M-C Singles, Season 6 (M6). Snapshot asOf 2026-09-20 from Champions Ranked Battle Data — usage ranks, not win rate. See evidence. Kit natures/items marked TODO wait on the pilot set; do not copy modal mega stones onto Garchomp or Metagross.",
  "box": [
    "charizard",
    "garchomp",
    "ninetales-alola",
    "lucario",
    "meowscarada",
    "rotom-wash"
  ],
  "core": [
    "charizard",
    "garchomp",
    "lucario"
  ],
  "roster": [
    {
      "slug": "charizard",
      "title": "Charizard Y",
      "job": "mega",
      "literacy": "wallbreaker",
      "role": "Primary immediate special breaker and Sun setter. Charizard turns one correct forced switch into enormous damage and gives the team a second way to attack from the special side.",
      "primaryJob": "Create immediate offensive pressure, punish Steel/Grass/Bug targets, and exploit Sun with Fire STAB and Solar Beam.",
      "item": "Charizardite Y",
      "ability": "Drought",
      "nature": "TODO: preserve the established competitive build used by the pilot",
      "moves": [
        {
          "name": "Flamethrower",
          "why": "Reliable Fire STAB for applying pressure without gambling the game on a low-accuracy or overly committal attack."
        },
        {
          "name": "Air Slash",
          "why": "Secondary STAB that hits targets which resist Fire and gives Charizard a Flying attack without needing another Pokémon to supply that coverage."
        },
        {
          "name": "Solar Beam",
          "why": "Sun converts Solar Beam into an immediate Grass attack, allowing Charizard to punish Water, Ground, and Rock targets that expect to answer Fire."
        },
        {
          "name": "Roost",
          "why": "Keeps Charizard usable after the initial burst and allows the pilot to preserve it for a later Mega-based endgame."
        }
      ],
      "objective": "Get Charizard onto the field against something it naturally pressures, force progress, and keep it alive if the opponent still has a Fire-weak or Solar Beam-vulnerable target.",
      "howToPlay": "Do not expose Charizard merely because it can Mega. Use Garchomp, Rotom-W, or Meowscarada to create the entry. Once Charizard enters safely, ask whether immediate damage or preserving HP creates more value. Charizard is usually the Mega when the opponent's structure is vulnerable to repeated Fire/Solar Beam pressure and does not require Lucario's Steel/Fighting/NP endgame."
    },
    {
      "slug": "garchomp",
      "title": "Life Orb Garchomp",
      "job": "breaker",
      "literacy": "wallbreaker",
      "role": "Physical pressure engine, Electric immunity, hazard option, and glue between the Charizard and Lucario branches.",
      "primaryJob": "Punish Electric types, pressure Steel/Rock/Fire targets, force physical respect, and create turns for the team's special attackers.",
      "item": "Life Orb",
      "ability": "Rough Skin",
      "nature": "Jolly",
      "moves": [
        {
          "name": "Earthquake",
          "why": "Primary Ground STAB and the team's strongest general physical punishment button."
        },
        {
          "name": "Dragon Claw",
          "why": "Reliable Dragon STAB that prevents the team from relying only on Ground damage."
        },
        {
          "name": "Fire Fang",
          "why": "Punishes Steel and Grass targets that attempt to switch into Earthquake or exploit Garchomp's Dragon typing."
        },
        {
          "name": "Stealth Rock",
          "why": "Creates persistent chip that turns Charizard, Meowscarada, and Lucario damage ranges into easier endgames. Use only when the immediate damage or tempo loss is acceptable."
        }
      ],
      "objective": "Be the physical glue. Garchomp should either take an Electric-targeted move, punish a grounded target, establish Rocks when the board permits it, or force enough respect that Charizard/Lucario receives the next advantageous turn.",
      "howToPlay": "Do not automatically click Stealth Rock because you have it. In 3v3, a dead or badly damaged Garchomp can be more costly than missing Rocks. Use its offensive threat to create progress first; set Rocks when the opponent has been forced into a predictable or passive position."
    },
    {
      "slug": "ninetales-alola",
      "title": "Light Clay Alolan Ninetales",
      "job": "weather",
      "literacy": "setter",
      "role": "Aurora Veil enabler, anti-setup tempo tool, Dragon/Water pressure through Freeze-Dry, and the gateway to the Lucario setup branch.",
      "primaryJob": "Create a low-risk setup window and force the opponent to respond to Veil rather than freely execute their own plan.",
      "item": "Light Clay",
      "ability": "Snow Warning",
      "nature": "Timid",
      "moves": [
        {
          "name": "Aurora Veil",
          "why": "The central support move. It makes Lucario and other offensive teammates substantially harder to stop while giving the team room to absorb an otherwise fatal hit."
        },
        {
          "name": "Freeze-Dry",
          "why": "Prevents Water Pokémon from freely exploiting Ninetales and gives the setter real offensive relevance."
        },
        {
          "name": "Encore",
          "why": "Punishes Protect, setup, recovery, hazards, and other predictable defensive actions by forcing the opponent to repeat them."
        },
        {
          "name": "Blizzard",
          "why": "High-power Ice STAB under Snow that turns Ninetales from passive screen setter into an actual threat when the opponent gives it room."
        }
      ],
      "objective": "Get Veil established without allowing the opponent to gain a larger tempo advantage than the Veil is worth. Once Veil is active, use Encore or a switch to manufacture the setup turn for Lucario or another attacker.",
      "howToPlay": "Ninetales is not automatically the lead. Bring it when Veil changes the matchup. If the opponent has a Fake Out/anti-lead sequence, ask whether leading Ninetales still gives enough value. If not, lead a pressure piece and preserve Ninetales for the turn when its presence forces the opponent to respect Veil."
    },
    {
      "slug": "lucario",
      "title": "Mega Lucario Z",
      "job": "mega",
      "literacy": "sweeper",
      "role": "Veil-enabled special setup sweeper and alternate Mega branch.",
      "primaryJob": "Exploit protected setup turns and finish games after Garchomp/Meowscarada/Charizard have removed its checks.",
      "item": "Lucarionite Z",
      "ability": "Inner Focus",
      "nature": "Timid",
      "moves": [
        {
          "name": "Nasty Plot",
          "why": "Turns an Aurora Veil or forced-switch turn into immediate special sweeping pressure."
        },
        {
          "name": "Aura Sphere",
          "why": "Reliable Fighting STAB that pressures Dark, Steel, and other targets that resist Lucario's other attacks."
        },
        {
          "name": "Flash Cannon",
          "why": "Steel STAB for Fairy and Ice targets and the primary reason Lucario can punish certain Dragon/Fairy structures."
        },
        {
          "name": "Dark Pulse",
          "why": "Covers Ghost and Psychic targets that would otherwise interfere with the Fighting/Steel core."
        }
      ],
      "objective": "Do not use Lucario merely as a normal attacker. Its greatest value is the threat of Nasty Plot under Veil or after an Encore/forced switch.",
      "howToPlay": "Lucario is the Mega when the opponent's checks can be softened or forced out by Ninetales/Garchomp/Meowscarada. The preferred sequence is Veil or forced switch -> Lucario enters -> Nasty Plot if the board allows -> attack. If setup is unnecessary, attack immediately; never give the opponent a free turn simply because the set contains Nasty Plot."
    },
    {
      "slug": "meowscarada",
      "title": "Meowscarada",
      "job": "speed",
      "literacy": "pivot",
      "role": "Fast physical utility, Water/Ghost pressure, item disruption, revenge pressure, and momentum generator.",
      "primaryJob": "Keep the opponent from playing comfortably. Force switches, remove items, punish Water/Ground/Psychic targets, and create safe entries for the slower power pieces.",
      "item": "TODO: preserve the established Meowscarada item; Choice Scarf is a common current option but should not be assumed as the pilot's exact build",
      "ability": "Protean",
      "nature": "TODO: preserve established build",
      "moves": [
        {
          "name": "Flower Trick",
          "why": "Reliable Grass STAB that threatens Water and Ground targets and naturally creates pressure against defensive teams."
        },
        {
          "name": "Triple Axel",
          "why": "Provides strong Ice coverage for Dragons, Flying types, and Grass targets that try to exploit Flower Trick."
        },
        {
          "name": "Knock Off",
          "why": "Removes important held items and can permanently weaken a defensive answer before the real win condition enters."
        },
        {
          "name": "U-turn",
          "why": "Preserves momentum and lets Meowscarada turn a favorable matchup into a safe Charizard, Garchomp, Lucario, or Rotom-W entry."
        }
      ],
      "objective": "Be the team's speed-and-information engine. Use Meowscarada to discover the opponent's item/response pattern and then pivot to the Pokémon that exploits it.",
      "howToPlay": "Do not U-turn automatically. If Flower Trick or Triple Axel wins the immediate exchange, take the damage. U-turn is strongest when the opponent is clearly switching or when Meowscarada cannot safely win the current interaction but another teammate can exploit the expected switch."
    },
    {
      "slug": "rotom-wash",
      "title": "Rotom-Wash",
      "job": "support",
      "literacy": "pivot",
      "role": "Primary conventional pivot, Water/Electric coverage, Ground immunity, and physical disruption through Will-O-Wisp.",
      "primaryJob": "Give the team a safe bridge between offensive pieces while covering Fire/Water interactions and forcing the opponent to respect Volt Switch.",
      "item": "Leftovers",
      "ability": "Levitate",
      "nature": "Bold",
      "moves": [
        {
          "name": "Hydro Pump",
          "why": "Main Water STAB. It stops Rotom from becoming a passive pivot and punishes Fire, Ground, and Rock targets."
        },
        {
          "name": "Volt Switch",
          "why": "The core reason Rotom occupies the sixth slot. It converts favorable defensive matchups into safe offensive entries."
        },
        {
          "name": "Will-O-Wisp",
          "why": "Cuts the physical damage of dangerous attackers and makes future Charizard/Lucario/Garchomp entries safer."
        },
        {
          "name": "Pain Split",
          "why": "Provides practical sustain and lets Rotom remain useful after repeatedly pivoting instead of being a disposable one-time switch-in."
        }
      ],
      "objective": "Create a controlled loop: absorb or threaten -> force a response -> Volt Switch -> bring in the correct breaker -> repeat until the opponent's answers are sufficiently weakened.",
      "howToPlay": "Rotom is not the team's wall. Its value is that it makes the other five easier to deploy. Preserve it against teams where Water/Ground immunity and Fire/Water resistance matter. Do not throw it away simply to gain one Volt Switch unless that sequence wins the game state."
    }
  ],
  "construction": {
    "thesis": "The team uses Charizard Y and Lucario Z as separate Mega branches while Garchomp and Meowscarada provide physical tempo. Rotom-W completes the structure by adding a genuine pivot and Water/Electric axis. Flex swaps replace Rotom-W when the matchup calls for anti-setup durability, Ghost/Fighting immunity plus physical setup, or Steel-based preview ambiguity.",
    "method": "At preview, name the M6 three: Salamence, Garchomp, Primarina, Hippowdon, Golisopod, Baxcalibur, Lucario, Archaludon, Gholdengo, Rillaboom. Identify fastest threat, physical/special breaker, setup route, and the sit they brought for Charizard or Lucario. Pick the package whose switches still work after their best first turn — Rotom vs Hippowdon/Fire, Meowscarada vs Primarina, Skeledirge vs DD Salamence, Metagross vs Fairy, keep Rotom if Water-Ground is the board.",
    "winCondition": "Generate one or two favorable exchanges with Meowscarada/Rotom/Garchomp, then finish with either Charizard Y, Mega Lucario Z, or a surviving offensive package. Under Veil, Lucario is the primary setup endgame; under pivot pressure, Charizard is the primary breaker; in no-Mega games, preserve speed and matchup control until the opponent is forced into a losing final exchange.",
    "endgames": [
      {
        "id": "zard-cleanup",
        "label": "Charizard Y Cleanup",
        "path": "meowscarada / rotom-wash / garchomp → charizard",
        "how": "Use Meowscarada, Garchomp, or Rotom-W to remove or weaken Charizard's Fire/Grass/Water answers, then Mega Evolve Charizard and finish with Fire STAB, Air Slash, or Sun-boosted Solar Beam. Preserve Charizard's HP when the opponent still has a priority or revenge option. Once the relevant answer is gone, stop pivoting and take the damage."
      },
      {
        "id": "lucario-setup",
        "label": "Mega Lucario Nasty Plot",
        "path": "ninetales-alola → lucario",
        "how": "Establish Aurora Veil or force a switch with Ninetales, then bring Lucario in against something that cannot immediately threaten it. Nasty Plot when the opponent cannot punish the setup; otherwise attack immediately. After one boost, select the STAB that removes the opponent's remaining defensive route."
      },
      {
        "id": "tempo-lock",
        "label": "Tempo Lock",
        "path": "meowscarada → rotom-wash → breaker",
        "how": "Use Meowscarada U-turn and Rotom Volt Switch to force the opponent into repeated defensive decisions until a breaker receives a clean entry. The goal is not infinite switching. Stop the loop as soon as one member can take a decisive KO or force the final defensive response."
      },
      {
        "id": "veil-attrition",
        "label": "Veil Attrition",
        "path": "ninetales-alola → lucario / garchomp / meowscarada",
        "how": "Use Ninetales to create Veil, then repeatedly trade favorable damage while preserving enough of Lucario/Garchomp/Meowscarada to reach the endgame. Do not waste Veil turns switching without purpose. Each Veil turn should either damage the opponent, establish setup, remove an item, or reposition toward the final three."
      },
      {
        "id": "no-mega-tempo",
        "label": "No-Mega Tempo Finish",
        "path": "meowscarada → garchomp → rotom-wash",
        "how": "Keep both Mega Pokémon untransformed or use neither as the primary win condition, instead winning through Garchomp/Meowscarada/Rotom positioning and raw matchup pressure. Use this when the opponent's anti-Mega tools make both Mega branches awkward or when the three non-Mega members already have favorable type and speed relationships."
      }
    ],
    "altSlots": [
      {
        "slug": "skeledirge",
        "insteadOf": "rotom-wash",
        "why": "Changes the sixth slot from a pivot into a durable Fire/Ghost anti-setup piece. It does not merely duplicate Charizard: Charizard is an immediate offensive Mega while Skeledirge is a recovery-based Unaware stabilizer.",
        "answers": "Gives Fighting and Normal immunities, Unaware against opposing setup, Slack Off recovery, Will-O-Wisp, and a second Fire/Ghost offensive axis.",
        "costs": "Loses Volt Switch, Water STAB, Electric STAB, Ground immunity, and Rotom's ability to bridge Charizard into favorable offensive entries.",
        "unlocks": [
          "skeledirge-veil-control",
          "skeledirge-charizard-double-fire"
        ],
        "slot": {
          "title": "Skeledirge",
          "job": "support",
          "literacy": "wall",
          "role": "Unaware defensive anchor, anti-setup check, physical burn source, and secondary Ghost attacker.",
          "item": "TODO: preserve established Skeledirge item",
          "ability": "Unaware",
          "moves": [
            {
              "name": "Torch Song",
              "why": "Reliable Fire damage that simultaneously increases Skeledirge's Special Attack, allowing a defensive start to become an offensive endgame."
            },
            {
              "name": "Slack Off",
              "why": "Provides the recovery that distinguishes Skeledirge from Charizard and allows it to repeatedly absorb pressure."
            },
            {
              "name": "Will-O-Wisp",
              "why": "Punishes physical attackers and reduces the opponent's ability to break through the rest of the package."
            },
            {
              "name": "Shadow Ball",
              "why": "Ghost STAB prevents Skeledirge from being passive against targets that resist Fire and gives the team another way to pressure Ghost/Psychic structures."
            }
          ],
          "objective": "Enter against physical or setup-oriented threats, deny their stat boosts through Unaware, burn physical attackers, recover, and eventually turn Torch Song boosts into offensive pressure.",
          "howToPlay": "Skeledirge should be treated as the package's stabilizer. If the opponent is trying to snowball with boosts, prioritize preserving Skeledirge over taking unnecessary chip. Once the dangerous setup Pokémon is controlled, Skeledirge can become the win condition itself."
        }
      },
      {
        "slug": "ceruledge",
        "insteadOf": "rotom-wash",
        "why": "Turns the sixth slot into an aggressive Fire/Ghost setup threat with recovery, priority, and a second Fighting immunity. It creates a much more aggressive Lucario-adjacent setup package.",
        "answers": "Gives Fighting and Normal immunities, Shadow Sneak priority, Bitter Blade recovery, Swords Dance, and strong Ghost/Fire pressure.",
        "costs": "Loses Rotom's Water typing, Volt Switch, Ground immunity, reliable Fire/Water pivoting, and conventional defensive stability.",
        "unlocks": [
          "ceruledge-veil-dual-setup",
          "ceruledge-charizard-pressure"
        ],
        "slot": {
          "title": "Ceruledge",
          "job": "breaker",
          "literacy": "sweeper",
          "role": "Physical setup attacker with recovery, priority, Ghost typing, and Fighting immunity.",
          "item": "TODO: preserve established Ceruledge item",
          "ability": "Weak Armor",
          "moves": [
            {
              "name": "Bitter Blade",
              "why": "Primary Fire STAB and recovery tool; every successful hit can restore Ceruledge while applying offensive pressure."
            },
            {
              "name": "Shadow Sneak",
              "why": "Priority gives the team a way to finish weakened faster targets and reduces reliance on Meowscarada for every revenge situation."
            },
            {
              "name": "Poltergeist",
              "why": "High-impact Ghost STAB that punishes item-dependent targets and gives Ceruledge a threatening neutral attack."
            },
            {
              "name": "Swords Dance",
              "why": "Creates the physical counterpart to Lucario's Nasty Plot and makes the Veil package capable of threatening from both offensive axes."
            }
          ],
          "objective": "Use Swords Dance when the opponent cannot immediately punish it, then use Bitter Blade for sustain and Shadow Sneak to prevent the opponent from simply outrunning the boosted threat.",
          "howToPlay": "Ceruledge is strongest when the opponent has been forced to reveal its Fire/Ghost checks. Do not Swords Dance automatically. First establish that the resulting boosted attack sequence actually beats the opponent's remaining three."
        }
      },
      {
        "slug": "metagross",
        "insteadOf": "rotom-wash",
        "why": "Adds a Steel/Psychic physical tank and offensive threat without consuming the team's Mega slot. Its presence creates preview ambiguity because the opponent must respect Metagross as a normal Steel/Psychic attacker while Charizard and Lucario remain the actual Mega candidates.",
        "answers": "Adds physical bulk, Steel resistances, Psychic pressure, Fairy/Poison answers, and another strong physical attacker.",
        "costs": "Loses Rotom's Water typing, Electric STAB, Volt Switch, Ground immunity, and the team's cleanest conventional pivot.",
        "unlocks": [
          "metagross-preview-ambiguity",
          "metagross-veil-bulwark"
        ],
        "slot": {
          "title": "Non-Mega Metagross",
          "job": "breaker",
          "literacy": "wallbreaker",
          "role": "Physical Steel/Psychic tank, Fairy/Poison answer, and preview ambiguity piece.",
          "item": "TODO: preserve established non-Mega Metagross item",
          "ability": "Clear Body",
          "moves": [
            {
              "name": "TODO: established Metagross Steel STAB",
              "why": "Provides the main Steel damage and lets Metagross punish Fairy/Ice targets."
            },
            {
              "name": "TODO: established Metagross Psychic STAB",
              "why": "Provides Psychic pressure and prevents Metagross from being reduced to a Steel-only attacker."
            },
            {
              "name": "TODO: established coverage move",
              "why": "Choose the coverage that best complements the specific Season 6 build being used."
            },
            {
              "name": "TODO: established utility or coverage move",
              "why": "Use the fourth slot to support the intended package rather than copying a generic set."
            }
          ],
          "objective": "Use Metagross to absorb or threaten physical attacks, punish Fairy/Poison targets, and make the opponent spend preview attention on a non-Mega threat while preserving Charizard/Lucario Mega ambiguity.",
          "howToPlay": "Metagross should not be treated as a replacement for Rotom's pivoting. It is the package's physical anchor. Bring it when its Steel/Psychic resistances and physical presence matter more than Water/Electric pivoting."
        }
      }
    ]
  },
  "evidence": {
    "season": "Season 6 M-C Singles (M6)",
    "asOf": "2026-09-20",
    "source": "Champions Battle Data ranked singles (championsbattledata.com)",
    "caveat": "Usage order and item shares — not a claim of proven best WR. This six keeps Life Orb Garchomp and non-Mega Metagross even though the dump's modal items are Mega stones.",
    "ladderTop": [
      "Salamence #1",
      "Garchomp #2",
      "Primarina #3",
      "Hippowdon #4",
      "Golisopod #5",
      "Baxcalibur #6",
      "Lucario #7",
      "Archaludon #8",
      "Gholdengo #9",
      "Rillaboom #10"
    ],
    "stats": [
      { "label": "Salamencite", "value": "97.7%", "note": "Near-universal Mega on #1" },
      { "label": "Garchompite Z", "value": "36.2%", "note": "Modal Garchomp item — this six uses Life Orb instead" },
      { "label": "Golisopite", "value": "98.3%", "note": "#5 Mega; First Impression / Iron Head / Sucker" },
      { "label": "Lucarionite Z", "value": "90.3%", "note": "#7; Nasty Plot 78.7%" },
      { "label": "Gholdengo Balloon", "value": "69.7%", "note": "#9 Ground sit" },
      { "label": "Meowscarada Scarf", "value": "61.6%", "note": "#12 modal — confirm before locking this six" },
      { "label": "Charizardite Y", "value": "73%", "note": "#15; Solar Beam 71%" },
      { "label": "Ninetales Light Clay", "value": "91%", "note": "#23; Aurora Veil 97.4%" },
      { "label": "Metagrossite", "value": "94.6%", "note": "#24 modal — flex Metagross stays non-Mega" },
      { "label": "Rotom-W Leftovers", "value": "33.7%", "note": "#25; item split with Sitrus / Scarf / Helmet" },
      { "label": "Skeledirge Leftovers", "value": "44.4%", "note": "#30 Unaware; item TODO until confirmed" },
      { "label": "Ceruledge Focus Sash", "value": "75.9%", "note": "#53 modal — item TODO until confirmed" }
    ]
  },
  "packs": [
    {
      "id": "rotom-charizard-pivot",
      "label": "Rotom + Charizard Pivot",
      "when": "Bring vs Hippowdon, Ground cores, and Fire that Rotom can sit — especially if Rillaboom or another Grass answer is on their six for Charizard to eat after a pivot. Do not bring this three into Primarina + Mega Salamence unless Garchomp can actually punish the Intimidate/DD line.",
      "identity": "Volt Switch into Charizard, with Garchomp completing the Fire/Water/Electric/Ground triangle.",
      "slugs": [
        "rotom-wash",
        "charizard",
        "garchomp"
      ],
      "endgameIds": [
        "zard-cleanup",
        "tempo-lock"
      ],
      "strategy": {
        "opponentPattern": "Hippowdon / Ground, Fire, or a Grass answer (Rillaboom) that Charizard can punish once Rotom forces the switch. Weak Primarina presence.",
        "bring": [
          "rotom-wash",
          "charizard",
          "garchomp"
        ],
        "purpose": "Use Rotom as the bridge rather than exposing Charizard early.",
        "targets": [
          "Hippowdon",
          "Rillaboom",
          "physical Golisopod",
          "Ground cores",
          "Fire that Hydro Pump answers"
        ],
        "refuses": [
          "Primarina — Moonblast and Sparkling Aria both punish Charizard; Rotom is not a Primarina win.",
          "Do not lead Charizard into Mega Salamence, Primarina, or Archaludon Thunderbolt.",
          "Do not Volt Switch merely because it is available if Hydro Pump or Will-O-Wisp creates more immediate value.",
          "Do not sacrifice Garchomp for Rocks if they still have an Electric or Intimidate-into-EQ line."
        ],
        "winCondition": "Use Rotom to create one or more safe Charizard entries, remove its best answer, then let Charizard finish.",
        "gamePlan": "Break → Rotom creates favorable switch → Volt Switch into Charizard → force damage → preserve the remaining defensive answer until it can no longer stop Charizard.",
        "mantra": "Rotom opens the door; Charizard walks through it.",
        "contrast": "Compared with the Veil/Lucario package, this package does not need setup. It wins by immediate positioning and repeated offensive entries.",
        "defaultLead": "rotom-wash",
        "defaultLeadWhy": "Sit Hippowdon, Fire, or Golisopod. Volt Switch only after you see the Charizard target.",
        "turnChecklist": [
          "What does Rotom force out — Hippowdon, a Fire, or a Grass?",
          "Is Primarina on their three? If yes, this pack is already wrong.",
          "Can Garchomp absorb the predicted Electric or Intimidate into EQ?",
          "Is Volt Switch actually safer than Hydro Pump / Will-O-Wisp?",
          "If Charizard enters now, which of Salamence / Primarina / Archaludon can still stop it?"
        ]
      },
      "roles": [
        {
          "slug": "rotom-wash",
          "macro": "Pivot",
          "micro": "Absorb Fire/Water pressure, threaten Ground targets, burn physical attackers, and Volt Switch."
        },
        {
          "slug": "charizard",
          "macro": "Breaker",
          "micro": "Exploit the opening Rotom creates and turn Sun into immediate damage."
        },
        {
          "slug": "garchomp",
          "macro": "Glue",
          "micro": "Punish Electric types and physical attackers while threatening Steel/Rock targets."
        }
      ],
      "loops": [
        {
          "title": "Volt Switch → Charizard",
          "body": "If Rotom is facing something it naturally threatens, ask what the opponent uses to avoid Hydro Pump. If they switch into a Charizard target, click Volt Switch and bring Charizard into the favorable matchup. If they stay, attack or burn instead of blindly pivoting. The loop ends once Charizard has the correct matchup; do not pivot forever."
        },
        {
          "title": "Electric → Garchomp → Pressure",
          "body": "If the opponent threatens Rotom with Electric coverage, Garchomp exploits Ground immunity. Bring Garchomp when the prediction is supported, then use Earthquake/Dragon Claw/Fire Fang to turn the forced positioning into damage."
        },
        {
          "title": "Burn → Charizard",
          "body": "Against a physical attacker that Rotom can safely burn, Will-O-Wisp reduces the threat. Once that attacker is weakened or forced out, bring Charizard in without spending HP unnecessarily."
        }
      ],
      "flows": [
        {
          "id": "lead",
          "title": "Lead",
          "forks": [
            {
              "id": "lead-0",
              "when": "They lead Hippowdon, a Fire, or Golisopod that Rotom can burn or Hydro.",
              "then": "Lead Rotom. Threaten Hydro Pump or Will-O-Wisp. Volt Switch to Charizard only if they switch into Rillaboom, Grass, or a Fire-weak sit."
            },
            {
              "id": "lead-1",
              "when": "They lead Mega Salamence or an Electric that wants Rotom.",
              "then": "Lead Garchomp. Intimidate/EQ lines and Electric both belong on Garchomp, not Rotom."
            }
          ]
        },
        {
          "id": "mid",
          "title": "Midgame",
          "forks": [
            {
              "id": "mid-0",
              "when": "The opponent's Charizard answer is revealed and can be pressured by Garchomp.",
              "then": "Do not immediately Mega Charizard. First weaken the answer, then create the safe Charizard entry."
            },
            {
              "id": "mid-1",
              "when": "Rotom is below the HP needed to perform another important pivot.",
              "then": "Stop spending Rotom as disposable momentum. Attack, Pain Split, or preserve it for its defensive role."
            }
          ]
        },
        {
          "id": "late",
          "title": "Finish",
          "forks": [
            {
              "id": "late-0",
              "when": "Charizard's remaining answer is in KO range.",
              "then": "Mega Evolve and stop over-pivoting. Take the decisive damage."
            },
            {
              "id": "late-1",
              "when": "Charizard cannot clean but Garchomp has the better remaining matchup.",
              "then": "Use Charizard as the damage dealer that enables Garchomp rather than forcing the wrong endgame."
            }
          ]
        }
      ],
      "victims": [
        {
          "name": "Hippowdon",
          "slug": "hippowdon",
          "why": "Rotom Hydro Pump plus Garchomp Earthquake both contest Sand. Charizard eats the Grass they bring to answer Ground.",
          "play": "Lead Rotom. If they Yawn or Rocks, Volt Switch or stay and Hydro. Do not send Charizard into Earthquake.",
          "trap": "Whirlwind and Stealth Rock both exist on the modal set — do not give free chip just to cycle."
        },
        {
          "name": "Rillaboom",
          "slug": "rillaboom",
          "why": "Charizard wants the Grass; Rotom does not. Pivot into Charizard once Glide is committed or they switch.",
          "play": "If Rotom is in, Volt Switch on the predicted Glide stay only if Charizard lives it. Otherwise Garchomp Fire Fang.",
          "trap": "Grassy Glide after U-turn is the tempo steal — do not let Rotom eat the second Glide."
        },
        {
          "name": "Golisopod",
          "slug": "golisopod",
          "why": "Will-O-Wisp wrecks the physical Mega; Hydro Pump still hurts if they stay.",
          "play": "Burn first if you live First Impression. Then Charizard or Garchomp, not another Rotom cycle.",
          "trap": "Emergency Exit plus U-turn can strand you in front of Primarina — stop pivoting if Fairy is next."
        }
      ],
      "counters": [
        {
          "name": "Primarina",
          "slug": "primarina",
          "why": "Moonblast and Sparkling Aria both punish Charizard. Rotom is not a Primarina win.",
          "play": "This is a different package — Meowscarada Flower Trick or Veil Lucario. Do not force this three.",
          "trap": "Aqua Jet cleans a burned or chipped Charizard. Do not Mega hoping Sun solves Fairy."
        },
        {
          "name": "Mega Salamence",
          "slug": "salamence",
          "why": "Intimidate plus Dragon Dance plus Double-Edge outruns the pivot loop if Garchomp is already damaged.",
          "play": "Lead Garchomp into Intimidate if you must; Fire Fang / EQ. Do not Volt Switch Charizard into Mence.",
          "trap": "Roost plus DD makes the Volt Switch loop donate turns. Attack or leave."
        },
        {
          "name": "Archaludon",
          "slug": "archaludon",
          "why": "Thunderbolt and Draco Meteor both pressure Rotom and Charizard.",
          "play": "Garchomp is the Electric sit. Charizard only after Archaludon is forced out or chipped.",
          "trap": "Stamina body can eat a weak Hydro and then flash cannon Charizard."
        }
      ],
      "advantages": [
        {
          "title": "Real pivot core",
          "body": "This is the cleanest package for teaching the pilot how to generate safe Charizard entries rather than gambling on direct switches."
        }
      ],
      "hazards": [
        {
          "title": "Pivot addiction",
          "body": "Volt Switch is a means to an end. Once Charizard or Garchomp has the favorable matchup, stop cycling."
        }
      ]
    },
    {
      "id": "veil-lucario",
      "label": "Aurora Veil → Mega Lucario",
      "when": "Bring when they lack Primarina/Gholdengo revenge and Ninetales can Veil without eating First Impression or Intimidate into KO. Best vs slower physical (Hippowdon, Baxcalibur) that Lucario outruns after one NP.",
      "identity": "The team's most direct setup package.",
      "slugs": [
        "ninetales-alola",
        "lucario",
        "garchomp"
      ],
      "endgameIds": [
        "lucario-setup",
        "veil-attrition"
      ],
      "strategy": {
        "opponentPattern": "Physical Hippowdon / Baxcalibur / setup that Veil plus one NP Lucario beats. No healthy Primarina or Balloon Gholdengo as the revenge.",
        "bring": [
          "ninetales-alola",
          "lucario",
          "garchomp"
        ],
        "purpose": "Create one protected setup turn and convert it into a Lucario endgame.",
        "targets": [
          "Hippowdon",
          "Baxcalibur",
          "Dragon-heavy balance",
          "physical setup"
        ],
        "refuses": [
          "Primarina — Moonblast stops Lucario even through Veil.",
          "Gholdengo — Good as Gold ignores Encore/status; Balloon sits Garchomp.",
          "Golisopod lead — First Impression can deny Veil. Lead Garchomp or leave this pack.",
          "Do not Nasty Plot when immediate Aura Sphere is required to prevent a DD/Glide KO."
        ],
        "winCondition": "Veil plus one safe Nasty Plot turns Lucario into the primary finisher.",
        "gamePlan": "Control → Veil → Setup → Finish.",
        "mantra": "One safe setup turn is worth more than three random screens turns.",
        "contrast": "Unlike the Rotom package, this bring accepts less natural pivoting in exchange for a much more explosive win condition.",
        "defaultLead": "ninetales-alola",
        "defaultLeadWhy": "Veil first unless they lead Golisopod or Mega Salamence — then Garchomp.",
        "turnChecklist": [
          "Can Ninetales actually get Veil, or is First Impression / Intimidate the lead?",
          "Is Primarina or Gholdengo on their three?",
          "Which Lucario move wins vs the likely switch — Aura Sphere, Flash Cannon, Dark Pulse?",
          "Is Garchomp needed alive for Electric / Fire / Hippo?",
          "Is Nasty Plot necessary or is attacking now safer?"
        ]
      },
      "roles": [
        {
          "slug": "ninetales-alola",
          "macro": "Setter",
          "micro": "Create Veil and use Encore/Freeze-Dry to prevent the opponent from exploiting the setup turn."
        },
        {
          "slug": "lucario",
          "macro": "Sweeper",
          "micro": "Set Nasty Plot under protection and convert the opening into KOs."
        },
        {
          "slug": "garchomp",
          "macro": "Breaker",
          "micro": "Remove Fire/Steel/Electric obstacles and give the package a strong physical route."
        }
      ],
      "loops": [
        {
          "title": "Veil → Lucario → Pressure",
          "body": "Establish Veil, then switch Lucario into the safest available turn. If the opponent cannot immediately punish Nasty Plot, boost. If they can, attack immediately."
        },
        {
          "title": "Encore → Setup",
          "body": "If Ninetales catches Protect, setup, recovery, or another predictable non-damaging move with Encore, use the forced repetition as the setup window."
        }
      ],
      "flows": [
        {
          "id": "lead",
          "title": "Lead",
          "forks": [
            {
              "id": "lead-0",
              "when": "They lead Hippowdon, a slow wall, or anything that does not First Impression Ninetales.",
              "then": "Lead Ninetales and click Veil unless Freeze-Dry or Encore is clearly the better first click."
            },
            {
              "id": "lead-1",
              "when": "They lead Golisopod, Mega Salamence, or another anti-lead.",
              "then": "Lead Garchomp. Preserve Ninetales for a later Veil after Emergency Exit or Intimidate is spent."
            }
          ]
        },
        {
          "id": "mid",
          "title": "Setup",
          "forks": [
            {
              "id": "mid-0",
              "when": "Veil is active and Lucario faces a target that cannot immediately threaten it.",
              "then": "Nasty Plot."
            },
            {
              "id": "mid-1",
              "when": "Veil is active but the opponent has an immediate Lucario check entering.",
              "then": "Attack the incoming target or use Garchomp to remove it rather than sacrificing Lucario for a greedy boost."
            }
          ]
        },
        {
          "id": "late",
          "title": "Finish",
          "forks": [
            {
              "id": "late-0",
              "when": "Lucario has a clean two- or three-target attack sequence.",
              "then": "Mega Evolve and attack until the game ends."
            },
            {
              "id": "late-1",
              "when": "Lucario's checks remain but Garchomp can remove them.",
              "then": "Use Garchomp first; Lucario does not need to be the first attacker."
            }
          ]
        }
      ],
      "victims": [
        {
          "name": "Hippowdon",
          "slug": "hippowdon",
          "why": "Veil turns Sand chip into a Lucario setup window; Freeze-Dry still hits Water they may pivot to.",
          "play": "Veil, then Lucario. Aura Sphere vs Dark, Flash Cannon if they try Fairy.",
          "trap": "Yawn plus Whirlwind can waste the Veil turn — Encore the Yawn or leave."
        },
        {
          "name": "Baxcalibur",
          "slug": "baxcalibur",
          "why": "Physical Glaive/EQ lines lose to Veil plus Lucario special. Garchomp contests Dragon.",
          "play": "Do not let Ice Shard chip Lucario before NP. Garchomp or Veil first.",
          "trap": "Mega Bax + Ice Shard still revenge a weakened Lucario through Veil."
        }
      ],
      "counters": [
        {
          "name": "Primarina",
          "slug": "primarina",
          "why": "Moonblast is the Lucario stop even under Veil.",
          "play": "Pick Meowscarada Flower Trick or a Charizard pack instead. Do not NP into Primarina.",
          "trap": "Encore from Primarina locks Ninetales into Veil and donates the game."
        },
        {
          "name": "Gholdengo",
          "slug": "gholdengo",
          "why": "Good as Gold shrugs Encore and status; Balloon sits Garchomp EQ.",
          "play": "Lucario Dark Pulse is the Ghost answer — only after Veil, not as a lead.",
          "trap": "Nasty Plot Gholdengo races Lucario. Do not donate the first boost."
        },
        {
          "name": "Golisopod",
          "slug": "golisopod",
          "why": "First Impression denies Veil on the lead.",
          "play": "Lead Garchomp, not Ninetales. Veil later if they Exit.",
          "trap": "Sucker Punch still tags Lucario if you NP on a predicted switch that stays."
        }
      ],
      "advantages": [
        {
          "title": "Clear endgame",
          "body": "This is the easiest package for a new pilot to understand: establish Veil, create one setup turn, then attack."
        }
      ],
      "hazards": [
        {
          "title": "Veil tunnel vision",
          "body": "A screen is valuable only if it changes the following turns. Never sacrifice two Pokémon merely to make Aurora Veil appear."
        }
      ]
    },
    {
      "id": "meow-garchomp-tempo",
      "label": "No-Mega Fast Tempo",
      "when": "Bring when they are slow or item-dependent (Hippowdon, Primarina walls, Leftovers cores) and you do not need a Mega. Meowscarada must keep speed — if they have Mega Salamence DD plus priority, this three is too thin.",
      "identity": "Fast, flexible, no-Mega pressure.",
      "slugs": [
        "meowscarada",
        "garchomp",
        "rotom-wash"
      ],
      "endgameIds": [
        "no-mega-tempo",
        "tempo-lock"
      ],
      "strategy": {
        "opponentPattern": "Slow Hippowdon / Primarina balance that Flower Trick and Knock Off can farm. No Mega they need Charizard or Lucario to race.",
        "bring": [
          "meowscarada",
          "garchomp",
          "rotom-wash"
        ],
        "purpose": "Win through repeated favorable positioning rather than revealing either Mega.",
        "targets": [
          "Primarina",
          "Hippowdon",
          "item walls",
          "Electric sits for Garchomp"
        ],
        "refuses": [
          "Mega Salamence that DDs past Meowscarada if you are not Scarf-locked into the right move.",
          "Gholdengo — Knock Off does nothing to Good as Gold; Balloon sits Garchomp.",
          "Do not trade Meowscarada early if it is your only speed control.",
          "Do not burn Rotom merely to generate one pivot."
        ],
        "winCondition": "Use Flower Trick/Knock Off/U-turn, Garchomp damage, and Rotom Volt Switch to create a final state where one member can attack freely.",
        "gamePlan": "Scout → Pivot → Chip → Finish.",
        "mantra": "Do not reveal the Mega if the three Pokémon already win the board.",
        "contrast": "This package deliberately keeps Charizard and Lucario out, preserving Mega ambiguity for future games and reducing dependence on a single win condition.",
        "defaultLead": "meowscarada",
        "defaultLeadWhy": "Flower Trick Primarina / Hippowdon or U-turn if they lead Mega Salamence into Rotom."
      },
      "roles": [
        {
          "slug": "meowscarada",
          "macro": "Speed",
          "micro": "Scout, remove items, pressure Water/Ground targets, and pivot."
        },
        {
          "slug": "garchomp",
          "macro": "Breaker",
          "micro": "Punish Electric and Steel targets and provide physical damage."
        },
        {
          "slug": "rotom-wash",
          "macro": "Pivot",
          "micro": "Bridge Meowscarada and Garchomp through Volt Switch and defensive resistances."
        }
      ],
      "loops": [
        {
          "title": "U-turn ↔ Volt Switch",
          "body": "Meowscarada attacks or U-turns when it expects a switch. Rotom enters against the resulting target and threatens Volt Switch. End the loop when Garchomp or Meowscarada gets a decisive attack."
        },
        {
          "title": "Knock Off → Pressure",
          "body": "Use Meowscarada to remove the opponent's key item, then pivot rather than trying to finish the target immediately."
        }
      ],
      "flows": [
        {
          "id": "lead",
          "title": "Lead",
          "forks": [
            {
              "id": "lead-0",
              "when": "Meowscarada has a favorable immediate matchup or threatens a predictable switch.",
              "then": "Lead Meowscarada and use the appropriate attack or U-turn."
            },
            {
              "id": "lead-1",
              "when": "Opponent has a strong physical lead that Rotom can burn.",
              "then": "Lead Rotom and preserve Meowscarada for later speed control."
            }
          ]
        },
        {
          "id": "mid",
          "title": "Midgame",
          "forks": [
            {
              "id": "mid-0",
              "when": "Opponent repeatedly switches to preserve a check.",
              "then": "Use Knock Off or reliable STAB to collect guaranteed progress."
            },
            {
              "id": "mid-1",
              "when": "Opponent has committed a setup sweeper.",
              "then": "Do not continue the pivot loop blindly. Use the member that actually stops the setup route."
            }
          ]
        }
      ],
      "victims": [
        {
          "name": "Primarina",
          "slug": "primarina",
          "why": "Flower Trick is the Grass answer this six actually owns. Rotom is not the Primarina win — Meowscarada is.",
          "play": "Lead Meowscarada. If they Encore, U-turn. Knock Off the Sitrus if you stay.",
          "trap": "Aqua Jet after chip. Do not U-turn into a Gholdengo sit."
        },
        {
          "name": "Hippowdon",
          "slug": "hippowdon",
          "why": "Flower Trick and Rotom Hydro both contest Sand; Knock Off removes Sitrus.",
          "play": "Chip, remove the berry, then Garchomp EQ if they stay grounded.",
          "trap": "Yawn plus Whirlwind resets the loop — take the attack instead of cycling forever."
        }
      ],
      "counters": [
        {
          "name": "Mega Salamence",
          "slug": "salamence",
          "why": "DD plus Double-Edge races a no-Mega three if Meowscarada is already chipped.",
          "play": "If you brought this pack anyway, Rotom burn or Garchomp Fire Fang — do not U-turn into DD.",
          "trap": "Roost plus Intimidate donates the pivot loop. Attack or leave the pack."
        },
        {
          "name": "Gholdengo",
          "slug": "gholdengo",
          "why": "Knock Off fails. Balloon sits Garchomp. No Mega breaker on this three.",
          "play": "Wrong pack. Charizard or Lucario Dark Pulse belongs on another bring.",
          "trap": "Do not keep U-turning hoping the Ghost leaves."
        }
      ],
      "advantages": [
        {
          "title": "Mega ambiguity",
          "body": "The opponent has to respect Charizard and Lucario in preview even when neither appears in the battle."
        }
      ],
      "hazards": [
        {
          "title": "No emergency setup breaker",
          "body": "If the opponent's win condition requires immediate special or Fire pressure, this no-Mega package can be too conservative."
        }
      ]
    },
    {
      "id": "rotom-lucario-veil",
      "label": "Rotom + Veil + Lucario",
      "when": "Hippowdon or Fire that Rotom sits, and they do not have Primarina/Gholdengo to stop Lucario after Veil. Use when Ninetales cannot lead into Golisopod but Rotom can buy the Veil turn.",
      "identity": "A hybrid package: Rotom solves the entry problem while Ninetales/Lucario provide the endgame.",
      "slugs": [
        "rotom-wash",
        "ninetales-alola",
        "lucario"
      ],
      "endgameIds": [
        "lucario-setup",
        "tempo-lock"
      ],
      "strategy": {
        "opponentPattern": "Hippowdon / Fire that Rotom can sit; Lucario still has a setup window after Veil. No Primarina revenge.",
        "bring": [
          "rotom-wash",
          "ninetales-alola",
          "lucario"
        ],
        "purpose": "Use Rotom as the stabilizer that makes the Veil package less dependent on a perfect Ninetales lead.",
        "targets": [
          "Hippowdon",
          "Fire",
          "physical Golisopod"
        ],
        "refuses": [
          "Primarina — still the Lucario stop, and Rotom does not beat it.",
          "Rillaboom — Rotom is Grass-weak; Ninetales is too.",
          "Do not sacrifice Rotom before identifying the Fire/Ground interaction.",
          "Do not Mega Lucario until Primarina / Gholdengo is confirmed absent or removed."
        ],
        "winCondition": "Use Rotom to stabilize the early game, then establish Veil and convert the protected turn into Lucario setup.",
        "gamePlan": "Stabilize → Veil → Setup → Finish.",
        "mantra": "Rotom buys the turn that Ninetales cannot safely create by itself.",
        "contrast": "Compared with Ninetales/Garchomp/Lucario, this package gives up Garchomp's physical pressure for a more reliable pivoting layer.",
        "defaultLead": "rotom-wash",
        "defaultLeadWhy": "Sit Hippowdon or Golisopod, then Ninetales into the hole."
      },
      "roles": [
        {
          "slug": "rotom-wash",
          "macro": "Pivot",
          "micro": "Stabilize unfavorable Fire/Water/Ground interactions and create safe entries."
        },
        {
          "slug": "ninetales-alola",
          "macro": "Setter",
          "micro": "Establish Veil once the opponent has been forced into a manageable position."
        },
        {
          "slug": "lucario",
          "macro": "Sweeper",
          "micro": "Use Veil to set up and finish."
        }
      ],
      "loops": [
        {
          "title": "Rotom → Ninetales",
          "body": "Use Rotom to force the opponent into a switch or passive turn. Bring Ninetales into the resulting low-risk window, establish Veil, then Lucario enters."
        },
        {
          "title": "Veil → Lucario → Rotom",
          "body": "After Lucario takes a KO, do not automatically continue attacking if its HP is becoming critical. Rotom can reclaim tempo later if Lucario's job was only to break one key target."
        }
      ],
      "flows": [
        {
          "id": "lead",
          "title": "Lead",
          "forks": [
            {
              "id": "lead-0",
              "when": "Rotom has the safest opening.",
              "then": "Lead Rotom, establish information, then pivot toward Ninetales."
            },
            {
              "id": "lead-1",
              "when": "Ninetales clearly wins the opening turn.",
              "then": "Lead Ninetales and use Rotom later."
            }
          ]
        }
      ],
      "victims": [
        {
          "name": "Hippowdon",
          "slug": "hippowdon",
          "why": "Rotom sits Sand and Hydro; Ninetales Veils the follow-up; Lucario finishes.",
          "play": "Lead Rotom. After Yawn or a forced switch, Ninetales Veil then Lucario.",
          "trap": "Do not Veil into a predicted Whirlwind unless Encore is ready."
        },
        {
          "name": "Golisopod",
          "slug": "golisopod",
          "why": "Rotom burns the Mega so Ninetales never eats First Impression.",
          "play": "Lead Rotom, burn, then Veil on the Exit.",
          "trap": "U-turn into Primarina after Exit — stop the chain."
        }
      ],
      "counters": [
        {
          "name": "Primarina",
          "slug": "primarina",
          "why": "Rotom does not beat Moonblast; Lucario still dies to it after Veil.",
          "play": "Wrong pack — Meowscarada Flower Trick.",
          "trap": "Sparkling Aria plus Aqua Jet cleans both Rotom and a chipped Lucario."
        },
        {
          "name": "Rillaboom",
          "slug": "rillaboom",
          "why": "Rotom and Ninetales are both Grass-weak. No Garchomp on this three.",
          "play": "Do not bring this pack into Rillaboom. Charizard pivot pack instead.",
          "trap": "Glide after Volt Switch is a KO, not a scout."
        }
      ],
      "advantages": [
        {
          "title": "Two-stage setup",
          "body": "Rotom creates the safe positioning; Ninetales creates the defensive protection; Lucario converts both."
        }
      ],
      "hazards": [
        {
          "title": "Too many setup turns",
          "body": "If Rotom pivoting plus Veil plus Nasty Plot requires more turns than the opponent's offense allows, abandon the full sequence and attack."
        }
      ]
    },
    {
      "id": "rotom-meow-charizard",
      "label": "Double-Pivot Charizard",
      "when": "They are fragile or Grass-weak (Rillaboom) and Primarina is on their six — Meowscarada plus Rotom can force the Charizard entry. Do not bring this without Garchomp into Archaludon/Electric.",
      "identity": "U-turn + Volt Switch creates repeated Charizard entry opportunities.",
      "slugs": [
        "meowscarada",
        "rotom-wash",
        "charizard"
      ],
      "endgameIds": [
        "zard-cleanup",
        "tempo-lock"
      ],
      "strategy": {
        "opponentPattern": "Rillaboom or Primarina that Meowscarada forces, then Rotom Volt Switch into Charizard. Fragile offense, not Archaludon Electric.",
        "bring": [
          "meowscarada",
          "rotom-wash",
          "charizard"
        ],
        "purpose": "Make Charizard's entry so safe that it does not need to absorb a risky direct switch.",
        "targets": [
          "Rillaboom",
          "Primarina",
          "Hippowdon"
        ],
        "refuses": [
          "Archaludon / Electric — no Garchomp on this three.",
          "Mega Salamence DD if both pivots are already chipped.",
          "Do not run both pivot moves automatically.",
          "Do not Mega Charizard if Primarina is still healthy."
        ],
        "winCondition": "Repeated pivoting places Charizard in front of something it can KO; after the first major break, stop cycling and finish.",
        "gamePlan": "Scout → Pivot → Break → Finish.",
        "mantra": "Two pivots are tools, not the win condition.",
        "contrast": "This is more aggressive than the standard Rotom/Charizard/Garchomp package and gives up Garchomp's Electric immunity.",
        "defaultLead": "meowscarada",
        "defaultLeadWhy": "Flower Trick Primarina / Rillaboom; U-turn to Rotom if they lead physical Mega."
      },
      "roles": [
        {
          "slug": "meowscarada",
          "macro": "Fast pivot",
          "micro": "Force information and create U-turn entries."
        },
        {
          "slug": "rotom-wash",
          "macro": "Bulky pivot",
          "micro": "Absorb attacks and create Volt Switch entries."
        },
        {
          "slug": "charizard",
          "macro": "Breaker",
          "micro": "Turn every safe entry into immediate damage."
        }
      ],
      "loops": [
        {
          "title": "Meowscarada U-turn → Rotom",
          "body": "When Meowscarada forces a response that Rotom handles, U-turn into Rotom. Rotom then threatens Hydro Pump/Wisp or Volt Switch until Charizard gets the correct matchup."
        },
        {
          "title": "Rotom Volt Switch → Meowscarada",
          "body": "If the opponent brings a Grass target to absorb Rotom's Water/Electric pressure, Volt Switch into Meowscarada and immediately threaten Flower Trick or Triple Axel."
        }
      ],
      "flows": [
        {
          "id": "lead",
          "title": "Lead",
          "forks": [
            {
              "id": "lead-0",
              "when": "Opponent has a predictable defensive response to Meowscarada.",
              "then": "Lead Meowscarada and take the information with U-turn if necessary."
            },
            {
              "id": "lead-1",
              "when": "Opponent has a strong physical attacker that Rotom handles.",
              "then": "Lead Rotom and use Meowscarada later."
            }
          ]
        }
      ],
      "victims": [
        {
          "name": "Primarina",
          "slug": "primarina",
          "why": "Meowscarada Flower Trick is the actual Primarina answer; Rotom then Volt Switches Charizard into the Grass they send to cover Fairy.",
          "play": "Lead Meowscarada. After the Fairy is chipped or forced, Charizard — not another U-turn.",
          "trap": "Aqua Jet. Stop pivoting if Charizard would enter into Moonblast."
        },
        {
          "name": "Rillaboom",
          "slug": "rillaboom",
          "why": "Charizard wants Grass; Meowscarada can U-turn on Glide if Rotom is not the one eating it.",
          "play": "Do not Volt Switch Rotom into Glide. U-turn from Meowscarada into Charizard.",
          "trap": "High Horsepower still hits Rotom if you guessed wrong."
        }
      ],
      "counters": [
        {
          "name": "Archaludon",
          "slug": "archaludon",
          "why": "No Garchomp. Thunderbolt punishes Rotom and Charizard.",
          "play": "Wrong pack. Bring Garchomp in the Rotom+Charizard three instead.",
          "trap": "Stamina plus Flash Cannon after a weak Hydro."
        },
        {
          "name": "Mega Salamence",
          "slug": "salamence",
          "why": "Two pivots donate DD turns if you never attack.",
          "play": "Flower Trick or burn — then Charizard only if Dragon is gone.",
          "trap": "Intimidate into Double-Edge on a predicted U-turn."
        }
      ],
      "advantages": [
        {
          "title": "Information advantage",
          "body": "The opponent often reveals their preferred Charizard answer before Charizard has even entered."
        }
      ],
      "hazards": [
        {
          "title": "Electric immunity removed",
          "body": "Without Garchomp, the package must be more careful around Electric attacks."
        }
      ]
    },
    {
      "id": "skeledirge-veil-control",
      "label": "Skeledirge + Veil Control",
      "when": "Swap Rotom for Skeledirge when Mega Salamence DD, Baxcalibur, or another physical setup is their win — not when Primarina / Hippowdon Water-Ground is the board. Unaware plus Veil is the point; you lose Volt Switch.",
      "identity": "Aurora Veil plus Unaware creates a two-layer safety net: Lucario attacks through protection while Skeledirge prevents opposing setup from becoming an automatic loss.",
      "slugs": [
        "ninetales-alola",
        "lucario",
        "skeledirge"
      ],
      "requiresSwap": {
        "out": "rotom-wash",
        "in": "skeledirge"
      },
      "endgameIds": [
        "lucario-setup",
        "veil-attrition"
      ],
      "strategy": {
        "opponentPattern": "Mega Salamence DD, Baxcalibur, or physical snowball. Not Primarina / Hippowdon Water-Ground.",
        "bring": [
          "ninetales-alola",
          "lucario",
          "skeledirge"
        ],
        "purpose": "Create the safest possible setup-oriented package without relying on Rotom pivoting.",
        "targets": [
          "Mega Salamence",
          "Baxcalibur",
          "physical setup"
        ],
        "refuses": [
          "Primarina — still the Lucario stop, and Skeledirge is Water-weak.",
          "Hippowdon — Earthquake plus Sand; you dropped Rotom's Hydro sit.",
          "Do not use Skeledirge as a substitute for Rotom's pivoting.",
          "Do not let both Skeledirge and Ninetales become passive at the same time."
        ],
        "winCondition": "Veil enables Lucario while Skeledirge prevents the opponent from winning through setup.",
        "gamePlan": "Stabilize → Veil → Setup → Finish.",
        "mantra": "One attacker wins; Skeledirge prevents the opponent from racing it.",
        "contrast": "Compared with Rotom/Lucario/Veil, this package is slower but much harder for setup-oriented physical teams to snowball through.",
        "defaultLead": "skeledirge",
        "defaultLeadWhy": "Sit DD Salamence / Baxcalibur. Veil if they lead a wall instead."
      },
      "roles": [
        {
          "slug": "skeledirge",
          "macro": "Wall",
          "micro": "Use Unaware, Will-O-Wisp, and Slack Off to stop physical setup from becoming a loss."
        },
        {
          "slug": "ninetales-alola",
          "macro": "Setter",
          "micro": "Create Veil and use Encore to create Lucario's setup turn."
        },
        {
          "slug": "lucario",
          "macro": "Sweeper",
          "micro": "Convert the protected setup window into a special sweep."
        }
      ],
      "loops": [
        {
          "title": "Skeledirge → Burn → Slack Off",
          "body": "Against a physical attacker, burn first when safe. Once the attacker's damage is reduced, use Slack Off to preserve Skeledirge."
        },
        {
          "title": "Veil → Lucario / Skeledirge",
          "body": "Once Veil is active, if they are weak to Lucario, set up. If they attempt their own physical setup, Skeledirge takes the field and denies the boost with Unaware."
        }
      ],
      "flows": [
        {
          "id": "lead",
          "title": "Lead",
          "forks": [
            {
              "id": "lead-0",
              "when": "Opponent is clearly setup-oriented and Skeledirge can absorb the first attack.",
              "then": "Lead Skeledirge, stabilize, and identify whether the opponent's win condition is physical or special."
            },
            {
              "id": "lead-1",
              "when": "Ninetales has a safe Veil route.",
              "then": "Lead Ninetales and preserve Skeledirge as the emergency anti-setup piece."
            }
          ]
        },
        {
          "id": "mid",
          "title": "Midgame",
          "forks": [
            {
              "id": "mid-0",
              "when": "Opponent begins boosting physically.",
              "then": "Do not race. Bring Skeledirge and exploit Unaware."
            },
            {
              "id": "mid-1",
              "when": "Opponent's anti-Skeledirge answer has been weakened.",
              "then": "Allow Skeledirge to become an offensive threat through Torch Song."
            }
          ]
        }
      ],
      "victims": [
        {
          "name": "Mega Salamence",
          "slug": "salamence",
          "why": "Unaware ignores Dragon Dance. Will-O-Wisp plus Slack Off is the DD answer Rotom never was.",
          "play": "Lead Skeledirge. Burn or sit the Double-Edge. Veil Lucario after the boost is wasted.",
          "trap": "Special Mence (rare) and Roost stall — Torch Song if they never attack."
        },
        {
          "name": "Baxcalibur",
          "slug": "baxcalibur",
          "why": "Physical Glaive/EQ into Unaware; Ice Shard still chips Lucario, so Skeledirge should take the first hit.",
          "play": "Skeledirge lead. Do not Veil into Ice Shard on Ninetales.",
          "trap": "If they Mega and you already burned, Lucario can NP — not before."
        }
      ],
      "counters": [
        {
          "name": "Primarina",
          "slug": "primarina",
          "why": "Water/Fairy hits every member. You swapped away Rotom.",
          "play": "Do not take this flex. Keep Rotom-W and Meowscarada.",
          "trap": "Moonblast Lucario through Veil is still a KO range."
        },
        {
          "name": "Hippowdon",
          "slug": "hippowdon",
          "why": "Earthquake plus Sand; Skeledirge is Ground-weak.",
          "play": "Wrong swap. Rotom Hydro pack.",
          "trap": "Stealth Rock plus EQ chip makes Slack Off lose the race."
        }
      ],
      "advantages": [
        {
          "title": "Anti-snowball",
          "body": "This is the flex package specifically for games where the opponent's plan is to accumulate boosts and overwhelm normal offensive answers."
        }
      ],
      "hazards": [
        {
          "title": "Fire overlap is not the problem",
          "body": "Charizard and Skeledirge should rarely be treated as competing Fire attackers. In the swapped six, Charizard is the offensive Mega branch while Skeledirge is the stabilizing Fire/Ghost branch."
        }
      ]
    },
    {
      "id": "skeledirge-charizard-double-fire",
      "label": "Charizard + Skeledirge Double-Fire",
      "when": "Swap Rotom for Skeledirge vs Rillaboom / Grass-Steel that both Fires punish, AND they are physical-setup rather than Primarina/Hippowdon. If Water-Ground is the board, keep Rotom.",
      "identity": "Offensive Fire Mega plus defensive Fire/Ghost anchor.",
      "slugs": [
        "charizard",
        "garchomp",
        "skeledirge"
      ],
      "requiresSwap": {
        "out": "rotom-wash",
        "in": "skeledirge"
      },
      "endgameIds": [
        "zard-cleanup"
      ],
      "strategy": {
        "opponentPattern": "Rillaboom or Grass/Steel plus a physical setup (Salamence/Bax). Not Primarina or Hippowdon.",
        "bring": [
          "charizard",
          "garchomp",
          "skeledirge"
        ],
        "purpose": "Let Skeledirge absorb and disrupt physical threats while Charizard supplies the explosive special damage.",
        "targets": [
          "Rillaboom",
          "Aegislash",
          "Mega Salamence"
        ],
        "refuses": [
          "Primarina — both Fires lose, no Rotom.",
          "Hippowdon — Skeledirge is Ground-weak; Rotom was the sit.",
          "Do not expose both Fire Pokémon before identifying their Water answer.",
          "Do not sacrifice Garchomp early if Archaludon is still on their three."
        ],
        "winCondition": "Skeledirge stabilizes the board until Charizard gets a clean Mega sequence.",
        "gamePlan": "Stabilize → Soften → Mega Break → Finish.",
        "mantra": "One Fire breaks; the other protects the break.",
        "contrast": "Unlike Rotom/Charizard/Garchomp, this package is less pivot-oriented but more resilient to physical setup.",
        "defaultLead": "skeledirge",
        "defaultLeadWhy": "Sit physical Mega. Charizard only after Grass/Steel is in front."
      },
      "roles": [
        {
          "slug": "charizard",
          "macro": "Breaker",
          "micro": "Apply immediate special pressure."
        },
        {
          "slug": "skeledirge",
          "macro": "Wall",
          "micro": "Absorb physical pressure and deny setup."
        },
        {
          "slug": "garchomp",
          "macro": "Glue",
          "micro": "Cover Electric/Fire/Steel interactions and provide physical damage."
        }
      ],
      "loops": [
        {
          "title": "Skeledirge absorbs → Charizard punishes",
          "body": "Use Skeledirge to force the opponent into a low-damage or passive position. When their physical pressure is controlled, bring Charizard in to exploit the opening."
        },
        {
          "title": "Charizard forces Water → Garchomp",
          "body": "If Charizard forces a Water or defensive answer, use the opponent's revealed answer to determine whether Garchomp can punish the next turn."
        }
      ],
      "flows": [
        {
          "id": "lead",
          "title": "Lead",
          "forks": [
            {
              "id": "lead-0",
              "when": "Opponent's lead is physical and Skeledirge handles it.",
              "then": "Lead Skeledirge and stabilize."
            },
            {
              "id": "lead-1",
              "when": "Opponent's lead is immediately vulnerable to Charizard.",
              "then": "Lead Charizard and take the free damage."
            }
          ]
        }
      ],
      "victims": [
        {
          "name": "Rillaboom",
          "slug": "rillaboom",
          "why": "Charizard eats Grass; Skeledirge sits the physical follow-up; Garchomp Fire Fang if they stay.",
          "play": "Do not lead Charizard into Glide. Skeledirge or Garchomp first.",
          "trap": "U-turn into Primarina after Glide."
        },
        {
          "name": "Aegislash",
          "slug": "aegislash-shield",
          "why": "Fire hits Steel/Ghost; King's Shield is worse vs Unaware Skeledirge than vs a pivot.",
          "play": "Skeledirge if they want to stall Shield; Charizard if they stay Blade.",
          "trap": "Shadow Sneak still tags a chipped Charizard."
        }
      ],
      "counters": [
        {
          "name": "Primarina",
          "slug": "primarina",
          "why": "Both Fires are Water-weak. No Rotom.",
          "play": "Keep Rotom-W. Do not take this flex.",
          "trap": "Aqua Jet cleans Charizard after one Sparkling Aria."
        },
        {
          "name": "Hippowdon",
          "slug": "hippowdon",
          "why": "EQ plus Sand. Skeledirge is Ground-weak.",
          "play": "Rotom+Charizard pivot instead.",
          "trap": "Stealth Rock makes both Fires lose HP they cannot spend."
        }
      ],
      "advantages": [
        {
          "title": "Role separation",
          "body": "The apparent type overlap hides a real job split: Charizard attacks, Skeledirge stabilizes."
        }
      ],
      "hazards": [
        {
          "title": "Water answer test",
          "body": "Before selecting this package, identify exactly how the three Pokémon respond if the opponent leads a strong Water attacker."
        }
      ]
    },
    {
      "id": "ceruledge-veil-dual-setup",
      "label": "Veil + Dual Setup",
      "when": "Swap Rotom for Ceruledge when they can cover one setup axis but not both — thin Ghost answers, Aegislash cores, no Primarina. Dual NP + SD under Veil. If Water-Ground is the board, keep Rotom.",
      "identity": "Aurora Veil supports both Mega Lucario's Nasty Plot and Ceruledge's Swords Dance.",
      "slugs": [
        "ninetales-alola",
        "lucario",
        "ceruledge"
      ],
      "requiresSwap": {
        "out": "rotom-wash",
        "in": "ceruledge"
      },
      "endgameIds": [
        "lucario-setup",
        "veil-attrition"
      ],
      "strategy": {
        "opponentPattern": "Aegislash / thin Ghost answers / one-dimensional setup defense. Not Primarina, Hippowdon, or Balloon Gholdengo.",
        "bring": [
          "ninetales-alola",
          "lucario",
          "ceruledge"
        ],
        "purpose": "Force the opponent to reveal whether its setup answer is physical-side or special-side, then attack the opposite axis.",
        "targets": [
          "Aegislash",
          "Lucario mirrors",
          "physical walls that lose to SD"
        ],
        "refuses": [
          "Primarina — Water/Fairy hits Ceruledge and Lucario.",
          "Gholdengo — Steel/Ghost resists Bitter Blade and Poltergeist; Balloon sits Ground.",
          "Do not set up with both attackers just because Veil is active.",
          "Do not sacrifice Ceruledge early if Shadow Sneak is the clean."
        ],
        "winCondition": "One setup attacker forces the opponent's answer; the other exploits the resulting defensive gap.",
        "gamePlan": "Veil → Force answer → Setup opposite axis → Finish.",
        "mantra": "Make the opponent choose which setup threat they are willing to lose to.",
        "contrast": "This is much more aggressive than the Rotom version and deliberately gives up conventional pivoting for offensive redundancy.",
        "defaultLead": "ninetales-alola",
        "defaultLeadWhy": "Veil first. If they lead Golisopod, Ceruledge Sash (if confirmed) or leave the pack."
      },
      "roles": [
        {
          "slug": "ninetales-alola",
          "macro": "Setter",
          "micro": "Create the protected turn."
        },
        {
          "slug": "lucario",
          "macro": "Special sweeper",
          "micro": "Threaten Nasty Plot and special coverage."
        },
        {
          "slug": "ceruledge",
          "macro": "Physical sweeper",
          "micro": "Threaten Swords Dance, Bitter Blade sustain, and Shadow Sneak."
        }
      ],
      "loops": [
        {
          "title": "Veil → identify defensive axis",
          "body": "After Veil, do not immediately decide whether Lucario or Ceruledge sets up. Ask which one the opponent's remaining three can least safely answer."
        },
        {
          "title": "Setup bait → opposite setup",
          "body": "If the opponent brings its physical wall to Ceruledge, use the resulting opportunity to bring Lucario. If it brings a special wall to Lucario, use Ceruledge."
        }
      ],
      "flows": [
        {
          "id": "lead",
          "title": "Lead",
          "forks": [
            {
              "id": "lead-0",
              "when": "Ninetales can establish Veil safely.",
              "then": "Lead Ninetales and scout the opponent's preferred defensive response."
            },
            {
              "id": "lead-1",
              "when": "Opponent has a lead that strongly threatens Ninetales.",
              "then": "Lead Ceruledge, preserve Ninetales, and seek Veil later."
            }
          ]
        },
        {
          "id": "mid",
          "title": "Choose Setup Axis",
          "forks": [
            {
              "id": "mid-0",
              "when": "Opponent's physical checks are weak or absent.",
              "then": "Set up Ceruledge."
            },
            {
              "id": "mid-1",
              "when": "Opponent's special checks are weak or absent.",
              "then": "Set up Mega Lucario."
            }
          ]
        }
      ],
      "victims": [
        {
          "name": "Aegislash",
          "slug": "aegislash-shield",
          "why": "They usually prepare for one Fire/Ghost attacker. Lucario NP and Ceruledge SD are different axes; King's Shield does not stop both.",
          "play": "Veil, then the axis they did not bring a sit for. Shadow Sneak if they try to revenge.",
          "trap": "Shadow Sneak from them still tags a Sashless Ceruledge after Weak Armor."
        },
        {
          "name": "Lucario",
          "slug": "lucario",
          "why": "Mirror: Veil plus Ceruledge Fighting immunity and Shadow Sneak can win the NP race.",
          "play": "Do not NP first if they can Vacuum Wave. Ceruledge or Encore.",
          "trap": "Their Dark Pulse still hits Ceruledge."
        }
      ],
      "counters": [
        {
          "name": "Primarina",
          "slug": "primarina",
          "why": "Water/Fairy. You dropped Rotom.",
          "play": "Do not take this flex.",
          "trap": "Moonblast plus Aqua Jet ends both setup threats."
        },
        {
          "name": "Gholdengo",
          "slug": "gholdengo",
          "why": "Steel/Ghost resists Fire and Ghost; Good as Gold ignores Encore.",
          "play": "Lucario Dark Pulse only — and only if they are not boosting first.",
          "trap": "Make It Rain through Veil still chunks both sweepers."
        }
      ],
      "advantages": [
        {
          "title": "Dual setup",
          "body": "This is the strongest swap for turning Aurora Veil from a single-win-condition package into a two-axis setup threat."
        }
      ],
      "hazards": [
        {
          "title": "Over-setup",
          "body": "One attacker getting a boost is enough. If the first setup attack already wins the board, attack instead of setting up the second sweeper."
        }
      ]
    },
    {
      "id": "ceruledge-charizard-pressure",
      "label": "Charizard + Ceruledge Pressure",
      "when": "Swap Rotom for Ceruledge when they cannot sit both special Charizard and physical Ghost/Fire — Rillaboom, Aegislash, thin Fire answers. Not vs Primarina or Hippowdon.",
      "identity": "Charizard supplies immediate special Fire pressure while Ceruledge attacks physically and carries priority.",
      "slugs": [
        "charizard",
        "garchomp",
        "ceruledge"
      ],
      "requiresSwap": {
        "out": "rotom-wash",
        "in": "ceruledge"
      },
      "endgameIds": [
        "zard-cleanup"
      ],
      "strategy": {
        "opponentPattern": "Rillaboom / Aegislash / split Fire answers. Not Primarina or Hippowdon.",
        "bring": [
          "charizard",
          "garchomp",
          "ceruledge"
        ],
        "purpose": "Use Garchomp to break shared checks while forcing the opponent to answer two different Fire attackers.",
        "targets": [
          "Rillaboom",
          "Aegislash",
          "Grass/Steel"
        ],
        "refuses": [
          "Primarina / Hippowdon — no Rotom sit.",
          "Do not reveal both Fire attackers before identifying their Fire counter.",
          "Do not use Ceruledge merely as a second Fire attacker; exploit Ghost and Shadow Sneak."
        ],
        "winCondition": "One Fire attacker forces the opponent's check into range of the other.",
        "gamePlan": "Pressure → Force answer → Switch axis → Finish.",
        "mantra": "Make the opponent defend the type twice, from different sides.",
        "contrast": "Compared with Rotom/Charizard/Garchomp, this package has less defensive safety but considerably more direct finishing power.",
        "defaultLead": "garchomp",
        "defaultLeadWhy": "Break the shared Fire sit. Ceruledge or Charizard after, not both on turn 1."
      },
      "roles": [
        {
          "slug": "charizard",
          "macro": "Special breaker",
          "micro": "Force immediate defensive answers."
        },
        {
          "slug": "ceruledge",
          "macro": "Physical breaker",
          "micro": "Exploit Fire/Ghost weaknesses and clean with Shadow Sneak."
        },
        {
          "slug": "garchomp",
          "macro": "Breaker",
          "micro": "Punish shared Fire answers and Electric targets."
        }
      ],
      "loops": [
        {
          "title": "Charizard forces answer → Ceruledge attacks answer",
          "body": "If Charizard reveals the opponent's Fire counter, determine whether Ceruledge can exploit it physically or through Ghost STAB."
        },
        {
          "title": "Ceruledge forces Water/Ground → Garchomp",
          "body": "When Ceruledge causes the opponent to reach for a Water/Ground answer, use Garchomp to punish the predictable switch where appropriate."
        }
      ],
      "flows": [
        {
          "id": "lead",
          "title": "Lead",
          "forks": [
            {
              "id": "lead-0",
              "when": "Opponent has an obvious physical answer to Charizard.",
              "then": "Lead Ceruledge or Garchomp and keep Charizard concealed."
            },
            {
              "id": "lead-1",
              "when": "Opponent's lead is immediately vulnerable to Charizard.",
              "then": "Lead Charizard and take the immediate pressure."
            }
          ]
        }
      ],
      "victims": [
        {
          "name": "Rillaboom",
          "slug": "rillaboom",
          "why": "Both Fires punish Grass; Garchomp Fire Fang if they stay; Ceruledge Shadow Sneak after chip.",
          "play": "Garchomp or Ceruledge lead — not Charizard into Glide.",
          "trap": "U-turn into Primarina."
        },
        {
          "name": "Aegislash",
          "slug": "aegislash-shield",
          "why": "Physical Ghost from Ceruledge plus special Fire from Charizard is two Shield problems.",
          "play": "Force Shield, then the other Fire. Shadow Sneak if they try to revenge.",
          "trap": "Their Shadow Sneak vs a Weak Armor Ceruledge."
        }
      ],
      "counters": [
        {
          "name": "Primarina",
          "slug": "primarina",
          "why": "No Rotom. Both Fires lose to Water/Fairy.",
          "play": "Do not take this flex.",
          "trap": "Aqua Jet on Charizard after one Moonblast."
        },
        {
          "name": "Hippowdon",
          "slug": "hippowdon",
          "why": "EQ hits Ceruledge and Charizard hates Rocks.",
          "play": "Rotom pivot pack instead.",
          "trap": "Sand plus Rocks ends the Fire race."
        }
      ],
      "advantages": [
        {
          "title": "Physical/special Fire split",
          "body": "The opponent cannot solve the package merely by preparing for Charizard's special damage."
        }
      ],
      "hazards": [
        {
          "title": "Shared Fire checks",
          "body": "If one Pokémon completely answers both Fire members and Garchomp cannot remove it, abandon this package."
        }
      ]
    },
    {
      "id": "metagross-preview-ambiguity",
      "label": "Non-Mega Metagross Ambiguity",
      "when": "Swap Rotom for non-Mega Metagross vs Primarina / Fairy / physical that Steel answers — and they over-prepare for one Mega. Do not swap if Hippowdon EQ or Fire is their axis. Metagross is not the Mega.",
      "identity": "Metagross is not the Mega. Its job is to add a serious Steel/Psychic body while forcing the opponent to respect Charizard and Lucario as the only actual Mega branches.",
      "slugs": [
        "metagross",
        "charizard",
        "lucario"
      ],
      "requiresSwap": {
        "out": "rotom-wash",
        "in": "metagross"
      },
      "endgameIds": [
        "zard-cleanup",
        "lucario-setup"
      ],
      "strategy": {
        "opponentPattern": "Primarina / Fairy / Ice that a non-Mega Steel body pressures. They brought one Mega sit. Not Hippowdon EQ or Fire.",
        "bring": [
          "metagross",
          "charizard",
          "lucario"
        ],
        "purpose": "Create maximum preview ambiguity and give both Mega branches a third member that changes the defensive requirements.",
        "targets": [
          "Primarina",
          "Fairy",
          "physical that Bullet Punch tags"
        ],
        "refuses": [
          "Hippowdon — Earthquake. You dropped Rotom's Ground sit.",
          "Do not put Metagrossite on this slot — Charizardite Y and Lucarionite Z are the stones.",
          "Do not assume preview ambiguity itself wins games.",
          "Do not sacrifice Metagross if its Steel sit is required for the Mega you actually pick."
        ],
        "winCondition": "Use Metagross to remove or weaken the target that prevents either Charizard or Lucario from cleaning.",
        "gamePlan": "Ambiguity → Reveal branch → Remove check → Mega finish.",
        "mantra": "Metagross makes them prepare; Charizard or Lucario makes them pay.",
        "contrast": "This package gives up Rotom's pivoting and Water coverage in exchange for physical durability, Steel utility, and a third meaningful preview threat.",
        "defaultLead": "metagross",
        "defaultLeadWhy": "Sit Fairy / Moonblast. Then pick the Mega they did not sit."
      },
      "roles": [
        {
          "slug": "metagross",
          "macro": "Bulwark",
          "micro": "Absorb physical pressure and punish Fairy/Ice/Poison targets."
        },
        {
          "slug": "charizard",
          "macro": "Breaker",
          "micro": "Exploit targets that Metagross forces into the open."
        },
        {
          "slug": "lucario",
          "macro": "Sweeper",
          "micro": "Use setup or immediate Steel/Fighting/Ghost coverage once its check is removed."
        }
      ],
      "loops": [
        {
          "title": "Metagross absorbs → Mega branch",
          "body": "Use Metagross when the opponent's physical attacker or Fairy/Ice target cannot safely punish it. After Metagross forces the opponent to reveal its answer, choose Charizard or Lucario based on what was revealed."
        },
        {
          "title": "Charizard forces Water/Fire answer → Lucario",
          "body": "If Charizard's pressure forces a target that is vulnerable to Lucario, preserve Charizard as the damage source and switch the endgame to Lucario."
        },
        {
          "title": "Lucario forces Steel/Fairy answer → Charizard",
          "body": "If the opponent brings a Fire/physical answer to Lucario, identify whether Charizard can exploit it. The two Mega branches are allowed to trade roles."
        }
      ],
      "flows": [
        {
          "id": "lead",
          "title": "Lead",
          "forks": [
            {
              "id": "lead-0",
              "when": "Metagross has a strong neutral matchup and the opponent cannot immediately exploit its weaknesses.",
              "then": "Lead Metagross and use the first turn to learn the opponent's defensive answer."
            },
            {
              "id": "lead-1",
              "when": "Opponent has a target Charizard directly punishes.",
              "then": "Lead Charizard and preserve Metagross as the physical anchor."
            }
          ]
        },
        {
          "id": "mid",
          "title": "Choose Mega",
          "forks": [
            {
              "id": "mid-0",
              "when": "Opponent's Fire/Grass/Steel answer is weakened or absent.",
              "then": "Mega Charizard."
            },
            {
              "id": "mid-1",
              "when": "Opponent's Dark/Steel/Fairy structure is weakened or exposed.",
              "then": "Mega Lucario."
            }
          ]
        }
      ],
      "victims": [
        {
          "name": "Primarina",
          "slug": "primarina",
          "why": "Steel hits Fairy. Non-Mega Metagross is the Primarina body Rotom never was; then Lucario or Charizard depending which they sat.",
          "play": "Lead Metagross. Bullet Punch / Psychic Fangs (once the kit is confirmed). Do not send Charizard into Moonblast.",
          "trap": "Aqua Jet after chip. Sparkling Aria still hurts Charizard if you pick the wrong Mega."
        },
        {
          "name": "Aegislash",
          "slug": "aegislash-shield",
          "why": "Steel/Psychic plus a Mega they cannot sit both of.",
          "play": "Metagross into Shield, then the Mega they did not prepare.",
          "trap": "Shadow Sneak vs a weakened Lucario."
        }
      ],
      "counters": [
        {
          "name": "Hippowdon",
          "slug": "hippowdon",
          "why": "Earthquake. Metagross is Ground-weak; you dropped Rotom.",
          "play": "Do not take this flex vs Sand.",
          "trap": "Rocks plus EQ chip before you ever Mega."
        },
        {
          "name": "Rillaboom",
          "slug": "rillaboom",
          "why": "Grassy Glide vs Metagross; Charizard still wants the Grass but Lucario does not.",
          "play": "Charizard pack with Rotom, not this three, unless Garchomp is also coming.",
          "trap": "High Horsepower after Glide."
        }
      ],
      "advantages": [
        {
          "title": "Preview ambiguity",
          "body": "Metagross does not need to Mega Evolve to make the opponent account for a third serious threat."
        },
        {
          "title": "Mega resource clarity",
          "body": "The pilot can register two Mega-capable Pokémon and use Metagross as the non-Mega physical anchor, keeping the actual Mega choice flexible until the matchup is clearer."
        }
      ],
      "hazards": [
        {
          "title": "False ambiguity",
          "body": "Do not overvalue making the opponent guess. If Metagross itself does not improve the three-Pokémon matchup, the mind game has no practical value."
        }
      ]
    },
    {
      "id": "metagross-veil-bulwark",
      "label": "Veil + Metagross Bulwark",
      "when": "Swap Rotom for Metagross when Ninetales can Veil and they are physical Fairy/Ice (Primarina physical variants, Baxcalibur) that a Steel body plus Lucario can farm. Not vs Hippowdon EQ or Fire.",
      "identity": "Aurora Veil supports both Metagross and Lucario, creating a Steel-based midgame before Lucario finishes.",
      "slugs": [
        "ninetales-alola",
        "metagross",
        "lucario"
      ],
      "requiresSwap": {
        "out": "rotom-wash",
        "in": "metagross"
      },
      "endgameIds": [
        "lucario-setup",
        "veil-attrition"
      ],
      "strategy": {
        "opponentPattern": "Physical Fairy/Ice that Veil plus non-Mega Metagross sits. Not Hippowdon or special Water.",
        "bring": [
          "ninetales-alola",
          "metagross",
          "lucario"
        ],
        "purpose": "Use Veil to create a physically durable middle game and let either Steel Pokémon become the finisher.",
        "targets": [
          "Primarina",
          "Baxcalibur",
          "physical Fairy"
        ],
        "refuses": [
          "Hippowdon — Earthquake through Veil still hurts Metagross.",
          "Do not use both Steel Pokémon as disposable damage dealers.",
          "Do not NP Lucario if Metagross already has the better endgame.",
          "Metagross stays non-Mega — do not steal the stone from Lucario."
        ],
        "winCondition": "Veil lets Metagross absorb pressure while removing a target, then Lucario finishes after the opposing answer is weakened.",
        "gamePlan": "Veil → Bulwark → Break → Finish.",
        "mantra": "Use Veil to make Metagross the wall they did not prepare for, then let Lucario finish.",
        "contrast": "Compared with Ninetales/Lucario/Garchomp, this package is less Ground-oriented and more resistant to physical/Fairy/Ice pressure.",
        "defaultLead": "ninetales-alola",
        "defaultLeadWhy": "Veil first if they do not First Impression. Otherwise Metagross."
      },
      "roles": [
        {
          "slug": "ninetales-alola",
          "macro": "Setter",
          "micro": "Create Veil."
        },
        {
          "slug": "metagross",
          "macro": "Bulwark",
          "micro": "Use Steel/Psychic typing and physical bulk to create progress under Veil."
        },
        {
          "slug": "lucario",
          "macro": "Sweeper",
          "micro": "Finish after Metagross has removed the correct check."
        }
      ],
      "loops": [
        {
          "title": "Veil → Metagross pressure",
          "body": "After Veil, Metagross can enter against physical pressure that would otherwise be risky. Use its bulk to take the interaction, then attack rather than repeatedly switching."
        },
        {
          "title": "Metagross breaks → Lucario cleans",
          "body": "Once Metagross removes or weakens the target that blocks Lucario, stop trying to keep Metagross alive forever. The job has changed from anchor to enabler."
        }
      ],
      "flows": [
        {
          "id": "lead",
          "title": "Lead",
          "forks": [
            {
              "id": "lead-0",
              "when": "Ninetales can establish Veil safely.",
              "then": "Lead Ninetales."
            },
            {
              "id": "lead-1",
              "when": "Opponent threatens Ninetales immediately.",
              "then": "Lead Metagross and preserve Ninetales for a later Veil."
            }
          ]
        }
      ],
      "victims": [
        {
          "name": "Primarina",
          "slug": "primarina",
          "why": "Veil plus Steel makes Moonblast less free; Lucario Flash Cannon after Metagross chips.",
          "play": "Metagross into Fairy, Veil if they Encore/Protect, Lucario to finish.",
          "trap": "Aqua Jet still exists. Do not NP into a healthy Primarina."
        },
        {
          "name": "Baxcalibur",
          "slug": "baxcalibur",
          "why": "Physical Ice/Dragon into Veil Metagross; Lucario special after Ice Shard is spent.",
          "play": "Do not lead Ninetales into Ice Shard. Metagross first.",
          "trap": "Glaive Rush plus Ice Shard still chunks if Veil is down."
        }
      ],
      "counters": [
        {
          "name": "Hippowdon",
          "slug": "hippowdon",
          "why": "Earthquake. No Rotom.",
          "play": "Do not take this flex vs Sand.",
          "trap": "Rocks plus EQ before Lucario ever enters."
        },
        {
          "name": "Gholdengo",
          "slug": "gholdengo",
          "why": "Steel-on-Steel plus Good as Gold. Make It Rain chunks both Steels.",
          "play": "Lucario Dark Pulse only if they are not boosting first. Often the wrong pack.",
          "trap": "Balloon sits any leftover Ground from Metagross EQ."
        }
      ],
      "advantages": [
        {
          "title": "Steel redundancy",
          "body": "Lucario and Metagross have different jobs despite both being Steel types: Metagross stabilizes physically, Lucario sweeps specially."
        }
      ],
      "hazards": [
        {
          "title": "Steel stacking",
          "body": "Do not bring both Steel Pokémon simply because they resist many things. Confirm the opponent has targets both can actually pressure."
        }
      ]
    }
  ],
  "victims": [
    {
      "name": "Hippowdon",
      "slug": "hippowdon",
      "why": "Rotom Hydro plus Garchomp EQ contest Sand; Charizard eats the Grass they bring to answer Ground."
    },
    {
      "name": "Rillaboom",
      "slug": "rillaboom",
      "why": "Charizard wants Grass; Meowscarada U-turns around Glide. Do not feed Rotom to Glide."
    },
    {
      "name": "Mega Salamence",
      "slug": "salamence",
      "why": "Physical DD is why Skeledirge exists as a flex. Core Garchomp Fire Fang if you keep Rotom."
    }
  ],
  "counters": [
    {
      "name": "Primarina",
      "slug": "primarina",
      "why": "Moonblast stops Charizard and Lucario. Answer is Meowscarada Flower Trick or non-Mega Metagross flex — not Rotom Hydro."
    },
    {
      "name": "Gholdengo",
      "slug": "gholdengo",
      "why": "Good as Gold plus Balloon sits Garchomp and ignores Encore. Lucario Dark Pulse or leave."
    },
    {
      "name": "Golisopod",
      "slug": "golisopod",
      "why": "First Impression denies Veil. Lead Rotom/Garchomp, not Ninetales."
    }
  ],
  "advantages": [
    {
      "title": "Two Mega branches",
      "body": "Charizard Y and Lucario Z are not required to coexist in the same battle. They create different endgames from the same six and force the opponent to prepare for two different offensive structures."
    },
    {
      "title": "Six-to-three package diversity",
      "body": "The team can play pivot offense, Veil setup, no-Mega tempo, anti-setup balance, dual setup, or Steel-based ambiguity depending on the sixth slot."
    },
    {
      "title": "Rotom-W completion",
      "body": "Rotom-W is the conventional pivot this six needs. M6 ranked (asOf 2026-09-20) places it #25 with Hydro Pump / Volt Switch / Will-O-Wisp; Levitate is universal in the dump. Item split is Leftovers-led — see evidence, not a locked kit."
    },
    {
      "title": "Flex slots change playstyle",
      "body": "Skeledirge, Ceruledge, and Metagross are not cosmetic replacements. Each creates a different active six and therefore changes which three-Pokémon packages should be selected."
    }
  ],
  "slugs": [
    "charizard",
    "garchomp",
    "lucario"
  ],
  "slots": [
    {
      "slug": "charizard",
      "title": "Charizard Y",
      "job": "mega",
      "literacy": "wallbreaker",
      "role": "Primary immediate special breaker and Sun setter. Charizard turns one correct forced switch into enormous damage and gives the team a second way to attack from the special side.",
      "primaryJob": "Create immediate offensive pressure, punish Steel/Grass/Bug targets, and exploit Sun with Fire STAB and Solar Beam.",
      "item": "Charizardite Y",
      "ability": "Drought",
      "nature": "TODO: preserve the established competitive build used by the pilot",
      "moves": [
        {
          "name": "Flamethrower",
          "why": "Reliable Fire STAB for applying pressure without gambling the game on a low-accuracy or overly committal attack."
        },
        {
          "name": "Air Slash",
          "why": "Secondary STAB that hits targets which resist Fire and gives Charizard a Flying attack without needing another Pokémon to supply that coverage."
        },
        {
          "name": "Solar Beam",
          "why": "Sun converts Solar Beam into an immediate Grass attack, allowing Charizard to punish Water, Ground, and Rock targets that expect to answer Fire."
        },
        {
          "name": "Roost",
          "why": "Keeps Charizard usable after the initial burst and allows the pilot to preserve it for a later Mega-based endgame."
        }
      ],
      "objective": "Get Charizard onto the field against something it naturally pressures, force progress, and keep it alive if the opponent still has a Fire-weak or Solar Beam-vulnerable target.",
      "howToPlay": "Do not expose Charizard merely because it can Mega. Use Garchomp, Rotom-W, or Meowscarada to create the entry. Once Charizard enters safely, ask whether immediate damage or preserving HP creates more value. Charizard is usually the Mega when the opponent's structure is vulnerable to repeated Fire/Solar Beam pressure and does not require Lucario's Steel/Fighting/NP endgame."
    },
    {
      "slug": "garchomp",
      "title": "Life Orb Garchomp",
      "job": "breaker",
      "literacy": "wallbreaker",
      "role": "Physical pressure engine, Electric immunity, hazard option, and glue between the Charizard and Lucario branches.",
      "primaryJob": "Punish Electric types, pressure Steel/Rock/Fire targets, force physical respect, and create turns for the team's special attackers.",
      "item": "Life Orb",
      "ability": "Rough Skin",
      "nature": "Jolly",
      "moves": [
        {
          "name": "Earthquake",
          "why": "Primary Ground STAB and the team's strongest general physical punishment button."
        },
        {
          "name": "Dragon Claw",
          "why": "Reliable Dragon STAB that prevents the team from relying only on Ground damage."
        },
        {
          "name": "Fire Fang",
          "why": "Punishes Steel and Grass targets that attempt to switch into Earthquake or exploit Garchomp's Dragon typing."
        },
        {
          "name": "Stealth Rock",
          "why": "Creates persistent chip that turns Charizard, Meowscarada, and Lucario damage ranges into easier endgames. Use only when the immediate damage or tempo loss is acceptable."
        }
      ],
      "objective": "Be the physical glue. Garchomp should either take an Electric-targeted move, punish a grounded target, establish Rocks when the board permits it, or force enough respect that Charizard/Lucario receives the next advantageous turn.",
      "howToPlay": "Do not automatically click Stealth Rock because you have it. In 3v3, a dead or badly damaged Garchomp can be more costly than missing Rocks. Use its offensive threat to create progress first; set Rocks when the opponent has been forced into a predictable or passive position."
    },
    {
      "slug": "lucario",
      "title": "Mega Lucario Z",
      "job": "mega",
      "literacy": "sweeper",
      "role": "Veil-enabled special setup sweeper and alternate Mega branch.",
      "primaryJob": "Exploit protected setup turns and finish games after Garchomp/Meowscarada/Charizard have removed its checks.",
      "item": "Lucarionite Z",
      "ability": "Inner Focus",
      "nature": "Timid",
      "moves": [
        {
          "name": "Nasty Plot",
          "why": "Turns an Aurora Veil or forced-switch turn into immediate special sweeping pressure."
        },
        {
          "name": "Aura Sphere",
          "why": "Reliable Fighting STAB that pressures Dark, Steel, and other targets that resist Lucario's other attacks."
        },
        {
          "name": "Flash Cannon",
          "why": "Steel STAB for Fairy and Ice targets and the primary reason Lucario can punish certain Dragon/Fairy structures."
        },
        {
          "name": "Dark Pulse",
          "why": "Covers Ghost and Psychic targets that would otherwise interfere with the Fighting/Steel core."
        }
      ],
      "objective": "Do not use Lucario merely as a normal attacker. Its greatest value is the threat of Nasty Plot under Veil or after an Encore/forced switch.",
      "howToPlay": "Lucario is the Mega when the opponent's checks can be softened or forced out by Ninetales/Garchomp/Meowscarada. The preferred sequence is Veil or forced switch -> Lucario enters -> Nasty Plot if the board allows -> attack. If setup is unnecessary, attack immediately; never give the opponent a free turn simply because the set contains Nasty Plot."
    }
  ],
  "phases": [
    {
      "id": "preview",
      "title": "Preview",
      "lede": "Before thinking about your own lead, identify four opponent facts: fastest threat, strongest physical attacker, strongest special attacker, and likely setup/win condition. Then identify which of your three candidate packages answers those four facts with the fewest forced predictions.",
      "branches": [
        {
          "when": "Preview locked",
          "then": "Opponent threat map → choose Mega branch → choose package → choose lead → preserve the two pieces needed for the endgame."
        }
      ]
    },
    {
      "id": "lead",
      "title": "Opening",
      "lede": "The first objective is information plus controlled progress. Do not reveal the entire plan. If Meowscarada or Rotom can learn what the opponent's response is, take that information before committing Charizard or Lucario.",
      "branches": [
        {
          "when": "Opening turn",
          "then": "Safe lead → identify response → make progress → reposition."
        }
      ]
    },
    {
      "id": "mid",
      "title": "Midgame",
      "lede": "Once the opponent's six-to-three intentions are visible, stop trying to answer everything. Identify the one Pokémon that prevents your selected win condition and spend resources removing it.",
      "branches": [
        {
          "when": "Blocker identified",
          "then": "Weaken/remove blocker → protect win condition → stop unnecessary switching."
        }
      ]
    },
    {
      "id": "late",
      "title": "Endgame",
      "lede": "Once one of Charizard, Lucario, Garchomp, Meowscarada, or a flex Pokémon has a clean route to the remaining opponents, stop playing for hypothetical future turns. Preserve enough HP to execute the route and take the decisive KOs.",
      "branches": [
        {
          "when": "Clean route exists",
          "then": "Check remaining threats → confirm damage/speed route → commit → finish."
        }
      ]
    }
  ],
  "loops": [
    {
      "title": "Universal Pivot Loop",
      "body": "Use Meowscarada U-turn or Rotom Volt Switch only when the destination is better than the current position. Ask: what am I bringing in, and what does it gain against the opponent? If there is no strong answer, attack directly instead."
    },
    {
      "title": "Charizard Conversion Loop",
      "body": "Create a safe Charizard entry → Mega Evolve when appropriate → force the opponent to reveal its Fire/Grass/Water answer → use Garchomp or Meowscarada to punish that answer → return Charizard once its check is weakened → finish. Charizard should eventually stop pivoting and start collecting KOs."
    },
    {
      "title": "Lucario Conversion Loop",
      "body": "Establish Veil or force a switch → bring Lucario into a safe turn → ask whether Nasty Plot is necessary → boost if safe, attack if not → remove one check → reassess. Nasty Plot is a tool, not a ritual."
    },
    {
      "title": "Meowscarada Information Loop",
      "body": "Meowscarada enters → identify whether the opponent stays or switches → attack if the current target is valuable, U-turn if the expected switch creates a much better matchup, Knock Off if removing the item permanently changes the matchup → bring in the appropriate breaker."
    },
    {
      "title": "Rotom Control Loop",
      "body": "Rotom enters against a target it handles → threaten Hydro Pump/Wisp → opponent either stays or switches → if the response is favorable for a teammate, Volt Switch; if not, attack/status instead → bring the correct teammate → repeat."
    },
    {
      "title": "Skeledirge Anti-Snowball Loop",
      "body": "Opponent begins setup → Skeledirge enters → Unaware ignores the ordinary boost → Will-O-Wisp if the threat is physical → Slack Off when necessary → attack once the opponent's route is controlled."
    },
    {
      "title": "Ceruledge Dual-Setup Loop",
      "body": "Veil creates protection → identify whether the opponent's remaining answer is stronger against physical or special attackers → set up the opposite attacker → force the specialized check to appear → use the other attacker to exploit it."
    },
    {
      "title": "Metagross Ambiguity Loop",
      "body": "Use Metagross to force the opponent to reveal a physical/Steel answer → determine whether that answer also checks Charizard or Lucario → choose the Mega branch that exploits the revealed answer."
    }
  ],
  "hazards": [
    {
      "title": "Mega choice is a resource",
      "body": "Only one Mega Evolution can occur per battle. Do not decide Charizard game or Lucario game before looking at the opponent's actual three-Pokémon structure."
    },
    {
      "title": "Charizard and Lucario do not need to coexist",
      "body": "Do not evaluate them as if both must appear. Their purpose in the six is to give the pilot two distinct Mega branches."
    },
    {
      "title": "Rotom is the default sixth for a reason",
      "body": "Rotom-W is the default because it adds a function the original five lacked: conventional pivoting plus Water/Electric/Ground-immunity utility."
    },
    {
      "title": "Flex swaps are six changes, not seventh Pokémon choices",
      "body": "When Skeledirge, Ceruledge, or Metagross is selected, Rotom-W leaves the active six. Rebuild the package around the replacement instead of trying to preserve Rotom's old role."
    },
    {
      "title": "Skeledirge role warning",
      "body": "Skeledirge should be selected for Unaware/recovery/anti-setup utility, not because the team needs another Fire type."
    },
    {
      "title": "Ceruledge role warning",
      "body": "Ceruledge is an offensive Fire/Ghost setup piece, not a Rotom replacement in the defensive sense."
    },
    {
      "title": "Metagross ambiguity warning",
      "body": "Non-Mega Metagross creates useful preview ambiguity only if its actual Steel/Psychic role matters. Never select it solely to make the opponent guess."
    },
    {
      "title": "Weather clash",
      "body": "Ninetales creates Snow while Charizard Y creates Sun. This is not automatically bad because they belong to different packages, but do not accidentally use weather-setting Pokémon in a way that destroys your own intended damage plan."
    },
    {
      "title": "Garchomp Rocks greed",
      "body": "Stealth Rock is valuable in 3v3, but a lost turn is proportionally expensive. If Garchomp has a direct KO or critical matchup to handle, take the progress instead of setting Rocks automatically."
    },
    {
      "title": "Sneasler emergency rule",
      "body": "If Sneasler appears in preview, immediately ask whether your chosen three allow it to obtain a free Fake Out/Unburden sequence. Do not rely on raw speed alone. The correct response is matchup-dependent; do not assume any one candidate completely solves Sneasler."
    },
    {
      "title": "Do not confuse resistance with counter",
      "body": "A Pokémon that resists one attack is not automatically the correct switch. Before switching, check the opponent's likely second move, coverage, item, speed, and whether the switch creates a worse position."
    },
    {
      "title": "The pilot's central question",
      "body": "Every turn ask: what does my opponent need to happen for them to win, and which of my three Pokémon prevents that while also advancing my own win condition?"
    }
  ],
  "megaPool": {
    "rule": "One Mega Evolution per battle. Charizard Y and Lucario Z are alternate branches — not partners.",
    "previewPressure": "If they prep Charizard Y, lean Veil Lucario or no-mega tempo. If they prep Lucario, lean Charizard pivot.",
    "cost": "The unused Mega still occupies its item slot — the ambiguity is intentional.",
    "candidates": [
      {
        "slug": "charizard",
        "stone": "Charizardite Y",
        "when": "They are soft to Sun Fire / Solar Beam and you can force a safe entry."
      },
      {
        "slug": "lucario",
        "stone": "Lucarionite Z",
        "when": "Veil or a forced switch makes one Nasty Plot turn real."
      }
    ]
  },
  "relatedLessons": [
    "preview",
    "building",
    "speed"
  ],
  "setsNote": "Natures and items marked TODO wait on the pilot kit. Season 6 usage lives in evidence and is not copied onto this six: Garchomp stays Life Orb; Metagross flex stays non-Mega."
} as TeamManual;
