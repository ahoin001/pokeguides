import { resolveFlows, type FlowFork, type ManualFlow, type TeamManual } from "@/content/manuals";

function q(id: string, when: string, rest: Omit<FlowFork, "id" | "when"> = {}): FlowFork {
  return { id, when, ...rest };
}

function out(id: string, slug: string, forks: FlowFork[]): FlowFork {
  return q(id, "This Pokémon is out", { out: slug, forks });
}

const HONEST: ManualFlow[] = [
  {
    id: "lead",
    title: "Lead",
    lede: "Cott unless it dies on send. Tailwind is +1. Then switch — not U-turn.",
    forks: [
      q("h-live", "Cott lives the send", {
        then: "Lead Whimsicott. Clock, then leave.",
        send: "whimsicott",
        forks: [
          q("h-tw", "Corvi or Garchomp need the race", { then: "Tailwind. Then switch or one Moonblast.", move: "Tailwind", send: "whimsicott" }),
          q("h-encore", "They Protect or set up, not Dark", { then: "Encore. Next turn Tailwind or leave.", move: "Encore", send: "whimsicott" }),
          q("h-dark", "Dark in", { then: "Moonblast or switch. Never Encore. Never Taunt.", move: "Moonblast", send: "whimsicott" }),
          q("h-fd", "Fighting or Dragon in", { then: "Moonblast. Fairy STAB, then leave unless the clock is still the plan.", move: "Moonblast", send: "whimsicott" }),
          q("h-tr", "Trick Room setter, not Dark", { then: "Taunt. The room does not go up.", move: "Taunt", send: "whimsicott" }),
          q("h-poison", "Poison STAB coming", { then: "Corvi now. Cott is 4×.", send: "corviknight" }),
          q("h-fire", "Fire STAB coming", { then: "Garchomp. Corvi is also 2× Fire.", send: "garchomp" }),
          q("h-ice", "Ice or Flying coming", { then: "Corvi. Cott is 2× both. Ice is 1× on Corvi, not a resist.", send: "corviknight" }),
          q("h-elec", "Electric coming", { then: "Stay or Tailwind. Grass resists. Garchomp is the later immune.", send: "whimsicott" }),
        ],
      }),
      q("h-die", "Cott dies to the lead (Poison 4×, Fire, Fake Out into KO)", {
        then: "Corvi first. Clock later.",
        send: "corviknight",
        why: "Not a second default. Emergency only.",
      }),
      q("h-fast", "They outrun Garchomp", { then: "Tailwind turn one. The race is the whole plan.", move: "Tailwind", send: "whimsicott" }),
    ],
  },
  {
    id: "mid",
    title: "Mid",
    lede: "Slow U-turn, stay on the wall, or re-up the clock. Fast U-turn under Tailwind is Ice on Garchomp.",
    forks: [
      out("h-mid-corvi", "corviknight", [
        q("h-mid-c1", "Had to lead Corvi", { then: "Take the hit. Slow U-turn later. Clock is still in the bag.", send: "corviknight" }),
        q("h-mid-c2", "Locked into a physical resist, no KO this turn", { then: "Stay. Roost, Press, or Iron Defense. The wall can win.", move: "Roost", send: "corviknight" }),
        q("h-mid-c3", "Want Garchomp, and you are slower or they switched", { then: "U-turn. They hit Corvi, then Chomp is in.", move: "U-turn", send: "garchomp" }),
        q("h-mid-c4", "Want Garchomp, but you outspeed Ice", { then: "Do not U-turn. Fast U-turn delivers Ice into Garchomp.", why: "116 Spe plus Tailwind. Switch instead." }),
        q("h-mid-c5", "Grass in", { then: "Brave Bird. Recoil is the tax. Do not Earthquake Grass.", move: "Brave Bird", send: "corviknight" }),
        q("h-mid-c6", "Fire or Electric onto Corvi", { then: "Garchomp. Resists Fire. Immune to Electric.", send: "garchomp" }),
      ]),
      out("h-mid-chomp", "garchomp", [
        q("h-mid-g1", "Ice or Fairy onto Garchomp", { then: "Corvi. Fairy resists. Ice is 1× — Roost after.", send: "corviknight" }),
        q("h-mid-g2", "Water onto Garchomp", { then: "Optional Cott or Corvi (both resist). Chomp is 1× Water, not 2×.", send: "whimsicott" }),
      ]),
      out("h-mid-cott", "whimsicott", [
        q("h-mid-w1", "Tailwind dying, still need Speed", { then: "Cott back in. Re-up before it fades.", move: "Tailwind", send: "whimsicott" }),
      ]),
    ],
  },
  {
    id: "late",
    title: "Late",
    lede: "One target. No spread fantasy. Tailwind is four turns including the click.",
    forks: [
      out("h-late-chomp", "garchomp", [
        q("h-late-g1", "Grounded, not Grass", { then: "Earthquake. Take the KO.", move: "Earthquake", send: "garchomp" }),
        q("h-late-g2", "Flying or Levitate", { then: "Stone Edge or Dragon STAB. EQ is a zero.", move: "Stone Edge", send: "garchomp" }),
        q("h-late-g3", "You read Protect", { then: "Swords Dance. Next hit is the KO.", move: "Swords Dance", send: "garchomp" }),
        q("h-late-g4", "Need to scout Ice or Fairy", { then: "Protect. Not on Tailwind's last turns.", move: "Protect", send: "garchomp" }),
        q("h-late-g5", "Fairy is gone, you need the nuke", { then: "Outrage. You lock. Do not click it into Fairy.", move: "Outrage", send: "garchomp" }),
        q("h-late-g6", "Ice or Fairy still in", { then: "Corvi if alive. Else you donated the 4× / 2×.", send: "corviknight" }),
        q("h-late-g7", "Cott dead, they still outrun", { then: "Scale Shot. Coverage that KOs after they move.", move: "Scale Shot", send: "garchomp" }),
      ]),
      out("h-late-corvi", "corviknight", [
        q("h-late-c1", "Grass still up", { then: "Brave Bird. Do not send Garchomp to EQ it.", move: "Brave Bird", send: "corviknight" }),
      ]),
    ],
  },
];

