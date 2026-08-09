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
* Server URL validation before saving: rejects empty input, missing
  `http(s)://` scheme, and malformed URLs, with an inline error message.
* An About screen: fetches `GET /v1/about` live and shows its accuracy
  disclaimer (bird bias, no bat coverage), taxa coverage counts, and model
  attribution. The results screen also shows a shorter warning whenever the
  top prediction isn't a bird, since that's specifically when Perch's
  bird-heavy training shows up as reduced reliability.
* Real app icon, adaptive icon layers, and splash image, replacing Expo's
  default template assets.
* `eas.json` build profiles (development/preview/production) and an EAS
  project, for producing signed Android builds via `eas build`.
* `PRIVACY.md` and a draft Play Store listing (`docs/play-store-listing.md`),
  ahead of a Play Console submission.

### Fixed

* EAS cloud builds failed at the Gradle bundling step with `Cannot find module
  'babel-preset-expo'`, then (after fixing that) `Cannot find module
  '@babel/plugin-transform-react-jsx'`. Root cause: `babel-preset-expo` was
  never listed as a direct dependency (only pulled in transitively), and
  pnpm's default strict `node_modules` isolation means Metro's Babel
  transform worker - which resolves plugins via plain `require()` from the
  project root, not from within `babel-preset-expo`'s own package - can't see
  packages that aren't hoisted there. Fixed by adding `babel-preset-expo` as
  an explicit devDependency and switching pnpm to `node-linker=hoisted`
  (`.npmrc`) so `node_modules` behaves like npm/yarn's flat layout Metro
  expects, instead of chasing each individual missing transitive plugin.

* `expo-audio`'s config plugin defaults to requesting background-playback
  permissions (`FOREGROUND_SERVICE`, `FOREGROUND_SERVICE_MEDIA_PLAYBACK`)
  that this app doesn't use - recording only ever happens in the foreground.
  Disabled via the plugin's `enableBackgroundPlayback: false` option, and set
  a specific microphone permission rationale string instead of the generic
  default.

* Android was silently blocking all `http://` requests (its default
  cleartext-traffic policy for apps targeting API 28+), even though the
  Settings screen accepts `http://` URLs for the common local-network
  self-hosting case. Fixed via `expo-build-properties`'
  `android.usesCleartextTraffic`. See SECURITY.md for why this is an
  app-wide flag rather than scoped to private IP ranges.

### Changed

* Android is now the current focus platform for development and verification,
  since a working iOS Simulator isn't available in the primary dev
  environment. The app itself remains ordinary cross-platform Expo/React
  Native - nothing Android-specific has been added to the code.

[Unreleased]: https://github.com/arunrajiah/wildecho/commits/main
