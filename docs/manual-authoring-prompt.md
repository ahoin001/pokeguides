# Manual authoring AI prompt

Copy the **paste-ready** block that matches the format you are building.

- **Doubles (bring 4):** use the dedicated template → [manual-authoring-prompt-doubles.md](./manual-authoring-prompt-doubles.md) (schema enrichment + wow fields live there).
- **Singles (bring 3):** paste-ready block below.

Paste your team (Showdown export, notes, or VOD bullets) after the prompt. Ask for **JSON only** matching Ringside’s boxed `TeamManual` shape.

**Theory reference:** [team-building-architecture.md](./team-building-architecture.md) — strategy-generator sixes, MAG / WRA / OACR, engines vs converters, packages as mini-teams, bench as modules.

**How this doc is organized**

1. **Shared** — registration, flex, kits, hierarchy (both formats)
2. **Paste-ready Singles** — default block below (`format: "singles"`, bring 3)
3. **Singles meat** — engines / network / `leadPlan` / roles (required for rich Singles UI)
4. **Doubles** — summary + pointer to the dedicated doubles prompt (do not author doubles from the Singles block)

Do **not** put Doubles-only fields (`fieldPlan`, leadPair, backPair, seats, protectEconomy) on Singles manuals. Do **not** omit Singles `leadPlan` / roles / engines when you want How-it-wins / Network / Lead & clock chapters.

Default paste target below: **Pokémon Champions Singles** — registered six + preview packs of three. Keep `box.length === 6`.

Two first-class ways a six gets **versions** (both can appear on one manual):

1. **In-box modes** — same registered species, different kit (`roster[].modes` + pack `winconMode`). Example: Life Orb vs Scarf vs Mega Garchomp. Box does not change.
2. **Bench modules (flex swaps)** — off-box species replaces one core mon and **changes the team’s architecture**, not just the roster line. Still exactly 6 after swap: `construction.altSlots` + optional `modules[]` / `bench` + `packs[].requiresSwap`.

Flex alts are **not** a seventh registration slot.

**Tournament reality (UI + authoring):**

```text
REGISTERED SIX  ← what you lock for matchmaking / a tournament run
      │
      ├── CORE PACKAGES (no requiresSwap)
      │     bring-of-3 (singles) or bring-of-4 (doubles) from this six
      │     each pack.when = when to pick this bring
      │
      └── BENCH SWAP CARDS (altSlots)
            why / useWhen / avoidWhen / architectureChange
                  │
                  ▼ click a swap
            SWAPPED ACTIVE SIX (still 6)
                  │
                  └── SWAP PACKAGES (requiresSwap { out, in })
                        only shown after that swap is active
```

Do **not** dump every package from every bench mon onto one screen. Core packages teach the registered six. Swap packages appear only after the pilot chooses that module.

**Mental model:** a bench Pokémon is a **strategic module** — e.g. Garchomp shifts the six toward autonomous conversion. Author **what the six becomes**, not only “X replaces Y.”

**Do not** rate bench Pokémon with static 1–10 scores. Value is **relational** (which `insteadOf`, which architecture, which routes).

Hierarchy:

```text
TEAM MANUAL
├── coreArchitecture (identity of the REGISTERED six)
├── engines + network + commandments  ← How it wins / Network (both formats)
├── registered six + roster
├── core packages (bring from box only)
├── bench swap cards → architecture change
│     └── swap packages (bring from active six after out→in)
└── benchDiagnostics (problem → recommended module)
```

Legacy path still valid: `altSlot → requiresSwap → pack`. Enrich with module metadata when you can.

---

## Paste-ready prompt (Singles)

