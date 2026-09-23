"use client";

import { useMemo, useState } from "react";
import { getPokemon } from "@/lib/catalog/load";
import { cssVars } from "@/lib/champions/palette";
import { getChampionsMove } from "@/lib/champions/move-data";
import {
  kitMapFromRoster,
  resolveNetworkPhrase,
  type NetworkPhraseHits,
} from "@/lib/champions/network-moves";
import { PokemonArt } from "@/components/pokemon/PokemonArt";
import { MoveChip } from "@/components/moves/MoveChip";
import { ManualSection } from "@/components/manuals/ManualSection";
import type { ManualNetwork, SlotManual } from "@/content/manuals";

type Edge = ManualNetwork["edges"][number];

/**
 * Conversion constellation — directed edges without mid-line labels,
 * focus dock + kit-aware MoveChip cards (hover syncs graph ↔ cards).
 */
export function ManualNetworkGraph({
  network,
  box,
  roster,
  onNode,
  onEdge,
}: {
  network: ManualNetwork;
  box: string[];
  roster?: SlotManual[];
  onNode?: (slug: string) => void;
  onEdge?: (engineId?: string) => void;
}) {
  const [hoverEdge, setHoverEdge] = useState<number | null>(null);
  const [litSlug, setLitSlug] = useState<string | null>(null);
  const [simple, setSimple] = useState(true);

  const kits = useMemo(() => kitMapFromRoster(roster), [roster]);

  const nodes = useMemo(() => {
    const slugs = box.filter(Boolean).slice(0, 6);
    // Even hex — more vertical separation so edges don't pile mid-graph
    const positions: { slug: string; x: number; y: number }[] = [
      { slug: slugs[0] ?? "", x: 50, y: 10 },
      { slug: slugs[1] ?? "", x: 12, y: 36 },
      { slug: slugs[2] ?? "", x: 88, y: 36 },
      { slug: slugs[3] ?? "", x: 50, y: 48 },
      { slug: slugs[4] ?? "", x: 22, y: 88 },
      { slug: slugs[5] ?? "", x: 78, y: 88 },
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

  const phraseFor = (edge: Edge) => ({
    creates: resolveNetworkPhrase(edge.creates, kits.get(edge.from) ?? []),
    converts: resolveNetworkPhrase(edge.converts, kits.get(edge.to) ?? []),
  });

  if (!nodes.length || !network.edges.length) return null;

  const active = hoverEdge !== null ? edges[hoverEdge] : null;
  const anyLit = Boolean(litSlug || active);
  const activePhrases = active ? phraseFor(active) : null;

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
      <div className="relative mx-auto aspect-[5/4] w-full max-w-2xl sm:aspect-square">
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
            const geo = edgeGeometry(a, b);
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
              className={`absolute -translate-x-1/2 -translate-y-1/2 rounded-full border bg-bg p-1 shadow-sm transition duration-200 md:p-1.5 ${
                connected
                  ? focused
                    ? "scale-110 border-ink/50"
                    : "border-line/70 hover:scale-105"
                  : "scale-95 border-transparent opacity-35"
              }`}
              style={{ left: `${n.x}%`, top: `${n.y}%`, ...cssVars(mon.palette) }}
              title={`${mon.name}${out ? ` · feeds ${out}` : ""}${inn ? ` · fed by ${inn}` : ""}`}
            >
              <span className="md:hidden">
                <PokemonArt
                  slug={mon.slug}
                  src={mon.sprite || mon.artwork}
                  name={mon.name}
                  size={44}
                />
              </span>
              <span className="hidden md:block">
                <PokemonArt
                  slug={mon.slug}
                  src={mon.sprite || mon.artwork}
                  name={mon.name}
                  size={52}
                />
              </span>
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
          <div className="pointer-events-none absolute bottom-2 left-1/2 z-10 w-[min(94%,22rem)] -translate-x-1/2 rounded-2xl border border-line bg-bg/95 px-3 py-2.5 text-center shadow-md backdrop-blur-sm">
            {active && activePhrases ? (
              <>
                <p className="text-sm font-semibold tracking-tight text-ink">
                  {nameOf(active.from)}
                  <span className="mx-1.5 font-normal text-muted">→</span>
                  {nameOf(active.to)}
                </p>
                <div className="mt-2 flex flex-wrap items-center justify-center gap-1.5">
                  <PhraseChips hits={activePhrases.creates} selected />
                  <span className="font-mono text-[9px] uppercase tracking-[0.12em] text-muted">
                    →
                  </span>
                  <PhraseChips hits={activePhrases.converts} selected />
                </div>
              </>
            ) : litSlug ? (
              <NodeFocusSummary slug={litSlug} edges={edges} kits={kits} />
            ) : null}
          </div>
        ) : (
          <p className="pointer-events-none absolute bottom-2 left-1/2 z-10 w-[min(92%,18rem)] -translate-x-1/2 text-center text-[11px] text-muted">
            Hover a face or link · arrows show who feeds whom
          </p>
        )}
      </div>

      <ul className="mt-6 grid gap-2.5 sm:grid-cols-2">
        {edges.map((edge, i) => {
          const from = getPokemon(edge.from);
          const to = getPokemon(edge.to);
          const hot =
            hoverEdge === i ||
            (litSlug != null && (edge.from === litSlug || edge.to === litSlug));
          const phrases = phraseFor(edge);
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
                className={`flex w-full items-center gap-2.5 rounded-2xl border px-2.5 py-2.5 text-left transition ${
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
                    size={32}
                  />
                ) : null}
                <span className="min-w-0 flex-1 space-y-1.5">
                  <span className="flex flex-wrap items-center gap-1.5">
                    <span className="font-mono text-[8px] font-semibold uppercase tracking-[0.12em] text-muted">
                      creates
                    </span>
                    <PhraseChips hits={phrases.creates} selected={hot} />
                  </span>
                  <span className="flex flex-wrap items-center gap-1.5">
                    <span className="font-mono text-[8px] font-semibold uppercase tracking-[0.12em] text-muted">
                      converts
                    </span>
                    <PhraseChips hits={phrases.converts} selected={hot} />
                  </span>
                </span>
                {to ? (
                  <PokemonArt
                    slug={to.slug}
                    src={to.sprite || to.artwork}
                    name={to.name}
                    size={32}
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

function PhraseChips({
  hits,
  selected = false,
}: {
  hits: NetworkPhraseHits;
  selected?: boolean;
}) {
  if (!hits.moves.length && !hits.residual) return null;
  return (
    <>
      {hits.moves.map((name) => {
        const move = getChampionsMove(name);
        return (
          <MoveChip
            key={name}
            as="span"
            name={move?.name ?? name}
            type={move?.type}
            size="sm"
            selected={selected}
          />
        );
      })}
      {hits.residual ? (
        <span className="rounded-full border border-line/60 bg-bg/80 px-2 py-0.5 text-[11px] font-medium text-muted">
          {hits.residual}
        </span>
      ) : null}
    </>
  );
}

function nameOf(slug: string) {
  return getPokemon(slug)?.name ?? slug;
}

/** Shorten the drawn segment so arrowheads clear face circles. */
function edgeGeometry(a: { x: number; y: number }, b: { x: number; y: number }) {
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  const len = Math.hypot(dx, dy) || 1;
  const ux = dx / len;
  const uy = dy / len;
  const pad = 8.5;
  return {
    x1: a.x + ux * pad,
    y1: a.y + uy * pad,
    x2: b.x - ux * pad,
    y2: b.y - uy * pad,
  };
}

function NodeFocusSummary({
  slug,
  edges,
  kits,
}: {
  slug: string;
  edges: Edge[];
  kits: Map<string, string[]>;
}) {
  const out = edges.filter((e) => e.from === slug);
  const inn = edges.filter((e) => e.to === slug);
  const name = nameOf(slug);
  if (!out.length && !inn.length) {
    return <p className="text-[11px] text-muted">{name} has no links in this view</p>;
  }
  return (
    <div className="space-y-1.5 text-[11px] leading-snug">
      <p className="text-sm font-semibold tracking-tight text-ink">{name}</p>
      {out.length ? (
        <div className="flex flex-wrap items-center justify-center gap-1">
          <span className="text-muted">Feeds</span>
          {out.map((e, i) => {
            const hits = resolveNetworkPhrase(e.creates, kits.get(slug) ?? []);
            return (
              <span key={`o-${e.to}-${i}`} className="inline-flex flex-wrap items-center gap-1">
                {i ? <span className="text-muted">·</span> : null}
                <span className="font-medium text-ink">{nameOf(e.to)}</span>
                <PhraseChips hits={hits} />
              </span>
            );
          })}
        </div>
      ) : null}
      {inn.length ? (
        <div className="flex flex-wrap items-center justify-center gap-1">
          <span className="text-muted">Fed by</span>
          {inn.map((e, i) => {
            const hits = resolveNetworkPhrase(e.converts, kits.get(slug) ?? []);
            return (
              <span key={`i-${e.from}-${i}`} className="inline-flex flex-wrap items-center gap-1">
                {i ? <span className="text-muted">·</span> : null}
                <span className="font-medium text-ink">{nameOf(e.from)}</span>
                <PhraseChips hits={hits} />
              </span>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}
