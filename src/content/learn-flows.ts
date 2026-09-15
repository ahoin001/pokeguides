import type { FlowFork, ManualFlow } from "@/content/manuals";

function q(id: string, when: string, rest: Omit<FlowFork, "id" | "when"> = {}): FlowFork {
  return { id, when, ...rest };
}

export const LEARN_FLOWS: ManualFlow[] = [
  {
    id: "they-fake-out",
    title: "They Fake Out",
    lede: "Priority +3. It flinches. Ghost is immune. Armor Tail blanks it. Protect wastes their turn.",
    forks: [
      q("fo-ghost", "Ghost is in (Mimikyu, Gholdengo)", {
        then: "Stay. Fake Out does nothing. Click the KO or the Dance.",
        send: "mimikyu-disguised",
        why: "Ghost is immune. Do not switch away from a free turn.",
      }),
      q("fo-armor", "Farigiraf is in — Armor Tail", {
        then: "Stay. Priority fails. Trick Room or Psychic on the flinch they do not get.",
        send: "farigiraf",
        move: "Trick Room",
      }),
      q("fo-protect", "You can take the next hit, and they always Fake Out leads", {
        then: "Protect. They spent the turn. You did not flinch. Then punish.",
        move: "Protect",
        why: "Protect is +4. Fake Out is +3. You go first, they waste the flinch.",
      }),
      q("fo-cloak", "Covert Cloak on the lead", {
        then: "The flinch fails. Tailwind or attack. Cloak is the item that buys this.",
        send: "whimsicott",
        move: "Tailwind",
      }),
      q("fo-switch", "You cannot live the follow-up, and you are not Ghost", {
        then: "Hard switch now. Fake Out only flinches what is in the slot. The incoming Pokémon acts.",
        why: "A wasted switch is a Pokémon you will not get back. Switch if the next hit KOs.",
      }),
      q("fo-sash", "Focus Sash, and they Fake Out then KO", {
        then: "Sash lives the flinch. You still act this turn if the flinch missed, or next turn if it hit. Do not sit a second Fake Out.",
        send: "whimsicott",
      }),
    ],
  },
  {
    id: "they-protect",
    title: "They Protect",
    lede: "A scout, a stall of Sucker Punch, a turn of Tailwind. Not leftover farming.",
    forks: [
      q("pr-sucker", "You were about to Sucker Punch", {
        then: "Do not. Sucker Punch fails into Protect. Dance, switch, or a real attack next turn.",
        move: "Swords Dance",
        send: "kingambit",
        why: "Sucker Punch into Protect is a donated turn. Kingambit Dances instead.",
      }),
      q("pr-setup", "They are stalling for a Dance or Trick Room", {
        then: "You Protect too, or Taunt, or leave. Do not attack into a second Protect if the wincon is boosting behind it.",
        move: "Taunt",
        send: "whimsicott",
      }),
      q("pr-chip", "You need chip, not a KO this turn", {
        then: "U-turn or Parting Shot. Momentum out. They wasted Protect on a Pokémon that left.",
        move: "U-turn",
        send: "incineroar",
      }),
      q("pr-fake", "You have Fake Out and they just Protected", {
        then: "Fake Out next turn. Protect does not carry. The flinch is still +3.",
        move: "Fake Out",
        send: "incineroar",
      }),
      q("pr-waste", "You have no read and they like Protect", {
        then: "Click the attack that still wins if they stay. Do not Protect back unless the KO ends you. Double Protect is a 50/50 you do not need.",
        why: "Protect to farm recovery is a beginner trap. It donates a free switch.",
      }),
    ],
  },
  {
    id: "ice-onto-the-kite",
    title: "Ice onto the kite",
    lede: "Garchomp and Mega Salamence are 4× Ice. The patch is in the bag. Do not send the kite into Ice.",
    forks: [
      q("ice-garchomp-out", "Garchomp is out, Ice is coming", {
        then: "Leave. Corviknight takes Ice at 1×. Cott is 2×. Garchomp is 4×.",
        send: "corviknight",
        out: "garchomp",
      }),
      q("ice-mega-out", "Mega Salamence is out, Ice or Rock is coming", {
        then: "You already leaked the kite. Rillaboom takes Ice. Do not Extreme Speed a wall.",
        send: "rillaboom",
        out: "salamence-mega",
      }),
      q("ice-preview", "Ice is on their list, kite is your wincon", {
        then: "Do not lead the kite. Lead the patch. Bring the kite in after Ice is gone or locked.",
        send: "corviknight",
        why: "Never-leave: the cleaner stays in the bag until the answer is used up.",
      }),
      q("ice-choice", "They are Choice-locked into Ice", {
        then: "Now the kite can come in. Choice is a statement. You punish the lock.",
        send: "garchomp",
      }),
    ],
  },
  {
    id: "turns",
    title: "Lead, mid, late",
    lede: "Every game has three rooms. The lead buys the mid. The mid buys the late. The late is the wincon.",
    forks: [
      q("lead", "Lead — first send", {
        then: "Take their lead, or force the switch your wincon needs, or set the field. Do not donate a KO to feel aggressive.",
        forks: [
          q("lead-safe", "You do not know their lead", {
            then: "Safe lead: Incineroar Fake Out, Cott Tailwind, a pivot. Gather information. Do not lead Garchomp into Ice.",
            send: "incineroar",
            move: "Fake Out",
          }),
          q("lead-commit", "You can name their lead and your answer lives", {
            then: "Committed lead. Pressure it into a switch. If you are wrong, the mid has to salvage — have the backup send.",
            send: "whimsicott",
            move: "Taunt",
          }),
          q("lead-field", "Their wincon needs a field (rain, sun, TR, Tailwind)", {
            then: "Deny it turn one: Taunt the setter, Fake Out the clock, or set yours first.",
            send: "whimsicott",
            move: "Taunt",
          }),
        ],
      }),
      q("mid", "Mid — the hand-off", {
        then: "Trade, pivot, chip. Force the switch that lets the cleaner in. This is where 50/50s live.",
        forks: [
          q("mid-momentum", "You still threaten, they might switch", {
            then: "U-turn or Parting Shot. Leave on your terms. A hard switch is a turn they attack for free.",
            send: "incineroar",
            move: "Parting Shot",
          }),
          q("mid-never", "The never-leave is in, and they cannot KO it", {
            then: "Stay. Click the attack. Switching the wincon away because you got scared is how you lose the late.",
            send: "kingambit",
            why: "Never-leave: the Pokémon that must stay to close. Protect it in preview. Keep it in when it is winning.",
          }),
          q("mid-50", "You cannot know stay vs switch", {
            then: "Pick the line that loses less if you are wrong. Chip plus a pivot beats a heroic prediction into a KO.",
            why: "Seasoned players do not win 50/50s. They structure the turn so the wrong guess is cheap.",
          }),
          q("mid-overpredict", "You are guessing a double-switch because a video did", {
            then: "Click the attack that beats what is in front of you. Overprediction is the beginner tax.",
          }),
          q("mid-info", "They just revealed Choice, Sash, or a coverage move", {
            then: "Write it down. Choice is a lock you punish. Sash is one live. Coverage means the check is no longer a counter.",
            why: "Prediction is information plus a cheap wrong guess. You cannot predict what you have not seen.",
          }),
          q("mid-noko", "Your attack will not KO, and they KO you back", {
            then: "Do not farm. Switch, Protect, or pivot. Chip is correct only when the next hit does not end you.",
            send: "corviknight",
            move: "Protect",
          }),
        ],
      }),
      q("late", "Late — one or two left", {
        then: "The wincon fires. Clock, Shield, Clean is over. Click the KO. Protect is a scout for coverage, not a stall.",
        forks: [
          q("late-clean", "Their wall is gone, Garchomp or Dragonite is in", {
            then: "Earthquake or Extreme Speed. Tailwind and Disguise already bought this. Do not farm.",
            send: "garchomp",
            move: "Earthquake",
          }),
          q("late-risk", "A misclick loses the game", {
            then: "Risk/reward: if this Pokémon is your only answer to what they have left, do not donate it for chip. Switch or Protect, then KO.",
            send: "corviknight",
          }),
          q("late-update", "They did not lead what you previewed", {
            then: "Throw the old sentence out. Name a new one. Playing the preview after it died is how you donate two KOs.",
          }),
        ],
      }),
    ],
  },
];

export function getLearnFlow(id: string) {
  return LEARN_FLOWS.find((f) => f.id === id);
}
