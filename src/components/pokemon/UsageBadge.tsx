"use client";

import Link from "next/link";
import { formatPct } from "@/lib/ranked/format";
import { usageForSlug } from "@/lib/ranked/usage-client";

export function UsageBadge({
  slug,
  className = "",
  linked = true,
}: {
  slug: string;
  className?: string;
  /** When nested inside another link, render a non-interactive chip. */
  linked?: boolean;
}) {
  const usage = usageForSlug(slug);
  if (!usage) return null;
  const body = (
    <>
      <span>#{usage.rank}</span>
      {usage.move ? (
        <span className="max-w-[12ch] truncate normal-case tracking-normal text-ink/70">
          {usage.move}
          {formatPct(usage.movePct) ? ` · ${formatPct(usage.movePct)}` : ""}
        </span>
      ) : null}
    </>
  );
  const shell = `inline-flex items-center gap-1.5 rounded-full border border-line/80 bg-bg/50 px-2 py-0.5 font-mono text-[10px] uppercase tracking-[0.12em] text-muted ${className}`;
  if (!linked) {
    return <span className={shell}>{body}</span>;
  }
  return (
    <Link href={`/usage/${usage.showdownId}`} className={`${shell} transition hover:border-ink/40 hover:text-ink`}>
      {body}
    </Link>
  );
}