```
You are authoring a Ringside field manual for Pokémon Champions Singles.

GOAL
Produce one boxed TeamManual JSON a pilot can open and play from. The page is:
registered six → packages of three FROM that six → How it wins / Network → Sets → Guide (roles + lead clock) → bench swap cards → (after a swap) packages for the new active six.
Prefer short actionable lines. Use TODO: … when you lack a fact — do not invent lore or ladder win rates.

CHAMPIONS TRAINING (required on every roster slot and flex `slot`)
- Regulation uses **66 Stat Points** total, **max 32 in any one stat**, level 50.
- For each Pokémon author: **nature** (with one-line rationale), **training** via six integers HP/Atk/Def/SpA/SpD/Spe summing to ≤66, plus `label`, `why`, `spend[]`, and `rule` (e.g. “recommended starting spread — verify on device”).
- **Recommend a spread** from the kit’s job (speed control, bulk, max offense, etc.). Do not leave nature blank on the registered six. Use `TODO` only for item/ability/move when unknown — for SP, still propose a **recommended** spread and mark caveat in `training.why` if unverified.
- Optional: `exportEvs` / `ivsNote` when translating from Showdown; never invent calced speed tiers unless sourced.

HARD RULES
1. Registered six stays exactly 6 unique species. Never put flex mons on `box`. Set `"format": "singles"`.
2. Every set is paste-ready: item, ability, **nature**, **recommended Champions SP spread** (see above), 4 moves with { name, why }.
3. Packs are bring-of-three from the *active* six (core box, or box after a flex swap). `slugs.length === 3` and `strategy.bring` match.
4. SINGLES MEAT (required — unlocks rich UI chapters):
   a) Team `engines[]` — min 3 win recipes (id, label, path[4–7], how, dependsOn, disrupt, fallback)
   b) Team `network` — thesis + ≥5 edges { from, to, creates, converts, engineId? } among the registered six
   c) Team `commandments[]` — ≤5 house rules
   d) Every pack: `roles[]` for all three { slug, macro, micro }
   e) Every pack: `leadPlan` { lead, leadWhy, mid?, midWhy?, late?, lateWhy?, entryEdges?, turn1? }
      — Singles clock. **Do NOT** author `fieldPlan` / leadPair / backPair on singles.
   f) Every pack: 2–4 meaty `loops` (entry → mid → finish). Optional `previewTrees` / pack previewQuestions.
5. TWO version systems — both first-class; do not collapse them:
   a) In-box MODE: same slug, different kit → roster[i].modes[] + pack.winconMode = mode.id
   b) Bench module / flex SWAP: different species → altSlots[] (+ module metadata) + pack.requiresSwap { out, in }
   A pack may use both (swap the six, then pick a mode on a remaining mon).
6. PACKAGE LAYERING (critical for the UI):
   - Core packs: NO `requiresSwap`. Bring ⊆ registered `box`. These are what you play when the six is locked.
   - Swap packs: MUST set `requiresSwap`. Bring ⊆ active six after out→in. Never list swap packs as if they were available on the registered six.
   - Every core pack needs a clear `when` (preview trigger) — this is the package card description.
   - Every altSlot needs `why` + preferably `useWhen[]` / `avoidWhen[]` / `architectureChange` — this is the bench swap card; packages for that swap live behind the click.
7. No mode without a package that sets winconMode. No flex alt without a package that sets requiresSwap.
8. Matchups are required, not optional flavor. Team-level defaults + pack-level when the bring’s threats differ.
9. One idea per line. Pilot language: “If X, then Y.”
10. Output a single JSON object only — no markdown outside JSON.
11. Move `why` strings are shown on the kit card — write them as short readable explanations (not “TODO click for why”).
12. Recommended: `identityCard` + `pilotDecision` on packs when packs ≥ 3 or flex exists.

ALLOWED IDS
- format: "singles" (this prompt) | use the Doubles section for "doubles"
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
These are the only packages shown while the registered six is active.
For each pack:
- id, label, **when** (REQUIRED — preview trigger shown on the package card), identity, contrast?
- slugs[3] ⊆ box — must NOT include any flex slug
- winconMode? — REQUIRED if this bring assumes a non-default SlotMode
- identityCard (optional, recommended): compact machine-readable bring shape:
  engine[], connector[], converter[], scaler[], control[], winCondition, clock, commitment, autonomy, triggerBreadth
- pilotDecision (optional, recommended): chooseWhen[], avoidWhen[], previewQuestion, primaryMistake
- strategy: opponentPattern, purpose, targets[], refuses[], winCondition,
  gamePlan (Break → Control → Finish), mantra?, turnChecklist? (≤5), defaultLead? / defaultLeadWhy?
- roles[]: { slug, macro, micro } — EVERY bring member (all three)
- **SINGLES leadPlan (REQUIRED)** — Lead → Mid → Late clock for this three:
  - lead, leadWhy
  - mid?, midWhy?, late?, lateWhy?
  - entryEdges?: [{ from, to, creates, converts }] — ≥1 among the three
  - turn1?: one-line opening script
  - Also set strategy.defaultLead to match leadPlan.lead
- 2–4 loops and/or lead/mid/late flows — at least one **entry** loop and one **finish** loop
- endgameIds, optional winRouteIds[], engineIds[]
- MATCHUPS for this pack (do not omit):
  victims[]  { name, why, slug?, play?, trap? }
  counters[] { name, why, slug?, play?, trap? }
  advantages[] { title, body }
- hazards[] pack-specific traps if they differ from team hazards

Same leadPlan + roles + loops requirements apply to **swap packages** (section E).
For Doubles packs use `fieldPlan` instead — see Doubles section (do not mix).

E. Bench modules (flex swaps) — swap card first, packages second
The UI shows a **swap card** (why change registration). Packages for that module appear only after the swap is selected.

For each bench Pokémon that replaces a core mon:

  construction.altSlots[] (required for validation today):
  - slug (NOT on box), insteadOf (REQUIRED)
  - why (REQUIRED — swap card headline)
  - answers, costs
  - useWhen[] / avoidWhen[] (REQUIRED for modular teams — when to take / skip the swap)
  - architectureChange { from, to } (recommended)
  - module { identity, strategicRole, adds[], removes[], changes[] }
  - unlocks[] pack ids this flex enables
  - slot? paste-ready set (same fields as roster slot; may include modes)

  modules[] (optional layer — groups swap + architecture + package ids):
  - { id, type: "bench-module", requiresSwap { out, in }, architecture?, packages[] }

  bench (optional root — UI-facing):
  - purpose (one line), slots[]: { slug, insteadOf, category, priority?, useWhen[], avoidWhen[], changesArchitecture, moduleId? }

  replacementRelationships[] (optional): { out, in, preserves[], adds[], loses[], changes[] }

HARD: every alt MUST unlock ≥1 package. Every such package MUST set
  requiresSwap: { out: insteadOf, in: alt.slug }.
Bring ⊆ active six (box with out→in). Still exactly 6 after swap.
Write strategy + matchups + flows as if this were a different registered six.
strategy.contrast + pilotDecision.avoidWhen: what the default six cannot run; when NOT to bench this mon.
Do NOT put swap-pack brings into the core package list.

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
□ every core pack (no requiresSwap) has a non-empty `when` and bring ⊆ box
□ every swap pack has requiresSwap and bring ⊆ active six after out→in
□ every altSlots entry has why + useWhen (or TODO) — swap card copy
□ modular teams: each altSlot has module OR architectureChange OR replacementRelationships entry (TODO ok)
□ modular teams: ≥1 benchDiagnostic OR pilotDecision on swap packs (problem → module, not “pick a mon”)
□ winRoutes/endgames: routes describe path; endgames describe destination — do not duplicate blindly
□ no numeric synergy/coverage/flexibility scores on Pokémon
□ move why strings are short readable explanations (shown on kit cards)
□ singles: engines ≥3, network ≥5 edges, commandments ≤5
□ singles: every pack has roles[3] + leadPlan (no fieldPlan)
□ singles: every pack has ≥2 loops

USER MATERIAL FOLLOWS
(Paste Showdown export, notes, package ideas, or “interview me”.)
```

