import { PageFrame } from "@/components/chrome/PageFrame";
import { MyBoxBoard } from "@/components/team/MyBoxBoard";

export const metadata = {
  title: "My box",
  description: "Your Champions collection — local box for building threes.",
};

export default function MyBoxPage() {
  return (
    <PageFrame variant="board">
      <MyBoxBoard />
    </PageFrame>
  );
}
