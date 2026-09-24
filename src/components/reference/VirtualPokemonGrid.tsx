"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { useWindowVirtualizer } from "@tanstack/react-virtual";
import { PokemonCard } from "@/components/pokemon/PokemonCard";
import type { CatalogEntry } from "@/types/pokemon";

const MD_BREAKPOINT = 768;
/** Catalog card ≈ art + copy + actions + gap-3 */
const ROW_ESTIMATE_PX = 304;

function useDexColumns() {
  const [cols, setCols] = useState(2);
  useEffect(() => {
    const mq = window.matchMedia(`(min-width: ${MD_BREAKPOINT}px)`);
    const apply = () => setCols(mq.matches ? 4 : 2);
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, []);
  return cols;
}

/**
 * Window-scrolled pokedex grid — only mounts nearby rows so we do not
 * fire hundreds of remote artwork requests on first paint.
 */
export function VirtualPokemonGrid({
  rows,
  jobFor,
}: {
  rows: CatalogEntry[];
  jobFor: (p: CatalogEntry) => string | undefined;
}) {
  const cols = useDexColumns();
  const listRef = useRef<HTMLDivElement>(null);
  const [scrollMargin, setScrollMargin] = useState(0);
  const rowCount = Math.ceil(rows.length / cols);

  useLayoutEffect(() => {
    const update = () => setScrollMargin(listRef.current?.offsetTop ?? 0);
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, [rows.length, cols]);

  const virtualizer = useWindowVirtualizer({
    count: rowCount,
    estimateSize: () => ROW_ESTIMATE_PX,
    overscan: 2,
    scrollMargin,
  });

  if (!rows.length) return null;

  return (
    <div ref={listRef} className="mt-8">
      <div
        className="relative w-full"
        style={{ height: virtualizer.getTotalSize() }}
      >
        {virtualizer.getVirtualItems().map((virtualRow) => {
          const start = virtualRow.index * cols;
          const slice = rows.slice(start, start + cols);
          return (
            <div
              key={virtualRow.key}
              data-index={virtualRow.index}
              ref={virtualizer.measureElement}
              className="absolute left-0 top-0 grid w-full grid-cols-2 gap-3 md:grid-cols-4"
              style={{
                transform: `translateY(${virtualRow.start - scrollMargin}px)`,
              }}
            >
              {slice.map((p) => (
                <PokemonCard key={p.slug} pokemon={p} job={jobFor(p)} />
              ))}
            </div>
          );
        })}
      </div>
    </div>
  );
}
