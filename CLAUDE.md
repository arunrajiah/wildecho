@AGENTS.md

# wildecho (mobile app)

Mobile companion app for [wildecho-api](https://github.com/arunrajiah/wildecho-api):
record a clip, send it to that backend, show ranked species candidates. This
repo is the client only - no ML inference here.

## Status
Early bootstrap. Scaffolding and tooling only; no recording, identify flow, or
backend integration yet.

## Stack
- Expo SDK 57 (managed workflow), Expo Router (typed routes), TypeScript strict
- NativeWind (Tailwind for RN), TanStack Query, Zustand, expo-secure-store
- pnpm

## Layout
- `src/app/` - Expo Router screens; `_layout.tsx` holds root providers
- `src/global.css` - Tailwind directives, consumed by NativeWind via metro.config.js

## Commands
- `pnpm start` / `pnpm ios` / `pnpm android` / `pnpm web` - run the app
- `pnpm typecheck` - `tsc --noEmit`
- `pnpm lint` - eslint via eslint-config-expo
- No test suite yet

## Conventions
- Conventional Commits; never add Claude/AI attribution to commits
- Don't introduce a second library for something the stack already covers
  (no Redux next to Zustand, no second styling system next to NativeWind)
- pnpm + Metro symlink gotcha: see README "A note on pnpm + Metro" before
  chasing a module-resolution error after adding a dependency

## Token efficiency
- Grep/Glob to the target file; read only the relevant section
- Don't re-read files after editing; verify once per batch of edits
- Keep progress narration and summaries to 2-3 sentences
