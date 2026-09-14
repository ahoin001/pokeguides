import type { ManualPhase } from "@/content/manuals";

export function ManualBranches({ phase }: { phase: ManualPhase }) {
  const branches = phase.branches.filter((b) => b.when || b.then);
  if (!branches.length) return null;

  return (
    <section id={phase.id} className="mt-16 scroll-mt-28 md:scroll-mt-36">
      <h2 className="text-2xl font-semibold tracking-tight">{phase.title}</h2>
      {phase.lede ? <p className="mt-2 text-sm text-muted">{phase.lede}</p> : null}
      <ol className="mt-5 divide-y divide-line overflow-hidden rounded-3xl border border-line bg-raised/40">
        {branches.map((branch, i) => (
          <li key={`${phase.id}-${i}`} className="grid gap-3 p-4 sm:grid-cols-2">
            <div>
              <p className="text-[11px] font-medium uppercase tracking-wide text-muted">If</p>
              <p className="mt-1 font-medium leading-snug">{branch.when}</p>
            </div>
            <div>
              <p className="text-[11px] font-medium uppercase tracking-wide text-muted">Then</p>
              <p className="mt-1 font-medium leading-snug">{branch.then}</p>
            </div>
            {branch.why ? <p className="text-sm leading-snug text-muted sm:col-span-2">{branch.why}</p> : null}
          </li>
        ))}
      </ol>
    </section>
  );
}
