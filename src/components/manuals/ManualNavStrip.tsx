import Link from "next/link";
import { getPokemon } from "@/lib/catalog/load";
import { cssVars } from "@/lib/champions/palette";
import { PokemonArt } from "@/components/pokemon/PokemonArt";
import {
  MANUAL_FAMILY_LABEL,
  manualFamily,
  manualHref,
  relatedManuals,
  siblingManuals,
  type TeamManual,
} from "@/content/manuals";

/** Prev/next in family + related manuals that share box species. */
export function ManualNavStrip({ manualId }: { manualId: string }) {
  const { family, prev, next } = siblingManuals(manualId);
  const related = relatedManuals(manualId, 4);

  return (
    <div className="mx-auto mt-16 max-w-6xl space-y-10 border-t border-line/80 pt-10">
      <nav aria-label="Nearby manuals" className="flex flex-wrap items-center justify-between gap-4">
        <div className="min-w-0 flex-1">
          {prev ? (
            <Link
              href={manualHref(prev.id)}
              className="group block max-w-sm rounded-2xl border border-line bg-raised/40 px-4 py-3 transition hover:border-ink/40"
            >
              <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-muted">Previous</p>
              <p className="mt-1 font-medium tracking-tight group-hover:underline">{prev.title}</p>
            </Link>
          ) : (
            <p className="text-sm text-muted">Start of {MANUAL_FAMILY_LABEL[family]}</p>
          )}
        </div>
        <Link href="/manuals" className="text-sm text-muted underline hover:text-ink">
          All manuals
        </Link>
        <div className="flex min-w-0 flex-1 justify-end">
          {next ? (
            <Link
              href={manualHref(next.id)}
              className="group block max-w-sm rounded-2xl border border-line bg-raised/40 px-4 py-3 text-right transition hover:border-ink/40"
            >
              <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-muted">Next</p>
              <p className="mt-1 font-medium tracking-tight group-hover:underline">{next.title}</p>
            </Link>
          ) : (
            <p className="text-sm text-muted">End of {MANUAL_FAMILY_LABEL[family]}</p>
          )}
        </div>
      </nav>

      {related.length ? (
        <section>
          <h2 className="text-lg font-semibold tracking-tight">Related manuals</h2>
          <p className="mt-1 max-w-[48ch] text-sm text-muted">
            Same family or overlapping registered six — other packages you might study next.
          </p>
          <ul className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {related.map((m) => (
              <li key={m.id}>
                <RelatedCard manual={m} />
              </li>
            ))}
          </ul>
        </section>
      ) : null}
    </div>
  );
}

function RelatedCard({ manual }: { manual: TeamManual }) {
  const show = (manual.box?.length ? manual.box : manual.slugs).slice(0, 3);
  const mons = show.map((s) => (s ? getPokemon(s) : undefined));
  const wash = mons.find(Boolean);
  return (
    <Link
      href={manualHref(manual.id)}
      className="block h-full rounded-2xl border border-line bg-raised/40 p-3 transition hover:border-ink/40 hover:bg-raised/60"
      style={wash ? cssVars(wash.palette) : undefined}
    >
      <div className="flex -space-x-2">
        {mons.map((p, i) =>
          p ? (
            <span key={p.slug} className="relative inline-flex rounded-full border border-bg">
              <PokemonArt slug={p.slug} src={p.artwork} name={p.name} size={36} />
            </span>
          ) : (
            <span key={i} className="h-9 w-9 rounded-full bg-white/5" />
          ),
        )}
      </div>
      <p className="mt-2 text-sm font-medium tracking-tight">{manual.title}</p>
      <p className="mt-0.5 text-[11px] text-muted">{MANUAL_FAMILY_LABEL[manualFamily(manual)]}</p>
    </Link>
  );
}
