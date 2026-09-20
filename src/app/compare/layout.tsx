import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Compare",
  description: "Side-by-side Pokémon comparison for Champions.",
};

export default function CompareLayout({ children }: { children: ReactNode }) {
  return children;
}
