# Manual authoring AI prompt

Copy everything inside the fenced block below into ChatGPT / Claude / Cursor. Paste your team (Showdown export, notes, or VOD bullets) after the prompt. Ask for **JSON only** matching Ringside’s boxed `TeamManual` shape.

Default: **Pokémon Champions Singles** — registered six + preview packs of three. Keep `box.length === 6`.

Two first-class ways a six gets **versions** (both can appear on one manual):

1. **In-box modes** — same registered species, different kit (`roster[].modes` + pack `winconMode`). Example: Life Orb vs Scarf vs Mega Garchomp. Box does not change.
2. **Bench modules (flex swaps)** — off-box species replaces one core mon and **changes the team’s architecture**, not just the roster line. Still exactly 6 after swap: `construction.altSlots` + optional `modules[]` / `bench` + `packs[].requiresSwap`.

Flex alts are **not** a seventh registration slot.

**Mental model (evolved):** a bench Pokémon is a **strategic module** — e.g. Garchomp shifts the six toward autonomous conversion; Milotic toward reactive control; Ceruledge toward self-scaling. Author **what the six becomes**, not only “X replaces Y.”

**Do not** rate bench Pokémon with static 1–10 scores. Value is **relational** (which `insteadOf`, which architecture, which routes).

Hierarchy the app is moving toward:

```text
TEAM MANUAL
├── coreArchitecture (identity card)
├── registered six + roster
├── bench (modules) → architecture change → clocks / routes / loops
├── packages (playable bring-of-3/4)
└── benchDiagnostics (problem → recommended module)
```

Legacy path still valid: `altSlot → requiresSwap → pack`. Enrich with module metadata when you can.

---

## Paste-ready prompt

