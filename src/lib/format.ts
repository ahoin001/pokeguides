/**
 * Battle format as a product boundary.
 * Singles owns Team / Live / Meta tools today.
 * Doubles owns Learn/doubles + Doubles manuals shelf (and later Meta).
 */

export const BATTLE_FORMATS = ["singles", "doubles"] as const;
export type BattleFormat = (typeof BATTLE_FORMATS)[number];

export const FORMAT_LABEL: Record<BattleFormat, string> = {
  singles: "Singles",
  doubles: "Doubles",
};

export const FORMAT_BLURB: Record<BattleFormat, string> = {
  singles: "3v3 · one on the field",
  doubles: "Pick 4 · two on the field",
};

/** How many you bring from the registered six. */
export const FORMAT_BRING: Record<BattleFormat, number> = {
  singles: 3,
  doubles: 4,
};

/** How many active on the field at once. */
export const FORMAT_FIELD: Record<BattleFormat, number> = {
  singles: 1,
  doubles: 2,
};

export function isBattleFormat(value: string | null | undefined): value is BattleFormat {
  return value === "singles" || value === "doubles";
}

export function parseBattleFormat(
  value: string | null | undefined,
  fallback: BattleFormat = "singles",
): BattleFormat {
  return isBattleFormat(value) ? value : fallback;
}

/** Learn classroom href for a lesson slug in a format. */
export function learnHref(format: BattleFormat, slug?: string) {
  if (format === "doubles") {
    return slug ? (`/learn/doubles/${slug}` as const) : ("/learn/doubles" as const);
  }
  return slug ? (`/learn/${slug}` as const) : ("/learn" as const);
}

/** Manuals shelf with format query (default singles omits query for clean URLs). */
export function manualsHref(format: BattleFormat = "singles") {
  if (format === "doubles") return "/manuals?format=doubles" as const;
  return "/manuals" as const;
}

/** Paths where Team / Live / Meta tools assume Singles. */
export function isSinglesToolPath(pathname: string) {
  return (
    pathname.startsWith("/team") ||
    pathname.startsWith("/live") ||
    pathname.startsWith("/meta") ||
    pathname.startsWith("/usage")
  );
}

export function isLearnPath(pathname: string) {
  return pathname === "/learn" || pathname.startsWith("/learn/");
}

export function isManualsPath(pathname: string) {
  return pathname === "/manuals" || pathname.startsWith("/manuals/");
}

/** Active Learn format from pathname. */
export function learnFormatFromPath(pathname: string): BattleFormat {
  if (pathname.startsWith("/learn/doubles")) return "doubles";
  return "singles";
}

export function formatBringLabel(format: BattleFormat) {
  return format === "doubles" ? "Bring 4 · pairs" : "Bring 3";
}

export function formatManualEyebrow(format: BattleFormat) {
  return format === "doubles" ? "Doubles field manual" : "Field manual";
}