---

## Singles meat (engines / network / leadPlan)

Singles manuals unlock the same **How it wins** and **Network** chapters as doubles when you fill:

| Field | UI chapter | Requirement |
| --- | --- | --- |
| `engines[]` | How it wins | Min 3 — same shape as doubles engines |
| `network` | Network constellation | thesis + ≥5 create→convert edges among `box` |
| `commandments[]` | Under How it wins | ≤5 one-liners |
| `packs[].roles` | Guide · Roles on this three | All three bring members |
| `packs[].leadPlan` | Guide · Lead & clock | Singles clock (not `fieldPlan`) |
| `previewTrees` / `matchupScripts` | Preview / Scripts | Optional; shown for either format when authored |

### Package lead plan (`packs[].leadPlan`) — REQUIRED for singles

```json
"leadPlan": {
  "lead": "garchomp",
  "leadWhy": "Forces the Ice / Fairy answer immediately.",
  "mid": "rillaboom",
  "midWhy": "Grassy Glide / Fake Out after the first KO or forced switch.",
  "late": "kingambit",
  "lateWhy": "Sucker / Overlord clean when the board is chipped.",
  "entryEdges": [
    {
      "from": "garchomp",
      "to": "kingambit",
      "creates": "Forced switch / chip",
      "converts": "Supreme Overlord window"
    }
  ],
  "turn1": "Lead Garchomp; click the coverage that hits their most likely stay."
}
```

