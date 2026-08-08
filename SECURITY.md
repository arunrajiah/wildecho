# Security Policy

## Supported versions

This project is pre-1.0 and unreleased. Only the latest commit on `main` is
supported.

| Version | Supported |
| ------- | --------- |
| main    | Yes       |
| < 1.0   | No        |

## Reporting a vulnerability

**Please do not report security issues in public GitHub issues.**

Report privately through either channel:

1. **GitHub Security Advisories** (preferred):
   [Report a vulnerability](https://github.com/arunrajiah/wildecho/security/advisories/new)
2. **Email**: arunrajiah@gmail.com with `[wildecho security]` in the subject.

Please include a description of the issue, steps to reproduce, the platform
(iOS/Android/web) and Expo Go or build type you tested, and any suggested fix.

### What to expect

Acknowledgement within 5 business days and an assessment within 14 days. This
is a volunteer-maintained project with no paid security team and no bug bounty
- please be patient.

## Threat model for this app

WildEcho is a client for [wildecho-api](https://github.com/arunrajiah/wildecho-api),
a self-hostable species identification service. Relevant considerations:

- **No credentials are hardcoded.** Anything sensitive (e.g. a custom API
  endpoint or key, once configurable) belongs in `expo-secure-store`, never in
  source, `app.json`, or a committed `.env` file.
- **The backend URL is user/operator configurable.** Since wildecho-api is
  self-hosted, this app talks to whatever endpoint it's pointed at. Validate
  and sanitize that value; never `eval` or otherwise trust server responses as
  code.
- **Audio permissions.** Microphone access is requested only when actually
  needed for recording, and only used for the identify flow - not for
  background or continuous capture.
- **Cleartext (plain HTTP) traffic is allowed on Android**, via
  `usesCleartextTraffic: true` (`app.json`, `expo-build-properties`). This is
  deliberate: wildecho-api's own default self-hosted setup (`docker compose
  up`) serves plain HTTP, and the primary use case here is a server on your
  own local network, e.g. `http://192.168.1.5:8000`. Android blocks cleartext
  traffic app-wide by default for apps targeting API 28+; we investigated
  scoping the exception to private IP ranges only (Android's network security
  config supports exact-hostname and domain-suffix matching, but *not* CIDR/IP
  ranges), concluded that isn't achievable with the standard mechanism, and
  chose the documented app-wide flag instead of a false sense of scoping.
  If you deploy wildecho-api behind Fly.io or Render (both force HTTPS), use
  the `https://` URL and this setting is simply unused for your traffic.

## Out of scope

- Vulnerabilities in Expo, React Native, or any third-party dependency - report
  those upstream.
- Vulnerabilities in a self-hosted wildecho-api instance the app happens to be
  pointed at - report those to
  [wildecho-api](https://github.com/arunrajiah/wildecho-api/security).
