"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { CaretDown } from "@phosphor-icons/react";
import { getPokemon } from "@/lib/catalog/load";
import { cssVars } from "@/lib/champions/palette";
import { notePreview, type FieldNote } from "@/lib/manuals/field-notes";
import { PokemonArt } from "@/components/pokemon/PokemonArt";
import { TypeBadge } from "@/components/pokemon/TypeBadge";
import { SlotMatchups } from "@/components/manuals/SlotMatchups";
import { easeOut, motionTokens } from "@/components/motion/tokens";

const LANE = {
  watch: {
    panel: "bg-[color-mix(in_srgb,#e23d7a_16%,transparent)]",
    label: "text-[#ff8aad]",
  },
  play: {
    panel: "bg-[color-mix(in_srgb,#6b8cff_14%,transparent)]",
    label: "text-[#9cbcff]",
  },
  rule: {
    panel: "border-t border-[#d4a017]/30 bg-[color-mix(in_srgb,#d4a017_18%,transparent)]",
    label: "text-[#f0c040]",
  },
} as const;

function NoteLane({
  id,
  label,
  tone,
  value,
  onChange,
  onSave,
  placeholder,
  rows = 5,
}: {
  id: string;
  label: string;
  tone: keyof typeof LANE;
  value: string;
  onChange: (value: string) => void;
  onSave: () => void;
  placeholder: string;
  rows?: number;
}) {
  const look = LANE[tone];
  return (
    <div className={`flex min-h-0 flex-col px-4 py-3 ${look.panel}`}>
      <label htmlFor={id} className={`font-mono text-[10px] font-semibold uppercase tracking-[0.16em] ${look.label}`}>
        {label}
      </label>
      <textarea
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onBlur={onSave}
        rows={rows}
        placeholder={placeholder}
        className="mt-2 w-full flex-1 resize-y bg-transparent text-[15px] leading-relaxed text-ink outline-none placeholder:text-muted/80"
      />
    </div>
  );
}

function KindChip({ kind }: { kind: FieldNote["kind"] }) {
  return (
    <span className="shrink-0 rounded-full bg-white/8 px-2 py-0.5 font-mono text-[10px] uppercase tracking-[0.12em] text-muted">
      {kind === "matchup" ? "Matchup" : "Scratch"}
    </span>
  );
}

