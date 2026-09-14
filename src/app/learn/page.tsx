import Link from "next/link";
import { chapterHref, getChapter, learnByGroup, type LearnChapter } from "@/content/learn";

export default function LearnIndex() {
  const building = getChapter("building");
  const roles = getChapter("roles");
  const archetypes = getChapter("archetypes");
  const reads = learnByGroup("play");

  return (
    <div>
      <h1 className="max-w-[10ch] text-4xl font-semibold tracking-tight md:text-5xl">Learn</h1>
      <p className="mt-4 max-w-[46ch] text-lg text-muted">
        A Pokémon is a job. A three is a plan. Then you learn the reads that punish a bad one.
      </p>

      <section className="mt-14">
        <h2 className="text-2xl font-semibold tracking-tight">Build a three</h2>
        {building ? <FeaturedChapter chapter={building} /> : null}
        <div className="mt-4 grid gap-3 md:grid-cols-2">
          {roles ? <HubLink chapter={roles} /> : null}
          {archetypes ? <HubLink chapter={archetypes} /> : null}
        </div>
        <Link
          href="/manuals"
          className="mt-3 block rounded-[28px] border border-line bg-raised/40 p-6 transition hover:bg-raised"
        >
          <h3 className="text-xl font-semibold tracking-tight">Field manuals</h3>
          <p className="mt-2 text-sm text-muted">
            Authored threes with If/Then trees: preview, first send, the hand-off, the late game.
          </p>
        </Link>
      </section>

      <section className="mt-20 max-w-3xl">
        <h2 className="text-2xl font-semibold tracking-tight">The reads</h2>
        <p className="mt-2 max-w-[48ch] text-sm text-muted">
          Preview, Speed, and the hole on your three. This is what separates a list from a team that wins.
        </p>
        <ul className="mt-6 divide-y divide-line rounded-[28px] border border-line">
          {reads.map((c) => (
            <li key={c.slug}>
              <Link href={chapterHref(c)} className="block px-5 py-4 transition hover:bg-raised/70">
                <h3 className="font-semibold tracking-tight">{c.title}</h3>
                <p className="mt-1 text-sm text-muted">{c.lede}</p>
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}

function FeaturedChapter({ chapter }: { chapter: LearnChapter }) {
  return (
    <Link
      href={chapterHref(chapter)}
      className="mt-5 block rounded-[32px] border border-line bg-raised/70 px-6 py-8 transition hover:bg-raised md:px-10 md:py-10"
      style={{
        background: `linear-gradient(120deg, color-mix(in srgb, var(--type-fighting) 16%, transparent), transparent 42%), var(--bg-raised)`,
      }}
    >
      <h3 className="text-3xl font-semibold tracking-tight md:text-4xl">{chapter.title}</h3>
      <p className="mt-4 max-w-[46ch] text-lg text-muted">{chapter.lede}</p>
    </Link>
  );
}

function HubLink({ chapter }: { chapter: LearnChapter }) {
  return (
    <Link
      href={chapterHref(chapter)}
      className="block rounded-[28px] border border-line bg-raised/40 p-6 transition hover:bg-raised"
    >
      <h3 className="text-xl font-semibold tracking-tight">{chapter.title}</h3>
      <p className="mt-2 text-sm text-muted">{chapter.lede}</p>
    </Link>
  );
}
