import { CANONICAL_MANUALS } from "@/content/manuals";
import { ManualDetail } from "@/components/manuals/ManualDetail";

export function generateStaticParams() {
  return CANONICAL_MANUALS.map((m) => ({ id: m.id }));
}

export default async function ManualPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <ManualDetail id={id} />;
}
