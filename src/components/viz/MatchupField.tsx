import { TYPE_LABEL, defensiveMatchup, offensiveMatchup } from "@/lib/champions/types";
import type { TypeId } from "@/types/pokemon";
import { TypeIcon } from "@/components/pokemon/TypeIcon";

/** The four typing pillars: Weak to · Strong into · Not affected by · Has no effect on. */
export function MatchupField({ types }: { types: readonly TypeId[] }) {
  const { weak, immune } = defensiveMatchup(types);
  const { strong, fails } = offensiveMatchup(types);
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
      <Group
        title="Weak to"
        tone="rose"
        items={weak.map((w) => ({ type: w.type, note: `${w.mult}×` }))}
        empty="No weaknesses"
      />
      <Group
        title="Strong into"
        tone="hit"
        items={strong.map((type) => ({ type, note: "2×+" }))}
        empty="No super-effective STAB"
      />
      <Group
        title="Not affected by"
        tone="slash"
        items={immune.map((t) => ({ type: t }))}
        empty="No immunities"
        slash
      />
      <Group
        title="Has no effect on"
        tone="mute"
        items={fails.map((t) => ({ type: t }))}
        empty="STAB hits everything"
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
  tone: "hit" | "rose" | "mute" | "slash";
}) {
  const rail =
    tone === "hit"
      ? "#5b8def"
      : tone === "rose"
        ? "#e23d7a"
        : tone === "slash"
          ? "#f4f1ea"
          : "#8b90a0";
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
