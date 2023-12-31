import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import en from './locales/en/common.json'
import de from './locales/de/common.json'
import bg from './locales/bg/common.json'
import ar from './locales/ar/common.json'
import es from './locales/es/common.json'
import fr from './locales/fr/common.json'
import ru from './locales/ru/common.json'

i18n.use(initReactI18next).init({
  resources: {
    en: {
      translation: en
    },
    de: {
      translation: de
    },
    bg: {
      translation: bg
    },
    ar: {
      translation: ar
    },
    es: {
      translation: es
    },
    fr: {
      translation: fr
    },
    ru: {
      translation: ru
    }
  },
  fallbackLng: 'en',
  interpolation: {
    escapeValue: false
  }
})

export default i18n
