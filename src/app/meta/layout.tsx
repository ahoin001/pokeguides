import { Suspense, type ReactNode } from "react";
import { RankedModeTabs } from "@/components/meta/RankedModeTabs";

function MetaFallback() {
  return (
    <div>
      <h1 className="text-4xl font-semibold tracking-tight">Ranked singles</h1>
      <p className="mt-2 text-muted">Loading the board…</p>
    </div>
  );
}

export default function MetaLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <Suspense fallback={null}>
        <RankedModeTabs />
      </Suspense>
      <Suspense fallback={<MetaFallback />}>{children}</Suspense>
    </>
  );
}