const CONTROL: ManualFlow[] = [
  {
    id: "lead",
    title: "Lead",
    lede: "Fake Out and Tailwind are never the same turn. One send.",
    forks: [
      q("c-cat", "Physical Incineroar lives", {
        then: "Lead the cat. Fake Out, then Blitz or Parting Shot.",
        send: "incineroar",
        forks: [
          q("c-fo", "They can KO or set up", { then: "Fake Out. Next is Parting Shot or Blitz.", move: "Fake Out", send: "incineroar" }),
          q("c-ghost", "Ghost in", { then: "Snarl, Will-O-Wisp, or Parting Shot. Never Fake Out.", move: "Snarl", send: "incineroar" }),
          q("c-cloak", "Cloak / Inner Focus", { then: "Expect their attack. Parting Shot before KO range.", move: "Parting Shot", send: "incineroar" }),
          q("c-dark", "Dark setup or Protect", { then: "Taunt. Cott Encore is illegal on Dark.", move: "Taunt", send: "incineroar" }),
          q("c-burn", "Physical still hitting", { then: "Will-O-Wisp, then Parting Shot. Burn plus Intimidate plus −6.", move: "Will-O-Wisp", send: "incineroar" }),
          q("c-blitz", "Grass or Steel, Blitz KOs", { then: "Fake Out if needed, then Flare Blitz. Recoil is the tax.", move: "Flare Blitz", send: "incineroar" }),
        ],
      }),
      q("c-cott", "They outrun Garchomp, Cott lives", {
        then: "Cott first. Fake Out waits.",
        send: "whimsicott",
        forks: [
          q("c-tw", "Garchomp needs the race", { then: "Tailwind. Fake Out already happened or waits.", move: "Tailwind", send: "whimsicott" }),
          q("c-en", "Protect or setup, not Dark", { then: "Encore. Fake Out later — not this turn.", move: "Encore", send: "whimsicott" }),
          q("c-fight", "Fighting lead, not Poison", { then: "Moonblast. Incineroar is 2× Fighting.", move: "Moonblast", send: "whimsicott" }),
        ],
      }),
      q("c-sneas", "Sneasler / Fighting-Poison", { then: "Garchomp. Cott is 4× Poison.", send: "garchomp" }),
      q("c-water", "Water or Ground lead", { then: "Cott. Do not bodyguard a Waterfall.", send: "whimsicott" }),
      q("c-fairy", "Fairy lead", { then: "Cott Moonblast. Tinkaton is Flare Blitz (Fairy/Steel is 2× Fire).", move: "Moonblast", send: "whimsicott" }),
    ],
  },
  {
    id: "mid",
    title: "Mid",
    lede: "Parting Shot is −6: they hit the cat, then Garchomp is in. Gholdengo blanks the −6.",
    forks: [
      out("c-mid-cat", "incineroar", [
        q("c-mid-i1", "Slot safe after Intimidate", { then: "Parting Shot into Garchomp.", move: "Parting Shot", send: "garchomp" }),
        q("c-mid-i2", "Blitz KO is there", { then: "Stay. Take it. Pivot next send.", move: "Flare Blitz", send: "incineroar" }),
        q("c-mid-i3", "Water, Ground, Fighting, or Rock threaten", { then: "Leave before KO. −6 does not save 0 HP.", send: "whimsicott" }),
        q("c-mid-i4", "Ice onto predicted Garchomp", { then: "Stay. Fire resists Ice. Garchomp is 4×.", send: "incineroar" }),
        q("c-mid-i5", "Gholdengo in", { then: "Snarl. Fake Out is Normal. Taunt, burn, and Parting Shot fail on Good as Gold.", move: "Snarl", send: "incineroar" }),
        q("c-mid-i6", "Mirror Armor Corvi", { then: "Intimidate bounces. Fake Out and Fire still work.", move: "Fake Out", send: "incineroar" }),
        q("c-mid-i7", "Fake Out spent, slot still ugly", { then: "Leave and come back. Refresh the flinch.", send: "whimsicott" }),
      ]),
      out("c-mid-cott", "whimsicott", [
        q("c-mid-w1", "Fairy in", { then: "Moonblast. Do not Parting Shot Garchomp into Fairy.", move: "Moonblast", send: "whimsicott" }),
      ]),
      out("c-mid-chomp", "garchomp", [
        q("c-mid-g1", "Fairy onto Garchomp", { then: "Cott. Both cat and Chomp are 2× Fairy.", send: "whimsicott" }),
      ]),
    ],
  },
  {
    id: "late",
    title: "Late",
    lede: "One target. Grass is the cat. Ice is the cat. Fairy is Cott.",
    forks: [
      out("c-late-chomp", "garchomp", [
        q("c-late-g1", "Grounded, not Grass", { then: "Earthquake. One target.", move: "Earthquake", send: "garchomp" }),
        q("c-late-g2", "Flying or Levitate", { then: "Stone Edge or Dragon STAB.", move: "Stone Edge", send: "garchomp" }),
        q("c-late-g3", "Protect", { then: "Swords Dance.", move: "Swords Dance", send: "garchomp" }),
        q("c-late-g4", "Ice onto Garchomp", { then: "Cat. Fire resists.", send: "incineroar" }),
        q("c-late-g5", "Fairy onto Garchomp", { then: "Cott. Moonblast.", send: "whimsicott" }),
      ]),
      out("c-late-cat", "incineroar", [
        q("c-late-i1", "Grass still in", { then: "Flare Blitz if the cat lives. Do not EQ Grass.", move: "Flare Blitz", send: "incineroar" }),
        q("c-late-i2", "Cott dead, they still outrun", { then: "Fake Out refresh or Scale Shot on Garchomp.", move: "Fake Out", send: "incineroar" }),
      ]),
    ],
  },
];

