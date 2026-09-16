import { KitUsagePanel } from "@/components/ladder/KitUsage";
import type { ParsedBattleKit } from "@/lib/champions-battle/types";

/** Ladder kit display — bars for moves/items/teammates; ability/nature/SP in Advanced. */
export function LadderKit({
  kit,
  teammateHrefs,
}: {
  kit: ParsedBattleKit;
  /** Pre-resolved teammate name → href (serializable; safe for RSC → client). */
  teammateHrefs?: Record<string, string>;
  /** @deprecated ignored — layout is always stacked bars */
  compact?: boolean;
}) {
  return <KitUsagePanel kit={kit} teammateHrefs={teammateHrefs} />;
}
