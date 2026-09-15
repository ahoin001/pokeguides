"use client";

import { useEffect, useState } from "react";
import { flowsFor } from "@/content/classroom-flows";
import type { TeamManual } from "@/content/manuals";

const STORAGE = "ringside-manual-walked";

type Step = { href: string; label: string; hint: string };

function stepsFor(manual: TeamManual): Step[] {
  const flows = flowsFor(manual);
  const lead = flows.find((f) => f.id.includes("lead") || f.title.toLowerCase() === "lead");
  const hasSwitches = (manual.switches ?? []).some((s) => s.into || s.send);
  const ready = manual.slugs.every(Boolean);
  const steps: Step[] = [
    { href: "#doctrine", label: "Doctrine", hint: "The one rule and the Never." },
  ];
  if (lead) steps.push({ href: `#flow-${lead.id}`, label: "Lead", hint: "Tap the first branch for this preview." });
  if (hasSwitches) {
    steps.push({ href: "#switches", label: "Switch", hint: "One row: they click a type, you send." });
  }
  if (ready) steps.push({ href: "#load", label: "Load", hint: "Put the three on Team. Stay on this page." });
  return steps.slice(0, 4);
}

export function ManualWalkthrough({ manual }: { manual: TeamManual }) {
  const steps = stepsFor(manual);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE);
      const seen = raw ? (JSON.parse(raw) as unknown) : [];
      const ids = Array.isArray(seen) ? seen.filter((s): s is string => typeof s === "string") : [];
      if (!ids.includes(manual.id)) setOpen(true);
    } catch {
      setOpen(true);
    }
  }, [manual.id]);

  function dismiss() {
    setOpen(false);
    try {
      const raw = localStorage.getItem(STORAGE);
      const seen = raw ? (JSON.parse(raw) as unknown) : [];
      const ids = Array.isArray(seen) ? seen.filter((s): s is string => typeof s === "string") : [];
      if (!ids.includes(manual.id)) {
        localStorage.setItem(STORAGE, JSON.stringify([...ids, manual.id]));
      }
    } catch {
      /* ignore */
    }
  }

  if (!open || steps.length < 3) return null;

  return (
    <aside className="mt-5 max-w-3xl rounded-[24px] border border-line bg-raised/40 px-4 py-3">
      <div className="flex items-start justify-between gap-3">
        <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.16em] text-muted">First read</p>
        <button type="button" onClick={dismiss} className="text-xs text-muted hover:text-ink">
          Skip
        </button>
      </div>
      <ol className="mt-3 grid gap-2 sm:grid-cols-2">
        {steps.map((step, i) => (
          <li key={step.href}>
            <a
              href={step.href}
              onClick={() => {
                if (i === steps.length - 1) dismiss();
              }}
              className="block rounded-2xl bg-white/5 px-3 py-2.5 transition hover:bg-white/8"
            >
              <span className="font-mono text-[10px] text-muted">{i + 1}</span>
              <span className="ml-2 text-sm font-medium">{step.label}</span>
              <span className="mt-0.5 block text-xs text-muted">{step.hint}</span>
            </a>
          </li>
        ))}
      </ol>
    </aside>
  );
}
