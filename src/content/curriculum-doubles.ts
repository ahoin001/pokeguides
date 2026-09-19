import {
  getLesson,
  lessonHref,
  type Lesson,
  type LessonBand,
} from "@/content/curriculum";
import { manualsHref } from "@/lib/format";

export const DOUBLES_BAND_FIRST: Record<LessonBand, string> = {
  "poke-ball": "the-doubles-fight",
  "great-ball": "doubles-archetypes",
  "ultra-ball": "doubles-preview",
  "master-ball": "doubles-positioning",
};

export const DOUBLES_BAND_SKIP: Record<LessonBand, string> = {
  "poke-ball": "Skip if you already pick four and think in pairs.",
  "great-ball": "Skip if perish, dual Mega, and Tailwind pairing already click.",
  "ultra-ball": "Skip if you already lock a must-bring and draft four into both cores.",
  "master-ball": "Skip if you already steal weather and cover a charge. Then review.",
};

export const DOUBLES_LESSONS: Lesson[] = [
  {
    slug: "the-doubles-fight",
    band: "poke-ball",
    track: "doubles",
    title: "Two on the field",
    thesis: "Six names. Pick four. Two Pokémon out. Protect is a pair verb. Fake Out still costs one action.",
    skipIf: "Skip if you already pick four and think in pairs, not in a single slot.",
    body: [
      "This track is Champions doubles as the ladder video teaches it: a six-Pokémon list, you bring four, two are out. Ringside’s Team, manuals, and Ranked Meta stay 3v3 singles. The after-battle skills — review, keeping up — are the same. Come back to Master Ball when you are done here.",
      "Your turn is two actions. Fake Out on one slot does not flinch both. Protect on one does not save the partner. Switching one is a turn the other still has to click something. There is a partner to click Protect for you. That is the whole difference.",
    ],
    rules: [
      { label: "Format", detail: "Bring 4 · two on the field" },
      { label: "List", detail: "Six registered · leave two in the bag" },
      { label: "Actions", detail: "Two clicks per turn — one per slot" },
      { label: "Fake Out", detail: "Flinches one target, once per send" },
      { label: "Protect", detail: "Pair verb — both can stall a timer" },
      { label: "Mega", detail: "One Mega this battle · dual stone = preview choice" },
    ],
    beats: [
      {
        title: "Pick four from six",
        body: "Preview is a draft. You leave two in the bag. The four you bring have to answer both of their modes, not look like your favorite six. If two of your four only work in rain and they brought sun, you drafted wrong.",
        example: { slug: "politoed", caption: "On the list. Not automatically in the four." },
      },
      {
        title: "Two targets, one Fake Out",
        body: "Fake Out still flinches one Pokémon, once per send. Ghost still immune. Armor Tail still blanks it. The partner is free to attack, Protect, or set Tailwind while you flinch. That is why Incineroar is a doubles job, not just a singles pivot.",
        example: { slug: "incineroar", caption: "Fake Out one slot. The partner sets or KOs." },
      },
      {
        title: "Protect is how pairs stall",
        body: "In singles, consecutive Protect is a 50/50 you rarely need. In doubles, double Protect — both Pokémon Protect the same turn — is how perish trap and Trick Room stall timers. It can fail if you spam it. It is still a pair verb, not leftover farming.",
        example: { slug: "gengar-mega", caption: "Perish Song, then both Protect. The partner is why this exists." },
      },
      {
        title: "One Mega still, unless the list packs two stones",
        body: "Open lists. If they show two Mega stones, preview is which Mega they will actually click. You do not Mega both in one battle. Dual Mega on a six is a choice, not a flex. Singles already taught one Omni Ring. Doubles adds the question: which of the two stones is this game.",
        example: { slug: "staraptor-mega", caption: "Intimidate Mega. The other stone stays in the bag this game." },
      },
    ],
    examples: [
      { slug: "incineroar", caption: "Fake Out" },
      { slug: "politoed", caption: "Must-bring" },
      { slug: "gengar-mega", caption: "Pair trap" },
      { slug: "staraptor-mega", caption: "The Mega this game" },
    ],
    viz: "stadium",
    relatedManuals: [],
    next: "doubles-archetypes",
  },
  {
    slug: "doubles-archetypes",
    band: "great-ball",
    track: "doubles",
    title: "What is their six trying to do?",
    thesis: "Same names as singles — Balance, weather, Hyper Offense, Tailwind, Trick Room — plus perish, dual Mega, and Tail Room. Hybrids are the default.",
    skipIf: "Skip if you already read perish, dual Mega, and Tailwind pairing on a six.",
    body: [
      "Ask the same first question: what is their team trying to do. A six can run two modes. The skill is naming both before you pick four.",
      "Balance still wants safe pivots. Weather still cashes a field. Hyper Offense still wants KOs now. Tailwind is its own pairing here: you double Speed so Scarf is optional. Trick Room flips the race. Then the doubles-only plans.",
    ],
    beats: [
      {
        title: "Perish trap",
        body: "Fake Out turn one. Mega Gengar Perish Songs — Shadow Tag so you cannot switch. Both Protect. Pivot: Gengar out, Incineroar Parting Shot, Gengar back in so you still cannot switch, Protect the last count. Both of yours faint in three turns if you sit there. The answer is damage onto Gengar before the count, a Ghost immune to Shadow Tag, or never letting the song start.",
        example: { slug: "gengar-mega", caption: "Shadow Tag plus Perish Song. Incineroar is the Fake Out and the pivot." },
      },
      {
        title: "Dual Mega is a preview choice",
        body: "Two stones on the six. One Mega this game. Mega Swampert wants rain and Swift Swim. Mega Staraptor wants Intimidate and a Fighting STAB. You pick the four that make one Mega true. They pick which stone answers your four. Do not plan as if both Megas are on the field.",
        example: { slug: "swampert-mega", caption: "Rain Mega. Staraptor is the other stone, not a second Mega this battle." },
      },
      {
        title: "Tailwind pairing",
        body: "A Tailwind setter plus names that are slow until the wind is up — Sylveon, Basculegion, a bulky special. You do not Scarf them. Four turns including the click. The partner Protects or Fake Outs the turn you set. That is the pairing singles does not get: someone else buys the clock turn.",
        example: { slug: "whimsicott", caption: "Prankster Tailwind. Partner Fake Outs. Slow names become the wincon." },
      },
      {
        title: "Tail Room",
        body: "Trick Room plus a Tailwind name on the same six. If the room gets Taunted they still race. If Tailwind gets denied they still flip. Your four has to beat both clocks, not the one you hoped they would click.",
        example: { slug: "farigiraf", caption: "Room. The Tailwind name is the backup, not flavor." },
      },
    ],
    examples: [
      { slug: "gengar-mega", caption: "Perish" },
      { slug: "swampert-mega", caption: "Rain Mega" },
      { slug: "staraptor-mega", caption: "The other stone" },
      { slug: "whimsicott", caption: "Tailwind pair" },
      { slug: "farigiraf", caption: "Tail Room" },
    ],
    viz: "none",
    relatedManuals: [],
    next: "doubles-preview",
  },
  {
    slug: "doubles-preview",
    band: "ultra-ball",
    track: "doubles",
    title: "Deduce the four",
    thesis: "Name both of their modes. Find the Pokémon that has to be in the four. Then pick four that answer both stories.",
    skipIf: "Skip if you already lock a must-bring and draft four into both of their cores.",
    body: [
      "Singles preview names a lead. Doubles preview names a four. You still identify archetypes and threats first. Then you draft.",
    ],
    beats: [
      {
        title: "Both modes, then the threats",
        body: "Rain core: Politoed, Mega Swampert, Archaludon Electro Shot. Perish core: Politoed can still click Perish, Incineroar Fake Out, Mega Gengar Shadow Tag. Write both. Threats are weather control, Mega Swampert, Archaludon, Mega Gengar, perish stall. If you only prepared for rain, perish KOs you in three turns.",
        example: { slug: "politoed", caption: "On rain and on perish. That is the tell." },
      },
      {
        title: "Must-bring",
        body: "Politoed is usable on both archetypes. Your game plan must account for Politoed. You have already deduced one of the four they are bringing. That is a knowledge advantage before a turn is played. Same skill as Pelipper on a singles rain three — here the list is six, so the deduction is harder and more valuable.",
        example: { slug: "politoed", caption: "Both cores die without it. Bring the answer to the Toad." },
      },
      {
        title: "Pick four that hit every threat",
        body: "Sand (Tyranitar, Excadrill) steals rain, threatens Gengar, and upsets Swift Swim. Mega Staraptor Intimidates Swampert, is immune to Ground, and Fighting-types Archaludon — Electro Shot cannot fire if you keep weather. Venusaur pins Politoed and double-dips into Swampert. Now both cores have answers. You did not pick your four strongest names. You picked the four that make their modes illegal.",
        example: { slug: "staraptor-mega", caption: "Fighting into Archaludon. Intimidate into Swampert. Immune to Earthquake." },
      },
      {
        title: "Then the lead pair",
        body: "The four is the draft. The lead is two names. Safe pair when unsure: Fake Out plus a pivot. Committed pair when you have named their mode: weather steal plus the pin. Do not lead the perish answer into rain if you already know Politoed plus Archaludon is coming.",
        example: { slug: "venusaur-mega", caption: "Pins Politoed. The partner should be the weather steal or the Intimidate Mega." },
      },
    ],
    examples: [
      { slug: "politoed", caption: "Must-bring" },
      { slug: "swampert-mega", caption: "Rain threat" },
      { slug: "gengar-mega", caption: "Perish threat" },
      { slug: "staraptor-mega", caption: "Your four" },
      { slug: "tyranitar", caption: "Weather steal" },
      { slug: "venusaur-mega", caption: "The pin" },
    ],
    viz: "none",
    relatedManuals: [],
    next: "doubles-positioning",
  },
  {
    slug: "doubles-positioning",
    band: "master-ball",
    track: "doubles",
    title: "Win the board, not the draft",
    thesis: "The four you brought can still lose the weather war. Cover the charge. Double Protect. Sacrifice the slot that buys the field.",
    skipIf: "Skip if you already steal weather, cover Electro Shot, and stall perish counts on purpose.",
    body: [
      "You won preview. The four is right. Positioning is what the two on the field are doing, what is in the back, and which wincon exists right now. Turn 1’s pair is not turn 10’s.",
      "Review and keeping up are not doubles-only. After this article, the singles Master Ball lessons are the rest of the climb. Ranked Meta on this app is a singles snapshot — say so when you use it.",
    ],
    beats: [
      {
        title: "Cover the charge",
        body: "Archaludon Electro Shots the same turn in rain. If you switch Tyranitar in, rain dies. Electro Shot has to charge. The partner can Protect, Fake Out, or KO the pinned Archaludon for free. In singles the steal is one action. Here the partner is why the steal is a KO instead of a trade.",
        example: { slug: "archaludon", caption: "Rain gone, charging. Partner clicks the KO. You do not let it move next turn." },
      },
      {
        title: "Double Protect and perish counts",
        body: "If they started Perish, you need to KO Gengar, get a Ghost out, or stall without sitting the count. Double Protect is their script. Yours is damage plus a switch the turn Shadow Tag is gone. If you cannot reliably double Protect, sacrifice a Pokémon into the trap so the partner lives the last count.",
        example: { slug: "gengar-mega", caption: "Three turns. Hit it or leave the slot they are counting." },
      },
      {
        title: "Sacrifice to retake weather",
        body: "They have weather. Your setter is in the back. Whatever you send in dies. Send it anyway. The field is the wincon, not the HP bar. Same idea as singles — the partner makes the sacrifice cheaper because the other slot can Protect or KO while you eat the hit.",
        example: { slug: "tyranitar", caption: "Walk into rain. Sand goes up. The partner covers the charge." },
      },
      {
        title: "Worked board: Venusaur plus Staraptor vs Politoed plus Archaludon",
        body: "Rain is up. Archaludon threatens Electro Shot into Staraptor. Venusaur pins Politoed — the only switch is Swampert into 4× Grass. You switch Staraptor to Tyranitar. They Protect Politoed and Electro Shot. Rain dies. Archaludon is charging. You KO it. Swampert comes in with no weather. You won the weather war. The wincon was not Staraptor’s STAB. It was owning the field so Electro Shot could not fire.",
        example: { slug: "venusaur-mega", caption: "The pin. Tyranitar is the steal. Staraptor only stays if Electro Shot cannot click." },
      },
    ],
    examples: [
      { slug: "archaludon", caption: "Charge" },
      { slug: "tyranitar", caption: "Steal" },
      { slug: "staraptor-mega", caption: "Leave if threatened" },
      { slug: "venusaur-mega", caption: "Pin" },
    ],
    viz: "none",
    relatedManuals: [],
    next: "review",
  },
];

export function doublesLessonsByBand(band: LessonBand) {
  return DOUBLES_LESSONS.filter((l) => l.band === band);
}

export function getDoublesLesson(slug: string) {
  return DOUBLES_LESSONS.find((l) => l.slug === slug);
}

export function doublesLessonHref(slug: string) {
  if (slug === "review" || slug === "keeping-up") return `/learn/${slug}` as const;
  if (slug === "manuals") return manualsHref("doubles");
  if (slug === "meta") return "/meta" as const;
  return `/learn/doubles/${slug}` as const;
}

export function nextDoublesLesson(slug: string) {
  const lesson = getDoublesLesson(slug);
  if (!lesson?.next) return undefined;
  if (lesson.next === "review") {
    const next = getLesson("review");
    if (!next) return undefined;
    return { slug: next.slug, title: next.title, href: lessonHref(next.slug) };
  }
  const next = getDoublesLesson(lesson.next);
  if (!next) return undefined;
  return { slug: next.slug, title: next.title, href: doublesLessonHref(next.slug) };
}
