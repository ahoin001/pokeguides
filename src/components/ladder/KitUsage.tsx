"use client";

import Link from "next/link";
import { CaretDown } from "@phosphor-icons/react";
import { formatPct } from "@/lib/ranked/format";
import type { KitShare, KitSpread, ParsedBattleKit } from "@/lib/champions-battle/types";

const STATS: { key: keyof Omit<KitSpread, "pct">; label: string }[] = [
  { key: "hp", label: "HP" },
  { key: "atk", label: "Atk" },
  { key: "def", label: "Def" },
  { key: "spa", label: "SpA" },
  { key: "spd", label: "SpD" },
  { key: "spe", label: "Spe" },
];

function maxPct(items: KitShare[]) {
  return Math.max(0, ...items.map((i) => i.pct ?? 0));
}

function UsageBar({
  name,
  pct,
  max,
  href,
  onPick,
}: {
  name: string;
  pct?: number;
  max: number;
  href?: string;
  onPick?: () => void;
}) {
  const label = formatPct(pct);
  const hasBar = pct != null && max > 0;
  const width = hasBar ? Math.max(4, (pct / max) * 100) : 0;
  const tip = label
    ? `${name} — ${label} of sets in this ladder sample`
    : `${name}${pct == null ? " — share not listed" : ""}`;

  const body = (
    <>
      <div className="flex items-baseline justify-between gap-3">
        <span className="min-w-0 truncate text-sm font-medium tracking-tight">{name}</span>
        {label ? <span className="shrink-0 font-mono text-xs tabular-nums text-muted">{label}</span> : null}
      </div>
      {hasBar ? (
        <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-white/10">
          <span
            className="block h-full rounded-full bg-[var(--mon-vibrant,#c8b48a)] transition-[width] duration-300"
            style={{ width: `${width}%` }}
          />
        </div>
      ) : null}
    </>
  );

  const className = "block w-full rounded-xl px-1 py-1.5 text-left transition hover:bg-white/[0.04]";
  if (onPick) {
    return (
      <button type="button" title={tip} onClick={onPick} className={className}>
        {body}
      </button>
    );
  }
  if (href) {
    return (
      <Link href={href} title={tip} className={className}>
        {body}
      </Link>
    );
  }
  return (
    <div title={tip} className={className}>
      {body}
    </div>
  );
}

export function KitUsageSection({
  title,
  items,
  empty,
  hrefFor,
  onPick,
}: {
  title: string;
  items: KitShare[];
  empty?: string;
  hrefFor?: (name: string) => string | undefined;
  onPick?: (name: string) => void;
}) {
  if (!items.length) {
    if (!empty) return null;
    return (
      <section>
        <h3 className="font-mono text-[10px] font-semibold uppercase tracking-[0.14em] text-muted">{title}</h3>
        <p className="mt-2 text-sm text-muted">{empty}</p>
      </section>
    );
  }
  const peak = maxPct(items) || 100;
  return (
    <section>
      <h3 className="font-mono text-[10px] font-semibold uppercase tracking-[0.14em] text-muted">{title}</h3>
      <ul className="mt-2 space-y-0.5">
        {items.map((item) => (
          <li key={`${title}-${item.name}`}>
            <UsageBar
              name={item.name}
              pct={item.pct}
              max={peak}
              href={hrefFor?.(item.name)}
              onPick={onPick ? () => onPick(item.name) : undefined}
            />
          </li>
        ))}
      </ul>
    </section>
  );
}

function SpreadBars({ spread }: { spread: KitSpread }) {
  const total = STATS.reduce((sum, s) => sum + spread[s.key], 0);
  return (
    <div>
      <p className="font-mono text-xs text-muted">
        {total} / 66 SP{formatPct(spread.pct) ? ` · ${formatPct(spread.pct)} of sets` : ""}
      </p>
      <dl className="mt-3 space-y-2">
        {STATS.map((s) => (
          <div key={s.key} className="grid grid-cols-[2.5rem_1fr_2rem] items-center gap-3 text-sm">
            <dt className="font-mono text-xs text-muted">{s.label}</dt>
            <dd className="h-1.5 overflow-hidden rounded-full bg-white/10">
              <span
                className="block h-full rounded-full bg-[var(--mon-vibrant,#c8b48a)]"
                style={{ width: `${(spread[s.key] / 32) * 100}%` }}
              />
            </dd>
            <dd className="font-mono text-xs tabular-nums">{spread[s.key]}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}

/** Primary: moves, items, teammates. Advanced: ability, nature, SP spread. */
export function KitUsagePanel({
  kit,
  teammateHref,
  onTeammate,
  emptyMoves = "No move usage listed.",
  emptyItems = "No item usage listed.",
  emptyTeammates = "No teammate list listed.",
}: {
  kit: ParsedBattleKit;
  teammateHref?: (name: string) => string | undefined;
  onTeammate?: (name: string) => void;
  emptyMoves?: string;
  emptyItems?: string;
  emptyTeammates?: string;
}) {
  return (
    <div className="space-y-7">
      <KitUsageSection title="Moves" items={kit.moves} empty={emptyMoves} />
      <KitUsageSection title="Held items" items={kit.items} empty={emptyItems} />
      <KitUsageSection
        title="Teammates"
        items={kit.teammates}
        empty={emptyTeammates}
        hrefFor={onTeammate ? undefined : teammateHref}
        onPick={onTeammate}
      />

      <details className="group rounded-2xl border border-line/70 bg-bg/40 open:bg-bg/55">
        <summary className="flex cursor-pointer list-none items-center justify-between gap-3 px-3.5 py-3 text-sm font-medium tracking-tight [&::-webkit-details-marker]:hidden">
          <span>Advanced — ability, nature, SP</span>
          <CaretDown
            size={14}
            weight="bold"
            className="shrink-0 text-muted transition group-open:rotate-180"
          />
        </summary>
        <div className="space-y-5 border-t border-line/60 px-3.5 py-4">
          <KitUsageSection title="Abilities" items={kit.abilities} empty="No ability share listed." />
          <KitUsageSection title="Natures" items={kit.natures} empty="No nature share listed." />
          <section>
            <h3 className="font-mono text-[10px] font-semibold uppercase tracking-[0.14em] text-muted">
              Leading spread
            </h3>
            <div className="mt-2">
              {kit.spreads[0] ? (
                <SpreadBars spread={kit.spreads[0]} />
              ) : (
                <p className="text-sm text-muted">No leading spread listed.</p>
              )}
            </div>
          </section>
        </div>
      </details>
    </div>
  );
}
