import type { Metadata } from "next";
import { Suspense, type ReactNode } from "react";

export const metadata: Metadata = {
  title: "Field manuals",
  description: "Classroom team manuals for Champions Singles.",
};

function ManualsFallback() {
  return (
    <div>
      <h1 className="text-4xl font-semibold tracking-tight">Classroom manuals</h1>
      <p className="mt-2 text-muted">Loading the shelf…</p>
    </div>
  );
}

export default function ManualsLayout({ children }: { children: ReactNode }) {
  return <Suspense fallback={<ManualsFallback />}>{children}</Suspense>;
}
