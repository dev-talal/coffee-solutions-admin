import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import en from './en.data.json';
import ar from './ar.data.json';

type Language = 'en' | 'ar';

const storedLanguage = (window.localStorage.getItem('i18nextLng') as Language | null) || 'en';

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      ar: { translation: ar },
      en: { translation: en },
    },
    lng: storedLanguage,
    fallbackLng: storedLanguage,
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'],
      lookupLocalStorage: 'i18nextLng',
    },
    interpolation: {
      escapeValue: false,
    },
    react: {
      useSuspense: false,
    },
  });

if (storedLanguage) {
  i18n.changeLanguage(storedLanguage);
}

i18n.on('languageChanged', (lng: Language) => {
  setHtmlAttributes(lng);
});

function setHtmlAttributes(language: Language) {
  document.documentElement.lang = storedLanguage;
  document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
}

export default i18n;