```
You are authoring a Ringside field manual for Pokémon Champions Singles.

GOAL
Produce one boxed TeamManual JSON a pilot can open and play from. The page is:
registered six + bench alts → paste-ready sets → packages of three → package guide.
Prefer short actionable lines. Use TODO: … when you lack a fact — do not invent lore or ladder win rates.

CHAMPIONS TRAINING (required on every roster slot and flex `slot`)
- Regulation uses **66 Stat Points** total, **max 32 in any one stat**, level 50.
- For each Pokémon author: **nature** (with one-line rationale), **training** via six integers HP/Atk/Def/SpA/SpD/Spe summing to ≤66, plus `label`, `why`, `spend[]`, and `rule` (e.g. “recommended starting spread — verify on device”).
- **Recommend a spread** from the kit’s job (speed control, bulk, max offense, etc.). Do not leave nature blank on the registered six. Use `TODO` only for item/ability/move when unknown — for SP, still propose a **recommended** spread and mark caveat in `training.why` if unverified.
- Optional: `exportEvs` / `ivsNote` when translating from Showdown; never invent calced speed tiers unless sourced.

HARD RULES
1. Registered six stays exactly 6 unique species. Never put flex mons on `box`.
2. Every set is paste-ready: item, ability, **nature**, **recommended Champions SP spread** (see above), 4 moves with { name, why }.
3. Packs are bring-of-three from the *active* six (core box, or box after a flex swap). If format is "doubles", packs are bring-of-four and you must fill engines / controlPlanes / previewTrees / matchupScripts / ledger (see Doubles section after this prompt).
4. TWO version systems — both first-class; do not collapse them:
   a) In-box MODE: same slug, different kit → roster[i].modes[] + pack.winconMode = mode.id
   b) Bench module / flex SWAP: different species → altSlots[] (+ module metadata) + pack.requiresSwap { out, in }
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
- coreArchitecture (optional but recommended for modular teams) — identity card for the **default** registered six:
  identity, primaryEngine, conversionModel, scalingModel, controlModel, speedModel, resourceModel, threatProfile[]
- clocks[] (optional) — competing clocks: { id, owner[], speed, goal } (immediate / tempo / scaling / reactive / resource)
- winRoutes[] (optional) — how you **get** to a win (distinct from endgames = final state):
  { id, name, requires[], sequence[], finish, failurePoint?, dependencies? }
- failureRoutes[] (optional) — if Plan A dies: { failedRoute, why, fallback, nextRoute }
- Team loops (optional typed): keep flat loops[] OR use { id, type, title, body, trigger?, sequence?, payoff? }
  types: infrastructure | conversion | counterplay | resource | scaling

B. Roster (exactly the six on box)
For each slug:
- job, literacy?, primaryJob, role, objective, howToPlay
- moves[4]: { name, why } — why = what the click does for THIS team
- item, ability, nature (required), training { sp: { hp, atk, def, spa, spd, spe }, label, why, spend[], rule } — recommended 66 SP spread, not blank
- gives[] / answers[] if known
IN-BOX MODES (first-class — do not skip if the paste or notes show multiple items/sets for one species):
- If Mega vs Scarf vs Sash vs LO (or any preview-changing kit) on the SAME slug:
  modes[]: { id, label, job, when, item, itemWhy?, nature?, moves[4], objective?, howToPlay? }
- Default item/moves stay the teaching baseline; modes are the decision tree.
- Every mode.id MUST be used by ≥1 pack via winconMode (and strategy.winconMode).

C. Endgames vs win routes
construction.endgames[]: { id, label, path, how } — **destinations** (what the final board looks like).
winRoutes[] (team or module): **paths** to those destinations (Tailwind → immediate conversion, Fake Out → free attack, etc.).
Link packs via endgameIds and/or winRoute ids. Route dependencies (optional): which slugs are critical vs supportive per route (RDI / “if X dies, which routes vanish?”).

D. Core packages (legal on default six, no requiresSwap)
For each pack:
- id, label, when (preview trigger), identity, contrast? (vs sibling packs)
- slugs[3] ⊆ box (4 for doubles)
- winconMode? — REQUIRED if this bring assumes a non-default SlotMode
- identityCard (optional, recommended): compact machine-readable bring shape:
  engine[], connector[], converter[], scaler[], control[], winCondition, clock, commitment, autonomy, triggerBreadth
- pilotDecision (optional, recommended): chooseWhen[], avoidWhen[], previewQuestion, primaryMistake
- strategy: opponentPattern, purpose, targets[], refuses[], winCondition,
  gamePlan (Break → Control → Finish), mantra?, turnChecklist? (≤5), defaultLead?
- roles[]: { slug, macro, micro }
- 2–4 loops and/or lead/mid/late flows — only real decisions (loops may include type: infrastructure | conversion | counterplay | resource | scaling)
- endgameIds, optional winRouteIds[]
- MATCHUPS for this pack (do not omit):
  victims[]  { name, why, slug?, play?, trap? } — boards / mons you like
  counters[] { name, why, slug?, play?, trap? } — boards that punish this bring
  advantages[] { title, body } — soft edges
- coverageNotes? typed holes this three covers
- hazards[] pack-specific traps if they differ from team hazards

E. Bench modules (flex swaps) — strategic transformation, not just a species swap
For each bench Pokémon that replaces a core mon:

  construction.altSlots[] (required for validation today):
  - slug (NOT on box), insteadOf (REQUIRED)
  - why, answers, costs, unlocks[] pack ids
  - slot? paste-ready set (same fields as roster slot; may include modes)
  - module (optional, recommended):
      identity, strategicRole, adds[], removes[], changes[] (e.g. threatProfile, conversion speed)
  - architectureChange (optional): { from, to } — e.g. "Conversion Network → Autonomous Conversion Network"
  - useWhen[] / avoidWhen[] (optional) — preview triggers for this module

  modules[] (optional layer — groups swap + architecture + package ids):
  - { id, type: "bench-module", requiresSwap { out, in }, architecture?, packages[] }

  bench (optional root — UI-facing):
  - purpose (one line), slots[]: { slug, insteadOf, category, priority?, useWhen[], avoidWhen[], changesArchitecture, moduleId? }

  replacementRelationships[] (optional): { out, in, preserves[], adds[], loses[], changes[] }

HARD (unchanged): every alt MUST unlock ≥1 package. Every such package MUST set
  requiresSwap: { out: insteadOf, in: alt.slug }.
Bring ⊆ active six (box with out→in). Still exactly 6 after swap.
When a module activates, author (or TODO) module-specific clocks / winRoutes / loops if they differ from core.
strategy.contrast + pilotDecision.avoidWhen: what the default six cannot run; when NOT to bench this mon.

F. Bench diagnostics (optional, recommended for modular teams)
benchDiagnostics[]: problem → symptoms[] → recommendedModules[] (module ids or slug labels).
Teach **“what problem am I seeing?”** not **“Garchomp or Sylveon?”**

G. Team-level matchups (always author — TODO lines ok, empty arrays not preferred)
- victims / counters / advantages — six-wide defaults (packs inherit if they omit)
- hazards[] — pilot traps (weather clash, Mega choice, Choice lock, Rocks greed, etc.)

H. Evidence optional
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
      "nature": "Modest",
      "training": {
        "sp": { "hp": 2, "atk": 0, "def": 0, "spa": 32, "spd": 0, "spe": 32 },
        "label": "Modest max SpA / Spe",
        "why": "Recommended starting spread for this kit's job — verify on device.",
        "spend": ["2 HP", "32 SpA", "32 Spe"],
        "rule": "66 SP max 32 per stat; recommended, not claimed optimal."
      },
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
  "coreArchitecture": {
    "identity": "",
    "primaryEngine": "",
    "conversionModel": "",
    "scalingModel": "",
    "controlModel": "",
    "speedModel": "",
    "resourceModel": "",
    "threatProfile": []
  },
  "clocks": [{ "id": "", "owner": [], "speed": "", "goal": "" }],
  "winRoutes": [
    {
      "id": "",
      "name": "",
      "requires": [],
      "sequence": [],
      "finish": "",
      "failurePoint": "",
      "dependencies": [{ "slug": "", "importance": "critical|supportive" }]
    }
  ],
  "failureRoutes": [
    { "failedRoute": "", "why": "", "fallback": "", "nextRoute": "" }
  ],
  "bench": {
    "purpose": "",
    "slots": [
      {
        "slug": "",
        "insteadOf": "",
        "category": "",
        "priority": "high|medium|low",
        "useWhen": [],
        "avoidWhen": [],
        "changesArchitecture": true,
        "moduleId": ""
      }
    ]
  },
  "modules": [
    {
      "id": "",
      "type": "bench-module",
      "requiresSwap": { "out": "", "in": "" },
      "architecture": "",
      "packages": []
    }
  ],
  "benchDiagnostics": [
    {
      "problem": "",
      "symptoms": [],
      "recommendedModules": []
    }
  ],
  "replacementRelationships": [
    {
      "out": "",
      "in": "",
      "preserves": [],
      "adds": [],
      "loses": [],
      "changes": []
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
        "architectureChange": { "from": "", "to": "" },
        "useWhen": [],
        "avoidWhen": [],
        "module": {
          "identity": "",
          "strategicRole": "",
          "adds": [],
          "removes": [],
          "changes": []
        },
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
      "winRouteIds": [],
      "identityCard": {
        "engine": [],
        "connector": [],
        "converter": [],
        "scaler": [],
        "control": [],
        "winCondition": "",
        "clock": "",
        "commitment": "",
        "autonomy": "",
        "triggerBreadth": ""
      },
      "pilotDecision": {
        "chooseWhen": [],
        "avoidWhen": [],
        "previewQuestion": "",
        "primaryMistake": ""
      },
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
      "loops": [
        {
          "id": "",
          "type": "infrastructure|conversion|counterplay|resource|scaling",
          "title": "",
          "body": "",
          "trigger": "",
          "sequence": [],
          "payoff": ""
        }
      ],
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
Optional v2 fields (coreArchitecture, bench, modules, …) may be omitted until the UI reads them — still author them for modular teams when material exists.
Doubles: keep architecture[] as three skim layers (Engine / Converter / Endgame) **in addition to** coreArchitecture when both help.

VALIDATION CHECKLIST (self-check before answering)
□ box has 6 unique legal slugs; no flex slug on box
□ every roster slug ∈ box; moves use { name, why }; every slot has nature + training.sp (≤66, no stat >32) with recommended spread + why
□ every roster.modes[].id is referenced by ≥1 pack.winconMode (and strategy.winconMode)
□ every pack.winconMode exists as SlotMode.id on a species in that pack’s bring
□ every core pack bring ⊆ box
□ every altSlots entry has insteadOf ∈ box, why, and ≥1 pack with requiresSwap { out: insteadOf, in: slug }
□ every requiresSwap pack bring ⊆ active six (box with out→in)
□ team has victims AND counters (or explicit TODO in those arrays’ why fields)
□ packs whose targets differ from the six have their own victims/counters
□ packages have when + winCondition + at least one refuse
□ no invented numbers; TODOs labeled
□ modular teams: each altSlot has module OR architectureChange OR replacementRelationships entry (TODO ok)
□ modular teams: ≥1 benchDiagnostic OR pilotDecision on swap packs (problem → module, not “pick a mon”)
□ winRoutes/endgames: routes describe path; endgames describe destination — do not duplicate blindly
□ no numeric synergy/coverage/flexibility scores on Pokémon

USER MATERIAL FOLLOWS
(Paste Showdown export, notes, package ideas, or “interview me”.)
```

