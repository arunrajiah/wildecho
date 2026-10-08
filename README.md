# WildEcho

**Mobile companion app for [wildecho-api](https://github.com/arunrajiah/wildecho-api)** -
record a short clip, get back ranked species candidates from Google's open
Perch 2.0 model.

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Expo SDK 57](https://img.shields.io/badge/Expo-SDK%2057-000020.svg)](https://expo.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-strict-3178C6.svg)](tsconfig.json)

> Part of an open wildlife toolkit. Not sure this is the project you need? See [which project to use](#part-of-an-open-wildlife-toolkit).

## Try it in your browser

A free web demo runs on Hugging Face:
**[huggingface.co/spaces/arunrajiah/wildecho](https://huggingface.co/spaces/arunrajiah/wildecho)**.
Upload or record a short clip and get ranked species candidates, with nothing to
install. It uses the same Perch 2.0 model and
[wildecho-api](https://github.com/arunrajiah/wildecho-api) code as the app, and the
same limits apply: it is mostly a bird model, it cannot hear bats, and it does not
use your location. Clips are not stored.

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

## Part of an open wildlife toolkit

Eight open source projects for listening to, identifying and mapping wildlife. They work together, but you rarely need more than one or two. Start from what you want to do:

| I want to | Use | What it is |
|---|---|---|
| See where birds and wildlife are moving, or download the data | [WildNetwork](https://github.com/arunrajiah/wildnetwork) | The live map and open data: [wildnetwork.arunrajiah.com](https://wildnetwork.arunrajiah.com) |
| Build a monitoring station from open hardware | [WildNetwork Base](https://github.com/arunrajiah/wildnetwork-base) | Software and a ready-to-flash SD card image (beta) for the open WildNetwork station (Raspberry Pi, microphone, solar) |
| Share detections from a BirdNET-Pi, BirdNET-Go, camera trap or bat detector you already have | [wdx-agent](https://github.com/arunrajiah/wdx-agent) | One small program that sends your station's detections. BirdWeather stations are already included and need nothing |
| Follow your own station on your phone | [BirdEcho](https://github.com/arunrajiah/birdecho) | Android app for BirdNET-Pi, BirdNET-Go and BirdWeather stations |
| Identify a sound you just heard | [WildEcho](https://github.com/arunrajiah/wildecho) (this project) | Phone app: record a clip, get ranked species |
| Run your own sound identification server | [wildecho-api](https://github.com/arunrajiah/wildecho-api) | Self-hosted species identification from audio, on CPU, no API keys |
| Check camera trap predictions before you use them | [SpeciesNet Studio](https://github.com/arunrajiah/speciesnet-studio) | Self-hosted review of SpeciesNet results |
| Make your own software or device produce or read detections in a common format | [WDX](https://github.com/arunrajiah/wildlife-detection-exchange) | The open format for one AI wildlife detection; maps to Darwin Core |

**How this one fits.** WildEcho identifies a sound you record on your phone, using a wildecho-api server.

**How they connect:** stations (a WildNetwork Base, BirdNET-Pi, BirdNET-Go, camera traps) produce detections; wdx-agent sends them in the WDX format; WildNetwork maps them. Connected today: wdx-agent and the WildNetwork Base send to WildNetwork, and WildEcho uses wildecho-api. Planned: Base setup in BirdEcho, and WDX export from wildecho-api and SpeciesNet Studio.

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for setup, commit conventions
(Conventional Commits), and the stack conventions to follow. See
[CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md) for community expectations.

## License

MIT, copyright 2026 Arun Rajiah. See [LICENSE](LICENSE).

---

If this is useful to you, [sponsoring](https://github.com/sponsors/arunrajiah)
helps keep it maintained.
