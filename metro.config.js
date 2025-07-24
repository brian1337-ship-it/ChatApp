const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require("nativewind/metro");

const config = getDefaultConfig(__dirname, {
  // Ensure TypeScript and other extensions are supported
  resolver: {
    sourceExts: ["tsx", "ts", "jsx", "js", "cjs", "json"],
  },
});

module.exports = withNativeWind(config, { input: "./global.css" });
