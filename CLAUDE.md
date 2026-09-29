@AGENTS.md

# wildecho (mobile app)

Mobile client for [wildecho-api](https://github.com/arunrajiah/wildecho-api): record a
clip, send it to that backend, show ranked species candidates. No ML inference here.

## Status
Feature complete v1 (record, identify, settings, about). Android only (package
`dev.arunrajiah.wildecho`); Play Console listing done, production release is a draft.
No local emulator works on this Mac; verify via EAS preview APK on a device.

## Stack
- Expo SDK 57, Expo Router (typed routes), TypeScript strict
- NativeWind (brand palette in tailwind.config.js), TanStack Query, Zustand, expo-secure-store, expo-audio
- pnpm with `.npmrc` `node-linker=hoisted` (required for Metro/Babel; don't remove)

## Layout
- `src/app/` screens (`index` record/results, `settings`, `about`); `_layout.tsx` providers
- `src/components/` BrandMark, PredictionRow; `src/lib/api/` API client; `src/stores/` Zustand
- `assets/images/` icon set (source generator lives outside the repo; brand mark = singing bird + echo arcs)
- `secrets/play-service-account.json` Play API key (gitignored, never commit)

## Commands
- `pnpm start` / `pnpm android`; `pnpm typecheck`; `pnpm lint`; no test suite
- `npx eas-cli build -p android --profile production --auto-submit` builds an AAB, bumps
  versionCode in app.json (commit it), and uploads to the Play internal track
- Free EAS plan has a monthly build quota; fallback is `--local` (needs
  JAVA_HOME=/opt/homebrew/opt/openjdk@17 and ANDROID_HOME)
- Promote to production via Play Developer API (edits > tracks/production > commit)

## Conventions
- Conventional Commits; never add Claude/AI attribution to commits
- No em dashes in user-facing strings
- One library per concern (Zustand, NativeWind); don't add parallels
- `blockedPermissions` in app.json strips FOREGROUND_SERVICE perms that expo-audio merges in (Play declaration otherwise required)

## Token efficiency
- Grep/Glob to the target file; read only the relevant section
- Don't re-read files after editing; verify once per batch of edits
- Keep progress narration and summaries to 2-3 sentences
