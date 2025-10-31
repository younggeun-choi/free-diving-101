import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import * as Localization from 'expo-localization';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  resources,
  supportedLanguages,
  fallbackLanguage,
  type SupportedLanguage,
} from '@/shared/locales';

const LANGUAGE_STORAGE_KEY = 'user-language';

/**
 * Get the device locale and map it to a supported language
 */
function getDeviceLanguage(): SupportedLanguage {
  const deviceLocale = Localization.getLocales()[0]?.languageCode || 'en';

  // Check if device language is supported
  if (supportedLanguages.includes(deviceLocale as SupportedLanguage)) {
    return deviceLocale as SupportedLanguage;
  }

  return fallbackLanguage;
}

/**
 * Initialize i18next with expo-localization and AsyncStorage persistence
 */
export async function initializeI18n(): Promise<void> {
  try {
    // Try to get saved language from AsyncStorage
    const savedLanguage = await AsyncStorage.getItem(LANGUAGE_STORAGE_KEY);
    const initialLanguage = savedLanguage
      ? (savedLanguage as SupportedLanguage)
      : getDeviceLanguage();

    await i18n
      .use(initReactI18next)
      .init({
        resources,
        lng: initialLanguage,
        fallbackLng: fallbackLanguage,
        compatibilityJSON: 'v4', // Required for i18next v25+
        interpolation: {
          escapeValue: false, // React already escapes values
        },
        react: {
          useSuspense: false, // Disable suspense mode for React Native
        },
      });

    // Save the initial language to AsyncStorage if not already saved
    if (!savedLanguage) {
      await AsyncStorage.setItem(LANGUAGE_STORAGE_KEY, initialLanguage);
    }
  } catch (error) {
    console.error('Failed to initialize i18n:', error);

    // Fallback initialization without saved language
    await i18n
      .use(initReactI18next)
      .init({
        resources,
        lng: fallbackLanguage,
        fallbackLng: fallbackLanguage,
        compatibilityJSON: 'v4',
        interpolation: {
          escapeValue: false,
        },
        react: {
          useSuspense: false,
        },
      });
  }
}

/**
 * Change the app language and persist it to AsyncStorage
 */
export async function changeLanguage(language: SupportedLanguage): Promise<void> {
  try {
    await i18n.changeLanguage(language);
    await AsyncStorage.setItem(LANGUAGE_STORAGE_KEY, language);
  } catch (error) {
    console.error('Failed to change language:', error);
    throw error;
  }
}

/**
 * Get the current language
 */
export function getCurrentLanguage(): SupportedLanguage {
  return (i18n.language || fallbackLanguage) as SupportedLanguage;
}

export { i18n };
