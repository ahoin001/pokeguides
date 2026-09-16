import {
  CalloutBeat,
  ClassroomLead,
  RulesGrid,
  StrategyBeat,
} from "@/components/learn/ClassroomChrome";
import type { Lesson } from "@/content/curriculum";

export function MovesClassroom({ lesson }: { lesson: Lesson }) {
  const [fakeOut, protect, pivot, dance, status, once] = lesson.beats;

  return (
    <div className="mt-10 space-y-16">
      <ClassroomLead lesson={lesson} />

      <RulesGrid
        title="Turn verbs"
        lede="Each click is a sentence. Cover two answers when you can. Do not donate a free hit."
        rules={lesson.rules ?? []}
      />

      {fakeOut ? <StrategyBeat beat={fakeOut} /> : null}
      {protect ? <CalloutBeat beat={protect} /> : null}
      {pivot ? <StrategyBeat beat={pivot} flip /> : null}
      {dance ? <StrategyBeat beat={dance} /> : null}
      {status ? <CalloutBeat beat={status} /> : null}
      {once ? <StrategyBeat beat={once} flip /> : null}
    </div>
  );
}