const GRASSY: ManualFlow[] = [
  {
    id: "lead",
    title: "Lead",
    lede: "Terrain on entry. One Fake Out per turn. The Mega is almost never the first send.",
    forks: [
      q("g-boom", "Physical Boom lives", {
        then: "Lead Rillaboom. Fake Out, then U-turn or Glide.",
        send: "rillaboom",
        forks: [
          q("g-fo", "They KO / set up / Tailwind", { then: "Fake Out. Next is U-turn or Glide.", move: "Fake Out", send: "rillaboom" }),
          q("g-ghost", "Ghost in", { then: "U-turn or Wood Hammer. Fake Out is Normal.", move: "Wood Hammer", send: "rillaboom" }),
          q("g-glide", "Glide KO is there", { then: "Grassy Glide. Be aggressive. Do not U-turn a free KO.", move: "Grassy Glide", send: "rillaboom" }),
          q("g-uturn", "Want Sneasler in", { then: "U-turn only if slower, they switched, or not Flying/Psychic.", move: "U-turn", send: "sneasler" }),
        ],
      }),
      q("g-fire", "Fire lead", { then: "Mega Salamence. Dragon resists Fire. Boom is 2×.", send: "salamence-mega" }),
      q("g-ice", "Ice on their three", { then: "Boom is the Ice switch. Never the Mega (4× Ice).", send: "rillaboom" }),
      q("g-fairy", "Fairy on their three", { then: "Sneasler after terrain. Dire Claw.", send: "sneasler" }),
      q("g-armor", "Indeedee / Farigiraf", { then: "Priority is off. Wood Hammer, Dire Claw, Double-Edge.", why: "Armor Tail and Psychic Terrain blank Fake Out and Glide." }),
      q("g-dark", "Kingambit or Incineroar", { then: "Fake Out, then Close Combat on Sneasler. Incineroar is 2×. Kingambit is 1× Dark/Steel.", send: "sneasler" }),
    ],
  },
  {
    id: "mid",
    title: "Mid",
    lede: "Seed pops on terrain. Unburden is one burst. Hide the Mega until Ice and Rock are gone.",
    forks: [
      out("g-mid-sneas", "sneasler", [
        q("g-mid-s1", "Entered on terrain with Seed", { then: "Dire Claw Fairy. Close Combat Dark/Steel. Spend the doubled Speed.", move: "Dire Claw", send: "sneasler" }),
        q("g-mid-s2", "Psychic or Flying onto Sneasler", { then: "Leave. Boom takes Psychic. Mega takes Flying.", send: "rillaboom" }),
        q("g-mid-s3", "Unburden spent, Ice gone", { then: "Mega. Intimidate, then Mega, then Double-Edge.", send: "salamence-mega" }),
      ]),
      out("g-mid-boom", "rillaboom", [
        q("g-mid-b1", "Fire onto Boom", { then: "Mega Salamence. Dragon resists Fire.", send: "salamence-mega" }),
        q("g-mid-b2", "Steel sitting on Dire Claw", { then: "Wood Hammer. Steel laughs at Poison.", move: "Wood Hammer", send: "rillaboom" }),
        q("g-mid-b3", "Armor Tail still in", { then: "Stop Fake Out and Glide. Wood Hammer raw.", move: "Wood Hammer", send: "rillaboom" }),
      ]),
      out("g-mid-mega", "salamence-mega", [
        q("g-mid-m1", "Ice onto the Mega", { then: "Rillaboom. 4× Ice is the hole.", send: "rillaboom" }),
        q("g-mid-m2", "Rock onto the Mega", { then: "Sneasler. Fighting resists Rock.", send: "sneasler" }),
      ]),
    ],
  },
  {
    id: "late",
    title: "Late",
    lede: "Aerilate Double-Edge is the STAB. Terrain cuts your own Earthquake.",
    forks: [
      out("g-late-mega", "salamence-mega", [
        q("g-late-m1", "Not Steel, Ice already gone", { then: "Double-Edge. One target. Aerilate Flying.", move: "Double-Edge", send: "salamence-mega" }),
        q("g-late-m2", "Steel or Fire resists Flying", { then: "Earthquake if terrain is down. Dragon Claw if it is up — terrain cuts Ground.", move: "Earthquake", send: "salamence-mega" }),
        q("g-late-m3", "Protect", { then: "Dragon Dance. Do not recoil the shield.", move: "Dragon Dance", send: "salamence-mega" }),
        q("g-late-m4", "Ice onto Mega", { then: "Rillaboom.", send: "rillaboom" }),
        q("g-late-m5", "Fairy onto Mega", { then: "Sneasler Dire Claw.", send: "sneasler" }),
      ]),
      out("g-late-sneas", "sneasler", [
        q("g-late-s1", "Boom dead, terrain down, Seed still held", { then: "Seed will not pop. Play 120. Mega is Speed.", send: "salamence-mega" }),
      ]),
    ],
  },
];

