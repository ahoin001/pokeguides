"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { getCanonicalManual, isCanonicalManualId } from "@/content/manuals";
import { useManualsStore } from "@/stores/manuals";
import { ManualView } from "@/components/manuals/ManualView";
import { ManualNotes } from "@/components/manuals/ManualNotes";
import { Button } from "@/components/ui/Button";

export function ManualDetail({ id }: { id: string }) {
  const router = useRouter();
  const local = useManualsStore((s) => s.local);
  const removeLocal = useManualsStore((s) => s.removeLocal);
  const canonical = getCanonicalManual(id);
  const mine = local.find((m) => m.id === id);
  const manual = canonical ?? mine;
  const sourced = canonical ? "canonical" : "local";

  if (!manual) {
    return (
      <div className="mx-auto max-w-6xl">
        <p className="text-sm text-muted">
          <Link href="/manuals" className="hover:text-ink">
            Field manuals
          </Link>
        </p>
        <h1 className="mt-2 text-4xl font-semibold tracking-tight">No such three</h1>
        <p className="mt-4 text-muted">It is not in the classroom list, and it is not saved on this device.</p>
      </div>
    );
  }

  return (
    <div>
      <ManualView manual={manual} sourced={sourced} />
      {!isCanonicalManualId(id) ? (
        <div className="mx-auto mt-10 flex max-w-6xl flex-wrap gap-3">
          <Link
            href={`/manuals/${id}/edit`}
            className="inline-flex items-center justify-center rounded-full border border-line px-4 py-2 text-sm font-medium transition hover:border-ink/40"
          >
            Edit
          </Link>
          <Button
            type="button"
            variant="ghost"
            onClick={() => {
              if (!window.confirm("Delete this manual from this device?")) return;
              removeLocal(id);
              router.push("/manuals");
            }}
          >
            Delete
          </Button>
        </div>
      ) : null}
      <ManualNotes id={id} exclude={manual.slugs.filter((s): s is string => Boolean(s))} />
    </div>
  );
}
