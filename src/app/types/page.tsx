import { PageFrame } from "@/components/chrome/PageFrame";
import { TypeSheet } from "@/components/viz/TypeSheet";

export default function TypesPage() {
  return (
    <PageFrame variant="tool">
      <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">Type sheet</h1>
      <div className="mt-6 md:mt-8">
        <TypeSheet />
      </div>
    </PageFrame>
  );
}
