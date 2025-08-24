import React, { useState, useEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { useRegion } from '../contexts/RegionContext.jsx'

function SearchBar({ onSearch, products = [] }) {
  const { t } = useTranslation()
  const { region } = useRegion()
  const navigate = useNavigate()
  const [query, setQuery] = useState('')
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [filteredProducts, setFilteredProducts] = useState([])
  const searchRef = useRef(null)

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSuggestions(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  useEffect(() => {
    if (query.trim() === '') {
      setFilteredProducts([])
      setShowSuggestions(false)
      return
    }

    const filtered = products.filter(product => 
      product.name.toLowerCase().includes(query.toLowerCase()) ||
      product.description?.toLowerCase().includes(query.toLowerCase()) ||
      product.brand?.toLowerCase().includes(query.toLowerCase()) ||
      product.category?.toLowerCase().includes(query.toLowerCase())
    ).slice(0, 5) // Limit to 5 suggestions

    setFilteredProducts(filtered)
    setShowSuggestions(filtered.length > 0)
  }, [query, products])

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!query.trim()) return
    
    // Navigate to products page with search query and region
    const params = new URLSearchParams()
    params.set('search', query.trim())
    if (region) params.set('region', region)
    navigate(`/products?${params.toString()}`)
    setShowSuggestions(false)
    
    // Call onSearch if provided (for backward compatibility)
    if (onSearch) {
      onSearch(query.trim())
    }
  }

  const handleChange = (e) => {
    const value = e.target.value
    setQuery(value)
    
    if (value.trim() === '') {
      setShowSuggestions(false)
    }
  }

  const handleSuggestionClick = (product) => {
    setQuery(product.name)
    // Navigate to products page with the product name as search query and region
    const params = new URLSearchParams()
    params.set('search', product.name)
    if (region) params.set('region', region)
    navigate(`/products?${params.toString()}`)
    setShowSuggestions(false)
  }

  const handleClear = () => {
    setQuery('')
    setShowSuggestions(false)
    // Navigate to products page without search query
    navigate('/products')
    
    if (onSearch) {
      onSearch('')
    }
  }

  const handleViewAllResults = () => {
    if (!query.trim()) return
    
    // Navigate to products page with search query and region
    const params = new URLSearchParams()
    params.set('search', query.trim())
    if (region) params.set('region', region)
    navigate(`/products?${params.toString()}`)
    setShowSuggestions(false)
    
    if (onSearch) {
      onSearch(query.trim())
    }
  }

  return (
    <div className="relative w-full lg:w-96" ref={searchRef}>
      <form onSubmit={handleSubmit} className="relative">
        <input
          type="text"
          value={query}
          onChange={handleChange}
          placeholder={t('search.placeholder')}
          className="w-full px-4 py-3 pl-12 pr-24 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
          onFocus={() => query.trim() && setShowSuggestions(true)}
        />
        
        {/* Search Icon */}
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>

        {/* Clear Button */}
        {query && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute inset-y-0 right-20 flex items-center pr-3 text-gray-400 hover:text-gray-600"
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}

        {/* Search Button */}
        <button
          type="submit"
          className="absolute inset-y-0 right-0 px-4 bg-green-600 text-white rounded-r-lg hover:bg-green-700 transition-colors duration-200 font-medium"
        >
          {t('btn.search')}
        </button>
      </form>

      {/* Search Suggestions */}
      {showSuggestions && filteredProducts.length > 0 && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
          {filteredProducts.map((product) => (
            <button
              key={product.id}
              onClick={() => handleSuggestionClick(product)}
              className="w-full text-left px-4 py-3 hover:bg-gray-50 border-b border-gray-100 last:border-b-0 transition-colors duration-150"
            >
              <div className="flex items-center space-x-3">
                <img
                  src={product.image || '/images/HomeView/solar-panel.png'}
                  alt={product.name}
                  className="w-10 h-10 rounded object-cover"
                  onError={(e) => {
                    e.target.src = '/images/HomeView/solar-panel.png'
                  }}
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {product.name}
                  </p>
                  <p className="text-xs text-gray-500 truncate">
                    {product.category} • ${product.price}
                  </p>
                </div>
              </div>
            </button>
          ))}
          
          {/* View All Results */}
          <div className="px-4 py-2 bg-gray-50 border-t border-gray-200">
            <button
              onClick={handleViewAllResults}
              className="w-full text-center text-sm text-green-600 hover:text-green-700 font-medium"
            >
              View all results for "{query}"
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default SearchBar
