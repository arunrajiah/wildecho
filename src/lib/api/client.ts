import type { ApiErrorBody, HealthResponse, IdentifyResponse } from "./types";

/**
 * Thrown for any non-2xx response wildecho-api returns. `code` is the stable
 * machine-readable string from the response body (e.g. "audio_too_short"),
 * `message` is the human-readable `detail` the backend says is safe to show
 * to an end user directly.
 */
export class ApiError extends Error {
  readonly code: string;
  readonly status: number;

  constructor(code: string, message: string, status: number) {
    super(message);
    this.name = "ApiError";
    this.code = code;
    this.status = status;
  }
}

/** Thrown when the request never reached the server at all (offline, wrong URL, timeout). */
export class NetworkError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "NetworkError";
  }
}

const REQUEST_TIMEOUT_MS = 60_000;

function normalizeBaseUrl(baseUrl: string): string {
  return baseUrl.trim().replace(/\/+$/, "");
}

async function parseJsonBody(response: Response): Promise<unknown> {
  try {
    return await response.json();
  } catch {
    return null;
  }
}

function isApiErrorBody(value: unknown): value is ApiErrorBody {
  return (
    typeof value === "object" &&
    value !== null &&
    typeof (value as Record<string, unknown>).error === "string" &&
    typeof (value as Record<string, unknown>).detail === "string"
  );
}

async function request<T>(url: string, init?: RequestInit): Promise<T> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  let response: Response;
  try {
    response = await fetch(url, { ...init, signal: controller.signal });
  } catch (cause) {
    if (cause instanceof Error && cause.name === "AbortError") {
      throw new NetworkError("The server took too long to respond. Check the URL and try again.");
    }
    throw new NetworkError(
      "Could not reach the server. Check the API URL in Settings and your network connection."
    );
  } finally {
    clearTimeout(timeout);
  }

  const body = await parseJsonBody(response);
  if (!response.ok) {
    if (isApiErrorBody(body)) {
      throw new ApiError(body.error, body.detail, response.status);
    }
    throw new ApiError(
      "unknown_error",
      `The server returned an unexpected error (HTTP ${response.status}).`,
      response.status
    );
  }
  return body as T;
}

/**
 * Uploads a recorded clip to `POST /v1/identify` and returns the ranked
 * species candidates. `fileUri` is a local file:// URI, typically from
 * `AudioRecorder.uri` after `stop()`.
 */
export async function identify(
  baseUrl: string,
  fileUri: string,
  filename: string,
  mimeType: string
): Promise<IdentifyResponse> {
  const formData = new FormData();
  // React Native's fetch/FormData polyfill expects this shape (uri/name/type)
  // for a file part, not a real Blob.
  formData.append("file", {
    uri: fileUri,
    name: filename,
    type: mimeType,
  } as unknown as Blob);

  return request<IdentifyResponse>(`${normalizeBaseUrl(baseUrl)}/v1/identify`, {
    method: "POST",
    body: formData,
    headers: { Accept: "application/json" },
  });
}

/** Calls `GET /v1/health` - used to confirm a configured server URL actually works. */
export async function getHealth(baseUrl: string): Promise<HealthResponse> {
  return request<HealthResponse>(`${normalizeBaseUrl(baseUrl)}/v1/health`, {
    headers: { Accept: "application/json" },
  });
}