const RAIN: ManualFlow[] = [
  {
    id: "lead",
    title: "Lead",
    lede: "Drizzle is on Pelipper's entry. Electro Shot is not a charge. One send — rain is not a partner Tailwind.",
    forks: [
      q("r-fire", "Fire lead, no Electric", {
        then: "Pelipper. Rain cuts Fire. Hurricane Fighting/Grass.",
        send: "pelipper",
        forks: [
          q("r-rain", "Rain just went up", { then: "Hurricane or Weather Ball. U-turn if Archaludon wants the next click.", move: "Hurricane", send: "pelipper" }),
          q("r-elec", "Electric in", { then: "Leave now. Archaludon. Pelipper is 4× Electric.", send: "archaludon" }),
          q("r-grass", "Grass in", { then: "Leave to Archaludon. Both Waters are 2× Grass. Archaludon is ¼.", send: "archaludon" }),
        ],
      }),
      q("r-fast-e", "Fast Electric (Raichu, Kilowattrel)", { then: "Archaludon. Never Pelipper into 4×.", send: "archaludon" }),
      q("r-rilla", "Grass / Rillaboom", { then: "Archaludon. Do not send either Water.", send: "archaludon" }),
      q("r-y", "Mega Charizard Y on their three", { then: "Do not gift Pelipper into Drought + Heat Wave. Archaludon, or wait the Mega out.", send: "archaludon" }),
      q("r-gambit", "Kingambit", { then: "Electro Shot is 1×. Hurricane and Wave Crash are ½ on Dark/Steel. Chip, do not assume a 2×.", send: "archaludon" }),
    ],
  },
  {
    id: "mid",
    title: "Mid",
    lede: "Last weather ability wins. Y overwrite on switch-in kills Swift Swim.",
    forks: [
      out("r-mid-arch", "archaludon", [
        q("r-mid-a1", "Rain up, Archaludon healthy", { then: "Electro Shot. It fires this turn. Not a charge.", move: "Electro Shot", send: "archaludon" }),
        q("r-mid-a2", "Sun went up", { then: "You lost the engine. Draco or leave. Electro Shot charges again.", move: "Draco Meteor", send: "archaludon" }),
      ]),
      out("r-mid-peli", "pelipper", [
        q("r-mid-p1", "Electric onto Pelipper", { then: "Archaludon.", send: "archaludon" }),
        q("r-mid-p2", "Grass onto Waters", { then: "Archaludon. Steel/Dragon resists Grass.", send: "archaludon" }),
        q("r-mid-p3", "Drought Mega comes in", { then: "If you move first, KO it. If not, rain is gone — Basc is no longer Swift Swim.", send: "pelipper" }),
      ]),
      out("r-mid-basc", "basculegion-male", [
        q("r-mid-b1", "Partner already fainted", { then: "Last Respects. That is the closer.", move: "Last Respects", send: "basculegion-male" }),
        q("r-mid-b2", "Rain fading, still need a KO", { then: "Aqua Jet or Wave Crash while it lasts. Damp Rock bought you this turn.", move: "Aqua Jet", send: "basculegion-male" }),
      ]),
    ],
  },
  {
    id: "late",
    title: "Late",
    lede: "Swift Swim is not a personality. No rain, no Basc race.",
    forks: [
      out("r-late-basc", "basculegion-male", [
        q("r-late-b1", "Rain up, they are grounded", { then: "Wave Crash. One target. Recoil plus Orb will KO you — take the KO.", move: "Wave Crash", send: "basculegion-male" }),
        q("r-late-b2", "They Protect", { then: "Do not recoil Wave Crash. Aqua Jet or wait.", move: "Aqua Jet", send: "basculegion-male" }),
        q("r-late-b3", "Rain gone", { then: "Aqua Jet or Last Respects. Do not pretend Swift Swim is up.", move: "Aqua Jet", send: "basculegion-male" }),
      ]),
      out("r-late-arch", "archaludon", [
        q("r-late-a1", "Rain up, they sit on Water", { then: "Electro Shot. One target.", move: "Electro Shot", send: "archaludon" }),
        q("r-late-a2", "Electric still in", { then: "Stay. Both Waters die to Electric.", send: "archaludon" }),
      ]),
    ],
  },
];

