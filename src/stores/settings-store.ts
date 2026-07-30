import * as SecureStore from "expo-secure-store";
import { create } from "zustand";

/**
 * The self-hosted wildecho-api URL isn't actually a secret, but persisting it
 * via expo-secure-store rather than adding a second storage dependency
 * (AsyncStorage) just for one string is the simplest option given the stack
 * already includes it.
 */
const API_BASE_URL_KEY = "wildecho.apiBaseUrl";

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
    const stored = await SecureStore.getItemAsync(API_BASE_URL_KEY);
    set({ apiBaseUrl: stored, isLoaded: true });
  },

  setApiBaseUrl: async (url) => {
    const trimmed = url?.trim() || null;
    if (trimmed) {
      await SecureStore.setItemAsync(API_BASE_URL_KEY, trimmed);
    } else {
      await SecureStore.deleteItemAsync(API_BASE_URL_KEY);
    }
    set({ apiBaseUrl: trimmed });
  },
}));
