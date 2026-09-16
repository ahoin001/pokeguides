import {
  CalloutBeat,
  ClassroomLead,
  RulesGrid,
  StrategyBeat,
} from "@/components/learn/ClassroomChrome";
import type { Lesson } from "@/content/curriculum";

const CALLOUT = new Set(["Support", "Mega"]);

export function JobsClassroom({ lesson }: { lesson: Lesson }) {
  return (
    <div className="mt-10 space-y-16">
      <ClassroomLead lesson={lesson} />

      <RulesGrid
        title="Five jobs on a three"
        lede="Build from the job, not the name. Faces below are who fills it in ranked — not the definition."
        rules={lesson.rules ?? []}
      />

      {lesson.beats.map((beat, i) =>
        CALLOUT.has(beat.title) ? (
          <CalloutBeat key={beat.title} beat={beat} />
        ) : (
          <StrategyBeat key={beat.title} beat={beat} flip={i % 2 === 1} />
        ),
      )}
    </div>
  );
}
