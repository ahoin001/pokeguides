import { ArrowRight } from "@phosphor-icons/react";
import { PokemonArt } from "@/components/pokemon/PokemonArt";
import { getPokemon } from "@/lib/catalog/load";
import type { ManualBranch, ManualPhase } from "@/content/manuals";

function groupBranches(branches: ManualBranch[]) {
  const groups: { out?: string; items: ManualBranch[] }[] = [];
  for (const branch of branches) {
    const last = groups[groups.length - 1];
    if (last && last.out === branch.out) last.items.push(branch);
    else groups.push({ out: branch.out, items: [branch] });
  }
  return groups;
}

export function ManualBranches({ phase }: { phase: ManualPhase }) {
  const branches = phase.branches.filter((b) => b.when || b.then);
  if (!branches.length) return null;
  const groups = groupBranches(branches);

  return (
    <section id={phase.id} className="mt-16 scroll-mt-28 md:scroll-mt-36">
      <h2 className="text-2xl font-semibold tracking-tight">{phase.title}</h2>
      {phase.lede ? <p className="mt-2 max-w-[52ch] text-sm text-muted">{phase.lede}</p> : null}
      <div className="mt-5 overflow-hidden rounded-3xl border border-line bg-raised/40">
        {groups.map((group, gi) => {
          const mon = group.out ? getPokemon(group.out) : undefined;
          return (
            <div key={`${phase.id}-${group.out ?? "field"}-${gi}`} className={gi > 0 ? "border-t border-line" : ""}>
              {group.out ? (
                <div className="flex items-center gap-2 border-b border-line/80 bg-white/[0.03] px-4 py-2">
                  {mon ? <PokemonArt slug={mon.slug} src={mon.sprite || mon.artwork} name={mon.name} size={32} /> : null}
                  <p className="text-sm font-medium">{mon?.name ?? group.out} is out</p>
                </div>
              ) : null}
              <ol>
                {group.items.map((branch, i) => (
                  <li
                    key={`${phase.id}-${gi}-${i}`}
                    className="border-b border-line/70 px-4 py-3.5 last:border-b-0"
                  >
                    <div className="grid items-start gap-2 sm:grid-cols-[minmax(0,1fr)_1.25rem_minmax(0,1.15fr)] sm:gap-3">
                      <div>
                        <p className="text-[10px] font-medium uppercase tracking-wide text-muted">If</p>
                        <p className="mt-1 text-sm leading-snug text-muted">{branch.when}</p>
                      </div>
                      <ArrowRight
                        size={14}
                        weight="bold"
                        className="mt-5 hidden text-muted/70 sm:block"
                        aria-hidden
                      />
                      <div>
                        <p className="text-[10px] font-medium uppercase tracking-wide text-muted">Then</p>
                        <p className="mt-1 font-medium leading-snug">{branch.then}</p>
                      </div>
                    </div>
                    {branch.why ? <p className="mt-2 text-xs leading-snug text-muted">{branch.why}</p> : null}
                  </li>
                ))}
              </ol>
            </div>
          );
        })}
      </div>
    </section>
  );
}
