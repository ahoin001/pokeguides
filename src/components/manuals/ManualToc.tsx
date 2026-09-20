"use client";

import { useEffect, useMemo, useState } from "react";
import { SCROLL_UNDER_STACK, STICKY_LOCAL_BAR } from "@/components/chrome/PageFrame";
import { PokemonArt } from "@/components/pokemon/PokemonArt";
import { getPokemon } from "@/lib/catalog/load";
import { type TeamManual } from "@/content/manuals";

export const MANUAL_SCROLL_MT = SCROLL_UNDER_STACK;

function stackOffsetPx(node: HTMLElement) {
  const styles = getComputedStyle(node);
  const shell = parseFloat(styles.getPropertyValue("--sticky-shell")) || 0;
  const local = parseFloat(styles.getPropertyValue("--sticky-local")) || 0;
  return shell + local + 8;
}

export function manualJumps(manual: TeamManual, boxed = false, parent?: TeamManual) {
  const source = parent ?? manual;
  const hasSix = boxed || (source.box?.length ?? 0) >= 3;
  const hasSets = Boolean(
    (source.roster?.length ?? 0) > 0 ||
      source.slots.some((s) => s.slug) ||
      (source.box?.length ?? 0) > 0,
  );
  const hasPacks = boxed && (source.packs?.length ?? 0) > 0;

  return [
    { href: "#top", label: "Top" },
    ...(hasSix ? [{ href: "#six", label: "Six" }] : []),
    ...(hasSets ? [{ href: "#sets", label: "Sets" }] : []),
    ...(hasPacks ? [{ href: "#packages", label: "Packages" }] : []),
    { href: "#guide", label: "Guide" },
  ];
}

export function ManualToc({
  manual,
  boxed = false,
  packKey = "",
  parent,
  packLabel,
  packSlugs,
}: {
  manual: TeamManual;
  boxed?: boolean;
  /** Remount scroll-spy when the active pack changes. */
  packKey?: string;
  parent?: TeamManual;
  packLabel?: string;
  packSlugs?: string[];
}) {
  const jumps = useMemo(
    () => manualJumps(manual, boxed, parent),
    [manual, boxed, parent],
  );
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
  }, [jumps, packKey]);

  return (
    <nav aria-label="On this manual" className={STICKY_LOCAL_BAR}>
      <div className="flex items-center gap-3">
        {packLabel && packSlugs?.length ? (
          <a
            href="#packages"
            className="pointer-events-auto hidden shrink-0 items-center gap-1.5 rounded-full border border-line/70 bg-raised/50 py-1 pl-1 pr-2.5 sm:inline-flex"
            title={packLabel}
          >
            {packSlugs.slice(0, 3).map((slug) => {
              const mon = getPokemon(slug);
              if (!mon) return null;
              return (
                <PokemonArt
                  key={slug}
                  slug={mon.slug}
                  src={mon.sprite || mon.artwork}
                  name={mon.name}
                  size={22}
                />
              );
            })}
            <span className="max-w-[8rem] truncate text-xs font-medium">{packLabel}</span>
          </a>
        ) : null}
        <ul className="pointer-events-auto flex min-w-0 flex-1 gap-1.5 overflow-x-auto [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
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
      </div>
    </nav>
  );
}
