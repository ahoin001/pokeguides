import { PageFrame } from "@/components/chrome/PageFrame";
import { RankedBoard } from "@/components/meta/RankedBoard";
import { UsageBoard } from "@/components/ladder/UsageBoard";
import { formatAsOf } from "@/lib/ranked/format";
import { rankedRows, rankedSingles } from "@/lib/ranked/load";

export const revalidate = 21600;

export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<{ source?: string }>;
}) {
  const sp = await searchParams;
  if (sp.source === "live") {
    return {
      title: "Live usage",
      description: "Current Champions Singles battle data from Champions Battle Data.",
    };
  }
  return {
    title: "Ranked meta",
    description: "Teaching snapshot of Champions Ranked Singles.",
  };
}

export default async function MetaPage({
  searchParams,
}: {
  searchParams: Promise<{ mon?: string; q?: string; source?: string }>;
}) {
  const sp = await searchParams;
  const live = sp.source === "live";
  const rows = rankedRows();
  return (
    <PageFrame variant="board">
      {live ? (
        <UsageBoard />
      ) : (
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
      )}
    </PageFrame>
  );
}
