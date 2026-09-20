import type { Metadata } from "next";
import { Suspense, type ReactNode } from "react";

export const metadata: Metadata = {
  title: "Search",
  description: "Pokémon, moves, and abilities on the Champions Regulation M-C roster — filter by BSS role.",
};

function RosterFallback() {
  return (
    <div>
      <h1 className="text-4xl font-semibold tracking-tight">Search</h1>
      <p className="mt-2 text-muted">Loading the catalog…</p>
    </div>
  );
}

export default function PokedexLayout({ children }: { children: ReactNode }) {
  return <Suspense fallback={<RosterFallback />}>{children}</Suspense>;
}
