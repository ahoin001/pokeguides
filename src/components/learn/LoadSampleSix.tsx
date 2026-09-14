"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { useTeamStore } from "@/stores/team";
import type { ArchetypeId } from "@/types/pokemon";

export function LoadSampleSix({
  slugs,
  label = "Load onto team",
  intent = null,
}: {
  slugs: string[];
  label?: string;
  intent?: ArchetypeId | null;
}) {
  const loadSix = useTeamStore((s) => s.loadSix);
  const router = useRouter();

  return (
    <Button
      type="button"
      onClick={() => {
        loadSix(slugs, intent);
        router.push("/team");
      }}
    >
      {label}
    </Button>
  );
}
