import { TypeBadge } from "@/components/pokemon/TypeBadge";
import { defensiveMatchup } from "@/lib/champions/types";
import type { TypeId } from "@/types/pokemon";

export function SlotMatchups({ types }: { types: readonly TypeId[] }) {
  const { weak } = defensiveMatchup(types);
  return (
    <div className="mt-2 space-y-1.5">
      <div className="flex flex-wrap gap-1">
        {types.map((t) => (
          <TypeBadge key={t} type={t} size="sm" />
        ))}
      </div>
      {weak.length ? (
        <div className="flex flex-wrap items-center gap-1">
          <span className="mr-0.5 text-[10px] font-medium uppercase tracking-wide text-muted">Weak</span>
          {weak.map((w) => (
            <TypeBadge key={w.type} type={w.type} size="sm" mark={w.mult >= 4 ? "4×" : undefined} />
          ))}
        </div>
      ) : null}
    </div>
  );
}
