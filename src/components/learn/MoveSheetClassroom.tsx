"use client";

import Link from "next/link";
import {
  ClassroomLead,
  RulesGrid,
  Takeaway,
  ChipRow,
  ExampleLink,
} from "@/components/learn/ClassroomChrome";
import {
  MOVE_SHEET_SLUGS,
  getLesson,
  lessonHref,
  type Lesson,
  type LessonBeat,
  type MoveSheetSlug,
} from "@/content/curriculum";

const SHEET_LEDES: Record<MoveSheetSlug, { rulesTitle: string; rulesLede: string }> = {
  moves: {
    rulesTitle: "Priority ladder",
    rulesLede: "Higher number goes first. Same number = Speed. Every verb below: what it does, when they click it, how you answer.",
  },
  "status-moves": {
    rulesTitle: "Status jobs",
    rulesLede: "Each condition buys a different turn. Does · When · Answer — same for every status.",
  },
  "field-moves": {
    rulesTitle: "The board",
    rulesLede: "One field wins. Overwrite is a funeral. Read each board state the same three ways.",
  },
  "boost-moves": {
    rulesTitle: "Stage math",
    rulesLede: "Setup needs a free turn. Debuffs need a cleaner. Know the reset before you stack.",
  },
  "pivot-moves": {
    rulesTitle: "Leave on your terms",
    rulesLede: "Hard switch donates a hit. Pivot when stay and swap both need an answer.",
  },
  "defense-moves": {
    rulesTitle: "Deny the turn",
    rulesLede: "Protect is a question. Encore locks a mistake. Punish the shield — do not feed it.",
  },
  "blank-turns": {
    rulesTitle: "Why the hit failed",
    rulesLede: "Miss, Protect, type 0×, ability, or item — name the blank before you click. Free turns win games.",
  },
};

export function MoveSheetClassroom({ lesson }: { lesson: Lesson }) {
  const slug = lesson.slug as MoveSheetSlug;
  const copy = SHEET_LEDES[slug] ?? SHEET_LEDES.moves;

  return (
    <div className="mt-10 space-y-14">
      <ClassroomLead lesson={lesson} />

      <SheetNav current={slug} />

      <RulesGrid title={copy.rulesTitle} lede={copy.rulesLede} rules={lesson.rules ?? []} />

      <div className="space-y-14">
        {lesson.beats.map((beat) => (
          <MoveVerb key={beat.title} beat={beat} />
        ))}
      </div>

      <SheetNav current={slug} />
    </div>
  );
}

function SheetNav({ current }: { current: MoveSheetSlug }) {
  return (
    <nav aria-label="Move reference sheets" className="overflow-x-auto">
      <ul className="flex min-w-max gap-2 border-y border-line py-3">
        {MOVE_SHEET_SLUGS.map((slug) => {
          const lesson = getLesson(slug);
          if (!lesson) return null;
          const on = slug === current;
          return (
            <li key={slug}>
              <Link
                href={lessonHref(slug)}
                className={`block rounded-full border px-3.5 py-1.5 text-sm transition ${
                  on
                    ? "border-ink/40 bg-raised font-medium text-ink"
                    : "border-line/70 text-muted hover:border-ink/30 hover:text-ink"
                }`}
              >
                {shortTitle(lesson.title)}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

function shortTitle(title: string) {
  // Keep the nav chips short for the strip.
  if (title.startsWith("Moves that")) return "Priority";
  if (title.startsWith("Status")) return "Status";
  if (title.startsWith("Weather")) return "Field";
  if (title.startsWith("Boosts")) return "Boosts";
  if (title.startsWith("Pivots")) return "Pivots";
  if (title.startsWith("Defense")) return "Defense";
  if (title.startsWith("When attacks")) return "Blanks";
  return title;
}

function MoveVerb({ beat }: { beat: LessonBeat }) {
  const users = beat.examples?.length ? beat.examples : beat.example ? [beat.example] : undefined;

  return (
    <section className="grid gap-8 border-t border-line pt-12 md:grid-cols-[minmax(0,1.2fr)_minmax(12rem,0.8fr)] md:items-start">
      <div>
        <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
          {beat.tag ? (
            <span className="font-mono text-[11px] font-semibold uppercase tracking-[0.14em] text-muted">
              {beat.tag}
            </span>
          ) : null}
          <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">{beat.title}</h2>
        </div>
        <p className="mt-3 max-w-[54ch] text-[17px] leading-relaxed text-muted">{beat.body}</p>

        {beat.rows?.length ? (
          <ul className="mt-6 overflow-hidden rounded-2xl border border-line">
            {beat.rows.map((row, i) => (
              <li
                key={row.label}
                className={`grid gap-1 px-4 py-3 sm:grid-cols-[6.5rem_1fr] sm:gap-3 ${
                  i > 0 ? "border-t border-line" : ""
                } bg-raised/40`}
              >
                <span
                  className={`font-mono text-[11px] font-semibold uppercase tracking-[0.1em] ${
                    row.label === "Answer" ? "text-ink" : "text-muted"
                  }`}
                >
                  {row.label}
                </span>
                <span className="text-sm leading-snug text-ink">{row.detail}</span>
              </li>
            ))}
          </ul>
        ) : null}

        {beat.takeaway ? <Takeaway text={beat.takeaway} /> : null}

        {users?.length ? (
          <div className="mt-6">
            <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.14em] text-muted">
              Common in ranked
            </p>
            <ChipRow examples={users} />
          </div>
        ) : null}
      </div>

      <ExampleLink example={beat.example} />
    </section>
  );
}
