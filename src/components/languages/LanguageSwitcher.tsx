import { useTranslation } from '@/lib/i18next'

export function LanguageSwitcher() {
  const { i18n } = useTranslation()

  const changeLanguage = (lng: 'pt' | 'en') => {
    i18n.changeLanguage(lng)
    localStorage.setItem('lang', lng)
  }

  return (
    <div className="flex gap-2">
      <button
        onClick={() => changeLanguage('pt')}
        className={i18n.language === 'pt' ? 'font-bold underline' : ''}
      >
        🇵🇹 PT
      </button>
      <button
        onClick={() => changeLanguage('en')}
        className={i18n.language === 'en' ? 'font-bold underline' : ''}
      >
        🇬🇧 EN
      </button>
    </div>
  )
}
