# Battle formats (Singles vs Doubles)

Ringside treats **battle format** as a product boundary — not a global theme toggle.

## Ownership

| Surface | Format |
|---------|--------|
| Learn `/learn` | Singles classroom |
| Learn `/learn/doubles` | Doubles classroom |
| Manuals `/manuals` (+ `?format=`) | Dual shelf (Singles default) |
| Team / Live / Meta / Usage | **Singles only** today |

Shared layers (catalog, M-C legality, type math, after-battle Review) stay format-agnostic.

## Code

- [`src/lib/format.ts`](../src/lib/format.ts) — `BattleFormat`, labels, bring sizes, href helpers
- [`src/components/chrome/FormatSwitch.tsx`](../src/components/chrome/FormatSwitch.tsx) — Singles \| Doubles switch for Learn / Manuals
- Manuals: `TeamManual.format` via `manualFormat()` (defaults to `"singles"`)

## Viewing language

- **Singles:** bring 3, one on the field, ink chrome
- **Doubles:** bring 4 · pairs, teal accent (`--format-doubles-accent`), separate manuals shelf

Manual write-ups share one schema; only shelf + chrome + copy differ.
