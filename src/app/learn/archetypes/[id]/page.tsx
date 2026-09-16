import { redirect } from "next/navigation";
import { ARCHETYPE_IDS } from "@/types/pokemon";

export function generateStaticParams() {
  return ARCHETYPE_IDS.map((id) => ({ id }));
}

/** Canonical playbooks live under /team/archetypes. */
export default async function LearnArchetypeRedirect({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  redirect(`/team/archetypes/${id}`);
}
