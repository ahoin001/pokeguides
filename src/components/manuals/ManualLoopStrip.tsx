"use client";

import { MANUAL_SCROLL_MT } from "@/components/manuals/ManualToc";

function recipeSteps(body: string): string[] {
  return body
    .split(/(?<=[.!?])\s+/)
    .map((s) => s.trim())
    .filter(Boolean);
}

function splitWhen(body: string): { when?: string; steps: string[] } {
  const steps = recipeSteps(body);
  if (steps.length < 2) return { steps };
  const first = steps[0];
  if (/^(if|when|use when|only when)\b/i.test(first) || first.length < 90) {
    return { when: first.replace(/^use when\s+/i, "").replace(/\.$/, ""), steps: steps.slice(1) };
  }
  return { steps };
}

export function ManualLoopStrip({
  loops,
  embed = false,
}: {
  loops: { title: string; body: string }[];
  embed?: boolean;
}) {
  if (!loops.length) return null;

  return (
    <section id={embed ? undefined : "loops"} className={embed ? "" : `mt-8 ${MANUAL_SCROLL_MT}`}>
      {embed ? null : (
        <div className="flex flex-wrap items-end justify-between gap-2">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-muted">Named plays</p>
            <h3 className="mt-1 text-lg font-semibold tracking-tight">Recipes you repeat</h3>
          </div>
        </div>
      )}
      <ul className={`${embed ? "mt-0" : "mt-4"} grid gap-3 md:grid-cols-2 xl:grid-cols-3`}>
        {loops.map((loop) => {
          const { when, steps } = splitWhen(loop.body);
          const list = steps.length ? steps : [loop.body];
          return (
            <li
              key={loop.title}
              className="flex flex-col overflow-hidden rounded-[24px] border border-line bg-raised/40"
            >
              <div className="border-b border-line/60 px-4 py-3">
                <p className="font-semibold tracking-tight">{loop.title}</p>
                {when ? (
                  <p className="mt-1.5 text-sm text-muted">
                    <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-[#9cbcff]">
                      Use when{" "}
                    </span>
                    {when}
                  </p>
                ) : null}
              </div>
              <ol className="flex flex-1 flex-col gap-2.5 px-4 py-3">
                {list.map((step, i) => (
                  <li key={i} className="flex gap-3 text-sm leading-relaxed">
                    <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-white/8 font-mono text-[10px] text-muted">
                      {i + 1}
                    </span>
                    <span className="text-ink/90">{step}</span>
                  </li>
                ))}
              </ol>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