Also set `strategy.defaultLead` = `leadPlan.lead`.

**Do not** author `fieldPlan`, `defaultLeadPair`, or `backPair` on Singles.

---

## Schema cheat sheet (app)

| Version of the six | Fields | Active registration |
| --- | --- | --- |
| Core | `box`, `roster` | 6 slugs locked for tournament / queue |
| Identity card | `coreArchitecture` | Describes **registered** six’s strategic personality |
| In-box mode | `roster[].modes[]` + `packs[].winconMode` | Same 6; kit overlay via `slotsForPack` |
| Core pack | `packs[]` **without** `requiresSwap`; bring ⊆ `box` | Shown first; `when` = package card copy |
| Bench swap card | `altSlots` (+ `why`, `useWhen`, `avoidWhen`, `architectureChange`) | Off-box; not packages yet |
| Swap pack | `packs[]` **with** `requiresSwap` | Shown only after that swap; bring ⊆ active six |
| Module → packages | `modules[].packages[]` → `packs[].id` | Layer between swap card and playable bring |
| Win path | `winRoutes[]` + pack `winRouteIds` | How you get there |
| Win state | `construction.endgames[]` + pack `endgameIds` | Final board / closer |
| Clocks | `clocks[]` | Competing time horizons (immediate / tempo / scaling) |
| Failure | `failureRoutes[]` | Plan A denied → Plan B |
| Ladder help | `benchDiagnostics[]` | Symptom → recommended module |
| Package teach | `identityCard` + `pilotDecision` on `packs[]` | Preview/ladder decisions |
| Singles clock | `packs[].leadPlan` | Lead → Mid → Late + entryEdges |
| Doubles field | `packs[].fieldPlan` | Lead pair / back pair / pairEdges |
| How it wins | `engines[]` + `commandments[]` | Both formats |
| Network | `network.edges[]` | Both formats |
| Matchups | `victims` / `counters` / `advantages` / `hazards` | Pack overrides team via `resolveManual` |

**Evolution (keep legacy working):**

```text
CURRENT          altSlot → requiresSwap → pack (all packs listed together)

PROPOSED UI      registered six
                    → core packages (when cards)
                    → bench swap cards (why / useWhen)
                         → swapped six
                              → swap packages only
```

