"use client";

import { MANUAL_SCROLL_MT } from "@/components/manuals/ManualToc";
import type { ManualSwitch } from "@/content/manuals";

export function ManualSwitchStrip({ switches }: { switches: ManualSwitch[] }) {
  if (!switches.length) return null;

  return (
    <section id="switches" className={`mt-6 ${MANUAL_SCROLL_MT}`}>
      <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-muted">Switches</p>
      <ul className="mt-3 overflow-hidden rounded-2xl border border-line bg-raised/40">
        {switches.map((row) => (
          <li
            key={`${row.into}-${row.send}`}
            className="grid grid-cols-[1fr_auto_1fr] items-baseline gap-3 border-t border-line/70 px-4 py-2.5 first:border-t-0"
          >
            <p className="text-sm font-medium">{row.into}</p>
            <p className="font-mono text-[10px] uppercase tracking-wide text-muted">send</p>
            <p className="text-sm font-medium">{row.send}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}
