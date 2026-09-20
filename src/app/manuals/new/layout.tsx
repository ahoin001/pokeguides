import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "New manual",
  description: "Author a local classroom team manual.",
};

export default function NewManualLayout({ children }: { children: ReactNode }) {
  return children;
}