```text
AUTHORING        altSlot (swap card copy)
                    → strategic module / architectureChange
                    → unlocked packages with requiresSwap
                    → pilotDecision on those packages
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

## Doubles (bring 4)

**Use the dedicated doubles prompt:** [manual-authoring-prompt-doubles.md](./manual-authoring-prompt-doubles.md).

That file is the source of truth for Champions Doubles authoring. It includes:

- Paste-ready full team-builder prompt (bring 4, `fieldPlan`, network, engines)
- Schema enrichments: `seats`, `protectEconomy`, `bringInScripts`, `pairChemistries`, `speedRegimes`, `redirectMaps`, `denyTree`, `teamContextNote`
- What the live compact doubles UI shows vs what to still author for Guide / Sets / Architecture

Do **not** mix Singles `leadPlan` into doubles manuals. Summary rules below remain valid for quick reference; prefer the dedicated file when prompting an AI.

---

### Doubles quick reference (see dedicated file for paste-ready)

Use when `"format": "doubles"`. Doubles packs use **`fieldPlan`** (lead pair / back pair). Bring width = 4.

Doubles manuals with `engines` / `network` / `commandments` open a compact **How it wins + Network** path (Sets/Guide deferred). Author `fieldPlan` and Sets fully anyway — empty network edges leave an empty constellation.

| Chapter | Fields | Copy budget |
| --- | --- | --- |
| Thesis (header) | `pilot.thesis` (pull quote), `philosophy` ≤80 words, value chips via short `press` or lede | One quote |
| Architecture | `coreArchitecture` identity card; optional `clocks[]`, `winRoutes[]`, `failureRoutes[]` | Default six personality |
| Bench | `bench` / `modules[]` / enriched `altSlots`; `benchDiagnostics[]` | Module → architecture change |
| The six | `architecture[]` (3 skim layers), `roster[].primaryJob` + `networkJobs`, dead-loss via `gives` | Visual, not essays |
| Sets | Full kit + `training.sp` (66 / max 32) + optional `opening[]` asks | Per-mon theater |
| How it wins | `engines[]` (recipes) + `commandments[]` (≤5 one-liners) | **Meat:** each engine teaches setup → conversion → fail → recovery |
| Network | `network.thesis` + `network.edges[]` (required for doubles — see Network meat) | Graph of create → convert |
| Packages | Packs of 4: `identityCard`, `pilotDecision`, short `strategy`, **meaty** typed `loops`, `flows`, `engineIds` | Goal short; loops carry the teach |

HARD (in addition to the singles rules)

1. Packs are bring-of-four from the active six. `slugs.length === 4` and `strategy.bring` matches.
2. Complete kits: `item`, `ability`, **nature (required)**, `moves[4].name`+`why`, Champions **`training.sp`** (66 total / max 32 per stat) with **recommended spread + label/why/spend/rule** — team builder must propose nature and SP even when items are TODO. Optional `exportEvs` for provenance.
3. Doubles extras — **required**, not optional flavor:
   - `engines[]` — win recipes (see **How it wins meat** below)
   - **`network`** — conversion graph (see **Network meat** below) — the UI constellation is empty without this
   - `commandments[]` — five house rules as strings
   - `controlPlanes[]` — freeform id string (fake-out, grassy, coaching, …)
   - `matchupScripts[]` — few pills that select a pack (e.g. Rain → Pack A); optional
   - `megaPool`, `construction.altSlots` (bench), `ledger.laterTests`
4. Slot extras: `abilityStages`, `ampTargets`, `itemLoop`, `networkJobs` (creates/converts/protects/scales — feeds The six skim; optional `archetype` aligned with species overlay: connector | bridge | conversion-monster | engine | scaler | cleaner | disruptor | hybrid), `opening` (3–5 asks on Sets only).
   - **Species overlay vs manual:** Champions-wide scores live in `architecture-metrics.json` (MAG, tax, fan-out, ECC). Manuals own **this team's** edges (`network.edges`) and skim jobs. Do not paste overlay numeric scores into the manual JSON.
5. Pack extras: `engineIds`, **fieldPlan** (lead/back + pairEdges), **2–4 meaty `loops` per pack**, `flows`, `defaultLeadPair` / `backPair`. **Do not invent** T1 pairs or speed-calced SP.
6. Anti-redundancy: Fake Out / Sand / Coaching / Nasty Plot appear as a kit click **or** an engine path **or** a pack loop beat — never paste the same essay into all three. Engines own team-level win paths; pack `loops` own **bring-specific** repeatable plays. Packs link engines via `engineIds` only. Network edges are **one-line create→convert labels**, not engine essays.
7. No emoji. Catalog slugs only.

### Network meat (`network`) — REQUIRED for doubles

The Network chapter is a constellation: nodes = registered six, edges = “A creates a resource that B converts.” Without filled edges the page section is empty.

**Required shape:**

```json
"network": {
  "thesis": "One sentence: what the conversion graph is about.",
  "edges": [
    {
      "from": "raichu",
      "to": "gholdengo",
      "creates": "Fake Out free turn",
      "converts": "Nasty Plot",
      "engineId": "special-scaling"
    }
  ]
}
```

| Field | Requirement |
| --- | --- |
| `thesis` | One sentence (≤120 chars). Appears as the Network section purpose. |
| `edges[]` | **Minimum 5**, prefer **6–10**. Each edge is one directed conversion. |
| `from` / `to` | Catalog slugs. Prefer edges **among the registered `box`** so the constellation draws them. Flex-only endpoints are allowed for documentation but may not appear on the default graph. |
| `creates` | Short noun phrase: the **resource** A manufactures (Fake Out free turn, Sand, Coaching, Intimidate, Tailwind, …). Max ~6 words. |
| `converts` | Short noun phrase: what B spends that resource on (Nasty Plot, Sand Rush KO, Hyper Voice, …). Max ~6 words. |
| `engineId` | Optional but recommended when the edge is a step of an `engines[].id` — clicking the edge jumps the reader to that win recipe. |

**Authoring rules:**

1. Ask “Who creates a board state, and who converts it?” — every edge must answer both halves.
2. Cover the primary paths: tempo → scaler, terrain → physical, speed control → converter, and at least one failure/alternate route (e.g. physical denied → special).
3. Do **not** invent edges that are not real on this six (no fictional Fake Out partners).
4. Do **not** paste engine `how` essays into `creates`/`converts` — those fields are labels for the hover chip.
5. Mirror the same language in `roster[].networkJobs` (creates / converts / protects / scales / optional archetype) so The six skim and the graph agree. Numeric overlay scores stay in `architecture-metrics.json`.
6. Opponent-triggered edges (Intimidate → Competitive) may use the support mon as `from` if the trigger is opponent-side: phrase `creates` as “Intimidate into Competitive” rather than inventing a fake opponent slug.

**Self-check example language:**

- Good: `creates: "Fake Out free turn"`, `converts: "Nasty Plot"`
- Bad: `creates: "Raichu uses Fake Out to stop the opponent from attacking which then allows Gholdengo to…"` (too long; belongs in engines)

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

### Package field plan (`packs[].fieldPlan`) — REQUIRED for doubles

Every doubles package must teach **who leads**, **what the lead pair does together**, and **how the back two relate**.

```json
"fieldPlan": {
  "leadPair": ["raichu", "gholdengo"],
  "leadWhy": "Fake Out creates Gholdengo's first conversion window against boards that cannot immediately double it.",
  "backPair": ["rillaboom", "sylveon"],
  "backJobs": [
    { "slug": "rillaboom", "job": "Second Fake Out / terrain / Grassy Glide cleanup" },
    { "slug": "sylveon", "job": "Immediate Fairy spread when Gholdengo is answered" }
  ],
  "pairEdges": [
    {
      "from": "raichu",
      "to": "gholdengo",
      "creates": "Fake Out free turn",
      "converts": "Nasty Plot or Make It Rain"
    },
    {
      "from": "rillaboom",
      "to": "gholdengo",
      "creates": "Second Fake Out wave",
      "converts": "Safer special endgame"
    }
  ],
  "turn1": "Raichu Fake Out the biggest threat; Gholdengo Protect or attack based on whether setup is free.",
  "bringInTriggers": [
    "Opponent answers Gholdengo → bring Sylveon for spread",
    "Need terrain or a second Fake Out → bring Rillaboom"
  ]
}
```

| Field | Requirement |
| --- | --- |
| `leadPair` | Exactly 2 slugs ⊆ pack.slugs |
| `leadWhy` | Why this lead (not “default”) |
| `backPair` | The other 2 bring members |
| `backJobs` | One job line per back mon — what they are *for* while sitting |
| `pairEdges` | ≥2 create→convert edges among the four; ≥1 must be between the lead pair |
| `turn1` | Optional but recommended — visualize the opening exchange |
| `bringInTriggers` | When a back mon comes in and why |

Also mirror `defaultLeadPair` / `backPair` on the pack root. Pack `roles[]` must cover all four. Pack `loops` must include at least one lead-pair recipe and one back-entry / second-wave recipe.

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
□ network.thesis filled; edges ≥5; every from/to ⊆ box (prefer) or flex; creates/converts ≤6 words each
□ ≥3 edges link to a real engines[].id via engineId
□ every matchupScript.packId exists
□ every engine has path (4–7), how (4–6 sentences), dependsOn, disrupt, fallback
□ every doubles pack has fieldPlan with leadPair, backPair, backJobs, ≥2 pairEdges (one lead↔lead)
□ every pack has 2–4 loops; each loop body starts with If/When/Use when; ≥1 lead-pair loop + ≥1 back-entry loop
□ local drafts may omit previewTrees / ledger — omit empties on the page

---

## Paste-ready: full doubles team-builder prompt

**Superseded.** Copy from [manual-authoring-prompt-doubles.md](./manual-authoring-prompt-doubles.md) instead (includes seats / protectEconomy / wow fields).

Legacy fence kept for diff history only — prefer the dedicated doubles file.

```
You are authoring a Ringside Champions DOUBLES field manual (format: "doubles", bring 4).

