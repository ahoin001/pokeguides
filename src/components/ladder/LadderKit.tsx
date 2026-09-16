import Link from "next/link";
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

function ShareList({
  title,
  items,
  onName,
}: {
  title: string;
  items: KitShare[];
  onName?: (name: string) => string | undefined;
}) {
  if (!items.length) return null;
  return (
    <section>
      <h3 className="font-mono text-[10px] font-semibold uppercase tracking-[0.14em] text-muted">
        {title}
      </h3>
      <ul className="mt-2 space-y-1.5">
        {items.map((item) => {
          const href = onName?.(item.name);
          const pct = formatPct(item.pct);
          const label = (
            <>
              <span className="text-ink">{item.name}</span>
              {pct ? <span className="font-mono text-muted"> · {pct}</span> : null}
            </>
          );
          return (
            <li key={`${title}-${item.name}`} className="text-sm">
              {href ? (
                <Link href={href} className="transition hover:underline">
                  {label}
                </Link>
              ) : (
                label
              )}
            </li>
          );
        })}
      </ul>
    </section>
  );
}

function SpreadBlock({ spread }: { spread: KitSpread }) {
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
                className="block h-full rounded-full bg-[var(--mon-vibrant,theme(colors.ink))]"
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

export function LadderKit({
  kit,
  teammateHref,
  compact = false,
}: {
  kit: ParsedBattleKit;
  teammateHref?: (name: string) => string | undefined;
  compact?: boolean;
}) {
  return (
    <div className={`grid gap-8 ${compact ? "sm:grid-cols-2" : "md:grid-cols-2 lg:grid-cols-3"}`}>
      <ShareList title="Moves" items={kit.moves} />
      <ShareList title="Items" items={kit.items} />
      <ShareList title="Ability" items={kit.abilities} />
      <ShareList title="Nature" items={kit.natures} />
      <ShareList title="Teammates" items={kit.teammates} onName={teammateHref} />
      {kit.spreads[0] ? (
        <section>
          <h3 className="font-mono text-[10px] font-semibold uppercase tracking-[0.14em] text-muted">
            Leading spread
          </h3>
          <div className="mt-2">
            <SpreadBlock spread={kit.spreads[0]} />
          </div>
        </section>
      ) : null}
    </div>
  );
}
