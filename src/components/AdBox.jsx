import React from 'react'
import { useTranslation } from 'react-i18next'

function AdBox({ ad }) {
  const { t } = useTranslation()
  
  if (!ad || !ad.attributes) return null

  const getAdContentUrl = (ad) => {
    return ad.attributes.contentUrl?.data?.attributes?.url || ''
  }

  const goToAdLink = () => {
    if (ad.attributes.link) {
      window.open(ad.attributes.link, '_blank')
    }
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
        {/* Image Section */}
        <div className="relative h-64 lg:h-auto">
          <img
            src={getAdContentUrl(ad)}
            alt={ad.attributes.title}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.src = '/images/HomeView/adBox/solar-farm.JPG'
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/20 to-transparent" />
        </div>

        {/* Content Section */}
        <div className="p-8 lg:p-12 flex flex-col justify-center">
          <div className="mb-6">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              {ad.attributes.title}
            </h2>
            <p className="text-lg text-gray-600 leading-relaxed">
              {ad.attributes.description}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={goToAdLink}
              className="px-8 py-4 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-colors duration-200 text-center"
            >
              {t('btn.knowMore')}
            </button>
            <button
              onClick={goToAdLink}
              className="px-8 py-4 border-2 border-green-600 text-green-600 font-semibold rounded-lg hover:bg-green-50 transition-colors duration-200 text-center"
            >
              {t('btn.view')}
            </button>
          </div>

          {/* Additional Info */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <div className="flex items-center justify-between text-sm text-gray-500">
              <span>{t('home.promotionValid')}</span>
              <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs font-medium">
                {t('home.promotion')}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdBox
