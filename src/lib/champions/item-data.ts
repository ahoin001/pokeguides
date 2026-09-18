import { ITEMS_LESSON } from "@/content/items-sheet";

export type ItemBlurb = {
  name: string;
  tag?: string;
  body: string;
};

const byLower = new Map<string, ItemBlurb>();

for (const beat of ITEMS_LESSON.beats) {
  const blurb: ItemBlurb = {
    name: beat.title,
    tag: beat.tag,
    body: beat.body,
  };
  byLower.set(beat.title.toLowerCase(), blurb);
}

const ALIASES: Record<string, string> = {
  sash: "focus sash",
  scarf: "choice scarf",
  specs: "choice specs",
  band: "choice band",
  boots: "heavy-duty boots",
  "hdb": "heavy-duty boots",
  orb: "life orb",
  vest: "assault vest",
  leftovers: "leftovers",
  sitrus: "sitrus berry",
};

/** Classroom item blurb when we have one — otherwise undefined. */
export function getItemBlurb(name: string): ItemBlurb | undefined {
  const key = name.trim().toLowerCase();
  if (byLower.has(key)) return byLower.get(key);
  const alias = ALIASES[key];
  if (alias && byLower.has(alias)) return byLower.get(alias);
  // Mega stones often named "Charizardite Y" — match lesson "Mega stone" if title includes ite
  if (/ite(\s+[xyz])?$/i.test(name) || /mega/i.test(name)) {
    return byLower.get("mega stone");
  }
  return undefined;
}
