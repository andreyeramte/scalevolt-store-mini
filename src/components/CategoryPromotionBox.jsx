import React from 'react'
import { useTranslation } from 'react-i18next'

function CategoryPromotionBox({ category, onCategoryClick }) {
  const { t } = useTranslation()
  
  if (!category) return null

  return (
    <div 
      className="group bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 cursor-pointer"
      onClick={onCategoryClick}
    >
      {/* Image Container */}
      <div className="relative h-48 overflow-hidden">
        <img
          src={category.image}
          alt={category.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          onError={(e) => {
            // Fallback to a default image if the category image fails to load
            e.target.src = '/images/HomeView/solar-panel.png'
          }}
        />
        
        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        {/* Category Badge */}
        <div className="absolute top-4 left-4">
          <span className="bg-green-600 text-white px-3 py-1 rounded-full text-sm font-medium">
            {t('home.category')}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-green-600 transition-colors duration-200">
          {category.name}
        </h3>
        
        <p className="text-gray-600 mb-4 line-clamp-2">
          Відкрийте світ {category.name.toLowerCase()} з нашими інноваційними рішеннями
        </p>

        {/* Action Button */}
        <div className="flex items-center justify-between">
          <button className="text-green-600 font-semibold hover:text-green-700 transition-colors duration-200 group-hover:underline">
            {t('home.viewProducts')}
          </button>
          
          <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center group-hover:bg-green-600 transition-colors duration-200">
            <svg 
              className="w-4 h-4 text-green-600 group-hover:text-white transition-colors duration-200" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </div>
      </div>

      {/* Hover Effect Border */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-green-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
    </div>
  )
}

export default CategoryPromotionBox
