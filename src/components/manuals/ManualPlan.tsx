import type { ManualPlanBeat } from "@/content/manuals";
import { WinconStack } from "@/components/learn/WinconStack";

export function ManualPlan({ plan }: { plan: ManualPlanBeat[] }) {
  return <WinconStack plan={plan} heading="" lede="" id={false} />;
}
