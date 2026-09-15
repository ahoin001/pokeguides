import Link from "next/link";
import type { ReactNode } from "react";
import { getPokemon } from "@/lib/catalog/load";
import { PokemonArt } from "@/components/pokemon/PokemonArt";
import { TypeBadge } from "@/components/pokemon/TypeBadge";
import { TypeIcon } from "@/components/pokemon/TypeIcon";
import { MultChip } from "@/components/scout/MultChip";
import type { ScoutSlotResult } from "@/lib/champions/vs";

export function VsSlotCard({
  result,
  hasMoves,
  compact = false,
}: {
  result: ScoutSlotResult;
  hasMoves: boolean;
  compact?: boolean;
}) {
  const mon = getPokemon(result.slug);
  if (!mon) return null;

  return (
    <article
      className={`flex h-full flex-col rounded-[28px] border border-line bg-raised/50 ${compact ? "p-3" : "p-5"}`}
    >
      <div className="flex items-center gap-3">
        <Link href={`/pokemon/${mon.slug}`} className="shrink-0">
          <PokemonArt slug={mon.slug} src={mon.artwork} name={mon.name} size={compact ? 44 : 64} />
        </Link>
        <div className="min-w-0">
          <h3 className={`truncate font-semibold tracking-tight ${compact ? "text-base" : "text-lg"}`}>{mon.name}</h3>
          <div className="mt-1 flex flex-wrap gap-1">
            {mon.types.map((t) => (
              <TypeBadge key={t} type={t} size="sm" />
            ))}
          </div>
        </div>
      </div>

      <Lane title="You → them" hint={hasMoves ? "Kit clicks" : "STABs"} compact={compact}>
        {result.youHit.length ? (
          <ul className="flex flex-wrap gap-2">
            {result.youHit.map((t) => (
              <li key={`${t.move ?? t.type}-${t.mult}`} className="inline-flex items-center gap-1.5">
                <TypeIcon type={t.type} size={compact ? "sm" : "md"} />
                <MultChip mult={t.mult} lane="out" label={t.move} large={!compact} />
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-muted">No typed clicks scored.</p>
        )}
      </Lane>

      <Lane title="Them → you" hint="Their STABs" compact={compact}>
        <ul className="flex flex-wrap gap-2">
          {result.theyHit.map((t) => (
            <li key={`in-${t.type}`} className="inline-flex items-center gap-1.5">
              <TypeIcon type={t.type} size={compact ? "sm" : "md"} />
              <MultChip mult={t.mult} lane="in" large={!compact} />
            </li>
          ))}
        </ul>
      </Lane>

      {result.bestMove ? (
        <p className={`mt-auto border-t border-line/70 ${compact ? "pt-2 text-sm" : "pt-3 text-base"}`}>
          <span className="font-medium">Best click. </span>
          <span className="text-muted">
            {result.bestMove.name}{" "}
            <MultChip mult={result.bestMove.mult} lane="out" large={!compact} />
          </span>
        </p>
      ) : null}
    </article>
  );
}

function Lane({
  title,
  hint,
  compact,
  children,
}: {
  title: string;
  hint: string;
  compact?: boolean;
  children: ReactNode;
}) {
  return (
    <div className={compact ? "mt-3" : "mt-5"}>
      <div className="flex items-baseline justify-between gap-2">
        <p className={`font-semibold tracking-tight ${compact ? "text-sm" : "text-base"}`}>{title}</p>
        <p className="text-xs text-muted">{hint}</p>
      </div>
      <div className="mt-2">{children}</div>
    </div>
  );
}
