import type { MoveAlt } from "@/content/manuals";

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
    <>
      <h3 className="mt-5 text-xs font-semibold uppercase tracking-wide text-muted">Item</h3>
      <p className="mt-2 font-medium">{item}</p>
      {why ? <p className="mt-1 text-sm text-muted">{why}</p> : null}
      {swaps.map((a) => (
        <p key={a.name} className="mt-2 text-sm text-muted">
          <span className="font-medium text-ink">Swap {a.name}. </span>
          {a.why}
        </p>
      ))}
    </>
  );
}
