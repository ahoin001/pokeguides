import { TYPE_IDS } from "@/types/pokemon";
import { teamOffenseCounts, teamWeaknessCounts } from "@/lib/champions/types";
import type { TypeId } from "@/types/pokemon";
import { TypeIcon } from "@/components/pokemon/TypeIcon";

export function CoverageFlower({
  teamTypes,
}: {
  teamTypes: readonly (readonly TypeId[])[];
}) {
  const weak = teamWeaknessCounts(teamTypes);
  const off = teamOffenseCounts(teamTypes);
  return (
    <div>
      <div className="grid grid-cols-6 gap-2 sm:grid-cols-9">
        {TYPE_IDS.map((t) => (
          <div key={t} className="flex flex-col items-center gap-1 rounded-2xl bg-white/5 px-1 py-2">
            <TypeIcon type={t} size="sm" />
            <p className="font-mono text-[10px] text-muted">
              {weak[t]}w/{off[t]}o
            </p>
          </div>
        ))}
      </div>
      <p className="mt-3 text-xs text-muted">
        w = teammates weak to it. o = teammates that hit it super effective.
      </p>
    </div>
  );
}
