import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import pt from './pt/common.json'
import en from './en/common.json'

const savedLang = localStorage.getItem('lang') || 'pt'

i18n.use(initReactI18next).init({
  resources: {
    pt: { translation: pt },
    en: { translation: en },
  },
  lng: savedLang, // 👈 usa idioma guardado
  fallbackLng: 'pt',
  interpolation: { escapeValue: false },
})

export default i18n
