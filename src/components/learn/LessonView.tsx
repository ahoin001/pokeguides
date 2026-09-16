import Link from "next/link";
import { PageFrame } from "@/components/chrome/PageFrame";
import { getPokemon } from "@/lib/catalog/lookup";
import { cssVars } from "@/lib/champions/palette";
import { PokemonArt } from "@/components/pokemon/PokemonArt";
import { BallIcon, ballLabel } from "@/components/learn/BallIcon";
import { LessonPlanNav } from "@/components/learn/LessonPlanNav";
import { LessonViz } from "@/components/learn/LessonViz";
import { LessonRelated } from "@/components/learn/LessonRelated";
import { FightClassroom } from "@/components/learn/FightClassroom";
import { TypesClassroom } from "@/components/learn/TypesClassroom";
import { AbilitiesClassroom } from "@/components/learn/AbilitiesClassroom";
import { MoveSheetClassroom } from "@/components/learn/MoveSheetClassroom";
import { DecisionTree } from "@/components/learn/DecisionTree";
import { type LearnTrack, type Lesson, isMoveSheet } from "@/content/curriculum";
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

  const classroom =
    lesson.slug === "the-fight" ? (
      <FightClassroom lesson={lesson} />
    ) : lesson.slug === "types" ? (
      <TypesClassroom lesson={lesson} />
    ) : lesson.slug === "abilities" ? (
      <AbilitiesClassroom lesson={lesson} />
    ) : isMoveSheet(lesson.slug) ? (
      <MoveSheetClassroom lesson={lesson} />
    ) : null;

  return (
    <PageFrame
      variant="tool"
      sticky="local"
      className="!max-w-6xl"
      style={wash ? cssVars(wash.palette) : undefined}
    >
      <div className="lg:grid lg:grid-cols-[minmax(16.5rem,19rem)_minmax(0,1fr)] lg:items-start lg:gap-10">
        <LessonPlanNav lesson={lesson} track={track} />

        <article className="min-w-0">
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
            <span className="inline-flex items-center gap-1.5 text-muted">
              <span> · </span>
              <BallIcon band={lesson.band} size={16} className="inline-block align-[-2px]" />
              <span>{ballLabel(lesson.band)}</span>
            </span>
          </p>
          <h1 className="mt-2 max-w-[22ch] text-4xl font-semibold tracking-tight lg:text-5xl">
            {lesson.title}
          </h1>
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

          {classroom ? (
            classroom
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
                        {beat.examples?.length ? (
                          <ul className="mt-4 flex flex-wrap gap-2">
                            {beat.examples.map((chip) => {
                              const mon = getPokemon(chip.slug);
                              if (!mon) return null;
                              return (
                                <li key={chip.slug}>
                                  <Link
                                    href={`/pokemon/${mon.slug}`}
                                    title={chip.caption}
                                    className="inline-flex items-center gap-2 rounded-full border border-line/70 bg-raised/40 py-1 pl-1 pr-3 text-sm transition hover:border-ink/40"
                                    style={cssVars(mon.palette)}
                                  >
                                    <PokemonArt
                                      slug={mon.slug}
                                      src={mon.sprite || mon.artwork}
                                      name={mon.name}
                                      size={32}
                                    />
                                    <span className="min-w-0">
                                      <span className="block font-medium leading-tight">{mon.name}</span>
                                      <span className="block max-w-[16ch] truncate text-[11px] text-muted">
                                        {chip.caption}
                                      </span>
                                    </span>
                                  </Link>
                                </li>
                              );
                            })}
                          </ul>
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
      </div>
    </PageFrame>
  );
}
