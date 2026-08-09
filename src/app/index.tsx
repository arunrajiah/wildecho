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

import { PredictionRow } from "@/components/prediction-row";
import { identify } from "@/lib/api/client";
import type { IdentifyResponse } from "@/lib/api/types";
import { useSettingsStore } from "@/stores/settings-store";

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
        <View className="flex-1 items-center justify-center gap-4 px-8">
          <Text className="text-center text-2xl font-bold text-neutral-900 dark:text-neutral-50">
            WildEcho
          </Text>
          <Text className="text-center text-base text-neutral-500 dark:text-neutral-400">
            Point this app at your wildecho-api server to get started.
          </Text>
          <Link href="/settings" asChild>
            <Pressable className="rounded-lg bg-blue-600 px-6 py-3">
              <Text className="text-base font-semibold text-white">Set up server</Text>
            </Pressable>
          </Link>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-white dark:bg-neutral-950">
      <View className="flex-row items-center justify-between px-6 pt-2">
        <Text className="text-xl font-bold text-neutral-900 dark:text-neutral-50">WildEcho</Text>
        <View className="flex-row gap-4">
          <Link href="/about" asChild>
            <Pressable hitSlop={12}>
              <Text className="text-base text-blue-600 dark:text-blue-400">About</Text>
            </Pressable>
          </Link>
          <Link href="/settings" asChild>
            <Pressable hitSlop={12}>
              <Text className="text-base text-blue-600 dark:text-blue-400">Settings</Text>
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
    <View className="flex-1 items-center justify-center gap-6">
      <Text className="text-center text-base text-neutral-500 dark:text-neutral-400">
        {isRecording
          ? `Recording... ${seconds}s`
          : "Record a short clip of an animal call to identify it."}
      </Text>

      <Pressable
        onPress={isRecording ? onStop : onStart}
        className={`h-24 w-24 items-center justify-center rounded-full ${
          isRecording ? "bg-red-600" : "bg-blue-600"
        }`}
      >
        <Text className="text-base font-semibold text-white">{isRecording ? "Stop" : "Record"}</Text>
      </Pressable>

      {permissionError ? (
        <Text className="text-center text-sm text-red-600 dark:text-red-400">
          {permissionError}
        </Text>
      ) : null}
    </View>
  );
}

function IdentifyingView() {
  return (
    <View className="flex-1 items-center justify-center gap-4">
      <ActivityIndicator size="large" />
      <Text className="text-base text-neutral-500 dark:text-neutral-400">Identifying...</Text>
    </View>
  );
}

function ErrorView({ message, onRetry }: { message: string; onRetry: () => void }) {
  return (
    <View className="flex-1 items-center justify-center gap-4 px-4">
      <Text className="text-center text-base text-red-600 dark:text-red-400">{message}</Text>
      <Pressable onPress={onRetry} className="rounded-lg bg-blue-600 px-6 py-3">
        <Text className="text-base font-semibold text-white">Try again</Text>
      </Pressable>
    </View>
  );
}

function ResultsView({ result, onReset }: { result: IdentifyResponse; onReset: () => void }) {
  const hasPredictions = result.predictions.length > 0;
  const topGroup = result.predictions[0]?.taxonomic_group;

  return (
    <View className="flex-1 gap-3 pt-4">
      {result.non_animal_top_class ? (
        <View className="rounded-lg bg-amber-50 p-4 dark:bg-amber-950">
          <Text className="text-sm text-amber-800 dark:text-amber-200">
            The loudest thing in this clip sounded like {result.non_animal_top_class.replaceAll("_", " ")},
            not an animal. The candidates below are likely noise.
          </Text>
        </View>
      ) : result.low_confidence ? (
        <View className="rounded-lg bg-amber-50 p-4 dark:bg-amber-950">
          <Text className="text-sm text-amber-800 dark:text-amber-200">
            Low confidence overall - treat these as a weak guess, not an identification.
          </Text>
        </View>
      ) : topGroup && topGroup !== "bird" ? (
        // Perch's training data is heavily bird-weighted; non-bird results are
        // less reliable even at a confidence level that would be trustworthy
        // for a bird. See the About screen for the full accuracy disclaimer.
        <View className="rounded-lg bg-amber-50 p-4 dark:bg-amber-950">
          <Text className="text-sm text-amber-800 dark:text-amber-200">
            This model is trained mostly on birds - {topGroup} identifications are less reliable.
            See About for details.
          </Text>
        </View>
      ) : null}

      {hasPredictions ? (
        <ScrollView className="flex-1">
          {result.predictions.map((prediction, index) => (
            <PredictionRow key={prediction.class_index} prediction={prediction} rank={index + 1} />
          ))}
        </ScrollView>
      ) : (
        <Text className="text-center text-base text-neutral-500 dark:text-neutral-400">
          No species candidates for this clip.
        </Text>
      )}

      <Pressable onPress={onReset} className="items-center rounded-lg bg-blue-600 py-3">
        <Text className="text-base font-semibold text-white">Record again</Text>
      </Pressable>
    </View>
  );
}