const ROOM: ManualFlow[] = [
  {
    id: "lead",
    title: "Lead",
    lede: "Farigiraf is the Fake Out lead. Gholdengo is the Taunt lead. Kingambit should not be here yet.",
    forks: [
      q("t-fo", "Fake Out lead (Incineroar, Rillaboom, Sneasler)", {
        then: "Farigiraf. Armor Tail blanks the flinch. Then Trick Room.",
        send: "farigiraf",
        forks: [
          q("t-blank", "They Fake Out", { then: "It fails. Trick Room.", move: "Trick Room", send: "farigiraf" }),
          q("t-herb", "They Taunt, you have Herb", { then: "Herb eats it. Trick Room.", move: "Trick Room", send: "farigiraf" }),
          q("t-noherb", "They Taunt, no Herb", { then: "You lost the click. Psychic or leave to Gholdengo.", move: "Psychic", send: "gholdengo" }),
        ],
      }),
      q("t-taunt", "Taunt look (Whimsicott, Grimmsnarl)", { then: "Mental Herb on Farigiraf, or lead Gholdengo. Good as Gold blanks Taunt.", send: "gholdengo" }),
      q("t-fight", "Fighting lead", { then: "Gholdengo. Ghost immune. Not Kingambit — Fighting is 1× on the truck, not a resist.", send: "gholdengo" }),
      q("t-fire", "Fire or Ground", { then: "Farigiraf. Both Steels are 2×.", send: "farigiraf" }),
      q("t-mirror", "They are also Trick Room", { then: "Speed tie on the room. Faster setter or Taunt. Do not assume yours sticks.", send: "farigiraf" }),
      q("t-tw", "Tailwind HO", { then: "Farigiraf. Flip the clock. Their Tailwind is inverted.", send: "farigiraf" }),
    ],
  },
  {
    id: "mid",
    title: "Mid",
    lede: "The four turns are the match. Count them — including the click.",
    forks: [
      out("t-mid-truck", "kingambit", [
        q("t-mid-k1", "Room up", { then: "Kowtow or Dance. Move first. Be aggressive.", move: "Kowtow Cleave", send: "kingambit" }),
        q("t-mid-k2", "They switch to Fighting", { then: "Gholdengo. Ghost immune. Fighting is 1× on Kingambit — not free, not death.", send: "gholdengo" }),
        q("t-mid-k3", "A partner fainted", { then: "Overlord is live. Spend the remaining turns.", move: "Kowtow Cleave", send: "kingambit" }),
      ]),
      out("t-mid-gold", "gholdengo", [
        q("t-mid-g1", "Room up, Fighting in", { then: "Make It Rain or Shadow Ball. You are immune.", move: "Make It Rain", send: "gholdengo" }),
        q("t-mid-g2", "Taunt or Parting Shot", { then: "It fails. Make It Rain or Nasty Plot. Fake Out still hits you — Good as Gold does not blank attacks.", move: "Make It Rain", send: "gholdengo" }),
      ]),
      out("t-mid-fari", "farigiraf", [
        q("t-mid-f1", "They switch to Fire", { then: "Stay. Both Steels are 2× Fire.", send: "farigiraf" }),
        q("t-mid-f2", "Room on last turn", { then: "KO now or re-set next. Do not waffle.", move: "Psychic", send: "farigiraf" }),
      ]),
    ],
  },
  {
    id: "late",
    title: "Late",
    lede: "Room down is a Speed race. Sucker Punch if they attack. Dance if they Protect.",
    forks: [
      out("t-late-truck", "kingambit", [
        q("t-late-k1", "Room still up, one of theirs left", { then: "Kowtow. Close.", move: "Kowtow Cleave", send: "kingambit" }),
        q("t-late-k2", "Room down, they outrun the truck", { then: "Sucker Punch if they attack.", move: "Sucker Punch", send: "kingambit" }),
        q("t-late-k3", "They Protect", { then: "Swords Dance. Do not Sucker Punch the shield.", move: "Swords Dance", send: "kingambit" }),
        q("t-late-k4", "Room is not up and you led the truck", { then: "You misread. Protect or Sucker Punch. Get Farigiraf in.", send: "farigiraf" }),
      ]),
      out("t-late-gold", "gholdengo", [
        q("t-late-g1", "Room down, Fighting still in", { then: "Stay. Ghost immune.", send: "gholdengo" }),
      ]),
      out("t-late-fari", "farigiraf", [
        q("t-late-f1", "Room down, still slow", { then: "Re-set. The match is another four turns or you lose the race.", move: "Trick Room", send: "farigiraf" }),
      ]),
    ],
  },
];

