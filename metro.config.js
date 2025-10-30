const { getDefaultConfig } = require('expo/metro-config');
const { withNativeWind } = require('nativewind/metro');

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

// Add inlineRem for React Native Reusables
config.resolver = {
  ...config.resolver,
  unstable_enablePackageExports: true,
};

module.exports = withNativeWind(config, {
  input: './global.css',
  inlineRem: 16,
});
