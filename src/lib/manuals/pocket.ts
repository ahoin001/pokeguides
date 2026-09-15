import { FAMILY_LESSON, manualFamily, type TeamManual } from "@/content/manuals";
import { getPokemon } from "@/lib/catalog/load";

export type ManualPocket = {
  names: string[];
  never: string;
  lead: string;
  switches: { into: string; send: string }[];
};

function firstSentence(text: string) {
  const cut = text.split(/(?<=[.!?])\s+/)[0]?.trim();
  return cut || text.trim();
}

export function pocketFromManual(manual: TeamManual): ManualPocket {
  const names = manual.slugs.map((slug, i) => {
    const p = slug ? getPokemon(slug) : undefined;
    return p?.name ?? manual.slots[i]?.title ?? slug;
  });
  const family = FAMILY_LESSON[manualFamily(manual)];
  const never = (manual.pilot?.fail ?? family.commonFail).trim();
  const leadSlot = manual.slots.find((s) => /lead/i.test(s.role));
  const clock = manual.plan?.find((b) => b.title.toLowerCase() === "clock");
  const lead =
    leadSlot?.role.trim() ||
    (clock?.play ? firstSentence(clock.play) : "") ||
    (names[0] ? `Lead ${names[0]}.` : "");
  const switches = (manual.switches ?? [])
    .filter((s) => s.into || s.send)
    .map((s) => ({
      into: s.into.trim(),
      send: (s.send.split(/[.—]/)[0] ?? s.send).trim(),
    }));
  return { names, never, lead, switches };
}
