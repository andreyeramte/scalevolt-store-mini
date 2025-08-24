import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import ProductGrid from '../components/ProductGrid'
import Swiper from '../components/Swiper'
import supabaseService from '../services/supabaseService'

function HomeView() {
  const { t } = useTranslation()
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Mini launch: Only 3 products, no extra categories

  const carouselSlides = [
    {
      type: "gif",
      src: "/videos/carousel/Self-Sustaining-Smart-Home.gif",
      title: "Solar Panels",
      description: "Live your life freely with our solar panels"
    },
    {
      type: "gif", 
      src: "/videos/carousel/ev.chargers.gif",
      title: "Charging Stations",
      description: "Fast charging for your electric vehicle"
    },
    {
      type: "gif",
      src: "/videos/carousel/portable.panels.gif", 
      title: "Portable Panels",
      description: "Solar energy wherever you need it"
    }
  ]

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
      {/* Hero Carousel */}
      <section className="relative">
        <Swiper slides={carouselSlides} />
      </section>

      {/* Mini Launch: Only 3 Products */}
      <section className="py-12 md:py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8 md:mb-12">
            <h2 className="text-2xl md:text-4xl font-bold text-gray-900 mb-4">
              {t('home.featuredProducts')}
            </h2>
            <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto px-4">
              {t('home.featuredProductsDesc')}
            </p>
          </div>
          
          <ProductGrid products={products} />
          
          <div className="text-center mt-8">
            <Link 
              to="/products" 
              className="inline-block px-6 md:px-8 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-colors duration-200"
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
