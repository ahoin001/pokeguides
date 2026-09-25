# Doubles manual authoring — dedicated prompt

**Singles?** Use [manual-authoring-prompt.md](./manual-authoring-prompt.md).  
**Theory:** [team-building-architecture.md](./team-building-architecture.md) (engines vs converters, MAG, packages as mini-teams).

This file is **Champions Doubles only** (`format: "doubles"`, bring **4**). Paste the block at the bottom into your AI builder, then paste Showdown / notes / VOD bullets. Ask for **JSON only** matching Ringside `TeamManual`.

---

## What the live page actually shows today

Doubles manuals with filled `engines` / `network` / `commandments` open a **compact path**:

| Visible now | Fields that drive it |
| --- | --- |
| Team & packs | `box`, packs (`when`, `identity`, `strategy.mantra`, `loops`, `flows`, `engineIds`, `pilotDecision.previewQuestion`), `matchupScripts`, `altSlots`, `coreArchitecture.identity` |
| How it wins | `engines[]`, `commandments[]` |
| Network | `network.thesis` + `network.edges[]` |

**Still author fully** (Guide / Sets / Architecture surfaces exist or are coming back): `fieldPlan`, `roles`, Sets kits + `opening` / `ampTargets` / `abilityStages`, `architecture[]`, `clocks`, `winRoutes`, `failureRoutes`, `identityCard`, `controlPlanes`, wow-fields below.

Do **not** skip `fieldPlan` because Guide is compact-hidden — it is the doubles teach surface.

---

## Schema enrichment (new optional fields)

Added to `src/content/manuals.ts` for wow / pilot clarity. **Optional** — fill when the six uses the structure. Do not invent empty arrays.

| Field | Where | Purpose |
| --- | --- | --- |
| `fieldPlan.seats` | pack | Left/right seat jobs on the 2v2 board (Fake Out seat vs converter seat) |
| `fieldPlan.protectEconomy` | pack | Who spends Protect, who banks Fake Out, what if Protect is denied |
| `fieldPlan.bringInScripts` | pack | Ordered second-wave beats (upgrade of string `bringInTriggers`) |
| `pairChemistries[]` | team | Named lead pairs with `vsBoards` / `diesTo` / `secondWave` |
| `speedRegimes[]` | team | Tailwind / Sand / TR / Icy Wind windows + beneficiaries + expire |
| `redirectMaps[]` | team | Follow Me / Rage Powder / Lightning Rod bait → protected → punish |
| `denyTree[]` | team | Structured deny → recover branches (companion to `failureRoutes`) |
| `networkJobs.teamContextNote` | slot | One line: job on *this* six vs species overlay (no MAG numbers) |

**Still required (existing meat):** `engines`, `network`, `commandments`, every pack `fieldPlan` + `roles[4]` + 2–4 `loops`, Champions SP, `networkJobs` verbs + optional `archetype`.

**Never paste into manuals:** species MAG / tax / createFanOut / convertFanOut / ECC integers — those live in `architecture-metrics.json`. Manuals own **this team’s** edges and jobs.

---

## Paste-ready prompt (Doubles only)

Copy **everything** inside the fence:

