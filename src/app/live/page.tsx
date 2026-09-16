import { PageFrame } from "@/components/chrome/PageFrame";
import { LiveMatchStage } from "@/components/live/LiveMatchStage";

export const metadata = {
  title: "Live Match · Ringside",
  description: "Stadium tool — your six, their preview, kits, and Champions damage calc.",
};

export default function LiveMatchPage() {
  return (
    <PageFrame variant="board" sticky="shell" className="pb-52 md:pb-44">
      <LiveMatchStage />
    </PageFrame>
  );
}
