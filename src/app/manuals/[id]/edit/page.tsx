"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { getCanonicalManual } from "@/content/manuals";
import { ManualForm } from "@/components/manuals/ManualForm";
import { useManualsStore } from "@/stores/manuals";

export default function EditManualPage() {
  const { id } = useParams<{ id: string }>();
  const local = useManualsStore((s) => s.local.find((m) => m.id === id));
  const canonical = id ? getCanonicalManual(id) : undefined;

  if (canonical) {
    return (
      <div className="mx-auto max-w-3xl">
        <p className="text-sm text-muted">
          <Link href="/manuals" className="hover:text-ink">
            Field manuals
          </Link>
        </p>
        <h1 className="mt-2 text-4xl font-semibold tracking-tight">Classroom manuals stay in the repo</h1>
        <p className="mt-4 text-muted">
          Add notes on the guide instead, or duplicate the idea as your own manual. Ask in chat if this classroom three
          should change.
        </p>
      </div>
    );
  }

  if (!local) {
    return (
      <div className="mx-auto max-w-3xl">
        <h1 className="text-4xl font-semibold tracking-tight">No such three</h1>
        <Link href="/manuals" className="mt-4 inline-block text-sm underline">
          Back to manuals
        </Link>
      </div>
    );
  }

  return <ManualForm mode="edit" initial={local} />;
}
