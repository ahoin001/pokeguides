"use client";

import { useEffect, useMemo, useState } from "react";
import { flowsFor } from "@/content/classroom-flows";
import type { TeamManual } from "@/content/manuals";

export const MANUAL_SCROLL_MT = "scroll-mt-[4.25rem] md:scroll-mt-[8.25rem]";

export function manualJumps(manual: TeamManual) {
  return [
    { href: "#top", label: "Top" },
    { href: "#three", label: "The three" },
    { href: "#scout", label: "Vs scout" },
    ...(manual.plan?.some((b) => b.title || b.play) ? [{ href: "#plan", label: "Plan" }] : []),
    ...flowsFor(manual).map((flow) => ({ href: `#flow-${flow.id}`, label: flow.title })),
    ...(manual.loops.some((l) => l.title || l.body) ? [{ href: "#loops", label: "Loops" }] : []),
    ...((manual.switches ?? []).some((s) => s.into || s.send) ? [{ href: "#switches", label: "Switches" }] : []),
    ...(manual.victims?.some((v) => v.name || v.why) ||
    manual.counters?.some((c) => c.name || c.why) ||
    manual.advantages?.some((a) => a.title || a.body) ||
    manual.hazards.some((h) => h.title || h.body)
      ? [{ href: "#insights", label: "Insights" }]
      : []),
    { href: "#notes", label: "Notes" },
  ];
}

export function ManualToc({ manual }: { manual: TeamManual }) {
  const jumps = useMemo(() => manualJumps(manual), [manual]);
  const [active, setActive] = useState("#top");

  useEffect(() => {
    const nodes = jumps
      .map((j) => document.getElementById(j.href.slice(1)))
      .filter((el): el is HTMLElement => Boolean(el));
    if (!nodes.length) return;

    const onScroll = () => {
      const offset = window.matchMedia("(min-width: 768px)").matches ? 160 : 80;
      let current = jumps[0]?.href ?? "#top";
      for (const el of nodes) {
        if (el.getBoundingClientRect().top - offset <= 0) current = `#${el.id}`;
      }
      setActive(current);
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [jumps]);

  return (
    <nav
      aria-label="On this manual"
      className="sticky top-0 z-30 -mx-4 -mt-6 border-b border-line/70 bg-bg/90 px-4 py-2 backdrop-blur-md md:top-16 md:-mx-6 md:-mt-10 md:px-6"
    >
      <ul className="flex gap-1.5 overflow-x-auto [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {jumps.map((j) => {
          const on = active === j.href;
          return (
            <li key={j.href} className="shrink-0">
              <a
                href={j.href}
                aria-current={on ? "location" : undefined}
                onClick={() => setActive(j.href)}
                className={`inline-flex min-h-9 items-center rounded-full px-3.5 text-sm transition ${
                  on ? "bg-ink text-bg" : "bg-white/6 text-muted hover:bg-white/10 hover:text-ink"
                }`}
              >
                {j.label}
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
