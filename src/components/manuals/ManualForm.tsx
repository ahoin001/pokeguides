"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { getPokemon } from "@/lib/catalog/load";
import { cssVars } from "@/lib/champions/palette";
import { PokemonArt } from "@/components/pokemon/PokemonArt";
import { SlotMatchups } from "@/components/manuals/SlotMatchups";
import { PokemonPicker } from "@/components/pokemon/PokemonPicker";
import { Button } from "@/components/ui/Button";
import { PageFrame } from "@/components/chrome/PageFrame";
import { ARCHETYPE_IDS } from "@/types/pokemon";
import type { ArchetypeId, LiteracyRoleId, RoleId } from "@/types/pokemon";
import { ARCHETYPE_LABEL } from "@/content/archetypes";
import { LEARN_ROLE_IDS, ROLE_LABEL } from "@/content/roles";
import { LITERACY_ROLES } from "@/content/literacy-roles";
import {
  emptyPack,
  emptySlot,
  MANUAL_FAMILY_IDS,
  MANUAL_FAMILY_LABEL,
  manualFormat,
  toBoxedDraft,
  toFlatDraft,
  type ManualAltSlot,
  type ManualBranch,
  type ManualEndgame,
  type ManualFamilyId,
  type ManualPack,
  type ManualPackRole,
  type ManualPackStrategy,
  type ManualPlanBeat,
  type SlotManual,
  type TeamManual,
} from "@/content/manuals";
import { FORMAT_BLURB, FORMAT_LABEL, type BattleFormat } from "@/lib/format";
import { syncSlugsFromSlots, validateManual } from "@/lib/champions/manuals";
import { sampleSpTotal } from "@/lib/champions/stats";
import { useManualsStore } from "@/stores/manuals";
import type { SampleSp } from "@/types/pokemon";

const STAT_FIELDS: { key: keyof SampleSp; label: string }[] = [
  { key: "hp", label: "HP" },
  { key: "atk", label: "Atk" },
  { key: "def", label: "Def" },
  { key: "spa", label: "SpA" },
  { key: "spd", label: "SpD" },
  { key: "spe", label: "Spe" },
];

function zeroSp(): SampleSp {
  return { hp: 0, atk: 0, def: 0, spa: 0, spd: 0, spe: 0 };
}

const inputClass =
  "w-full rounded-2xl border border-line bg-sunken px-4 py-3 text-ink outline-none placeholder:text-muted focus:border-ink/40";
const areaClass = `${inputClass} min-h-24`;

function isBoxedDraft(m: TeamManual) {
  return Boolean(m.packs?.length);
}

