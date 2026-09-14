import Link from "next/link";
import { notFound } from "next/navigation";
import { chapterHref, LEARN, LEARN_HUBS } from "@/content/learn";

export function generateStaticParams() {
  return LEARN.filter((c) => !LEARN_HUBS.has(c.slug)).map((c) => ({ slug: c.slug }));
}

export default async function LearnChapter({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const chapter = LEARN.find((c) => c.slug === slug);
  if (!chapter || LEARN_HUBS.has(chapter.slug)) notFound();
  const next = LEARN[LEARN.findIndex((c) => c.slug === slug) + 1];

  return (
    <article className="mx-auto max-w-3xl">
      <p className="text-sm text-muted">
        <Link href="/learn" className="hover:text-ink">
          Learn
        </Link>
      </p>
      <h1 className="mt-2 text-4xl font-semibold tracking-tight">{chapter.title}</h1>
      <p className="mt-4 text-lg text-muted">{chapter.lede}</p>
      <div className="mt-8 space-y-5 text-[17px] leading-relaxed">
        {chapter.body.map((p) => (
          <p key={p}>{p}</p>
        ))}
      </div>
      {chapter.beats?.length ? (
        <ol className="mt-12 space-y-10">
          {chapter.beats.map((beat) => (
            <li key={beat.title}>
              <h2 className="text-2xl font-semibold tracking-tight">{beat.title}</h2>
              <p className="mt-3 text-[17px] leading-relaxed text-muted">{beat.body}</p>
            </li>
          ))}
        </ol>
      ) : null}
      {chapter.href ? (
        <Link href={chapter.href} className="mt-10 inline-block text-sm underline">
          {chapter.hrefLabel ?? "Open"}
        </Link>
      ) : null}
      {next ? (
        <Link href={chapterHref(next)} className="mt-12 block text-sm text-muted hover:text-ink">
          Next: {next.title}
        </Link>
      ) : (
        <Link href="/team" className="mt-12 block text-sm text-muted hover:text-ink">
          Put a three on the board
        </Link>
      )}
    </article>
  );
}
