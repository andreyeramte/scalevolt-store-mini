import React from 'react'
import { useTranslation } from 'react-i18next'
import { useRegion } from '../contexts/RegionContext.jsx'

const languages = [
  { code: 'en', label: 'EN' },
  { code: 'ua', label: 'UA' },
  { code: 'pl', label: 'PL' },
]

function LanguageSelector() {
  const { i18n } = useTranslation()
  const { lang, setLang, region } = useRegion()

  const changeLanguage = async (lng) => {
    try {
      // Update both i18n and region context
      i18n.changeLanguage(lng)
      await setLang(lng)
    } catch (error) {
      console.error('Failed to change language:', error)
      // Fallback to just changing i18n
      i18n.changeLanguage(lng)
    }
  }

  React.useEffect(() => {
    // Sync i18n with region context language
    if (lang && i18n.language !== lang) {
      i18n.changeLanguage(lang)
    }
  }, [lang, i18n])

  return (
    <div className="flex items-center gap-2">
      {languages.map((lng) => (
        <button
          key={lng.code}
          onClick={() => changeLanguage(lng.code)}
          className={`px-2 py-1 rounded text-sm font-medium ${
            lang === lng.code
              ? 'bg-green-600 text-white'
              : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
          }`}
        >
          {lng.label}
        </button>
      ))}
    </div>
  )
}

export default LanguageSelector
