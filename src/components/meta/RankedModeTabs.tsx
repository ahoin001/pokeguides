"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";

export function RankedModeTabs() {
  const sp = useSearchParams();
  const live = sp.get("source") === "live";
  return (
    <nav aria-label="Ranked data mode" className="mb-8 flex flex-wrap gap-2">
      <Link
        href="/meta"
        className={`inline-flex min-h-9 items-center rounded-full px-3.5 text-sm ${
          live ? "bg-white/6 text-muted hover:bg-white/10 hover:text-ink" : "bg-ink text-bg"
        }`}
      >
        Teaching snapshot
      </Link>
      <Link
        href="/meta?source=live"
        className={`inline-flex min-h-9 items-center rounded-full px-3.5 text-sm ${
          live ? "bg-ink text-bg" : "bg-white/6 text-muted hover:bg-white/10 hover:text-ink"
        }`}
      >
        Live usage
      </Link>
    </nav>
  );
}
