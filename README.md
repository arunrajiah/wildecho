# WildEcho

**Mobile companion app for [wildecho-api](https://github.com/arunrajiah/wildecho-api)** -
record a short clip, get back ranked species candidates from Google's open
Perch 2.0 model.

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Expo SDK 57](https://img.shields.io/badge/Expo-SDK%2057-000020.svg)](https://expo.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-strict-3178C6.svg)](tsconfig.json)

## Status

The core loop works: configure a wildecho-api server URL in Settings, record
a clip, and get back ranked species candidates. There's no recording history,
no offline queueing, and no polish yet - this is the MVP flow, not a finished
app. All the actual ML inference and API logic lives in
[wildecho-api](https://github.com/arunrajiah/wildecho-api); this repo is just
the client.

**Android is the current focus platform.** The code is ordinary Expo/React
Native and stays cross-platform (nothing here is Android-specific), but
day-to-day development and verification target Android first for now. CI
builds a real Android debug APK on every push; there is no equivalent iOS
verification yet.

## Stack

- [Expo](https://expo.dev) SDK 57 (managed workflow)
- [Expo Router](https://docs.expo.dev/router/introduction/) - file-based routing, typed routes
- TypeScript, strict mode
- [NativeWind](https://www.nativewind.dev) - Tailwind CSS for React Native
- [TanStack Query](https://tanstack.com/query) - server state
- [Zustand](https://zustand.docs.pmnd.rs) - client state
- `expo-secure-store` - for anything sensitive stored on-device
- [pnpm](https://pnpm.io) - package manager

## Quickstart

Requires Node.js 20+ and pnpm. For native testing, Android Studio (Android
emulator) or a physical Android device via Expo Go; a physical device is the
easiest path if you don't already have the emulator set up.

```bash
git clone https://github.com/arunrajiah/wildecho.git
cd wildecho
pnpm install
pnpm start
```

Then press `a` (Android emulator) in the Expo CLI, or scan the QR code with
Expo Go on an Android device. iOS Simulator (`i`) and web (`w`) also work if
you have Xcode set up, but aren't the current verification focus.

Other scripts:

```bash
pnpm typecheck   # tsc --noEmit
pnpm lint        # eslint, via eslint-config-expo
pnpm android     # expo start --android
pnpm ios         # expo start --ios
pnpm web         # expo start --web
```

## Project layout

```
src/
  app/                    # Expo Router screens (file-based routing)
    _layout.tsx           # root layout: providers (TanStack Query, safe area, theme)
    index.tsx             # record a clip, view results
    settings.tsx          # configure the wildecho-api server URL
    about.tsx             # model info, taxa coverage, and the accuracy disclaimer
  components/
    prediction-row.tsx    # one species candidate in the results list
  lib/api/
    types.ts              # types mirroring wildecho-api's response schemas
    client.ts             # fetch client: identify(), getHealth(), getAbout(), typed errors
  stores/
    settings-store.ts     # Zustand store for the server URL (persisted via expo-secure-store)
  global.css              # Tailwind directives + CSS custom properties, consumed by NativeWind

eas.json                  # EAS Build profiles (development/preview/production)
PRIVACY.md                # Privacy policy (required for Play Console submission)
docs/play-store-listing.md  # Draft store listing copy, for review before submitting
```

## A note on pnpm + Metro

Metro (React Native's bundler) doesn't fully walk pnpm's symlinked,
content-addressed `node_modules` layout by default, which breaks resolution
of some packages' own subpath exports reached through a dependency's private
`node_modules` (e.g. NativeWind's dependency on `react-native-css-interop`).
`metro.config.js` sets `unstable_enableSymlinks` and
`unstable_enablePackageExports` to fix this, and `react-native-css-interop`
is listed as a direct dependency so pnpm hoists it to the project root where
Metro's resolver reliably finds it. If you hit a similar "Unable to resolve
module" error after adding a new dependency, this is usually the cause.

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for setup, commit conventions
(Conventional Commits), and the stack conventions to follow. See
[CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md) for community expectations.

## License

MIT, copyright 2026 Arun Rajiah. See [LICENSE](LICENSE).

---

If this is useful to you, [sponsoring](https://github.com/sponsors/arunrajiah)
helps keep it maintained.
