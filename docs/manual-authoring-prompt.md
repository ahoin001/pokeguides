# Manual authoring AI prompt

Copy everything inside the fenced block below into ChatGPT / Claude / Cursor. Paste your team (Showdown export, notes, or VOD bullets) after the prompt. Ask for **JSON only** matching Ringside’s boxed `TeamManual` shape.

Default: **Pokémon Champions Singles** — registered six + preview packs of three. Keep `box.length === 6`.

Two first-class ways a six gets **versions** (both can appear on one manual):

1. **In-box modes** — same registered species, different kit (`roster[].modes` + pack `winconMode`). Example: Life Orb vs Scarf vs Mega Garchomp. Box does not change.
2. **Flex swaps** — off-box species replaces one core mon (`construction.altSlots` + pack `requiresSwap`). Creates a new **active six** of still exactly 6. Example: drop Primarina, bring Hippowdon, unlock sand packs.

Flex alts are **not** a seventh registration slot.

---

## Paste-ready prompt

```
You are authoring a Ringside field manual for Pokémon Champions Singles.

GOAL
Produce one boxed TeamManual JSON a pilot can open and play from. The page is:
registered six + bench alts → paste-ready sets → packages of three → package guide.
Prefer short actionable lines. Use TODO: … when you lack a fact — do not invent lore, ladder stats, or EV spreads.

HARD RULES
1. Registered six stays exactly 6 unique species. Never put flex mons on `box`.
2. Every set is paste-ready: item, ability, nature, EVs (or TODO), 4 moves with { name, why }.
3. Packs are bring-of-three from the *active* six (core box, or box after a flex swap). If format is "doubles", packs are bring-of-four and you must fill engines / controlPlanes / previewTrees / matchupScripts / ledger (see Doubles section after this prompt).
4. TWO version systems — both first-class; do not collapse them:
   a) In-box MODE: same slug, different kit → roster[i].modes[] + pack.winconMode = mode.id
   b) Flex SWAP: different species → altSlots[] + pack.requiresSwap { out, in }
   A pack may use both (swap the six, then pick a mode on a remaining mon).
5. No mode without a package that sets winconMode. No flex alt without a package that sets requiresSwap.
6. Matchups are required, not optional flavor. Team-level defaults + pack-level when the bring’s threats differ.
7. One idea per line. Pilot language: “If X, then Y.”
8. Output a single JSON object only — no markdown outside JSON.

ALLOWED IDS
- format: "singles" | "doubles"
- archetype: balance | hyper-offense | trick-room | rain | sun | grassy
- family: clock | kite | weather | terrain | room
- job (RoleId): support | breaker | speed | weather | mega
- literacy: sweeper | wall | disruptor | wallbreaker | pivot | setter

INTERVIEW ORDER (ask only what’s missing; otherwise extract from paste)

A. Six identity
- title (page heading). Optional lede = one-line index-card blurb (not shown on the manual page).
- archetype + family from the allowed lists (TODO if unknown)
- construction.thesis / method / winCondition (one line each)

B. Roster (exactly the six on box)
For each slug:
- job, literacy?, primaryJob, role, objective, howToPlay
- moves[4]: { name, why } — why = what the click does for THIS team
- item, ability, nature, training/EVs or TODO
- gives[] / answers[] if known
IN-BOX MODES (first-class — do not skip if the paste or notes show multiple items/sets for one species):
- If Mega vs Scarf vs Sash vs LO (or any preview-changing kit) on the SAME slug:
  modes[]: { id, label, job, when, item, itemWhy?, nature?, moves[4], objective?, howToPlay? }
- Default item/moves stay the teaching baseline; modes are the decision tree.
- Every mode.id MUST be used by ≥1 pack via winconMode (and strategy.winconMode).

C. Endgames (six-level)
construction.endgames[]: { id, label, path, how }
Packs link via endgameIds.

D. Core packages (legal on default six, no requiresSwap)
For each pack:
- id, label, when (preview trigger), identity, contrast? (vs sibling packs)
- slugs[3] ⊆ box
- winconMode? — REQUIRED if this bring assumes a non-default SlotMode
- strategy: opponentPattern, purpose, targets[], refuses[], winCondition,
  gamePlan (Break → Control → Finish), mantra?, turnChecklist? (≤5), defaultLead?
- roles[]: { slug, macro, micro }
- 2–4 loops and/or lead/mid/late flows — only real decisions
- endgameIds
- MATCHUPS for this pack (do not omit):
  victims[]  { name, why, slug?, play?, trap? } — boards / mons you like
  counters[] { name, why, slug?, play?, trap? } — boards that punish this bring
  advantages[] { title, body } — soft edges
- coverageNotes? typed holes this three covers
- hazards[] pack-specific traps if they differ from team hazards

E. Flex swaps → new active six → packages (first-class — do not skip if the player ever substitutes)
For each core mon that is ever replaced off the registered six:
  construction.altSlots[]:
  - slug (NOT on box)
  - insteadOf (REQUIRED — the core slug replaced)
  - why, answers (what you gain), costs (what you lose)
  - unlocks[] pack ids this flex enables
  - slot? paste-ready set (same fields as roster slot; may include modes)
HARD: every alt MUST unlock ≥1 package. Every such package MUST set
  requiresSwap: { out: insteadOf, in: alt.slug }
Bring ⊆ resolveActiveBox (box with out→in). Still exactly 6 after swap.
Write strategy + matchups + flows as if this were a different registered six.
strategy.contrast: what the default six cannot run that this swap enables.
refuses: when NOT to take the swap.

F. Team-level matchups (always author — TODO lines ok, empty arrays not preferred)
- victims / counters / advantages — six-wide defaults (packs inherit if they omit)
- hazards[] — pilot traps (weather clash, Mega choice, Choice lock, Rocks greed, etc.)

G. Evidence optional
season / asOf / source / caveat — mark unproven claims.

OUTPUT SHAPE (omit unused optional fields; keep required roots)

{
  "id": "kebab-id",
  "title": "",
  "lede": "",
  "format": "singles",
  "philosophy": "",
  "archetype": "balance",
  "family": "weather",
  "meta": "",
  "box": ["s1","s2","s3","s4","s5","s6"],
  "core": ["s1","s2","s3"],
  "roster": [
    {
      "slug": "",
      "title": "",
      "job": "breaker",
      "literacy": "wallbreaker",
      "role": "",
      "primaryJob": "",
      "item": "",
      "ability": "",
      "nature": "",
      "moves": [{ "name": "", "why": "" }],
      "objective": "",
      "howToPlay": "",
      "modes": [
        {
          "id": "slug-scarf",
          "label": "",
          "job": "",
          "when": "",
          "item": "",
          "moves": [{ "name": "", "why": "" }]
        }
      ]
    }
  ],
  "construction": {
    "thesis": "",
    "method": "",
    "winCondition": "",
    "endgames": [{ "id": "", "label": "", "path": "", "how": "" }],
    "altSlots": [
      {
        "slug": "",
        "insteadOf": "",
        "why": "",
        "answers": "",
        "costs": "",
        "unlocks": ["pack-id"],
        "slot": {
          "title": "",
          "job": "breaker",
          "role": "",
          "moves": [{ "name": "", "why": "" }],
          "objective": "",
          "howToPlay": "",
          "item": "",
          "ability": "",
          "nature": ""
        }
      }
    ]
  },
  "packs": [
    {
      "id": "pack-a",
      "label": "",
      "when": "",
      "identity": "",
      "slugs": ["","",""],
      "winconMode": "",
      "requiresSwap": { "out": "", "in": "" },
      "endgameIds": [],
      "strategy": {
        "opponentPattern": "",
        "bring": ["","",""],
        "purpose": "",
        "targets": [],
        "refuses": [],
        "winCondition": "",
        "gamePlan": "",
        "mantra": "",
        "contrast": "",
        "turnChecklist": [],
        "winconMode": ""
      },
      "roles": [{ "slug": "", "macro": "", "micro": "" }],
      "loops": [{ "title": "", "body": "" }],
      "flows": [
        { "id": "lead", "title": "Lead", "forks": [{ "id": "lead-0", "when": "", "then": "" }] }
      ],
      "victims": [{ "name": "", "why": "", "play": "", "trap": "" }],
      "counters": [{ "name": "", "why": "", "play": "", "trap": "" }],
      "advantages": [{ "title": "", "body": "" }],
      "hazards": [{ "title": "", "body": "" }]
    }
  ],
  "victims": [{ "name": "", "why": "" }],
  "counters": [{ "name": "", "why": "" }],
  "advantages": [{ "title": "", "body": "" }],
  "slugs": ["","",""],
  "slots": [],
  "phases": [],
  "loops": [],
  "hazards": [{ "title": "", "body": "" }]
}

Notes: omit requiresSwap on core packs; omit winconMode when the default kit is correct.
set slugs/slots to the first pack’s bring; the app overlays packs via resolveManual.

VALIDATION CHECKLIST (self-check before answering)
□ box has 6 unique legal slugs; no flex slug on box
□ every roster slug ∈ box; moves use { name, why }; EVs TODO if unknown
□ every roster.modes[].id is referenced by ≥1 pack.winconMode (and strategy.winconMode)
□ every pack.winconMode exists as SlotMode.id on a species in that pack’s bring
□ every core pack bring ⊆ box
□ every altSlots entry has insteadOf ∈ box, why, and ≥1 pack with requiresSwap { out: insteadOf, in: slug }
□ every requiresSwap pack bring ⊆ active six (box with out→in)
□ team has victims AND counters (or explicit TODO in those arrays’ why fields)
□ packs whose targets differ from the six have their own victims/counters
□ packages have when + winCondition + at least one refuse
□ no invented numbers; TODOs labeled

USER MATERIAL FOLLOWS
(Paste Showdown export, notes, package ideas, or “interview me”.)
```