TOURNAMENT REALITY
- box = the REGISTERED six locked for matchmaking / a tournament run.
- CORE packages = bring-of-4 from that six only (NO requiresSwap). These are the cards pilots see first.
- BENCH swaps = off-box altSlots. Write swap CARDS (why / useWhen / avoidWhen / architectureChange). Packages for a swap appear ONLY after that swap (requiresSwap { out, in }).
- Never dump every package from every bench mon onto the registered-six view.

HARD RULES
1. box has exactly 6 unique catalog slugs. Flex mons are NEVER on box.
2. Every roster + flex slot: item, ability, nature, moves[4] { name, why }, recommended Champions training.sp (66 total, max 32 per stat) with label/why/spend/rule.
3. Move why is always shown — write a short readable explanation, not “TODO”.
4. Core packs: no requiresSwap; slugs ⊆ box; clear `when` (package card description).
5. Swap packs: must set requiresSwap; bring ⊆ active six after out→in.
6. Output one JSON object only. Catalog slugs. No emoji. TODO only when truly unknown.

═══════════════════════════════════════
PACKAGES — FIELD PLAN (REQUIRED EACH PACK)
═══════════════════════════════════════
For EVERY pack (core and swap), fill fieldPlan so we can visualize the sent-out pair and the back two:

{
  "fieldPlan": {
    "leadPair": ["slugA", "slugB"],
    "leadWhy": "Why this lead vs other leads in the four.",
    "backPair": ["slugC", "slugD"],
    "backJobs": [
      { "slug": "slugC", "job": "What this mon does while sitting / when it enters" },
      { "slug": "slugD", "job": "…" }
    ],
    "pairEdges": [
      {
        "from": "slugA",
        "to": "slugB",
        "creates": "≤6-word resource the lead creates",
        "converts": "≤6-word what the partner spends it on"
      },
      {
        "from": "slugC",
        "to": "slugB",
        "creates": "…",
        "converts": "…"
      }
    ],
    "turn1": "One-line opening script for the lead pair.",
    "bringInTriggers": [
      "When X happens → bring in slugC because …",
      "When Y happens → bring in slugD because …"
    ]
  },
  "defaultLeadPair": ["slugA", "slugB"],
  "backPair": ["slugC", "slugD"],
  "roles": [
    { "slug": "slugA", "macro": "…", "micro": "…" },
    { "slug": "slugB", "macro": "…", "micro": "…" },
    { "slug": "slugC", "macro": "…", "micro": "…" },
    { "slug": "slugD", "macro": "…", "micro": "…" }
  ]
}

