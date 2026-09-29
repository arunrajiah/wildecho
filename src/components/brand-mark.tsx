import { Image } from "react-native";

const ASPECT = 256 / 141;

/** The WildEcho mark (singing bird with echo arcs), matching the app icon. */
export function BrandMark({ size = 28 }: { size?: number }) {
  const height = size * 0.8;
  return (
    <Image
      source={require("../../assets/images/brand-mark.png")}
      style={{ height, width: height * ASPECT }}
      resizeMode="contain"
      accessibilityIgnoresInvertColors
    />
  );
}
