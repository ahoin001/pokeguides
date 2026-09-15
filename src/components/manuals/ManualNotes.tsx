"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, MotionConfig, motion } from "motion/react";
import { getPokemon } from "@/lib/catalog/load";
import { emptyMatchup, emptyScratch, noteMatches, type FieldNote } from "@/lib/manuals/field-notes";
import { useManualsStore } from "@/stores/manuals";
import { Button } from "@/components/ui/Button";
import { FieldNoteCard } from "@/components/manuals/FieldNoteCard";
import { NoteFoeSearch } from "@/components/manuals/NoteFoeSearch";
import { MANUAL_SCROLL_MT } from "@/components/manuals/ManualToc";
import { easeOut, motionTokens } from "@/components/motion/tokens";

const EMPTY_NOTES: FieldNote[] = [];
const EMPTY_SLUGS: string[] = [];

type KindFilter = "all" | "matchup" | "scratch";

export function ManualNotes({ id, exclude }: { id: string; exclude?: string[] }) {
  const notes = useManualsStore((s) => s.entries?.[id] ?? EMPTY_NOTES);
  const addNote = useManualsStore((s) => s.addNote);
  const updateNote = useManualsStore((s) => s.updateNote);
  const removeNote = useManualsStore((s) => s.removeNote);
  const skip = exclude ?? EMPTY_SLUGS;

  const [openId, setOpenId] = useState<string | null>(null);
  const [picking, setPicking] = useState(false);
  const [query, setQuery] = useState("");
  const [kind, setKind] = useState<KindFilter>("all");

  const taken = useMemo(
    () => notes.filter((n): n is FieldNote & { kind: "matchup" } => n.kind === "matchup").map((n) => n.slug),
    [notes],
  );
  const mixed = notes.some((n) => n.kind === "matchup") && notes.some((n) => n.kind === "scratch");
  const visible = useMemo(() => {
    return notes.filter((note) => {
      if (kind !== "all" && note.kind !== kind) return false;
      const foe = note.kind === "matchup" ? getPokemon(note.slug) : undefined;
      return noteMatches(note, query, foe?.name);
    });
  }, [notes, kind, query]);

  function pickFoe(slug: string) {
    const existing = notes.find((n) => n.kind === "matchup" && n.slug === slug);
    if (existing) {
      setOpenId(existing.id);
      setPicking(false);
      return;
    }
    const note = emptyMatchup(slug);
    addNote(id, note);
    setOpenId(note.id);
    setPicking(false);
  }

  function addScratch() {
    const note = emptyScratch();
    addNote(id, note);
    setOpenId(note.id);
    setPicking(false);
  }

  const sticky = notes.length > 3;

  return (
    <MotionConfig reducedMotion="user">
      <section id="notes" className={`mx-auto mt-10 w-full max-w-3xl ${MANUAL_SCROLL_MT}`}>
        <div
          className={
            sticky
              ? "sticky top-[4.25rem] z-20 -mx-1 mb-3 bg-bg/90 px-1 py-2 backdrop-blur-md md:top-[8.25rem]"
              : "mb-3"
          }
        >
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <h2 className="text-2xl font-semibold tracking-tight">Your notes</h2>
              {notes.length ? (
                <p className="mt-0.5 text-sm text-muted">
                  {notes.length} {notes.length === 1 ? "card" : "cards"}
                </p>
              ) : null}
            </div>
            <div className="flex flex-wrap gap-2">
              <Button type="button" variant={picking ? "primary" : "line"} onClick={() => setPicking((v) => !v)}>
                {picking ? "Close" : "Matchup"}
              </Button>
              <Button type="button" variant="line" onClick={addScratch}>
                Scratch
              </Button>
            </div>
          </div>
          {notes.length > 1 ? (
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Find a foe, a trap, a play"
              className="mt-3 w-full rounded-2xl border border-line bg-sunken px-4 py-2.5 text-sm text-ink outline-none placeholder:text-muted focus:border-ink/40"
            />
          ) : null}
          {mixed ? (
            <div className="mt-3 flex gap-1.5">
              {(
                [
                  ["all", "All"],
                  ["matchup", "Matchups"],
                  ["scratch", "Scratch"],
                ] as const
              ).map(([idKey, label]) => (
                <button
                  key={idKey}
                  type="button"
                  onClick={() => setKind(idKey)}
                  className={`rounded-full px-3 py-1 text-sm ${
                    kind === idKey ? "bg-ink text-bg" : "bg-white/6 text-muted hover:bg-white/10 hover:text-ink"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          ) : null}
        </div>

        <AnimatePresence initial={false}>
          {picking ? (
            <motion.div
              key="picker"
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: motionTokens.state, ease: easeOut }}
              className="mb-4"
            >
              <NoteFoeSearch
                exclude={skip}
                taken={taken}
                onPick={pickFoe}
                onCancel={() => setPicking(false)}
              />
            </motion.div>
          ) : null}
        </AnimatePresence>

        {!notes.length && !picking ? (
          <p className="max-w-[52ch] text-sm text-muted">
            Pin who they bring. Watch for the trap, then the play. Scratch is for kit swaps and leads you hate.
          </p>
        ) : null}

        {notes.length && !visible.length ? (
          <p className="text-sm text-muted">No notes match.</p>
        ) : null}

        {visible.length ? (
          <ul className="space-y-3">
            {visible.map((note) => (
              <FieldNoteCard
                key={note.id}
                note={note}
                open={openId === note.id}
                onToggle={() => setOpenId((cur) => (cur === note.id ? null : note.id))}
                onPatch={(patch) => updateNote(id, note.id, patch)}
                onRemove={() => {
                  removeNote(id, note.id);
                  if (openId === note.id) setOpenId(null);
                }}
              />
            ))}
          </ul>
        ) : null}
      </section>
    </MotionConfig>
  );
}
