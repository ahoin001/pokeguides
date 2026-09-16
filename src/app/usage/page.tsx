import Link from "next/link";
import { getUsageBoard } from "@/lib/champions-battle/client";
import { getPokemon } from "@/lib/catalog/load";
import { getRanked, rankedByName, usageIndex } from "@/lib/ranked/load";
import { PokemonArt } from "@/components/pokemon/PokemonArt";
import { cssVars } from "@/lib/champions/palette";
import { UsageExplorer } from "@/components/ladder/UsageExplorer";

/** Match CBD_REVALIDATE.board (6h) — must be a literal for Next segment config. */
export const revalidate = 21600;

export const metadata = {
  title: "Live usage · Ringside",
  description: "Current Champions Singles battle data from Champions Battle Data.",
};

function slugFor(showdownId: string, name: string) {
  return getRanked(showdownId)?.slug ?? rankedByName(name)?.slug;
}

export default async function UsagePage() {
  let generatedAt: string | undefined;
  let season = usageIndex.season;
  let board: {
    rank: number;
    name: string;
    showdownId: string;
    slug?: string;
    move?: string;
    movePct?: number;
    item?: string;
  }[] = [];

  try {
    const live = await getUsageBoard();
    generatedAt = live.generatedAt;
    season = live.season;
    board = live.rows.map((row) => ({
      ...row,
      slug: slugFor(row.showdownId, row.name),
    }));
  } catch {
    board = Object.entries(usageIndex.bySlug)
      .map(([slug, u]) => ({
        rank: u.rank,
        name: u.name,
        showdownId: u.showdownId,
        slug,
        move: u.move,
        movePct: u.movePct,
        item: u.item,
      }))
      .sort((a, b) => a.rank - b.rank);
  }

  const featured = board.slice(0, 6).map((row) => {
    const mon = row.slug ? getPokemon(row.slug) : undefined;
    return { ...row, mon };
  });

  return (
    <div className="space-y-12">
      <header className="max-w-2xl">
        <p className="font-mono text-xs uppercase tracking-[0.16em] text-muted">Live ladder</p>
        <h1 className="mt-2 text-4xl font-semibold tracking-tight md:text-5xl">Usage, refreshed</h1>
        <p className="mt-3 text-lg text-muted">
          Current Champions Ranked Singles from{" "}
          <a
            href="https://championsbattledata.com/api_guide"
            className="underline decoration-line underline-offset-4 hover:text-ink"
            target="_blank"
            rel="noreferrer"
          >
            Champions Battle Data
          </a>
          . The board is a trimmed cache of the API index; each species page loads live kits with
          hourly revalidation.
        </p>
        <p className="mt-3 font-mono text-xs text-muted">
          Season {season}
          {generatedAt ? ` · index ${generatedAt.slice(0, 10)}` : ` · snapshot ${usageIndex.asOf}`}
          {" · "}
          <Link href="/meta" className="underline hover:text-ink">
            Teaching meta board
          </Link>
        </p>
      </header>

      <section>
        <h2 className="text-sm font-semibold uppercase tracking-[0.12em] text-muted">Board right now</h2>
        <ul className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {featured.map((row) => (
            <li key={row.showdownId}>
              <Link
                href={`/usage/${row.showdownId}`}
                className="flex items-center gap-3 rounded-[24px] border border-line bg-raised/60 p-3 transition hover:border-ink/40"
                style={row.mon ? cssVars(row.mon.palette) : undefined}
              >
                {row.mon ? (
                  <PokemonArt slug={row.mon.slug} src={row.mon.artwork} name={row.mon.name} size={64} />
                ) : (
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white/5 font-mono text-xs text-muted">
                    #{row.rank}
                  </div>
                )}
                <div className="min-w-0">
                  <p className="font-mono text-[10px] text-muted">#{String(row.rank).padStart(2, "0")}</p>
                  <p className="truncate font-semibold tracking-tight">{row.name}</p>
                  <p className="mt-0.5 truncate text-xs text-muted">
                    {row.move ?? "—"}
                    {row.item ? ` · ${row.item}` : ""}
                  </p>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <UsageExplorer rows={board} />
    </div>
  );
}
