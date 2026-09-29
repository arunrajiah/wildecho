import * as SecureStore from "expo-secure-store";
import { Platform } from "react-native";
import { create } from "zustand";

/**
 * The wildecho-api URL isn't actually a secret, but persisting it
 * via expo-secure-store rather than adding a second storage dependency
 * (AsyncStorage) just for one string is the simplest option given the stack
 * already includes it.
 *
 * expo-secure-store has no web implementation (its web shim is an empty
 * object), so on web we fall back to localStorage.
 */
const API_BASE_URL_KEY = "wildecho.apiBaseUrl";

/** Public instance used until the user points the app at their own server. */
export const DEFAULT_API_BASE_URL =
  process.env.EXPO_PUBLIC_DEFAULT_API_URL ?? "https://arunrajiah-wildecho-api.hf.space";

const storage = {
  getItem: (key: string) =>
    Platform.OS === "web"
      ? Promise.resolve(window.localStorage.getItem(key))
      : SecureStore.getItemAsync(key),
  setItem: (key: string, value: string) =>
    Platform.OS === "web"
      ? Promise.resolve(window.localStorage.setItem(key, value))
      : SecureStore.setItemAsync(key, value),
  deleteItem: (key: string) =>
    Platform.OS === "web"
      ? Promise.resolve(window.localStorage.removeItem(key))
      : SecureStore.deleteItemAsync(key),
};

interface SettingsState {
  /** The server in use: the user's custom URL, else the public default. */
  apiBaseUrl: string | null;
  /** True when the user has saved their own server URL. */
  isCustom: boolean;
  /** True once the persisted value has been read at least once. */
  isLoaded: boolean;
  load: () => Promise<void>;
  setApiBaseUrl: (url: string | null) => Promise<void>;
}

export const useSettingsStore = create<SettingsState>((set) => ({
  apiBaseUrl: null,
  isCustom: false,
  isLoaded: false,

  load: async () => {
    const stored = await storage.getItem(API_BASE_URL_KEY);
    set({ apiBaseUrl: stored || DEFAULT_API_BASE_URL, isCustom: Boolean(stored), isLoaded: true });
  },

  /** Pass null (or the default URL) to go back to the public server. */
  setApiBaseUrl: async (url) => {
    const trimmed = url?.trim().replace(/\/+$/, "") || null;
    if (trimmed && trimmed !== DEFAULT_API_BASE_URL) {
      await storage.setItem(API_BASE_URL_KEY, trimmed);
    } else {
      await storage.deleteItem(API_BASE_URL_KEY);
    }
    const isCustom = Boolean(trimmed && trimmed !== DEFAULT_API_BASE_URL);
    set({ apiBaseUrl: isCustom ? trimmed : DEFAULT_API_BASE_URL, isCustom });
  },
}));
