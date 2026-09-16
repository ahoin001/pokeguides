import {
  CalloutBeat,
  ClassroomLead,
  RulesGrid,
  StrategyBeat,
} from "@/components/learn/ClassroomChrome";
import type { Lesson } from "@/content/curriculum";

const CALLOUT = new Set(["Disguise", "Multiscale", "Unaware"]);

export function AbilitiesClassroom({ lesson }: { lesson: Lesson }) {
  return (
    <div className="mt-10 space-y-16">
      <ClassroomLead lesson={lesson} />

      <RulesGrid
        title="Ability jobs on a three"
        lede="Learn the ability first. Faces below are who packs it in ranked — not the definition."
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
