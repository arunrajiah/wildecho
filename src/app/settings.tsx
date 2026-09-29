import { useQuery } from "@tanstack/react-query";
import { router } from "expo-router";
import { useState } from "react";
import { Pressable, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { getHealth } from "@/lib/api/client";
import { validateApiBaseUrl } from "@/lib/validate-url";
import { DEFAULT_API_BASE_URL, useSettingsStore } from "@/stores/settings-store";

export default function SettingsScreen() {
  const apiBaseUrl = useSettingsStore((state) => state.apiBaseUrl);
  const isCustom = useSettingsStore((state) => state.isCustom);
  const setApiBaseUrl = useSettingsStore((state) => state.setApiBaseUrl);
  const [draft, setDraft] = useState(isCustom ? (apiBaseUrl ?? "") : "");
  const [checkedUrl, setCheckedUrl] = useState(apiBaseUrl);

  // Only surface an error once the user has typed something - an empty field
  // just disables Save silently, rather than nagging before they've started.
  const validationError = draft.trim() ? validateApiBaseUrl(draft) : null;
  const canSave = draft.trim().length > 0 && validationError === null;

  const healthQuery = useQuery({
    queryKey: ["health", checkedUrl],
    queryFn: () => getHealth(checkedUrl as string),
    enabled: Boolean(checkedUrl),
    retry: false,
    staleTime: 30_000,
  });

  const handleSave = async () => {
    // Belt and suspenders: the button is disabled when invalid, but a
    // TextInput's onSubmitEditing (return key) can still fire independently.
    if (!canSave) {
      return;
    }
    await setApiBaseUrl(draft);
    setCheckedUrl(useSettingsStore.getState().apiBaseUrl);
  };

  const handleUseDefault = async () => {
    await setApiBaseUrl(null);
    setDraft("");
    setCheckedUrl(DEFAULT_API_BASE_URL);
  };

  return (
    <SafeAreaView className="flex-1 bg-white dark:bg-neutral-950">
      <View className="flex-1 px-6 py-4">
        <Pressable onPress={() => router.back()} hitSlop={12} className="self-start">
          <Text className="text-base font-medium text-brand-500">Back</Text>
        </Pressable>

        <Text className="mt-5 text-3xl font-bold tracking-tight text-neutral-900 dark:text-neutral-50">
          Server
        </Text>
        <Text className="mt-2 text-sm leading-5 text-neutral-500 dark:text-neutral-400">
          {isCustom
            ? "WildEcho is using your own wildecho-api server."
            : "WildEcho is using the free public server. Running your own wildecho-api instance? Enter its URL below (see github.com/arunrajiah/wildecho-api)."}
        </Text>

        <View className="mt-6 gap-4">
          <Text className="text-xs font-semibold uppercase tracking-widest text-neutral-400 dark:text-neutral-500">
            {isCustom ? "Your server URL" : "Custom server URL (optional)"}
          </Text>
          <TextInput
            value={draft}
            onChangeText={setDraft}
            onSubmitEditing={handleSave}
            placeholder="https://your-instance.example.com"
            placeholderTextColor="#9ca3af"
            autoCapitalize="none"
            autoCorrect={false}
            keyboardType="url"
            returnKeyType="done"
            className={`rounded-2xl border bg-neutral-50 px-5 py-4 text-base text-neutral-900 dark:bg-neutral-900 dark:text-neutral-50 ${
              validationError
                ? "border-red-500 dark:border-red-500"
                : "border-neutral-200 dark:border-neutral-800"
            }`}
          />
          {validationError ? (
            <Text className="text-sm text-red-600 dark:text-red-400">{validationError}</Text>
          ) : null}

          <Pressable
            onPress={handleSave}
            disabled={!canSave}
            className={`items-center rounded-full py-4 ${
              canSave ? "bg-brand-500 active:bg-brand-600" : "bg-brand-100 dark:bg-brand-950"
            }`}
          >
            <Text
              className={`text-base font-semibold ${
                canSave ? "text-white" : "text-brand-400 dark:text-brand-700"
              }`}
            >
              Save
            </Text>
          </Pressable>

          {isCustom ? (
            <Pressable onPress={handleUseDefault} hitSlop={8} className="items-center py-1">
              <Text className="text-sm font-medium text-brand-500">Use the public server instead</Text>
            </Pressable>
          ) : null}
        </View>

        {checkedUrl ? (
          <View className="mt-6 rounded-2xl bg-neutral-50 p-5 dark:bg-neutral-900">
            {healthQuery.isLoading ? (
              <Text className="text-neutral-500 dark:text-neutral-400">Checking connection...</Text>
            ) : healthQuery.isError ? (
              <View className="flex-row items-start gap-2.5">
                <View className="mt-1.5 h-2.5 w-2.5 rounded-full bg-red-500" />
                <Text className="flex-1 text-sm leading-5 text-red-600 dark:text-red-400">
                  Could not reach this server:{" "}
                  {healthQuery.error instanceof Error ? healthQuery.error.message : "unknown error"}
                </Text>
              </View>
            ) : healthQuery.data ? (
              <View className="flex-row items-start gap-2.5">
                <View
                  className={`mt-1.5 h-2.5 w-2.5 rounded-full ${
                    healthQuery.data.model_loaded ? "bg-emerald-500" : "bg-amber-500"
                  }`}
                />
                <View className="flex-1 gap-0.5">
                  <Text
                    className={
                      healthQuery.data.model_loaded
                        ? "text-base font-semibold text-emerald-600 dark:text-emerald-400"
                        : "text-base font-semibold text-amber-600 dark:text-amber-400"
                    }
                  >
                    {healthQuery.data.model_loaded
                      ? "Connected, model ready"
                      : "Connected, but the model isn't loaded on the server"}
                  </Text>
                  <Text className="text-sm text-neutral-500 dark:text-neutral-400">
                    wildecho-api v{healthQuery.data.version}
                    {healthQuery.data.num_classes
                      ? ` · ${healthQuery.data.num_classes.toLocaleString()} classes`
                      : ""}
                  </Text>
                </View>
              </View>
            ) : null}
          </View>
        ) : null}
      </View>
    </SafeAreaView>
  );
}
