import { PageFrame } from "@/components/chrome/PageFrame";
import { LiveMatchStage } from "@/components/live/LiveMatchStage";

export const metadata = {
  title: "Live Match · Ringside",
  description: "Log their lead, compare Spe and stats, read the kit — stadium tool for the clock.",
};

export default function LiveMatchPage() {
  return (
    <PageFrame variant="board" sticky="shell" className="pb-28 md:pb-24">
      <LiveMatchStage />
    </PageFrame>
  );
}
