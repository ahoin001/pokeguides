import {
  CalloutBeat,
  ClassroomLead,
  RulesGrid,
  StrategyBeat,
} from "@/components/learn/ClassroomChrome";
import type { Lesson } from "@/content/curriculum";

export function AbilitiesClassroom({ lesson }: { lesson: Lesson }) {
  const [intimidate, disguise, prankster, mold, unaware, field, info] = lesson.beats;

  return (
    <div className="mt-10 space-y-16">
      <ClassroomLead lesson={lesson} />

      <RulesGrid
        title="Ability jobs on a three"
        lede="Six verbs. If it is on their card, the rest of the game should cash it or deny it."
        rules={lesson.rules ?? []}
      />

      {intimidate ? <StrategyBeat beat={intimidate} /> : null}
      {disguise ? <CalloutBeat beat={disguise} /> : null}
      {prankster ? <StrategyBeat beat={prankster} flip /> : null}
      {mold ? <StrategyBeat beat={mold} /> : null}
      {unaware ? <CalloutBeat beat={unaware} /> : null}
      {field ? <StrategyBeat beat={field} flip /> : null}
      {info ? <StrategyBeat beat={info} /> : null}
    </div>
  );
}
