import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Team builder",
  description: "Build a Champions three around one win condition.",
};

export default function TeamLayout({ children }: { children: ReactNode }) {
  return children;
}
