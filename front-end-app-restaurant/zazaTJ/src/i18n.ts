import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import Backend from 'i18next-http-backend';
import LanguageDetector from 'i18next-browser-languagedetector';

i18n
  .use(Backend) // загружает JSON файлы
  .use(LanguageDetector) // определяет язык браузера
  .use(initReactI18next)
  .init({
    fallbackLng: 'ru',
    supportedLngs: ['ru', 'tj'],
    debug: true,
    interpolation: { escapeValue: false },
    backend: {
      loadPath: '/locales/{{lng}}/translation.json', // путь к JSON
    },
    react: {
      useSuspense: false, // чтобы избежать ошибок до загрузки перевода
    },
  });

export default i18n;