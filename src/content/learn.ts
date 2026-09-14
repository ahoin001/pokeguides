export const LEARN_HUBS = new Set(["roles", "archetypes"]);

export type LearnGroup = "build" | "play";

export type LearnBeat = {
  title: string;
  body: string;
};

export type LearnChapter = {
  slug: string;
  group: LearnGroup;
  title: string;
  lede: string;
  body: readonly string[];
  beats?: readonly LearnBeat[];
  href?: string;
  hrefLabel?: string;
};

export const LEARN: readonly LearnChapter[] = [
  {
    slug: "roles",
    group: "build",
    title: "What a Pokémon is for",
    lede: "A card is a job: support, breaker, speed, weather, or Mega. You build from the job, not the name.",
    body: [
      "Stats, typing, ability, and movepool decide the job. Nothing on the card says sweeper. Once you can name the job, you can see what the other two still need.",
    ],
  },
  {
    slug: "building",
    group: "build",
    title: "How you build a three",
    lede: "Win condition, then the Pokémon that lets it fire, then the patch for the hole those two share.",
    body: [
      "Beginners pick three Pokémon they like. Intermediate players pick a sentence first: this three wins if Kingambit gets a free Sucker Punch, or if rain stays up long enough for Basculegion to clean.",
      "That sentence is the win condition. Everything else exists to make that sentence true, or to keep you alive when it is not. If you cannot say it out loud, you have a list, not a team.",
    ],
    beats: [
      {
        title: "Name the win condition",
        body: "The Pokémon or mode that actually ends the match if the plan works. A Mega after a wall is gone. Kingambit after Attack is dropped. Basculegion once Pelipper has set rain. One sentence. If the sentence needs two win conditions, you are already asking the three to do too much.",
      },
      {
        title: "Add the Pokémon that lets it fire",
        body: "The partner is not a second favorite. It is the reason the win condition gets a turn: Intimidate so the breaker lives, a pivot so you leave on your terms, Trick Room so the slow truck moves first, Drizzle so Swift Swim is real. If that partner does not change a calculation for the win condition, cut it.",
      },
      {
        title: "Patch the hole those two share",
        body: "Garchomp and Kingambit both hate a special Fairy. That is the hole. Gholdengo is the patch: Ghost Steel, status immunity, a type the first two do not cover. On a three you cannot hide a shared weakness. If two of yours are weak to the same STAB, they will send that STAB. The third slot is where you decide whether that is a game or a loss.",
      },
      {
        title: "Mix physical and special",
        body: "If all three punch with Attack, a physical wall sits there all match. If all three punch with Special Attack, a special tank does the same. You do not need a perfect split. You need one Pokémon that hits the side the other two cannot. That is the offensive spectrum. Beginners copy three fast physical STABs. Intermediate players ask what still lives after Earthquake.",
      },
      {
        title: "Pack a Speed plan",
        body: "Every three needs an answer to a faster enemy: outrun them, priority them, flip the clock with Trick Room, or sit a wall that does not care who moves first. Tailwind still exists — Whimsicott can set it — but in singles it costs your turn, not a partner's. If your three has none of these, you are guessing every race. Read Speed after you can name the win condition.",
      },
    ],
    href: "/team",
    hrefLabel: "Put a three on the board",
  },
  {
    slug: "archetypes",
    group: "build",
    title: "How a three wants to play",
    lede: "Balance, Hyper Offense, Trick Room, rain, sun, Grassy. Same three slots. Different games.",
    body: [
      "An archetype is the plan, not the species list. Hyper Offense is a sprint. Balance is a chess match with a net. Weather and Trick Room are modes the rest of the three is built to cash.",
    ],
  },
  {
    slug: "preview",
    group: "play",
    title: "Preview is the first turn",
    lede: "They see your three. You see theirs. The first send is already a read, not a habit.",
    body: [
      "Open team lists mean the match starts before anyone moves. You are looking at three names and deciding which 1v1 you want, and which two you are willing to leave in the back.",
      "Beginners send their strongest Pokémon. Intermediate players send the Pokémon that answers their likely lead, or that forces the switch their win condition needs.",
    ],
    beats: [
      {
        title: "Ask three things",
        body: "Who is their win condition? Which of yours loses the 1v1 to it? What do they send first if they respect yours? You do not need their whole kit. You need the job of each name and the hole on their three.",
      },
      {
        title: "Pick the first send on purpose",
        body: "A good lead takes their lead, or makes them switch, or sets the field your other two cash. A bad lead donates a KO so you can feel aggressive. If your win condition is in the back, the lead's job is to get it in safely — not to prove it can 1v1 the format.",
      },
      {
        title: "Every switch after that is a read",
        body: "You have two in the back. They have two. A wasted switch is a Pokémon you will not get back. Stay in if you still threaten. Leave if the next hit KOs and you have the answer. Protect is a tempo tool for one turn, not a plan.",
      },
    ],
  },
  {
    slug: "speed",
    group: "play",
    title: "You race their whole list",
    lede: "3v3 is a Speed game. You are not racing the Pokémon in front of you. You are racing the three they brought.",
    body: [
      "Whoever moves first often decides the KO. On a three there is no partner Tailwind and no second mon to take the hit. If their fastest outruns your fastest and can OHKO it, that race is the match unless you packed priority, a Scarf, or a clock flip.",
      "You do not need the full ladder memorized. You need the three Speed numbers on their list against yours, and a plan for the one you lose.",
    ],
    beats: [
      {
        title: "The number",
        body: "Everyone is Level 50. 32 Stat Points in Speed is a statement. Choice Scarf is another. A Mega that jumps a Speed tier is a third. Read those as threats in preview, not surprises on turn two.",
      },
      {
        title: "The tools when you lose the number",
        body: "Priority: Sucker Punch, Aqua Jet, Fake Out, Extreme Speed. A clock: Trick Room, so the slow truck moves first for a few turns. Weather Speed: Swift Swim and Chlorophyll only count if the field is up. If your three has none of these and loses the raw race, you are guessing.",
      },
      {
        title: "Build the races you care about",
        body: "You cannot outrun everyone. Pick the Pokémon that must move first for your win condition to fire, and spend Speed there. Leave the rest on bulk or attack. A three that is 'kind of fast' loses to a three that chose its races.",
      },
    ],
    href: "/learn/roles/speed",
    hrefLabel: "The Speed job",
  },
  {
    slug: "holes",
    group: "play",
    title: "Holes, checks, and coverage",
    lede: "On a three you cannot hide a weakness. If two of yours share a hole, the match is already about that hole.",
    body: [
      "Type chart trivia is not the skill. The skill is seeing the STAB that hits two of yours, and knowing whether you have a switch or a prayer.",
      "That is why the third slot exists. It is also why open preview is brutal: they can see the hole before they send.",
    ],
    beats: [
      {
        title: "Shared weakness",
        body: "Write the type that super-effectives two names on your three. If you have no switch that takes that hit, rebuild. Garchomp plus Salamence is a Dragon hole. Pelipper plus Basculegion is an Electric hole. The patch has to be a real switch-in, not a Pokémon that also dies.",
      },
      {
        title: "Check versus counter",
        body: "A check can switch in and threaten. A counter switches in and wins for free. Beginners treat every resist as a counter. Intermediate players ask whether they still die to coverage, or lose the Speed race after they switch. If Kingambit switches into Garchomp and eats Earthquake plus a boost, that was not a counter.",
      },
      {
        title: "Coverage is the one move that hits what walls you",
        body: "Your STABs do the job most turns. The extra move is for the Pokémon that would sit there otherwise. You do not need four attacking types. You need the one your win condition cannot break. If the three still cannot make that Pokémon leave, you picked the wrong win condition.",
      },
    ],
    href: "/types",
    hrefLabel: "Open the type sheet",
  },
];

export function learnByGroup(group: LearnGroup) {
  return LEARN.filter((c) => c.group === group);
}

export function getChapter(slug: string) {
  return LEARN.find((c) => c.slug === slug);
}

export function chapterHref(chapter: LearnChapter) {
  return `/learn/${chapter.slug}` as const;
}
