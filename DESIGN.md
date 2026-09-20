# Ringside design system

Teaching companion for Pokémon Champions. Atmosphere comes from official type discs and each Pokémon’s art wash — not Nintendo marks as ours.

## Brand hybrid

- **App surfaces (light):** cool stadium blues / near-white paper (`--bg`, `--bg-raised`, navy `--ink`).
- **App surfaces (dark):** frozen cool stadium charcoal — do not retune casually.
- **Battle chrome (both):** purple glass + yellow select + meta strip (`--battle-*`) for move UI only, inspired by Champions battle move panels.
- **Type discs:** `--type-*` in `src/styles/types.css` (Champions / OP.GG palette). Keep independent of theme.

## Theme tokens

Set on `html[data-theme="dark"|"light"]` in `src/app/globals.css`.

| Token | Role |
|-------|------|
| `--bg` / `--bg-raised` / `--bg-sunken` | Page surfaces |
| `--ink` / `--muted` / `--line` | Text + borders |
| `--battle-panel` / `--battle-panel-line` / `--battle-panel-ink` / `--battle-panel-muted` | Move detail glass |
| `--battle-select` | Selected move chip ring |
| `--battle-meta-bg` / `--battle-meta-ink` | Slanted % / PP meta on chips |
| `--type-*` | Type fills (always) |

Tailwind bridge: `bg-bg`, `bg-raised`, `text-ink`, `text-battle-panel-ink`, `bg-battle-select`, etc.

## Move component library

| Component | Path | Use |
|-----------|------|-----|
| `MoveChip` | `src/components/moves/MoveChip.tsx` | Type capsule + optional meta; `selected` / sizes |
| `MoveDetailPanel` | `src/components/moves/MoveDetailPanel.tsx` | Glass detail + effect |
| `MoveStatGrid` | `src/components/moves/MoveStatGrid.tsx` | Category · Power · Accuracy |
| `MoveCategoryIcon` | `src/components/moves/MoveCategoryIcon.tsx` | Physical / Special / Status mark |
| `typeInk` | `src/components/moves/typeInk.ts` | Dark ink on light type fills |

Consumers: Live foe usage, Moves appendix, DecisionTree forks, Live damage calc ladder pills, Slot move editor.

Ladder **usage bars** (`KitUsage`) stay bars — share %, not battle chrome.

## Motion

`src/components/motion/tokens.ts`: `fadeUp`, `panelIn` (popover/detail), `selectPulse`, duration ladder in `motionTokens`. Prefer these over one-off timings. Global `prefers-reduced-motion` hammer in `globals.css`.

## Policy

- Dark **base** tokens stay unless a shared component requires a new semantic var.
- Prefer `--battle-*` / move library over page-local hex for move chrome.
- Fan site: inspired-by battle UI, no Nintendo fonts or logos.
