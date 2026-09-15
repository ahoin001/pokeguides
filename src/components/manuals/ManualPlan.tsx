import type { ManualPlanBeat } from "@/content/manuals";
import { WinconStack } from "@/components/learn/WinconStack";

export function ManualPlan({ plan }: { plan: ManualPlanBeat[] }) {
  return (
    <WinconStack
      plan={plan}
      heading="How a game goes"
      lede="Objective, then set / defend / push. The arrow is when you hand the slot."
    />
  );
}