---

## Schema cheat sheet (app)

| Version of the six | Fields | Active registration |
| --- | --- | --- |
| Core | `box`, `roster` | 6 slugs |
| In-box mode | `roster[].modes[]` + `packs[].winconMode` | Same 6; kit overlay via `slotsForPack` |
| Flex swap | `construction.altSlots` + `packs[].requiresSwap` | `resolveActiveBox` (still 6) |
| Core pack | `packs[]` without `requiresSwap` | `box` |
| Swap pack | `packs[]` with `requiresSwap` | swapped six; bring may include `in` |
| Matchups | `victims` / `counters` / `advantages` / `hazards` | Pack overrides team via `resolveManual` |

See `src/content/manuals.ts` (`SlotMode`, `ManualAltSlot`, `ManualPack`, `ManualMatchup`, `SlotManual`).

---

## Doubles (bring 4) — six-chapter shape

Same `TeamManual` type. Set `"format": "doubles"`. Bring width is `FORMAT_BRING.doubles` = 4.

The reader has **six chapters**. Do not 1-1 map a long essay into page sections. Distill.

| Chapter | Fields | Copy budget |
| --- | --- | --- |
| Thesis (header) | `pilot.thesis` (pull quote), `philosophy` ≤80 words, value chips via short `press` or lede | One quote |
| The six | `architecture[]` (3 layers), `roster[].primaryJob` + `networkJobs`, dead-loss via `gives` | Visual, not essays |
| Sets | Full kit + `training.sp` (66 / max 32) + optional `opening[]` asks | Per-mon theater |
| How it wins | `engines[]` (recipes) + `commandments[]` (≤5 one-liners) | Sequences, not novels |
| Network | `network.thesis` + `network.edges[]` `{ from, to, creates, converts, engineId? }` | One line per edge |
| Packages | Packs of 4: `strategy.purpose` (goal), `loops`, `flows`, `engineIds` link — do not copy engine essays | Active pack only |