export function FieldNoteCard({
  note,
  open,
  onToggle,
  onPatch,
  onRemove,
}: {
  note: FieldNote;
  open: boolean;
  onToggle: () => void;
  onPatch: (patch: object) => void;
  onRemove: () => void;
}) {
  const foe = note.kind === "matchup" ? getPokemon(note.slug) : undefined;
  const [watch, setWatch] = useState(note.kind === "matchup" ? note.watch : "");
  const [play, setPlay] = useState(note.kind === "matchup" ? note.play : "");
  const [rule, setRule] = useState(note.kind === "matchup" ? note.rule : "");
  const [title, setTitle] = useState(note.kind === "scratch" ? note.title : "");
  const [body, setBody] = useState(note.kind === "scratch" ? note.body : "");

  useEffect(() => {
    if (note.kind === "matchup") {
      setWatch(note.watch);
      setPlay(note.play);
      setRule(note.rule);
      return;
    }
    setTitle(note.title);
    setBody(note.body);
  }, [note]);

  const heading = note.kind === "matchup" ? (foe?.name ?? note.slug) : title.trim() || "Scratch";
  const preview = notePreview(note);

  return (
    <li
      className="overflow-hidden rounded-[24px] border border-line bg-raised/40"
      style={foe ? cssVars(foe.palette) : undefined}
    >
      <button
        type="button"
        aria-expanded={open}
        onClick={onToggle}
        className="flex w-full items-start gap-3 p-3 text-left transition hover:bg-white/4"
        style={
          foe
            ? {
                background: `linear-gradient(165deg, color-mix(in srgb, var(--mon-wash) 22%, transparent), transparent 70%)`,
              }
            : undefined
        }
      >
        <CaretDown
          size={14}
          weight="bold"
          className={`mt-1.5 shrink-0 text-muted transition-transform ${open ? "rotate-0" : "-rotate-90"}`}
        />
        {foe ? <PokemonArt slug={foe.slug} src={foe.artwork} name={foe.name} size={56} share /> : null}
        <span className="min-w-0 flex-1">
          <span className="flex items-start justify-between gap-2">
            <span className="truncate text-lg font-semibold tracking-tight">{heading}</span>
            <KindChip kind={note.kind} />
          </span>
          {foe ? (
            <span className="mt-1 flex flex-wrap gap-1">
              {foe.types.map((t) => (
                <TypeBadge key={t} type={t} size="sm" />
              ))}
            </span>
          ) : null}
          {!open && note.kind === "matchup" && (watch || play || rule) ? (
            <span className="mt-2 grid gap-1 text-sm">
              {watch ? (
                <span className="line-clamp-1">
                  <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-[#ff8aad]">Watch </span>
                  <span className="text-muted">{watch}</span>
                </span>
              ) : null}
              {play ? (
                <span className="line-clamp-1">
                  <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-[#9cbcff]">Do </span>
                  <span className="text-muted">{play}</span>
                </span>
              ) : null}
              {rule ? (
                <span className="line-clamp-1">
                  <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-[#f0c040]">Never </span>
                  <span className="text-muted">{rule}</span>
                </span>
              ) : null}
            </span>
          ) : null}
          {!open && note.kind === "scratch" && preview ? (
            <span className="mt-1.5 block line-clamp-2 text-sm text-muted">{preview}</span>
          ) : null}
        </span>
      </button>

      <AnimatePresence initial={false}>
        {open ? (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: motionTokens.layout, ease: easeOut }}
            className="overflow-hidden border-t border-line/70"
          >
            {note.kind === "matchup" ? (
              <>
                {foe ? (
                  <div className="border-b border-line/60 px-4 py-3">
                    <SlotMatchups types={foe.types} />
                  </div>
                ) : null}
                <div className="grid md:grid-cols-2">
                  <NoteLane
                    id={`${note.id}-watch`}
                    label="Watch"
                    tone="watch"
                    value={watch}
                    onChange={setWatch}
                    onSave={() => onPatch({ watch })}
                    placeholder="Ice Fang on the switch. Garchomp is 4× Ice — that duel is the trap."
                  />
                  <NoteLane
                    id={`${note.id}-play`}
                    label="Do"
                    tone="play"
                    value={play}
                    onChange={setPlay}
                    onSave={() => onPatch({ play })}
                    placeholder="Corviknight takes Ice Fang. Rocky Helmet. U-turn into Primarina. Moonblast."
                  />
                  <div className="md:col-span-2">
                    <NoteLane
                      id={`${note.id}-rule`}
                      label="Never"
                      tone="rule"
                      value={rule}
                      onChange={setRule}
                      onSave={() => onPatch({ rule })}
                      placeholder="Do not send Garchomp into Gyarados."
                      rows={2}
                    />
                  </div>
                </div>
              </>
            ) : (
              <div className="px-4 py-3">
                <label htmlFor={`${note.id}-title`} className="font-mono text-[10px] uppercase tracking-[0.14em] text-muted">
                  Title
                </label>
                <input
                  id={`${note.id}-title`}
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  onBlur={() => onPatch({ title })}
                  placeholder="Lead you hate, kit swap…"
                  className="mt-2 w-full rounded-2xl border border-line bg-sunken px-3 py-2.5 text-ink outline-none placeholder:text-muted focus:border-ink/40"
                />
                <label
                  htmlFor={`${note.id}-body`}
                  className="mt-4 block font-mono text-[10px] uppercase tracking-[0.14em] text-muted"
                >
                  Note
                </label>
                <textarea
                  id={`${note.id}-body`}
                  value={body}
                  onChange={(e) => setBody(e.target.value)}
                  onBlur={() => onPatch({ body })}
                  rows={5}
                  placeholder="Reads that worked, a lead you hate, a kit swap…"
                  className="mt-2 w-full resize-y rounded-2xl border border-line bg-sunken px-3 py-2.5 text-[15px] leading-relaxed text-ink outline-none placeholder:text-muted focus:border-ink/40"
                />
              </div>
            )}
            <div className="flex justify-end px-4 py-3">
              <button type="button" onClick={onRemove} className="text-sm text-muted hover:text-ink">
                Remove
              </button>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </li>
  );
}
