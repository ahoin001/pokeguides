"use client";

import { useMemo, useState } from "react";
import { getPokemon } from "@/lib/catalog/load";
import { cssVars } from "@/lib/champions/palette";
import { PokemonArt } from "@/components/pokemon/PokemonArt";
import { ManualSection } from "@/components/manuals/ManualSection";
import type { ManualNetwork } from "@/content/manuals";

type Edge = ManualNetwork["edges"][number];

/**
 * Conversion constellation — directed edges, always-visible pair labels,
 * focus highlight, and a scannable pairing strip (no hover required to read).
 */
export function ManualNetworkGraph({
  network,
  box,
  onNode,
  onEdge,
}: {
  network: ManualNetwork;
  box: string[];
  onNode?: (slug: string) => void;
  onEdge?: (engineId?: string) => void;
}) {
  const [hoverEdge, setHoverEdge] = useState<number | null>(null);
  const [litSlug, setLitSlug] = useState<string | null>(null);
  const [simple, setSimple] = useState(true);

  const nodes = useMemo(() => {
    const slugs = box.filter(Boolean).slice(0, 6);
    const positions: { slug: string; x: number; y: number }[] = [
      { slug: slugs[0] ?? "", x: 50, y: 14 },
      { slug: slugs[1] ?? "", x: 16, y: 40 },
      { slug: slugs[2] ?? "", x: 84, y: 40 },
      { slug: slugs[3] ?? "", x: 50, y: 52 },
      { slug: slugs[4] ?? "", x: 26, y: 82 },
      { slug: slugs[5] ?? "", x: 74, y: 82 },
    ];
    return positions.filter((p) => p.slug);
  }, [box]);

  const pos = useMemo(() => {
    const m = new Map<string, { x: number; y: number }>();
    for (const n of nodes) m.set(n.slug, { x: n.x, y: n.y });
    return m;
  }, [nodes]);

  const edges = useMemo(() => {
    const all = network.edges.filter((e) => pos.has(e.from) && pos.has(e.to));
    if (!simple) return all;
    const converters = new Set(box.slice(3, 5));
    const prefer = all.filter((e) => converters.has(e.to) || e.engineId);
    return prefer.length ? prefer : all.slice(0, 5);
  }, [network.edges, pos, simple, box]);

  const degree = useMemo(() => {
    const feeds = new Map<string, number>();
    const fedBy = new Map<string, number>();
    for (const e of edges) {
      feeds.set(e.from, (feeds.get(e.from) ?? 0) + 1);
      fedBy.set(e.to, (fedBy.get(e.to) ?? 0) + 1);
    }
    return { feeds, fedBy };
  }, [edges]);

  if (!nodes.length || !network.edges.length) return null;

  const active = hoverEdge !== null ? edges[hoverEdge] : null;
  const anyLit = Boolean(litSlug || active);

  return (
    <ManualSection
      id="network"
      title="Network"
      purpose={network.thesis || "A creates a resource. B converts it."}
      actions={
        <button
          type="button"
          onClick={() => setSimple((s) => !s)}
          className="rounded-full border border-line px-3 py-1.5 text-xs font-medium text-muted hover:text-ink"
        >
          {simple ? "Show all links" : "Simple links"}
        </button>
      }
    >
      <div className="relative mx-auto aspect-[4/3] w-full max-w-xl">
        <svg
          viewBox="0 0 100 100"
          className="absolute inset-0 h-full w-full overflow-visible"
          aria-hidden
        >
          <defs>
            <marker
              id="net-arrow"
              viewBox="0 0 10 10"
              refX="9"
              refY="5"
              markerWidth="3.2"
              markerHeight="3.2"
              orient="auto-start-reverse"
            >
              <path d="M 0 1.2 L 9 5 L 0 8.8 Z" className="fill-ink/55" />
            </marker>
            <marker
              id="net-arrow-hot"
              viewBox="0 0 10 10"
              refX="9"
              refY="5"
              markerWidth="3.6"
              markerHeight="3.6"
              orient="auto-start-reverse"
            >
              <path d="M 0 1.2 L 9 5 L 0 8.8 Z" className="fill-ink" />
            </marker>
          </defs>

          {edges.map((edge, i) => {
            const a = pos.get(edge.from)!;
            const b = pos.get(edge.to)!;
            const hot =
              hoverEdge === i ||
              (litSlug != null && (edge.from === litSlug || edge.to === litSlug));
            const dim = anyLit && !hot;
            const geo = edgeGeometry(a, b, i);
            return (
              <g key={`${edge.from}-${edge.to}-${i}`}>
                <line
                  x1={geo.x1}
                  y1={geo.y1}
                  x2={geo.x2}
                  y2={geo.y2}
                  stroke="transparent"
                  strokeWidth={10}
                  strokeLinecap="round"
                  className="cursor-pointer"
                  onMouseEnter={() => {
                    setHoverEdge(i);
                    setLitSlug(null);
                  }}
                  onMouseLeave={() => setHoverEdge(null)}
                  onFocus={() => setHoverEdge(i)}
                  onBlur={() => setHoverEdge(null)}
                  onClick={() => onEdge?.(edge.engineId)}
                  tabIndex={0}
                  role="button"
                  aria-label={`${nameOf(edge.from)} creates ${edge.creates}; ${nameOf(edge.to)} converts ${edge.converts}`}
                />
                <line
                  x1={geo.x1}
                  y1={geo.y1}
                  x2={geo.x2}
                  y2={geo.y2}
                  stroke="currentColor"
                  strokeWidth={hot ? 1.05 : 0.45}
                  strokeLinecap="round"
                  strokeDasharray={hot ? "2.4 1.6" : undefined}
                  markerEnd={hot ? "url(#net-arrow-hot)" : "url(#net-arrow)"}
                  className={`pointer-events-none transition-opacity duration-200 ${
                    dim ? "text-ink/10" : hot ? "text-ink network-edge-flow" : "text-ink/30"
                  }`}
                />
                <foreignObject
                  x={geo.lx - 14}
                  y={geo.ly - 4.5}
                  width={28}
                  height={9}
                  className={`pointer-events-none overflow-visible transition-opacity duration-200 ${
                    dim ? "opacity-25" : "opacity-100"
                  }`}
                >
                  <div className="flex h-full w-full items-center justify-center">
                    <span
                      className={`max-w-full truncate rounded-md px-1 py-0.5 text-center font-sans text-[3.4px] font-semibold leading-none tracking-tight ${
                        hot
                          ? "bg-ink text-bg shadow-sm"
                          : "border border-line/70 bg-bg/90 text-ink backdrop-blur-[2px]"
                      }`}
                      title={`${edge.creates} → ${edge.converts}`}
                    >
                      {shortLabel(edge.creates)}
                    </span>
                  </div>
                </foreignObject>
              </g>
            );
          })}
        </svg>

        {nodes.map((n) => {
          const mon = getPokemon(n.slug);
          if (!mon) return null;
          const connected =
            !anyLit ||
            litSlug === n.slug ||
            (active != null && (active.from === n.slug || active.to === n.slug));
          const out = degree.feeds.get(n.slug) ?? 0;
          const inn = degree.fedBy.get(n.slug) ?? 0;
          const focused =
            litSlug === n.slug ||
            (active != null && (active.from === n.slug || active.to === n.slug));
          return (
            <button
              key={n.slug}
              type="button"
              onMouseEnter={() => {
                setLitSlug(n.slug);
                setHoverEdge(null);
              }}
              onMouseLeave={() => setLitSlug(null)}
              onFocus={() => setLitSlug(n.slug)}
              onBlur={() => setLitSlug(null)}
              onClick={() => onNode?.(n.slug)}
              className={`absolute -translate-x-1/2 -translate-y-1/2 rounded-full border bg-bg p-1 shadow-sm transition duration-200 ${
                connected
                  ? focused
                    ? "scale-110 border-ink/50"
                    : "border-line/70 hover:scale-105"
                  : "scale-95 border-transparent opacity-35"
              }`}
              style={{ left: `${n.x}%`, top: `${n.y}%`, ...cssVars(mon.palette) }}
              title={`${mon.name}${out ? ` · feeds ${out}` : ""}${inn ? ` · fed by ${inn}` : ""}`}
            >
              <PokemonArt
                slug={mon.slug}
                src={mon.sprite || mon.artwork}
                name={mon.name}
                size={44}
              />
              {(out > 0 || inn > 0) && (
                <span className="pointer-events-none absolute -bottom-1 left-1/2 flex -translate-x-1/2 gap-0.5">
                  {out > 0 ? (
                    <span className="rounded-full bg-ink px-1 py-px font-mono text-[8px] font-semibold tabular-nums text-bg">
                      →{out}
                    </span>
                  ) : null}
                  {inn > 0 ? (
                    <span className="rounded-full border border-line/80 bg-bg px-1 py-px font-mono text-[8px] font-semibold tabular-nums text-muted">
                      ←{inn}
                    </span>
                  ) : null}
                </span>
              )}
            </button>
          );
        })}

        {active || litSlug ? (
          <div className="pointer-events-none absolute bottom-2 left-1/2 z-10 w-[min(92%,20rem)] -translate-x-1/2 rounded-2xl border border-line bg-bg/95 px-3 py-2 text-center shadow-md backdrop-blur-sm">
            {active ? (
              <>
                <p className="text-sm font-semibold tracking-tight text-ink">
                  {nameOf(active.from)}
                  <span className="mx-1.5 font-normal text-muted">→</span>
                  {nameOf(active.to)}
                </p>
                <p className="mt-1 text-[11px] leading-snug text-muted">
                  <span className="text-ink">{active.creates}</span>
                  <span className="mx-1">→</span>
                  <span className="text-ink">{active.converts}</span>
                </p>
              </>
            ) : litSlug ? (
              <NodeFocusSummary slug={litSlug} edges={edges} />
            ) : null}
          </div>
        ) : (
          <p className="pointer-events-none absolute bottom-2 left-1/2 z-10 w-[min(92%,18rem)] -translate-x-1/2 text-center text-[11px] text-muted">
            Hover a face or link · arrows show who feeds whom
          </p>
        )}
      </div>

      <ul className="mt-5 grid gap-2 sm:grid-cols-2">
        {edges.map((edge, i) => {
          const from = getPokemon(edge.from);
          const to = getPokemon(edge.to);
          const hot =
            hoverEdge === i ||
            (litSlug != null && (edge.from === litSlug || edge.to === litSlug));
          return (
            <li key={`${edge.from}-${edge.to}-row-${i}`}>
              <button
                type="button"
                onMouseEnter={() => {
                  setHoverEdge(i);
                  setLitSlug(null);
                }}
                onMouseLeave={() => setHoverEdge(null)}
                onFocus={() => setHoverEdge(i)}
                onBlur={() => setHoverEdge(null)}
                onClick={() => onEdge?.(edge.engineId)}
                className={`flex w-full items-center gap-2 rounded-2xl border px-2.5 py-2 text-left transition ${
                  hot
                    ? "border-ink/40 bg-raised/55 shadow-sm"
                    : "border-line/55 bg-raised/15 hover:border-ink/25"
                }`}
                style={from ? cssVars(from.palette) : undefined}
              >
                {from ? (
                  <PokemonArt
                    slug={from.slug}
                    src={from.sprite || from.artwork}
                    name={from.name}
                    size={28}
                  />
                ) : null}
                <span className="min-w-0 flex-1">
                  <span className="flex flex-wrap items-baseline gap-x-1.5 text-[12px] leading-tight">
                    <span className="font-semibold">{from?.name ?? edge.from}</span>
                    <span className="font-mono text-[9px] uppercase tracking-[0.1em] text-muted">
                      creates
                    </span>
                    <span className="text-muted">{edge.creates}</span>
                  </span>
                  <span className="mt-0.5 flex flex-wrap items-baseline gap-x-1.5 text-[12px] leading-tight">
                    <span className="font-semibold">{to?.name ?? edge.to}</span>
                    <span className="font-mono text-[9px] uppercase tracking-[0.1em] text-muted">
                      converts
                    </span>
                    <span className="text-muted">{edge.converts}</span>
                  </span>
                </span>
                {to ? (
                  <PokemonArt
                    slug={to.slug}
                    src={to.sprite || to.artwork}
                    name={to.name}
                    size={28}
                  />
                ) : null}
              </button>
            </li>
          );
        })}
      </ul>
    </ManualSection>
  );
}

