import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

const categories = [
  { 
    id: 'solar-panels', 
    name: 'Сонячні Панелі', 
    image: '/images/HomeView/solar-farm.png',
    description: 'Високоефективні сонячні панелі'
  },
  { 
    id: 'batteries', 
    name: 'Батареї', 
    image: '/images/HomeView/solar-battery.png',
    description: 'Літієві та свинцеві акумулятори'
  },
  { 
    id: 'inverters', 
    name: 'Інвертори', 
    image: '/images/HomeView/інвертер.png',
    description: 'Інвертори для сонячних систем'
  },
  { 
    id: 'ev-chargers', 
    name: 'Зарядні Станції', 
    image: '/images/HomeView/ev-charger-city.png',
    description: 'Зарядні пристрої для електромобілів'
  },
  { 
    id: 'generators', 
    name: 'Генератори', 
    image: '/images/HomeView/генератори.png',
    description: 'Сонячні та дизельні генератори'
  },
  { 
    id: 'cables', 
    name: 'Кабелі та Дроти', 
    image: '/images/HomeView/Electrical-cables-and-wires.jpg',
    description: 'Електричні кабелі та дроти'
  }
]

function DropdownMenu({ open, onClose }) {
  const { t } = useTranslation()
  const navigate = useNavigate()
  
  if (!open) return null

  return (
    <div className="absolute z-50 mt-2 w-[800px] left-1/2 transform -translate-x-1/2">
      <div className="bg-white rounded-2xl shadow-2xl ring-1 ring-black ring-opacity-5 overflow-hidden">
        {/* Header */}
        <div className="bg-green-600 text-white px-6 py-4">
          <h3 className="text-lg font-semibold">{t('header.categories')}</h3>
          <p className="text-green-100 text-sm">{t('header.categoriesDesc')}</p>
        </div>
        
        {/* Categories Grid */}
        <div className="p-6">
          <div className="grid grid-cols-2 gap-4">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => { 
                  onClose?.(); 
                  navigate(`/products?category=${cat.id}`) 
                }}
                className="group flex items-start space-x-3 p-3 rounded-xl hover:bg-gray-50 transition-all duration-200 text-left"
              >
                <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
                  <img
                    src={cat.image}
                    alt={cat.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-200"
                    onError={(e) => {
                      e.target.src = '/images/HomeView/solar-panel.png'
                    }}
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-gray-900 group-hover:text-green-600 transition-colors duration-200">
                    {cat.name}
                  </h4>
                  <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                    {cat.description}
                  </p>
                </div>
                <div className="w-5 h-5 text-gray-400 group-hover:text-green-600 transition-colors duration-200">
                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </button>
            ))}
          </div>
          
          {/* Footer */}
          <div className="mt-6 pt-4 border-t border-gray-200">
            <Link 
              to="/products" 
              onClick={onClose} 
              className="flex items-center justify-center space-x-2 w-full px-6 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors duration-200 font-medium"
            >
              <span>{t('header.viewAllProducts')}</span>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DropdownMenu
