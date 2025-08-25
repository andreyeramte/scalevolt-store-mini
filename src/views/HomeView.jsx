import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import supabaseService from '../services/supabaseService'

function HomeView() {
  const { t } = useTranslation()
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Mini launch: Only 3 products, organized by category

  const bannerImage = {
    src: "/videos/carousel/Self-Sustaining-Smart-Home.gif",
    title: "ScaleVolt Store",
    description: "Premium Renewable Energy Solutions"
  }

  // Organize products by category
  const getProductsByCategory = () => {
    const categories = {
      'portable-solar': products.filter(p => p.category === 'portable-solar'),
      'portable-power': products.filter(p => p.category === 'portable-power'),
      'home-battery': products.filter(p => p.category === 'home-battery')
    }
    return categories
  }

  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    try {
      setLoading(true)
      // Fetch only the 3 mini products from Supabase
      const data = await supabaseService.getMiniProducts()
      setProducts(data)
    } catch (err) {
      setError(err.message)
      console.error('Error fetching products:', err)
    } finally {
      setLoading(false)
    }
  }



  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-2xl font-semibold text-gray-600">Loading ScaleVolt Store...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-red-600 text-center">
          <div className="text-2xl font-semibold mb-2">Error loading products</div>
          <div className="text-lg">{error}</div>
          <button 
            onClick={fetchProducts}
            className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Try Again
          </button>
        </div>
      </div>
    )
  }

  return (
    <div>
      {/* Hero Banner - Single Image */}
      <section className="relative bg-gray-900">
        <div className="relative h-96 md:h-[500px] overflow-hidden">
          <img 
            src={bannerImage.src} 
            alt={bannerImage.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
            <div className="text-center text-white">
              <h1 className="text-4xl md:text-6xl font-bold mb-4">
                {bannerImage.title}
              </h1>
              <p className="text-xl md:text-2xl text-gray-200">
                {bannerImage.description}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Portable Solar Panels Category */}
      <section className="py-12 md:py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8 md:mb-12">
            <h2 className="text-2xl md:text-4xl font-bold text-gray-900 mb-4">
              Portable Solar Panels
            </h2>
            <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto px-4">
              High-efficiency portable solar solutions for camping, RVs, and emergency power
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-4xl mx-auto">
            {getProductsByCategory()['portable-solar']?.map((product) => (
              <div key={product.id} className="bg-white rounded-lg shadow-md border border-gray-200 p-4 hover:shadow-lg transition-shadow duration-200">
                <img 
                  src={product.images[0]} 
                  alt={product.name_en}
                  className="w-full h-32 object-cover rounded-lg mb-3"
                />
                <h3 className="font-semibold text-gray-900 mb-2 text-sm">
                  {product.name_en}
                </h3>
                <p className="text-gray-600 text-xs mb-3 line-clamp-2">
                  {product.description_en}
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-lg font-bold text-green-600">
                    €{product.price}
                  </span>
                  <button className="px-3 py-1 bg-green-600 text-white text-xs rounded hover:bg-green-700 transition-colors">
                    View Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Portable Power Stations Category */}
      <section className="py-12 md:py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8 md:mb-12">
            <h2 className="text-2xl md:text-4xl font-bold text-gray-900 mb-4">
              Portable Power Stations
            </h2>
            <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto px-4">
              Compact and powerful portable power solutions for all your energy needs
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-4xl mx-auto">
            {getProductsByCategory()['portable-power']?.map((product) => (
              <div key={product.id} className="bg-white rounded-lg shadow-md border border-gray-200 p-4 hover:shadow-lg transition-shadow duration-200">
                <img 
                  src={product.images[0]} 
                  alt={product.name_en}
                  className="w-full h-32 object-cover rounded-lg mb-3"
                />
                <h3 className="font-semibold text-gray-900 mb-2 text-sm">
                  {product.name_en}
                </h3>
                <p className="text-gray-600 text-xs mb-3 line-clamp-2">
                  {product.description_en}
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-lg font-bold text-green-600">
                    €{product.price}
                  </span>
                  <button className="px-3 py-1 bg-green-600 text-white text-xs rounded hover:bg-green-700 transition-colors">
                    View Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Home Battery Packs Category */}
      <section className="py-12 md:py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8 md:mb-12">
            <h2 className="text-2xl md:text-4xl font-bold text-gray-900 mb-4">
              Home Battery Packs
            </h2>
            <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto px-4">
              Professional home energy storage solutions for sustainable living
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-4xl mx-auto">
            {getProductsByCategory()['home-battery']?.map((product) => (
              <div key={product.id} className="bg-white rounded-lg shadow-md border border-gray-200 p-4 hover:shadow-lg transition-shadow duration-200">
                <img 
                  src={product.images[0]} 
                  alt={product.name_en}
                  className="w-full h-32 object-cover rounded-lg mb-3"
                />
                <h3 className="font-semibold text-gray-900 mb-2 text-sm">
                  {product.name_en}
                </h3>
                <p className="text-gray-600 text-xs mb-3 line-clamp-2">
                  {product.description_en}
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-lg font-bold text-green-600">
                    €{product.price}
                  </span>
                  <button className="px-3 py-1 bg-green-600 text-white text-xs rounded hover:bg-green-700 transition-colors">
                    View Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* View All Products Button */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4 text-center">
          <Link 
            to="/products" 
            className="inline-block px-8 py-4 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-colors duration-200 text-lg"
          >
            {t('home.viewAllProducts')}
          </Link>
        </div>
      </section>
    </div>
  )
}

export default HomeView
