"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { MANUAL_SCROLL_MT } from "@/components/manuals/ManualToc";
import { sameThree, useTeamStore } from "@/stores/team";
import type { ArchetypeId } from "@/types/pokemon";

export function LoadSampleSix({
  slugs,
  label = "Load this three",
  intent = null,
  stay = false,
  manualId = null,
  box,
}: {
  slugs: string[];
  label?: string;
  intent?: ArchetypeId | null;
  /** Keep the current page open (manuals). Learn still jumps to Team. */
  stay?: boolean;
  manualId?: string | null;
  /** Optional registered six. Team stays the bring-three. */
  box?: string[];
}) {
  const loadThree = useTeamStore((s) => s.loadThree);
  const onTeam = useTeamStore((s) => sameThree(s.slugs, slugs) && (!manualId || s.manualId === manualId));
  const router = useRouter();
  const [justLoaded, setJustLoaded] = useState(false);
  const loaded = stay && (justLoaded || onTeam);

  return (
    <div id={stay ? "load" : undefined} className={`${stay ? `${MANUAL_SCROLL_MT} relative z-30` : ""} flex flex-wrap items-center gap-3`}>
      <Button
        type="button"
        onClick={() => {
          loadThree(slugs, intent, manualId, box);
          if (stay) setJustLoaded(true);
          else router.push("/team");
        }}
      >
        {loaded ? "Loaded on Team" : label}
      </Button>
      {loaded ? (
        <>
          <p className="text-sm text-muted">This three is on Team. Stay here to play it.</p>
          <Link href="/team" className="text-sm font-medium underline">
            Open Team
          </Link>
        </>
      ) : null}
    </div>
  );
}
