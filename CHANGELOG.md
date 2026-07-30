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
* CI: an Android debug-build job (real `expo prebuild` + `gradlew assembleDebug`
  on GitHub's Android SDK/JDK), alongside the existing typecheck/lint/web-export
  checks.
* The core identify flow: record a clip (`expo-audio`), upload it to a
  configured wildecho-api instance's `POST /v1/identify`, and show ranked
  species candidates, including the backend's `non_animal_top_class` and
  `low_confidence` warnings.
* A Settings screen to configure the wildecho-api server URL, with a live
  `GET /v1/health` check showing whether the model is actually loaded there.
  The URL is stored via `expo-secure-store`.

### Changed

* Android is now the current focus platform for development and verification,
  since a working iOS Simulator isn't available in the primary dev
  environment. The app itself remains ordinary cross-platform Expo/React
  Native - nothing Android-specific has been added to the code.

[Unreleased]: https://github.com/arunrajiah/wildecho/commits/main
