import { CANONICAL_MANUALS, getCanonicalManual } from "@/content/manuals";
import { ManualDetail } from "@/components/manuals/ManualDetail";
import type { Metadata } from "next";

export function generateStaticParams() {
  return CANONICAL_MANUALS.map((m) => ({ id: m.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const manual = getCanonicalManual(id);
  if (!manual) return { title: "Manual" };
  return {
    title: manual.title,
    description: manual.lede,
  };
}

export default async function ManualPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <ManualDetail id={id} />;
}
