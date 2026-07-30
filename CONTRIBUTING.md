# Contributing to WildEcho

Thanks for considering a contribution. WildEcho is the mobile companion app
for [wildecho-api](https://github.com/arunrajiah/wildecho-api), a
self-hostable species identification service - this repo is the client, it
does no ML inference itself.

By participating you agree to abide by the [Code of Conduct](CODE_OF_CONDUCT.md).

## Status

This project is in early bootstrap. There is no recording, identification, or
backend integration yet - just the Expo/TypeScript scaffold and tooling.
Expect the structure here to change quickly.

## Development setup

Requires Node.js 20+ and [pnpm](https://pnpm.io). Android is the current focus
platform - Android Studio (Android emulator) or Expo Go on a physical Android
device are the easiest ways to test. iOS Simulator also works if you have
Xcode set up, but isn't part of the current verification loop or CI.

```bash
git clone https://github.com/arunrajiah/wildecho.git
cd wildecho
pnpm install
pnpm start
```

Then press `i` for iOS Simulator, `a` for Android emulator, or `w` for web.

## Before you open a PR

```bash
pnpm typecheck && pnpm lint
```

Both must pass. There is no test suite yet; if you add non-trivial logic,
consider adding one.

## Commit conventions

We use [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/).
Keep the subject line under 72 characters.

```
feat(record): add microphone permission flow
fix(api): handle a 503 from wildecho-api gracefully
docs(readme): update quickstart
chore(deps): bump expo to 57.0.10
```

Common types: `feat`, `fix`, `docs`, `test`, `refactor`, `chore`, `ci`.

Please keep pull requests small and single-purpose, and update
[CHANGELOG.md](CHANGELOG.md) under `## [Unreleased]` for anything user-facing.

## Stack

- Expo SDK (managed workflow) + Expo Router (file-based routing, typed routes)
- TypeScript, strict mode
- [NativeWind](https://www.nativewind.dev) for styling (Tailwind CSS for React Native)
- [TanStack Query](https://tanstack.com/query) for server state
- [Zustand](https://zustand.docs.pmnd.rs) for client state
- `expo-secure-store` for anything sensitive on-device
- pnpm as the package manager

Please keep new dependencies consistent with this stack rather than
introducing a second library for something already covered (e.g. don't add
Redux alongside Zustand, or a second styling system alongside NativeWind).

## Security

Please do not open public issues for vulnerabilities. See
[SECURITY.md](SECURITY.md).
