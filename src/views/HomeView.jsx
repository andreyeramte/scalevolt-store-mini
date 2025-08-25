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
    description: "Premium Renewable Energy Solutions - Up to 50% Off"
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
      {/* Hero Banner - Promotional Style */}
      <section className="relative bg-gradient-to-r from-green-600 to-green-800">
        <div className="relative h-96 md:h-[500px] overflow-hidden">
          <img 
            src={bannerImage.src} 
            alt={bannerImage.title}
            className="w-full h-full object-cover opacity-20"
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center text-white">
              <div className="bg-red-600 text-white px-6 py-2 rounded-full text-sm font-bold mb-4 inline-block">
                🔥 LIMITED TIME OFFER
              </div>
              <h1 className="text-4xl md:text-6xl font-bold mb-4">
                {bannerImage.title}
              </h1>
              <p className="text-xl md:text-2xl text-white mb-6">
                {bannerImage.description}
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button className="px-8 py-4 bg-white text-green-800 font-bold rounded-lg hover:bg-gray-100 transition-colors text-lg">
                  Shop Now
                </button>
                <button className="px-8 py-4 border-2 border-white text-white font-bold rounded-lg hover:bg-white hover:text-green-800 transition-colors text-lg">
                  Learn More
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Portable Solar Panels Category */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-4">
              Portable Solar Panels
            </h2>
            <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
              High-efficiency portable solar solutions for camping, RVs, and emergency power
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {getProductsByCategory()['portable-solar']?.map((product) => (
              <div key={product.id} className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-all duration-300 group">
                {/* Discount Badge */}
                <div className="relative">
                  <div className="absolute -top-2 -right-2 bg-red-500 text-white px-3 py-1 rounded-full text-xs font-bold z-10">
                    NEW
                  </div>
                  <img 
                    src={product.images[0]} 
                    alt={product.name_en}
                    className="w-full h-48 object-cover rounded-lg mb-4 group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                
                <div className="space-y-3">
                  <h3 className="font-bold text-gray-900 text-lg leading-tight">
                    {product.name_en}
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed line-clamp-2">
                    {product.description_en}
                  </p>
                  
                  {/* Specs */}
                  <div className="flex items-center space-x-4 text-xs text-gray-500">
                    <span>⚡ {product.specs?.power || '100W'}</span>
                    <span>🔋 {product.specs?.voltage || '12V'}</span>
                    <span>⚖️ {product.specs?.weight || '2.5kg'}</span>
                  </div>
                  
                  {/* Pricing */}
                  <div className="flex items-center justify-between pt-2">
                    <div className="flex items-center space-x-2">
                      <span className="text-2xl font-bold text-green-600">
                        €{product.price}
                      </span>
                      <span className="text-sm text-gray-400 line-through">
                        €{(product.price * 1.2).toFixed(2)}
                      </span>
                    </div>
                    <button className="px-6 py-2 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-colors text-sm">
                      Add to Cart
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Portable Power Stations Category */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-4">
              Portable Power Stations
            </h2>
            <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
              Compact and powerful portable power solutions for all your energy needs
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {getProductsByCategory()['portable-power']?.map((product) => (
              <div key={product.id} className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-all duration-300 group">
                {/* Discount Badge */}
                <div className="relative">
                  <div className="absolute -top-2 -right-2 bg-orange-500 text-white px-3 py-1 rounded-full text-xs font-bold z-10">
                    HOT SALE
                  </div>
                  <img 
                    src={product.images[0]} 
                    alt={product.name_en}
                    className="w-full h-48 object-cover rounded-lg mb-4 group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                
                <div className="space-y-3">
                  <h3 className="font-bold text-gray-900 text-lg leading-tight">
                    {product.name_en}
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed line-clamp-2">
                    {product.description_en}
                  </p>
                  
                  {/* Specs */}
                  <div className="flex items-center space-x-4 text-xs text-gray-500">
                    <span>🔋 {product.specs?.capacity || '1000Wh'}</span>
                    <span>⚡ {product.specs?.output_power || '1000W'}</span>
                    <span>🔌 {product.specs?.ports || 'AC, DC, USB'}</span>
                  </div>
                  
                  {/* Pricing */}
                  <div className="flex items-center justify-between pt-2">
                    <div className="flex items-center space-x-2">
                      <span className="text-2xl font-bold text-green-600">
                        €{product.price}
                      </span>
                      <span className="text-sm text-gray-400 line-through">
                        €{(product.price * 1.15).toFixed(2)}
                      </span>
                    </div>
                    <button className="px-6 py-2 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-colors text-sm">
                      Add to Cart
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Home Battery Packs Category */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-4">
              Home Battery Packs
            </h2>
            <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
              Professional home energy storage solutions for sustainable living
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {getProductsByCategory()['home-battery']?.map((product) => (
              <div key={product.id} className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-all duration-300 group">
                {/* Discount Badge */}
                <div className="relative">
                  <div className="absolute -top-2 -right-2 bg-purple-500 text-white px-3 py-1 rounded-full text-xs font-bold z-10">
                    PREMIUM
                  </div>
                  <img 
                    src={product.images[0]} 
                    alt={product.name_en}
                    className="w-full h-48 object-cover rounded-lg mb-4 group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                
                <div className="space-y-3">
                  <h3 className="font-bold text-gray-900 text-lg leading-tight">
                    {product.name_en}
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed line-clamp-2">
                    {product.description_en}
                  </p>
                  
                  {/* Specs */}
                  <div className="flex items-center space-x-4 text-xs text-gray-500">
                    <span>🔋 {product.specs?.capacity || '10kWh'}</span>
                    <span>⚡ {product.specs?.voltage || '48V'}</span>
                    <span>🔄 {product.specs?.cycles || '6000+'}</span>
                  </div>
                  
                  {/* Pricing */}
                  <div className="flex items-center justify-between pt-2">
                    <div className="flex items-center space-x-2">
                      <span className="text-2xl font-bold text-green-600">
                        €{product.price}
                      </span>
                      <span className="text-sm text-gray-400 line-through">
                        €{(product.price * 1.25).toFixed(2)}
                      </span>
                    </div>
                    <button className="px-6 py-2 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-colors text-sm">
                      Add to Cart
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* View All Products Button */}
      <section className="py-20 bg-gradient-to-r from-gray-50 to-gray-100">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              Ready to Go Solar?
            </h2>
            <p className="text-lg text-gray-600 mb-8">
              Discover our complete range of renewable energy solutions and start your sustainable journey today.
            </p>
            <Link 
              to="/products" 
              className="inline-block px-10 py-4 bg-green-600 text-white font-bold rounded-xl hover:bg-green-700 transition-all duration-300 text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            >
              {t('home.viewAllProducts')}
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}

export default HomeView