const SUN: ManualFlow[] = [
  {
    id: "lead",
    title: "Lead",
    lede: "Y is 4× Rock. Y and Cinderace are 2× Water. Garchomp is 1× Water — still not a Water resist.",
    forks: [
      q("s-grass", "Grass / Rillaboom lead", {
        then: "Y. Drought, Heat Wave. Glide is Fire-weak.",
        send: "charizard-mega-y",
        forks: [
          q("s-sun", "Sun just went up", { then: "Heat Wave or Solar Beam. Take the KO.", move: "Heat Wave", send: "charizard-mega-y" }),
          q("s-rock", "Rock in", { then: "Leave to Garchomp now. Y is 4× Rock.", send: "garchomp" }),
          q("s-water", "Water in", { then: "Solar Beam if sun is up, then leave. Y is 2× Water.", move: "Solar Beam", send: "charizard-mega-y" }),
          q("s-rain", "Rain overwrote sun", { then: "Re-send Y later to steal weather, or play Garchomp/Cinderace raw. Solar Beam charges.", send: "garchomp" }),
        ],
      }),
      q("s-steel", "Steel / Kingambit", { then: "Y Heat Wave (Fire is 2× on Kingambit). High Jump Kick is 1× Fighting — the miss-tax, not the type crush.", send: "charizard-mega-y" }),
      q("s-rocklead", "Rock lead", { then: "Garchomp. Never Y.", send: "garchomp" }),
      q("s-peli", "Water / Pelipper", { then: "Do not lead Y. If you must fight rain, send Y only to overwrite — you still take Water.", send: "garchomp" }),
      q("s-elec", "Electric lead", { then: "Garchomp. Immune.", send: "garchomp" }),
      q("s-ice", "Ice lead", { then: "Cinderace. You resist. Garchomp is 4×. Y is 1× Ice.", send: "cinderace" }),
      q("s-drought", "They also have Drought", { then: "Last weather wins. Speed on the Mega or you play their sun.", send: "charizard-mega-y" }),
    ],
  },
  {
    id: "mid",
    title: "Mid",
    lede: "Garchomp is the Rock patch. Nobody resists Water. Solar Beam only while sun lasts.",
    forks: [
      out("s-mid-y", "charizard-mega-y", [
        q("s-mid-y1", "Sun up, Grass or Steel in", { then: "Heat Wave. Be aggressive.", move: "Heat Wave", send: "charizard-mega-y" }),
        q("s-mid-y2", "Rock onto Y", { then: "Garchomp immediately.", send: "garchomp" }),
        q("s-mid-y3", "Water in", { then: "Solar Beam if sun is still up. Else chip and do not sit.", move: "Solar Beam", send: "charizard-mega-y" }),
        q("s-mid-y4", "Electric onto Y", { then: "Garchomp. Immune.", send: "garchomp" }),
      ]),
      out("s-mid-ace", "cinderace", [
        q("s-mid-c1", "Sun is up", { then: "Pyro Ball. Libero Fire.", move: "Pyro Ball", send: "cinderace" }),
        q("s-mid-c2", "Ice in", { then: "Stay. You resist. Garchomp is 4×. Y is 1× Ice.", move: "Pyro Ball", send: "cinderace" }),
        q("s-mid-c3", "Y fainted, sun fading", { then: "Pyro Ball. Sucker Punch if they outrun.", move: "Sucker Punch", send: "cinderace" }),
      ]),
      out("s-mid-chomp", "garchomp", [
        q("s-mid-g1", "Rock in", { then: "Earthquake. You patched.", move: "Earthquake", send: "garchomp" }),
        q("s-mid-g2", "They Protect", { then: "Swords Dance. Do not Solar Beam the shield.", move: "Swords Dance", send: "garchomp" }),
      ]),
    ],
  },
  {
    id: "late",
    title: "Late",
    lede: "Libero is the click's type. Do not High Jump Kick a Ghost. Solar Beam without sun charges.",
    forks: [
      out("s-late-y", "charizard-mega-y", [
        q("s-late-y1", "Sun up, they cannot Rock you", { then: "Heat Wave. Close.", move: "Heat Wave", send: "charizard-mega-y" }),
        q("s-late-y2", "Sun gone", { then: "Do not Solar Beam — it charges. Leave or chip Fire.", send: "cinderace" }),
        q("s-late-y3", "Water still in", { then: "Solar Beam only if sun is up. Otherwise you are fishing.", move: "Solar Beam", send: "charizard-mega-y" }),
      ]),
      out("s-late-ace", "cinderace", [
        q("s-late-c1", "Y dead, one of theirs left", { then: "Pyro Ball. One target.", move: "Pyro Ball", send: "cinderace" }),
        q("s-late-c2", "Sun gone", { then: "Sucker Punch or High Jump Kick. Pyro Ball is slower Fire. Do not HJK a Ghost.", move: "Sucker Punch", send: "cinderace" }),
      ]),
      out("s-late-chomp", "garchomp", [
        q("s-late-g1", "Y dead, grounded leftover", { then: "Earthquake. One target.", move: "Earthquake", send: "garchomp" }),
      ]),
    ],
  },
];

const FLOWS: Record<string, ManualFlow[]> = {
  "balance-whimsicott-corviknight-garchomp": HONEST,
  "balance-whimsicott-incineroar-garchomp": CONTROL,
  "grassy-rillaboom-sneasler-salamence-mega": GRASSY,
  "rain-pelipper-archaludon-basculegion": RAIN,
  "trick-room-farigiraf-kingambit-gholdengo": ROOM,
  "sun-charizard-y-garchomp-cinderace": SUN,
};

export function flowsFor(manual: TeamManual): ManualFlow[] {
  const authored = (manual.flows ?? []).filter((f) => f.forks.length);
  if (authored.length) return authored;
  return FLOWS[manual.id] ?? resolveFlows(manual);
}
