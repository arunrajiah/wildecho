import { useQuery } from "@tanstack/react-query";
import { router } from "expo-router";
import { ActivityIndicator, Linking, Pressable, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { getAbout } from "@/lib/api/client";
import { useSettingsStore } from "@/stores/settings-store";

const WILDECHO_REPO_URL = "https://github.com/arunrajiah/wildecho";

export default function AboutScreen() {
  const apiBaseUrl = useSettingsStore((state) => state.apiBaseUrl);

  const aboutQuery = useQuery({
    queryKey: ["about", apiBaseUrl],
    queryFn: () => getAbout(apiBaseUrl as string),
    enabled: Boolean(apiBaseUrl),
    staleTime: 5 * 60_000,
  });

  return (
    <SafeAreaView className="flex-1 bg-white dark:bg-neutral-950">
      <ScrollView className="flex-1 px-6 py-4" contentContainerClassName="pb-8">
        <Pressable onPress={() => router.back()} hitSlop={12} className="mb-4 self-start">
          <Text className="text-base text-blue-600 dark:text-blue-400">Back</Text>
        </Pressable>

        <Text className="mb-4 text-2xl font-bold text-neutral-900 dark:text-neutral-50">About</Text>

        {!apiBaseUrl ? (
          <Text className="text-base text-neutral-500 dark:text-neutral-400">
            Set up a server in Settings to see model details.
          </Text>
        ) : aboutQuery.isLoading ? (
          <ActivityIndicator />
        ) : aboutQuery.isError ? (
          <Text className="text-base text-red-600 dark:text-red-400">
            Could not load model info:{" "}
            {aboutQuery.error instanceof Error ? aboutQuery.error.message : "unknown error"}
          </Text>
        ) : aboutQuery.data ? (
          <View className="gap-6">
            <View className="rounded-lg bg-amber-50 p-4 dark:bg-amber-950">
              <Text className="mb-1 text-sm font-semibold text-amber-900 dark:text-amber-100">
                Accuracy and limitations
              </Text>
              <Text className="text-sm leading-5 text-amber-800 dark:text-amber-200">
                {aboutQuery.data.coverage.disclaimer}
              </Text>
            </View>

            <View>
              <Text className="mb-1 text-sm font-semibold text-neutral-900 dark:text-neutral-50">
                Coverage
              </Text>
              <Text className="text-sm text-neutral-500 dark:text-neutral-400">
                {aboutQuery.data.coverage.species_classes.toLocaleString()} species -{" "}
                {aboutQuery.data.coverage.birds.toLocaleString()} birds,{" "}
                {aboutQuery.data.coverage.non_bird_species.toLocaleString()} other taxa
              </Text>
            </View>

            <View>
              <Text className="mb-1 text-sm font-semibold text-neutral-900 dark:text-neutral-50">
                Model
              </Text>
              <Text className="mb-2 text-sm text-neutral-500 dark:text-neutral-400">
                {aboutQuery.data.attribution.model_name} by {aboutQuery.data.attribution.model_authors}
                , licensed {aboutQuery.data.attribution.model_license}. Not affiliated with or
                endorsed by Google.
              </Text>
              {Object.entries(aboutQuery.data.attribution.links).map(([label, url]) => (
                <Pressable
                  key={label}
                  onPress={() => Linking.openURL(url)}
                  className="mb-1"
                  hitSlop={4}
                >
                  <Text className="text-sm text-blue-600 dark:text-blue-400">
                    {label.replaceAll("_", " ")}
                  </Text>
                </Pressable>
              ))}
            </View>

            <View>
              <Text className="mb-1 text-sm font-semibold text-neutral-900 dark:text-neutral-50">
                This app
              </Text>
              <Text className="mb-2 text-sm text-neutral-500 dark:text-neutral-400">
                WildEcho is free, open source, and MIT licensed. It does no ML inference itself -
                all identification happens on the wildecho-api server you configured.
              </Text>
              <Pressable onPress={() => Linking.openURL(WILDECHO_REPO_URL)} hitSlop={4}>
                <Text className="text-sm text-blue-600 dark:text-blue-400">
                  github.com/arunrajiah/wildecho
                </Text>
              </Pressable>
            </View>
          </View>
        ) : null}
      </ScrollView>
    </SafeAreaView>
  );
}
