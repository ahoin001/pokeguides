import type { Metadata } from "next";
import { Suspense, type ReactNode } from "react";

export const metadata: Metadata = {
  title: "Moves & abilities",
  description: "Champions move and ability appendix — searchable, filterable reference.",
};

function MovesFallback() {
  return (
    <div>
      <h1 className="text-4xl font-semibold tracking-tight">Move appendix</h1>
      <p className="mt-2 text-muted">Loading Champions moves and abilities…</p>
    </div>
  );
}

export default function MovesLayout({ children }: { children: ReactNode }) {
  return <Suspense fallback={<MovesFallback />}>{children}</Suspense>;
}
