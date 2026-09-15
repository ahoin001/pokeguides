"use client";

import { flowsFor } from "@/content/classroom-flows";
import type { TeamManual } from "@/content/manuals";

export function ManualToc({
  manual,
  variant = "bar",
}: {
  manual: TeamManual;
  variant?: "bar" | "rail";
}) {
  const jumps = [
    ...(manual.plan?.some((b) => b.title || b.play) ? [{ href: "#plan", label: "Plan" }] : []),
    { href: "#three", label: "The three" },
    ...flowsFor(manual).map((flow) => ({ href: `#flow-${flow.id}`, label: flow.title })),
    ...(manual.switches?.some((s) => s.into || s.send) ? [{ href: "#switches", label: "Switches" }] : []),
    ...(manual.loops.some((l) => l.title || l.body) ? [{ href: "#loops", label: "Loops" }] : []),
    ...(manual.hazards.some((h) => h.title || h.body) ? [{ href: "#hazards", label: "Hazards" }] : []),
  ];

  if (variant === "rail") {
    return (
      <nav aria-label="On this manual" className="sticky top-24">
        <p className="text-sm font-semibold tracking-tight">On this page</p>
        <ul className="mt-3 space-y-1">
          {jumps.map((j) => (
            <li key={j.href}>
              <a
                href={j.href}
                className="block rounded-xl px-3 py-2 text-sm text-muted transition hover:bg-white/8 hover:text-ink"
              >
                {j.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    );
  }

  return (
    <nav
      aria-label="On this manual"
      className="sticky top-0 z-30 -mx-4 mt-8 border-y border-line/70 bg-bg/90 px-4 py-2 backdrop-blur-md md:top-16 xl:hidden"
    >
      <ul className="flex gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {jumps.map((j) => (
          <li key={j.href} className="shrink-0">
            <a
              href={j.href}
              className="inline-flex min-h-9 items-center rounded-full bg-white/5 px-3 py-1 text-sm text-muted transition hover:bg-white/10 hover:text-ink"
            >
              {j.label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
