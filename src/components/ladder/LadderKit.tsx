import { KitUsagePanel } from "@/components/ladder/KitUsage";
import type { ParsedBattleKit } from "@/lib/champions-battle/types";

/** Ladder kit display — bars for moves/items/teammates; ability/nature/SP in Advanced. */
export function LadderKit({
  kit,
  teammateHref,
}: {
  kit: ParsedBattleKit;
  teammateHref?: (name: string) => string | undefined;
  /** @deprecated ignored — layout is always stacked bars */
  compact?: boolean;
}) {
  return <KitUsagePanel kit={kit} teammateHref={teammateHref} />;
}
