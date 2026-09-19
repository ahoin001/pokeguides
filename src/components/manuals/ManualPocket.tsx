"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { LoadSampleSix } from "@/components/learn/LoadSampleSix";
import { pocketFromManual } from "@/lib/manuals/pocket";
import { formatManualSets } from "@/lib/manuals/sets-text";
import { manualFormat, type TeamManual } from "@/content/manuals";

export function ManualPocket({
  manual,
  packLabel,
}: {
  manual: TeamManual;
  /** Active preview pack name when loading a boxed bring. */
  packLabel?: string;
}) {
  const pocket = pocketFromManual(manual);
  const [copied, setCopied] = useState<"idle" | "ok" | "fail">("idle");
  if (!pocket.never && !pocket.lead && !pocket.switches.length) return null;

  async function copySets() {
    const text = formatManualSets(manual);
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      setCopied("fail");
    }
    window.setTimeout(() => setCopied("idle"), 1800);
  }

  const doubles = manualFormat(manual) === "doubles";
  const loadLabel = packLabel
    ? `Load ${packLabel}`
    : doubles
      ? "Load onto Singles Team"
      : "Load this three";

  return (
    <div className="overflow-hidden rounded-[24px] border border-line bg-raised/50">
      <div className="flex flex-wrap items-start justify-between gap-3 border-b border-line/70 px-4 py-3">
        <div>
          <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.16em] text-muted">
            Cheat sheet
          </p>
          <p className="mt-1 text-sm font-medium tracking-tight">
            {pocket.names.filter(Boolean).join(" · ")}
            {packLabel ? (
              <span className="ml-2 rounded-full border border-line px-2 py-0.5 text-xs font-normal text-muted">
                {packLabel}
              </span>
            ) : null}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Button type="button" variant="line" onClick={() => void copySets()}>
            {copied === "ok" ? "Copied sets" : copied === "fail" ? "Copy failed" : "Copy sets"}
          </Button>
          {manual.slugs.every(Boolean) ? (
            <span id="load" className="inline-flex scroll-mt-[calc(var(--sticky-shell)+var(--sticky-local)+0.5rem)]">
              <LoadSampleSix
                slugs={[...manual.slugs]}
                box={manual.box ? [...manual.box] : undefined}
                intent={manual.archetype}
                stay
                manualId={manual.id}
                label={loadLabel}
              />
            </span>
          ) : null}
        </div>
        {doubles ? (
          <p className="w-full text-xs text-muted">
            Team / Live are Singles tools today — this loads the six for study on the Singles builder.
          </p>
        ) : null}
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
    </div>
  );
}
