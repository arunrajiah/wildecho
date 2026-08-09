# Play Store listing draft

Copy-paste starting point for the Google Play Console listing. **Review before
submitting** - this is drafted content, not something that's been through
Play Console itself (I don't have access to your account), and the Data
Safety section in particular has real compliance stakes if answered
inaccurately.

## App details

**App name** (max 30 characters): `WildEcho`

**Short description** (max 80 characters, 78 used):
```
Record wildlife sounds, get species candidates from your own hosted server
```

**Full description** (max 4000 characters):

```
WildEcho records a short clip of an animal call and sends it to a
wildecho-api server - one you or someone you trust runs yourself - which
returns ranked species candidates using Google's open Perch 2.0 bioacoustics
model.

HOW IT WORKS
1. Point the app at your wildecho-api server (Settings)
2. Record a few seconds of an animal call
3. Get back ranked species candidates with confidence scores

SELF-HOSTED, NOT A CLOUD SERVICE
This app has no backend of its own. It's a client for wildecho-api
(github.com/arunrajiah/wildecho-api), an open-source service you deploy
yourself - on your own machine, a small VPS, or a platform like Fly.io or
Render. Your audio goes to the server you configure, nowhere else.

ACCURACY AND LIMITATIONS - PLEASE READ
Perch 2.0's training data is heavily bird-weighted: about 70% of its species
classes are birds, and its coverage of insects, frogs, and mammals is much
thinner. There is no bat coverage at all - bat echolocation is largely
ultrasonic and outside what this model can hear. Treat non-bird results as
leads to verify, not identifications. Full details are on the app's About
screen and in the wildecho-api documentation.

OPEN SOURCE
Both the app and the backend are MIT licensed and open source. Perch 2.0
itself is Apache-2.0, copyright Google LLC - this app is not affiliated
with or endorsed by Google.

- App: github.com/arunrajiah/wildecho
- Backend: github.com/arunrajiah/wildecho-api
- Model: github.com/google-research/perch
```

**Category**: Education (alternative: Tools - your call; Education fits the
"identify what you're hearing" framing better).

**Tags/keywords**: bioacoustics, birdwatching, wildlife, species identification,
self-hosted, open source

**Contact email**: arunrajiah@gmail.com

**Privacy policy URL**: `https://github.com/arunrajiah/wildecho/blob/main/PRIVACY.md`
(a GitHub blob URL is a publicly accessible page and satisfies Play Console's
requirement; a GitHub Pages URL would look cleaner if you set one up later)

## Data Safety form (draft answers - verify against the live form)

Google Play's Data Safety section changes its exact wording periodically;
treat this as a starting point, not a final answer key.

**Does your app collect or share any of the required user data types?**
Yes.

**Data type: Audio (Voice or sound recordings)**
- Collected: Yes
- Shared: No (not shared with the app developer or any third party the
  developer controls - it is sent only to the server URL the user
  personally configures, which Play Console's model doesn't have a clean
  category for; declare it as collected-and-transmitted-off-device, and
  consider adding a note in the listing description clarifying the
  self-hosted model, since the form's checkboxes don't capture "user directs
  their own data to their own infrastructure" precisely)
- Purpose: App functionality
- Is this data processed ephemerally: consider "Yes" if you don't want to
  imply the developer retains it - the developer never receives it at all
- Is data collection required or optional: Required (core function of the app)

**All other data types (location, contacts, financial info, etc.)**: Not
collected.

**Security practices**
- Data is encrypted in transit: depends on whether the user's configured
  server uses HTTPS. The app supports both; answer honestly based on what
  you can guarantee, which is "not always" since self-hosted plain-HTTP
  servers are explicitly supported (see SECURITY.md's cleartext note). Play
  Console may want you to state this is user/deployment-dependent.
- Users can request data deletion: Yes - describe as "uninstall the app" for
  the server URL stored locally, and "contact your server's operator" for
  anything stored server-side.

## Screenshots

Not yet produced - needs the app actually running on a device/emulator with
real content in view (record screen, results screen, settings screen, about
screen). At least 2 required by Play Console, phone-size (1080x1920 or
similar) recommended.

## Content rating questionnaire

Should come back as "Everyone" / low-risk across the board - no user-generated
content shared publicly, no violence/mature themes, no gambling, etc. The
"does your app collect location" and similar questions should all be "No"
per the Data Safety answers above.
