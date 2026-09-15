"use client";

import { useEffect, useState } from "react";
import { useManualsStore } from "@/stores/manuals";

export function ManualNotes({ id }: { id: string }) {
  const stored = useManualsStore((s) => s.notes[id] ?? "");
  const setNote = useManualsStore((s) => s.setNote);
  const [value, setValue] = useState(stored);

  useEffect(() => {
    setValue(stored);
  }, [stored, id]);

  return (
    <section className="mx-auto mt-16 w-full max-w-6xl">
      <h2 className="text-2xl font-semibold tracking-tight">Your notes</h2>
      <p className="mt-2 text-sm text-muted">Stays on this device. Canonical manuals keep notes even if the guide updates.</p>
      <textarea
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onBlur={() => setNote(id, value)}
        rows={6}
        placeholder="Reads that worked, a lead you hate, a kit swap…"
        className="mt-4 w-full rounded-3xl border border-line bg-sunken px-4 py-3 text-ink outline-none placeholder:text-muted focus:border-ink/40"
      />
    </section>
  );
}
