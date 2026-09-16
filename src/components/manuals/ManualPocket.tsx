"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { LoadSampleSix } from "@/components/learn/LoadSampleSix";
import { pocketFromManual } from "@/lib/manuals/pocket";
import { formatManualSets } from "@/lib/manuals/sets-text";
import { MANUAL_SCROLL_MT } from "@/components/manuals/ManualToc";
import type { TeamManual } from "@/content/manuals";

export function ManualPocket({ manual }: { manual: TeamManual }) {
  const pocket = pocketFromManual(manual);
  const [copied, setCopied] = useState<"idle" | "ok" | "fail">("idle");
  if (!pocket.never && !pocket.lead && !pocket.switches.length) return null;

  async function copySets() {
    const text = formatManualSets(manual);
    try {
      await navigator.clipboard.writeText(text);
      setCopied("ok");
    } catch {
      setCopied("fail");
    }
    window.setTimeout(() => setCopied("idle"), 1800);
  }

  return (
    <section
      id="pocket"
      className={`${MANUAL_SCROLL_MT} mt-6 overflow-hidden rounded-[24px] border border-line bg-raised/50`}
    >
      <div className="flex flex-wrap items-start justify-between gap-3 border-b border-line/70 px-4 py-3">
        <div>
          <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.16em] text-muted">Pocket</p>
          <p className="mt-1 text-sm font-medium tracking-tight">{pocket.names.filter(Boolean).join(" · ")}</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Button type="button" variant="line" onClick={() => void copySets()}>
            {copied === "ok" ? "Copied sets" : copied === "fail" ? "Copy failed" : "Copy sets"}
          </Button>
          {manual.slugs.every(Boolean) ? (
            <LoadSampleSix
              slugs={[...manual.slugs]}
              box={manual.box ? [...manual.box] : undefined}
              intent={manual.archetype}
              stay
              manualId={manual.id}
            />
          ) : null}
        </div>
      </div>
      <dl className="grid gap-0 sm:grid-cols-2">
        {pocket.lead ? (
          <div className="border-b border-line/70 px-4 py-3 sm:border-r">
            <dt className="font-mono text-[10px] font-semibold uppercase tracking-[0.14em] text-[#9cbcff]">
              Default lead
            </dt>
            <dd className="mt-1.5 text-sm leading-relaxed">{pocket.lead}</dd>
          </div>
        ) : null}
        {pocket.never ? (
          <div className="border-b border-line/70 px-4 py-3">
            <dt className="font-mono text-[10px] font-semibold uppercase tracking-[0.14em] text-[#f0c040]">
              Never
            </dt>
            <dd className="mt-1.5 text-sm leading-relaxed">{pocket.never}</dd>
          </div>
        ) : null}
      </dl>
      {pocket.switches.length ? (
        <ul className="divide-y divide-line/60">
          {pocket.switches.map((row) => (
            <li key={`${row.into}-${row.send}`} className="flex gap-3 px-4 py-2 text-sm">
              <span className="w-28 shrink-0 font-medium sm:w-36">{row.into}</span>
              <span className="text-muted">{row.send}</span>
            </li>
          ))}
        </ul>
      ) : null}
    </section>
  );
}
