import { Text, View } from "react-native";

import type { Prediction } from "@/lib/api/types";

const GROUP_LABELS: Record<Prediction["taxonomic_group"], string> = {
  bird: "Bird",
  frog: "Frog",
  insect: "Insect",
  mammal: "Mammal",
  other: "Other",
};

export function PredictionRow({ prediction, rank }: { prediction: Prediction; rank: number }) {
  const percent = Math.round(prediction.confidence * 100);

  return (
    <View className="flex-row items-center gap-3 border-b border-neutral-200 py-3 dark:border-neutral-800">
      <Text className="w-6 text-center text-sm text-neutral-400 dark:text-neutral-500">
        {rank}
      </Text>
      <View className="flex-1">
        <Text className="text-base font-semibold text-neutral-900 dark:text-neutral-50">
          {prediction.common_name ?? prediction.scientific_name}
        </Text>
        <Text className="text-sm italic text-neutral-500 dark:text-neutral-400">
          {prediction.scientific_name} · {GROUP_LABELS[prediction.taxonomic_group]}
        </Text>
      </View>
      <Text
        className={
          prediction.low_confidence
            ? "text-sm font-medium text-neutral-400 dark:text-neutral-500"
            : "text-sm font-medium text-emerald-600 dark:text-emerald-400"
        }
      >
        {percent}%
      </Text>
    </View>
  );
}
