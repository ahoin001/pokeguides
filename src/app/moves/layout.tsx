import { Suspense, type ReactNode } from "react";

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
