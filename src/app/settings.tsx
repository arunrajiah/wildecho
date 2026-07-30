import { useQuery } from "@tanstack/react-query";
import { router } from "expo-router";
import { useState } from "react";
import { Pressable, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { getHealth } from "@/lib/api/client";
import { useSettingsStore } from "@/stores/settings-store";

export default function SettingsScreen() {
  const apiBaseUrl = useSettingsStore((state) => state.apiBaseUrl);
  const setApiBaseUrl = useSettingsStore((state) => state.setApiBaseUrl);
  const [draft, setDraft] = useState(apiBaseUrl ?? "");
  const [checkedUrl, setCheckedUrl] = useState(apiBaseUrl);

  const canSave = draft.trim().length > 0;

  const healthQuery = useQuery({
    queryKey: ["health", checkedUrl],
    queryFn: () => getHealth(checkedUrl as string),
    enabled: Boolean(checkedUrl),
    retry: false,
    staleTime: 30_000,
  });

  const handleSave = async () => {
    await setApiBaseUrl(draft);
    setCheckedUrl(draft.trim() || null);
  };

  return (
    <SafeAreaView className="flex-1 bg-white dark:bg-neutral-950">
      <View className="flex-1 gap-4 px-6 py-4">
        <Pressable onPress={() => router.back()} hitSlop={12} className="self-start">
          <Text className="text-base text-blue-600 dark:text-blue-400">Back</Text>
        </Pressable>

        <Text className="text-2xl font-bold text-neutral-900 dark:text-neutral-50">
          wildecho-api server
        </Text>
        <Text className="text-sm text-neutral-500 dark:text-neutral-400">
          The URL of the wildecho-api instance this app should call. See{" "}
          github.com/arunrajiah/wildecho-api for how to self-host one.
        </Text>

        <TextInput
          value={draft}
          onChangeText={setDraft}
          placeholder="https://your-instance.example.com"
          placeholderTextColor="#9ca3af"
          autoCapitalize="none"
          autoCorrect={false}
          keyboardType="url"
          className="rounded-lg border border-neutral-300 px-4 py-3 text-base text-neutral-900 dark:border-neutral-700 dark:text-neutral-50"
        />

        <Pressable
          onPress={handleSave}
          disabled={!canSave}
          className={`items-center rounded-lg py-3 ${canSave ? "bg-blue-600" : "bg-blue-300 dark:bg-blue-950"}`}
        >
          <Text className="text-base font-semibold text-white">Save</Text>
        </Pressable>

        {checkedUrl ? (
          <View className="mt-2 rounded-lg border border-neutral-200 p-4 dark:border-neutral-800">
            {healthQuery.isLoading ? (
              <Text className="text-neutral-500 dark:text-neutral-400">Checking connection...</Text>
            ) : healthQuery.isError ? (
              <Text className="text-red-600 dark:text-red-400">
                Could not reach this server:{" "}
                {healthQuery.error instanceof Error ? healthQuery.error.message : "unknown error"}
              </Text>
            ) : healthQuery.data ? (
              <View className="gap-1">
                <Text
                  className={
                    healthQuery.data.model_loaded
                      ? "font-semibold text-emerald-600 dark:text-emerald-400"
                      : "font-semibold text-amber-600 dark:text-amber-400"
                  }
                >
                  {healthQuery.data.model_loaded
                    ? "Connected, model ready"
                    : "Connected, but the model isn't loaded on the server"}
                </Text>
                <Text className="text-sm text-neutral-500 dark:text-neutral-400">
                  wildecho-api v{healthQuery.data.version}
                  {healthQuery.data.num_classes ? ` - ${healthQuery.data.num_classes} classes` : ""}
                </Text>
              </View>
            ) : null}
          </View>
        ) : null}
      </View>
    </SafeAreaView>
  );
}
