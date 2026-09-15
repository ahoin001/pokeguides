import { TypeBadge } from "@/components/pokemon/TypeBadge";
import { TYPE_IDS_ALPHA, attackMultiplier, defensiveMatchup } from "@/lib/champions/types";
import type { TypeId } from "@/types/pokemon";
import { SlotField } from "./SlotField";

export function SlotMatchups({ types }: { types: readonly TypeId[] }) {
  const { weak } = defensiveMatchup(types);
  const hits = TYPE_IDS_ALPHA.filter((defend) => types.some((attack) => attackMultiplier(attack, defend) > 1));
  return (
    <div className="space-y-1.5">
      <SlotField label="Type">
        <div className="flex flex-wrap gap-1">
          {types.map((t) => (
            <TypeBadge key={t} type={t} size="sm" />
          ))}
        </div>
      </SlotField>
      {weak.length ? (
        <SlotField label="Weak">
          <div className="flex flex-wrap gap-1">
            {weak.map((w) => (
              <TypeBadge key={w.type} type={w.type} size="sm" mark={w.mult >= 4 ? "4×" : undefined} />
            ))}
          </div>
        </SlotField>
      ) : null}
      {hits.length ? (
        <SlotField label="Hits">
          <div className="flex flex-wrap gap-1">
            {hits.map((t) => (
              <TypeBadge key={t} type={t} size="sm" />
            ))}
          </div>
        </SlotField>
      ) : null}
    </div>
  );
}
