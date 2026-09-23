"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { parseAsBoolean, useQueryState } from "nuqs";
import {
  defaultPackId,
  getCanonicalManual,
  isCanonicalManualId,
  resolveManual,
} from "@/content/manuals";
import {
  isDeviceOverride,
  manualSource,
  resolveManualById,
  useManualsStore,
} from "@/stores/manuals";
import { ManualView } from "@/components/manuals/ManualView";
import { ManualNotes } from "@/components/manuals/ManualNotes";
import { ManualNavStrip } from "@/components/manuals/ManualNavStrip";
import { ManualForm } from "@/components/manuals/ManualForm";
import { Button } from "@/components/ui/Button";
import { useTeamPresetsStore } from "@/stores/team-presets";

export function ManualDetail({ id }: { id: string }) {
  const router = useRouter();
  const local = useManualsStore((s) => s.local);
  const removeLocal = useManualsStore((s) => s.removeLocal);
  const pinnedManualIds = useTeamPresetsStore((s) => s.pinnedManualIds);
  const toggleManualPin = useTeamPresetsStore((s) => s.toggleManualPin);
  const [editing, setEditing] = useQueryState("edit", parseAsBoolean.withDefault(false));

  const canonical = getCanonicalManual(id);
  const manual = resolveManualById(id, local);
  const sourced = manualSource(id, local);
  const overridden = isDeviceOverride(id, local);
  const pinnedToLive = pinnedManualIds.includes(id);

  if (!manual || !sourced) {
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

  const noteExclude = [
    ...new Set(
      [...(manual.box ?? []), ...resolveManual(manual, defaultPackId(manual)).slugs].filter(
        (s): s is string => Boolean(s),
      ),
    ),
  ];

  function exitEdit() {
    void setEditing(false);
  }

  function resetClassroom() {
    if (!overridden) return;
    if (
      !window.confirm(
        "Discard device tweaks and restore the classroom manual? Field notes stay on this device.",
      )
    ) {
      return;
    }
    removeLocal(id);
    void setEditing(false);
  }

  return (
    <div>
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-1 pb-2 pt-1">
        <div className="min-w-0 text-sm text-muted">
          {overridden ? (
            <span>
              <span className="font-medium text-ink">Edited on this device</span>
              <span aria-hidden> · </span>
              Classroom copy still in the repo
            </span>
          ) : sourced === "local" ? (
            <span className="font-medium text-ink">Yours · saved on this device</span>
          ) : (
            <span>Classroom manual · editable as a device override</span>
          )}
        </div>
        <div className="flex flex-wrap gap-2">
          <Button
            type="button"
            variant={pinnedToLive ? "primary" : "line"}
            onClick={() => toggleManualPin(id)}
            title={
              pinnedToLive
                ? "Hide this six from Live Match presets"
                : "Show this registered six in Live Match presets"
            }
          >
            {pinnedToLive ? "On Live Match" : "Add to Live Match"}
          </Button>
          {editing ? (
            <Button type="button" variant="line" onClick={exitEdit}>
              Reader
            </Button>
          ) : (
            <Button type="button" variant="line" onClick={() => void setEditing(true)}>
              Edit mode
            </Button>
          )}
          {overridden ? (
            <Button type="button" variant="ghost" onClick={resetClassroom}>
              Reset to classroom
            </Button>
          ) : null}
          {sourced === "local" && !isCanonicalManualId(id) ? (
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
          ) : null}
        </div>
      </div>

      {editing ? (
        <div className="mx-auto max-w-6xl">
          <ManualForm
            key={`${id}-edit`}
            mode="edit"
            variant="embedded"
            initial={manual}
            onCancel={exitEdit}
            onSaved={() => {
              exitEdit();
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
          />
        </div>
      ) : (
        <ManualView
          manual={manual}
          sourced={sourced === "override" ? "local" : sourced}
          overridden={overridden}
        />
      )}

      {!editing ? <ManualNotes id={id} exclude={noteExclude} /> : null}
      {canonical && !editing ? <ManualNavStrip manualId={id} /> : null}
    </div>
  );
}
