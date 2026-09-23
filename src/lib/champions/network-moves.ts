import { getChampionsMove, championsMoveNames } from "@/lib/champions/move-data";

export type NetworkPhraseHits = {
  /** Champions move names found in the phrase (display order). */
  moves: string[];
  /** Phrase with move names removed, trimmed — empty when only moves remain. */
  residual: string;
};

let catalogNamesCache: string[] | null = null;

function catalogNamesLongestFirst(): string[] {
  if (!catalogNamesCache) {
    catalogNamesCache = championsMoveNames()
      .map((n) => getChampionsMove(n)?.name ?? n)
      .filter(Boolean)
      .sort((a, b) => b.length - a.length);
  }
  return catalogNamesCache;
}

function escapeRegExp(s: string) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/** Match kit move names inside free text (longest first, word-boundary-ish). */
function matchFromKit(text: string, kit: string[]): string[] {
  const lower = text.toLowerCase();
  const sorted = [...kit]
    .map((n) => n.trim())
    .filter(Boolean)
    .sort((a, b) => b.length - a.length);
  const hits: string[] = [];
  let remaining = lower;
  for (const name of sorted) {
    const needle = name.toLowerCase();
    const re = new RegExp(`(?:^|[^a-z0-9])${escapeRegExp(needle)}(?=[^a-z0-9]|$)`, "i");
    if (re.test(remaining)) {
      const canon = getChampionsMove(name)?.name ?? name;
      if (!hits.includes(canon)) hits.push(canon);
      remaining = remaining.replace(new RegExp(escapeRegExp(needle), "ig"), " ");
    }
  }
  return hits;
}

/** Fall back: scan free text for any Champions move name. */
function matchFromCatalog(text: string, already: string[]): string[] {
  const hits = [...already];
  let remaining = text;
  for (const name of catalogNamesLongestFirst()) {
    if (hits.some((h) => h.toLowerCase() === name.toLowerCase())) continue;
    if (name.length < 4) continue; // skip tiny tokens like "Fly" false-positives in prose
    const re = new RegExp(`(?:^|[^a-z0-9])${escapeRegExp(name)}(?=[^a-z0-9]|$)`, "i");
    if (re.test(remaining)) {
      hits.push(name);
      remaining = remaining.replace(new RegExp(escapeRegExp(name), "ig"), " ");
    }
  }
  return hits;
}

function residualAfterMoves(text: string, moves: string[]): string {
  let residual = text;
  for (const name of moves) {
    residual = residual.replace(new RegExp(escapeRegExp(name), "ig"), " ");
  }
  return residual
    .replace(/[;,/|]+/g, " ")
    .replace(/\b(and|plus|or|to|into|via|with|free|turn|turns|pressure|window|safer|breathing|room)\b/gi, " ")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/^[\s:→\-–—]+|[\s:→\-–—]+$/g, "")
    .trim();
}

/**
 * Resolve create/convert phrase → MoveChips + residual non-move text.
 * Prefer the owning Pokémon's kit, then Champions catalog scan.
 */
export function resolveNetworkPhrase(
  text: string,
  kitMoves: string[] = [],
): NetworkPhraseHits {
  const raw = text?.trim() ?? "";
  if (!raw) return { moves: [], residual: "" };

  let moves = matchFromKit(raw, kitMoves);
  if (!moves.length) moves = matchFromCatalog(raw, []);
  else moves = matchFromCatalog(raw, moves);

  // Cap chips so cards stay scannable
  moves = moves.slice(0, 2);

  const residual = residualAfterMoves(raw, moves);
  // If residual is just a shorthand of the move, drop it
  if (
    residual &&
    moves.some((m) => m.toLowerCase().includes(residual.toLowerCase()) || residual.toLowerCase().includes(m.toLowerCase()))
  ) {
    return { moves, residual: "" };
  }

  return { moves, residual: moves.length ? residual : raw };
}

export function kitMapFromRoster(
  roster: { slug: string; moves?: { name: string }[] }[] | undefined,
): Map<string, string[]> {
  const m = new Map<string, string[]>();
  for (const slot of roster ?? []) {
    if (!slot.slug) continue;
    m.set(
      slot.slug,
      (slot.moves ?? []).map((mv) => mv.name).filter(Boolean),
    );
  }
  return m;
}
