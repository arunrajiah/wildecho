import * as SecureStore from "expo-secure-store";
import { Platform } from "react-native";
import { create } from "zustand";

/**
 * The self-hosted wildecho-api URL isn't actually a secret, but persisting it
 * via expo-secure-store rather than adding a second storage dependency
 * (AsyncStorage) just for one string is the simplest option given the stack
 * already includes it.
 *
 * expo-secure-store has no web implementation (its web shim is an empty
 * object), so on web we fall back to localStorage.
 */
const API_BASE_URL_KEY = "wildecho.apiBaseUrl";

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
  apiBaseUrl: string | null;
  /** True once the persisted value has been read at least once. */
  isLoaded: boolean;
  load: () => Promise<void>;
  setApiBaseUrl: (url: string | null) => Promise<void>;
}

export const useSettingsStore = create<SettingsState>((set) => ({
  apiBaseUrl: null,
  isLoaded: false,

  load: async () => {
    const stored = await storage.getItem(API_BASE_URL_KEY);
    set({ apiBaseUrl: stored, isLoaded: true });
  },

  setApiBaseUrl: async (url) => {
    const trimmed = url?.trim() || null;
    if (trimmed) {
      await storage.setItem(API_BASE_URL_KEY, trimmed);
    } else {
      await storage.deleteItem(API_BASE_URL_KEY);
    }
    set({ apiBaseUrl: trimmed });
  },
}));
