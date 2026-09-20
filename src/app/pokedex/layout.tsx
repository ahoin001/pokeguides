import type { Metadata } from "next";
import { Suspense, type ReactNode } from "react";

export const metadata: Metadata = {
  title: "Legal roster",
  description: "Browse the Champions Regulation M-C legal catalog.",
};

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
