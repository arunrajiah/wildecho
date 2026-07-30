/**
 * A small, deliberately hand-rolled URL check for the wildecho-api server field.
 *
 * This does NOT use the global `URL` constructor. React Native's bundled `URL`
 * (react-native/Libraries/Blob/URL.js) is a lightweight regex-based shim whose
 * constructor does not throw on malformed input when no base URL is given -
 * `new URL("not a url")` silently succeeds on iOS/Android. On web, though,
 * `react-native-web` runs in a real browser, where the native `URL` global
 * DOES throw for the same input. Relying on a try/catch around `new URL()`
 * would therefore validate strictly on web and not at all on native - exactly
 * backwards from what "Android is the current focus platform" calls for.
 * This function is fully self-contained so behaviour is identical everywhere.
 */
const HTTP_URL_PATTERN = /^https?:\/\/[^\s/]+(?::\d+)?(\/[^\s]*)?$/i;

/** Returns an error message if `input` isn't usable as an API base URL, else null. */
export function validateApiBaseUrl(input: string): string | null {
  const trimmed = input.trim();

  if (!trimmed) {
    return "Enter a server URL.";
  }
  if (!/^https?:\/\//i.test(trimmed)) {
    return "The URL must start with http:// or https://.";
  }
  if (!HTTP_URL_PATTERN.test(trimmed)) {
    return "That doesn't look like a valid URL.";
  }
  return null;
}