pairEdges rules:
- ≥2 edges among the four
- ≥1 edge MUST be between the two leadPair members (the “sent out together” conversion)
- Prefer also 1 edge from a back mon into a lead (second wave / protect the endgame)
- Same style as team network: creates = resource, converts = spend — not essays

Also per pack:
- when (REQUIRED card copy — “Bring this when…”)
- identity, strategy { opponentPattern, purpose, targets[], refuses[], winCondition, gamePlan, mantra, turnChecklist≤5 }
- identityCard + pilotDecision { chooseWhen[], avoidWhen[], previewQuestion, primaryMistake }
- engineIds[], endgameIds[]
- loops[2–4]: body starts with If/When/Use when…
  * ≥1 loop = lead-pair play (what the two on the field do together)
  * ≥1 loop = back-pair entry / second wave (how a sitting mon comes in and converts)
- flows lead forks when there are real lead decisions
- victims / counters / advantages / hazards for THIS bring

═══════════════════════════════════════
TEAM NETWORK — REQUIRED
═══════════════════════════════════════
network.thesis + ≥5 edges (prefer 6–10) among the registered box:
{ from, to, creates, converts, engineId? }
Ask: who creates a board state, who converts it?
Mirror verbs in roster[].networkJobs { creates, converts, protects, scales, optional archetype }.
Species architecture overlay (createFanOut / convertFanOut / tax / ECC) is separate — manuals do not invent those numbers.

