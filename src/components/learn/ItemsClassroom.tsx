import {
  ClassroomLead,
  RulesGrid,
  Takeaway,
  ChipRow,
  ExampleLink,
} from "@/components/learn/ClassroomChrome";
import type { Lesson, LessonBeat } from "@/content/curriculum";

export function ItemsClassroom({ lesson }: { lesson: Lesson }) {
  return (
    <div className="mt-10 space-y-14">
      <ClassroomLead lesson={lesson} />

      <RulesGrid
        title="Item jobs"
        lede="Every hold item below: what it does, when ranked sets use it, how you answer it."
        rules={lesson.rules ?? []}
      />

      <div className="space-y-14">
        {lesson.beats.map((beat) => (
          <ItemVerb key={beat.title} beat={beat} />
        ))}
      </div>
    </div>
  );
}

function ItemVerb({ beat }: { beat: LessonBeat }) {
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
