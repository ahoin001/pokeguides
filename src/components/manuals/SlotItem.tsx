import type { MoveAlt } from "@/content/manuals";
import { SlotField } from "./SlotField";

export function SlotItemBlock({
  item,
  why,
  alts,
}: {
  item: string;
  why?: string;
  alts?: MoveAlt[];
}) {
  const swaps = alts?.filter((a) => a.name) ?? [];
  return (
    <div className="space-y-2.5">
      <SlotField label="Item">
        <p className="font-medium leading-snug">{item}</p>
        {why ? <p className="mt-1 text-sm leading-relaxed text-muted">{why}</p> : null}
      </SlotField>
      {swaps.map((a) => (
        <SlotField key={a.name} label="Swap">
          <p className="font-medium leading-snug">{a.name}</p>
          {a.why ? <p className="mt-1 text-sm leading-relaxed text-muted">{a.why}</p> : null}
        </SlotField>
      ))}
    </div>
  );
}
