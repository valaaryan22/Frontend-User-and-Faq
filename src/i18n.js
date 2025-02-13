// src/i18n.js

import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import enTranslation from './locales/en.json';
import frTranslation from './locales/fr.json';
import esTranslation from './locales/es.json';

i18n
  .use(initReactI18next) // Pass i18n to react-i18next.
  .init({
    resources: {
      en: { translation: enTranslation },
      fr: { translation: frTranslation },
      es: { translation: esTranslation },
    },
    lng: 'en', // Default language
    fallbackLng: 'en', // If the selected language is not available, fallback to English
    interpolation: {
      escapeValue: false, // React already does escaping
    },
  });

export default i18n;