export function ManualForm({
  initial,
  mode,
}: {
  initial: TeamManual;
  mode: "create" | "edit";
}) {
  const router = useRouter();
  const saveLocal = useManualsStore((s) => s.saveLocal);
  const [draft, setDraft] = useState<TeamManual>(() => syncSlugsFromSlots(initial));
  const [pick, setPick] = useState<{ kind: "slot" | "roster"; index: number } | null>(null);
  const [packTab, setPackTab] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const boxed = isBoxedDraft(draft);

  function commit(next: TeamManual) {
    setDraft(syncSlugsFromSlots(next));
  }

  function setFormat(next: "three" | "boxed") {
    if (next === "boxed" && !boxed) {
      commit(toBoxedDraft(draft));
      setPackTab(0);
      return;
    }
    if (next === "three" && boxed) {
      if (!window.confirm("Flatten to a single three? Packs beyond the first will be dropped.")) return;
      commit(toFlatDraft(draft));
    }
  }

  function updateSlot(index: number, patch: Partial<SlotManual>) {
    if (boxed) {
      const roster = [...(draft.roster ?? [])];
      while (roster.length < 6) roster.push(emptySlot());
      roster[index] = { ...roster[index], ...patch };
      const box = roster.map((s) => s.slug) as [
        string,
        string,
        string,
        string,
        string,
        string,
      ];
      commit({ ...draft, roster, box });
      return;
    }
    const slots = draft.slots.map((s, i) => (i === index ? { ...s, ...patch } : s));
    commit({ ...draft, slots });
  }

  function updatePack(index: number, patch: Partial<ManualPack>) {
    const packs = (draft.packs ?? []).map((p, i) => (i === index ? { ...p, ...patch } : p));
    commit({ ...draft, packs });
  }

  function updateStrategy(index: number, patch: Partial<ManualPackStrategy>) {
    const pack = draft.packs?.[index];
    if (!pack) return;
    const strategy: ManualPackStrategy = {
      opponentPattern: pack.strategy?.opponentPattern ?? pack.when ?? "",
      purpose: pack.strategy?.purpose ?? "",
      targets: pack.strategy?.targets ?? [],
      refuses: pack.strategy?.refuses ?? [],
      winCondition: pack.strategy?.winCondition ?? "",
      ...pack.strategy,
      ...patch,
      bring: pack.slugs,
    };
    updatePack(index, { strategy });
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

  const slotList = boxed ? (draft.roster ?? []).slice(0, 6) : draft.slots;
  while (boxed && slotList.length < 6) slotList.push(emptySlot());
  const exclude = slotList.map((s) => s.slug).filter(Boolean);
  const boxSlugs = (draft.box ?? []).filter(Boolean) as string[];
  const packs = draft.packs ?? [];
  const activePack = packs[packTab] ?? packs[0];
  const endgames = draft.construction?.endgames ?? [];
  const alts = draft.construction?.altSlots ?? [];
  const flexSlugs = alts.map((a) => a.slug).filter(Boolean);

  return (
    <PageFrame variant="reading">
      <h1 className="text-4xl font-semibold tracking-tight">
        {mode === "create" ? "Write a manual" : "Edit manual"}
      </h1>
      <p className="mt-3 max-w-[54ch] text-sm text-muted">
        Author a flat bring of three, or a registered six with preview packages — same structure as
        classroom boxed manuals.
      </p>

      <div className="mt-8 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => setFormat("three")}
          className={`rounded-full px-4 py-2 text-sm font-medium transition ${
            !boxed ? "bg-ink text-bg" : "border border-line text-muted hover:text-ink"
          }`}
        >
          Flat 3v3
        </button>
        <button
          type="button"
          onClick={() => setFormat("boxed")}
          className={`rounded-full px-4 py-2 text-sm font-medium transition ${
            boxed ? "bg-ink text-bg" : "border border-line text-muted hover:text-ink"
          }`}
        >
          6-box + packs
        </button>
      </div>

      <div className="mt-6">
        <p className="text-sm font-medium">Battle format</p>
        <p className="mt-1 text-xs text-muted">
          Which shelf this manual appears on. {FORMAT_BLURB[manualFormat(draft)]}.
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          {(["singles", "doubles"] as const).map((fmt) => {
            const on = manualFormat(draft) === fmt;
            return (
              <button
                key={fmt}
                type="button"
                onClick={() => commit({ ...draft, format: fmt as BattleFormat })}
                className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                  on
                    ? fmt === "doubles"
                      ? "bg-teal-700 text-white dark:bg-teal-600"
                      : "bg-ink text-bg"
                    : "border border-line text-muted hover:text-ink"
                }`}
              >
                {FORMAT_LABEL[fmt]}
              </button>
            );
          })}
        </div>
      </div>

      <label className="mt-10 block text-sm font-medium">Title</label>
      <input
        className={`mt-2 ${inputClass}`}
        value={draft.title}
        onChange={(e) => commit({ ...draft, title: e.target.value })}
      />

      <label className="mt-6 block text-sm font-medium">
        {boxed ? "Six summary" : "Lede"}
      </label>
      <textarea
        className={`mt-2 ${areaClass}`}
        value={boxed ? (draft.sixSummary ?? draft.lede) : draft.lede}
        onChange={(e) =>
          commit(
            boxed
              ? { ...draft, sixSummary: e.target.value, lede: e.target.value }
              : { ...draft, lede: e.target.value },
          )
        }
        placeholder={
          boxed
            ? "Why these six are registered together (1–2 sentences)."
            : "What this three is trying to do."
        }
      />

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <div>
          <label className="block text-sm font-medium">Style</label>
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
        </div>
        <div>
          <label className="block text-sm font-medium">Family</label>
          <select
            className={`mt-2 ${inputClass}`}
            value={draft.family ?? "clock"}
            onChange={(e) => commit({ ...draft, family: e.target.value as ManualFamilyId })}
          >
            {MANUAL_FAMILY_IDS.map((id) => (
              <option key={id} value={id}>
                {MANUAL_FAMILY_LABEL[id]}
              </option>
            ))}
          </select>
        </div>
      </div>

      {!boxed ? (
        <>
          <label className="mt-6 block text-sm font-medium">Philosophy</label>
          <textarea
            className={`mt-2 ${areaClass}`}
            value={draft.philosophy}
            onChange={(e) => commit({ ...draft, philosophy: e.target.value })}
          />
          <label className="mt-6 block text-sm font-medium">What this three is for</label>
          <textarea
            className={`mt-2 ${areaClass}`}
            value={draft.meta}
            onChange={(e) => commit({ ...draft, meta: e.target.value })}
          />
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
          <SwitchList
            items={draft.switches ?? [{ into: "", send: "" }]}
            onChange={(switches) => commit({ ...draft, switches })}
          />
          <PlanList items={draft.plan ?? []} onChange={(plan) => commit({ ...draft, plan })} />
        </>
      ) : null}

      <h2 className="mt-16 text-2xl font-semibold tracking-tight">
        {boxed ? "Registered six" : "The three you bring"}
      </h2>
      <p className="mt-1 text-sm text-muted">
        {boxed
          ? "Sets live on the six once. Packages pick three by slug."
          : "Author the three you bring."}
      </p>
      <div className="mt-6 space-y-8">
        {slotList.map((slot, i) => (
          <SlotEditor
            key={i}
            index={i}
            slot={slot}
            onChange={(patch) => updateSlot(i, patch)}
            onPick={() => setPick({ kind: boxed ? "roster" : "slot", index: i })}
          />
        ))}
      </div>

      {boxed ? (
        <>
          <EndgamesEditor
            endgames={endgames}
            onChange={(next) =>
              commit({
                ...draft,
                construction: {
                  thesis: draft.construction?.thesis ?? "",
                  method: draft.construction?.method ?? "",
                  winCondition: draft.construction?.winCondition ?? "",
                  ...draft.construction,
                  endgames: next,
                },
              })
            }
          />

          <FlexPoolEditor
            alts={alts}
            boxSlugs={boxSlugs}
            packIds={packs.map((p) => p.id)}
            onChange={(next) =>
              commit({
                ...draft,
                construction: {
                  thesis: draft.construction?.thesis ?? "",
                  method: draft.construction?.method ?? "",
                  winCondition: draft.construction?.winCondition ?? "",
                  ...draft.construction,
                  altSlots: next,
                },
              })
            }
          />

          <h2 className="mt-16 text-2xl font-semibold tracking-tight">Packages</h2>
          <p className="mt-1 text-sm text-muted">
            Each package is a preview bring of three — strategy, plan clock, endgame links, and
            situation loops. Swap-gated packs pick from the active six after the flex.
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            {packs.map((p, i) => (
              <button
                key={p.id}
                type="button"
                onClick={() => setPackTab(i)}
                className={`rounded-full px-3.5 py-1.5 text-sm transition ${
                  i === packTab ? "bg-ink text-bg" : "border border-line text-muted hover:text-ink"
                }`}
              >
                {p.label || p.id}
                {p.requiresSwap?.in ? " · swap" : ""}
              </button>
            ))}
            <Button
              type="button"
              variant="line"
              onClick={() => {
                const id = `pack-${String.fromCharCode(97 + packs.length)}`;
                const seed: [string, string, string] = [
                  boxSlugs[0] ?? "",
                  boxSlugs[1] ?? "",
                  boxSlugs[2] ?? "",
                ];
                commit({
                  ...draft,
                  packs: [...packs, emptyPack(id, seed)],
                });
                setPackTab(packs.length);
              }}
            >
              Add package
            </Button>
          </div>

          {activePack ? (
            <PackEditor
              pack={activePack}
              boxSlugs={boxSlugs}
              flexSlugs={flexSlugs}
              endgames={endgames}
              onChange={(patch) => updatePack(packTab, patch)}
              onStrategy={(patch) => updateStrategy(packTab, patch)}
              onRemove={
                packs.length > 1
                  ? () => {
                      const next = packs.filter((_, i) => i !== packTab);
                      commit({ ...draft, packs: next });
                      setPackTab(Math.max(0, packTab - 1));
                    }
                  : undefined
              }
            />
          ) : null}
        </>
      ) : (
        <>
          <h2 className="mt-16 text-2xl font-semibold tracking-tight">Decision trees</h2>
          {draft.phases.map((phase, pi) => (
            <section key={phase.id} className="mt-8 rounded-[28px] border border-line p-5">
              <label className="block text-sm font-medium">Phase title</label>
              <input
                className={`mt-2 ${inputClass}`}
                value={phase.title}
                onChange={(e) => {
                  const phases = draft.phases.map((ph, i) =>
                    i === pi ? { ...ph, title: e.target.value } : ph,
                  );
                  commit({ ...draft, phases });
                }}
              />
              <label className="mt-4 block text-sm font-medium">Lede</label>
              <textarea
                className={`mt-2 ${areaClass}`}
                value={phase.lede ?? ""}
                onChange={(e) => {
                  const phases = draft.phases.map((ph, i) =>
                    i === pi ? { ...ph, lede: e.target.value } : ph,
                  );
                  commit({ ...draft, phases });
                }}
              />
              <ul className="mt-4 space-y-4">
                {phase.branches.map((branch, bi) => (
                  <li key={bi} className="rounded-2xl bg-white/5 p-4">
                    <p className="text-xs uppercase tracking-wide text-muted">If</p>
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
                    <Button
                      type="button"
                      variant="ghost"
                      className="mt-2"
                      onClick={() => {
                        const phases = draft.phases.map((ph, i) =>
                          i === pi
                            ? { ...ph, branches: ph.branches.filter((_, j) => j !== bi) }
                            : ph,
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
        </>
      )}

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
              exclude={exclude.filter((s) => s !== slotList[pick.index]?.slug)}
              onPick={(slug) => {
                updateSlot(pick.index, { slug });
                setPick(null);
              }}
            />
          </div>
        </div>
      ) : null}
    </PageFrame>
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

function PackEditor({
  pack,
  boxSlugs,
  flexSlugs,
  endgames,
  onChange,
  onStrategy,
  onRemove,
}: {
  pack: ManualPack;
  boxSlugs: string[];
  flexSlugs: string[];
  endgames: ManualEndgame[];
  onChange: (patch: Partial<ManualPack>) => void;
  onStrategy: (patch: Partial<ManualPackStrategy>) => void;
  onRemove?: () => void;
}) {
  const strategy = pack.strategy;
  const roles = pack.roles ?? [];
  const swap = pack.requiresSwap;
  const bringOptions = (() => {
    const base = [...boxSlugs];
    if (swap?.out && swap?.in) {
      return [...base.filter((s) => s !== swap.out), swap.in];
    }
    return [...base, ...flexSlugs.filter((s) => !base.includes(s))];
  })();

  function setSlug(i: number, slug: string) {
    const slugs: [string, string, string] = [...pack.slugs];
    slugs[i] = slug;
    const nextRoles: ManualPackRole[] = slugs.filter(Boolean).map((s) => {
      const hit = roles.find((r) => r.slug === s);
      return hit ?? { slug: s, macro: "", micro: "" };
    });
    onChange({ slugs, roles: nextRoles });
  }

  return (
    <section className="mt-8 space-y-8 rounded-[28px] border border-line bg-raised/30 p-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0 flex-1 space-y-4">
          <div>
            <label className="block text-sm font-medium">Label</label>
            <input
              className={`mt-2 ${inputClass}`}
              value={pack.label}
              placeholder="Package A — Anti-balance"
              onChange={(e) => onChange({ label: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium">When (carousel / menu line)</label>
            <textarea
              className={`mt-2 ${areaClass}`}
              value={pack.when}
              placeholder="Short trigger — what you saw in preview."
              onChange={(e) => onChange({ when: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Identity</label>
            <textarea
              className={`mt-2 ${areaClass}`}
              value={pack.identity}
              onChange={(e) => onChange({ identity: e.target.value })}
            />
          </div>
        </div>
        {onRemove ? (
          <Button type="button" variant="ghost" onClick={onRemove}>
            Remove package
          </Button>
        ) : null}
      </div>

      <div className="rounded-2xl border border-amber-400/25 bg-amber-500/5 p-4">
        <p className="text-sm font-medium">Requires flex swap</p>
        <p className="mt-1 text-xs text-muted">
          Leave empty for packs legal on the core six. When set, Load uses the swapped registration.
        </p>
        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          <div>
            <label className="block text-xs font-medium text-muted">Out (from six)</label>
            <select
              className={`mt-1.5 ${inputClass}`}
              value={swap?.out ?? ""}
              onChange={(e) => {
                const out = e.target.value;
                if (!out && !swap?.in) {
                  onChange({ requiresSwap: undefined });
                  return;
                }
                onChange({
                  requiresSwap: { out, in: swap?.in ?? "" },
                });
              }}
            >
              <option value="">None</option>
              {boxSlugs.map((slug) => {
                const mon = getPokemon(slug);
                return (
                  <option key={slug} value={slug}>
                    {mon?.name ?? slug}
                  </option>
                );
              })}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-muted">In (from flex pool)</label>
            <select
              className={`mt-1.5 ${inputClass}`}
              value={swap?.in ?? ""}
              onChange={(e) => {
                const inn = e.target.value;
                if (!inn && !swap?.out) {
                  onChange({ requiresSwap: undefined });
                  return;
                }
                onChange({
                  requiresSwap: { out: swap?.out ?? "", in: inn },
                });
              }}
            >
              <option value="">None</option>
              {flexSlugs.map((slug) => {
                const mon = getPokemon(slug);
                return (
                  <option key={slug} value={slug}>
                    {mon?.name ?? slug}
                  </option>
                );
              })}
            </select>
          </div>
        </div>
        {!flexSlugs.length ? (
          <p className="mt-2 text-xs text-amber-200/80">Add flex pool candidates above first.</p>
        ) : null}
      </div>

      <div>
        <p className="text-sm font-medium">Bring of three</p>
        <div className="mt-3 grid gap-3 sm:grid-cols-3">
          {[0, 1, 2].map((i) => (
            <select
              key={i}
              className={inputClass}
              value={pack.slugs[i] ?? ""}
              onChange={(e) => setSlug(i, e.target.value)}
            >
              <option value="">Pick…</option>
              {bringOptions.map((slug) => {
                const mon = getPokemon(slug);
                return (
                  <option key={slug} value={slug}>
                    {mon?.name ?? slug}
                    {flexSlugs.includes(slug) ? " (flex)" : ""}
                  </option>
                );
              })}
            </select>
          ))}
        </div>
      </div>

      <div className="space-y-4 border-t border-line/70 pt-6">
        <h3 className="text-lg font-semibold tracking-tight">Strategy</h3>
        <label className="block text-sm font-medium">Win condition</label>
        <textarea
          className={`mt-2 ${areaClass}`}
          value={strategy?.winCondition ?? ""}
          onChange={(e) => onStrategy({ winCondition: e.target.value })}
        />
        <label className="block text-sm font-medium">Game plan (Break → Control → Finish)</label>
        <textarea
          className={`mt-2 ${areaClass}`}
          value={strategy?.gamePlan ?? ""}
          onChange={(e) => onStrategy({ gamePlan: e.target.value })}
        />
        <label className="block text-sm font-medium">Mantra</label>
        <input
          className={`mt-2 ${inputClass}`}
          value={strategy?.mantra ?? ""}
          onChange={(e) => onStrategy({ mantra: e.target.value })}
        />
        <label className="block text-sm font-medium">Purpose</label>
        <textarea
          className={`mt-2 ${areaClass}`}
          value={strategy?.purpose ?? ""}
          onChange={(e) => onStrategy({ purpose: e.target.value })}
        />
        <StringList
          label="Targets"
          hint="Structures this package attacks."
          items={strategy?.targets?.length ? strategy.targets : [""]}
          onChange={(targets) => onStrategy({ targets: targets.filter(Boolean) })}
        />
        <StringList
          label="Refuse"
          hint="When not to lock this bring."
          items={strategy?.refuses?.length ? strategy.refuses : [""]}
          onChange={(refuses) => onStrategy({ refuses: refuses.filter(Boolean) })}
        />
        <StringList
          label="Turn checklist"
          hint="Short mid-game checklist (≤5)."
          items={strategy?.turnChecklist?.length ? strategy.turnChecklist : [""]}
          onChange={(turnChecklist) =>
            onStrategy({ turnChecklist: turnChecklist.filter(Boolean).slice(0, 5) })
          }
        />
      </div>

      <div className="space-y-4 border-t border-line/70 pt-6">
        <h3 className="text-lg font-semibold tracking-tight">Roles</h3>
        {pack.slugs.filter(Boolean).map((slug) => {
          const role = roles.find((r) => r.slug === slug) ?? {
            slug,
            macro: "",
            micro: "",
          };
          const mon = getPokemon(slug);
          return (
            <div key={slug} className="rounded-2xl border border-line/60 bg-bg/40 p-4">
              <p className="text-sm font-medium">{mon?.name ?? slug}</p>
              <div className="mt-3 grid gap-3 sm:grid-cols-2">
                <input
                  className={inputClass}
                  placeholder="Macro — Break / Control / Finish"
                  value={role.macro}
                  onChange={(e) => {
                    const next = [
                      ...roles.filter((r) => r.slug !== slug),
                      { ...role, macro: e.target.value },
                    ];
                    onChange({ roles: next });
                  }}
                />
                <input
                  className={inputClass}
                  placeholder="Micro job"
                  value={role.micro}
                  onChange={(e) => {
                    const next = [
                      ...roles.filter((r) => r.slug !== slug),
                      { ...role, micro: e.target.value },
                    ];
                    onChange({ roles: next });
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>

      <PlanList
        items={pack.plan ?? []}
        onChange={(plan) => onChange({ plan })}
        title="Gameplan clock"
        hint="Lead → Mid → Late for this package."
      />

      {endgames.length ? (
        <div className="border-t border-line/70 pt-6">
          <h3 className="text-lg font-semibold tracking-tight">Endgame links</h3>
          <p className="mt-1 text-xs text-muted">Which closes on the six this bring pursues.</p>
          <ul className="mt-3 space-y-2">
            {endgames.map((eg) => {
              const on = (pack.endgameIds ?? []).includes(eg.id);
              return (
                <li key={eg.id}>
                  <label className="flex items-start gap-3 rounded-2xl border border-line/60 px-3 py-2 text-sm">
                    <input
                      type="checkbox"
                      className="mt-1"
                      checked={on}
                      onChange={() => {
                        const cur = new Set(pack.endgameIds ?? []);
                        if (on) cur.delete(eg.id);
                        else cur.add(eg.id);
                        onChange({ endgameIds: [...cur] });
                      }}
                    />
                    <span>
                      <span className="font-medium">{eg.label}</span>
                      <span className="mt-0.5 block text-xs text-muted">{eg.how}</span>
                    </span>
                  </label>
                </li>
              );
            })}
          </ul>
        </div>
      ) : null}

      <PairList
        title="Loops (plays)"
        items={pack.loops?.length ? pack.loops : [{ title: "", body: "" }]}
        onChange={(loops) => onChange({ loops })}
      />

      <div className="border-t border-line/70 pt-6">
        <h3 className="text-lg font-semibold tracking-tight">Situation forks</h3>
        <p className="mt-1 text-xs text-muted">
          Simplified lead/mid/late branches — saved as pack flows on this package.
        </p>
        {(["lead", "mid", "late"] as const).map((phaseId) => {
          const flow =
            pack.flows?.find((f) => f.id === phaseId) ??
            ({
              id: phaseId,
              title: phaseId === "lead" ? "Lead" : phaseId === "mid" ? "Mid" : "Late",
              forks: [{ id: `${phaseId}-0`, when: "", then: "" }],
            } as const);
          const forks = flow.forks?.length
            ? flow.forks
            : [{ id: `${phaseId}-0`, when: "", then: "" }];
          return (
            <div key={phaseId} className="mt-4 rounded-2xl border border-line/60 p-4">
              <p className="text-sm font-medium capitalize">{flow.title || phaseId}</p>
              <ul className="mt-3 space-y-3">
                {forks.map((fork, fi) => (
                  <li key={fork.id ?? fi} className="space-y-2 rounded-xl bg-white/5 p-3">
                    <textarea
                      className={areaClass}
                      placeholder="If…"
                      value={fork.when}
                      onChange={(e) => {
                        const nextForks = forks.map((f, j) =>
                          j === fi ? { ...f, when: e.target.value } : f,
                        );
                        const other = (pack.flows ?? []).filter((f) => f.id !== phaseId);
                        onChange({
                          flows: [
                            ...other,
                            { id: phaseId, title: flow.title, forks: nextForks },
                          ],
                        });
                      }}
                    />
                    <textarea
                      className={areaClass}
                      placeholder="Then…"
                      value={fork.then ?? ""}
                      onChange={(e) => {
                        const nextForks = forks.map((f, j) =>
                          j === fi ? { ...f, then: e.target.value } : f,
                        );
                        const other = (pack.flows ?? []).filter((f) => f.id !== phaseId);
                        onChange({
                          flows: [
                            ...other,
                            { id: phaseId, title: flow.title, forks: nextForks },
                          ],
                        });
                      }}
                    />
                  </li>
                ))}
              </ul>
              <Button
                type="button"
                variant="ghost"
                className="mt-2 text-xs"
                onClick={() => {
                  const nextForks = [
                    ...forks,
                    { id: `${phaseId}-${forks.length}`, when: "", then: "" },
                  ];
                  const other = (pack.flows ?? []).filter((f) => f.id !== phaseId);
                  onChange({
                    flows: [...other, { id: phaseId, title: flow.title, forks: nextForks }],
                  });
                }}
              >
                Add fork
              </Button>
            </div>
          );
        })}
      </div>
    </section>
  );
}

function FlexPoolEditor({
  alts,
  boxSlugs,
  packIds,
  onChange,
}: {
  alts: ManualAltSlot[];
  boxSlugs: string[];
  packIds: string[];
  onChange: (items: ManualAltSlot[]) => void;
}) {
  const rows = alts.length ? alts : [];
  return (
    <section className="mt-16">
      <h2 className="text-2xl font-semibold tracking-tight">Flex pool</h2>
      <p className="mt-1 text-sm text-muted">
        Candidates off the registered six. A package can require swapping one in to unlock a bring
        the default six cannot run.
      </p>
      <ul className="mt-4 space-y-4">
        {rows.map((alt, i) => {
          const mon = alt.slug ? getPokemon(alt.slug) : undefined;
          return (
            <li
              key={`${alt.slug || "alt"}-${i}`}
              className="rounded-3xl border border-line p-4"
              style={mon ? cssVars(mon.palette) : undefined}
            >
              <div className="flex flex-wrap items-center gap-3">
                {mon ? (
                  <PokemonArt
                    slug={mon.slug}
                    src={mon.sprite || mon.artwork}
                    name={mon.name}
                    size={48}
                  />
                ) : null}
                <div className="min-w-0 flex-1 space-y-3">
                  <div>
                    <label className="block text-xs font-medium text-muted">Flex species (slug)</label>
                    <input
                      className={`mt-1.5 ${inputClass}`}
                      value={alt.slug}
                      placeholder="mimikyu"
                      onChange={(e) =>
                        onChange(rows.map((x, j) => (j === i ? { ...x, slug: e.target.value } : x)))
                      }
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-muted">Instead of (core six)</label>
                    <select
                      className={`mt-1.5 ${inputClass}`}
                      value={alt.insteadOf ?? ""}
                      onChange={(e) =>
                        onChange(
                          rows.map((x, j) =>
                            j === i ? { ...x, insteadOf: e.target.value || undefined } : x,
                          ),
                        )
                      }
                    >
                      <option value="">Any / undecided</option>
                      {boxSlugs.map((slug) => {
                        const m = getPokemon(slug);
                        return (
                          <option key={slug} value={slug}>
                            {m?.name ?? slug}
                          </option>
                        );
                      })}
                    </select>
                  </div>
                </div>
              </div>
              <textarea
                className={`mt-3 ${areaClass}`}
                placeholder="Why this swap exists"
                value={alt.why}
                onChange={(e) =>
                  onChange(rows.map((x, j) => (j === i ? { ...x, why: e.target.value } : x)))
                }
              />
              <div className="mt-3 grid gap-3 sm:grid-cols-2">
                <textarea
                  className={areaClass}
                  placeholder="Gains (answers)"
                  value={alt.answers ?? ""}
                  onChange={(e) =>
                    onChange(
                      rows.map((x, j) =>
                        j === i ? { ...x, answers: e.target.value || undefined } : x,
                      ),
                    )
                  }
                />
                <textarea
                  className={areaClass}
                  placeholder="Costs"
                  value={alt.costs ?? ""}
                  onChange={(e) =>
                    onChange(
                      rows.map((x, j) =>
                        j === i ? { ...x, costs: e.target.value || undefined } : x,
                      ),
                    )
                  }
                />
              </div>
              {packIds.length ? (
                <div className="mt-3">
                  <p className="text-xs font-medium text-muted">Unlocks packages</p>
                  <ul className="mt-2 flex flex-wrap gap-2">
                    {packIds.map((id) => {
                      const on = (alt.unlocks ?? []).includes(id);
                      return (
                        <li key={id}>
                          <label className="inline-flex items-center gap-1.5 rounded-full border border-line/60 px-2.5 py-1 text-xs">
                            <input
                              type="checkbox"
                              checked={on}
                              onChange={() => {
                                const cur = new Set(alt.unlocks ?? []);
                                if (on) cur.delete(id);
                                else cur.add(id);
                                onChange(
                                  rows.map((x, j) =>
                                    j === i
                                      ? { ...x, unlocks: cur.size ? [...cur] : undefined }
                                      : x,
                                  ),
                                );
                              }}
                            />
                            {id}
                          </label>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              ) : null}
              <Button
                type="button"
                variant="ghost"
                className="mt-2"
                onClick={() => onChange(rows.filter((_, j) => j !== i))}
              >
                Remove
              </Button>
            </li>
          );
        })}
      </ul>
      <Button
        type="button"
        variant="line"
        className="mt-4"
        onClick={() =>
          onChange([
            ...rows,
            {
              slug: "",
              why: "",
            },
          ])
        }
      >
        Add flex candidate
      </Button>
    </section>
  );
}

function EndgamesEditor({
  endgames,
  onChange,
}: {
  endgames: ManualEndgame[];
  onChange: (items: ManualEndgame[]) => void;
}) {
  const rows = endgames.length ? endgames : [];
  return (
    <section className="mt-16">
      <h2 className="text-2xl font-semibold tracking-tight">Endgames (six-level)</h2>
      <p className="mt-1 text-sm text-muted">
        Closes the registered six can pursue. Link them from each package.
      </p>
      <ul className="mt-4 space-y-4">
        {rows.map((eg, i) => (
          <li key={eg.id} className="rounded-3xl border border-line p-4">
            <input
              className={inputClass}
              placeholder="Label — Chomp sweep"
              value={eg.label}
              onChange={(e) =>
                onChange(rows.map((x, j) => (j === i ? { ...x, label: e.target.value } : x)))
              }
            />
            <input
              className={`mt-2 ${inputClass}`}
              placeholder="Path — garchomp → cleaner"
              value={eg.path}
              onChange={(e) =>
                onChange(rows.map((x, j) => (j === i ? { ...x, path: e.target.value } : x)))
              }
            />
            <textarea
              className={`mt-2 ${areaClass}`}
              placeholder="How you close"
              value={eg.how}
              onChange={(e) =>
                onChange(rows.map((x, j) => (j === i ? { ...x, how: e.target.value } : x)))
              }
            />
            <Button
              type="button"
              variant="ghost"
              className="mt-2"
              onClick={() => onChange(rows.filter((_, j) => j !== i))}
            >
              Remove
            </Button>
          </li>
        ))}
      </ul>
      <Button
        type="button"
        variant="line"
        className="mt-4"
        onClick={() =>
          onChange([
            ...rows,
            {
              id: `eg-${Date.now()}`,
              label: "",
              path: "",
              how: "",
            },
          ])
        }
      >
        Add endgame
      </Button>
    </section>
  );
}

function SlotEditor({
  index,
  slot,
  onChange,
  onPick,
}: {
  index: number;
  slot: SlotManual;
  onChange: (patch: Partial<SlotManual>) => void;
  onPick: () => void;
}) {
  const p = slot.slug ? getPokemon(slot.slug) : undefined;
  return (
    <section
      className="rounded-[28px] border border-line bg-raised/40 p-5"
      style={p ? cssVars(p.palette) : undefined}
    >
      <div className="flex flex-wrap items-center gap-4">
        {p ? <PokemonArt slug={p.slug} src={p.artwork} name={p.name} size={72} /> : null}
        <div className="min-w-0 flex-1">
          <p className="text-sm text-muted">Slot {index + 1}</p>
          {p ? (
            <>
              <p className="font-semibold">{p.name}</p>
              <SlotMatchups types={p.types} />
            </>
          ) : (
            <p className="text-muted">No Pokémon yet</p>
          )}
        </div>
        <Button type="button" variant="line" onClick={onPick}>
          {p ? "Change" : "Pick"}
        </Button>
      </div>
      <label className="mt-5 block text-sm font-medium">Slot title</label>
      <input
        className={`mt-2 ${inputClass}`}
        value={slot.title}
        placeholder="The Bodyguard"
        onChange={(e) => onChange({ title: e.target.value })}
      />
      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <div>
          <label className="block text-sm font-medium">Job</label>
          <select
            className={`mt-2 ${inputClass}`}
            value={slot.job}
            onChange={(e) => onChange({ job: e.target.value as RoleId })}
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
              onChange({
                literacy: (e.target.value || undefined) as LiteracyRoleId | undefined,
              })
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
        onChange={(e) => onChange({ role: e.target.value })}
      />
      <div className="mt-4 grid gap-4 sm:grid-cols-3">
        <div>
          <label className="block text-sm font-medium">Ability</label>
          <input
            className={`mt-2 ${inputClass}`}
            value={slot.ability ?? ""}
            onChange={(e) => onChange({ ability: e.target.value })}
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Item</label>
          <input
            className={`mt-2 ${inputClass}`}
            value={slot.item ?? ""}
            onChange={(e) => onChange({ item: e.target.value })}
            placeholder="Focus Sash"
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Nature</label>
          <input
            className={`mt-2 ${inputClass}`}
            value={slot.nature ?? ""}
            placeholder="Jolly"
            onChange={(e) => onChange({ nature: e.target.value })}
          />
        </div>
      </div>
      <label className="mt-4 block text-sm font-medium">Why this item</label>
      <textarea
        className={`mt-2 ${areaClass}`}
        value={slot.itemWhy ?? ""}
        onChange={(e) => onChange({ itemWhy: e.target.value })}
      />
      {(() => {
        const training = slot.training ?? { sp: zeroSp(), why: "" };
        const used = sampleSpTotal(training.sp);
        const over = used > 66 || Object.values(training.sp).some((n) => n > 32);
        return (
          <div className="mt-6">
            <p className="text-sm font-medium">Training</p>
            <p className="mt-1 text-xs text-muted">66 Stat Points. Max 32 in one stat.</p>
            <div className="mt-3 grid grid-cols-3 gap-2 sm:grid-cols-6">
              {STAT_FIELDS.map((s) => (
                <label key={s.key} className="block text-xs text-muted">
                  {s.label}
                  <input
                    type="number"
                    min={0}
                    max={32}
                    className={`mt-1 ${inputClass} px-2 py-2 tabular-nums`}
                    value={training.sp[s.key] || ""}
                    onChange={(e) => {
                      const n = Math.max(0, Math.min(32, Number(e.target.value) || 0));
                      onChange({
                        training: { ...training, sp: { ...training.sp, [s.key]: n } },
                      });
                    }}
                  />
                </label>
              ))}
            </div>
            <p className={`mt-2 text-xs tabular-nums ${over ? "text-red-400" : "text-muted"}`}>
              {used} / 66
            </p>
            <textarea
              className={`mt-3 ${areaClass}`}
              placeholder="Why this spread"
              value={training.why}
              onChange={(e) => onChange({ training: { ...training, why: e.target.value } })}
            />
          </div>
        );
      })()}
      <p className="mt-5 text-sm font-medium">Best kit</p>
      <div className="mt-2 space-y-4">
        {(slot.moves.length ? slot.moves : emptySlot().moves).map((move, mi) => (
          <div key={mi} className="grid gap-2 rounded-2xl bg-white/5 p-3 sm:grid-cols-2">
            <input
              className={inputClass}
              placeholder="Move"
              value={move.name}
              onChange={(e) => {
                const moves = [...(slot.moves.length ? slot.moves : emptySlot().moves)];
                moves[mi] = { ...moves[mi], name: e.target.value };
                onChange({ moves });
              }}
            />
            <input
              className={inputClass}
              placeholder="Why"
              value={move.why}
              onChange={(e) => {
                const moves = [...(slot.moves.length ? slot.moves : emptySlot().moves)];
                moves[mi] = { ...moves[mi], why: e.target.value };
                onChange({ moves });
              }}
            />
          </div>
        ))}
      </div>
      <label className="mt-4 block text-sm font-medium">Objective</label>
      <textarea
        className={`mt-2 ${areaClass}`}
        value={slot.objective}
        onChange={(e) => onChange({ objective: e.target.value })}
      />
      <label className="mt-4 block text-sm font-medium">How to play</label>
      <textarea
        className={`mt-2 ${areaClass}`}
        value={slot.howToPlay}
        onChange={(e) => onChange({ howToPlay: e.target.value })}
      />
    </section>
  );
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
              onChange={(e) =>
                onChange(rows.map((x, j) => (j === i ? { ...x, into: e.target.value } : x)))
              }
            />
            <input
              className={inputClass}
              placeholder="You send"
              value={item.send}
              onChange={(e) =>
                onChange(rows.map((x, j) => (j === i ? { ...x, send: e.target.value } : x)))
              }
            />
            <Button type="button" variant="ghost" onClick={() => onChange(rows.filter((_, j) => j !== i))}>
              Remove
            </Button>
          </li>
        ))}
      </ul>
      <Button
        type="button"
        variant="line"
        className="mt-3"
        onClick={() => onChange([...rows, { into: "", send: "" }])}
      >
        Add switch
      </Button>
    </section>
  );
}

function PlanList({
  items,
  onChange,
  title = "How a game goes",
  hint = "Three beats. Goal, the play, then what happens next.",
}: {
  items: ManualPlanBeat[];
  onChange: (items: ManualPlanBeat[]) => void;
  title?: string;
  hint?: string;
}) {
  const rows = items.length ? items : [{ title: "", goal: "", play: "" }];
  return (
    <section className="mt-16">
      <h2 className="text-2xl font-semibold tracking-tight">{title}</h2>
      <p className="mt-1 text-xs text-muted">{hint}</p>
      <ul className="mt-4 space-y-4">
        {rows.map((item, i) => (
          <li key={i} className="rounded-3xl border border-line p-4">
            <p className="text-xs uppercase tracking-wide text-muted">Beat {i + 1}</p>
            <input
              className={`mt-2 ${inputClass}`}
              placeholder="Title — Lead"
              value={item.title}
              onChange={(e) =>
                onChange(rows.map((x, j) => (j === i ? { ...x, title: e.target.value } : x)))
              }
            />
            <input
              className={`mt-2 ${inputClass}`}
              placeholder="Goal"
              value={item.goal}
              onChange={(e) =>
                onChange(rows.map((x, j) => (j === i ? { ...x, goal: e.target.value } : x)))
              }
            />
            <textarea
              className={`mt-2 ${areaClass}`}
              placeholder="The play"
              value={item.play}
              onChange={(e) =>
                onChange(rows.map((x, j) => (j === i ? { ...x, play: e.target.value } : x)))
              }
            />
            <textarea
              className={`mt-2 ${areaClass}`}
              placeholder="Then…"
              value={item.next ?? ""}
              onChange={(e) =>
                onChange(rows.map((x, j) => (j === i ? { ...x, next: e.target.value } : x)))
              }
            />
            <Button
              type="button"
              variant="ghost"
              className="mt-2"
              onClick={() => onChange(rows.filter((_, j) => j !== i))}
            >
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
              onChange={(e) =>
                onChange(items.map((x, j) => (j === i ? { ...x, title: e.target.value } : x)))
              }
            />
            <textarea
              className={`mt-2 ${areaClass}`}
              placeholder="Body"
              value={item.body}
              onChange={(e) =>
                onChange(items.map((x, j) => (j === i ? { ...x, body: e.target.value } : x)))
              }
            />
            <Button
              type="button"
              variant="ghost"
              className="mt-2"
              onClick={() => onChange(items.filter((_, j) => j !== i))}
            >
              Remove
            </Button>
          </li>
        ))}
      </ul>
      <Button
        type="button"
        variant="line"
        className="mt-4"
        onClick={() => onChange([...items, { title: "", body: "" }])}
      >
        Add
      </Button>
    </section>
  );
}
