"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { getPokemon } from "@/lib/catalog/load";
import { cssVars } from "@/lib/champions/palette";
import { PokemonArt } from "@/components/pokemon/PokemonArt";
import { SlotMatchups } from "@/components/manuals/SlotMatchups";
import { PokemonPicker } from "@/components/pokemon/PokemonPicker";
import { Button } from "@/components/ui/Button";
import { ARCHETYPE_IDS } from "@/types/pokemon";
import type { ArchetypeId, LiteracyRoleId, RoleId } from "@/types/pokemon";
import { ARCHETYPE_LABEL } from "@/content/archetypes";
import { LEARN_ROLE_IDS, ROLE_LABEL } from "@/content/roles";
import { LITERACY_ROLES } from "@/content/literacy-roles";
import {
  emptySlot,
  type ManualBranch,
  type ManualPlanBeat,
  type SlotManual,
  type TeamManual,
} from "@/content/manuals";
import { syncSlugsFromSlots, validateManual } from "@/lib/champions/manuals";
import { useManualsStore } from "@/stores/manuals";

const inputClass =
  "w-full rounded-2xl border border-line bg-sunken px-4 py-3 text-ink outline-none placeholder:text-muted focus:border-ink/40";
const areaClass = `${inputClass} min-h-24`;

export function ManualForm({
  initial,
  mode,
}: {
  initial: TeamManual;
  mode: "create" | "edit";
}) {
  const router = useRouter();
  const saveLocal = useManualsStore((s) => s.saveLocal);
  const [draft, setDraft] = useState<TeamManual>(initial);
  const [pick, setPick] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  function commit(next: TeamManual) {
    setDraft(syncSlugsFromSlots(next));
  }

  function updateSlot(index: number, patch: Partial<SlotManual>) {
    const slots = draft.slots.map((s, i) => (i === index ? { ...s, ...patch } : s));
    commit({ ...draft, slots });
  }

  function save() {
    const next = syncSlugsFromSlots(draft);
    const errors = validateManual(next);
    if (errors.length) {
      setError(errors.join(" "));
      return;
    }
    saveLocal(next);
    router.push(`/manuals/${next.id}`);
  }

  const exclude = draft.slots.map((s) => s.slug).filter(Boolean);

  return (
    <div className="mx-auto max-w-3xl">
      <h1 className="text-4xl font-semibold tracking-tight">{mode === "create" ? "Write a manual" : "Edit manual"}</h1>
      <p className="mt-3 text-sm text-muted">
        Singles 3v3. One Pokémon out. If/then trees, not a VGC double lead. This copy stays on this device.
      </p>

      <label className="mt-10 block text-sm font-medium">Title</label>
      <input className={`mt-2 ${inputClass}`} value={draft.title} onChange={(e) => commit({ ...draft, title: e.target.value })} />

      <label className="mt-6 block text-sm font-medium">Lede</label>
      <textarea className={`mt-2 ${areaClass}`} value={draft.lede} onChange={(e) => commit({ ...draft, lede: e.target.value })} />

      <label className="mt-6 block text-sm font-medium">Style</label>
      <select
        className={`mt-2 ${inputClass}`}
        value={draft.archetype}
        onChange={(e) => commit({ ...draft, archetype: e.target.value as ArchetypeId })}
      >
        {ARCHETYPE_IDS.map((id) => (
          <option key={id} value={id}>
            {ARCHETYPE_LABEL[id]}
          </option>
        ))}
      </select>

      <label className="mt-6 block text-sm font-medium">Philosophy</label>
      <textarea
        className={`mt-2 ${areaClass}`}
        value={draft.philosophy}
        onChange={(e) => commit({ ...draft, philosophy: e.target.value })}
      />

      <label className="mt-6 block text-sm font-medium">What this three is for (one sentence)</label>
      <textarea className={`mt-2 ${areaClass}`} value={draft.meta} onChange={(e) => commit({ ...draft, meta: e.target.value })} />

      <StringList
        label="Press"
        hint="Matchups you attack. One chip per line."
        items={draft.press ?? [""]}
        onChange={(press) => commit({ ...draft, press })}
      />
      <StringList
        label="Refuse"
        hint="Matchups you do not donate."
        items={draft.refuse ?? [""]}
        onChange={(refuse) => commit({ ...draft, refuse })}
      />
      <SwitchList items={draft.switches ?? [{ into: "", send: "" }]} onChange={(switches) => commit({ ...draft, switches })} />

      <PlanList items={draft.plan ?? []} onChange={(plan) => commit({ ...draft, plan })} />

      <h2 className="mt-16 text-2xl font-semibold tracking-tight">Slots</h2>
      <div className="mt-6 space-y-8">
        {draft.slots.map((slot, i) => {
          const p = slot.slug ? getPokemon(slot.slug) : undefined;
          return (
            <section
              key={i}
              className="rounded-[28px] border border-line bg-raised/40 p-5"
              style={p ? cssVars(p.palette) : undefined}
            >
              <div className="flex flex-wrap items-center gap-4">
                {p ? <PokemonArt slug={p.slug} src={p.artwork} name={p.name} size={72} /> : null}
                <div className="min-w-0 flex-1">
                  <p className="text-sm text-muted">Slot {i + 1}</p>
                  {p ? (
                    <>
                      <p className="font-semibold">{p.name}</p>
                      <SlotMatchups types={p.types} />
                    </>
                  ) : (
                    <p className="text-muted">No Pokémon yet</p>
                  )}
                </div>
                <Button type="button" variant="line" onClick={() => setPick(i)}>
                  {p ? "Change" : "Pick"}
                </Button>
              </div>
              <label className="mt-5 block text-sm font-medium">Slot title</label>
              <input
                className={`mt-2 ${inputClass}`}
                value={slot.title}
                placeholder="The Bodyguard"
                onChange={(e) => updateSlot(i, { title: e.target.value })}
              />
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium">Job</label>
                  <select
                    className={`mt-2 ${inputClass}`}
                    value={slot.job}
                    onChange={(e) => updateSlot(i, { job: e.target.value as RoleId })}
                  >
                    {LEARN_ROLE_IDS.map((id) => (
                      <option key={id} value={id}>
                        {ROLE_LABEL[id]}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium">Literacy name</label>
                  <select
                    className={`mt-2 ${inputClass}`}
                    value={slot.literacy ?? ""}
                    onChange={(e) =>
                      updateSlot(i, { literacy: (e.target.value || undefined) as LiteracyRoleId | undefined })
                    }
                  >
                    <option value="">None</option>
                    {LITERACY_ROLES.map((lit) => (
                      <option key={lit.id} value={lit.id}>
                        {lit.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <label className="mt-4 block text-sm font-medium">Role on this three</label>
              <input
                className={`mt-2 ${inputClass}`}
                value={slot.role}
                onChange={(e) => updateSlot(i, { role: e.target.value })}
              />
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium">Ability the tree needs</label>
                  <input
                    className={`mt-2 ${inputClass}`}
                    value={slot.ability ?? ""}
                    onChange={(e) => updateSlot(i, { ability: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium">Item</label>
                  <input
                    className={`mt-2 ${inputClass}`}
                    value={slot.item ?? ""}
                    onChange={(e) => updateSlot(i, { item: e.target.value })}
                  />
                </div>
              </div>
              <p className="mt-5 text-sm font-medium">Best kit</p>
              <div className="mt-2 space-y-4">
                {(slot.moves.length ? slot.moves : emptySlot().moves).map((move, mi) => (
                  <div key={mi} className="space-y-2 rounded-2xl bg-white/5 p-3">
                    <div className="grid gap-2 sm:grid-cols-2">
                      <input
                        className={inputClass}
                        placeholder="Move"
                        value={move.name}
                        onChange={(e) => {
                          const moves = [...slot.moves];
                          moves[mi] = { ...moves[mi], name: e.target.value };
                          updateSlot(i, { moves });
                        }}
                      />
                      <input
                        className={inputClass}
                        placeholder="Why"
                        value={move.why}
                        onChange={(e) => {
                          const moves = [...slot.moves];
                          moves[mi] = { ...moves[mi], why: e.target.value };
                          updateSlot(i, { moves });
                        }}
                      />
                    </div>
                    {(move.alts ?? []).map((alt, ai) => (
                      <div key={ai} className="grid gap-2 sm:grid-cols-2">
                        <input
                          className={inputClass}
                          placeholder="Swap"
                          value={alt.name}
                          onChange={(e) => {
                            const moves = [...slot.moves];
                            const alts = [...(moves[mi].alts ?? [])];
                            alts[ai] = { ...alts[ai], name: e.target.value };
                            moves[mi] = { ...moves[mi], alts };
                            updateSlot(i, { moves });
                          }}
                        />
                        <div className="flex gap-2">
                          <input
                            className={inputClass}
                            placeholder="When to swap"
                            value={alt.why}
                            onChange={(e) => {
                              const moves = [...slot.moves];
                              const alts = [...(moves[mi].alts ?? [])];
                              alts[ai] = { ...alts[ai], why: e.target.value };
                              moves[mi] = { ...moves[mi], alts };
                              updateSlot(i, { moves });
                            }}
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            onClick={() => {
                              const moves = [...slot.moves];
                              moves[mi] = {
                                ...moves[mi],
                                alts: (moves[mi].alts ?? []).filter((_, j) => j !== ai),
                              };
                              updateSlot(i, { moves });
                            }}
                          >
                            Remove
                          </Button>
                        </div>
                      </div>
                    ))}
                    <Button
                      type="button"
                      variant="ghost"
                      className="text-xs"
                      onClick={() => {
                        const moves = [...slot.moves];
                        moves[mi] = { ...moves[mi], alts: [...(moves[mi].alts ?? []), { name: "", why: "" }] };
                        updateSlot(i, { moves });
                      }}
                    >
                      Add swap
                    </Button>
                  </div>
                ))}
              </div>
              <label className="mt-4 block text-sm font-medium">Objective</label>
              <textarea
                className={`mt-2 ${areaClass}`}
                value={slot.objective}
                onChange={(e) => updateSlot(i, { objective: e.target.value })}
              />
              <label className="mt-4 block text-sm font-medium">How to play this slot (one beat per line)</label>
              <textarea
                className={`mt-2 ${areaClass}`}
                value={slot.howToPlay}
                onChange={(e) => updateSlot(i, { howToPlay: e.target.value })}
              />
            </section>
          );
        })}
      </div>

      <h2 className="mt-16 text-2xl font-semibold tracking-tight">Decision trees</h2>
      {draft.phases.map((phase, pi) => (
        <section key={phase.id} className="mt-8 rounded-[28px] border border-line p-5">
          <label className="block text-sm font-medium">Phase title</label>
          <input
            className={`mt-2 ${inputClass}`}
            value={phase.title}
            onChange={(e) => {
              const phases = draft.phases.map((ph, i) => (i === pi ? { ...ph, title: e.target.value } : ph));
              commit({ ...draft, phases });
            }}
          />
          <label className="mt-4 block text-sm font-medium">Lede</label>
          <textarea
            className={`mt-2 ${areaClass}`}
            value={phase.lede ?? ""}
            onChange={(e) => {
              const phases = draft.phases.map((ph, i) => (i === pi ? { ...ph, lede: e.target.value } : ph));
              commit({ ...draft, phases });
            }}
          />
          <ul className="mt-4 space-y-4">
            {phase.branches.map((branch, bi) => (
              <li key={bi} className="rounded-2xl bg-white/5 p-4">
                <p className="text-xs uppercase tracking-wide text-muted">On field (slug)</p>
                <input
                  className={`mt-2 ${inputClass}`}
                  value={branch.out ?? ""}
                  placeholder="whimsicott"
                  onChange={(e) => updateBranch(pi, bi, { out: e.target.value || undefined })}
                />
                <p className="mt-3 text-xs uppercase tracking-wide text-muted">If</p>
                <textarea
                  className={`mt-2 ${areaClass}`}
                  value={branch.when}
                  onChange={(e) => updateBranch(pi, bi, { when: e.target.value })}
                />
                <p className="mt-3 text-xs uppercase tracking-wide text-muted">Then</p>
                <textarea
                  className={`mt-2 ${areaClass}`}
                  value={branch.then}
                  onChange={(e) => updateBranch(pi, bi, { then: e.target.value })}
                />
                <p className="mt-3 text-xs uppercase tracking-wide text-muted">Why</p>
                <textarea
                  className={`mt-2 ${areaClass}`}
                  value={branch.why ?? ""}
                  onChange={(e) => updateBranch(pi, bi, { why: e.target.value })}
                />
                <Button
                  type="button"
                  variant="ghost"
                  className="mt-2"
                  onClick={() => {
                    const phases = draft.phases.map((ph, i) =>
                      i === pi ? { ...ph, branches: ph.branches.filter((_, j) => j !== bi) } : ph,
                    );
                    commit({ ...draft, phases });
                  }}
                >
                  Remove branch
                </Button>
              </li>
            ))}
          </ul>
          <Button
            type="button"
            variant="line"
            className="mt-4"
            onClick={() => {
              const phases = draft.phases.map((ph, i) =>
                i === pi ? { ...ph, branches: [...ph.branches, { when: "", then: "" }] } : ph,
              );
              commit({ ...draft, phases });
            }}
          >
            Add branch
          </Button>
        </section>
      ))}

      <PairList
        title="Loops"
        items={draft.loops}
        onChange={(loops) => commit({ ...draft, loops })}
      />
      <PairList
        title="Hazards"
        items={draft.hazards}
        onChange={(hazards) => commit({ ...draft, hazards })}
      />

      {error ? <p className="mt-8 text-sm text-amber-200">{error}</p> : null}
      <div className="mt-8 flex flex-wrap gap-3">
        <Button type="button" onClick={save}>
          Save on this device
        </Button>
        <Button type="button" variant="ghost" onClick={() => router.push("/manuals")}>
          Cancel
        </Button>
      </div>

      {pick !== null ? (
        <div className="fixed inset-0 z-50 flex items-end bg-black/50 p-4 md:items-center md:justify-center">
          <div className="w-full max-w-lg rounded-t-3xl bg-raised p-5 md:rounded-3xl">
            <div className="mb-3 flex justify-between text-sm">
              <button type="button" className="text-muted" onClick={() => setPick(null)}>
                Close
              </button>
            </div>
            <PokemonPicker
              autoFocus
              exclude={exclude.filter((s) => s !== draft.slots[pick].slug)}
              onPick={(slug) => {
                updateSlot(pick, { slug });
                setPick(null);
              }}
            />
          </div>
        </div>
      ) : null}
    </div>
  );

  function updateBranch(pi: number, bi: number, patch: Partial<ManualBranch>) {
    const phases = draft.phases.map((ph, i) => {
      if (i !== pi) return ph;
      const branches = ph.branches.map((b, j) => (j === bi ? { ...b, ...patch } : b));
      return { ...ph, branches };
    });
    commit({ ...draft, phases });
  }
}

function StringList({
  label,
  hint,
  items,
  onChange,
}: {
  label: string;
  hint: string;
  items: string[];
  onChange: (items: string[]) => void;
}) {
  const rows = items.length ? items : [""];
  return (
    <section className="mt-8">
      <h2 className="text-sm font-medium">{label}</h2>
      <p className="mt-1 text-xs text-muted">{hint}</p>
      <ul className="mt-3 space-y-2">
        {rows.map((item, i) => (
          <li key={i} className="flex gap-2">
            <input
              className={inputClass}
              value={item}
              onChange={(e) => onChange(rows.map((x, j) => (j === i ? e.target.value : x)))}
            />
            <Button type="button" variant="ghost" onClick={() => onChange(rows.filter((_, j) => j !== i))}>
              Remove
            </Button>
          </li>
        ))}
      </ul>
      <Button type="button" variant="line" className="mt-3" onClick={() => onChange([...rows, ""])}>
        Add
      </Button>
    </section>
  );
}

function SwitchList({
  items,
  onChange,
}: {
  items: { into: string; send: string }[];
  onChange: (items: { into: string; send: string }[]) => void;
}) {
  const rows = items.length ? items : [{ into: "", send: "" }];
  return (
    <section className="mt-8">
      <h2 className="text-sm font-medium">Switches</h2>
      <p className="mt-1 text-xs text-muted">Ice → Corviknight. One row per read.</p>
      <ul className="mt-3 space-y-2">
        {rows.map((item, i) => (
          <li key={i} className="grid gap-2 sm:grid-cols-[1fr_1fr_auto]">
            <input
              className={inputClass}
              placeholder="They click"
              value={item.into}
              onChange={(e) => onChange(rows.map((x, j) => (j === i ? { ...x, into: e.target.value } : x)))}
            />
            <input
              className={inputClass}
              placeholder="You send"
              value={item.send}
              onChange={(e) => onChange(rows.map((x, j) => (j === i ? { ...x, send: e.target.value } : x)))}
            />
            <Button type="button" variant="ghost" onClick={() => onChange(rows.filter((_, j) => j !== i))}>
              Remove
            </Button>
          </li>
        ))}
      </ul>
      <Button type="button" variant="line" className="mt-3" onClick={() => onChange([...rows, { into: "", send: "" }])}>
        Add switch
      </Button>
    </section>
  );
}

function PlanList({
  items,
  onChange,
}: {
  items: ManualPlanBeat[];
  onChange: (items: ManualPlanBeat[]) => void;
}) {
  const rows = items.length ? items : [{ title: "", goal: "", play: "" }];
  return (
    <section className="mt-16">
      <h2 className="text-2xl font-semibold tracking-tight">How a game goes</h2>
      <p className="mt-1 text-xs text-muted">Three beats. Goal, the play, then what happens next.</p>
      <ul className="mt-4 space-y-4">
        {rows.map((item, i) => (
          <li key={i} className="rounded-3xl border border-line p-4">
            <p className="text-xs uppercase tracking-wide text-muted">Beat {i + 1}</p>
            <input
              className={`mt-2 ${inputClass}`}
              placeholder="Title — Clock"
              value={item.title}
              onChange={(e) => onChange(rows.map((x, j) => (j === i ? { ...x, title: e.target.value } : x)))}
            />
            <input
              className={`mt-2 ${inputClass}`}
              placeholder="Goal"
              value={item.goal}
              onChange={(e) => onChange(rows.map((x, j) => (j === i ? { ...x, goal: e.target.value } : x)))}
            />
            <textarea
              className={`mt-2 ${areaClass}`}
              placeholder="The play"
              value={item.play}
              onChange={(e) => onChange(rows.map((x, j) => (j === i ? { ...x, play: e.target.value } : x)))}
            />
            <textarea
              className={`mt-2 ${areaClass}`}
              placeholder="Then…"
              value={item.next ?? ""}
              onChange={(e) => onChange(rows.map((x, j) => (j === i ? { ...x, next: e.target.value } : x)))}
            />
            <Button type="button" variant="ghost" className="mt-2" onClick={() => onChange(rows.filter((_, j) => j !== i))}>
              Remove
            </Button>
          </li>
        ))}
      </ul>
      <Button
        type="button"
        variant="line"
        className="mt-4"
        onClick={() => onChange([...rows, { title: "", goal: "", play: "" }])}
      >
        Add beat
      </Button>
    </section>
  );
}

function PairList({
  title,
  items,
  onChange,
}: {
  title: string;
  items: { title: string; body: string }[];
  onChange: (items: { title: string; body: string }[]) => void;
}) {
  return (
    <section className="mt-16">
      <h2 className="text-2xl font-semibold tracking-tight">{title}</h2>
      <ul className="mt-4 space-y-4">
        {items.map((item, i) => (
          <li key={i} className="rounded-3xl border border-line p-4">
            <input
              className={inputClass}
              placeholder="Title"
              value={item.title}
              onChange={(e) => onChange(items.map((x, j) => (j === i ? { ...x, title: e.target.value } : x)))}
            />
            <textarea
              className={`mt-2 ${areaClass}`}
              placeholder="Body"
              value={item.body}
              onChange={(e) => onChange(items.map((x, j) => (j === i ? { ...x, body: e.target.value } : x)))}
            />
            <Button type="button" variant="ghost" className="mt-2" onClick={() => onChange(items.filter((_, j) => j !== i))}>
              Remove
            </Button>
          </li>
        ))}
      </ul>
      <Button type="button" variant="line" className="mt-4" onClick={() => onChange([...items, { title: "", body: "" }])}>
        Add {title.toLowerCase().slice(0, -1)}
      </Button>
    </section>
  );
}