HARD (in addition to the singles rules)

1. Packs are bring-of-four from the active six. `slugs.length === 4` and `strategy.bring` matches.
2. Complete kits: `item`, `ability`, `nature`, `moves[4].name`+`why`, Champions `training.sp` (66 budget / max 32). Optional `exportEvs` for provenance.
3. Doubles extras when the source has them:
   - `engines[]` — win recipes `{ id, label, path[], how }`
   - `network` — conversion graph (not ASCII)
   - `commandments[]` — five house rules as strings
   - `controlPlanes[]` — freeform id string (fake-out, grassy, coaching, …)
   - `matchupScripts[]` — few pills that select a pack (e.g. Rain → Pack A); optional
   - `megaPool`, `construction.altSlots` (bench), `ledger.laterTests`
4. Slot extras: `abilityStages`, `ampTargets`, `itemLoop`, `networkJobs`, `opening` (3–5 asks on Sets only).
5. Pack extras: `engineIds`, `sequence[]`, optional `defaultLeadPair`. **Do not invent** T1 pairs or speed-calced SP.
6. Anti-redundancy: Fake Out / Nasty Plot live in Sets **or** an engine path — never both as essays. Packs link via `engineIds`.
7. No emoji. Catalog slugs only.

VALIDATION
□ every pack has exactly 4 unique slugs ⊆ active six
□ SP ≤ 66 and no stat > 32 when training is filled
□ network from/to ⊆ box (or flex)
□ every matchupScript.packId exists
□ local drafts may omit previewTrees / ledger / engines — omit empties on the page

