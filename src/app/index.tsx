import { useMutation } from "@tanstack/react-query";
import { Link } from "expo-router";
import {
  getRecordingPermissionsAsync,
  RecordingPresets,
  requestRecordingPermissionsAsync,
  setAudioModeAsync,
  useAudioRecorder,
  useAudioRecorderState,
} from "expo-audio";
import { useState } from "react";
import { ActivityIndicator, Pressable, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { BrandMark } from "@/components/brand-mark";
import { PredictionRow } from "@/components/prediction-row";
import { identify } from "@/lib/api/client";
import type { IdentifyResponse, Prediction } from "@/lib/api/types";
import { useSettingsStore } from "@/stores/settings-store";

const GROUP_LABELS: Record<Prediction["taxonomic_group"], string> = {
  bird: "Bird",
  frog: "Frog",
  insect: "Insect",
  mammal: "Mammal",
  other: "Other",
};

export default function HomeScreen() {
  const isSettingsLoaded = useSettingsStore((state) => state.isLoaded);
  const apiBaseUrl = useSettingsStore((state) => state.apiBaseUrl);

  const recorder = useAudioRecorder(RecordingPresets.HIGH_QUALITY);
  const recorderState = useAudioRecorderState(recorder, 200);
  const [permissionError, setPermissionError] = useState<string | null>(null);

  const identifyMutation = useMutation({
    mutationFn: async (fileUri: string) => {
      if (!apiBaseUrl) {
        throw new Error("No server configured. Set one up in Settings first.");
      }
      return identify(apiBaseUrl, fileUri, "clip.m4a", "audio/m4a");
    },
  });

  const handleStartRecording = async () => {
    setPermissionError(null);
    let permission = await getRecordingPermissionsAsync();
    if (!permission.granted) {
      permission = await requestRecordingPermissionsAsync();
    }
    if (!permission.granted) {
      setPermissionError(
        "Microphone access is required to record a clip. Enable it in your device settings."
      );
      return;
    }

    await setAudioModeAsync({ allowsRecording: true, playsInSilentMode: true });
    await recorder.prepareToRecordAsync();
    recorder.record();
  };

  const handleStopRecording = async () => {
    await recorder.stop();
    if (recorder.uri) {
      identifyMutation.mutate(recorder.uri);
    }
  };

  const handleReset = () => {
    identifyMutation.reset();
  };

  // Not loaded yet: avoid flashing the "set up a server" prompt before we've
  // actually checked whether one is configured.
  if (!isSettingsLoaded) {
    return (
      <SafeAreaView className="flex-1 items-center justify-center bg-white dark:bg-neutral-950">
        <ActivityIndicator />
      </SafeAreaView>
    );
  }

  if (!apiBaseUrl) {
    return (
      <SafeAreaView className="flex-1 bg-white dark:bg-neutral-950">
        <View className="flex-1 items-center justify-center gap-5 px-8">
          <BrandMark size={64} />
          <Text className="text-center text-3xl font-bold tracking-tight text-neutral-900 dark:text-neutral-50">
            WildEcho
          </Text>
          <Text className="text-center text-base leading-6 text-neutral-500 dark:text-neutral-400">
            Point this app at your wildecho-api server to get started.
          </Text>
          <Link href="/settings" asChild>
            <Pressable className="rounded-full bg-brand-500 px-8 py-4 active:bg-brand-600">
              <Text className="text-base font-semibold text-white">Set up server</Text>
            </Pressable>
          </Link>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-white dark:bg-neutral-950">
      <View className="flex-row items-center justify-between px-6 pt-3">
        <View className="flex-row items-center gap-2.5">
          <BrandMark size={28} />
          <Text className="text-xl font-bold tracking-tight text-neutral-900 dark:text-neutral-50">
            WildEcho
          </Text>
        </View>
        <View className="flex-row gap-5">
          <Link href="/about" asChild>
            <Pressable hitSlop={12}>
              <Text className="text-base font-medium text-brand-500">About</Text>
            </Pressable>
          </Link>
          <Link href="/settings" asChild>
            <Pressable hitSlop={12}>
              <Text className="text-base font-medium text-brand-500">Settings</Text>
            </Pressable>
          </Link>
        </View>
      </View>

      <View className="flex-1 px-6">
        {identifyMutation.isPending ? (
          <IdentifyingView />
        ) : identifyMutation.isError ? (
          <ErrorView
            message={
              identifyMutation.error instanceof Error
                ? identifyMutation.error.message
                : "Something went wrong."
            }
            onRetry={handleReset}
          />
        ) : identifyMutation.isSuccess ? (
          <ResultsView result={identifyMutation.data} onReset={handleReset} />
        ) : (
          <RecordView
            isRecording={recorderState.isRecording}
            durationMillis={recorderState.durationMillis}
            permissionError={permissionError}
            onStart={handleStartRecording}
            onStop={handleStopRecording}
          />
        )}
      </View>
    </SafeAreaView>
  );
}

function RecordView({
  isRecording,
  durationMillis,
  permissionError,
  onStart,
  onStop,
}: {
  isRecording: boolean;
  durationMillis: number;
  permissionError: string | null;
  onStart: () => void;
  onStop: () => void;
}) {
  const seconds = Math.floor(durationMillis / 1000);

  return (
    <View className="flex-1 items-center justify-center">
      <Text className="text-center text-2xl font-bold tracking-tight text-neutral-900 dark:text-neutral-50">
        {isRecording ? "Listening..." : "What's making that sound?"}
      </Text>
      <Text className="mt-2 max-w-[260px] text-center text-base leading-6 text-neutral-500 dark:text-neutral-400">
        {isRecording
          ? `Recording ${seconds}s - tap to stop and identify`
          : "Record a short clip of an animal call and get ranked species matches."}
      </Text>

      {/* Echo rings around the shutter, mirroring the app icon */}
      <View className="mt-12 h-56 w-56 items-center justify-center">
        <View
          className={`absolute h-56 w-56 rounded-full border-2 ${
            isRecording ? "border-red-500/15" : "border-brand-500/15"
          }`}
        />
        <View
          className={`absolute h-44 w-44 rounded-full border-2 ${
            isRecording ? "border-red-500/30" : "border-brand-500/30"
          }`}
        />
        <Pressable
          onPress={isRecording ? onStop : onStart}
          className={`h-32 w-32 items-center justify-center rounded-full shadow-lg ${
            isRecording ? "bg-red-500 active:bg-red-600" : "bg-brand-500 active:bg-brand-600"
          }`}
        >
          {isRecording ? (
            <View className="h-9 w-9 rounded-lg bg-white" />
          ) : (
            <Text className="text-lg font-semibold text-white">Record</Text>
          )}
        </Pressable>
      </View>

      {permissionError ? (
        <Text className="mt-8 text-center text-sm leading-5 text-red-600 dark:text-red-400">
          {permissionError}
        </Text>
      ) : null}
    </View>
  );
}

function IdentifyingView() {
  return (
    <View className="flex-1 items-center justify-center gap-5">
      <ActivityIndicator size="large" />
      <View className="items-center gap-1">
        <Text className="text-lg font-semibold text-neutral-900 dark:text-neutral-50">
          Identifying
        </Text>
        <Text className="text-sm text-neutral-500 dark:text-neutral-400">
          Matching your clip against 14,000+ species
        </Text>
      </View>
    </View>
  );
}

function ErrorView({ message, onRetry }: { message: string; onRetry: () => void }) {
  return (
    <View className="flex-1 items-center justify-center gap-6 px-4">
      <View className="w-full rounded-2xl bg-red-50 p-5 dark:bg-red-950">
        <Text className="mb-1 text-sm font-semibold text-red-900 dark:text-red-100">
          Something went wrong
        </Text>
        <Text className="text-sm leading-5 text-red-700 dark:text-red-300">{message}</Text>
      </View>
      <Pressable onPress={onRetry} className="rounded-full bg-brand-500 px-8 py-4 active:bg-brand-600">
        <Text className="text-base font-semibold text-white">Try again</Text>
      </Pressable>
    </View>
  );
}

function ResultsView({ result, onReset }: { result: IdentifyResponse; onReset: () => void }) {
  const [top, ...rest] = result.predictions;
  const topGroup = top?.taxonomic_group;

  return (
    <View className="flex-1 pt-4">
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {result.non_animal_top_class ? (
          <WarningCard
            text={`The loudest thing in this clip sounded like ${result.non_animal_top_class.replaceAll("_", " ")}, not an animal. The candidates below are likely noise.`}
          />
        ) : result.low_confidence ? (
          <WarningCard text="Low confidence overall - treat these as a weak guess, not an identification." />
        ) : topGroup && topGroup !== "bird" ? (
          // Perch's training data is heavily bird-weighted; non-bird results are
          // less reliable even at a confidence level that would be trustworthy
          // for a bird. See the About screen for the full accuracy disclaimer.
          <WarningCard
            text={`This model is trained mostly on birds - ${topGroup} identifications are less reliable. See About for details.`}
          />
        ) : null}

        {top ? <TopMatchCard prediction={top} /> : null}

        {rest.length > 0 ? (
          <View className="mt-6">
            <Text className="mb-1 text-xs font-semibold uppercase tracking-widest text-neutral-400 dark:text-neutral-500">
              Other candidates
            </Text>
            {rest.map((prediction, index) => (
              <PredictionRow key={prediction.class_index} prediction={prediction} rank={index + 2} />
            ))}
          </View>
        ) : null}

        {!top ? (
          <Text className="text-center text-base text-neutral-500 dark:text-neutral-400">
            No species candidates for this clip.
          </Text>
        ) : null}
      </ScrollView>

      <Pressable
        onPress={onReset}
        className="mb-2 mt-3 items-center rounded-full bg-brand-500 py-4 active:bg-brand-600"
      >
        <Text className="text-base font-semibold text-white">Record again</Text>
      </Pressable>
    </View>
  );
}

function WarningCard({ text }: { text: string }) {
  return (
    <View className="mb-4 rounded-2xl bg-amber-50 p-4 dark:bg-amber-950">
      <Text className="text-sm leading-5 text-amber-800 dark:text-amber-200">{text}</Text>
    </View>
  );
}

function TopMatchCard({ prediction }: { prediction: Prediction }) {
  const percent = Math.round(prediction.confidence * 100);

  return (
    <View className="rounded-3xl bg-brand-50 p-6 dark:bg-brand-950">
      <View className="flex-row items-center justify-between">
        <Text className="text-xs font-semibold uppercase tracking-widest text-brand-600 dark:text-brand-400">
          Best match
        </Text>
        <View className="rounded-full bg-white px-3 py-1 dark:bg-brand-900">
          <Text className="text-xs font-semibold text-brand-600 dark:text-brand-400">
            {GROUP_LABELS[prediction.taxonomic_group]}
          </Text>
        </View>
      </View>

      <Text className="mt-3 text-3xl font-bold tracking-tight text-neutral-900 dark:text-neutral-50">
        {prediction.common_name ?? prediction.scientific_name}
      </Text>
      <Text className="mt-1 text-base italic text-neutral-500 dark:text-neutral-400">
        {prediction.scientific_name}
      </Text>

      <View className="mt-5 flex-row items-center gap-3">
        <View className="h-2 flex-1 overflow-hidden rounded-full bg-white dark:bg-brand-900">
          <View
            className={`h-2 rounded-full ${prediction.low_confidence ? "bg-neutral-400" : "bg-brand-500"}`}
            style={{ width: `${Math.max(percent, 2)}%` }}
          />
        </View>
        <Text
          className={`text-base font-bold ${
            prediction.low_confidence
              ? "text-neutral-400 dark:text-neutral-500"
              : "text-brand-600 dark:text-brand-400"
          }`}
        >
          {percent}%
        </Text>
      </View>
    </View>
  );
}
