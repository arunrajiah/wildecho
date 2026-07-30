const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require("nativewind/metro");

const config = getDefaultConfig(__dirname);

// pnpm's node_modules is a tree of symlinks into a content-addressed store, not
// the flat, copied layout Metro assumes by default. Without these, Metro fails
// to resolve subpath exports reached through a symlink boundary - e.g.
// nativewind's own dependency on react-native-css-interop/jsx-runtime.
config.resolver.unstable_enableSymlinks = true;
config.resolver.unstable_enablePackageExports = true;

module.exports = withNativeWind(config, { input: "./src/global.css" });
