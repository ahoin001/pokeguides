"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { getPokemon } from "@/lib/catalog/load";
import { FORMAT_LABEL, type BattleFormat } from "@/lib/format";
import type { AuthorPrompts } from "@/lib/manuals/author-prompts";
import { importPastedManual } from "@/lib/manuals/import-paste";
import { useManualsStore } from "@/stores/manuals";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";

export function ManualAiImport({
  format,
  prompts,
}: {
  format: BattleFormat;
  prompts: AuthorPrompts;
}) {
  const router = useRouter();
  const local = useManualsStore((s) => s.local);
  const saveLocal = useManualsStore((s) => s.saveLocal);
  const [open, setOpen] = useState(false);
  const [raw, setRaw] = useState("");
  const [copied, setCopied] = useState(false);
  const [copyError, setCopyError] = useState(false);

  const prompt = prompts[format];
  const preview = useMemo(() => {
    if (!raw.trim()) return null;
    return importPastedManual(raw, { format });
  }, [raw, format]);

  const names =
    preview?.ok && preview.manual.box?.length
      ? preview.manual.box.map((slug) => getPokemon(slug)?.name ?? slug)
      : [];

  async function copyPrompt() {
    setCopyError(false);
    try {
      await navigator.clipboard.writeText(prompt);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
      return;
    } catch {
      try {
        const area = document.createElement("textarea");
        area.value = prompt;
        area.setAttribute("readonly", "");
        area.style.position = "fixed";
        area.style.left = "-9999px";
        document.body.appendChild(area);
        area.select();
        const ok = document.execCommand("copy");
        area.remove();
        if (ok) {
          setCopied(true);
          window.setTimeout(() => setCopied(false), 1800);
          return;
        }
      } catch {
        /* selection fallback below */
      }
      setCopyError(true);
    }
  }

  function close() {
    setOpen(false);
  }

  function save() {
    if (!preview?.ok) return;
    const existing = local.find((manual) => manual.id === preview.manual.id);
    if (
      existing &&
      !window.confirm(`Replace “${existing.title || "Untitled"}” on this device?`)
    ) {
      return;
    }
    saveLocal(preview.manual);
    setRaw("");
    setOpen(false);
    router.push(`/manuals/${preview.manual.id}`);
  }

  return (
    <>
      <Button type="button" onClick={() => setOpen(true)}>
        From AI
      </Button>
      <Modal
        open={open}
        onClose={close}
        label="Add a field manual from AI"
        panelClassName="max-h-[min(90vh,880px)] max-w-3xl overflow-y-auto"
      >
        <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.14em] text-muted">
          {FORMAT_LABEL[format]} template
        </p>
        <h2 className="mt-2 text-2xl font-semibold tracking-tight">Add a manual from AI</h2>
        <p className="mt-2 text-sm text-muted">
          Copy the {FORMAT_LABEL[format].toLowerCase()} authoring prompt, fill it in with your model, then paste the
          JSON it returns. The manual is saved on this device.
        </p>

        <div className="mt-5 flex flex-wrap items-center gap-3">
          <Button type="button" variant="line" onClick={() => void copyPrompt()} disabled={!prompt}>
            {copied ? "Copied" : `Copy ${FORMAT_LABEL[format]} prompt`}
          </Button>
          <span className="text-xs text-muted">Paste your six after the prompt in the chat.</span>
        </div>
        {copyError ? (
          <p className="mt-2 text-sm text-muted">Clipboard was blocked. Open the prompt and copy it from there.</p>
        ) : null}
        <details className="mt-3">
          <summary className="cursor-pointer text-sm text-muted">Show the prompt</summary>
          <pre className="mt-2 max-h-40 overflow-auto whitespace-pre-wrap rounded-2xl border border-line bg-sunken p-3 font-mono text-xs leading-relaxed text-muted">
            {prompt}
          </pre>
        </details>

        <label className="mt-5 block">
          <span className="text-sm font-medium">Filled template</span>
          <textarea
            value={raw}
            onChange={(e) => setRaw(e.target.value)}
            spellCheck={false}
            placeholder='Paste the JSON here. A ```json fence is fine.'
            className="mt-2 h-56 w-full resize-y rounded-2xl border border-line bg-sunken px-4 py-3 font-mono text-xs leading-relaxed"
          />
        </label>

        {preview && !preview.ok ? <p className="mt-3 text-sm text-[#e07070]">{preview.error}</p> : null}
        {preview?.ok ? (
          <div className="mt-4 rounded-2xl border border-line bg-bg/40 px-4 py-3 text-sm">
            <p className="font-medium">{preview.manual.title}</p>
            {names.length ? <p className="mt-1 text-muted">{names.join(" · ")}</p> : null}
            {preview.notes.length ? (
              <ul className="mt-2 list-disc space-y-1 pl-4 text-muted">
                {preview.notes.map((note) => (
                  <li key={note}>{note}</li>
                ))}
              </ul>
            ) : null}
          </div>
        ) : null}

        <div className="mt-5 flex flex-wrap justify-end gap-2">
          <Button type="button" variant="ghost" onClick={close}>
            Cancel
          </Button>
          <Button type="button" onClick={save} disabled={!preview?.ok}>
            Save manual
          </Button>
        </div>
      </Modal>
    </>
  );
}
