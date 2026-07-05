import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import en from '@/i18n/locales/en.json';
import fr from '@/i18n/locales/fr.json';

export const LANGUAGE_STORAGE_KEY = 'language';
export const supportedLanguages = ['en', 'fr'] as const;
export type SupportedLanguage = (typeof supportedLanguages)[number];

const storedLanguage = localStorage.getItem(LANGUAGE_STORAGE_KEY);
const initialLanguage: SupportedLanguage =
  storedLanguage && (supportedLanguages as readonly string[]).includes(storedLanguage)
    ? (storedLanguage as SupportedLanguage)
    : 'en';

i18n.use(initReactI18next).init({
  resources: {
    en: { translation: en },
    fr: { translation: fr },
  },
  lng: initialLanguage,
  fallbackLng: 'en',
  interpolation: {
    escapeValue: false,
  },
});

export const setLanguage = (language: SupportedLanguage): void => {
  localStorage.setItem(LANGUAGE_STORAGE_KEY, language);
  i18n.changeLanguage(language);
};

export default i18n;
