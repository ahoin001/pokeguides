import { notFound } from "next/navigation";
import { PageFrame } from "@/components/chrome/PageFrame";
import { ArchetypePlaybook } from "@/components/team/ArchetypePlaybook";
import { ARCHETYPES, getArchetypePlaybook, ARCHETYPE_LABEL } from "@/content/archetypes";
import { ARCHETYPE_IDS } from "@/types/pokemon";

export function generateStaticParams() {
  return ARCHETYPE_IDS.map((id) => ({ id }));
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const style = getArchetypePlaybook(id);
  if (!style) return { title: "Archetype · Ringside" };
  return {
    title: `${ARCHETYPE_LABEL[style.id]} · Team archetypes · Ringside`,
    description: style.oneLiner,
  };
}

export default async function TeamArchetypePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const style = getArchetypePlaybook(id);
  if (!style) notFound();
  const idx = ARCHETYPES.findIndex((a) => a.id === style.id);
  const prev = ARCHETYPES[idx - 1];
  const next = ARCHETYPES[idx + 1];

  return (
    <PageFrame variant="board">
      <ArchetypePlaybook style={style} prevId={prev?.id} nextId={next?.id} />
    </PageFrame>
  );
}
