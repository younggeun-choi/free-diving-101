import en from './en.json';
import ko from './ko.json';

export const resources = {
  en: {
    translation: en,
  },
  ko: {
    translation: ko,
  },
} as const;

export type SupportedLanguage = keyof typeof resources;
export const supportedLanguages: SupportedLanguage[] = ['en', 'ko'];
export const fallbackLanguage: SupportedLanguage = 'en';
