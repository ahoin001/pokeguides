"use client";

import { useEffect, useMemo, useState } from "react";
import { SCROLL_UNDER_STACK, STICKY_LOCAL_BAR } from "@/components/chrome/PageFrame";
import { flowsFor } from "@/content/classroom-flows";
import type { TeamManual } from "@/content/manuals";

export const MANUAL_SCROLL_MT = SCROLL_UNDER_STACK;

function stackOffsetPx(node: HTMLElement) {
  const styles = getComputedStyle(node);
  const shell = parseFloat(styles.getPropertyValue("--sticky-shell")) || 0;
  const local = parseFloat(styles.getPropertyValue("--sticky-local")) || 0;
  return shell + local + 8;
}

export function manualJumps(manual: TeamManual, boxed = false) {
  const flows = flowsFor(manual);
  const hasGame =
    flows.length > 0 ||
    manual.loops.some((l) => l.title || l.body) ||
    (manual.switches ?? []).some((s) => s.into || s.send);
  const hasMatchups =
    manual.victims?.some((v) => v.name || v.why) ||
    manual.counters?.some((c) => c.name || c.why) ||
    manual.advantages?.some((a) => a.title || a.body) ||
    manual.hazards.some((h) => h.title || h.body);
  const hasPocket = Boolean(manual.pilot?.fail || (manual.switches ?? []).some((s) => s.into || s.send));
  const hasThesis = Boolean(manual.construction || manual.megaPool || manual.evidence);

  return [
    { href: "#top", label: "Top" },
    ...(boxed ? [{ href: "#box", label: "Lineup" }] : []),
    ...(hasThesis ? [{ href: "#thesis", label: "Thesis" }] : []),
    ...(hasPocket ? [{ href: "#pocket", label: "Pocket" }] : []),
    { href: "#three", label: "The three" },
    { href: "#scout", label: "Scout" },
    ...(manual.plan?.some((b) => b.title || b.play) ? [{ href: "#plan", label: "Plan" }] : []),
    ...(hasGame ? [{ href: "#game", label: "Game" }] : []),
    ...(hasMatchups ? [{ href: "#matchups", label: "Matchups" }] : []),
    { href: "#notes", label: "Notes" },
  ];
}

export function ManualToc({ manual, boxed = false }: { manual: TeamManual; boxed?: boolean }) {
  const jumps = useMemo(() => manualJumps(manual, boxed), [manual, boxed]);
  const [active, setActive] = useState("#top");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const nav = document.querySelector<HTMLElement>('[aria-label="On this manual"]');
    const nodes = jumps
      .map((j) => document.getElementById(j.href.slice(1)))
      .filter((el): el is HTMLElement => Boolean(el));
    if (!nodes.length || !nav) return;

    const onScroll = () => {
      const offset = stackOffsetPx(nav);
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
      className={STICKY_LOCAL_BAR}
    >
      <ul className="pointer-events-auto flex gap-1.5 overflow-x-auto [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {jumps.map((j) => {
          const on = mounted && active === j.href;
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
