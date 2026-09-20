import type { Metadata } from "next";
import type { ReactNode } from "react";
import { getCanonicalManual } from "@/content/manuals";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const manual = getCanonicalManual(id);
  if (manual) return { title: `Edit · ${manual.title}` };
  return { title: "Edit manual" };
}

export default function EditManualLayout({ children }: { children: ReactNode }) {
  return children;
}
