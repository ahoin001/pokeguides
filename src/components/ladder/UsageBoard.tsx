import Link from "next/link";
import { getUsageBoard } from "@/lib/champions-battle/client";
import { getPokemon } from "@/lib/catalog/lookup";
import { getRanked, rankedByName, usageIndex } from "@/lib/ranked/load";
import { PokemonArt } from "@/components/pokemon/PokemonArt";
import { cssVars } from "@/lib/champions/palette";

function slugFor(showdownId: string, name: string) {
  return getRanked(showdownId)?.slug ?? rankedByName(name)?.slug;
}

export async function UsageBoard() {
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

  return (
    <div className="space-y-10">
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
          . Same entry as the teaching snapshot — this mode is the live pipeline.
        </p>
        <p className="mt-3 font-mono text-xs text-muted">
          Season {season}
          {generatedAt ? ` · index ${generatedAt.slice(0, 10)}` : ` · snapshot ${usageIndex.asOf}`}
        </p>
      </header>

      <ol className="divide-y divide-line/70 border-y border-line/70">
        {board.map((row) => {
          const mon = row.slug ? getPokemon(row.slug) : undefined;
          const href = row.slug ? `/pokemon/${row.slug}` : undefined;
          const inner = (
            <span className="flex items-center gap-3 py-2.5">
              <span className="w-8 shrink-0 font-mono text-xs tabular-nums text-muted">
                {String(row.rank).padStart(2, "0")}
              </span>
              {mon ? (
                <PokemonArt slug={mon.slug} src={mon.artwork} name={mon.name} size={40} className="shrink-0" />
              ) : (
                <span className="h-10 w-10 shrink-0 rounded-full bg-white/5" />
              )}
              <span className="min-w-0 flex-1">
                <span className="block truncate font-medium">{row.name}</span>
                <span className="block truncate text-sm text-muted">
                  {row.move ?? "—"}
                  {row.item ? ` · ${row.item}` : ""}
                </span>
              </span>
            </span>
          );
          return (
            <li key={row.showdownId} style={mon ? cssVars(mon.palette) : undefined}>
              {href ? (
                <Link href={href} className="block transition hover:bg-white/5">
                  {inner}
                </Link>
              ) : (
                inner
              )}
            </li>
          );
        })}
      </ol>
    </div>
  );
}
