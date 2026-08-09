# WildEcho Privacy Policy

_Last updated: 2026-08-09_

WildEcho ("the app") is a mobile client for
[wildecho-api](https://github.com/arunrajiah/wildecho-api), an open-source,
self-hostable species identification service. This policy describes what the
app itself does with data. The app has no backend or servers operated by its
developer.

## What the app collects

**Nothing, by the app itself.** WildEcho has no analytics, no advertising or
tracking SDKs, and does not send any data to its developer or to any third
party the app's developer controls.

## What the app does with your data

- **Microphone audio.** When you record a clip, it is sent directly from your
  device to the wildecho-api server URL you configure in Settings, and only to
  that server. See "Self-hosted servers" below for what that means.
- **Server URL.** The address you enter in Settings is stored only on your
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

## Self-hosted servers

WildEcho is a client for wildecho-api, which you (or someone you trust)
deploys and operates independently. WildEcho's developer does not operate,
have access to, or receive data from any wildecho-api instance, unless they
also happen to be the operator of that specific server. If you use a server
run by someone else, that operator's own privacy practices govern the data
you send them - ask them if you're unsure what they do with it.

## Data retention and deletion

The app itself stores only your configured server URL, locally on your
device. Uninstalling the app removes it. WildEcho retains nothing else on
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
