import Link from "next/link";
import { notFound } from "next/navigation";
import { fetchBattle, fetchBattleDaily } from "@/lib/champions-battle/client";
import { parseBattleKit, parseDailyMoveTrend } from "@/lib/champions-battle/parse";
import { getPokemon } from "@/lib/catalog/load";
import { getRanked, rankedByName } from "@/lib/ranked/load";
import { cssVars } from "@/lib/champions/palette";
import { PokemonArt } from "@/components/pokemon/PokemonArt";
import { TypeBadge } from "@/components/pokemon/TypeBadge";
import { LadderKit } from "@/components/ladder/LadderKit";
import { LadderTrend } from "@/components/ladder/LadderTrend";
import { legalTypes } from "@/lib/ranked/format";

/** Match CBD_REVALIDATE.battle (1h). */
export const revalidate = 3600;

type Props = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Props) {
  const { id } = await params;
  const ranked = getRanked(id.toLowerCase()) ?? rankedByName(id);
  return {
    title: `${ranked?.name ?? id} usage · Ringside`,
    description: `Live Champions Singles sets for ${ranked?.name ?? id}.`,
  };
}

export default async function UsageSpeciesPage({ params }: Props) {
  const { id } = await params;
  const showdownId = id.toLowerCase();

  let battle;
  let daily;
  try {
    [battle, daily] = await Promise.all([
      fetchBattle("Singles", showdownId),
      fetchBattleDaily("Singles", showdownId, 7),
    ]);
  } catch {
    notFound();
  }

  if (!battle?.rows?.length) notFound();

  const kit = parseBattleKit(battle.rows);
  const trend = parseDailyMoveTrend(daily?.daily ?? []);
  const ranked = getRanked(battle.showdownId) ?? rankedByName(battle.pokemon);
  const mon = ranked?.slug ? getPokemon(ranked.slug) : undefined;
  const types = legalTypes(ranked?.types ?? mon?.types ?? []);

  const teammateHref = (name: string) => {
    const hit = rankedByName(name);
    if (hit?.showdownId) return `/usage/${hit.showdownId}`;
    return undefined;
  };

  return (
    <article style={mon ? cssVars(mon.palette) : undefined} className="space-y-12">
      <p className="text-sm text-muted">
        <Link href="/usage" className="hover:text-ink">
          Live usage
        </Link>
        {" · "}
        <Link href="/meta" className="hover:text-ink">
          Meta board
        </Link>
        {mon ? (
          <>
            {" · "}
            <Link href={`/pokemon/${mon.slug}`} className="hover:text-ink">
              Dex entry
            </Link>
          </>
        ) : null}
      </p>

      <header className="grid items-center gap-8 lg:grid-cols-[0.7fr_1.3fr]">
        <div className="flex justify-center">
          {mon ? (
            <PokemonArt slug={mon.slug} src={mon.artwork} name={mon.name} size={240} share />
          ) : (
            <div className="flex h-56 w-56 items-center justify-center rounded-full border border-line bg-raised/50 font-mono text-muted">
              {battle.pokemon.slice(0, 3)}
            </div>
          )}
        </div>
        <div>
          {ranked?.rank ? (
            <p className="font-mono text-sm text-muted">Singles usage #{ranked.rank}</p>
          ) : (
            <p className="font-mono text-sm text-muted">Singles battle data</p>
          )}
          <h1 className="mt-1 text-5xl font-semibold tracking-tight">{battle.pokemon}</h1>
          <div className="mt-4 flex flex-wrap gap-2">
            {types.map((t) => (
              <TypeBadge key={t} type={t} />
            ))}
          </div>
          <p className="mt-5 max-w-[48ch] text-muted">
            Live kit from Champions Battle Data ({battle.season}
            {battle.date ? ` · ${battle.date}` : ""}). Mega and item choices shift with the regulation —
            read the percentages, then decide for your three.
          </p>
          <p className="mt-3 font-mono text-[11px] text-muted">
            Cached ~1h · daily trend ~6h ·{" "}
            <a
              href="https://championsbattledata.com/api_guide"
              className="underline hover:text-ink"
              target="_blank"
              rel="noreferrer"
            >
              API source
            </a>
          </p>
        </div>
      </header>

      <section className="rounded-[32px] border border-line bg-raised/40 p-5 sm:p-8">
        <h2 className="text-2xl font-semibold tracking-tight">Current kit</h2>
        <p className="mt-2 text-sm text-muted">Moves, items, nature, and the leading SP spread in Singles.</p>
        <div className="mt-8">
          <LadderKit kit={kit} teammateHref={teammateHref} />
        </div>
      </section>

      <section className="rounded-[32px] border border-line bg-sunken/80 p-5 sm:p-8">
        <h2 className="text-2xl font-semibold tracking-tight">Seven-day move share</h2>
        <p className="mt-2 text-sm text-muted">
          Daily snapshots of the leading move&apos;s usage percentage (newest on the right).
        </p>
        <div className="mt-8">
          <LadderTrend points={trend} />
        </div>
      </section>
    </article>
  );
}
