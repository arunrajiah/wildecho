import * as Location from "expo-location";
import * as SecureStore from "expo-secure-store";
import { Platform } from "react-native";

import type { IdentifyResponse, Prediction } from "./api/types";

/**
 * Sharing identifications with Wildlife Network (https://wlnw.org), the open map of wildlife detections.
 * Only when the user has switched sharing on. Each share is one WDX event (https://github.com/arunrajiah/wildlife-detection-exchange):
 * the best match, the time, and the phone's location rounded to about 1 km. The audio clip is never sent.
 */
export const WILDNETWORK_URL = "https://wlnw.org";
const KEY_STORE = "wildecho.wildnetwork.device";
const APP_VERSION = "1.1.0";

interface DeviceKey {
  deviceId: string;
  apiKey: string;
}

const store = {
  get: (k: string) => (Platform.OS === "web" ? Promise.resolve(window.localStorage.getItem(k)) : SecureStore.getItemAsync(k)),
  set: (k: string, v: string) =>
    Platform.OS === "web" ? Promise.resolve(window.localStorage.setItem(k, v)) : SecureStore.setItemAsync(k, v),
};

/** Only confident animal identifications are worth sharing. */
export function shareable(result: IdentifyResponse): Prediction | null {
  const top = result.predictions[0];
  if (!top || result.non_animal_top_class || result.low_confidence || top.low_confidence) return null;
  if (!/^[A-Z][a-z]+ [a-z-]+$/.test(top.scientific_name)) return null; // species level only
  return top;
}

/** This install's Wildlife Network key: registered once on first share and kept in secure storage. */
async function deviceKey(): Promise<DeviceKey> {
  const saved = await store.get(KEY_STORE);
  if (saved) return JSON.parse(saved) as DeviceKey;
  const res = await fetch(`${WILDNETWORK_URL}/api/v1/devices`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ name: "WildEcho app", model: "wildecho-phone", source: "wildecho-api" }),
  });
  const body = (await res.json().catch(() => ({}))) as Partial<DeviceKey> & { error?: string };
  if (!res.ok || !body.deviceId || !body.apiKey) {
    throw new Error(body.error ?? "Wildlife Network could not register this phone. Please try again later.");
  }
  const key = { deviceId: body.deviceId, apiKey: body.apiKey };
  await store.set(KEY_STORE, JSON.stringify(key));
  return key;
}

/** Coarse location only (about 1 km is all that is shared). Asks for permission the first time. */
async function coarseLocation(): Promise<{ latitude: number; longitude: number }> {
  let perm = await Location.getForegroundPermissionsAsync();
  if (!perm.granted && perm.canAskAgain) perm = await Location.requestForegroundPermissionsAsync();
  if (!perm.granted) throw new Error("Location is off for WildEcho, so this identification was not shared.");
  const last = await Location.getLastKnownPositionAsync({ maxAge: 30 * 60_000 });
  const pos = last ?? (await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Low }));
  return { latitude: pos.coords.latitude, longitude: pos.coords.longitude };
}

const round2 = (v: number) => Math.round(v * 100) / 100;

/** WDX 0.2 event for one identification. Pure, so it can be checked without a phone. */
export function toWdx(
  result: IdentifyResponse,
  top: Prediction,
  deviceId: string,
  where: { latitude: number; longitude: number },
  recordedAt: Date,
): Record<string, unknown> {
  const detection: Record<string, unknown> = {
    scientificName: top.scientific_name,
    taxonRank: "species",
    confidence: Math.round(top.confidence * 10_000) / 10_000,
    classifier: { name: "Perch", version: result.model_version },
    pipeline: [{ role: "classifier", name: "wildecho-api", version: result.model_version }],
  };
  if (top.common_name) detection.vernacularName = top.common_name;
  return {
    wdx: "0.2",
    eventId: `wildecho-api:${result.request_id}`,
    eventStart: recordedAt.toISOString(),
    deployment: {
      deploymentId: deviceId,
      latitude: round2(where.latitude),
      longitude: round2(where.longitude),
      coordinateUncertaintyMeters: 1110,
      sensorType: "acoustic-recorder",
      sensorModel: "phone",
    },
    detection,
    review: { status: "unreviewed" },
    source: { system: "wildecho-api", systemVersion: `wildecho-app/${APP_VERSION}`, sourceRecordId: result.request_id },
    license: "CC-BY-4.0",
  };
}

/** Shares one identification. Resolves to the species shared, or throws with a message safe to show. */
export async function shareIdentification(result: IdentifyResponse, recordedAt: Date): Promise<string> {
  const top = shareable(result);
  if (!top) throw new Error("Only confident animal identifications are shared.");
  const [key, where] = await Promise.all([deviceKey(), coarseLocation()]);
  const res = await fetch(`${WILDNETWORK_URL}/api/v1/events`, {
    method: "POST",
    headers: { authorization: `Bearer ${key.apiKey}`, "content-type": "application/json" },
    body: JSON.stringify(toWdx(result, top, key.deviceId, where, recordedAt)),
  });
  const body = (await res.json().catch(() => ({}))) as { received?: number; rejected?: number };
  if (!res.ok || !body.received || body.rejected) throw new Error("Wildlife Network did not accept this identification.");
  return top.common_name ?? top.scientific_name;
}
