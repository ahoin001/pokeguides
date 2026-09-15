export type MatchupNote = {
  id: string;
  kind: "matchup";
  slug: string;
  watch: string;
  play: string;
  rule: string;
  updatedAt: number;
};

export type ScratchNote = {
  id: string;
  kind: "scratch";
  title: string;
  body: string;
  updatedAt: number;
};

export type FieldNote = MatchupNote | ScratchNote;

export const TEAM_NOTES_ID = "team";

export function newNoteId() {
  return `note-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

export function emptyMatchup(slug: string): MatchupNote {
  return {
    id: newNoteId(),
    kind: "matchup",
    slug,
    watch: "",
    play: "",
    rule: "",
    updatedAt: Date.now(),
  };
}

export function emptyScratch(): ScratchNote {
  return {
    id: newNoteId(),
    kind: "scratch",
    title: "",
    body: "",
    updatedAt: Date.now(),
  };
}

export function scratchFromLegacy(body: string): ScratchNote {
  return {
    id: newNoteId(),
    kind: "scratch",
    title: "Scratch",
    body,
    updatedAt: Date.now(),
  };
}

export function sortNotes(notes: FieldNote[]): FieldNote[] {
  return [...notes].sort((a, b) => b.updatedAt - a.updatedAt);
}

export function notePreview(note: FieldNote): string {
  if (note.kind === "matchup") {
    return note.watch.trim() || note.play.trim() || note.rule.trim();
  }
  return note.body.trim();
}

export function noteMatches(note: FieldNote, query: string, foeName = ""): boolean {
  const q = query.trim().toLowerCase();
  if (!q) return true;
  if (note.kind === "matchup") {
    return [foeName, note.slug, note.watch, note.play, note.rule].join(" ").toLowerCase().includes(q);
  }
  return [note.title, note.body].join(" ").toLowerCase().includes(q);
}

export function legacyNotesToEntries(notes: unknown): Record<string, FieldNote[]> {
  if (!notes || typeof notes !== "object") return {};
  const out: Record<string, FieldNote[]> = {};
  for (const [id, value] of Object.entries(notes as Record<string, unknown>)) {
    if (typeof value === "string" && value.trim()) {
      out[id] = [scratchFromLegacy(value)];
    }
  }
  return out;
}

export function normalizeNote(value: unknown): FieldNote | null {
  if (!value || typeof value !== "object") return null;
  const n = value as Record<string, unknown>;
  if (typeof n.id !== "string" || typeof n.updatedAt !== "number") return null;
  if (n.kind === "matchup" && typeof n.slug === "string") {
    return {
      id: n.id,
      kind: "matchup",
      slug: n.slug,
      watch: typeof n.watch === "string" ? n.watch : "",
      play: typeof n.play === "string" ? n.play : "",
      rule: typeof n.rule === "string" ? n.rule : "",
      updatedAt: n.updatedAt,
    };
  }
  if (n.kind === "scratch" && typeof n.title === "string" && typeof n.body === "string") {
    return {
      id: n.id,
      kind: "scratch",
      title: n.title,
      body: n.body,
      updatedAt: n.updatedAt,
    };
  }
  return null;
}

export function withNotePatch(note: FieldNote, patch: object): FieldNote {
  if (note.kind === "matchup") {
    const next = patch as Partial<MatchupNote>;
    const slug = next.slug ?? note.slug;
    const watch = next.watch ?? note.watch;
    const play = next.play ?? note.play;
    const rule = next.rule ?? note.rule;
    if (slug === note.slug && watch === note.watch && play === note.play && rule === note.rule) return note;
    return { ...note, slug, watch, play, rule, updatedAt: Date.now() };
  }
  const next = patch as Partial<ScratchNote>;
  const title = next.title ?? note.title;
  const body = next.body ?? note.body;
  if (title === note.title && body === note.body) return note;
  return { ...note, title, body, updatedAt: Date.now() };
}

export function sanitizeEntries(value: unknown): Record<string, FieldNote[]> {
  if (!value || typeof value !== "object") return {};
  const out: Record<string, FieldNote[]> = {};
  for (const [id, list] of Object.entries(value as Record<string, unknown>)) {
    if (!Array.isArray(list)) continue;
    const notes = list.map(normalizeNote).filter((n): n is FieldNote => Boolean(n));
    if (notes.length) out[id] = sortNotes(notes);
  }
  return out;
}
