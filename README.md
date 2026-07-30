# WildEcho

**Mobile companion app for [wildecho-api](https://github.com/arunrajiah/wildecho-api)** -
record a short clip, get back ranked species candidates from Google's open
Perch 2.0 model.

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Expo SDK 57](https://img.shields.io/badge/Expo-SDK%2057-000020.svg)](https://expo.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-strict-3178C6.svg)](tsconfig.json)

## Status: early bootstrap

This repo currently has project scaffolding and tooling only - **no
recording, no identification flow, and no backend integration yet.** It talks
to nothing. If you're looking for the actual ML inference and API, that lives
in [wildecho-api](https://github.com/arunrajiah/wildecho-api); this repo is
just the client that will eventually call it.

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

Requires Node.js 20+ and pnpm. For native testing, either Xcode (iOS
Simulator) or Android Studio (Android emulator); Expo Go works too for a quick
check on a physical device.

```bash
git clone https://github.com/arunrajiah/wildecho.git
cd wildecho
pnpm install
pnpm start
```

Then press `i` (iOS Simulator), `a` (Android emulator), or `w` (web) in the
Expo CLI, or scan the QR code with Expo Go.

Other scripts:

```bash
pnpm typecheck   # tsc --noEmit
pnpm lint        # eslint, via eslint-config-expo
pnpm ios         # expo start --ios
pnpm android     # expo start --android
pnpm web         # expo start --web
```

## Project layout

```
src/
  app/            # Expo Router screens (file-based routing)
    _layout.tsx   # root layout: providers (TanStack Query, safe area, theme)
    index.tsx     # placeholder home screen
  global.css      # Tailwind directives + CSS custom properties, consumed by NativeWind
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