---

## Schema cheat sheet (app)

| Version of the six | Fields | Active registration |
| --- | --- | --- |
| Core | `box`, `roster` | 6 slugs |
| Identity card | `coreArchitecture` | Describes default six’s strategic personality |
| In-box mode | `roster[].modes[]` + `packs[].winconMode` | Same 6; kit overlay via `slotsForPack` |
| Bench module | `altSlots` + `module` / `architectureChange` + `modules[]` / `bench` | Same 6 after swap; **architecture** may change |
| Flex swap (wire) | `construction.altSlots` + `packs[].requiresSwap` | `resolveActiveBox` (still 6) |
| Module → packages | `modules[].packages[]` → `packs[].id` | Layer between swap and playable bring |
| Core pack | `packs[]` without `requiresSwap` | `box` |
| Swap pack | `packs[]` with `requiresSwap` | swapped six; bring may include `in` |
| Win path | `winRoutes[]` + pack `winRouteIds` | How you get there |
| Win state | `construction.endgames[]` + pack `endgameIds` | Final board / closer |
| Clocks | `clocks[]` | Competing time horizons (immediate / tempo / scaling) |
| Failure | `failureRoutes[]` | Plan A denied → Plan B |
| Ladder help | `benchDiagnostics[]` | Symptom → recommended module |
| Package teach | `identityCard` + `pilotDecision` on `packs[]` | Preview/ladder decisions |
| Matchups | `victims` / `counters` / `advantages` / `hazards` | Pack overrides team via `resolveManual` |

