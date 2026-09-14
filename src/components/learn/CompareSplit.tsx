import { getArchetype, MARGIN_LABEL, PACING_LABEL } from "@/content/archetypes";
import type { ArchetypeId } from "@/types/pokemon";

export function CompareSplit({ a, b }: { a: ArchetypeId; b: ArchetypeId }) {
  const left = getArchetype(a);
  const right = getArchetype(b);
  if (!left || !right) return null;

  const rows = [
    ["Pace", PACING_LABEL[left.pacing], PACING_LABEL[right.pacing]],
    ["Margin", MARGIN_LABEL[left.margin], MARGIN_LABEL[right.margin]],
    ["Lead", left.lead, right.lead],
    ["Plan", left.philosophy, right.philosophy],
  ] as const;

  return (
    <section className="mt-16">
      <h2 className="text-2xl font-semibold tracking-tight">
        {left.name} next to {right.name}
      </h2>
      <div className="mt-6 space-y-4 md:hidden">
        {rows.map(([label, l, r]) => (
          <div key={label} className="rounded-3xl border border-line p-4">
            <p className="text-sm font-medium">{label}</p>
            <p className="mt-3 text-sm">
              <span className="text-ink">{left.name}. </span>
              <span className="text-muted">{l}</span>
            </p>
            <p className="mt-2 text-sm">
              <span className="text-ink">{right.name}. </span>
              <span className="text-muted">{r}</span>
            </p>
          </div>
        ))}
      </div>
      <div className="mt-6 hidden overflow-hidden rounded-3xl border border-line md:block">
        <div className="grid grid-cols-[7rem_1fr_1fr] gap-px bg-line text-sm">
          <div className="bg-raised px-3 py-3 text-muted" />
          <div className="bg-raised px-4 py-3 font-semibold">{left.name}</div>
          <div className="bg-raised px-4 py-3 font-semibold">{right.name}</div>
          {rows.map(([label, l, r]) => (
            <div key={label} className="contents">
              <div className="bg-bg px-3 py-4 font-medium text-muted">{label}</div>
              <div className="bg-bg px-4 py-4 text-muted">{l}</div>
              <div className="bg-bg px-4 py-4 text-muted">{r}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
