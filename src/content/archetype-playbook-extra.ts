import type { ArchetypeId } from "@/types/pokemon";

export type ArchetypePlaybook = {
  identity: string[];
  howItWins: string;
  previewScript: string[];
  buildPriorities: string[];
  vsScript: string[];
};

export type ArchetypeStaple = { slug: string; role: string; why: string };
export type ArchetypeAnswer = { slug: string; why: string };

export type ArchetypePlaybookExtra = {
  playbook: ArchetypePlaybook;
  staples: ArchetypeStaple[];
  answers: ArchetypeAnswer[];
};

export const PLAYBOOK_EXTRA: Record<ArchetypeId, ArchetypePlaybookExtra> = {
  balance: {
    playbook: {
      identity: [
        "Breaker + cleaner + patch — three jobs, not three attackers.",
        "You trade and pivot; the match is allowed to go long.",
        "Wincon sits in the bag until the wall that stops it is gone.",
        "Whimsicott on the six is a Tailwind clock, not a stall piece.",
      ],
      howItWins:
        "Chip the Pokémon that walls your cleaner, force the awkward switch, then send Garchomp or Kingambit into a free turn. The patch — Gholdengo, Corviknight, Primarina — eats the revenge that would end a thinner three. You do not need turn-1 KOs; you need one clean entry after the right trade.",
      previewScript: [
        "Two attackers plus a Ghost/Steel or fat Flying? Good Stuff / Balance, not HO glass.",
        "Find the cleaner (Garchomp, Meowscarada) and ask what sits on it — that is their midgame.",
        "Whimsicott or Tailwind language means four turns of race; count who outruns under it.",
        "Kingambit next to a patch is Balance. Kingambit next to Farigiraf is Trick Room — do not confuse them.",
        "Bring the answer to their patch first; their cleaner only matters after the wall is gone.",
      ],
      buildPriorities: [
        "Name the cleaner, then pick the breaker that deletes what walls it.",
        "The third slot must cover the hole the first two share — Ghost, status, or Ice — not a third STAB.",
        "SP the race you actually play: midrange pivots, not HO glass. Cap 32, total 66.",
        "If you splash Tailwind, treat Whimsicott as a clock you read on preview, not a free pivot.",
        "Sample the three that can answer Dragon, Steel, and a special wall without praying.",
      ],
      vsScript: [
        "Do not feed free entries to their cleaner — chip or KO the patch first.",
        "Force their midgame trade; Balance dies when the chess match becomes a race they did not pack for.",
        "Priority and status into the late send matter more than matching their midrange typing.",
        "If they have Tailwind, play the four turns as a sprint — their patch is slower under the clock.",
        "Trick Room and rain both ignore their Speed story; pack disruption or Electric before preview ends.",
      ],
    },
    staples: [
      {
        slug: "garchomp",
        role: "Cleaner",
        why: "Late-game Ground that finishes after the wall is gone. Keep it back until the entry is free.",
      },
      {
        slug: "kingambit",
        role: "Breaker",
        why: "Cracks Steel and Rock that sit on Dragons. Sucker Punch closes races Balance already won.",
      },
      {
        slug: "gholdengo",
        role: "Patch",
        why: "Ghost/Steel cover for the hole Chomp and Gambit share. Status and Fake Out bounce off.",
      },
      {
        slug: "whimsicott",
        role: "Speed clock",
        why: "Prankster Tailwind on a Balance six. Four turns you can read before they click it.",
      },
      {
        slug: "corviknight",
        role: "Fat pivot",
        why: "Soaks Ice into Dragons, hands off to the cleaner. Honest Balance glue.",
      },
      {
        slug: "primarina",
        role: "Special patch",
        why: "Water/Fairy that sits on Dragons and Fire while the physical truck does work.",
      },
    ],
    answers: [
      {
        slug: "meowscarada",
        why: "Flower Trick + Speed pressure their midrange and threaten Farigiraf-style setters on hybrid lists.",
      },
      {
        slug: "farigiraf",
        why: "Flip their Speed plan. Armor Tail blanks Fake Out; trucks move first for four turns.",
      },
      {
        slug: "raichu",
        why: "Fast Electric into Water patches and rain hybrids that Balance sometimes splash.",
      },
      {
        slug: "salamence-mega",
        why: "Delete the patch before they pivot. If Corvi or Gholdengo never takes a turn, their cleaner never enters free.",
      },
      {
        slug: "cinderace",
        why: "Libero Speed punches first into Grass glue and forces awkward Balance switches.",
      },
      {
        slug: "hippowdon",
        why: "Sand + Ground pressure into Fire and Electric answers; fat enough to soak their midgame hit.",
      },
    ],
  },

  "hyper-offense": {
    playbook: {
      identity: [
        "No defensive net — recovery is rare, margin is thin.",
        "Speed plus glass: the match should be over by turn 4.",
        "Mega or Scarf is the snowball; partners exist to free a hit.",
        "A switch to a resist is already behind.",
      ],
      howItWins:
        "Remove the one Pokémon that would sit on the Mega, then snowball. Cinderace or Excadrill punches the stopper; Mega Salamence or Dragonite cleans what is left. There is no midgame pivot — every turn is an attack. If the sweeper eats a revenge KO, the sprint is over.",
      previewScript: [
        "Mega + fast Fire/Ground with no fat pivot = HO. Do not play chess.",
        "Excadrill beside Dragonite is Mold Breaker into Multiscale — Scale Sweep, not Balance.",
        "Mimikyu means Disguise buys the setup turn; kill the costume before the boost.",
        "Ask what revenge-KOs their Mega. That Pokémon is your bring priority.",
        "No Corvi/Gholdengo glue on the six? They cannot absorb a failed lead.",
      ],
      buildPriorities: [
        "Pick the Mega wincon first, then the partner that deletes its check.",
        "Raw Speed or Scarf — Tailwind costs your only turn in singles.",
        "SP for the races you must win on turn 1; do not waste points on bulk you will not use.",
        "One Ground punch (Garchomp/Excadrill) for the Steel that walls Flying.",
        "Accept the thin margin: if the first KO fails, you are out of Pokémon.",
      ],
      vsScript: [
        "Do not donate a free Mega hit — resist or KO on their lead send.",
        "Priority into the snowball on the turn they need the KO ends the plan.",
        "Walls that shrug both STABs (Primarina, Corviknight, Archaludon) force them to trade glass.",
        "Trick Room flips their whole Speed story; Farigiraf is a nightmare bring.",
        "Chip Multiscale / Disguise before the kite turn — half-health Dragonite is a different mon.",
      ],
    },
    staples: [
      {
        slug: "salamence-mega",
        role: "Mega wincon",
        why: "Aerilate snowball. Partners exist to get it one free hit; a revenge KO ends the sprint.",
      },
      {
        slug: "cinderace",
        role: "Speed punch",
        why: "Moves first, deletes the stopper. HO clock without spending a turn on Tailwind.",
      },
      {
        slug: "garchomp",
        role: "Ground breaker",
        why: "Punches the Steel/Rock that would sit on the Mega all match.",
      },
      {
        slug: "dragonite",
        role: "Multiscale kite",
        why: "Scale Sweep wincon. Excadrill often leads to break the scale.",
      },
      {
        slug: "excadrill",
        role: "Mold Breaker lead",
        why: "Ignores Multiscale/Disguise. Classic HO front-end, not a Balance patch.",
      },
      {
        slug: "mimikyu-disguised",
        role: "Disguise setup",
        why: "Costume buys the turn the kite needs. Protect the disguise or the plan dies.",
      },
    ],
    answers: [
      {
        slug: "corviknight",
        why: "Soaks Ice-weak Dragons and Aerilate hits; forces HO to spend a breaker turn.",
      },
      {
        slug: "primarina",
        why: "Special wall that shrugs Fire/Dragon STABs and threatens with Fairy.",
      },
      {
        slug: "gholdengo",
        why: "Ghost/Steel patch that eats status and sits on physical snowballs.",
      },
      {
        slug: "farigiraf",
        why: "Trick Room + Armor Tail. Their Speed becomes last; trucks delete the Mega.",
      },
      {
        slug: "archaludon",
        why: "Special Steel that walls Flying and answers Electric revenge into rain hybrids.",
      },
      {
        slug: "golisopod",
        why: "First Impression priority into the Mega on the turn they need the KO.",
      },
    ],
  },

  "trick-room": {
    playbook: {
      identity: [
        "Mode, not a sprinkle — the three is slow on purpose.",
        "Setter first: no room, no plan.",
        "Four turns are the match; cash them with trucks.",
        "Tail Room hybrids keep Tailwind if the setter gets Taunted.",
      ],
      howItWins:
        "Protect Farigiraf long enough to click Trick Room, then fire Kingambit and a bulky special while their fast Pokémon move last. Armor Tail blanks Fake Out. When the room ends you either re-set or lose the race — do not invent midgame Speed you never invested in.",
      previewScript: [
        "Farigiraf on the six = room is coming. Plan the lead as if it is up turn 1–2.",
        "Slow Kingambit / Gholdengo beside the setter confirms TR, not Balance Gambit.",
        "Whimsicott + Farigiraf = Tail Room. Read both clocks before you lock the three.",
        "Ask who Taunts the setter. If you cannot answer, they never get the four turns.",
        "Opposing Trick Room means a room war — Speed tiers invert for both sides.",
      ],
      buildPriorities: [
        "Setter is mandatory. Farigiraf or you are bluffing.",
        "Trucks must be slow on purpose — invest HP/Atk, not Speed you will invert.",
        "Backup if Taunted: second setter, Tailwind (Tail Room), or a mon that still functions dry.",
        "Ghost answer on the three — Kingambit hates Gholdengo-shaped holes.",
        "SP: outrun under room, not outside it. Cap 32 where the truck needs the KO.",
      ],
      vsScript: [
        "Taunt or KO the setter before the room goes up — that is the whole matchup.",
        "Do not send glass into a live room; your Speed is last for four turns.",
        "Pressure with Grassy Glide / priority that still works under or after the room.",
        "Fire into Farigiraf and the truck if they lack a Water/Rock answer (sun pressure).",
        "If room is up, trade into their truck and stall turns — the clock is their resource.",
      ],
    },
    staples: [
      {
        slug: "farigiraf",
        role: "Setter",
        why: "Armor Tail + Trick Room. Must-appear clock. Protect from Taunt or the plan never starts.",
      },
      {
        slug: "kingambit",
        role: "Truck",
        why: "Slow Dark breaker that moves first under the room and deletes walls.",
      },
      {
        slug: "gholdengo",
        role: "Special Steel",
        why: "Keeps moving under TR, patches Ghost, and sits on physical revenge.",
      },
      {
        slug: "whimsicott",
        role: "Tail Room",
        why: "Prankster Tailwind backup when the setter is Taunted. Two clocks on one six.",
      },
      {
        slug: "tinkaton",
        role: "Fairy truck",
        why: "Slow Fairy/Steel that cashes room turns into Dragons and Kingambit mirrors.",
      },
      {
        slug: "aegislash-shield",
        role: "Stance truck",
        why: "Bulky special/physical threat that loves moving first under the room.",
      },
    ],
    answers: [
      {
        slug: "meowscarada",
        why: "Speed + Flower Trick pressure the setter and threaten before room is safe.",
      },
      {
        slug: "cinderace",
        why: "Fast Fire into Farigiraf and Kingambit before the four turns start.",
      },
      {
        slug: "talonflame",
        why: "Gale Wings priority into the setter and trucks that expect a dry race.",
      },
      {
        slug: "primarina",
        why: "Fat Fairy/Water that sits on Dark trucks and threatens the Psychic setter.",
      },
      {
        slug: "rillaboom",
        why: "Grassy Glide priority still threatens under or after the room; terrain softens their Ground answers.",
      },
      {
        slug: "charizard-mega-y",
        why: "Drought Fire deletes the setter and the truck before the room is locked.",
      },
    ],
  },

  rain: {
    playbook: {
      identity: [
        "Drizzle on entry — the field is the team.",
        "Water hits harder, Fire wilts, Hurricane never misses.",
        "Swift Swim / Electro Shot partners cash the weather.",
        "No Electric answer on the three is a gift to Raichu.",
      ],
      howItWins:
        "Pelipper walks in, rain goes up, and Basculegion or Archaludon punch holes while Fire is neutered. Hurricane always connects. Keep the bird alive; if they kill the setter you are a mediocre Water team. Close while rain is still up and they have no Electric.",
      previewScript: [
        "Pelipper must appear. No bird, no rain — plan the lead as if Drizzle is coming.",
        "Basculegion beside the bird = Swift Swim Wave Crash cleaner.",
        "Archaludon is the special twin and the Electric sponge — count it as their Steel answer.",
        "U-turn rain is still rain; the field is the tell, not the pivot count.",
        "Sun on their six means weather war — whoever sets last owns the field.",
      ],
      buildPriorities: [
        "Pelipper is mandatory. Build the other two to cash rain, not to function dry.",
        "One Swift Swim cleaner (Basculegion) and one special/Steel twin (Archaludon).",
        "Electric answer is non-negotiable — Archaludon, Gholdengo, or you lose to Raichu.",
        "SP the rain races: outspeed under Swift Swim, not the dry midrange.",
        "Do not donate the bird for chip; Hurricane or U-turn out of ugly leads.",
      ],
      vsScript: [
        "Bring Electric (Raichu, Kilowattrel) and click it into Water while rain is up.",
        "KO or pressure Pelipper early — no setter, no field.",
        "Sun overwrites: Hippowdon or your own weather if you can flip Drizzle.",
        "Fat Electric/Steel patches sit on Wave Crash; do not send Fire into the rain.",
        "Grassy + Fire pressure the bird and cut Earthquake cores they splash.",
      ],
    },
    staples: [
      {
        slug: "pelipper",
        role: "Drizzle setter",
        why: "Walks in, rain is up. The field is the plan — do not donate the bird.",
      },
      {
        slug: "basculegion-male",
        role: "Swift Swim cleaner",
        why: "Wave Crash under rain punches walls. The hole-maker once the field is live.",
      },
      {
        slug: "archaludon",
        role: "Special Steel",
        why: "Electro Shot twin and Electric answer. Rain without this is a Raichu gift.",
      },
      {
        slug: "rotom-wash",
        role: "Volt Absorb pivot",
        why: "Water/Electric that soaks Electric revenge and keeps pressure if the bird dies.",
      },
      {
        slug: "kilowattrel",
        role: "Rain Electric",
        why: "Fast Electric that still functions if you need to mirror Electric pressure.",
      },
      {
        slug: "gholdengo",
        role: "Ghost patch",
        why: "Special Steel that sits on status and covers holes Basculegion leaves.",
      },
    ],
    answers: [
      {
        slug: "raichu",
        why: "Fast Electric into every Water abuser while rain boosts nothing on your side.",
      },
      {
        slug: "kilowattrel",
        why: "Flying Electric that threatens Pelipper and Basculegion from the rain race.",
      },
      {
        slug: "hippowdon",
        why: "Sand overwrites rain pressure long-term; Ground hits Archaludon and Electric answers.",
      },
      {
        slug: "cinderace",
        why: "Fire into Pelipper when you can force dry or after weather flips.",
      },
      {
        slug: "charizard-mega-y",
        why: "Drought war — overwrite Drizzle and delete the bird with Fire.",
      },
      {
        slug: "rillaboom",
        why: "Terrain softens Earthquake; Grassy Glide races midgame while Fire partners pressure the setter.",
      },
    ],
  },

  sun: {
    playbook: {
      identity: [
        "Mega Charizard Y is setter and wincon in one slot.",
        "Drought walks in with the Mega — not a fourth Pokémon.",
        "Partners cover Rock and Water; they finish if Y dies.",
        "Thin margin: Rock/Water on their three ends the plan.",
      ],
      howItWins:
        "Lead Y if they cannot punish Drought; otherwise lead the patch and bring the Mega in after. Fire through Grass and Steel, Solar Beam without charge, Garchomp punches the Rock/Water answers that sit on Y. If the Mega goes down, the field usually goes with it — the rest of the three must close dry.",
      previewScript: [
        "Charizard-Mega-Y on the six = sun is the plan. Not a cute Mega on rain.",
        "Garchomp beside Y is the Ground twin for Rock and Water checks.",
        "Second Fire (Cinderace) means they keep pressure if Y is forced out.",
        "Count their Rock and Water brings — that is the entire matchup.",
        "Pelipper on their list means weather war; Drizzle overwrites Drought.",
      ],
      buildPriorities: [
        "Y is the engine. Do not splash Drought onto a different wincon.",
        "Slot two punches what Fire does not — Garchomp for Rock/Water.",
        "Slot three answers Rock or keeps Fire pressure (Cinderace, Archaludon).",
        "SP the Y races and the revenge you must outspeed after a KO.",
        "Accept thin margin: one Rock slide into Y and the field is gone.",
      ],
      vsScript: [
        "Rock and Water on the bring — Archaludon, Primarina, Hippowdon, Pelipper.",
        "Do not donate a free Drought turn; pressure Y on entry or force it out.",
        "Rain overwrites: Pelipper flips the field and wilts Fire.",
        "Faster glass and priority into the Mega before Drought matters (HO script).",
        "Chip Y; sun teams often cannot re-set if the Mega is gone.",
      ],
    },
    staples: [
      {
        slug: "charizard-mega-y",
        role: "Drought Mega",
        why: "Setter and wincon. Drought on entry. The other two exist to cover Rock and Water.",
      },
      {
        slug: "garchomp",
        role: "Ground twin",
        why: "Earthquake hits the Rock and Water answers that would sit on Y all match.",
      },
      {
        slug: "cinderace",
        role: "Second Fire",
        why: "Keeps Fire pressure if Y is forced out. Speed punch into Grass glue.",
      },
      {
        slug: "talonflame",
        role: "Priority Fire",
        why: "Gale Wings into Rillaboom and setters that threaten Y on send.",
      },
      {
        slug: "meowscarada",
        role: "Grass punch",
        why: "Flower Trick into Water answers and Hippowdon-shaped walls.",
      },
      {
        slug: "archaludon",
        role: "Rock/Electric sponge",
        why: "Special Steel that softens Electric revenge and pressures Water from the back.",
      },
    ],
    answers: [
      {
        slug: "pelipper",
        why: "Drizzle overwrites Drought. Water hits harder; Fire wilts.",
      },
      {
        slug: "hippowdon",
        why: "Sand + Rock/Ground pressure into Y; fat enough to soak a Fire hit.",
      },
      {
        slug: "primarina",
        why: "Water/Fairy that sits on Fire and threatens Dragons beside Y.",
      },
      {
        slug: "archaludon",
        why: "Special Steel/Rock answer that walls Flying and pressures from range.",
      },
      {
        slug: "excadrill",
        why: "Mold Breaker Rock/Ground into Y before Drought snowballs.",
      },
      {
        slug: "corviknight",
        why: "Fat Flying that soaks Fire less cleanly but forces Y to spend coverage; glue vs HO-sun hybrids.",
      },
    ],
  },

  grassy: {
    playbook: {
      identity: [
        "Rillaboom walks in — Grassy Terrain is the room.",
        "Grassy Glide goes first; Unburden partners cash the field.",
        "Earthquake from the other side is weaker under terrain.",
        "Still an engine three, not stall — pack Fire answers on preview.",
      ],
      howItWins:
        "Terrain on entry, Grassy Glide when the KO is there, then Sneasler and Kingambit cash the room. Unburden after the berry pops is the cleaner. Weaker Earthquakes is the hidden bonus against Chomp cores. If they kill Rillaboom you still have two attackers — if they forgot Fire, you snowball.",
      previewScript: [
        "Rillaboom must appear. No Boom, no room — Unburden partners are a bluff.",
        "Sneasler beside Boom = Unburden cleaner after the berry.",
        "Kingambit on grassy lists likes the softer Earthquake math.",
        "Count their Fire brings — Cinderace, Y, Talonflame end the engine on send.",
        "Balance-looking six with Boom is Grassy, not Good Stuff. Play the terrain.",
      ],
      buildPriorities: [
        "Rillaboom is mandatory. Build partners that like the room (Unburden, Dark truck).",
        "Sneasler or equivalent cleaner that cashes after terrain is up.",
        "Kingambit as the breaker that still punches if Boom dies.",
        "Respect Fire: do not lead Boom into Cinderace/Y without a plan.",
        "SP Glide races and Unburden Speed after the berry — that is your clock.",
      ],
      vsScript: [
        "Fire on the bring and click it into Rillaboom on send.",
        "Do not rely on Earthquake cores — terrain cuts the damage.",
        "KO Boom early; without terrain Unburden never starts cleanly.",
        "Faster priority and Mega pressure before Glide snowballs (HO script).",
        "Sun is the nightmare matchup — Drought Fire deletes the engine.",
      ],
    },
    staples: [
      {
        slug: "rillaboom",
        role: "Terrain setter",
        why: "Grassy Surge on entry. Glide goes first. The engine, not a stall piece.",
      },
      {
        slug: "sneasler",
        role: "Unburden cleaner",
        why: "Cashes terrain after the berry pops. Dire Claw finishes midrange lists.",
      },
      {
        slug: "kingambit",
        role: "Dark truck",
        why: "Likes weaker Earthquakes under terrain. Still punches if Boom is gone.",
      },
      {
        slug: "annihilape",
        role: "Rage Fist",
        why: "Bulky Fighting that stacks damage under a longer grassy midgame.",
      },
      {
        slug: "gholdengo",
        role: "Ghost patch",
        why: "Covers Dark-weak holes and sits on status while terrain does work.",
      },
      {
        slug: "whimsicott",
        role: "Speed support",
        why: "Tailwind or Encore support on grassy hybrids that still want a clock.",
      },
    ],
    answers: [
      {
        slug: "cinderace",
        why: "Fast Fire into Boom on send. Ends the engine before Unburden starts.",
      },
      {
        slug: "charizard-mega-y",
        why: "Drought Fire deletes Rillaboom and wilts the terrain story.",
      },
      {
        slug: "talonflame",
        why: "Gale Wings priority into Boom and Sneasler before Glide snowballs.",
      },
      {
        slug: "salamence-mega",
        why: "HO pressure that forces Boom out or KOs before the room matters.",
      },
      {
        slug: "primarina",
        why: "Special Fairy/Water that sits on Fighting/Dark trucks and threatens from range.",
      },
      {
        slug: "corviknight",
        why: "Fat Flying pivot that soaks Fighting and hands off into Fire revenge.",
      },
    ],
  },
};
