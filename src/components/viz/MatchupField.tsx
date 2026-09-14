import { TYPE_LABEL, defensiveMatchup } from "@/lib/champions/types";
import type { TypeId } from "@/types/pokemon";
import { TypeIcon } from "@/components/pokemon/TypeIcon";

export function MatchupField({ types }: { types: readonly TypeId[] }) {
  const { weak, resist, immune } = defensiveMatchup(types);
  return (
    <div className="grid gap-6 md:grid-cols-3">
      <Group
        title="Hits this hard"
        tone="rose"
        items={weak.map((w) => ({ type: w.type, note: `${w.mult}x` }))}
      />
      <Group
        title="Not very effective"
        tone="mute"
        items={resist.map((r) => ({ type: r.type, note: `${r.mult}x` }))}
      />
      <Group
        title="No effect"
        tone="slash"
        items={immune.map((t) => ({ type: t }))}
        empty="No immunities"
        slash
      />
    </div>
  );
}

function Group({
  title,
  items,
  empty,
  slash = false,
  tone,
}: {
  title: string;
  items: { type: TypeId; note?: string }[];
  empty?: string;
  slash?: boolean;
  tone: "rose" | "mute" | "slash";
}) {
  const rail = tone === "rose" ? "#e23d7a" : tone === "slash" ? "#f4f1ea" : "#8b90a0";
  return (
    <div>
      <h3 className="flex items-center gap-2 text-sm text-muted">
        <span className="h-1.5 w-1.5 rotate-45" style={{ background: rail }} />
        {title}
      </h3>
      <div className="mt-3 flex flex-wrap gap-2">
        {items.length ? (
          items.map((item) => (
            <TypeIcon
              key={item.type}
              type={item.type}
              size="md"
              slash={slash}
              title={item.note ? `${TYPE_LABEL[item.type]} ${item.note}` : undefined}
            />
          ))
        ) : (
          <p className="text-sm text-muted">{empty ?? "None"}</p>
        )}
      </div>
    </div>
  );
}
