# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to
[Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

* Project bootstrap: Expo SDK 57 (managed workflow), Expo Router with typed
  routes, TypeScript strict, NativeWind, TanStack Query, Zustand,
  expo-secure-store, pnpm.
* iOS bundle identifier and Android package: `dev.arunrajiah.wildecho`.
* ESLint (flat config, `eslint-config-expo`) and a `typecheck` script.
* A single placeholder screen; no recording, identification, or backend
  integration yet - that starts in a later phase.
* CI: an Android debug-build job (real `expo prebuild` + `gradlew assembleDebug`
  on GitHub's Android SDK/JDK), alongside the existing typecheck/lint/web-export
  checks.

### Changed

* Android is now the current focus platform for development and verification,
  since a working iOS Simulator isn't available in the primary dev
  environment. The app itself remains ordinary cross-platform Expo/React
  Native - nothing Android-specific has been added to the code.

[Unreleased]: https://github.com/arunrajiah/wildecho/commits/main
