"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import { CaretDown, List, X } from "@phosphor-icons/react";
import { BallIcon, ballLabel } from "@/components/learn/BallIcon";
import { STICKY_LOCAL_BAR } from "@/components/chrome/PageFrame";
import { easeOut, motionTokens } from "@/components/motion/tokens";
import {
  BANDS,
  LESSONS,
  lessonHref,
  lessonsByBand,
  nextLesson,
  type LearnTrack,
  type Lesson,
  type LessonBand,
} from "@/content/curriculum";
import {
  DOUBLES_BAND_SKIP,
  DOUBLES_LESSONS,
  doublesLessonHref,
  doublesLessonsByBand,
  nextDoublesLesson,
} from "@/content/curriculum-doubles";
import { FormatSwitch } from "@/components/chrome/FormatSwitch";

function bandLessons(band: LessonBand, doubles: boolean) {
  return doubles ? doublesLessonsByBand(band) : lessonsByBand(band);
}

function CurriculumTree({
  lesson,
  doubles,
  openBands,
  onToggleBand,
  onNavigate,
}: {
  lesson: Lesson;
  doubles: boolean;
  openBands: Set<LessonBand>;
  onToggleBand: (id: LessonBand) => void;
  onNavigate?: () => void;
}) {
  const hrefFor = doubles ? doublesLessonHref : lessonHref;
  const skipFor = (id: LessonBand) =>
    doubles ? DOUBLES_BAND_SKIP[id] : (BANDS.find((b) => b.id === id)?.skipIf ?? "");

  const trackLessons = doubles ? DOUBLES_LESSONS : LESSONS;
  const index = trackLessons.findIndex((l) => l.slug === lesson.slug);
  const position = index >= 0 ? index + 1 : 0;

  return (
    <div className="flex h-full min-h-0 flex-col">
      <div className="shrink-0 border-b border-line/70 px-4 pb-3 pt-1">
        <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-muted">
          {doubles ? "Doubles classroom" : "Singles classroom"}
        </p>
        <p className="mt-1 text-sm font-medium tracking-tight">
          {position ? `Lesson ${position} of ${trackLessons.length}` : "Curriculum"}
        </p>
      </div>

      <ul className="min-h-0 flex-1 space-y-1 overflow-y-auto px-2 py-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {BANDS.map((band) => {
          const lessons = bandLessons(band.id, doubles);
          if (!lessons.length) return null;
          const open = openBands.has(band.id);
          const currentBand = band.id === lesson.band;
          return (
            <li key={band.id}>
              <button
                type="button"
                aria-expanded={open}
                onClick={() => onToggleBand(band.id)}
                className={`flex w-full items-center gap-2.5 rounded-2xl px-2.5 py-2 text-left transition ${
                  currentBand ? "bg-white/6" : "hover:bg-white/4"
                }`}
              >
                <BallIcon band={band.id} size={28} />
                <span className="min-w-0 flex-1">
                  <span className="block text-sm font-semibold tracking-tight">{band.title}</span>
                  <span className="mt-0.5 block truncate text-[11px] text-muted">
                    {lessons.length} lesson{lessons.length === 1 ? "" : "s"}
                  </span>
                </span>
                <CaretDown
                  size={14}
                  weight="bold"
                  className={`shrink-0 text-muted transition-transform duration-200 ${open ? "rotate-0" : "-rotate-90"}`}
                />
              </button>

              <AnimatePresence initial={false}>
                {open ? (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: motionTokens.state, ease: easeOut }}
                    className="overflow-hidden"
                  >
                    <p className="px-3 pb-1 pl-[2.85rem] text-[11px] leading-snug text-muted">
                      {skipFor(band.id)}
                    </p>
                    <ul className="mb-2 space-y-0.5 pb-1 pl-2">
                      {lessons.map((row, i) => {
                        const on = row.slug === lesson.slug;
                        return (
                          <li key={row.slug}>
                            <Link
                              href={hrefFor(row.slug)}
                              onClick={onNavigate}
                              aria-current={on ? "page" : undefined}
                              className={`group flex items-start gap-2.5 rounded-xl py-2 pl-2 pr-2.5 transition ${
                                on
                                  ? "bg-ink text-bg"
                                  : "text-muted hover:bg-white/5 hover:text-ink"
                              }`}
                            >
                              <span
                                className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full font-mono text-[10px] ${
                                  on ? "bg-bg/20 text-bg" : "bg-white/8 text-muted group-hover:text-ink"
                                }`}
                              >
                                {i + 1}
                              </span>
                              <span className="min-w-0">
                                <span className="block text-sm font-medium leading-snug tracking-tight">
                                  {row.title}
                                </span>
                              </span>
                            </Link>
                          </li>
                        );
                      })}
                    </ul>
                  </motion.div>
                ) : null}
              </AnimatePresence>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export function LessonPlanNav({
  lesson,
  track = lesson.track ?? "singles",
}: {
  lesson: Lesson;
  track?: LearnTrack;
}) {
  const doubles = track === "doubles";
  const next = doubles ? nextDoublesLesson(lesson.slug) : nextLesson(lesson.slug);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [openBands, setOpenBands] = useState<Set<LessonBand>>(() => new Set([lesson.band]));

  useEffect(() => {
    setOpenBands((prev) => {
      if (prev.has(lesson.band)) return prev;
      const nextSet = new Set(prev);
      nextSet.add(lesson.band);
      return nextSet;
    });
    setSheetOpen(false);
  }, [lesson.slug, lesson.band]);

  useEffect(() => {
    if (!sheetOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSheetOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [sheetOpen]);

  const toggleBand = (id: LessonBand) => {
    setOpenBands((prev) => {
      const nextSet = new Set(prev);
      if (nextSet.has(id)) nextSet.delete(id);
      else nextSet.add(id);
      return nextSet;
    });
  };

  const treeProps = {
    lesson,
    doubles,
    openBands,
    onToggleBand: toggleBand,
  } as const;

  return (
    <>
      {/* Mobile / tablet sticky opener */}
      <nav aria-label="Lesson plan" className={`${STICKY_LOCAL_BAR} lg:hidden`}>
        <div className="pointer-events-auto flex flex-col gap-2">
          <FormatSwitch
            active={doubles ? "doubles" : "singles"}
            surface="learn"
            size="sm"
            hint={doubles ? "Doubles classroom" : "Singles classroom"}
          />
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setSheetOpen(true)}
              className="flex min-w-0 flex-1 items-center gap-2.5 rounded-2xl border border-line bg-raised/50 py-1.5 pl-1.5 pr-3 text-left transition hover:border-ink/30"
            >
              <BallIcon band={lesson.band} size={32} />
              <span className="min-w-0 flex-1">
                <span className="block truncate text-sm font-semibold tracking-tight">{lesson.title}</span>
                <span className="block truncate text-[11px] text-muted">{ballLabel(lesson.band)}</span>
              </span>
              <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-ink px-2.5 py-1 text-[11px] font-medium text-bg">
                <List size={12} weight="bold" />
                Plan
              </span>
            </button>
            {next ? (
              <Link
                href={next.href}
                className="hidden shrink-0 rounded-full px-3 py-2 text-xs text-muted hover:bg-white/6 hover:text-ink sm:inline-flex"
              >
                Next
              </Link>
            ) : null}
          </div>
        </div>
      </nav>

      {/* Desktop sticky curriculum rail */}
      <aside className="pointer-events-none sticky top-[var(--sticky-shell)] z-20 hidden max-h-[calc(100vh-var(--sticky-shell)-1.5rem)] self-start lg:pointer-events-auto lg:block">
        <div className="flex max-h-[calc(100vh-var(--sticky-shell)-1.5rem)] flex-col overflow-hidden rounded-[24px] border border-line bg-raised/35 shadow-[0_18px_40px_rgba(0,0,0,0.22)] backdrop-blur-md">
          <div className="shrink-0 border-b border-line/70 px-4 py-3">
            <FormatSwitch
              active={doubles ? "doubles" : "singles"}
              surface="learn"
              size="sm"
              hint={doubles ? "Doubles classroom" : "Singles classroom"}
            />
          </div>
          <CurriculumTree {...treeProps} />
          {next ? (
            <div className="shrink-0 border-t border-line/70 px-4 py-3">
              <Link href={next.href} className="block text-sm text-muted transition hover:text-ink">
                Up next · <span className="font-medium text-ink">{next.title}</span>
              </Link>
            </div>
          ) : null}
        </div>
      </aside>

      {/* Mobile curriculum sheet */}
      <AnimatePresence>
        {sheetOpen ? (
          <motion.div
            className="fixed inset-0 z-50 lg:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: motionTokens.feedback }}
          >
            <button
              type="button"
              aria-label="Close curriculum"
              className="absolute inset-0 bg-black/55"
              onClick={() => setSheetOpen(false)}
            />
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-label="Lesson plan"
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", stiffness: 380, damping: 36 }}
              className="absolute inset-x-0 bottom-0 flex max-h-[88vh] flex-col overflow-hidden rounded-t-[28px] border border-line bg-bg shadow-[0_-24px_64px_rgba(0,0,0,0.45)]"
            >
              <div className="flex shrink-0 items-center justify-between gap-3 border-b border-line px-4 py-3">
                <div className="flex min-w-0 items-center gap-2.5">
                  <BallIcon band={lesson.band} size={28} />
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold tracking-tight">Lesson plan</p>
                    <p className="truncate text-[11px] text-muted">{ballLabel(lesson.band)}</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setSheetOpen(false)}
                  className="rounded-full p-2 text-muted hover:bg-white/8 hover:text-ink"
                  aria-label="Close"
                >
                  <X size={18} weight="bold" />
                </button>
              </div>
              <div className="min-h-0 flex-1 overflow-hidden">
                <CurriculumTree {...treeProps} onNavigate={() => setSheetOpen(false)} />
              </div>
              {next ? (
                <div className="shrink-0 border-t border-line px-4 py-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]">
                  <Link
                    href={next.href}
                    onClick={() => setSheetOpen(false)}
                    className="flex w-full items-center justify-center rounded-full bg-ink px-4 py-2.5 text-sm font-medium text-bg"
                  >
                    Up next · {next.title}
                  </Link>
                </div>
              ) : null}
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  );
}
