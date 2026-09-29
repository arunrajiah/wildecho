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
    <View className="flex-row items-center gap-3 border-b border-neutral-100 py-3.5 dark:border-neutral-900">
      <Text className="w-6 text-center text-sm font-medium text-neutral-300 dark:text-neutral-600">
        {rank}
      </Text>
      <View className="flex-1">
        <Text className="text-base font-semibold text-neutral-900 dark:text-neutral-50">
          {prediction.common_name ?? prediction.scientific_name}
        </Text>
        <Text className="mt-0.5 text-sm italic text-neutral-500 dark:text-neutral-400">
          {prediction.scientific_name} · {GROUP_LABELS[prediction.taxonomic_group]}
        </Text>
        <View className="mt-2 h-1 w-full overflow-hidden rounded-full bg-neutral-100 dark:bg-neutral-800">
          <View
            className={`h-1 rounded-full ${
              prediction.low_confidence ? "bg-neutral-300 dark:bg-neutral-600" : "bg-emerald-500"
            }`}
            style={{ width: `${Math.max(percent, 1.5)}%` }}
          />
        </View>
      </View>
      <Text
        className={`w-11 text-right text-sm font-semibold ${
          prediction.low_confidence
            ? "text-neutral-400 dark:text-neutral-500"
            : "text-emerald-600 dark:text-emerald-400"
        }`}
      >
        {percent}%
      </Text>
    </View>
  );
}
