# Ringside

Personal companion for **Pokémon Champions** (Regulation M-C). Teaches the format, then opens a legal dex, compare, and team board.

## Users

Primary user is the site owner. Job: learn Champions systems, look up a Pokémon fast, compare two or three, sketch a six.

## Position

Teaching companion, not a usage spreadsheet. Instant local catalog. Atmosphere comes from official types and each Pokémon’s art palette.

## Platform

`web`. Phone and desktop are different shells.

## Stack

Next.js App Router, TypeScript, Tailwind v4, Motion, TanStack Query, Zustand (IDs only), nuqs, MiniSearch. Delegated from the approved plan.

## Constraints

- Champions-legal Pokémon and mechanics only. Pokémon GO is later.
- Browser never searches PokeAPI. Catalog is synced and committed.
- Zustand stores slugs, not API blobs.
- Fan site: no official Nintendo mark as ours. Credit PokeAPI.
- Uncertain Champions numbers get a source and a date.

## Open

Brand name may change. Ranked meta lives on `/meta` (committed Champions Battle Data snapshot; refresh with `npm run sync:ranked`). `/usage` redirects there.
