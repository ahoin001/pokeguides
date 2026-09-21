/** Community / TCG nicknames → Champions AttackDex name. */
export const MOVE_CANONICAL: Record<string, string> = {
  "splash turn": "Flip Turn",
  "splashing turn": "Flip Turn",
  "quick turn": "Flip Turn",
};

function nickKey(name: string) {
  return name.trim().toLowerCase().replace(/\s+/g, " ");
}

export function canonicalMoveName(name: string) {
  return MOVE_CANONICAL[nickKey(name)] ?? name;
}

export function aliasesFor(canonical: string) {
  const needle = canonical.trim().toLowerCase();
  return Object.entries(MOVE_CANONICAL)
    .filter(([, canon]) => canon.toLowerCase() === needle)
    .map(([nick]) => nick);
}
