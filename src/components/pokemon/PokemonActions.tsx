"use client";

import Link from "next/link";
import { useCompareStore } from "@/stores/compare";
import { useTeamStore } from "@/stores/team";

export function PokemonActions({ slug }: { slug: string }) {
  const addTeam = useTeamStore((s) => s.add);
  const toggle = useCompareStore((s) => s.toggle);
  const compared = useCompareStore((s) => s.slugs.includes(slug));
  return (
    <div className="mt-6 flex flex-wrap gap-3">
      <button
        type="button"
        onClick={() => addTeam(slug)}
        className="rounded-full bg-ink px-4 py-2 text-sm font-medium text-bg"
      >
        Add to team
      </button>
      <button
        type="button"
        onClick={() => toggle(slug)}
        className="rounded-full border border-line px-4 py-2 text-sm"
      >
        {compared ? "In compare" : "Compare"}
      </button>
      <Link href="/compare" className="rounded-full px-4 py-2 text-sm text-muted">
        Open compare
      </Link>
    </div>
  );
}
