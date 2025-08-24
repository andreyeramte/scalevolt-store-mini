import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import en from './locales/en.json'
import ua from './locales/ua.json'
import pl from './locales/pl.json'

const resources = {
  en: { translation: en },
  ua: { translation: ua },
  pl: { translation: pl },
}

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'en',
    fallbackLng: 'en',
    interpolation: { escapeValue: false },
    keySeparator: false,
  })

export default i18n
