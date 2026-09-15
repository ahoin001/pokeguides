import type { ManualPlanBeat } from "@/content/manuals";

export function ManualPlan({ plan }: { plan: ManualPlanBeat[] }) {
  const beats = plan.filter((b) => b.title || b.play || b.goal);
  if (!beats.length) return null;

  return (
    <section id="plan" className="mt-16 scroll-mt-28 md:scroll-mt-36">
      <h2 className="text-2xl font-semibold tracking-tight">How a game goes</h2>
      <p className="mt-2 max-w-prose text-sm text-muted">The default script. Preview and Lead are the exceptions.</p>
      <ol className="mt-5 grid gap-px overflow-hidden rounded-3xl border border-line bg-line md:grid-cols-3">
        {beats.map((beat, i) => (
          <li key={beat.title || i} className="bg-raised/90 px-4 py-4">
            <p className="text-[10px] font-medium uppercase tracking-wide text-muted">
              {i + 1} · {beat.goal}
            </p>
            <h3 className="mt-1 font-semibold tracking-tight">{beat.title}</h3>
            {beat.play ? <p className="mt-2 text-sm leading-relaxed">{beat.play}</p> : null}
            {beat.next ? (
              <p className="mt-2 text-sm text-muted">
                <span className="font-medium text-ink">Then </span>
                {beat.next}
              </p>
            ) : null}
          </li>
        ))}
      </ol>
    </section>
  );
}
