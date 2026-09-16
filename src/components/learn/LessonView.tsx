import Link from "next/link";
import { PageFrame } from "@/components/chrome/PageFrame";
import { getPokemon } from "@/lib/catalog/lookup";
import { cssVars } from "@/lib/champions/palette";
import { PokemonArt } from "@/components/pokemon/PokemonArt";
import { LessonNav } from "@/components/learn/LessonNav";
import { LessonViz } from "@/components/learn/LessonViz";
import { LessonRelated } from "@/components/learn/LessonRelated";
import { FightClassroom } from "@/components/learn/FightClassroom";
import { TypesClassroom } from "@/components/learn/TypesClassroom";
import { DecisionTree } from "@/components/learn/DecisionTree";
import { type LearnTrack, type Lesson } from "@/content/curriculum";
import { LEARN_FLOWS } from "@/content/learn-flows";

export function LessonView({
  lesson,
  track = lesson.track ?? "singles",
}: {
  lesson: Lesson;
  track?: LearnTrack;
}) {
  const wash = getPokemon(lesson.examples[0]?.slug);
  const doubles = track === "doubles";
  const extraFlows =
    lesson.slug === "moves"
      ? LEARN_FLOWS.filter((f) => f.id === "they-protect" || f.id === "ice-onto-the-kite")
      : [];
  const band =
    lesson.band === "poke-ball"
      ? "Poké Ball"
      : lesson.band === "great-ball"
        ? "Great Ball"
        : lesson.band === "ultra-ball"
          ? "Ultra Ball"
          : "Master Ball";

  return (
    <PageFrame variant="tool" sticky="local" style={wash ? cssVars(wash.palette) : undefined}>
      <article>
        <LessonNav lesson={lesson} track={track} />

        <p className="text-sm text-muted">
          <Link href="/learn" className="hover:text-ink">
            Learn
          </Link>
          {doubles ? (
            <>
              {" / "}
              <Link href="/learn/doubles" className="hover:text-ink">
                Doubles
              </Link>
            </>
          ) : null}
          <span className="text-muted"> · {band}</span>
        </p>
        <h1 className="mt-2 max-w-[22ch] text-4xl font-semibold tracking-tight lg:text-5xl">{lesson.title}</h1>
        <p className="mt-4 max-w-[52ch] text-lg text-muted">{lesson.thesis}</p>
        <p className="mt-2 text-sm text-muted">{lesson.skipIf}</p>

        <div className="mt-10">
          <LessonViz lesson={lesson} />
        </div>
        {lesson.slug === "types" ? (
          <p className="mt-4 text-sm text-muted">
            <Link href="/types" className="underline">
              Open the full type sheet
            </Link>
          </p>
        ) : null}

        {lesson.slug === "the-fight" ? (
          <FightClassroom lesson={lesson} />
        ) : lesson.slug === "types" ? (
          <TypesClassroom lesson={lesson} />
        ) : (
          <>
            <div className="mt-10 max-w-3xl space-y-5 text-[17px] leading-relaxed">
              {lesson.body.map((p) => (
                <p key={p}>{p}</p>
              ))}
            </div>

            {lesson.beats.length ? (
              <ol className="mt-12 max-w-3xl space-y-10">
                {lesson.beats.map((beat) => {
                  const ex = beat.example ? getPokemon(beat.example.slug) : undefined;
                  return (
                    <li key={beat.title}>
                      <h2 className="text-2xl font-semibold tracking-tight">{beat.title}</h2>
                      <p className="mt-3 text-[17px] leading-relaxed text-muted">{beat.body}</p>
                      {beat.takeaway ? (
                        <p className="mt-4 max-w-[48ch] border-t border-line pt-3 text-[15px] leading-snug">
                          {beat.takeaway}
                        </p>
                      ) : null}
                      {ex && beat.example ? (
                        <Link
                          href={`/pokemon/${ex.slug}`}
                          className="mt-4 inline-flex items-center gap-3 rounded-2xl border border-line bg-raised/50 px-3 py-2"
                          style={cssVars(ex.palette)}
                        >
                          <PokemonArt slug={ex.slug} src={ex.artwork} name={ex.name} size={48} />
                          <span>
                            <span className="block font-medium">{ex.name}</span>
                            <span className="text-sm text-muted">{beat.example.caption}</span>
                          </span>
                        </Link>
                      ) : null}
                    </li>
                  );
                })}
              </ol>
            ) : null}
          </>
        )}

        {extraFlows.map((flow) => (
          <DecisionTree key={flow.id} flow={flow} compact />
        ))}

        <LessonRelated lesson={lesson} track={track} />
      </article>
    </PageFrame>
  );
}
