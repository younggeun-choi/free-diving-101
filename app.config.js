export default () => {
  const IS_DEV = process.env.APP_VARIANT === 'development';
  const IS_PREVIEW = process.env.APP_VARIANT === 'preview';

  return {
    expo: {
      name: IS_DEV ? 'Free Diving 101 Dev' : IS_PREVIEW ? 'Free Diving 101 Preview' : 'Free Diving 101',
      slug: 'free-diving-101',
      version: '1.0.0',
      orientation: 'portrait',
      icon: './assets/icon.png',
      userInterfaceStyle: 'light',
      splash: {
        image: './assets/splash.png',
        resizeMode: 'contain',
        backgroundColor: '#FFF5E1',
      },
      assetBundlePatterns: ['**/*'],
      ios: {
        supportsTablet: true,
        bundleIdentifier: IS_DEV
          ? 'com.dokahn.freediving101.dev'
          : IS_PREVIEW
          ? 'com.dokahn.freediving101.preview'
          : 'com.dokahn.freediving101',
        config: {
          usesNonExemptEncryption: false,
        },
      },
      android: {
        adaptiveIcon: {
          foregroundImage: './assets/adaptive-icon.png',
          backgroundColor: '#FFF5E1',
        },
        package: IS_DEV
          ? 'com.dokahn.freediving101.dev'
          : IS_PREVIEW
          ? 'com.dokahn.freediving101.preview'
          : 'com.dokahn.freediving101',
      },
      experiments: {
        reactCompiler: true,
      },
      scheme: 'freediving101',
      plugins: ['expo-router', 'expo-asset', 'expo-localization', 'expo-dev-client'],
      extra: {
        router: {},
        eas: {
          projectId: 'a8845bcf-d65a-4abd-9705-6f1a68c9c948',
        },
      },
      owner: 'dokahnworks',
    },
  };
};