function nameOf(slug: string) {
  return getPokemon(slug)?.name ?? slug;
}

function shortLabel(text: string, max = 16) {
  const t = text.trim();
  if (t.length <= max) return t;
  return `${t.slice(0, max - 1)}…`;
}

/** Shorten the drawn segment so arrowheads clear face circles; offset label off the chord. */
function edgeGeometry(
  a: { x: number; y: number },
  b: { x: number; y: number },
  i: number,
) {
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  const len = Math.hypot(dx, dy) || 1;
  const ux = dx / len;
  const uy = dy / len;
  const pad = 7.5;
  const x1 = a.x + ux * pad;
  const y1 = a.y + uy * pad;
  const x2 = b.x - ux * pad;
  const y2 = b.y - uy * pad;
  const mx = (x1 + x2) / 2;
  const my = (y1 + y2) / 2;
  const side = i % 2 === 0 ? 1 : -1;
  const bump = 2.2 + (i % 3) * 0.6;
  return {
    x1,
    y1,
    x2,
    y2,
    lx: mx + -uy * bump * side,
    ly: my + ux * bump * side,
  };
}

function NodeFocusSummary({ slug, edges }: { slug: string; edges: Edge[] }) {
  const out = edges.filter((e) => e.from === slug);
  const inn = edges.filter((e) => e.to === slug);
  const name = nameOf(slug);
  if (!out.length && !inn.length) {
    return <p className="text-[11px] text-muted">{name} has no links in this view</p>;
  }
  return (
    <div className="space-y-1 text-[11px] leading-snug">
      <p className="text-sm font-semibold tracking-tight text-ink">{name}</p>
      {out.length ? (
        <p className="text-muted">
          Feeds{" "}
          {out.map((e, i) => (
            <span key={`o-${e.to}-${i}`}>
              {i ? ", " : ""}
              <span className="text-ink">{nameOf(e.to)}</span>
              <span className="text-muted"> ({e.creates})</span>
            </span>
          ))}
        </p>
      ) : null}
      {inn.length ? (
        <p className="text-muted">
          Fed by{" "}
          {inn.map((e, i) => (
            <span key={`i-${e.from}-${i}`}>
              {i ? ", " : ""}
              <span className="text-ink">{nameOf(e.from)}</span>
              <span className="text-muted"> → {e.converts}</span>
            </span>
          ))}
        </p>
      ) : null}
    </div>
  );
}
