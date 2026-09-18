import {
  CalloutBeat,
  ClassroomLead,
  RulesGrid,
  StrategyBeat,
} from "@/components/learn/ClassroomChrome";
import type { Lesson } from "@/content/curriculum";

const CALLOUT = new Set(["Disguise", "Multiscale", "Unaware", "Cursed Body", "Armor Tail"]);

export function AbilitiesClassroom({ lesson }: { lesson: Lesson }) {
  return (
    <div className="mt-10 space-y-16">
      <ClassroomLead lesson={lesson} />

      <RulesGrid
        title="Ability reference"
        lede="Each ability below: what it does, how you counter it, and which faces often carry it in ranked."
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
