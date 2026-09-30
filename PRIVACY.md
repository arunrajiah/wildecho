# WildEcho Privacy Policy

_Last updated: 2026-09-30_

WildEcho ("the app") is a mobile client for
[wildecho-api](https://github.com/arunrajiah/wildecho-api), an open-source,
self-hostable species identification service. This policy describes what the
app does with data. By default the app uses a public wildecho-api server run
by its developer; you can switch to your own server in
Settings.

## What the app collects

**No accounts, analytics, advertising, or tracking.** WildEcho has no
analytics or advertising SDKs and does not ask who you are. The only data that
leaves your device is the audio clip you choose to identify, sent to the
server described below.

## What the app does with your data

- **Microphone audio.** When you record a clip, it is sent over HTTPS to the
  server in use (the public server by default, or the one you set in
  Settings), and only to that server. The public server processes each clip
  in memory to return species matches and does not store it.
- **Server URL.** If you enter your own server in Settings, the address is stored only on your
  device, using Android's secure, encrypted storage (`expo-secure-store`). It
  is never transmitted anywhere except as the destination of your own
  requests.
- **Optional feedback.** If the feedback feature is enabled on your configured
  server and you choose to submit a correction, that correction - and, if you
  attach one, the audio clip - is sent to that same server. Nowhere else.

## Permissions this app requests

- **Microphone**: requested only when you tap Record, used only to capture the
  clip you are about to identify. The app does not record in the background
  and does not access the microphone at any other time.

## The public server

The default server, wildecho.arunrajiah.com, runs wildecho-api on a cloud
server operated by WildEcho's developer. It processes each clip in memory and
keeps no copy of your audio; audio storage for feedback is turned off. It uses
your IP address, briefly and in memory, for rate limiting, and its web server
keeps standard short-lived access logs (IP address, time, and request path)
for security and troubleshooting.

## Self-hosted servers

If you switch to another wildecho-api server in Settings, that server is
deployed and operated independently. WildEcho's developer does not operate,
have access to, or receive data from such a server. If you use a server
run by someone else, that operator's own privacy practices govern the data
you send them - ask them if you're unsure what they do with it.

## Data retention and deletion

The app itself stores only your custom server URL (if you set one), locally
on your device. The public server does not retain your audio. Uninstalling the app removes it. WildEcho retains nothing else on
your behalf. Anything stored server-side (e.g. optional feedback
corrections) is governed by that server's own retention practices - see
wildecho-api's own documentation for its defaults if you operate one
yourself.

## Children's privacy

WildEcho is not directed at children and does not knowingly collect
information from anyone, regardless of age.

## Changes to this policy

Material changes will be reflected here with an updated date above, and noted
in [CHANGELOG.md](./CHANGELOG.md).

## Contact

Questions about this policy: arunrajiah@gmail.com, or open an issue at
<https://github.com/arunrajiah/wildecho/issues>.
