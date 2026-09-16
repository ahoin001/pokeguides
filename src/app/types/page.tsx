import { PageFrame } from "@/components/chrome/PageFrame";
import { TypeSheet } from "@/components/viz/TypeSheet";

export default function TypesPage() {
  return (
    <PageFrame variant="tool">
      <h1 className="text-4xl font-semibold tracking-tight">Type sheet</h1>
      <div className="mt-8">
        <TypeSheet />
      </div>
    </PageFrame>
  );
}