**Evolution (keep legacy working):**

```text
CURRENT          altSlot → requiresSwap → pack

PROPOSED         altSlot → strategic module → architecture change
                      → clocks / winRoutes / loops (module-specific)
                      → unlocked packages → pilotDecision
```

See `src/content/manuals.ts` (`SlotMode`, `ManualAltSlot`, `ManualPack`, …). TypeScript may lag the prompt; optional JSON fields are forward-compatible.

### Priority additions (author these first on modular teams)

| Priority | Field | Purpose |
| --- | --- | --- |
| 1 | `modules[]` + enriched `altSlots.module` | Bench as strategic modules |
| 2 | `coreArchitecture` | What the team **is** (default six) |
| 3 | `winRoutes[]` | Paths distinct from `endgames` |
| 4 | `clocks[]` | Competing clocks on the board |
| 5 | `failureRoutes[]` | Dead-loss resistance |
| 6 | `replacementRelationships[]` | Gain/lose/preserve per swap |
| 7 | `packs[].identityCard` | Compact package architecture |
| 8 | `packs[].pilotDecision` + `benchDiagnostics[]` | Problem → solution, not encyclopedia |

**Avoid:** per-Pokémon numeric rating tables (synergy 9/10, etc.). Use relationships, routes, and architecture change instead.

