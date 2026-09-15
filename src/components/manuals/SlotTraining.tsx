import { sampleSpTotal } from "@/lib/champions/stats";
import type { SampleSp } from "@/types/pokemon";
import type { SlotTraining } from "@/content/manuals";

const STATS: { key: keyof SampleSp; label: string }[] = [
  { key: "hp", label: "HP" },
  { key: "atk", label: "Atk" },
  { key: "def", label: "Def" },
  { key: "spa", label: "SpA" },
  { key: "spd", label: "SpD" },
  { key: "spe", label: "Spe" },
];

function Chips({ sp }: { sp: SampleSp }) {
  return (
    <ul className="flex flex-wrap gap-1.5">
      {STATS.filter((s) => sp[s.key] > 0).map((s) => (
        <li key={s.key} className="rounded-full bg-white/8 px-2.5 py-1 text-xs font-medium tabular-nums">
          {sp[s.key]} {s.label}
        </li>
      ))}
    </ul>
  );
}

export function SlotTrainingBlock({ training }: { training: SlotTraining }) {
  const used = sampleSpTotal(training.sp);
  const alts = training.alts?.filter((a) => a.name || a.why) ?? [];

  return (
    <>
      <h3 className="mt-5 text-xs font-semibold uppercase tracking-wide text-muted">Training</h3>
      <div className="mt-2">
        <Chips sp={training.sp} />
        <p className="mt-2 text-sm text-muted">{training.why}</p>
        {used !== 66 ? <p className="mt-1 text-xs text-muted">{used} / 66 Stat Points</p> : null}
      </div>
      {alts.map((a) => (
        <div key={a.name} className="mt-3">
          <p className="text-sm font-medium">Swap {a.name}.</p>
          <div className="mt-1.5">
            <Chips sp={a.sp} />
          </div>
          <p className="mt-1.5 text-sm text-muted">{a.why}</p>
        </div>
      ))}
    </>
  );
}
