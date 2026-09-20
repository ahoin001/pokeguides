"use client";

import { ManualSection } from "@/components/manuals/ManualSection";
import { ManualWinPath } from "@/components/manuals/ManualWinPath";
import { ManualGameplan } from "@/components/manuals/ManualGameplan";
import { ManualGameBoard } from "@/components/manuals/ManualGameBoard";
import { ManualInsights } from "@/components/manuals/ManualInsights";
import { ManualBriefing } from "@/components/manuals/ManualBriefing";
import { TeamCoverage } from "@/components/manuals/TeamCoverage";
import {
  resolvePackStrategy,
  type ManualPack,
  type TeamManual,
} from "@/content/manuals";
import type { CoverageMember } from "@/lib/champions/team-coverage";
import { flowsFor } from "@/content/classroom-flows";

export function ManualPackageGuide({
  parent,
  manual,
  pack,
  coverageMembers,
}: {
  parent: TeamManual;
  manual: TeamManual;
  pack?: ManualPack;
  coverageMembers: CoverageMember[];
}) {
  const strategy = pack ? resolvePackStrategy(pack) : null;
  const hazards = manual.hazards.filter((h) => h.title || h.body);
  const advantages = (manual.advantages ?? []).filter((a) => a.title || a.body);
  const victims = (manual.victims ?? []).filter((v) => v.name || v.why);
  const counters = (manual.counters ?? []).filter((c) => c.name || c.why);
  const hasMatchups = Boolean(victims.length || counters.length || advantages.length || hazards.length);
  const endgames = parent.construction?.endgames ?? [];
  const hasWinPath = Boolean(endgames.length || strategy?.winCondition);
  const hasGameplan = Boolean(strategy || manual.plan?.some((b) => b.title || b.play));
  const flows = flowsFor(manual);
  const hasGame =
    flows.length > 0 ||
    manual.loops.some((l) => l.title || l.body) ||
    (manual.switches ?? []).some((s) => s.into || s.send) ||
    Boolean(pack?.gameStates?.length);

  const hasBody =
    strategy || hasWinPath || hasGameplan || hasGame || hasMatchups || coverageMembers.length > 0;

  if (!hasBody) return null;

  return (
    <ManualSection
      id="guide"
      title={pack ? `${pack.label} guide` : "Package guide"}
      purpose="What this three is trying to do, what it refuses, how it wins, who leads, and when to switch."
    >
      <div className="space-y-10">
        {strategy ? (
          <div className="grid gap-3 sm:grid-cols-3">
            <div className="rounded-2xl border border-line bg-raised/40 p-4">
              <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.14em] text-muted">
                Trying to
              </p>
              <p className="mt-2 text-sm leading-snug">{strategy.purpose || strategy.winCondition}</p>
            </div>
            <div className="rounded-2xl border border-line bg-raised/40 p-4">
              <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.14em] text-muted">
                Wins by
              </p>
              <p className="mt-2 text-sm leading-snug">{strategy.winCondition || "TODO"}</p>
            </div>
            <div className="rounded-2xl border border-line bg-raised/40 p-4">
              <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.14em] text-muted">
                Refuse
              </p>
              <p className="mt-2 text-sm leading-snug">
                {strategy.refuses.filter(Boolean).join(" · ") || "TODO"}
              </p>
            </div>
          </div>
        ) : null}

        {hasWinPath ? <ManualWinPath parent={parent} pack={pack} /> : null}

        <TeamCoverage
          members={coverageMembers}
          notes={pack?.coverageNotes ?? manual.coverageNotes}
          defaultOpen
          title="Strengths / holes"
        />

        {hasGameplan ? (
          <div>
            <h3 className="text-xl font-semibold tracking-tight">Lead and clock</h3>
            <div className="mt-4">
              <ManualGameplan parent={parent} pack={pack} plan={manual.plan ?? []} />
            </div>
          </div>
        ) : null}

        {hasGame ? (
          <ManualGameBoard framed={false} key={pack?.id ?? "default"} manual={manual} pack={pack} parent={parent} />
        ) : null}

        {hasMatchups ? (
          <div>
            <h3 className="text-xl font-semibold tracking-tight">Matchups</h3>
            <div className="mt-4">
              <ManualInsights
                victims={victims}
                counters={counters}
                advantages={advantages}
                hazards={hazards}
              />
            </div>
          </div>
        ) : null}

        <ManualBriefing manual={manual} />
      </div>
    </ManualSection>
  );
}
