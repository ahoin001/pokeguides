import { TypeBadge } from "@/components/pokemon/TypeBadge";
import { defensiveMatchup, offensiveMatchup } from "@/lib/champions/types";
import type { TypeId } from "@/types/pokemon";
import { SlotField } from "./SlotField";

export function SlotMatchups({ types }: { types: readonly TypeId[] }) {
  const { weak, immune } = defensiveMatchup(types);
  const { strong, fails } = offensiveMatchup(types);
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
        <SlotField label="Weak to">
          <div className="flex flex-wrap gap-1">
            {weak.map((w) => (
              <TypeBadge key={w.type} type={w.type} size="sm" mark={w.mult >= 4 ? "4×" : undefined} />
            ))}
          </div>
        </SlotField>
      ) : null}
      {strong.length ? (
        <SlotField label="Strong into">
          <div className="flex flex-wrap gap-1">
            {strong.map((t) => (
              <TypeBadge key={t} type={t} size="sm" />
            ))}
          </div>
        </SlotField>
      ) : null}
      {immune.length ? (
        <SlotField label="Not affected by">
          <div className="flex flex-wrap gap-1">
            {immune.map((t) => (
              <TypeBadge key={t} type={t} size="sm" />
            ))}
          </div>
        </SlotField>
      ) : null}
      {fails.length ? (
        <SlotField label="No effect on">
          <div className="flex flex-wrap gap-1">
            {fails.map((t) => (
              <TypeBadge key={t} type={t} size="sm" />
            ))}
          </div>
        </SlotField>
      ) : null}
    </div>
  );
}
