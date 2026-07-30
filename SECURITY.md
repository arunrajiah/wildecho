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

## Out of scope

- Vulnerabilities in Expo, React Native, or any third-party dependency - report
  those upstream.
- Vulnerabilities in a self-hosted wildecho-api instance the app happens to be
  pointed at - report those to
  [wildecho-api](https://github.com/arunrajiah/wildecho-api/security).
