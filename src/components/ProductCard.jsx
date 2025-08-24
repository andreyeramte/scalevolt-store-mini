import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useCart } from '../contexts/CartContext.jsx'
import InstallationModal from './InstallationModal'

function ProductCard({ product }) {
  const { t, i18n } = useTranslation()
  const { addToCart } = useCart()
  const [showInstallationModal, setShowInstallationModal] = useState(false)
  
  // Get the current language
  const currentLang = i18n.language

  const handleAddToCart = () => {
    addToCart(product)
    // You can add a toast notification here
    alert('Product added to cart!')
  }

  return (
    <>
      <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 group">
        {/* Product Image */}
        <div className="relative h-40 sm:h-48 overflow-hidden">
          <Link to={`/products/${product.id}`}>
            <img
              src={product.images?.[0] || '/images/HomeView/solar-panel.png'}
              alt={product[`name_${currentLang}`] || product.name_en || product.name}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              onError={(e) => {
                e.target.src = '/images/HomeView/solar-panel.png'
              }}
            />
          </Link>
          
          {/* Stock Badge */}
          <div className="absolute top-2 right-2 sm:top-3 sm:right-3">
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
              product.in_stock 
                ? 'bg-green-100 text-green-800' 
                : 'bg-red-100 text-red-800'
            }`}>
              {product.in_stock ? t('product.inStock') : t('product.outOfStock')}
            </span>
          </div>
        </div>

        {/* Product Content */}
        <div className="p-4 sm:p-6">
          {/* Product Info */}
          <div className="mb-3 sm:mb-4">
            <Link to={`/products/${product.id}`}>
              <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2 group-hover:text-green-600 transition-colors duration-200 line-clamp-2">
                {product[`name_${currentLang}`] || product.name_en || product.name}
              </h3>
            </Link>
            
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-2">
              <span className="text-xl sm:text-2xl font-bold text-green-600">
                ${product.price}
              </span>
              {product.brand && (
                <span className="text-xs sm:text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded self-start">
                  {product.brand}
                </span>
              )}
            </div>
            
            {product.category && (
              <div className="flex items-center space-x-2 text-xs sm:text-sm text-gray-600 mb-3">
                <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                </svg>
                <span className="truncate">{product.category}</span>
              </div>
            )}
            
            {product[`description_${currentLang}`] && (
              <p className="text-gray-600 text-xs sm:text-sm line-clamp-2 mb-3 sm:mb-4">
                {product[`description_${currentLang}`]}
              </p>
            )}
          </div>

          {/* Action Buttons */}
          <div className="space-y-2 sm:space-y-3">
            {/* Add to Cart Button */}
            <button
              onClick={handleAddToCart}
              disabled={!product.in_stock}
              className="w-full bg-green-600 text-white py-2.5 sm:py-3 px-3 sm:px-4 rounded-lg font-semibold hover:bg-green-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
            >
              {product.in_stock ? t('product.addToCart') : t('product.outOfStock')}
            </button>
            
            {/* Order Installation Button */}
            <button
              onClick={() => setShowInstallationModal(true)}
              className="w-full border-2 border-green-600 text-green-600 py-2.5 sm:py-3 px-3 sm:px-4 rounded-lg font-semibold hover:bg-green-50 transition-colors duration-200 text-sm sm:text-base"
            >
              {t('btn.orderInstallation')}
            </button>
          </div>
        </div>
      </div>

      {/* Installation Modal */}
      <InstallationModal
        isOpen={showInstallationModal}
        onClose={() => setShowInstallationModal(false)}
        productName={product.name}
      />
    </>
  )
}

export default ProductCard
