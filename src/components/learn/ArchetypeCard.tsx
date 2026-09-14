import Link from "next/link";
import { archetypeHref, MARGIN_LABEL, PACING_LABEL, type ArchetypeGuide } from "@/content/archetypes";

export function ArchetypeCard({ archetype }: { archetype: ArchetypeGuide }) {
  return (
    <Link
      href={archetypeHref(archetype.id)}
      className="block rounded-3xl border border-line bg-raised/50 p-5 hover:bg-raised"
    >
      <h2 className="text-xl font-semibold">{archetype.name}</h2>
      <p className="mt-2 text-sm text-muted">{archetype.oneLiner}</p>
      <p className="mt-3 text-xs text-muted">
        {PACING_LABEL[archetype.pacing]} · {MARGIN_LABEL[archetype.margin]}
      </p>
    </Link>
  );
}
