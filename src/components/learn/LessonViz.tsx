import { TypePlayground } from "@/components/viz/TypePlayground";
import { RosterBoard } from "@/components/learn/RosterBoard";
import { PlaystyleChooser } from "@/components/learn/PlaystyleChooser";
import { StadiumTray } from "@/components/learn/StadiumTray";
import { AbilityCards } from "@/components/learn/AbilityCards";
import { TrainingViz } from "@/components/learn/TrainingViz";
import { SpeedClassroom } from "@/components/learn/SpeedClassroom";
import { WinconStack } from "@/components/learn/WinconStack";
import { PreviewBoard } from "@/components/learn/PreviewBoard";
import { HolesCompare } from "@/components/learn/HolesCompare";
import { ArchetypeTellBoard } from "@/components/learn/ArchetypeTellBoard";
import { DecisionTree } from "@/components/learn/DecisionTree";
import { BUILDING_PLAN, JOB_ROSTER, type Lesson } from "@/content/curriculum";
import { getLearnFlow } from "@/content/learn-flows";

export function LessonViz({ lesson }: { lesson: Lesson }) {
  switch (lesson.viz) {
    case "stadium": {
      const doubles = lesson.track === "doubles";
      return (
        <StadiumTray
          format={doubles ? "doubles" : "singles"}
          you={lesson.examples.slice(0, doubles ? 4 : 3)}
          youLabel={doubles ? "A doubles four" : "Your three — open list"}
          themLabel={doubles ? "Theirs — empty until you pick four" : undefined}
        />
      );
    }
    case "types":
      return <TypePlayground seed="fairy" />;
    case "ability-field":
      return <AbilityCards beats={lesson.beats} />;
    case "flowchart": {
      const flow = lesson.flowId ? getLearnFlow(lesson.flowId) : undefined;
      return flow ? <DecisionTree flow={flow} compact /> : null;
    }
    case "training":
      return <TrainingViz />;
    case "speed-tape":
      return <SpeedClassroom />;
    case "roster":
      return <RosterBoard roster={JOB_ROSTER} />;
    case "wincon-stack":
      return <WinconStack plan={BUILDING_PLAN} heading="" lede="" id="wincon" />;
    case "chooser":
      return <PlaystyleChooser />;
    case "matchup":
      return <HolesCompare />;
    case "preview-board":
      return <PreviewBoard />;
    case "archetype-tells":
      return <ArchetypeTellBoard />;
    default:
      return null;
  }
}
