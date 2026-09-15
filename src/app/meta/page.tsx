import { RankedBoard } from "@/components/meta/RankedBoard";
import { formatAsOf } from "@/lib/ranked/format";
import { rankedRows, rankedSingles } from "@/lib/ranked/load";

export default async function MetaPage({
  searchParams,
}: {
  searchParams: Promise<{ mon?: string; q?: string }>;
}) {
  const sp = await searchParams;
  const rows = rankedRows();
  return (
    <RankedBoard
      meta={{
        asOf: formatAsOf(rankedSingles.asOf),
        season: rankedSingles.season,
        source: rankedSingles.source,
        sourceUrl: rankedSingles.sourceUrl,
        note: rankedSingles.note,
        count: rankedSingles.count,
      }}
      pokemon={rows}
      initialMon={sp.mon ?? ""}
      initialQ={sp.q ?? ""}
    />
  );
}
