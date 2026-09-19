# Manual authoring AI prompt

Copy everything inside the fenced block below into ChatGPT / Claude / Cursor. Paste your team (Showdown export, notes, or VOD bullets) after the prompt. Ask for **JSON only** matching Ringside’s boxed `TeamManual` shape.

Default: **Pokémon Champions Singles** — registered six + preview packs of three. Keep `box.length === 6`. Flex alts unlock packages via swap; they are **not** a seventh registration slot.

---

## Paste-ready prompt

```
You are authoring a Ringside field manual for Pokémon Champions Singles.

GOAL
Produce one boxed TeamManual JSON a pilot can open and play from in order:
choose package → load sets → run the plan. Prefer short actionable lines.
Use TODO: … when you lack a fact — do not invent lore, ladder stats, or EV spreads.

HARD RULES
1. Registered six stays exactly 6 species (species clause). Never put flex mons on `box`.
2. Every set is paste-ready: item, ability, nature, EVs (or TODO), 4 moves with roles.
3. Packs are bring-of-three drawn from the *active* six (core box, or box after a flex swap).
4. No flex alt without at least one package it unlocks. No swap-gated pack without `requiresSwap`.
5. One idea per line. Pilot language: “If X, then Y.” Skip flavor essays.
6. Output a single JSON object only — no markdown outside JSON.

INTERVIEW ORDER (ask only what’s missing; otherwise extract from paste)

A. Six identity
- title, sixSummary (1–2 sentences why these six register together)
- archetype id if known, else TODO
- construction.thesis / method / winCondition (one line each)

B. Roster (all six once)
For each slug on box:
- job/role, objective, howToPlay (short)
- moves[4]: { name, role } — role = what the click does for this team
- item, ability, nature, sampleSp or ev string — TODO if unknown
- optional: teraType, notes

C. Endgames (six-level)
construction.endgames[]: { id, label, path, how }
Each package later links via endgameIds.

D. Core packages (legal on default six)
For each pack:
- id, label, when (preview trigger), identity
- slugs[3] ⊆ box
- strategy: opponentPattern (or when), purpose, targets[], refuses[], winCondition,
  gamePlan (Break → Control → Finish), mantra?, turnChecklist? (≤5), defaultLead?
- roles[]: { slug, macro, micro } for the three
- plan beats Lead → Mid → Late if they differ from shared
- 2–4 loops and/or lead/mid/late forks (flows) — only real decisions
- endgameIds linking construction.endgames
- coverageNotes? short typed threats this bring answers

E. Flex pool + swap-gated packages (only if the team actually swaps)
construction.altSlots[] for each flex candidate:
- slug (NOT on box), insteadOf? (core mon replaced), why
- answers? (what you gain), costs? (what you lose)
- unlocks?: pack ids this flex enables
- slot?: optional paste-ready set for the flex mon (same fields as roster slot)

For each package that needs the flex:
- requiresSwap: { out: coreSlug, in: flexSlug }
- bring slugs may include `in`; must ⊆ resolveActiveBox (box with out→in)
- Full strategy like core packs
- Explicit contrast: what the default six cannot do that this swap enables
- refuse: when NOT to take the swap / this pack

F. Matchups (optional, keep short)
victims / counters / advantages / hazards — only if they change play.

G. Evidence (optional)
construction evidence season/asOf/source/caveat — mark unproven claims.

OUTPUT SHAPE (TypeScript-aligned; omit unused optional fields)

{
  "id": "kebab-id",
  "title": "",
  "lede": "",
  "sixSummary": "",
  "format": "singles",
  "philosophy": "",
  "archetype": "",
  "family": "",
  "meta": "",
  "box": ["s1","s2","s3","s4","s5","s6"],
  "core": ["s1","s2","s3"],
  "roster": [ /* SlotManual ×6 matching box order */ ],
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
        "slot": { "title": "", "job": "", "role": "", "moves": [], "objective": "", "howToPlay": "", "item": "", "ability": "", "nature": "" }
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
        "turnChecklist": []
      },
      "roles": [{ "slug": "", "macro": "", "micro": "" }],
      "loops": [{ "title": "", "body": "" }],
      "flows": [
        { "id": "lead", "title": "Lead", "forks": [{ "id": "lead-0", "when": "", "then": "" }] }
      ]
    }
  ],
  "slugs": ["","",""],
  "slots": [],
  "phases": [],
  "loops": [],
  "hazards": []
}

Notes for empty required roots: set slugs/slots/phases/loops/hazards to [] or the first pack’s bring; the app resolves pack views via resolveManual.

VALIDATION CHECKLIST (self-check before answering)
□ box has 6 unique legal slugs; no flex slug on box
□ every roster slug ∈ box; paste-ready or TODO on EVs/moves
□ every core pack bring ⊆ box; every swap pack has requiresSwap and bring ⊆ active six
□ every altSlots.slug has unlocks or a pack.requiresSwap.in matching it
□ every requiresSwap.in ∈ altSlots; requiresSwap.out ∈ box
□ packages have when + winCondition + at least one refuse
□ no invented numbers; TODOs labeled

USER MATERIAL FOLLOWS
(Paste Showdown export, notes, package ideas, or “interview me”.)
```

---

## Schema cheat sheet (app)

| Concept | Fields |
| --- | --- |
| Registered six | `box`, `roster` |
| Flex pool | `construction.altSlots` |
| Core pack | `packs[]` without `requiresSwap` |
| Swap pack | `packs[].requiresSwap: { out, in }` |
| Active six for Load | `resolveActiveBox(manual, packId)` |
| Bring | `packs[].slugs` length 3 ⊆ active six |

See `src/content/manuals.ts` for full types (`ManualAltSlot`, `ManualPack`, `ManualPackStrategy`, `SlotManual`).
