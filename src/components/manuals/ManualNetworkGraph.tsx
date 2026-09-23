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
type CardAxis = "creates" | "converts";
type IndexedEdge = { edge: Edge; index: number };

type NodeLayout = {
  slug: string;
  x: number;
  y: number;
  out: number;
  inn: number;
  /** -1 pure creator … +1 pure converter */
  role: number;
  /** 0 idle … 1 busiest */
  activity: number;
  band: "creates" | "bridge" | "converts" | "idle";
};

/**
 * Conversion constellation — nodes placed on a Creates → Converts flow field.
 * High creators sit left / high; high converters sit right / high; bridges mid.
 * Every boxed face stays in the readable field with a visible name — no quiet pocket.
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
  const [cardAxis, setCardAxis] = useState<CardAxis>("creates");
  const [cardFocus, setCardFocus] = useState<string | null>(null);

  const kits = useMemo(() => kitMapFromRoster(roster), [roster]);

  const slugs = useMemo(() => box.filter(Boolean).slice(0, 6), [box]);

  /** Degrees from the full authored graph — layout stays stable when toggling simple links. */
  const fullDegree = useMemo(() => degreeMaps(network.edges, slugs), [network.edges, slugs]);

  const nodes = useMemo(
    () => layoutByFlow(slugs, fullDegree.feeds, fullDegree.fedBy),
    [slugs, fullDegree],
  );

  const pos = useMemo(() => {
    const m = new Map<string, { x: number; y: number }>();
    for (const n of nodes) m.set(n.slug, { x: n.x, y: n.y });
    return m;
  }, [nodes]);

  const bySlug = useMemo(() => {
    const m = new Map<string, NodeLayout>();
    for (const n of nodes) m.set(n.slug, n);
    return m;
  }, [nodes]);

  const edges = useMemo(() => {
    const all = network.edges.filter((e) => pos.has(e.from) && pos.has(e.to));
    if (!simple) return all;
    // Prefer edges into active converters / engine-tagged routes
    const hotConverters = new Set(
      nodes.filter((n) => n.band === "converts" || n.band === "bridge").map((n) => n.slug),
    );
    const prefer = all.filter((e) => hotConverters.has(e.to) || e.engineId);
    return prefer.length ? prefer : all.slice(0, Math.min(6, all.length));
  }, [network.edges, pos, simple, nodes]);

  const degree = useMemo(() => degreeMaps(edges, slugs), [edges, slugs]);

  const phraseFor = (edge: Edge) => ({
    creates: resolveNetworkPhrase(edge.creates, kits.get(edge.from) ?? []),
    converts: resolveNetworkPhrase(edge.converts, kits.get(edge.to) ?? []),
  });

  const indexedEdges = useMemo<IndexedEdge[]>(
    () => edges.map((edge, index) => ({ edge, index })),
    [edges],
  );

  const axisSlugs = useMemo(() => {
    const present = new Set(
      indexedEdges.map(({ edge }) => (cardAxis === "creates" ? edge.from : edge.to)),
    );
    return [...slugs]
      .filter((s) => present.has(s))
      .sort((a, b) => {
        const da = cardAxis === "creates" ? (degree.feeds.get(a) ?? 0) : (degree.fedBy.get(a) ?? 0);
        const db = cardAxis === "creates" ? (degree.feeds.get(b) ?? 0) : (degree.fedBy.get(b) ?? 0);
        return db - da;
      });
  }, [indexedEdges, slugs, cardAxis, degree]);

  const activeFocus =
    cardFocus && axisSlugs.includes(cardFocus) ? cardFocus : null;

  const cardGroups = useMemo(() => {
    const keyOf = (edge: Edge) => (cardAxis === "creates" ? edge.from : edge.to);
    const items = activeFocus
      ? indexedEdges.filter(({ edge }) => keyOf(edge) === activeFocus)
      : indexedEdges;
    const groups: { slug: string; items: IndexedEdge[] }[] = [];
    for (const slug of axisSlugs) {
      const g = items.filter(({ edge }) => keyOf(edge) === slug);
      if (g.length) groups.push({ slug, items: g });
    }
    return groups;
  }, [indexedEdges, axisSlugs, cardAxis, activeFocus]);

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
      <p className="mb-3 max-w-[52ch] text-[11px] leading-snug text-muted">
        Left creates · right converts · higher faces do more of the work. Every boxed Pokémon stays on the board.
      </p>

      <div className="relative mx-auto aspect-[4/5] w-full max-w-xl sm:aspect-[5/4] sm:max-w-2xl md:aspect-square">
        {/* Soft flow zones */}
        <div
          className="pointer-events-none absolute inset-0 overflow-hidden rounded-[22px] border border-line/40"
          aria-hidden
        >
          <div className="absolute inset-y-0 left-0 w-[38%] bg-[linear-gradient(90deg,color-mix(in_srgb,var(--ink)_6%,transparent),transparent)]" />
          <div className="absolute inset-y-0 right-0 w-[38%] bg-[linear-gradient(270deg,color-mix(in_srgb,var(--ink)_6%,transparent),transparent)]" />
          <div className="absolute left-3 top-2.5 font-mono text-[9px] font-semibold uppercase tracking-[0.14em] text-muted/80">
            Creates
          </div>
          <div className="absolute right-3 top-2.5 font-mono text-[9px] font-semibold uppercase tracking-[0.14em] text-muted/80">
            Converts
          </div>
        </div>

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
                  strokeWidth={hot ? 1.05 : 0.4 + Math.min(0.35, ((fullDegree.feeds.get(edge.from) ?? 0) + (fullDegree.fedBy.get(edge.to) ?? 0)) * 0.08)}
                  strokeLinecap="round"
                  strokeDasharray={hot ? "2.4 1.6" : undefined}
                  markerEnd={hot ? "url(#net-arrow-hot)" : "url(#net-arrow)"}
                  className={`pointer-events-none transition-opacity duration-200 ${
                    dim ? "text-ink/10" : hot ? "text-ink network-edge-flow" : "text-ink/28"
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
          const art = artSize(n.activity);
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
              className={`absolute z-[1] flex -translate-x-1/2 -translate-y-1/2 flex-col items-center gap-1 transition duration-200 ${
                connected ? (focused ? "z-10 scale-105" : "") : "opacity-40"
              }`}
              style={{ left: `${n.x}%`, top: `${n.y}%`, ...cssVars(mon.palette) }}
              title={`${mon.name} · ${bandLabel(n.band)}${out ? ` · feeds ${out}` : ""}${inn ? ` · fed by ${inn}` : ""}`}
            >
              <span
                className={`rounded-full border bg-bg p-1 shadow-sm md:p-1.5 ${
                  focused ? "border-ink/50" : bandRing(n.band)
                }`}
              >
                <span className="md:hidden">
                  <PokemonArt
                    slug={mon.slug}
                    src={mon.sprite || mon.artwork}
                    name={mon.name}
                    size={art.sm}
                  />
                </span>
                <span className="hidden md:block">
                  <PokemonArt
                    slug={mon.slug}
                    src={mon.sprite || mon.artwork}
                    name={mon.name}
                    size={art.md}
                  />
                </span>
              </span>
              <span className="pointer-events-none flex max-w-[5.5rem] flex-col items-center gap-0.5">
                <span className="truncate text-center text-[10px] font-semibold leading-tight tracking-tight text-ink sm:text-[11px]">
                  {mon.name}
                </span>
                <span className="flex flex-wrap items-center justify-center gap-0.5">
                  {n.out > 0 ? (
                    <span className="rounded-full bg-ink px-1 py-px font-mono text-[8px] font-semibold tabular-nums text-bg">
                      →{n.out}
                    </span>
                  ) : null}
                  {n.inn > 0 ? (
                    <span className="rounded-full border border-line/80 bg-bg px-1 py-px font-mono text-[8px] font-semibold tabular-nums text-muted">
                      ←{n.inn}
                    </span>
                  ) : null}
                  {n.band === "idle" ? (
                    <span className="rounded-full border border-line/70 bg-bg/95 px-1 py-px font-mono text-[8px] text-muted">
                      low
                    </span>
                  ) : null}
                </span>
              </span>
            </button>
          );
        })}

        {active || litSlug ? (
          <div className="pointer-events-none absolute bottom-2 left-1/2 z-20 w-[min(94%,22rem)] -translate-x-1/2 rounded-2xl border border-line bg-bg/95 px-3 py-2.5 text-center shadow-md backdrop-blur-sm">
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
              <NodeFocusSummary
                slug={litSlug}
                edges={edges}
                kits={kits}
                layout={bySlug.get(litSlug)}
              />
            ) : null}
          </div>
        ) : null}
      </div>

      <div className="mt-6 space-y-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div
            className="inline-flex rounded-full border border-line/70 p-0.5"
            role="group"
            aria-label="Organize cards by"
          >
            {(
              [
                ["creates", "Creates"],
                ["converts", "Converts"],
              ] as const
            ).map(([id, label]) => (
              <button
                key={id}
                type="button"
                onClick={() => setCardAxis(id)}
                className={`rounded-full px-3 py-1.5 text-xs font-semibold transition ${
                  cardAxis === id
                    ? "bg-ink text-bg"
                    : "text-muted hover:text-ink"
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          <div className="flex flex-wrap items-center gap-1.5">
            <span className="mr-1 font-mono text-[9px] font-semibold uppercase tracking-[0.12em] text-muted">
              {cardAxis === "creates" ? "By creator weight" : "By converter weight"}
            </span>
            <button
              type="button"
              onClick={() => setCardFocus(null)}
              className={`rounded-full border px-2.5 py-1 text-[11px] font-semibold transition ${
                !activeFocus
                  ? "border-ink/40 bg-ink text-bg"
                  : "border-line/70 text-muted hover:border-ink/30 hover:text-ink"
              }`}
            >
              All
            </button>
            {axisSlugs.map((slug) => {
              const mon = getPokemon(slug);
              const layout = bySlug.get(slug);
              if (!mon) return null;
              const on = activeFocus === slug;
              const weight =
                cardAxis === "creates"
                  ? (degree.feeds.get(slug) ?? 0)
                  : (degree.fedBy.get(slug) ?? 0);
              return (
                <button
                  key={slug}
                  type="button"
                  onClick={() => setCardFocus(on ? null : slug)}
                  title={`${mon.name} · ${weight} ${cardAxis}${layout ? ` · ${bandLabel(layout.band)}` : ""}`}
                  className={`relative rounded-full border p-0.5 transition ${
                    on
                      ? "border-ink/50 bg-raised/60 shadow-sm"
                      : "border-line/60 hover:border-ink/30"
                  }`}
                  style={cssVars(mon.palette)}
                >
                  <PokemonArt
                    slug={mon.slug}
                    src={mon.sprite || mon.artwork}
                    name={mon.name}
                    size={26}
                  />
                  {weight > 0 ? (
                    <span className="absolute -right-1 -top-1 rounded-full bg-ink px-1 font-mono text-[8px] font-semibold tabular-nums text-bg">
                      {weight}
                    </span>
                  ) : null}
                </button>
              );
            })}
          </div>
        </div>

        <div className="space-y-5">
          {cardGroups.map((group) => {
            const mon = getPokemon(group.slug);
            const layout = bySlug.get(group.slug);
            return (
              <section key={`${cardAxis}-${group.slug}`} className="space-y-2">
                <header className="flex items-center gap-2 px-0.5">
                  {mon ? (
                    <PokemonArt
                      slug={mon.slug}
                      src={mon.sprite || mon.artwork}
                      name={mon.name}
                      size={28}
                    />
                  ) : null}
                  <div className="min-w-0">
                    <p className="flex flex-wrap items-baseline gap-x-2 text-sm font-semibold tracking-tight">
                      <span>{mon?.name ?? group.slug}</span>
                      {layout ? (
                        <span className="font-mono text-[9px] font-semibold uppercase tracking-[0.12em] text-muted">
                          {bandLabel(layout.band)}
                        </span>
                      ) : null}
                    </p>
                    <p className="font-mono text-[9px] uppercase tracking-[0.12em] text-muted">
                      {cardAxis === "creates"
                        ? `${group.items.length} create${group.items.length === 1 ? "" : "s"}`
                        : `${group.items.length} convert${group.items.length === 1 ? "" : "s"}`}
                    </p>
                  </div>
                </header>
                <ul className="grid gap-2.5 sm:grid-cols-2">
                  {group.items.map(({ edge, index: i }) => {
                    const from = getPokemon(edge.from);
                    const to = getPokemon(edge.to);
                    const hot =
                      hoverEdge === i ||
                      (litSlug != null &&
                        (edge.from === litSlug || edge.to === litSlug));
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
              </section>
            );
          })}
        </div>
      </div>
    </ManualSection>
  );
}

function degreeMaps(edges: Edge[], slugs: string[]) {
  const feeds = new Map<string, number>();
  const fedBy = new Map<string, number>();
  for (const s of slugs) {
    feeds.set(s, 0);
    fedBy.set(s, 0);
  }
  for (const e of edges) {
    if (!feeds.has(e.from) && !fedBy.has(e.to)) continue;
    if (feeds.has(e.from)) feeds.set(e.from, (feeds.get(e.from) ?? 0) + 1);
    if (fedBy.has(e.to)) fedBy.set(e.to, (fedBy.get(e.to) ?? 0) + 1);
  }
  return { feeds, fedBy };
}

/**
 * Flow field:
 *  x — Creates (left) → Converts (right)
 *  y — Busier slightly higher; everyone stays in the readable mid band
 */
function layoutByFlow(
  slugs: string[],
  feeds: Map<string, number>,
  fedBy: Map<string, number>,
): NodeLayout[] {
  if (!slugs.length) return [];

  const scored = slugs.map((slug) => {
    const out = feeds.get(slug) ?? 0;
    const inn = fedBy.get(slug) ?? 0;
    return { slug, out, inn, total: out + inn };
  });

  const maxOut = Math.max(1, ...scored.map((s) => s.out));
  const maxIn = Math.max(1, ...scored.map((s) => s.inn));
  const maxTotal = Math.max(1, ...scored.map((s) => s.total));

  // Rank by activity so low-link faces still get distinct slots (not stacked).
  const byActivity = [...scored].sort((a, b) => b.total - a.total || a.slug.localeCompare(b.slug));
  const rank = new Map(byActivity.map((s, i) => [s.slug, i]));

  const nodes: NodeLayout[] = scored.map((s) => {
    const c = s.out / maxOut;
    const v = s.inn / maxIn;
    // Floor so low-interaction faces stay visually present
    const activity = s.total === 0 ? 0.22 : 0.35 + (s.total / maxTotal) * 0.65;
    let role: number;
    let band: NodeLayout["band"];

    if (s.total === 0) {
      role = 0;
      band = "idle";
    } else if (c >= 0.55 && v <= 0.35) {
      role = -0.75 - c * 0.2;
      band = "creates";
    } else if (v >= 0.55 && c <= 0.35) {
      role = 0.75 + v * 0.2;
      band = "converts";
    } else if (c > 0.2 && v > 0.2) {
      role = (v - c) * 0.55;
      band = "bridge";
    } else if (c >= v) {
      role = -0.35 - c * 0.25;
      band = "creates";
    } else {
      role = 0.35 + v * 0.25;
      band = "converts";
    }

    role = Math.max(-1, Math.min(1, role));

    // Spread zero-link faces across the center so they stay readable as a row
    if (band === "idle") {
      const idles = scored.filter((x) => x.total === 0);
      const idx = idles.findIndex((x) => x.slug === s.slug);
      const t = idles.length <= 1 ? 0.5 : idx / (idles.length - 1);
      role = -0.35 + t * 0.7;
    }

    const r = rank.get(s.slug) ?? 0;
    // Mild fan so six faces don't stack — busier a bit higher, quieter still mid-field
    const yBase = 28 + (r / Math.max(1, slugs.length - 1)) * 36;
    const yBusy = 22 + (1 - Math.min(1, s.total / maxTotal)) * 28;
    const y = band === "idle" ? 48 + (r % 2) * 8 : (yBase + yBusy) / 2;
    const x = 50 + role * 34;

    return { slug: s.slug, x, y, out: s.out, inn: s.inn, role, activity, band };
  });

  separateNodes(nodes, 22);
  for (const n of nodes) {
    n.x = Math.max(14, Math.min(86, n.x));
    // Keep clear of top labels and bottom focus card
    n.y = Math.max(18, Math.min(72, n.y));
  }
  return nodes;
}

function separateNodes(nodes: NodeLayout[], minDist: number) {
  for (let pass = 0; pass < 12; pass++) {
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const a = nodes[i]!;
        const b = nodes[j]!;
        const dx = b.x - a.x;
        const dy = b.y - a.y;
        const d = Math.hypot(dx, dy) || 0.01;
        if (d >= minDist) continue;
        const push = ((minDist - d) / 2) * 0.9;
        const ux = dx / d;
        const uy = dy / d;
        a.x -= ux * push;
        a.y -= uy * push;
        b.x += ux * push;
        b.y += uy * push;
      }
    }
  }
}

function artSize(activity: number) {
  const t = Math.max(0.4, Math.min(1, activity));
  const sm = Math.round(40 + t * 10);
  const md = Math.round(48 + t * 12);
  return { sm, md };
}

function bandLabel(band: NodeLayout["band"]) {
  switch (band) {
    case "creates":
      return "Creates";
    case "converts":
      return "Converts";
    case "bridge":
      return "Bridge";
    case "idle":
      return "Low link";
  }
}

function bandRing(band: NodeLayout["band"]) {
  switch (band) {
    case "creates":
      return "border-ink/35 hover:scale-105";
    case "converts":
      return "border-ink/20 hover:scale-105 ring-1 ring-ink/15";
    case "bridge":
      return "border-ink/40 hover:scale-105 shadow-sm";
    case "idle":
      return "border-ink/20 hover:scale-105";
  }
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

function edgeGeometry(a: { x: number; y: number }, b: { x: number; y: number }) {
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  const len = Math.hypot(dx, dy) || 1;
  const ux = dx / len;
  const uy = dy / len;
  const pad = 9;
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
  layout,
}: {
  slug: string;
  edges: Edge[];
  kits: Map<string, string[]>;
  layout?: NodeLayout;
}) {
  const out = edges.filter((e) => e.from === slug);
  const inn = edges.filter((e) => e.to === slug);
  const name = nameOf(slug);
  if (!out.length && !inn.length) {
    return (
      <p className="text-[11px] text-muted">
        {name} has no create/convert links in this view
      </p>
    );
  }
  return (
    <div className="space-y-1.5 text-[11px] leading-snug">
      <p className="text-sm font-semibold tracking-tight text-ink">
        {name}
        {layout ? (
          <span className="ml-2 font-mono text-[9px] font-semibold uppercase tracking-[0.12em] text-muted">
            {bandLabel(layout.band)}
          </span>
        ) : null}
      </p>
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
