"use client";

import Link from "next/link";
import { CANONICAL_MANUALS } from "@/content/manuals";
import { useManualsStore } from "@/stores/manuals";
import { ManualCard } from "@/components/manuals/ManualCard";

export default function ManualsIndex() {
  const local = useManualsStore((s) => s.local);

  return (
    <div className="mx-auto w-full max-w-6xl">
      <header className="max-w-3xl">
        <h1 className="text-4xl font-semibold tracking-tight lg:text-5xl">Field manuals</h1>
        <p className="mt-4 text-lg text-muted">
          Authored 3v3 singles guides. One Pokémon out. If/then on preview, the first send, the hand-off, and the late
          game. Load a three onto Team when you want to try it.
        </p>
        <div className="mt-6">
          <Link
            href="/manuals/new"
            className="inline-flex min-h-11 items-center justify-center rounded-full bg-ink px-4 py-2 text-sm font-medium text-bg transition hover:bg-white"
          >
            Write your own
          </Link>
        </div>
      </header>

      <section className="mt-12">
        <h2 className="text-2xl font-semibold tracking-tight">Classroom</h2>
        <ul className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {CANONICAL_MANUALS.map((manual) => (
            <li key={manual.id} className="min-w-0">
              <ManualCard manual={manual} sourced="canonical" />
            </li>
          ))}
        </ul>
      </section>

      {local.length ? (
        <section className="mt-16">
          <h2 className="text-2xl font-semibold tracking-tight">Yours</h2>
          <ul className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {local.map((manual) => (
              <li key={manual.id} className="min-w-0">
                <ManualCard manual={manual} sourced="local" />
              </li>
            ))}
          </ul>
        </section>
      ) : (
        <p className="mt-12 max-w-3xl text-sm text-muted">
          Your own manuals live on this device. They are not the classroom files — those get added in the repo when you
          ask.
        </p>
      )}
    </div>
  );
}