---

## Doubles (bring 4) — six-chapter shape

Same `TeamManual` type. Set `"format": "doubles"`. Bring width is `FORMAT_BRING.doubles` = 4.

The reader has **six chapters**. Do not 1-1 map a long essay into page sections. Distill.

| Chapter | Fields | Copy budget |
| --- | --- | --- |
| Thesis (header) | `pilot.thesis` (pull quote), `philosophy` ≤80 words, value chips via short `press` or lede | One quote |
| Architecture | `coreArchitecture` identity card; optional `clocks[]`, `winRoutes[]`, `failureRoutes[]` | Default six personality |
| Bench | `bench` / `modules[]` / enriched `altSlots`; `benchDiagnostics[]` | Module → architecture change |
| The six | `architecture[]` (3 skim layers), `roster[].primaryJob` + `networkJobs`, dead-loss via `gives` | Visual, not essays |
| Sets | Full kit + `training.sp` (66 / max 32) + optional `opening[]` asks | Per-mon theater |
| How it wins | `engines[]` (recipes) + `commandments[]` (≤5 one-liners) | **Meat:** each engine teaches setup → conversion → fail → recovery |
| Network | `network.thesis` + `network.edges[]` `{ from, to, creates, converts, engineId? }` | One line per edge |
| Packages | Packs of 4: `identityCard`, `pilotDecision`, short `strategy`, **meaty** typed `loops`, `flows`, `engineIds` | Goal short; loops carry the teach |

HARD (in addition to the singles rules)

1. Packs are bring-of-four from the active six. `slugs.length === 4` and `strategy.bring` matches.
2. Complete kits: `item`, `ability`, **nature (required)**, `moves[4].name`+`why`, Champions **`training.sp`** (66 total / max 32 per stat) with **recommended spread + label/why/spend/rule** — team builder must propose nature and SP even when items are TODO. Optional `exportEvs` for provenance.
3. Doubles extras when the source has them:
   - `engines[]` — win recipes (see **How it wins meat** below)
   - `network` — conversion graph (not ASCII)
   - `commandments[]` — five house rules as strings
   - `controlPlanes[]` — freeform id string (fake-out, grassy, coaching, …)
   - `matchupScripts[]` — few pills that select a pack (e.g. Rain → Pack A); optional
   - `megaPool`, `construction.altSlots` (bench), `ledger.laterTests`
4. Slot extras: `abilityStages`, `ampTargets`, `itemLoop`, `networkJobs`, `opening` (3–5 asks on Sets only).
5. Pack extras: `engineIds`, **2–4 meaty `loops` per pack** (see **Recipes you repeat** below), `flows`, optional `defaultLeadPair`. **Do not invent** T1 pairs or speed-calced SP.
6. Anti-redundancy: Fake Out / Sand / Coaching / Nasty Plot appear as a kit click **or** an engine path **or** a pack loop beat — never paste the same essay into all three. Engines own team-level win paths; pack `loops` own **bring-specific** repeatable plays. Packs link engines via `engineIds` only.
7. No emoji. Catalog slugs only.

### How it wins meat (`engines[]`)

