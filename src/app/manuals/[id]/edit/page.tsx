"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { getCanonicalManual } from "@/content/manuals";
import { ManualForm } from "@/components/manuals/ManualForm";
import { resolveManualById, useManualsStore } from "@/stores/manuals";

export default function EditManualPage() {
  const { id } = useParams<{ id: string }>();
  const local = useManualsStore((s) => s.local);
  const manual = id ? resolveManualById(id, local) : undefined;
  const canonical = id ? getCanonicalManual(id) : undefined;

  if (!manual) {
    return (
      <div className="mx-auto max-w-3xl">
        <h1 className="text-4xl font-semibold tracking-tight">No such three</h1>
        <Link href="/manuals" className="mt-4 inline-block text-sm underline">
          Back to manuals
        </Link>
      </div>
    );
  }

  return (
    <div>
      {canonical ? (
        <p className="mx-auto mb-4 max-w-3xl text-sm text-muted">
          Saving keeps a device override of the classroom manual.{" "}
          <Link href={`/manuals/${id}`} className="underline-offset-2 hover:underline">
            Open reader
          </Link>{" "}
          to toggle edit mode or reset.
        </p>
      ) : null}
      <ManualForm mode="edit" initial={manual} />
    </div>
  );
}
