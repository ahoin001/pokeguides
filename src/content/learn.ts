import { LESSONS, getLesson, lessonHref, type Lesson } from "@/content/curriculum";

/** Compatibility re-export. Prefer Lesson from curriculum.ts. */
export type LearnChapter = {
  slug: string;
  group: "build" | "play";
  title: string;
  lede: string;
  body: readonly string[];
};

export const LEARN = LESSONS.map((l) => ({
  slug: l.slug,
  group: l.band === "poke-ball" || l.band === "ultra-ball" ? ("build" as const) : ("play" as const),
  title: l.title,
  lede: l.thesis,
  body: l.body,
}));

export const LEARN_HUBS = new Set(["roles"]);

export function getChapter(slug: string) {
  return LEARN.find((c) => c.slug === slug);
}

export function chapterHref(chapter: Pick<LearnChapter, "slug"> | Lesson) {
  return lessonHref(chapter.slug);
}

export function learnByGroup(group: "build" | "play") {
  return LEARN.filter((c) => c.group === group);
}
