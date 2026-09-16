import Link from "next/link";
import { getPokemon } from "@/lib/catalog/load";
import { cssVars } from "@/lib/champions/palette";
import { PokemonArt } from "@/components/pokemon/PokemonArt";
import { TypePlayground } from "@/components/viz/TypePlayground";
import { RosterBoard } from "@/components/learn/RosterBoard";
import { PlaystyleChooser } from "@/components/learn/PlaystyleChooser";
import { LoadSampleSix } from "@/components/learn/LoadSampleSix";
import { SampleSix } from "@/components/learn/SampleSix";
import { LessonNav } from "@/components/learn/LessonNav";
import { StadiumTray } from "@/components/learn/StadiumTray";
import { AbilityCards } from "@/components/learn/AbilityCards";
import { TrainingViz } from "@/components/learn/TrainingViz";
import { SpeedClassroom } from "@/components/learn/SpeedClassroom";
import { WinconStack } from "@/components/learn/WinconStack";
import { PreviewBoard } from "@/components/learn/PreviewBoard";
import { HolesCompare } from "@/components/learn/HolesCompare";
import { DecisionTree } from "@/components/learn/DecisionTree";
import {
  BUILDING_PLAN,
  JOB_ROSTER,
  nextLesson,
  type LearnTrack,
  type Lesson,
} from "@/content/curriculum";
import { nextDoublesLesson } from "@/content/curriculum-doubles";
import { getLearnFlow, LEARN_FLOWS } from "@/content/learn-flows";
import { CANONICAL_MANUALS, manualHref } from "@/content/manuals";
import { ARCHETYPES, archetypeHref } from "@/content/archetypes";