═══════════════════════════════════════
HOW IT WINS — REQUIRED
═══════════════════════════════════════
≥3 engines: path[4–7], how (4–6 sentences: create→convert→press→deny), dependsOn, disrupt, fallback.
commandments[] ≤5 one-liners.

═══════════════════════════════════════
BENCH (if any flex)
═══════════════════════════════════════
altSlots[]: slug, insteadOf, why, answers, costs, useWhen[], avoidWhen[], architectureChange, module, unlocks[], slot (full kit + SP).
Each unlocks ≥1 pack with requiresSwap. Those packs also need full fieldPlan.

OPTIONAL BUT USEFUL
coreArchitecture, clocks[], winRoutes[], failureRoutes[], benchDiagnostics[], megaPool, matchupScripts[], controlPlanes[].

SELF-CHECK BEFORE ANSWERING
□ box = 6; no flex on box
□ every core pack when filled; bring ⊆ box; no requiresSwap
□ every swap pack has requiresSwap; bring ⊆ swapped six
□ every doubles pack has fieldPlan (lead/back/pairEdges/backJobs) + roles for all four
□ ≥1 lead-pair loop + ≥1 back-entry loop per pack
□ network ≥5 edges; ≥3 with engineId
□ nature + 66 SP recommended on every slot
□ move why are short readable explanations

USER MATERIAL FOLLOWS
(Paste Showdown export, notes, package ideas, VOD bullets, or “interview me”.)
```

---

## Paste-ready: doubles meat (short addon)

If the builder already has a draft six and you only need to beef packages / network / engines, use this shorter block:

```
You are filling a Ringside Champions DOUBLES field manual (format: "doubles", bring 4).

HOW IT WINS — MEAT REQUIRED
Author ≥3 engines. For each engine:
- path[]: 4–7 ordered beats ("Tyranitar · Sand Stream", "Excadrill · Earthquake", …)
- how: 4–6 sentences covering create → convert → when to press → what denies
- dependsOn, disrupt, fallback — all required, one line each
Do not write one-liner engines. Do not write novels — teach the win path.

NETWORK — MEAT REQUIRED (constellation is empty without this)
Author network.thesis (one sentence) + ≥5 edges, prefer 6–10.
Each edge: { from, to, creates, converts, engineId? }
- from/to: catalog slugs on the registered box (flex endpoints allowed but box edges draw the UI)
- creates / converts: short noun phrases (≤6 words) — resource A makes → what B spends it on
- engineId: set when the edge is a step of an engines[].id so the UI can jump to that recipe
Ask for every edge: "Who creates a board state, who converts it?"
Do NOT paste engine essays into creates/converts. Mirror the same verbs in roster[].networkJobs.

PACKAGE FIELD PLAN — REQUIRED (every pack)
For each pack fill fieldPlan:
- leadPair [2], leadWhy, backPair [2], backJobs[{slug,job}]
- pairEdges ≥2 create→convert among the four; ≥1 between the lead pair
- turn1 opening script; bringInTriggers for when back mons enter
Also set defaultLeadPair / backPair and roles[] for all four.
loops: ≥1 lead-pair play + ≥1 back-entry / second-wave play (If/When… body).

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
- Registered six first. Core packs have NO requiresSwap and clear `when` strings (package cards).
- Bench = swap cards: why, useWhen[], avoidWhen[], architectureChange — not a dump of every swap package.
- Swap packs MUST set requiresSwap; only appear after that swap is chosen.
- coreArchitecture describes the REGISTERED six.
- benchDiagnostics: problem → symptoms → recommendedModules
- winRoutes vs construction.endgames (path vs destination)
- failureRoutes: failedRoute → fallback → nextRoute
- packs: identityCard + pilotDecision (chooseWhen / avoidWhen / previewQuestion / primaryMistake)
- Move why text is always shown on kits — write short explanations
- No numeric Pokémon rating tables

NATURE + SP: every roster and flex slot needs a recommended nature and 66 SP spread (max 32 per stat) with training.label/why/spend/rule — not omitted.
JSON only. Catalog slugs. TODO for unknown items/moves only when necessary. No emoji.
```

