import type { ManualPlanBeat } from "@/content/manuals";
import { MANUAL_SCROLL_MT } from "@/components/manuals/ManualToc";

type Stance = {
  id: "set" | "defend" | "push" | "play";
  label: string;
  doLabel: string;
  wash: string;
};

function stanceFor(title: string): Stance {
  const t = title.toLowerCase();
  if (t.includes("clock") || t.includes("preview") || t.includes("lead")) {
    return {
      id: "set",
      label: "Set",
      doLabel: "Open",
      wash: "color-mix(in srgb, var(--type-electric) 18%, transparent)",
    };
  }
  if (t.includes("shield") || t.includes("mid") || t.includes("pivot")) {
    return {
      id: "defend",
      label: "Defend",
      doLabel: "Switch / sit",
      wash: "color-mix(in srgb, var(--type-steel) 22%, transparent)",
    };
  }
  if (t.includes("clean") || t.includes("late") || t.includes("sweep")) {
    return {
      id: "push",
      label: "Push",
      doLabel: "Press",
      wash: "color-mix(in srgb, var(--type-fighting) 18%, transparent)",
    };
  }
  return {
    id: "play",
    label: "Play",
    doLabel: "Do",
    wash: "color-mix(in srgb, var(--mon-wash, #3f8f5b) 16%, transparent)",
  };
}

export function WinconStack({
  plan,
  heading = "Clock, shield, clean",
  lede = "Objective, then the click. The arrow is when you hand the slot.",
  id = "plan",
}: {
  plan: ManualPlanBeat[];
  heading?: string;
  lede?: string;
  id?: string;
}) {
  const beats = plan.filter((b) => b.title || b.play || b.goal);
  if (!beats.length) return null;

  return (
    <section id={id} className={`mt-16 ${MANUAL_SCROLL_MT}`}>
      {heading ? <h2 className="text-2xl font-semibold tracking-tight">{heading}</h2> : null}
      {lede ? <p className="mt-2 max-w-prose text-sm text-muted">{lede}</p> : null}

      <ol className="mt-8 max-w-2xl list-none space-y-0">
        {beats.map((beat, i) => {
          const stance = stanceFor(beat.title || "");
          const last = i === beats.length - 1;
          return (
            <li key={beat.title || i} className="relative">
              <div
                className="overflow-hidden rounded-[28px] border border-line"
                style={{
                  background: `linear-gradient(165deg, ${stance.wash}, transparent 55%), var(--bg-raised)`,
                }}
              >
                <div className="flex flex-wrap items-baseline justify-between gap-2 border-b border-line/80 px-5 py-3">
                  <h3 className="text-lg font-semibold tracking-tight">{beat.title || "Beat"}</h3>
                  <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-muted">{stance.label}</p>
                </div>

                {beat.goal ? (
                  <div className="border-b border-line/60 px-5 py-4">
                    <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-muted">Objective</p>
                    <p className="mt-1.5 text-[17px] font-semibold leading-snug tracking-tight">{beat.goal}</p>
                  </div>
                ) : null}

                {beat.play ? (
                  <div className="px-5 py-4">
                    <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-muted">{stance.doLabel}</p>
                    <p className="mt-1.5 text-[15px] leading-relaxed text-ink/90">{beat.play}</p>
                  </div>
                ) : null}
              </div>

              {!last ? (
                <div className="relative flex flex-col items-center py-1" aria-hidden={false}>
                  <span className="block h-3 w-px bg-line" aria-hidden />
                  <FlowArrow />
                  {beat.next ? (
                    <p className="my-2 max-w-[36ch] rounded-full border border-line bg-sunken/80 px-4 py-2 text-center text-sm leading-snug text-muted">
                      <span className="font-medium text-ink">Then </span>
                      {beat.next}
                    </p>
                  ) : (
                    <span className="my-2 block h-2" aria-hidden />
                  )}
                  <FlowArrow />
                  <span className="block h-3 w-px bg-line" aria-hidden />
                </div>
              ) : beat.next ? (
                <div className="mt-4 flex flex-col items-center">
                  <FlowArrow />
                  <p className="mt-2 max-w-[36ch] rounded-full border border-line bg-sunken/80 px-4 py-2 text-center text-sm leading-snug text-muted">
                    <span className="font-medium text-ink">End </span>
                    {beat.next}
                  </p>
                </div>
              ) : null}
            </li>
          );
        })}
      </ol>
    </section>
  );
}

function FlowArrow() {
  return (
    <svg viewBox="0 0 16 12" className="h-3 w-4 shrink-0 text-muted" aria-hidden>
      <path d="M8 11 1.5 2.5h13Z" fill="currentColor" />
    </svg>
  );
}
