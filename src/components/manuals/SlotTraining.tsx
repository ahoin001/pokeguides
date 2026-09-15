import { sampleSpTotal } from "@/lib/champions/stats";
import type { SampleSp } from "@/types/pokemon";
import type { SlotTraining } from "@/content/manuals";
import { SlotField } from "./SlotField";

const STATS: { key: keyof SampleSp; label: string }[] = [
  { key: "hp", label: "HP" },
  { key: "atk", label: "Atk" },
  { key: "def", label: "Def" },
  { key: "spa", label: "SpA" },
  { key: "spd", label: "SpD" },
  { key: "spe", label: "Spe" },
];

function Spread({ sp }: { sp: SampleSp }) {
  return (
    <ul className="grid grid-cols-6 gap-1">
      {STATS.map((s) => {
        const n = sp[s.key];
        return (
          <li
            key={s.key}
            className={`rounded-lg px-0.5 py-1.5 text-center ${n ? "bg-white/8" : "bg-white/[0.04]"}`}
          >
            <p className="font-mono text-[9px] uppercase tracking-[0.08em] text-muted">{s.label}</p>
            <p
              className={`mt-0.5 font-mono text-[13px] tabular-nums leading-none ${
                n ? "font-semibold" : "text-muted/45"
              }`}
            >
              {n || "–"}
            </p>
          </li>
        );
      })}
    </ul>
  );
}

function Spend({ lines }: { lines: string[] }) {
  return (
    <ul className="mt-2 space-y-1.5">
      {lines.map((line) => {
        const [head, ...rest] = line.split(" — ");
        const tail = rest.join(" — ");
        return (
          <li key={line} className="text-sm leading-relaxed text-muted">
            {tail ? (
              <>
                <span className="font-medium text-ink">{head}</span>
                {" — "}
                {tail}
              </>
            ) : (
              line
            )}
          </li>
        );
      })}
    </ul>
  );
}

export function SlotTrainingBlock({ training }: { training: SlotTraining }) {
  const used = sampleSpTotal(training.sp);
  const alts = training.alts?.filter((a) => a.name || a.why) ?? [];

  return (
    <div className="space-y-2.5">
      <SlotField label="SP">
        {training.label ? <p className="font-medium leading-snug">{training.label}</p> : null}
        <div className={training.label ? "mt-1.5" : undefined}>
          <Spread sp={training.sp} />
        </div>
        <p className="mt-2 text-sm leading-relaxed text-pretty">{training.why}</p>
        {training.spend?.length ? <Spend lines={training.spend} /> : null}
        {used !== 66 ? <p className="mt-1 font-mono text-[11px] text-muted">{used} / 66</p> : null}
      </SlotField>
      {alts.map((a) => (
        <SlotField key={a.name} label="Swap">
          {a.name ? <p className="font-medium leading-snug">{a.name}</p> : null}
          <div className={a.name ? "mt-1.5" : undefined}>
            <Spread sp={a.sp} />
          </div>
          <p className="mt-1.5 text-sm leading-relaxed text-pretty text-muted">{a.why}</p>
          {a.spend?.length ? <Spend lines={a.spend} /> : null}
        </SlotField>
      ))}
    </div>
  );
}