```
You are authoring a Ringside Champions DOUBLES field manual.

OUTPUT
- One JSON object only. No markdown outside JSON. No emoji.
- Shape: TeamManual with "format": "doubles".
- Catalog slugs only (PokeAPI-style: gholdengo, indeedee-female, salamence-mega, …).
- Use "TODO: …" only when a fact is truly unknown — still propose nature + recommended SP.

═══════════════════════════════════════
TOURNAMENT REALITY
═══════════════════════════════════════
- box = REGISTERED six locked for matchmaking (exactly 6 unique slugs). Flex NEVER on box.
- CORE packages = bring-of-4 from box only. NO requiresSwap. These are the first cards pilots see.
- BENCH = construction.altSlots (+ optional modules / benchDiagnostics). Write SWAP CARDS:
  why / useWhen[] / avoidWhen[] / architectureChange / module.identity.
- SWAP packages = requiresSwap { out, in }. Bring ⊆ active six after swap. Never list them as if available on the registered six.
- In-box MODES = same slug, different kit → roster[].modes[] + pack.winconMode.

Mental model: a bench mon is a strategic MODULE that changes architecture, not a seventh registration slot.
Do NOT rate bench mons 1–10. Value is relational (insteadOf + architectureChange + which routes unlock).

═══════════════════════════════════════
CHAMPIONS TRAINING (every roster + flex slot)
═══════════════════════════════════════
- Level 50. 66 Stat Points total. Max 32 in any one stat.
- Required: nature (+ one-line rationale), item, ability, moves[4] { name, why }.
- Required: training.sp { hp, atk, def, spa, spd, spe } summing ≤66, plus label, why, spend[], rule.
- Propose a recommended spread even if item is TODO; caveat in training.why if unverified.
- move.why is always shown on the kit card — short readable explanations, not "TODO".

═══════════════════════════════════════
HARD RULES
═══════════════════════════════════════
1. format: "doubles". Packs: slugs.length === 4; strategy.bring matches.
2. Do NOT author leadPlan / singles clocks. Use fieldPlan (leadPair / backPair).
3. DOUBLES MEAT (required — empty network = empty constellation UI):
   a) engines[] ≥3 — each: id, label, path[4–7], how (4–6 sentences: create→convert→press→deny), dependsOn, disrupt, fallback
   b) network — thesis (≤120 chars) + edges ≥5 (prefer 6–10): { from, to, creates, converts, engineId? }
      creates/converts = ≤6-word chip labels, NOT essays
   c) commandments[] ≤5 one-liners
   d) controlPlanes[] — sand / fake-out / tailwind / grassy / coaching / etc. { id, label, setterSlug, effect, whoBenefits }
   e) Every pack: roles[4] { slug, macro, micro }
   f) Every pack: fieldPlan (see below) + defaultLeadPair + backPair mirrors
   g) Every pack: 2–4 loops — body MUST start with If… / When… / Use when…
      ≥1 lead-pair loop + ≥1 back-entry / second-wave loop
   h) roster[].networkJobs { creates, converts, protects?, scales?, repositions?, archetype?, teamContextNote? }
4. Anti-redundancy: Fake Out / Sand / Coaching / Nasty Plot appear as kit click OR engine path OR pack loop — never paste the same essay into all three.
5. Matchups required: team victims/counters + pack-level when the bring’s threats differ. matchupScripts[] when preview foes map cleanly to a packId.
6. One idea per line. Pilot language: “If X, then Y.”
7. archetype: balance | hyper-offense | trick-room | rain | sun | grassy
   family: clock | kite | weather | terrain | room
8. Species overlay vs manual: do NOT invent MAG/tax/fan-out/ECC numbers. Optional networkJobs.archetype + teamContextNote only.

═══════════════════════════════════════
FIELD PLAN (REQUIRED on every pack)
═══════════════════════════════════════
{
  "fieldPlan": {
    "leadPair": ["slugA", "slugB"],
    "leadWhy": "Why this lead vs other leads in the four.",
    "backPair": ["slugC", "slugD"],
    "backJobs": [
      { "slug": "slugC", "job": "What they do while sitting / on entry" },
      { "slug": "slugD", "job": "…" }
    ],
    "pairEdges": [
      { "from": "slugA", "to": "slugB", "creates": "≤6-word resource", "converts": "≤6-word spend" },
      { "from": "slugC", "to": "slugB", "creates": "…", "converts": "…" }
    ],
    "turn1": "Opening script for the lead pair.",
    "bringInTriggers": [
      "When X → bring slugC because …",
      "When Y → bring slugD because …"
    ],
    "seats": {
      "left": "slugA",
      "right": "slugB",
      "leftJob": "Fake Out / Intimidate seat",
      "rightJob": "Converter / Protect seat"
    },
    "protectEconomy": {
      "spendsProtect": ["slugB"],
      "banksFakeOut": ["slugA"],
      "ifProtectDenied": "What the four does when the scout is gone"
    },
    "bringInScripts": [
      {
        "when": "Opponent answers the lead converter",
        "send": "slugC",
        "beats": ["Lead clicks Protect or pivot", "slugC enters on the free turn", "slugC converts with …"],
        "why": "Second wave without donating momentum"
      }
    ]
  },
  "defaultLeadPair": ["slugA", "slugB"],
  "backPair": ["slugC", "slugD"]
}

pairEdges rules:
- ≥2 among the four
- ≥1 MUST connect the two leadPair members
- Prefer ≥1 from a back mon into a lead (second wave)

Also per pack:
- when (REQUIRED card copy — “Bring this when…”)
- identity, strategy {
    opponentPattern, purpose, targets[], refuses[], winCondition, gamePlan, mantra,
    turnChecklist≤5, bring (4 slugs)
  }
- identityCard { shape?, strengths[], weaknesses[], keyInteractions[] } when you can
- pilotDecision { chooseWhen[], avoidWhen[], previewQuestion, primaryMistake }
- engineIds[] (link to team engines), endgameIds? / winRouteIds?
- flows with real lead forks
- victims / counters / advantages / hazards for THIS bring

═══════════════════════════════════════
TEAM ARCHITECTURE (author — unlocks richer chapters)
═══════════════════════════════════════
- pilot.thesis + pilot.rule + pilot.fail; philosophy ≤80 words; press[] ≤5 chips; lede one card blurb
- coreArchitecture {
    identity, primaryEngine, conversionModel, scalingModel, controlModel,
    speedModel, resourceModel, threatProfile[]
  }
- architecture[] — exactly 3 skim layers { title, body, slugs[] }
  e.g. Infrastructure / Converters / Fallback
- clocks[] — competing clocks { id, owner[], speed, goal }
- winRoutes[] — path → finish { id, name, requires[], sequence[], finish, failurePoint?, dependencies? }
- failureRoutes[] — { failedRoute, why, fallback, nextRoute }
- denyTree[] — structured recovers:
  { id, denied, then, next?, ifStillDenied? }
  Example denied: "Fake Out immune", "Sand overwritten", "Protect scouts the set-up"

═══════════════════════════════════════
DOUBLES WOW FIELDS (fill when relevant — omit empty)
═══════════════════════════════════════
pairChemistries[]:
  { id, pair: [a,b], label, vsBoards[], diesTo[], secondWave?, packIds? }

speedRegimes[]:
  { id, label, creates, beneficiaries[], expiresInto?, window? }
  Examples: Tailwind, Sand Rush, Trick Room, Icy Wind spread, Grassy Glide priority window

redirectMaps[] (Follow Me / Rage Powder / Lightning Rod / Storm Drain / etc.):
  { id, bait, protected[], punish?, attractor? }

networkJobs.teamContextNote (per slot):
  One line only — how this six uses the mon vs the generic species overlay.
  Good: "Converter on this six — spends Sand, does not create it."
  Bad: "MAG 4, tax 1" (forbidden — overlay owns numbers)

═══════════════════════════════════════
NETWORK GRAPH
═══════════════════════════════════════
Ask for every edge: who creates a board state, who converts it?
Cover: tempo→scaler, terrain/weather→physical, speed control→converter, ≥1 failure/alternate route.
≥3 edges should set engineId to a real engines[].id.
Mirror language in roster networkJobs.
Opponent-triggered (Intimidate→Competitive): phrase creates as the trigger; do not invent foe slugs.

═══════════════════════════════════════
BENCH (if any flex)
═══════════════════════════════════════
construction.altSlots[]:
  slug, insteadOf, why, answers[], costs[], useWhen[], avoidWhen[],
  architectureChange { from, to }, module { identity, strategicRole?, adds?, removes?, changes? },
  unlocks[] (pack ids), slot { full kit + nature + SP }

Each unlocks ≥1 pack with requiresSwap + FULL fieldPlan.
Optional: benchDiagnostics[] { problem, recommendedModuleId, why }, modules[], replacementRelationships[].

═══════════════════════════════════════
MEGA / EVIDENCE / LEDGER (when relevant)
═══════════════════════════════════════
megaPool when multiple stones; packs set megaChoice / megaOptions.
ledger { dropped, gained, rejectedAlts?, laterTests? } when this six is a revision.
evidence.caveat — never claim ladder-optimal WR without source.
speedBenchmarks[] only when Spe thresholds are sourced — do not invent calcs.

═══════════════════════════════════════
INTERVIEW ORDER (ask only what’s missing)
═══════════════════════════════════════
A. Six identity — what must be true for this six to feel like itself?
B. Primary create→convert loops (name 3–5)
C. Default lead pair and why; alternate leads
D. Protect / Fake Out economy
E. Speed regimes (Tailwind / weather / TR / priority)
F. Redirect / bait if any
G. What denies Plan A → Plan B (denyTree / failureRoutes)
H. Preview: which foes map to which pack (matchupScripts)
I. Bench modules: what architecture each swap creates
J. Kits + natures + recommended SP

═══════════════════════════════════════
SELF-CHECK BEFORE ANSWERING
═══════════════════════════════════════
□ format doubles; box = 6; no flex on box
□ every core pack: no requiresSwap; bring ⊆ box; when filled
□ every swap pack: requiresSwap; bring ⊆ swapped six; full fieldPlan
□ every pack: roles[4], fieldPlan (lead/back/pairEdges/backJobs), ≥1 lead loop + ≥1 back-entry loop
□ fieldPlan pairEdges: ≥1 lead↔lead
□ network.thesis; edges ≥5; creates/converts ≤6 words; ≥3 engineId links
□ ≥3 engines with path 4–7 + how 4–6 sentences + dependsOn/disrupt/fallback
□ commandments ≤5; controlPlanes filled
□ nature + recommended 66 SP on every slot
□ seats + protectEconomy filled on flagship packs (recommended)
□ wow fields only when the six actually uses them (no empty arrays)
□ no MAG/tax/fan-out integers in the manual JSON

USER MATERIAL FOLLOWS
(Paste Showdown export, notes, package ideas, VOD bullets, or “interview me”.)
```