Minimum **3** distinct engines (e.g. Sand Rush, Coaching scale, Tailwind / Icy Wind). Optional 4th–5th only if genuinely different.

For **each** engine require:

| Field | Requirement |
| --- | --- |
| `id`, `label` | Stable id + shoutable name |
| `path[]` | **4–7** ordered beats (`Who · click`), not 2 vague words |
| `how` | **4–6 sentences**: what resource is created → how it converts into damage/position → when you press it → what denies it |
| `dependsOn` | What must be true on the board |
| `disrupt` | How the opponent stops it |
| `fallback` | What you do next if denied |

`commandments[]` stay ≤5 one-liners under How it wins.

### Recipes you repeat (`packs[].loops[]`)

For **every** pack, require **2–4** loops (not 0–1). These render as “Recipes you repeat.”

Each loop:

| Field | Requirement |
| --- | --- |
| `title` | Named play the pilot can shout mid-game |
| `body` | Multi-sentence recipe the UI can split into steps |

`body` structure (required):

1. **First sentence = when** — start with `If…` / `When…` / `Use when…`
2. **Following sentences = ordered beats** — mon + click + why that beat matters
3. **Close** with the board state you want after the recipe

Pack loops must be **specific to that four** (e.g. Sand+Excadrill lead vs Coaching into Corv midgame). Do **not** copy the team engine `how` verbatim — reference via `engineIds` and add pack-specific timing/partners.

Keep pack `strategy.purpose` / `mantra` / `winCondition` short (one goal line each). The meat lives in engines + loops, not a third essay.

VALIDATION
□ every pack has exactly 4 unique slugs ⊆ active six
□ SP ≤ 66 and no stat > 32 when training is filled
□ network from/to ⊆ box (or flex)
□ every matchupScript.packId exists
□ every engine has path (4–7), how (4–6 sentences), dependsOn, disrupt, fallback
□ every pack has 2–4 loops; each loop body starts with If/When/Use when
□ local drafts may omit previewTrees / ledger — omit empties on the page

---

## Paste-ready: doubles meat (Tyranitar / sand / any six)

Copy into a team-builder AI after your six + notes:

```
You are filling a Ringside Champions DOUBLES field manual (format: "doubles", bring 4).

HOW IT WINS — MEAT REQUIRED
Author ≥3 engines. For each engine:
- path[]: 4–7 ordered beats ("Tyranitar · Sand Stream", "Excadrill · Earthquake", …)
- how: 4–6 sentences covering create → convert → when to press → what denies
- dependsOn, disrupt, fallback — all required, one line each
Do not write one-liner engines. Do not write novels — teach the win path.

RECIPES YOU REPEAT — MEAT REQUIRED (every pack)
Each pack needs 2–4 loops { title, body }.
body MUST:
1. Start with If… / When… / Use when… (the trigger)
2. Then ordered beats: mon + click + why
3. End with the board state you want
Loops are pack-specific plays for THAT four. Link team engines with engineIds — do not paste engine.how into loop.body.

Keep strategy.purpose / mantra / winCondition to one short line each.
Anti-redundancy: kit why OR engine OR loop beat — not the same paragraph three times.

BENCH / MODULAR (when the six has flex)
- coreArchitecture: identity card for the default six
- altSlots: module { adds, removes, changes }, architectureChange { from, to }
- benchDiagnostics: problem → symptoms → recommendedModules
- winRoutes vs construction.endgames (path vs destination)
- failureRoutes: failedRoute → fallback → nextRoute
- packs: identityCard + pilotDecision (chooseWhen / avoidWhen / previewQuestion / primaryMistake)
- No numeric Pokémon rating tables

NATURE + SP: every roster and flex slot needs a recommended nature and 66 SP spread (max 32 per stat) with training.label/why/spend/rule — not omitted.
JSON only. Catalog slugs. TODO for unknown items/moves only when necessary. No emoji.
```