export function LessonView({
  lesson,
  track = lesson.track ?? "singles",
}: {
  lesson: Lesson;
  track?: LearnTrack;
}) {
  const wash = getPokemon(lesson.examples[0]?.slug);
  const doubles = track === "doubles";
  const manuals = doubles
    ? []
    : CANONICAL_MANUALS.filter((m) => lesson.relatedManuals.includes(m.id));
  const extraFlows =
    lesson.slug === "moves"
      ? LEARN_FLOWS.filter((f) => f.id === "they-protect" || f.id === "ice-onto-the-kite")
      : [];
  const band = lesson.band === "poke-ball"
    ? "Poké Ball"
    : lesson.band === "great-ball"
      ? "Great Ball"
      : lesson.band === "ultra-ball"
        ? "Ultra Ball"
        : "Master Ball";

  return (
    <article className="mx-auto w-full max-w-5xl" style={wash ? cssVars(wash.palette) : undefined}>
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

      {extraFlows.map((flow) => (
        <DecisionTree key={flow.id} flow={flow} compact />
      ))}

      {lesson.slug === "archetypes" ? (
        <section className="mt-16">
          <h2 className="text-2xl font-semibold tracking-tight">Classroom threes</h2>
          <ul className="mt-6 space-y-8">
            {ARCHETYPES.map((style) => (
              <li key={style.id} className="rounded-[28px] border border-line bg-raised/40 p-5">
                <div className="flex flex-wrap items-end justify-between gap-3">
                  <div>
                    <Link href={archetypeHref(style.id)} className="text-xl font-semibold tracking-tight hover:underline">
                      {style.name}
                    </Link>
                    <p className="mt-1 text-sm text-muted">{style.oneLiner}</p>
                  </div>
                  <LoadSampleSix slugs={style.sampleSix} intent={style.id} />
                </div>
                <div className="mt-4">
                  <SampleSix slugs={style.sampleSix} note={style.sampleNote} />
                </div>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {lesson.slug === "jobs" ? (
        <p className="mt-10 text-sm text-muted">
          Jump into a job:{" "}
          <Link href="/learn/roles" className="underline">
            the five chapters
          </Link>
          . Sweeper and wall are translations.
        </p>
      ) : null}

      {manuals.length ? (
        <section className="mt-16 max-w-3xl">
          <h2 className="text-2xl font-semibold tracking-tight">Exam</h2>
          <p className="mt-2 text-sm text-muted">Manuals are the practicum. The tree is the test.</p>
          <ul className="mt-4 divide-y divide-line rounded-[28px] border border-line">
            {manuals.map((m) => (
              <li key={m.id}>
                <Link href={manualHref(m.id)} className="block px-5 py-4 transition hover:bg-raised/70">
                  <p className="font-semibold tracking-tight">{m.title}</p>
                  <p className="mt-1 text-sm text-muted">{m.lede}</p>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {lesson.slug === "keeping-up" || lesson.slug === "review" || lesson.slug === "positioning" || lesson.slug === "tempo" ? (
        <p className="mt-10 text-sm text-muted">
          Dated snapshot:{" "}
          <Link href="/meta" className="underline">
            Ranked Meta
          </Link>
          {doubles ? " (singles usage — say so when you use it)" : ""}. Words you will hear:{" "}
          <Link href="/glossary" className="underline">
            Glossary
          </Link>
          .
        </p>
      ) : null}

      {doubles && lesson.slug === "doubles-positioning" ? (
        <section className="mt-16 max-w-3xl">
          <h2 className="text-2xl font-semibold tracking-tight">After the battle</h2>
          <p className="mt-2 text-sm text-muted">
            Review and keeping up are the same skills on singles. Ranked Meta here is a 3v3 snapshot.
          </p>
          <ul className="mt-4 divide-y divide-line rounded-[28px] border border-line">
            <li>
              <Link href="/learn/review" className="block px-5 py-4 transition hover:bg-raised/70">
                <p className="font-semibold tracking-tight">Why did that happen?</p>
                <p className="mt-1 text-sm text-muted">Name the turn. Take the loss. Know when to stop.</p>
              </Link>
            </li>
            <li>
              <Link href="/learn/keeping-up" className="block px-5 py-4 transition hover:bg-raised/70">
                <p className="font-semibold tracking-tight">What is everyone using?</p>
                <p className="mt-1 text-sm text-muted">Usage and sets. Then the Champion practicum on manuals.</p>
              </Link>
            </li>
          </ul>
        </section>
      ) : null}

      <LessonNext slug={lesson.slug} track={track} />
    </article>
  );
}

function LessonViz({ lesson }: { lesson: Lesson }) {
  switch (lesson.viz) {
    case "stadium":
      return (
        <StadiumTray
          you={lesson.examples.slice(0, 3)}
          youLabel={lesson.track === "doubles" ? "A doubles four" : "Your three"}
          themLabel={lesson.track === "doubles" ? "Theirs — empty until you pick four" : undefined}
        />
      );
    case "types":
      return <TypePlayground seed="fairy" />;
    case "ability-field":
      return <AbilityCards beats={lesson.beats} />;
    case "flowchart": {
      const flow = lesson.flowId ? getLearnFlow(lesson.flowId) : undefined;
      return flow ? <DecisionTree flow={flow} compact /> : null;
    }
    case "training":
      return <TrainingViz />;
    case "speed-tape":
      return <SpeedClassroom />;
    case "roster":
      return <RosterBoard roster={JOB_ROSTER} />;
    case "wincon-stack":
      return <WinconStack plan={BUILDING_PLAN} heading="" lede="" id="wincon" />;
    case "chooser":
      return <PlaystyleChooser />;
    case "matchup":
      return <HolesCompare />;
    case "preview-board":
      return <PreviewBoard />;
    default:
      return null;
  }
}

function LessonNext({ slug, track }: { slug: string; track: LearnTrack }) {
  const next = track === "doubles" ? nextDoublesLesson(slug) : nextLesson(slug);
  if (!next) return null;
  return (
    <Link href={next.href} className="mt-12 block text-sm text-muted hover:text-ink">
      Next: {next.title}
    </Link>
  );
}