---

## Short addon — meat-only refill

Use when the six/kits already exist and you only need win meat + field plans:

```
Continue a Ringside Champions DOUBLES TeamManual (format doubles, bring 4).
Do NOT rescore or rewrite kits unless broken.

Fill or upgrade:
1) network.thesis + ≥5 edges (≤6-word creates/converts, engineId when linked)
2) engines ≥3 with full how/dependsOn/disrupt/fallback
3) commandments ≤5
4) EVERY pack fieldPlan (seats + protectEconomy + bringInScripts when useful) + roles[4] + 2–4 loops
5) architecture[3], clocks, winRoutes, failureRoutes, denyTree when missing
6) pairChemistries / speedRegimes / redirectMaps only if the six uses them
7) roster networkJobs + optional archetype + teamContextNote

JSON only. Catalog slugs. No overlay score numbers.
```

---

## Schema change summary (for implementers)

| Change | Status |
| --- | --- |
| `ManualPackFieldPlan.seats` | Added (optional) |
| `ManualPackFieldPlan.protectEconomy` | Added (optional) |
| `ManualPackFieldPlan.bringInScripts` | Added (optional) |
| `ManualPairChemistry` + `TeamManual.pairChemistries` | Added (optional) |
| `ManualSpeedRegime` + `TeamManual.speedRegimes` | Added (optional) |
| `ManualRedirectMap` + `TeamManual.redirectMaps` | Added (optional) |
| `ManualDenyBranch` + `TeamManual.denyTree` | Added (optional) |
| `ManualNetworkJobs.teamContextNote` | Added (optional) |
| Wire compact doubles to show fieldPlan / The six / Architecture | **UI follow-up** (highest leverage; schema already thick) |

Existing R2 / conversion-network / R4 manuals remain valid — all new fields are optional.
