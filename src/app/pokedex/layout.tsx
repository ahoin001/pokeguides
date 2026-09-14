import { Suspense, type ReactNode } from "react";

function RosterFallback() {
  return (
    <div>
      <h1 className="text-4xl font-semibold tracking-tight">Legal roster</h1>
      <p className="mt-2 text-muted">Loading the catalog…</p>
    </div>
  );
}

export default function PokedexLayout({ children }: { children: ReactNode }) {
  return <Suspense fallback={<RosterFallback />}>{children}</Suspense>;
}
